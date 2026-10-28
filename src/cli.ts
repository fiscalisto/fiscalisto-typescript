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
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { appendFile, chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, hostname } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { AGENT_GUIDE, AGENT_SKILL } from "./agent-guide.js";
import { FiscalistoError, VERSION } from "./core.js";
import { Fiscalisto } from "./index.js";
import { createMock } from "./mock.js";

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
const money = (n: unknown, currency = "MXN") => {
	if (typeof n !== "number") return "";
	const amount = n.toLocaleString("es-MX", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return currency === "MXN" || currency === "XXX" ? `$${amount}` : `${amount} ${currency}`;
};
/** What a document is worth in a list: a payment complement's total is 0, so its amount paid. */
const worth = (i: Invoice) => {
	const paid = (i as { payment?: { amount?: number; currency?: string } | null }).payment;
	return i.type === "P" && paid ? money(paid.amount, paid.currency) : money(i.total, i.currency);
};

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

type Lang = "node" | "python" | "php" | "go" | "dotnet" | "java";
const LANGS: Lang[] = ["node", "python", "php", "go", "dotnet", "java"];

function detectLang(dir: string): Lang | null {
	if (existsSync(join(dir, "package.json"))) return "node";
	if (
		["pyproject.toml", "requirements.txt", "setup.py", "Pipfile"].some((f) =>
			existsSync(join(dir, f)),
		)
	)
		return "python";
	if (existsSync(join(dir, "composer.json"))) return "php";
	if (existsSync(join(dir, "go.mod"))) return "go";
	if (["pom.xml", "build.gradle", "build.gradle.kts"].some((f) => existsSync(join(dir, f))))
		return "java";
	if (readdirSync(dir).some((f) => /\.(csproj|fsproj|sln)$/.test(f))) return "dotnet";
	return null;
}

/** The command that adds the SDK, or null where it goes in a build file by hand (Java). */
function installCommand(lang: Lang, dir: string): string[] | null {
	if (lang === "python") {
		if (existsSync(join(dir, "uv.lock"))) return ["uv", "add", "fiscalisto"];
		if (existsSync(join(dir, "poetry.lock"))) return ["poetry", "add", "fiscalisto"];
		return ["pip", "install", "fiscalisto"];
	}
	if (lang === "php") return ["composer", "require", "fiscalisto/fiscalisto"];
	if (lang === "go") return ["go", "get", "fiscalisto.com/go"];
	if (lang === "dotnet") return ["dotnet", "add", "package", "Fiscalisto"];
	if (lang === "java") return null;
	if (existsSync(join(dir, "bun.lock")) || existsSync(join(dir, "bun.lockb")))
		return ["bun", "add", "fiscalisto"];
	if (existsSync(join(dir, "pnpm-lock.yaml"))) return ["pnpm", "add", "fiscalisto"];
	if (existsSync(join(dir, "yarn.lock"))) return ["yarn", "add", "fiscalisto"];
	return ["npm", "install", "fiscalisto"];
}

/** What to add to a Java build by hand. */
const javaDependency = (dir: string) =>
	existsSync(join(dir, "pom.xml"))
		? `pom.xml: agregue <dependency><groupId>com.fiscalisto</groupId><artifactId>fiscalisto</artifactId><version>${VERSION}</version></dependency>`
		: `build.gradle: agregue implementation("com.fiscalisto:fiscalisto:${VERSION}")`;

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

const EXAMPLES: Partial<Record<Lang, { file: string; code: string; run: string }>> = {
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

EXAMPLES.go = {
	file: "fiscalisto-ejemplo/main.go",
	run: "env $(grep -v '^#' .env | xargs) go run ./fiscalisto-ejemplo",
	code: `// Timbra una factura de prueba con el SDK de Fiscalisto:
// env $(grep -v '^#' .env | xargs) go run ./fiscalisto-ejemplo
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	fiscalisto "fiscalisto.com/go"
)

func main() {
	// La llave viene de FISCALISTO_API_KEY.
	client, err := fiscalisto.NewClient("")
	if err != nil {
		log.Fatal(err)
	}
	factura, err := client.Invoices.Create(context.Background(), &fiscalisto.InvoiceCreate{
		Customer: fiscalisto.ObjectOf(fiscalisto.InvoiceCreateCustomer{
			TaxID:     "ICV060329BY0",
			LegalName: "INMOBILIARIA CVA",
			TaxSystem: "601",
			Zip:       "33826",
		}),
		PaymentForm: fiscalisto.String("03"),
		Items: []fiscalisto.InvoiceCreateItem{{
			Description: fiscalisto.String("Consultoría"),
			ProductKey:  fiscalisto.String("80101500"),
			UnitPrice:   fiscalisto.Float64(1000),
		}},
	}, fiscalisto.WithIdempotencyKey(fmt.Sprintf("pedido-%d", time.Now().Unix()))) // use el id de su pedido
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(factura.ID)
}
`,
};
EXAMPLES.dotnet = {
	file: "FiscalistoEjemplo.cs",
	run: "llame a await FiscalistoEjemplo.RunAsync() con FISCALISTO_API_KEY en el entorno",
	code: `// Timbra una factura de prueba con el SDK de Fiscalisto: await FiscalistoEjemplo.RunAsync();
using Fiscalisto;

public static class FiscalistoEjemplo
{
    public static async Task RunAsync()
    {
        // La llave viene de FISCALISTO_API_KEY.
        var fiscalisto = new FiscalistoClient();
        var factura = await fiscalisto.Invoices.CreateAsync(new InvoiceCreate
        {
            Customer = new InvoiceCreateCustomer
            {
                TaxId = "ICV060329BY0",
                LegalName = "INMOBILIARIA CVA",
                TaxSystem = "601",
                Zip = "33826",
            },
            PaymentForm = "03",
            Items = new() { new() { Description = "Consultoría", ProductKey = "80101500", UnitPrice = 1000 } },
        }, new RequestOptions { IdempotencyKey = $"pedido-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}" }); // use el id de su pedido
        Console.WriteLine(factura.Id);
    }
}
`,
};
EXAMPLES.java = {
	file: "FiscalistoEjemplo.java",
	run: "corra FiscalistoEjemplo.main con FISCALISTO_API_KEY en el entorno",
	code: `// Timbra una factura de prueba con el SDK de Fiscalisto (FISCALISTO_API_KEY en el entorno).
import com.fiscalisto.FiscalistoClient;
import com.fiscalisto.RequestOptions;
import com.fiscalisto.model.InvoiceCreate;
import com.fiscalisto.model.InvoiceCreateCustomer;
import com.fiscalisto.model.InvoiceCreateItem;
import java.util.List;

public class FiscalistoEjemplo {
    public static void main(String[] args) {
        var fiscalisto = new FiscalistoClient();
        var factura = fiscalisto.invoices().create(new InvoiceCreate()
                .setCustomer(new InvoiceCreateCustomer()
                        .setTaxId("ICV060329BY0")
                        .setLegalName("INMOBILIARIA CVA")
                        .setTaxSystem("601")
                        .setZip("33826"))
                .setPaymentForm("03")
                .setItems(List.of(new InvoiceCreateItem()
                        .setDescription("Consultoría")
                        .setProductKey("80101500")
                        .setUnitPrice(1000))),
                RequestOptions.idempotencyKey("pedido-" + System.currentTimeMillis() / 1000)); // use el id de su pedido
        System.out.println(factura.getId());
    }
}
`,
};

const AGENTS_SECTION = `
## Facturación (Fiscalisto)

Facturas electrónicas (CFDI 4.0) con la API de Fiscalisto. La llave está en \`FISCALISTO_API_KEY\`
(\`.env\`; \`fk_test_\` timbra en pruebas sin costo). La guía de integración completa está en
\`.claude/skills/fiscalisto/SKILL.md\` (también en https://fiscalisto.com/docs/api/SKILL.md); el índice de la
documentación en https://fiscalisto.com/docs/api/llms.txt y el servidor MCP de la documentación, sin llave,
en https://fiscalisto.com/docs/api/mcp (empiece con get_started).

- Use el SDK \`fiscalisto\` (npm, PyPI, Packagist, Go, Maven, NuGet). Cada timbrado lleva una Idempotency-Key
  (el id del pedido): repetirla nunca timbra dos veces.
- El cliente va con su RFC, nombre, régimen y código postal exactamente como en su constancia.
- Llame a la API solo desde el servidor; verifique cada webhook con \`verifyWebhook\` y su secreto \`whsec_\`.
- Para probar rechazos del SAT use los RFC de prueba (NOM010101FK9 y otros, ver "Pruebas y producción").
- Sin internet o sin llave: \`npx fiscalisto mock\`. El CLI hace todo desde la terminal: \`npx fiscalisto --help\`
  (\`--json\` para leerlo).
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
	if (lang && !LANGS.includes(lang)) throw new UsageError(`--lang es ${LANGS.join(", ")}.`);
	if (!lang)
		throw new UsageError(
			`No encontré package.json, pyproject.toml/requirements.txt, composer.json, go.mod, pom.xml/build.gradle ni un .csproj aquí. Indique --lang ${LANGS.join("|")}.`,
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
	if (!install) done.push(javaDependency(dir));
	else if (!values["no-install"]) {
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
			// pip installs into the environment only: also into the file a deploy installs from.
			const requirements = join(dir, "requirements.txt");
			if (installed && install[0] === "pip" && existsSync(requirements)) {
				const listed = readFileSync(requirements, "utf8");
				if (!/^fiscalisto\b/im.test(listed)) {
					await appendFile(
						requirements,
						`${listed && !listed.endsWith("\n") ? "\n" : ""}fiscalisto\n`,
					);
					done.push("requirements.txt: fiscalisto");
				}
			} else if (installed && install[0] === "pip" && existsSync(join(dir, "pyproject.toml")))
				done.push("pyproject.toml: agregue «fiscalisto» a dependencies");
		}
	}

	// An example that stamps.
	const example = EXAMPLES[lang] as { file: string; code: string; run: string };
	// Maven and Gradle compile src/main/java.
	const exampleFile =
		lang === "java" && existsSync(join(dir, "src/main/java"))
			? `src/main/java/${example.file}`
			: example.file;
	const examplePath = join(dir, exampleFile);
	if (!existsSync(examplePath)) {
		await mkdir(dirname(examplePath), { recursive: true });
		await writeFile(examplePath, example.code);
		done.push(`${exampleFile}: timbra una factura de prueba`);
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
		const skillPath = join(dir, ".claude", "skills", "fiscalisto", "SKILL.md");
		if (!existsSync(skillPath)) {
			await mkdir(dirname(skillPath), { recursive: true });
			await writeFile(skillPath, AGENT_SKILL);
			done.push(".claude/skills/fiscalisto/SKILL.md: la guía completa, para su agente");
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

/** An invoice's status as the app shows it (the API's value goes in --status and --json). */
const STATUS: Record<string, [string, (s: string) => string]> = {
	valid: ["vigente", green],
	pending: ["pendiente", yellow],
	processing: ["timbrando", yellow],
	rejected: ["rechazada", red],
	canceled: ["cancelada", dim],
};
const status = (s: string, width = 0) => {
	const [label, color] = STATUS[s] ?? [s, String];
	return color(label.padEnd(width));
};

function showInvoice(i: Invoice) {
	line(`${bold(`${i.series ?? ""}${i.folio ?? ""}` || i.id)} ${status(i.status)} ${worth(i)}`);
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
						'Pase --data (JSON, @archivo o -), --example, o --customer RFC --name "NOMBRE" --regime 601 --zip 12345 --item "Descripción|clave|precio" --payment-form 03.',
					);
				if (!values["payment-form"] && values["payment-method"] !== "PPD")
					throw new UsageError(
						"Falta --payment-form: 03 transferencia, 01 efectivo, 04 tarjeta de crédito, 28 de débito (o --payment-method PPD si se la pagan después).",
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
						`${(`${i.series ?? ""}${i.folio ?? ""}` || "—").padEnd(8)} ${status(i.status, 10)} ${worth(i).padStart(14)}  ${(i.customer.legal_name ?? "").slice(0, 32).padEnd(32)} ${dim(i.id)}`,
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
		const issuer = await api.request<Record<string, unknown>>({
			method: "GET",
			path: `/v1/issuers/${need(args[1], "fiscalisto issuers get iss_…")}`,
		});
		return print(issuer, () => {
			line(
				`${bold(String(issuer.legal_name ?? issuer.tax_id))} ${dim(String(issuer.tax_id))}`,
			);
			line(`  Estado     ${String(issuer.status)}`);
			for (const [label, key] of [
				["Régimen", "tax_system"],
				["C.P.", "zip"],
				["Modo", "livemode"],
			] as const)
				if (issuer[key] !== undefined && issuer[key] !== null)
					line(
						`  ${label.padEnd(10)} ${key === "livemode" ? (issuer[key] ? "producción" : "pruebas") : String(issuer[key])}`,
					);
			line(dim(`  ${String(issuer.id)}`));
		});
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
			failed: { type: "boolean" },
			limit: { type: "string", default: "20" },
		},
	});
	await simpleList(
		api,
		"/v1/events",
		{
			type: values.type,
			object: values.object,
			delivery_success: values.failed ? "false" : undefined,
			limit: values.limit,
		},
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

// ── payroll ────────────────────────────────────────────────────────────────

/**
 * «fiscalisto payroll preview|create --data @recibo.json [--external]»: a recibo de nómina.
 * Without --external Fiscalisto calculates it from the employee (emp_…) and the period; with it,
 * the amounts your payroll system calculated are checked and stamped exactly as sent.
 * «fiscalisto payroll batch --data @nomina.json»: a whole payroll run (POST /v1/payroll_batches).
 */
async function payroll(args: string[], g: Globals) {
	const [sub, ...rest] = args;
	if (sub === "batch") return payrollBatch(rest, g);
	if (sub !== "preview" && sub !== "create")
		throw new UsageError(
			"Uso: fiscalisto payroll preview|create --data @recibo.json [--external] [--idempotency-key …]\n     fiscalisto payroll batch --data @nomina.json [--idempotency-key …]",
		);
	const { values } = parseArgs({
		args: rest,
		options: {
			data: { type: "string", short: "d" },
			external: { type: "boolean" },
			"idempotency-key": { type: "string" },
		},
	});
	const body = await readData(values.data);
	if (!body)
		throw new UsageError(
			values.external
				? "Pase --data con el recibo que calculó su sistema (JSON, @archivo o -): employee, perceptions, deductions, other_payments y totals."
				: 'Pase --data (JSON, @archivo o -): {"employee": "emp_…", "period": {…}}.',
		);
	const path = `/v1/payroll_receipts${values.external ? "/external" : ""}`;
	const api = await client(g);
	if (sub === "preview") {
		const preview = await api.request<{
			total: number;
			payroll?: {
				totals?: { perceptions: number; deductions: number; other_payments: number };
			};
			totals?: {
				perceptions: number;
				deductions: number;
				other_payments: number;
				net: number;
			};
			warnings?: (string | { param?: string; message: string })[];
		}>({ method: "POST", path: `${path}/preview`, body });
		return print(preview, () => {
			const t = preview.payroll?.totals ?? preview.totals;
			line(
				`${bold("Recibo de nómina")} ${dim("(sin timbrar)")} neto ${preview.total.toFixed(2)}`,
			);
			if (t)
				line(
					`  percepciones ${t.perceptions.toFixed(2)} · otros pagos ${t.other_payments.toFixed(2)} · deducciones ${t.deductions.toFixed(2)}`,
				);
			for (const w of preview.warnings ?? [])
				line(
					`  ${yellow("!")} ${typeof w === "string" ? w : `${w.param ? `${w.param}: ` : ""}${w.message}`}`,
				);
		});
	}
	await confirmLive(api, g, "Timbrar");
	const invoice = await api.request<Invoice & { warnings?: string[] }>(
		{ method: "POST", path, body, idempotent: true },
		{ idempotencyKey: values["idempotency-key"] },
	);
	return print(invoice, () => {
		showInvoice(invoice);
		for (const w of invoice.warnings ?? []) line(`  ${yellow("!")} ${w}`);
		line(dim(`  PDF: fiscalisto invoices pdf ${invoice.id}`));
	});
}

/** A whole payroll run in one request: stamped in the background, each employee's result. */
async function payrollBatch(args: string[], g: Globals) {
	const { values } = parseArgs({
		args,
		options: {
			data: { type: "string", short: "d" },
			"idempotency-key": { type: "string" },
		},
	});
	const body = await readData(values.data);
	if (!body)
		throw new UsageError(
			'Pase --data con el lote (JSON, @archivo o -): {"period": {…}, "receipts": [{"employee": "emp_…"}, …]} o {"external_receipts": [{…}, …]}.',
		);
	const api = await client(g);
	await confirmLive(api, g, "Timbrar");
	const batch = await api.request<{ id: string; total: number; status: string }>(
		{ method: "POST", path: "/v1/payroll_batches", body, idempotent: true },
		{ idempotencyKey: values["idempotency-key"] },
	);
	return print(batch, () => {
		line(
			`${green("✓")} ${bold(batch.id)}: ${batch.total} recibos, timbrándose en segundo plano.`,
		);
		line(dim(`  Resultado de cada empleado: fiscalisto api /v1/payroll_batches/${batch.id}`));
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
		/^\/v1\/(invoices|payments|credit_notes|advances|retentions|payroll_receipts(\/external)?|invoice_batches|payroll_batches)(\/[^/]+\/substitute)?$/.test(
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
	let lastAt = (first.data[0] as { created_at?: string } | undefined)?.created_at;
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
			// The last one seen may be gone (test data reset): what came after it, by time, not
			// the whole page again.
			fresh = (
				at !== -1
					? page.data.slice(0, at)
					: last && lastAt
						? page.data.filter((e) => e.created_at > (lastAt as string))
						: []
			).reverse();
			if (!last && page.data[0]) {
				last = page.data[0].id;
				lastAt = page.data[0].created_at;
			}
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
			lastAt = event.created_at;
			if (wanted && !wanted.includes(event.type)) continue;
			const body = JSON.stringify(event);
			let result: { status: number | null; ms: number; error?: string } = {
				status: null,
				ms: 0,
			};
			// A server that isn't answering (restarting after a change) gets the event again, as
			// a real delivery would, instead of losing it: up to a minute, then it moves on.
			for (let tries = 0; target; tries++) {
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
				if (result.status !== null || tries >= 20) break;
				if (tries === 0 && !json)
					note(
						dim(
							`${event.type} ${event.id}: ${target} no contesta; reintento cada 3 s…`,
						),
					);
				await sleep(3000);
			}
			if (json) line(JSON.stringify({ event, forwarded: target ? result : null }));
			else {
				const status = !target
					? ""
					: result.status === null
						? red(` → sin respuesta (${result.error}); se perdió ${event.id}`)
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
				customer: {
					...EXAMPLE_INVOICE.customer,
					tax_id: "NOM010101FK9",
					legal_name: "CLIENTE DE PRUEBA RECHAZADO",
				},
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

/** The integration guide (the docs MCP's get_started), from the package: no network needed. */
async function docs() {
	const url = `${APP_URL()}/docs/api/SKILL.md`;
	const text = `${AGENT_GUIDE}\nÍndice de toda la documentación: ${APP_URL()}/docs/api/llms.txt\n`;
	if (json) print({ url, text });
	else process.stdout.write(text);
}

// ── mock ───────────────────────────────────────────────────────────────────

/** `fiscalisto mock`: the API's shapes on localhost, offline (./mock.ts). */
async function mock(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			port: { type: "string", default: "12111" },
			host: { type: "string", default: "127.0.0.1" },
		},
	});
	const { createServer } = await import("node:http");
	const api = createMock();
	const server = createServer(async (req, res) => {
		const chunks: Buffer[] = [];
		for await (const c of req) chunks.push(c as Buffer);
		const url = `http://${req.headers.host ?? "localhost"}${req.url ?? "/"}`;
		const headers = new Headers();
		for (const [k, v] of Object.entries(req.headers))
			if (typeof v === "string") headers.set(k, v);
		const request = new Request(url, {
			method: req.method,
			headers,
			body: chunks.length && req.method !== "GET" ? Buffer.concat(chunks) : undefined,
		});
		const started = Date.now();
		const response = await api.fetch(request);
		res.writeHead(response.status, Object.fromEntries(response.headers));
		res.end(Buffer.from(await response.arrayBuffer()));
		if (!json)
			line(
				`${dim(new Date().toTimeString().slice(0, 8))} ${(response.ok ? green : yellow)(String(response.status))} ${request.method} ${new URL(url).pathname} ${dim(`${Date.now() - started} ms`)}`,
			);
	});
	const port = Number(values.port);
	await new Promise<void>((ok, fail) => {
		server.once("error", fail);
		server.listen(port, values.host, ok);
	});
	const base = `http://${values.host === "0.0.0.0" ? "localhost" : values.host}:${port}`;
	print({ url: base }, () => {
		line(`${bold("Servidor de prueba de Fiscalisto")} en ${cyan(base)}`);
		line(
			dim(
				"Contesta cada ruta como la API, sin internet; lo que crea vive en memoria mientras corre.",
			),
		);
		line(
			dim(
				"No revisa reglas del SAT ni timbra: para eso use su llave fk_test_ contra la API.",
			),
		);
		line("");
		line(`  ${bold("SDK")}   new Fiscalisto("fk_test_mock", { baseUrl: "${base}" })`);
		line(`  ${bold("curl")}  curl ${base}/v1/account -H "Authorization: Bearer fk_test_mock"`);
		line(
			`  ${bold("CLI")}   FISCALISTO_BASE_URL=${base} FISCALISTO_API_KEY=fk_test_mock npx fiscalisto whoami`,
		);
		line("");
		line(dim("Ctrl+C para salir."));
	});
	await new Promise(() => {});
}

