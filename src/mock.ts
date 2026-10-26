import { API_VERSION } from "./core.js";
import { MOCK_ROUTES } from "./mock-routes.gen.js";

/**
 * A mock of the API for working offline and for your tests (`npx fiscalisto mock`): every route
 * answers the shape the API documents, from the reference's examples. What you create is kept in
 * memory while it runs: create a customer and you can read it, list it, change it and delete it;
 * repeating a POST with the same Idempotency-Key answers the same. It doesn't check SAT rules nor
 * stamp anything: for that use your fk_test_ key against the API (test mode is free).
 *
 *   const mock = createMock();
 *   const fiscalisto = new Fiscalisto("fk_test_mock", { fetch: (url, init) => mock.fetch(new Request(url, init)) });
 */

type Obj = Record<string, unknown>;

interface Route {
	method: string;
	path: string;
	pattern: RegExp;
	status: number;
	type: string;
	example: unknown;
	/** The collection its objects live in (/v1/customers), when it's one of its CRUD routes. */
	collection: string | null;
	kind: "create" | "list" | "get" | "update" | "delete" | "action";
}

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const random = (n: number) =>
	Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHABET[b % 62]).join("");
const isObj = (v: unknown): v is Obj => v !== null && typeof v === "object" && !Array.isArray(v);
const clone = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

function buildRoutes(): Route[] {
	const paths = new Set(MOCK_ROUTES.map(([m, p]) => `${m} ${p}`));
	return MOCK_ROUTES.map(([method, path, status, type, example]) => {
		const pattern = new RegExp(`^${path.replace(/\{[a-z_]+\}/g, "([^/]+)")}$`);
		const item = /^(.*)\/\{id\}$/.exec(path)?.[1];
		const collection = item ?? (paths.has(`GET ${path}/{id}`) ? path : null);
		const kind: Route["kind"] = item
			? method === "GET"
				? "get"
				: method === "DELETE"
					? "delete"
					: "update"
			: collection
				? method === "GET"
					? "list"
					: "create"
				: "action";
		return { method, path, pattern, status, type, example, collection, kind };
	});
}

/** `example` with what `body` sets, where the types agree (an id where the example has an object stays the example's). */
function merge(example: unknown, body: unknown): unknown {
	if (body === undefined) return clone(example);
	if (isObj(example) && isObj(body)) {
		const out: Obj = clone(example);
		for (const [k, v] of Object.entries(body)) if (k in example) out[k] = merge(example[k], v);
		return out;
	}
	if (example === null || typeof example === typeof body) return clone(body);
	return clone(example);
}

const nowIso = () => {
	// Mexico City time, as the API writes them.
	const d = new Date(Date.now() - 6 * 3600_000);
	return `${d.toISOString().slice(0, 19)}-06:00`;
};

export interface Mock {
	/** Answers a request as the API would (shape-wise). */
	fetch(request: Request): Promise<Response>;
	/** Forgets everything created. */
	reset(): void;
}

