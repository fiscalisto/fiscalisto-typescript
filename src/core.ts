/**
 * Lo que hace cada llamada del SDK: la llave, la Idempotency-Key, los reintentos seguros, los
 * errores y las listas que se recorren solas. Los recursos (generated.ts) solo dicen qué ruta
 * llamar.
 */

import type { ErrorCode } from "./error-codes.js";

export const VERSION = "0.1.5";
/**
 * La versión de la API para la que se hizo este SDK: la manda en cada solicitud
 * (Fiscalisto-Version), así actualizar la API no cambia lo que recibe hasta que actualice el SDK.
 */
export const API_VERSION = "2026-10-24";
const DEFAULT_BASE_URL = "https://api.fiscalisto.com";

/** Lo que el SDK necesita de fetch. */
export type Fetch = (url: URL, init: RequestInit) => Promise<Response>;

export interface FiscalistoOptions {
	/** La raíz de la API. Por omisión https://api.fiscalisto.com. */
	baseUrl?: string;
	/** Cuántas veces reintentar lo que es seguro repetir. Por omisión 2. */
	maxRetries?: number;
	/** Cuánto esperar cada respuesta, en milisegundos. Por omisión 80,000 (el PAC puede tardar). */
	timeout?: number;
	/** Otro fetch (pruebas, proxies). Por omisión el global. */
	fetch?: Fetch;
	/**
	 * La versión de la API (Fiscalisto-Version). Por omisión la del SDK (API_VERSION); null manda
	 * ninguna, así se usa la de su cuenta.
	 */
	apiVersion?: string | null;
	/** "en": los mensajes de error en inglés (Accept-Language). Por omisión en español. */
	language?: "es" | "en";
}

export interface RequestOptions {
	/**
	 * La Idempotency-Key de lo que timbra. Si no la pasa, el SDK crea una por llamada y la repite
	 * en sus reintentos. Pase la suya (su número de pedido) para que repetir la llamada tampoco
	 * timbre dos veces, aunque su proceso se reinicie.
	 */
	idempotencyKey?: string;
	timeout?: number;
	maxRetries?: number;
	signal?: AbortSignal;
	/**
	 * Campos con el id de otro objeto que llegan como ese objeto, en la misma respuesta:
	 * `{ expand: ["issuer", "recurring_invoice.last_invoice"] }`. Ver /docs/api/expandir.
	 */
	expand?: string[];
}

export interface RequestSpec {
	method: string;
	path: string;
	body?: unknown;
	query?: object;
	idempotent?: boolean;
	as?: "json" | "bytes" | "text";
}

/** Una página de una lista. */
export interface Page<T> {
	object: "list";
	data: T[];
	has_more: boolean;
	url: string;
}

export interface Client {
	request<T>(spec: RequestSpec, options?: RequestOptions): Promise<T>;
	list<T extends { id: string }>(
		spec: { path: string; query?: object },
		options?: RequestOptions,
	): List<T>;
}

export type ErrorType =
	| "invalid_request_error"
	| "authentication_error"
	| "permission_error"
	| "not_found_error"
	| "idempotency_error"
	| "rate_limit_error"
	| "invoice_error"
	| "balance_error"
	| "api_error"
	| "connection_error";

/**
 * Un error de la API (o de la conexión, con type connection_error). code es estable: decida
 * con él; message es para mostrarlo a una persona.
 */
export class FiscalistoError extends Error {
	override readonly name = "FiscalistoError";
	readonly type: ErrorType;
	/** Compárelo con ErrorCode: error.code === ErrorCode.InvoiceRejected. */
	readonly code: ErrorCode | (string & {});
	/** El campo que hay que corregir (items.0.unit_price). */
	readonly param?: string;
	/** El código del SAT o del PAC cuando ellos lo rechazaron (CFDI40145). */
	readonly satCode?: string;
	/** El comprobante rechazado (inv_…), cuando lo hay. */
	readonly invoice?: string;
	readonly docUrl?: string;
	/** Búsquelo en Desarrolladores › Solicitudes o mándelo a soporte. */
	readonly requestId?: string;
	/** El código HTTP (sin él, la solicitud no llegó). */
	readonly status?: number;
	/** El objeto error tal como llegó. */
	readonly raw: Record<string, unknown>;