// ── main ───────────────────────────────────────────────────────────────────

const HELP = `${bold("fiscalisto")} ${dim(VERSION)} · facturación electrónica (CFDI 4.0) desde su terminal

${bold("Empezar")}
  login [--live] [--key fk_…]   Inicia sesión por el navegador y guarda su llave de pruebas
  init [--lang node|python|php|go|dotnet|java] Deja el SDK, la llave en .env y un ejemplo en su proyecto (--agents: AGENTS.md y la guía para su agente)
  whoami                        Cuenta, modo, timbres y emisores
  logout                        Olvida las llaves en esta computadora

${bold("Facturas")}
  invoices create --example     Timbra una factura de prueba
  invoices create --data @f.json | --customer RFC --name … --regime 601 --zip … --item "Desc|clave|precio" --payment-form 03 [--payment-method PPD] [--use G03]
  invoices list [--status valid] [--customer RFC]
  invoices get|pdf|xml|send <inv_…>
  invoices cancel <inv_…> [--motive 02] [--substitution inv_…]
  sat-lists check RFC [RFC…]    ¿Está en la lista 69-B del SAT?

${bold("Nómina")}
  payroll preview|create --data @recibo.json             Fiscalisto calcula el recibo del empleado (emp_…)
  payroll preview|create --external --data @recibo.json  Timbra tal cual los importes que calculó su sistema
  payroll batch --data @nomina.json                      Toda la nómina (hasta 1,000 recibos) en una solicitud

${bold("Webhooks")}
  listen [--forward-to URL]     Reenvía los eventos a su computadora, firmados
  trigger <evento>              Crea en pruebas lo que manda ese evento (invoice.stamped, invoice.failed…)
  webhooks list|create|delete|test
  events list [--type invoice.*] [--failed]   Los últimos 30 días; --failed: los que algún webhook no recibió
  events get <evt_…>

${bold("Otros")}
  issuers list|get              Sus emisores
  api [METHOD] /v1/… [--data]   Cualquier ruta de la API con su llave
  mock [--port 12111]           La API en su computadora, sin internet, para desarrollar y probar
  open [panel|facturas|llaves|webhooks|eventos|docs]
  docs                          La guía de integración para agentes (la de get_started y SKILL.md)

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
	// «fiscalisto invoices create --help»: the help, not «Unknown option».
	if (command && args.some((a) => a === "--help" || a === "-h")) {
		const lines = HELP.split("\n").filter(
			(l) => l.trimStart().startsWith(`${command} `) || l.trimStart() === command,
		);
		line(lines.length ? lines.join("\n") : HELP);
		line(dim("\nDocumentación: https://fiscalisto.com/docs/api/cli"));
		return;
	}
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
			case "payroll":
			case "nomina":
				return await payroll(args, globals);
			case "api":
				return await rawApi(args, globals);
			case "listen":
				return await listen(args, globals);
			case "mock":
				return await mock(args);
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