export function createMock(): Mock {
	const routes = buildRoutes();
	const store = new Map<string, Map<string, Obj>>();
	const replays = new Map<string, { fingerprint: string; status: number; body: string }>();
	const items = (collection: string) => {
		let m = store.get(collection);
		if (!m) {
			m = new Map();
			store.set(collection, m);
		}
		return m;
	};

	const error = (status: number, type: string, code: string, message: string, param?: string) =>
		json(status, {
			error: {
				type,
				code,
				message,
				...(param ? { param } : {}),
				doc_url: `https://fiscalisto.com/docs/api/errores#${code}`,
				request_id: `req_mock${random(12)}`,
			},
		});
	const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
		new Response(JSON.stringify(body), {
			status,
			headers: {
				"content-type": "application/json; charset=utf-8",
				"request-id": `req_mock${random(12)}`,
				"fiscalisto-version": API_VERSION,
				"fiscalisto-mock": "true",
				...headers,
			},
		});
	const missing = (id: string) =>
		error(
			404,
			"not_found_error",
			"resource_missing",
			`No existe un objeto con el id ${id}.`,
			"id",
		);

	async function answer(request: Request, route: Route, params: string[], body: Obj) {
		const url = new URL(request.url);
		const id = params[0] ?? "";
		const stored = route.collection ? items(route.collection) : null;
		const example = route.example;
		switch (route.kind) {
			case "create": {
				const obj = merge(example, body) as Obj;
				const prefix =
					isObj(example) && typeof example.id === "string"
						? example.id.split("_")[0]
						: "obj";
				obj.id = `${prefix}_${random(14)}`;
				if ("livemode" in obj) obj.livemode = false;
				if ("created_at" in obj) obj.created_at = nowIso();
				if ("updated_at" in obj) obj.updated_at = nowIso();
				if (isObj(body.metadata)) obj.metadata = body.metadata;
				stored?.set(obj.id as string, obj);
				return json(route.status, obj);
			}
			case "list": {
				const all = [...(stored?.values() ?? [])].reverse();
				const limit = Math.min(
					Math.max(Number(url.searchParams.get("limit") ?? 10) || 10, 1),
					100,
				);
				const after = url.searchParams.get("starting_after");
				const from = after ? all.findIndex((o) => o.id === after) + 1 : 0;
				const page = all.slice(from, from + limit);
				return json(200, {
					object: "list",
					url: url.pathname,
					has_more: from + limit < all.length,
					data: page,
				});
			}
			case "get": {
				const obj = stored?.get(id);
				return obj ? json(200, obj) : missing(id);
			}
			case "update": {
				const obj = stored?.get(id);
				if (!obj) return missing(id);
				const next = merge(obj, body) as Obj;
				if ("updated_at" in next) next.updated_at = nowIso();
				if (isObj(body.metadata)) next.metadata = body.metadata;
				stored?.set(id, next);
				return json(route.status, next);
			}
			case "delete": {
				const obj = stored?.get(id);
				if (!obj) return missing(id);
				stored?.delete(id);
				return json(route.status, { id, object: obj.object, deleted: true });
			}
			default: {
				if (route.type !== "application/json") {
					const content =
						route.type === "application/pdf"
							? "%PDF-1.4\n% Fiscalisto mock\n%%EOF\n"
							: route.type === "application/xml"
								? '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Fiscalisto mock -->\n<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0"/>\n'
								: "Fiscalisto mock\n";
					return new Response(content, {
						status: route.status,
						headers: { "content-type": route.type, "fiscalisto-mock": "true" },
					});
				}
				// An action on an object kept here (cancel, send, run…): the answer is that object
				// with what the example says changed, when it's the same kind of object.
				const parent = /^\/v1\/([a-z_]+)\/\{id\}\//.test(route.path)
					? store.get(`/v1/${route.path.split("/")[2]}`)?.get(id)
					: undefined;
				if (parent && isObj(example) && example.object === parent.object) {
					const next: Obj = { ...parent };
					for (const [k, v] of Object.entries(example))
						if (!(k in next)) next[k] = clone(v);
					if (typeof example.status === "string") next.status = example.status;
					store.get(`/v1/${route.path.split("/")[2]}`)?.set(id, next);
					return json(route.status, next);
				}
				return json(
					route.status,
					merge(example, route.method === "POST" ? body : undefined),
				);
			}
		}
	}

	return {
		reset() {
			store.clear();
			replays.clear();
		},
		async fetch(request) {
			const url = new URL(request.url);
			const path = url.pathname.replace(/\/+$/, "") || "/";
			const auth = request.headers.get("authorization") ?? "";
			const matches = routes.filter((r) => r.pattern.test(path));
			const route = matches.find((r) => r.method === request.method);
			if (!matches.length)
				return error(
					404,
					"invalid_request_error",
					"route_not_found",
					`No existe ${request.method} ${path}.`,
				);
			if (!route)
				return error(
					405,
					"invalid_request_error",
					"method_not_allowed",
					`${path} acepta ${matches.map((r) => r.method).join(", ")}.`,
				);
			if (!auth.startsWith("Bearer "))
				return error(
					401,
					"authentication_error",
					"missing_api_key",
					"Falta el encabezado Authorization: Bearer fk_test_….",
				);
			if (!auth.startsWith("Bearer fk_test_"))
				return error(
					401,
					"authentication_error",
					"invalid_api_key",
					"El servidor de prueba solo acepta llaves fk_test_ (cualquiera, como fk_test_mock).",
				);
			let body: Obj = {};
			const text = request.method === "POST" ? await request.text() : "";
			if (text.trim()) {
				try {
					const parsed = JSON.parse(text);
					if (!isObj(parsed)) throw new Error();
					body = parsed;
				} catch {
					return error(
						400,
						"invalid_request_error",
						"invalid_json",
						"El cuerpo no es un objeto JSON válido.",
					);
				}
			}
			const key = request.method === "POST" ? request.headers.get("idempotency-key") : null;
			// As the API: the same JSON written another way (spaces, key order) is the same request.
			const sorted = (v: unknown): unknown =>
				Array.isArray(v)
					? v.map(sorted)
					: isObj(v)
						? Object.fromEntries(
								Object.keys(v)
									.sort()
									.map((k) => [k, sorted(v[k])]),
							)
						: v;
			const query = new URLSearchParams(url.search);
			query.sort();
			const fingerprint = `${request.method} ${path}?${query} ${JSON.stringify(sorted(body))}`;
			if (key) {
				const seen = replays.get(key);
				if (seen && seen.fingerprint !== fingerprint)
					return error(
						409,
						"idempotency_error",
						"idempotency_key_reused",
						"Esa Idempotency-Key ya se usó con otra solicitud.",
					);
				if (seen)
					return new Response(seen.body, {
						status: seen.status,
						headers: {
							"content-type": "application/json; charset=utf-8",
							"idempotent-replayed": "true",
							"fiscalisto-mock": "true",
						},
					});
			}
			const params = route.pattern.exec(path)?.slice(1).map(decodeURIComponent) ?? [];
			const response = await answer(request, route, params, body);
			if (key && response.headers.get("content-type")?.includes("json")) {
				const copy = await response.clone().text();
				replays.set(key, { fingerprint, status: response.status, body: copy });
			}
			return response;
		},
	};
}
