#!/usr/bin/env node
/**
 * El CLI de Fiscalisto: `npx fiscalisto`. Inicia sesión por el navegador, deja el SDK y su llave
 * listos en su proyecto (`init`), timbra, cancela y descarga facturas, reenvía los webhooks de
 * pruebas a su computadora (`listen`) y llama cualquier ruta de la API (`api`). Con `--json`
 * cada comando contesta JSON, para scripts y agentes. Sin dependencias: Node 20 o más.
 *
 * @see https://fiscalisto.com/docs/api/cli
 */
import { spawn, spawnSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { appendFile, chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, hostname } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { FiscalistoError, VERSION } from "./core.js";
import { Fiscalisto } from "./index.js";

// ── Salida ─────────────────────────────────────────────────────────────────

const env = process.env;
const color = process.stdout.isTTY && !env.NO_COLOR;
const paint = (code: number) => (s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = paint(1);
const dim = paint(2);
const red = paint(31);
const green = paint(32);
const yellow = paint(33);
const cyan = paint(36);

/** A usage mistake: exit code 2, with the hint to fix it. */
class UsageError extends Error {}

let json = false;

function print(value: unknown, human?: () => void) {
	if (json || !human) process.stdout.write(`${JSON.stringify(value, null, json ? 0 : 2)}\n`);
	else human();
}

const line = (s = "") => process.stdout.write(`${s}\n`);
const note = (s: string) => process.stderr.write(`${s}\n`);
const money = (n: unknown, currency = "MXN") =>
	typeof n === "number"
		? `${n.toLocaleString("es-MX", { style: "currency", currency: currency === "XXX" ? "MXN" : currency })}${currency !== "MXN" ? ` ${currency}` : ""}`
		: "";

// ── Configuración ──────────────────────────────────────────────────────────

interface Config {
	account?: { id: string; name: string };
	test_key?: string;
	live_key?: string;
}

const configPath = () =>
	join(env.XDG_CONFIG_HOME || join(homedir(), ".config"), "fiscalisto", "config.json");

async function loadConfig(): Promise<Config> {
	try {
		return JSON.parse(await readFile(configPath(), "utf8")) as Config;
	} catch {
		return {};
	}
}

async function saveConfig(config: Config) {
	const path = configPath();
	await mkdir(dirname(path), { recursive: true, mode: 0o700 });
	await writeFile(path, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
	await chmod(path, 0o600).catch(() => {});
}

const API_URL = () => env.FISCALISTO_BASE_URL || "https://api.fiscalisto.com";
const APP_URL = () => env.FISCALISTO_APP_URL || "https://fiscalisto.com";
const redact = (key: string) => `${key.slice(0, 12)}…${key.slice(-4)}`;

interface Globals {
	live: boolean;
	apiKey?: string;
	yes: boolean;
}

/** The key to use: --api-key, FISCALISTO_API_KEY, or the one `login` saved for the mode. */
async function keyFor(g: Globals) {
	if (g.apiKey) return g.apiKey;
	if (env.FISCALISTO_API_KEY) return env.FISCALISTO_API_KEY;
	const config = await loadConfig();
	const key = g.live ? config.live_key : config.test_key;
	if (key) return key;
	throw new UsageError(
		g.live
			? "No tiene llave de producción guardada. Corra `fiscalisto login --live` o pase --api-key fk_live_…."
			: "No ha iniciado sesión. Corra `fiscalisto login` (o pase --api-key / FISCALISTO_API_KEY).",
	);
}

async function client(g: Globals) {
	return new Fiscalisto(await keyFor(g), { baseUrl: API_URL() });
}

/** What stamps for real asks first, unless --yes. */
async function confirmLive(api: Fiscalisto, g: Globals, what: string) {
	if (!api.livemode || g.yes) return;
	if (!process.stdin.isTTY)
		throw new UsageError(
			`${what} con una llave de producción es real ante el SAT: agregue --yes.`,
		);
	if (!(await ask(`${what} con su llave de PRODUCCIÓN (real ante el SAT). ¿Continuar? [s/N] `)))
		throw new UsageError("Cancelado.");
}

async function ask(question: string) {
	const rl = createInterface({ input: process.stdin, output: process.stderr });
	const answer = (await rl.question(question)).trim().toLowerCase();
	rl.close();
	return (
		answer === "s" || answer === "si" || answer === "sí" || answer === "y" || answer === "yes"
	);
}

function openBrowser(url: string) {
	const [cmd, args] =
		process.platform === "darwin"
			? ["open", [url]]
			: process.platform === "win32"
				? ["cmd", ["/c", "start", "", url]]
				: ["xdg-open", [url]];
	try {
		spawn(cmd as string, args as string[], { stdio: "ignore", detached: true })
			.on("error", () => {})
			.unref();
	} catch {}
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** --data '{…}', --data @archivo.json or --data - (stdin). */
async function readData(raw: string | undefined): Promise<unknown> {
	if (raw === undefined) return undefined;
	let text = raw;
	if (raw === "-") {
		const chunks: Buffer[] = [];
		for await (const c of process.stdin) chunks.push(c as Buffer);
		text = Buffer.concat(chunks).toString("utf8");
	} else if (raw.startsWith("@")) text = await readFile(raw.slice(1), "utf8");
	try {
		return JSON.parse(text);
	} catch {
		throw new UsageError("--data no es JSON válido.");
	}
}

// ── login ──────────────────────────────────────────────────────────────────

async function login(args: string[], g: Globals) {
	const { values } = parseArgs({
		args,
		options: { key: { type: "string" }, "no-browser": { type: "boolean" } },
	});
	if (values.key) {
		const key = values.key.trim();
		const api = new Fiscalisto(key, { baseUrl: API_URL() });
		const account = await api.request<{ id: string; name: string }>({
			method: "GET",
			path: "/v1/account",
		});
		const config = await loadConfig();
		const live = key.startsWith("fk_live_");
		await saveConfig({
			...config,
			account: { id: account.id, name: account.name },
			...(live ? { live_key: key } : { test_key: key }),
		});
		return print({ account, mode: live ? "live" : "test" }, () =>
			line(
				`${green("✓")} Llave guardada para ${bold(account.name)} (${live ? "producción" : "pruebas"}).`,
			),
		);
	}
	const started = await fetch(`${APP_URL()}/api/cli/login`, {
		method: "POST",
		headers: { "content-type": "application/json", "user-agent": `fiscalisto-cli/${VERSION}` },
		body: JSON.stringify({ client: hostname(), live: g.live }),
	});
	if (!started.ok)
		throw new Error(`No se pudo iniciar sesión (${started.status}). Intente otra vez.`);
	const s = (await started.json()) as {
		device_code: string;
		user_code: string;
		verification_url: string;
		verification_url_complete: string;
		expires_in: number;
		interval: number;
	};
	if (json)
		line(
			JSON.stringify({
				status: "pending",
				user_code: s.user_code,
				verification_url: s.verification_url_complete,
			}),
		);
	else {
		note(`Su código: ${bold(cyan(s.user_code))}`);
		note(`Autorícelo en ${s.verification_url_complete}`);
	}
	if (!values["no-browser"] && !json && process.stdout.isTTY) {
		note(dim("Abriendo el navegador…"));
		openBrowser(s.verification_url_complete);
	}
	const until = Date.now() + s.expires_in * 1000;
	while (Date.now() < until) {
		await sleep(s.interval * 1000);
		const r = await fetch(`${APP_URL()}/api/cli/login/token`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ device_code: s.device_code }),
		}).catch(() => null);
		if (!r) continue;
		const body = (await r.json().catch(() => ({}))) as {
			status: string;
			account?: { id: string; name: string };
			test_key?: string;
			live_key?: string | null;
		};
		if (body.status === "pending" || body.status === "slow_down" || r.status >= 500) {
			if (body.status === "slow_down") await sleep(10_000);
			continue;
		}
		if (body.status !== "approved" || !body.account || !body.test_key)
			throw new Error(
				body.status === "denied"
					? "No se autorizó el inicio de sesión."
					: "El código venció. Corra `fiscalisto login` otra vez.",
			);
		const config = await loadConfig();
		await saveConfig({
			account: body.account,
			test_key: body.test_key,
			live_key:
				body.live_key ??
				(config.account?.id === body.account.id ? config.live_key : undefined),
		});
		return print(
			{
				status: "approved",
				account: body.account,
				test_key: redact(body.test_key),
				live_key: body.live_key ? redact(body.live_key) : null,
				config: configPath(),
			},
			() => {
				line(`${green("✓")} Sesión iniciada en ${bold(body.account?.name ?? "")}.`);
				line(
					`  Llave de pruebas ${dim(redact(body.test_key ?? ""))}${body.live_key ? ` y de producción ${dim(redact(body.live_key))}` : ""}, en ${dim(configPath())}.`,
				);
				line(
					`  Siga con ${cyan("fiscalisto init")} en su proyecto, o timbre ya: ${cyan("fiscalisto invoices create --example")}`,
				);
			},
		);
	}
	throw new Error("El código venció. Corra `fiscalisto login` otra vez.");
}

async function logout() {
	await rm(configPath(), { force: true });
	print({ ok: true }, () =>
		line(
			`${green("✓")} Sesión cerrada en esta computadora. Las llaves siguen activas: revóquelas en ${APP_URL()}/desarrolladores/llaves si ya no las usa.`,
		),
	);
}

// ── whoami ─────────────────────────────────────────────────────────────────

async function whoami(g: Globals) {
	const api = await client(g);
	const [account, balance, issuers] = await Promise.all([
		api.request<{ id: string; name: string; key: { id: string; name: string | null } }>({
			method: "GET",
			path: "/v1/account",
		}),
		api.request<{ available: number; unlimited: boolean }>({
			method: "GET",
			path: "/v1/balance",
		}),
		api.request<{
			data: { id: string; tax_id: string; legal_name: string | null; status: string }[];
		}>({
			method: "GET",
			path: "/v1/issuers",
		}),
	]);
	print({ account, mode: api.livemode ? "live" : "test", balance, issuers: issuers.data }, () => {
		line(`${bold(account.name)} ${dim(account.id)}`);
		line(
			`Modo: ${api.livemode ? yellow("producción") : green("pruebas")} · llave ${account.key.name ?? account.key.id}`,
		);
		line(
			`Timbres: ${balance.unlimited ? "sin límite" : balance.available.toLocaleString("es-MX")}${api.livemode ? "" : dim(" (en pruebas no se usan)")}`,
		);
		line(
			`Emisores: ${issuers.data.map((i) => `${i.tax_id}${i.status !== "active" ? dim(` (${i.status})`) : ""}`).join(", ") || dim("ninguno")}`,
		);
	});
}

// ── init ───────────────────────────────────────────────────────────────────

type Lang = "node" | "python" | "php";

function detectLang(dir: string): Lang | null {
	if (existsSync(join(dir, "package.json"))) return "node";
	if (
		["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"].some((f) =>
			existsSync(join(dir, f)),
		)
	)
		return "python";
	if (existsSync(join(dir, "composer.json"))) return "php";
	return null;
}

function installCommand(lang: Lang, dir: string): string[] {
	if (lang === "python") {
		if (existsSync(join(dir, "uv.lock"))) return ["uv", "add", "fiscalisto"];
		if (existsSync(join(dir, "poetry.lock"))) return ["poetry", "add", "fiscalisto"];
		return ["pip", "install", "fiscalisto"];
	}
	if (lang === "php") return ["composer", "require", "fiscalisto/fiscalisto"];
	if (existsSync(join(dir, "bun.lock")) || existsSync(join(dir, "bun.lockb")))
		return ["bun", "add", "fiscalisto"];
	if (existsSync(join(dir, "pnpm-lock.yaml"))) return ["pnpm", "add", "fiscalisto"];
	if (existsSync(join(dir, "yarn.lock"))) return ["yarn", "add", "fiscalisto"];
	return ["npm", "install", "fiscalisto"];
}

const EXAMPLE_INVOICE = {
	customer: {
		tax_id: "ICV060329BY0",
		legal_name: "INMOBILIARIA CVA",
		tax_system: "601",
		zip: "33826",
	},
	payment_form: "03",
	items: [{ description: "Consultoría", product_key: "80101500", unit_price: 1000 }],
};

const EXAMPLES: Record<Lang, { file: string; code: string; run: string }> = {
	node: {
		file: "fiscalisto-ejemplo.mjs",
		run: "node --env-file=.env fiscalisto-ejemplo.mjs",
		code: `// Timbra una factura de prueba con el SDK de Fiscalisto: node --env-file=.env fiscalisto-ejemplo.mjs
import { Fiscalisto } from "fiscalisto";

const fiscalisto = new Fiscalisto(process.env.FISCALISTO_API_KEY);

const factura = await fiscalisto.invoices.create(
  {
    customer: { tax_id: "ICV060329BY0", legal_name: "INMOBILIARIA CVA", tax_system: "601", zip: "33826" },
    payment_form: "03",
    items: [{ description: "Consultoría", product_key: "80101500", unit_price: 1000 }],
  },
  { idempotencyKey: \`pedido-\${Date.now()}\` }, // use el id de su pedido: nunca se timbra dos veces
);

console.log(factura.status, factura.uuid, factura.total);
`,
	},
	python: {
		file: "fiscalisto_ejemplo.py",
		run: "python fiscalisto_ejemplo.py",
		code: `"""Timbra una factura de prueba con el SDK de Fiscalisto: python fiscalisto_ejemplo.py"""
import os
import time

from fiscalisto import Fiscalisto

for line in open(".env", encoding="utf-8"):
    name, _, value = line.strip().partition("=")
    if name and not name.startswith("#"):
        os.environ.setdefault(name, value)

fiscalisto = Fiscalisto(os.environ["FISCALISTO_API_KEY"])

factura = fiscalisto.invoices.create(
    {
        "customer": {"tax_id": "ICV060329BY0", "legal_name": "INMOBILIARIA CVA", "tax_system": "601", "zip": "33826"},
        "payment_form": "03",
        "items": [{"description": "Consultoría", "product_key": "80101500", "unit_price": 1000}],
    },
    idempotency_key=f"pedido-{int(time.time())}",  # use el id de su pedido: nunca se timbra dos veces
)

print(factura["status"], factura["uuid"], factura["total"])
`,
	},
	php: {
		file: "fiscalisto-ejemplo.php",
		run: "php fiscalisto-ejemplo.php",
		code: `<?php
// Timbra una factura de prueba con el SDK de Fiscalisto: php fiscalisto-ejemplo.php
require __DIR__ . '/vendor/autoload.php';

foreach (file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    [$name, $value] = array_pad(explode('=', $line, 2), 2, '');
    if ($name !== '' && $name[0] !== '#' && getenv($name) === false) putenv("$name=$value");
}

$fiscalisto = new Fiscalisto\\Fiscalisto(getenv('FISCALISTO_API_KEY'));

$factura = $fiscalisto->invoices->create([
    'customer' => ['tax_id' => 'ICV060329BY0', 'legal_name' => 'INMOBILIARIA CVA', 'tax_system' => '601', 'zip' => '33826'],
    'payment_form' => '03',
    'items' => [['description' => 'Consultoría', 'product_key' => '80101500', 'unit_price' => 1000]],
], idempotencyKey: 'pedido-' . time()); // use el id de su pedido: nunca se timbra dos veces

echo $factura['status'], ' ', $factura['uuid'], ' ', $factura['total'], PHP_EOL;
`,
	},
};

const AGENTS_SECTION = `
## Facturación (Fiscalisto)

Facturas electrónicas (CFDI 4.0) con la API de Fiscalisto. La llave está en \`FISCALISTO_API_KEY\`
(\`.env\`; \`fk_test_\` timbra en pruebas sin costo). Documentación completa para agentes:
https://fiscalisto.com/llms.txt y la referencia en https://api.fiscalisto.com/v1/openapi.json.

- Use el SDK \`fiscalisto\` (npm, PyPI, Packagist). Cada timbrado lleva una Idempotency-Key
  (el id del pedido): repetirla nunca timbra dos veces.
- El cliente va con su RFC, nombre, régimen y código postal exactamente como en su constancia.
- Para probar rechazos del SAT use los RFC de prueba (NOM010101FK9 y otros, ver "Pruebas y producción").
- El CLI hace todo desde la terminal: \`npx fiscalisto --help\` (\`--json\` para leerlo).
`;

async function init(args: string[], g: Globals) {
	const { values } = parseArgs({
		args,
		options: {
			lang: { type: "string" },
			dir: { type: "string" },
			"no-install": { type: "boolean" },
			agents: { type: "boolean" },
		},
	});
	const dir = resolve(values.dir ?? ".");
	const lang = (values.lang as Lang | undefined) ?? detectLang(dir);
	if (lang && !EXAMPLES[lang]) throw new UsageError("--lang es node, python o php.");
	if (!lang)
		throw new UsageError(
			"No encontré package.json, pyproject.toml/requirements.txt ni composer.json aquí. Indique --lang node|python|php.",
		);
	if (!env.FISCALISTO_API_KEY && !g.apiKey && !(await loadConfig()).test_key) await login([], g);
	const key = g.apiKey ?? env.FISCALISTO_API_KEY ?? (await loadConfig()).test_key ?? "";
	const done: string[] = [];

	// .env with the key, and .env out of git.
	const envFile = join(dir, ".env");
	const current = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
	if (!/^FISCALISTO_API_KEY=/m.test(current)) {
		await appendFile(
			envFile,
			`${current && !current.endsWith("\n") ? "\n" : ""}FISCALISTO_API_KEY=${key}\n`,
		);
		done.push(
			`.env: FISCALISTO_API_KEY (${key.startsWith("fk_live_") ? "producción" : "pruebas"})`,
		);
	}
	const gitignore = join(dir, ".gitignore");
	const ignored = existsSync(gitignore) ? readFileSync(gitignore, "utf8") : "";
	if (!/^\/?\.env$/m.test(ignored)) {
		await appendFile(gitignore, `${ignored && !ignored.endsWith("\n") ? "\n" : ""}.env\n`);
		done.push(".gitignore: .env");
	}

	// The SDK.
	const install = installCommand(lang, dir);
	let installed = false;
	if (!values["no-install"]) {
		const go =
			g.yes || !process.stdin.isTTY || json
				? true
				: await ask(`Instalar el SDK con «${install.join(" ")}»? [S/n] `).then((y) => y);
		if (go) {
			const r = spawnSync(install[0] as string, install.slice(1), {
				cwd: dir,
				stdio: json ? "ignore" : "inherit",
				shell: process.platform === "win32",
			});
			installed = r.status === 0;
			done.push(
				installed
					? `SDK: ${install.join(" ")}`
					: `SDK: falló «${install.join(" ")}», córralo usted`,
			);
		}
	}

	// An example that stamps.
	const example = EXAMPLES[lang];
	const examplePath = join(dir, example.file);
	if (!existsSync(examplePath)) {
		await writeFile(examplePath, example.code);
		done.push(`${example.file}: timbra una factura de prueba`);
	}

	if (values.agents) {
		const agentsPath = join(
			dir,
			existsSync(join(dir, "CLAUDE.md")) && !existsSync(join(dir, "AGENTS.md"))
				? "CLAUDE.md"
				: "AGENTS.md",
		);
		const text = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : "";
		if (!text.includes("## Facturación (Fiscalisto)")) {
			await appendFile(agentsPath, AGENTS_SECTION);
			done.push(`${agentsPath.slice(dir.length + 1)}: cómo facturar, para su agente`);
		}
	}

	print({ lang, dir, done, run: example.run }, () => {
		line(`${green("✓")} Listo para facturar (${lang}):`);
		for (const d of done) line(`  · ${d}`);
		line();
		line(`Pruébelo: ${cyan(example.run)}`);
		line(
			dim(
				"Webhooks en su computadora: fiscalisto listen --forward-to http://localhost:3000/webhooks",
			),
		);
	});
}

// ── invoices ───────────────────────────────────────────────────────────────

interface Invoice {
	id: string;
	status: string;
	uuid: string | null;
	series: string | null;
	folio: string | null;
	type: string;
	total: number;
	currency: string;
	customer: { tax_id: string; legal_name: string | null };
	created_at: string | null;
	error: { message: string; sat_code: string | null } | null;
	cancellation: { status: string | null } | null;
}

const STATUS: Record<string, (s: string) => string> = {
	valid: green,
	pending: yellow,
	processing: yellow,
	rejected: red,
	canceled: dim,
};

function showInvoice(i: Invoice) {
	line(
		`${bold(`${i.series ?? ""}${i.folio ?? ""}` || i.id)} ${(STATUS[i.status] ?? String)(i.status)} ${money(i.total, i.currency)}`,
	);
	line(`  ${i.customer.legal_name ?? ""} ${dim(i.customer.tax_id)}`);
	if (i.uuid) line(`  UUID ${i.uuid}`);
	line(`  ${dim(i.id)}`);
	if (i.error)
		line(`  ${red(i.error.message)}${i.error.sat_code ? dim(` (${i.error.sat_code})`) : ""}`);
}

/** --item "Descripción|clave|precio[|cantidad]", repeatable. */
function parseItem(raw: string) {
	const [description, product_key, price, quantity] = raw.split("|").map((s) => s.trim());
	const unit_price = Number(price);
	if (!description || !product_key || !Number.isFinite(unit_price))
		throw new UsageError(`--item "${raw}": use "Descripción|clave del SAT|precio[|cantidad]".`);
	return {
		description,
		product_key,
		unit_price,
		...(quantity ? { quantity: Number(quantity) } : {}),
	};
}

async function invoices(args: string[], g: Globals) {
	const [sub, ...rest] = args;
	const api = await client(g);
	switch (sub) {
		case "create": {
			const { values } = parseArgs({
				args: rest,
				options: {
					data: { type: "string" },
					example: { type: "boolean" },
					customer: { type: "string" },
					name: { type: "string" },
					regime: { type: "string" },
					zip: { type: "string" },
					item: { type: "string", multiple: true },
					"payment-form": { type: "string" },
					"payment-method": { type: "string" },
					use: { type: "string" },
					issuer: { type: "string" },
					"idempotency-key": { type: "string" },
					email: { type: "string" },
				},
			});
			let body = (await readData(values.data)) as Record<string, unknown> | undefined;
			if (!body && values.example) body = structuredClone(EXAMPLE_INVOICE);
			if (!body) {
				if (!values.customer || !values.item?.length)
					throw new UsageError(
						'Pase --data (JSON, @archivo o -), --example, o --customer RFC --name "NOMBRE" --regime 601 --zip 12345 --item "Descripción|clave|precio".',
					);
				body = {
					customer: {
						tax_id: values.customer.toUpperCase(),
						legal_name: values.name,
						tax_system: values.regime,
						zip: values.zip,
						...(values.email ? { email: values.email } : {}),
					},
					items: values.item.map(parseItem),
				};
			}
			if (values["payment-form"]) body.payment_form = values["payment-form"];
			if (values["payment-method"]) body.payment_method = values["payment-method"];
			if (values.use) body.use = values.use;
			if (values.issuer) body.issuer = values.issuer;
			await confirmLive(api, g, "Timbrar");
			const invoice = await api.request<Invoice & { warnings?: string[] }>(
				{ method: "POST", path: "/v1/invoices", body, idempotent: true },
				{ idempotencyKey: values["idempotency-key"] },
			);
			return print(invoice, () => {
				showInvoice(invoice);
				for (const w of invoice.warnings ?? []) line(`  ${yellow("!")} ${w}`);
				line(dim(`  PDF: fiscalisto invoices pdf ${invoice.id}`));
			});
		}
		case "list": {
			const { values } = parseArgs({
				args: rest,
				options: {
					status: { type: "string" },
					customer: { type: "string" },
					issuer: { type: "string" },
					type: { type: "string" },
					limit: { type: "string", default: "20" },
				},
			});
			const page = await api.request<{ data: Invoice[]; has_more: boolean }>({
				method: "GET",
				path: "/v1/invoices",
				query: {
					status: values.status,
					customer: values.customer,
					issuer: values.issuer,
					type: values.type,
					limit: values.limit,
				},
			});
			return print(page, () => {
				if (!page.data.length) return line(dim("Sin facturas."));
				for (const i of page.data)
					line(
						`${(`${i.series ?? ""}${i.folio ?? ""}` || "—").padEnd(8)} ${(STATUS[i.status] ?? String)(i.status.padEnd(10))} ${money(i.total, i.currency).padStart(14)}  ${(i.customer.legal_name ?? "").slice(0, 32).padEnd(32)} ${dim(i.id)}`,
					);
				if (page.has_more) line(dim(`… hay más: --limit ${Number(values.limit) * 2}`));
			});
		}
		case "get": {
			const id = need(rest[0], "fiscalisto invoices get inv_…");
			const invoice = await api.request<Invoice>({
				method: "GET",
				path: `/v1/invoices/${id}`,
			});
			return print(invoice, () => showInvoice(invoice));
		}
		case "pdf":
		case "xml": {
			const { values, positionals } = parseArgs({
				args: rest,
				allowPositionals: true,
				options: { output: { type: "string", short: "o" } },
			});
			const id = need(positionals[0], `fiscalisto invoices ${sub} inv_… [-o archivo]`);
			const bytes = await api.request<Uint8Array>({
				method: "GET",
				path: `/v1/invoices/${id}/${sub}`,
				as: "bytes",
			});
			const out = values.output ?? `${id}.${sub}`;
			if (out === "-") return void process.stdout.write(bytes);
			await writeFile(out, bytes);
			return print({ file: resolve(out), bytes: bytes.length }, () =>
				line(`${green("✓")} ${out}`),
			);
		}
		case "cancel": {
			const { values, positionals } = parseArgs({
				args: rest,
				allowPositionals: true,
				options: {
					motive: { type: "string", default: "02" },
					substitution: { type: "string" },
				},
			});
			const id = need(positionals[0], "fiscalisto invoices cancel inv_… [--motive 02]");
			await confirmLive(api, g, "Cancelar ante el SAT");
			const invoice = await api.request<Invoice>({
				method: "POST",
				idempotent: true,
				path: `/v1/invoices/${id}/cancel`,
				body: {
					motive: values.motive,
					...(values.substitution ? { substitution: values.substitution } : {}),
				},
			});
			return print(invoice, () => {
				showInvoice(invoice);
				if (invoice.status === "pending")
					line(
						yellow(
							"  El cliente tiene 3 días hábiles para aceptar la cancelación (invoice.cancellation_pending).",
						),
					);
			});
		}
		case "send": {
			const { values, positionals } = parseArgs({
				args: rest,
				allowPositionals: true,
				options: { to: { type: "string" }, cc: { type: "string" } },
			});
			const id = need(positionals[0], "fiscalisto invoices send inv_… [--to correo]");
			const invoice = await api.request<Invoice>({
				method: "POST",
				idempotent: true,
				path: `/v1/invoices/${id}/send`,
				body: {
					...(values.to ? { to: values.to } : {}),
					...(values.cc ? { cc: values.cc } : {}),
				},
			});
			return print(invoice, () => line(`${green("✓")} Enviada.`));
		}
		default:
			throw new UsageError("fiscalisto invoices create|list|get|pdf|xml|cancel|send");
	}
}

function need(value: string | undefined, usage: string): string {
	if (!value) throw new UsageError(`Uso: ${usage}`);
	return value;
}

// ── Recursos sencillos ─────────────────────────────────────────────────────

async function simpleList(
	api: Fiscalisto,
	path: string,
	query: object,
	human: (row: Record<string, unknown>) => string,
) {
	const page = await api.request<{ data: Record<string, unknown>[]; has_more: boolean }>({
		method: "GET",
		path,
		query,
	});
	print(page, () => {
		if (!page.data.length) return line(dim("Nada todavía."));
		for (const row of page.data) line(human(row));
	});
}

async function issuers(args: string[], g: Globals) {
	const api = await client(g);
	if (args[0] === "get") {
		const issuer = await api.request({
			method: "GET",
			path: `/v1/issuers/${need(args[1], "fiscalisto issuers get iss_…")}`,
		});
		return print(issuer);
	}
	if (args[0] && args[0] !== "list") throw new UsageError("fiscalisto issuers list|get");
	await simpleList(
		api,
		"/v1/issuers",
		{},
		(i) =>
			`${String(i.tax_id).padEnd(14)} ${String(i.status).padEnd(10)} ${String(i.legal_name ?? "")} ${dim(String(i.id))}`,
	);
}

const EVENT_TYPES = [
	"invoice.stamped",
	"invoice.failed",
	"invoice.canceled",
	"invoice.cancellation_pending",
	"invoice.cancellation_rejected",
	"retention.stamped",
	"retention.failed",
	"retention.canceled",
	"invoice_batch.completed",
];

async function events(args: string[], g: Globals) {
	const api = await client(g);
	if (args[0] === "get") {
		const event = await api.request({
			method: "GET",
			path: `/v1/events/${need(args[1], "fiscalisto events get evt_…")}`,
		});
		return print(event);
	}
	const { values } = parseArgs({
		args: args[0] === "list" ? args.slice(1) : args,
		options: {
			type: { type: "string" },
			object: { type: "string" },
			limit: { type: "string", default: "20" },
		},
	});
	await simpleList(
		api,
		"/v1/events",
		{ type: values.type, object: values.object, limit: values.limit },
		(e) => {
			const o = (e.data as { object: { id: string } }).object;
			return `${dim(String(e.created_at))} ${String(e.type).padEnd(30)} ${o.id} ${dim(String(e.id))}`;
		},
	);
}

async function webhooks(args: string[], g: Globals) {
	const [sub, ...rest] = args;
	const api = await client(g);
	switch (sub) {
		case undefined:
		case "list":
			return simpleList(
				api,
				"/v1/webhook_endpoints",
				{},
				(w) => `${String(w.status).padEnd(9)} ${w.url} ${dim(String(w.id))}`,
			);
		case "create": {
			const { values } = parseArgs({
				args: rest,
				options: {
					url: { type: "string" },
					events: { type: "string" },
					description: { type: "string" },
				},
			});
			const endpoint = await api.request<{ id: string; secret: string; url: string }>({
				method: "POST",
				idempotent: true,
				path: "/v1/webhook_endpoints",
				body: {
					url: need(
						values.url,
						"fiscalisto webhooks create --url https://… [--events a,b]",
					),
					...(values.events
						? { events: values.events.split(",").map((s) => s.trim()) }
						: {}),
					...(values.description ? { description: values.description } : {}),
				},
			});
			return print(endpoint, () => {
				line(`${green("✓")} ${endpoint.url} ${dim(endpoint.id)}`);
				line(
					`  Secreto de firma: ${bold(endpoint.secret)} ${dim("(guárdelo; también en el panel)")}`,
				);
			});
		}
		case "delete": {
			const id = need(rest[0], "fiscalisto webhooks delete whe_…");
			return print(
				await api.request({ method: "DELETE", path: `/v1/webhook_endpoints/${id}` }),
				() => line(`${green("✓")} Borrado.`),
			);
		}
		case "test": {
			const { values, positionals } = parseArgs({
				args: rest,
				allowPositionals: true,
				options: { type: { type: "string", default: "invoice.stamped" } },
			});
			const id = need(
				positionals[0],
				"fiscalisto webhooks test whe_… [--type invoice.failed]",
			);
			const r = await api.request<{
				event: { id: string; type: string };
				delivery: {
					ok: boolean;
					status: number | null;
					error: string | null;
					response_body: string | null;
					duration_ms: number;
				};
			}>({
				method: "POST",
				idempotent: true,
				path: `/v1/webhook_endpoints/${id}/test`,
				body: { type: values.type },
			});
			return print(r, () => {
				const d = r.delivery;
				line(
					`${d.ok ? green("✓") : red("✗")} ${r.event.type} → ${d.status ?? "sin respuesta"} en ${d.duration_ms} ms${d.error ? ` ${red(d.error)}` : ""}`,
				);
				if (d.response_body) line(dim(`  ${d.response_body.slice(0, 300)}`));
			});
		}
		default:
			throw new UsageError("fiscalisto webhooks list|create|delete|test");
	}
}

async function satLists(args: string[], g: Globals) {
	const rfcs = (args[0] === "check" ? args.slice(1) : args)
		.flatMap((a) => a.split(/[\s,]+/))
		.filter(Boolean);
	if (!rfcs.length) throw new UsageError("fiscalisto sat-lists check RFC [RFC…]");
	const api = await client(g);
	const page = await api.request<{
		data: {
			tax_id: string;
			name: string | null;
			listed: boolean;
			risk: string;
			lists: { source_name: string; situation: string | null }[];
		}[];
	}>({ method: "POST", path: "/v1/sat_lists/check", body: { tax_ids: rfcs }, idempotent: true });
	print(page, () => {
		for (const r of page.data) {
			const mark =
				r.risk === "high" ? red("●") : r.risk === "medium" ? yellow("●") : green("●");
			line(
				`${mark} ${r.tax_id.padEnd(14)} ${r.listed ? r.lists.map((l) => `${l.source_name}${l.situation ? ` (${l.situation})` : ""}`).join("; ") : dim("no aparece")}${r.name ? dim(` · ${r.name}`) : ""}`,
			);
		}
	});
}

// ── api ────────────────────────────────────────────────────────────────────

async function rawApi(args: string[], g: Globals) {
	const { values, positionals } = parseArgs({
		args,
		allowPositionals: true,
		options: { data: { type: "string", short: "d" }, "idempotency-key": { type: "string" } },
	});
	let [method, path] = positionals;
	if (method && !path) [method, path] = ["GET", method];
	if (!method || !path)
		throw new UsageError("Uso: fiscalisto api [GET|POST|DELETE] /v1/… [--data JSON]");
	method = method.toUpperCase();
	const api = await client(g);
	const body = await readData(values.data);
	const stamps =
		method === "POST" &&
		/^\/v1\/(invoices|payments|credit_notes|advances|retentions|payroll_receipts|invoice_batches)(\/[^/]+\/substitute)?$/.test(
			path.split("?")[0] ?? "",
		);
	if (stamps) await confirmLive(api, g, "Timbrar");
	const [p, q] = path.split("?");
	const result = await api.request(
		{
			method,
			path: p as string,
			query: Object.fromEntries(new URLSearchParams(q ?? "")),
			body,
			// Every POST: a lost answer repeated with the same key never does it twice.
			idempotent: method === "POST",
			as: /\/(pdf|xml)$/.test(p ?? "") ? "bytes" : "json",
		},
		{ idempotencyKey: values["idempotency-key"] },
	);
	if (result instanceof Uint8Array) return void process.stdout.write(result);
	print(result);
}

// ── listen ─────────────────────────────────────────────────────────────────

/** Standard Webhooks' signature, like Fiscalisto's own deliveries. */
function sign(secret: string, id: string, timestamp: number, body: string) {
	const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
	return `v1,${createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64")}`;
}

async function listen(args: string[], g: Globals) {
	const { values } = parseArgs({
		args,
		options: {
			"forward-to": { type: "string", short: "f" },
			events: { type: "string" },
			secret: { type: "string" },
			interval: { type: "string", default: "2" },
		},
	});
	// Its polls say so: they don't fill Solicitudes and the usage chart with a line every 2 s.
	const api = new Fiscalisto(await keyFor(g), {
		baseUrl: API_URL(),
		fetch: (url, init) =>
			fetch(url, { ...init, headers: { ...init?.headers, "fiscalisto-listen": "1" } }),
	});
	const config = await loadConfig();
	// One secret per computer, so the app's .env doesn't change between runs.
	const secret =
		values.secret ??
		env.FISCALISTO_WEBHOOK_SECRET ??
		(config as Config & { listen_secret?: string }).listen_secret ??
		`whsec_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString("base64")}`;
	if (!values.secret && !(config as { listen_secret?: string }).listen_secret)
		await saveConfig({ ...config, listen_secret: secret } as Config);
	const wanted = values.events
		?.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	for (const t of wanted ?? [])
		if (!EVENT_TYPES.includes(t))
			throw new UsageError(`No existe el evento ${t}. Eventos: ${EVENT_TYPES.join(", ")}.`);
	const target = values["forward-to"];

	// Start after what already happened.
	const first = await api.request<{ data: { id: string }[] }>({
		method: "GET",
		path: "/v1/events",
		query: { limit: 1 },
	});
	let last = first.data[0]?.id;
	if (json)
		line(
			JSON.stringify({
				status: "ready",
				secret,
				forward_to: target ?? null,
				mode: api.livemode ? "live" : "test",
			}),
		);
	else {
		note(
			`${green("Listo.")} Escuchando eventos de ${api.livemode ? yellow("producción") : "pruebas"}${target ? ` → ${bold(target)}` : ""}. Ctrl+C para salir.`,
		);
		note(`Secreto de firma de esta computadora: ${bold(secret)}`);
		note(dim("Póngalo en FISCALISTO_WEBHOOK_SECRET de su app para verificar las firmas."));
	}
	const every = Math.max(1, Number(values.interval)) * 1000;
	for (;;) {
		await sleep(every);
		let fresh: {
			id: string;
			type: string;
			created_at: string;
			data: { object: { id: string } };
		}[] = [];
		try {
			// Newest first; take everything after `last`, oldest first.
			const page = await api.request<{ data: typeof fresh }>({
				method: "GET",
				path: "/v1/events",
				query: { limit: 100 },
			});
			const at = last ? page.data.findIndex((e) => e.id === last) : -1;
			fresh = (
				at === -1 && last ? page.data : page.data.slice(0, at === -1 ? 0 : at)
			).reverse();
			if (!last && page.data[0]) last = page.data[0].id;
		} catch (e) {
			note(
				red(
					`No se pudieron leer los eventos: ${e instanceof Error ? e.message : String(e)}`,
				),
			);
			continue;
		}
		for (const event of fresh) {
			last = event.id;
			if (wanted && !wanted.includes(event.type)) continue;
			const body = JSON.stringify(event);
			let result: { status: number | null; ms: number; error?: string } = {
				status: null,
				ms: 0,
			};
			if (target) {
				const timestamp = Math.floor(Date.now() / 1000);
				const started = Date.now();
				try {
					const r = await fetch(target, {
						method: "POST",
						headers: {
							"content-type": "application/json",
							"user-agent": `fiscalisto-cli/${VERSION}`,
							"webhook-id": event.id,
							"webhook-timestamp": String(timestamp),
							"webhook-signature": sign(secret, event.id, timestamp, body),
						},
						body,
						signal: AbortSignal.timeout(15_000),
					});
					result = { status: r.status, ms: Date.now() - started };
				} catch (e) {
					result = {
						status: null,
						ms: Date.now() - started,
						error: e instanceof Error ? e.message : String(e),
					};
				}
			}
			if (json) line(JSON.stringify({ event, forwarded: target ? result : null }));
			else {
				const status = !target
					? ""
					: result.status === null
						? red(` → sin respuesta (${result.error})`)
						: ` → ${result.status >= 200 && result.status < 300 ? green(String(result.status)) : red(String(result.status))} ${dim(`${result.ms} ms`)}`;
				line(
					`${dim(new Date().toLocaleTimeString("es-MX"))} ${bold(event.type)} ${event.data.object.id}${status}`,
				);
			}
		}
	}
}

// ── trigger ────────────────────────────────────────────────────────────────

async function trigger(args: string[], g: Globals) {
	const type = need(
		args[0],
		`fiscalisto trigger <evento>. Eventos: ${EVENT_TYPES.slice(0, 5).join(", ")}, retention.stamped, invoice_batch.completed`,
	);
	const api = await client(g);
	if (api.livemode)
		throw new UsageError(
			"trigger solo funciona con su llave de pruebas: crea facturas de verdad.",
		);
	const stamp = (body: object) =>
		api.request<Invoice>({ method: "POST", path: "/v1/invoices", body, idempotent: true });
	let made: unknown;
	switch (type) {
		case "invoice.stamped":
			made = await stamp(EXAMPLE_INVOICE);
			break;
		case "invoice.failed":
			made = await stamp({
				...EXAMPLE_INVOICE,
				customer: { ...EXAMPLE_INVOICE.customer, tax_id: "NOM010101FK9" },
			}).catch((e) => {
				if (e instanceof FiscalistoError && e.code === "invoice_rejected") return e.raw;
				throw e;
			});
			break;
		case "invoice.canceled": {
			const inv = await stamp(EXAMPLE_INVOICE);
			made = await api.request({
				method: "POST",
				idempotent: true,
				path: `/v1/invoices/${inv.id}/cancel`,
				body: { motive: "02" },
			});
			break;
		}
		case "invoice_batch.completed":
			made = await api.request({
				method: "POST",
				path: "/v1/invoice_batches",
				body: {
					name: "Lote de prueba",
					invoices: [
						{ ...EXAMPLE_INVOICE, reference: "prueba-1" },
						{ ...EXAMPLE_INVOICE, reference: "prueba-2" },
					],
				},
				idempotent: true,
			});
			break;
		default:
			throw new UsageError(
				`trigger crea de verdad: invoice.stamped, invoice.failed, invoice.canceled o invoice_batch.completed. Para cualquier otro use «fiscalisto webhooks test whe_… --type ${type}».`,
			);
	}
	print(made, () =>
		line(
			`${green("✓")} Listo: le llega ${bold(type)} a sus webhooks de pruebas y a «fiscalisto listen».`,
		),
	);
}

// ── open, docs ─────────────────────────────────────────────────────────────

const PLACES: Record<string, string> = {
	dashboard: "/desarrolladores",
	panel: "/desarrolladores",
	invoices: "/desarrolladores/facturas",
	facturas: "/desarrolladores/facturas",
	keys: "/desarrolladores/llaves",
	llaves: "/desarrolladores/llaves",
	webhooks: "/desarrolladores/webhooks",
	events: "/desarrolladores/eventos",
	eventos: "/desarrolladores/eventos",
	logs: "/desarrolladores/solicitudes",
	docs: "/docs/api",
	reference: "/docs/api/referencia",
};

function openPlace(args: string[]) {
	const where = args[0] ?? "dashboard";
	const path = PLACES[where];
	if (!path) throw new UsageError(`fiscalisto open ${Object.keys(PLACES).join("|")}`);
	const url = `${APP_URL()}${path}`;
	openBrowser(url);
	print({ url }, () => line(url));
}

async function docs() {
	const r = await fetch(`${APP_URL()}/llms.txt`);
	if (!r.ok) throw new Error(`No se pudo leer la documentación (${r.status}).`);
	const text = await r.text();
	if (json) print({ url: `${APP_URL()}/llms.txt`, text });
	else process.stdout.write(text);
}

// ── main ───────────────────────────────────────────────────────────────────

const HELP = `${bold("fiscalisto")} ${dim(VERSION)} · facturación electrónica (CFDI 4.0) desde su terminal

${bold("Empezar")}
  login [--live] [--key fk_…]   Inicia sesión por el navegador y guarda su llave de pruebas
  init [--lang node|python|php] Deja el SDK, la llave en .env y un ejemplo en su proyecto (--agents: AGENTS.md)
  whoami                        Cuenta, modo, timbres y emisores
  logout                        Olvida las llaves en esta computadora

${bold("Facturas")}
  invoices create --example     Timbra una factura de prueba
  invoices create --data @f.json | --customer RFC --name … --regime 601 --zip … --item "Desc|clave|precio"
  invoices list [--status valid] [--customer RFC]
  invoices get|pdf|xml|send <inv_…>
  invoices cancel <inv_…> [--motive 02] [--substitution inv_…]
  sat-lists check RFC [RFC…]    ¿Está en la lista 69-B del SAT?

${bold("Webhooks")}
  listen [--forward-to URL]     Reenvía los eventos a su computadora, firmados
  trigger <evento>              Crea en pruebas lo que manda ese evento (invoice.stamped, invoice.failed…)
  webhooks list|create|delete|test
  events list|get

${bold("Otros")}
  issuers list|get              Sus emisores
  api [METHOD] /v1/… [--data]   Cualquier ruta de la API con su llave
  open [panel|facturas|llaves|webhooks|eventos|docs]
  docs                          La guía completa para agentes (llms.txt)

${bold("Opciones")}
  --json          Respuesta en JSON (para scripts y agentes)
  --live          Usa su llave de producción
  --api-key KEY   Otra llave (también FISCALISTO_API_KEY)
  --yes           No pregunta antes de timbrar en producción

Documentación: https://fiscalisto.com/docs/api/cli`;

export async function main(argv: string[]) {
	const globals: Globals = { live: false, yes: false };
	const rest: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i] as string;
		if (a === "--json") json = true;
		else if (a === "--live") globals.live = true;
		else if (a === "--yes" || a === "-y") globals.yes = true;
		else if (a === "--api-key") globals.apiKey = argv[++i];
		else if (a.startsWith("--api-key=")) globals.apiKey = a.slice(10);
		else rest.push(a);
	}
	const [command, ...args] = rest;
	try {
		switch (command) {
			case "login":
				return await login(args, globals);
			case "logout":
				return await logout();
			case "whoami":
			case "status":
				return await whoami(globals);
			case "init":
				return await init(args, globals);
			case "invoices":
			case "facturas":
				return await invoices(args, globals);
			case "issuers":
				return await issuers(args, globals);
			case "events":
				return await events(args, globals);
			case "webhooks":
				return await webhooks(args, globals);
			case "sat-lists":
				return await satLists(args, globals);
			case "api":
				return await rawApi(args, globals);
			case "listen":
				return await listen(args, globals);
			case "trigger":
				return await trigger(args, globals);
			case "open":
				return openPlace(args);
			case "docs":
				return await docs();
			case "version":
			case "--version":
			case "-v":
				return print({ version: VERSION }, () => line(VERSION));
			case undefined:
			case "help":
			case "--help":
			case "-h":
				return line(HELP);
			default:
				throw new UsageError(`No existe el comando «${command}». Vea fiscalisto --help.`);
		}
	} catch (e) {
		const usage =
			e instanceof UsageError ||
			(e instanceof TypeError && "code" in e && String(e.code).startsWith("ERR_PARSE_ARGS"));
		if (json)
			process.stdout.write(
				`${JSON.stringify({
					error:
						e instanceof FiscalistoError
							? e.raw
							: {
									type: usage ? "usage_error" : "cli_error",
									message: e instanceof Error ? e.message : String(e),
								},
				})}\n`,
			);
		else if (e instanceof FiscalistoError) {
			note(`${red("Error")} ${e.message}${e.param ? dim(` (${e.param})`) : ""}`);
			if (e.requestId) note(dim(`Request-Id: ${e.requestId}`));
		} else note(`${red("Error")} ${e instanceof Error ? e.message : String(e)}`);
		process.exitCode = usage ? 2 : 1;
	}
}

// Run when called as the program (npx fiscalisto, the bin), not when imported.
const invoked = process.argv[1] ? resolve(process.argv[1]) : "";
if (/fiscalisto(\.js)?$|cli\.(js|ts)$/.test(invoked)) void main(process.argv.slice(2));