	constructor(raw: Record<string, unknown>, status?: number, requestId?: string) {
		super(String(raw.message ?? "Error de la API de Fiscalisto"));
		const text = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : undefined);
		this.raw = raw;
		this.type = (text("type") ?? "api_error") as ErrorType;
		this.code = text("code") ?? "unknown";
		this.param = text("param");
		this.satCode = text("sat_code");
		this.invoice = text("invoice");
		this.docUrl = text("doc_url");
		this.requestId = text("request_id") ?? requestId;
		this.status = status;
	}
}

/**
 * Una lista: `await` le da la primera página; `for await` recorre todos los objetos, página
 * por página.
 */
export class List<T extends { id: string }> implements PromiseLike<Page<T>>, AsyncIterable<T> {
	readonly #page: (startingAfter?: string) => Promise<Page<T>>;
	#first?: Promise<Page<T>>;

	constructor(page: (startingAfter?: string) => Promise<Page<T>>) {
		this.#page = page;
	}

	#firstPage() {
		this.#first ??= this.#page();
		return this.#first;
	}

	// biome-ignore lint/suspicious/noThenProperty: a List is awaited for its first page
	then<A = Page<T>, B = never>(
		onfulfilled?: ((page: Page<T>) => A | PromiseLike<A>) | null,
		onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
	): Promise<A | B> {
		return this.#firstPage().then(onfulfilled, onrejected);
	}

	async *[Symbol.asyncIterator](): AsyncIterator<T> {
		let page = await this.#firstPage();
		while (true) {
			yield* page.data;
			const last = page.data.at(-1);
			if (!page.has_more || !last) return;
			page = await this.#page(last.id);
		}
	}

	/** Todos los objetos en un arreglo, hasta `max` (por omisión 10,000). */
	async toArray(max = 10_000): Promise<T[]> {
		const all: T[] = [];
		for await (const item of this) {
			if (all.length >= max) break;
			all.push(item);
		}
		return all;
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 0.5 s, 1 s, 2 s… hasta 8 s, con algo de azar para no llegar todos juntos. */
const backoff = (attempt: number) =>
	Math.min(8000, 500 * 2 ** attempt) * (0.75 + Math.random() / 2);

/** A success that isn't the API's JSON: a proxy's or a network portal's page answered instead. */
const invalidResponse = (status: number, text: string, requestId?: string) =>
	new FiscalistoError(
		{
			type: "api_error",
			code: "invalid_response",
			message: `La respuesta (${status}) no es de la API: ${text.replace(/\s+/g, " ").trim().slice(0, 80) || "vacía"}. ¿Hay un proxy o un portal de por medio?`,
		},
		status,
		requestId,
	);

export class Core implements Client {
	readonly #key: string;
	readonly #baseUrl: string;
	readonly #maxRetries: number;
	readonly #timeout: number;
	readonly #fetch: Fetch;
	readonly #apiVersion: string | null;
	readonly #language: string | undefined;

	constructor(apiKey?: string, options: FiscalistoOptions = {}) {
		const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
			.process?.env;
		const key = apiKey ?? env?.FISCALISTO_API_KEY;
		if (!key)
			throw new Error(
				'Falta la llave de la API: new Fiscalisto("fk_test_…") o la variable FISCALISTO_API_KEY. Créela en Desarrolladores › Llaves.',
			);
		if (!/^fk_(live|test)_/.test(key))
			throw new Error(
				"La llave de la API empieza con fk_live_ o fk_test_. (Un secreto whsec_ es para verificar webhooks.)",
			);
		this.#key = key;
		// A proxy's path stays: https://proxy.example.com/fiscalisto + /v1/invoices.
		this.#baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
		this.#maxRetries = options.maxRetries ?? 2;
		this.#timeout = options.timeout ?? 80_000;
		this.#fetch = options.fetch ?? ((url, init) => fetch(url, init));
		this.#apiVersion = options.apiVersion === undefined ? API_VERSION : options.apiVersion;
		this.#language = options.language;
	}

	/** true con una llave fk_live_ (producción), false con fk_test_ (pruebas). */
	get livemode() {
		return this.#key.startsWith("fk_live_");
	}

	async request<T>(spec: RequestSpec, options: RequestOptions = {}): Promise<T> {
		const url = new URL(this.#baseUrl + spec.path);
		for (const [k, v] of Object.entries(spec.query ?? {}))
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		for (const e of options.expand ?? []) url.searchParams.append("expand[]", e);
		const headers: Record<string, string> = {
			authorization: `Bearer ${this.#key}`,
			"user-agent": `fiscalisto-node/${VERSION}`,
		};
		if (this.#apiVersion) headers["fiscalisto-version"] = this.#apiVersion;
		if (this.#language) headers["accept-language"] = this.#language;
		const idempotencyKey = spec.idempotent
			? (options.idempotencyKey ?? crypto.randomUUID())
			: undefined;
		if (idempotencyKey) headers["idempotency-key"] = idempotencyKey;
		let body: string | undefined;
		if (spec.method === "POST") {
			headers["content-type"] = "application/json";
			body = JSON.stringify(spec.body ?? {});
		}
		// Only what can't do something twice is repeated after a failure we can't see through:
		// reads, deletes and requests with an Idempotency-Key. A 429 was never processed.
		const safe = spec.method === "GET" || spec.method === "DELETE" || !!idempotencyKey;
		const retries = options.maxRetries ?? this.#maxRetries;
		const timeout = options.timeout ?? this.#timeout;

		for (let attempt = 0; ; attempt++) {
			const timer = AbortSignal.timeout(timeout);
			const signal = options.signal ? AbortSignal.any([options.signal, timer]) : timer;
			let response: Response;
			try {
				response = await this.#fetch(url, { method: spec.method, headers, body, signal });
			} catch (error) {
				if (options.signal?.aborted) throw error;
				if (safe && attempt < retries) {
					await sleep(backoff(attempt));
					continue;
				}
				const timedOut = timer.aborted;
				throw new FiscalistoError({
					type: "connection_error",
					code: timedOut ? "timeout" : "connection_failed",
					message: timedOut
						? `La API no contestó en ${timeout / 1000} s.${idempotencyKey ? ` Repita con la misma Idempotency-Key (${idempotencyKey}) para saber si se timbró.` : ""}`
						: `No se pudo conectar con la API: ${error instanceof Error ? error.message : String(error)}`,
					idempotency_key: idempotencyKey,
				});
			}
			const requestId = response.headers.get("request-id") ?? undefined;
			if (response.ok) {
				if (spec.as === "bytes") return new Uint8Array(await response.arrayBuffer()) as T;
				if (spec.as === "text") return (await response.text()) as T;
				const text = await response.text();
				try {
					return JSON.parse(text) as T;
				} catch {
					throw invalidResponse(response.status, text, requestId);
				}
			}
			const raw = await response
				.json()
				.then((j) => (j as { error?: Record<string, unknown> }).error ?? {})
				.catch(() => ({}) as Record<string, unknown>);
			const retryAfter = Number(response.headers.get("retry-after"));
			const retryable =
				response.status === 429 ||
				raw.code === "request_in_progress" ||
				(safe && response.status >= 500);
			if (retryable && attempt < retries && !(retryAfter > 60)) {
				await sleep(retryAfter > 0 ? retryAfter * 1000 : backoff(attempt));
				continue;
			}
			throw new FiscalistoError(raw, response.status, requestId);
		}
	}

	list<T extends { id: string }>(
		spec: { path: string; query?: object },
		options?: RequestOptions,
	): List<T> {
		return new List<T>((startingAfter) =>
			this.request<Page<T>>(
				{
					method: "GET",
					path: spec.path,
					query: startingAfter
						? { ...spec.query, starting_after: startingAfter }
						: spec.query,
				},
				options,
			),
		);
	}
}
