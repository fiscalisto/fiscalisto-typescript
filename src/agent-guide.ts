/**
 * How a coding agent adds Fiscalisto to an app, in one page: the Agent Skill that
 * `fiscalisto init --agents` leaves in .claude/skills/fiscalisto/SKILL.md, the same text the site
 * serves at https://fiscalisto.com/docs/api/SKILL.md and the docs MCP answers with get_started.
 * Written by hand; keep it short (an agent reads all of it) and true to the docs it links.
 */

const DOCS = "https://fiscalisto.com/docs/api";

export const AGENT_SKILL_DESCRIPTION =
	"Agregar facturación electrónica mexicana (CFDI 4.0) a una app con la API y los SDKs de Fiscalisto: timbrar facturas, pagos (PPD), notas de crédito, nómina y retenciones, cancelar, webhooks. Use it whenever the user wants to issue Mexican invoices (CFDI, SAT, timbrado, factura electrónica) or integrate Fiscalisto.";

export const AGENT_GUIDE = `# Facturar con Fiscalisto (CFDI 4.0)

Fiscalisto es una API REST que timbra comprobantes fiscales mexicanos (CFDI 4.0): revisa las reglas
del SAT antes de gastar un timbre, sella con el certificado del emisor y timbra con el PAC. Los
nombres de la API están en inglés (\`customer\`, \`items\`, \`unit_price\`); la documentación, los
mensajes de error y los textos, en español (\`Accept-Language: en\` los da en inglés).

- Base: \`https://api.fiscalisto.com/v1\`, JSON, \`Authorization: Bearer <llave>\`.
- Llaves: \`fk_test_…\` timbra en el ambiente de pruebas del SAT, gratis; \`fk_live_…\` timbra CFDI
  reales y usa un timbre cada uno. Se crean en **Desarrolladores › Llaves**.
- Documentación para agentes: ${DOCS}/llms.txt (índice; cada página también en \`.md\`), la
  referencia OpenAPI 3.1 en https://api.fiscalisto.com/v1/openapi.json y el servidor MCP
  ${DOCS}/mcp (sin llave) con search_docs, describe_operation, describe_object, explain_error y
  call_api.

## Antes de escribir código

1. **La llave.** Pídasela a la persona y guárdela en \`FISCALISTO_API_KEY\` (en \`.env\`, nunca en el
   repositorio). Si no tiene: \`npx fiscalisto login\` abre el navegador y guarda su llave de
   pruebas; \`npx fiscalisto init\` instala el SDK y deja la llave en \`.env\`. Nunca invente una.
2. **Sin llave todavía:** \`npx fiscalisto mock\` levanta la API en http://127.0.0.1:12111, sin
   internet (\`new Fiscalisto("fk_test_mock", { baseUrl: "http://127.0.0.1:12111" })\`). Contesta
   como la API pero no revisa reglas del SAT: pruebe después con una \`fk_test_\`.
3. **El SDK de su lenguaje** (los seis tienen cada ruta, tipos e Idempotency-Key automática):

| Lenguaje | Instalar | Cliente |
| --- | --- | --- |
| TypeScript / JavaScript | \`npm install fiscalisto\` | \`new Fiscalisto()\` |
| Python | \`pip install fiscalisto\` | \`Fiscalisto()\` |
| PHP | \`composer require fiscalisto/fiscalisto\` | \`new Fiscalisto\\Fiscalisto()\` |
| Go | \`go get fiscalisto.com/go\` | \`fiscalisto.NewClient("")\` |
| Java | Maven \`com.fiscalisto:fiscalisto\` | \`new FiscalistoClient()\` |
| C# / .NET | \`dotnet add package Fiscalisto\` | \`new FiscalistoClient()\` |

Sin argumento, cada cliente lee \`FISCALISTO_API_KEY\`. El código de cada operación en cada lenguaje:
\`describe_operation\` del MCP (con \`language\`) o la página \`.md\` de la referencia.

## Timbrar una factura

\`\`\`ts
import { Fiscalisto } from "fiscalisto";

const fiscalisto = new Fiscalisto(); // FISCALISTO_API_KEY

const invoice = await fiscalisto.invoices.create(
  {
    customer: { tax_id: "ICV060329BY0", legal_name: "INMOBILIARIA CVA", tax_system: "601", zip: "33826" },
    payment_form: "03", // transferencia
    items: [{ description: "Mensualidad", product_key: "86121700", quantity: 2, unit_price: 2500 }],
  },
  { idempotencyKey: \`pedido-\${order.id}\` },
);
// Guarde invoice.id (inv_…) y invoice.uuid (el folio fiscal) con su pedido.
\`\`\`

- **Idempotency-Key = el id de su pedido.** Si la respuesta se pierde, repetir con la misma nunca
  timbra dos veces. No use una al azar en cada intento.
- **El cliente (Receptor) va exactamente como en su constancia de situación fiscal:** RFC
  (\`tax_id\`), nombre sin régimen de capital (sin «S.A. de C.V.»), régimen (\`tax_system\`, c_RegimenFiscal)
  y código postal (\`zip\`). Si su app no tiene esos datos, pídalos con una liga
  (\`POST /v1/customer_data_requests\`) o revíselos con \`POST /v1/tax_ids/validate\`; guarde clientes
  frecuentes con \`/v1/customers\` y mande su \`cus_…\`.
- Lo que omite toma el valor usual: PUE, MXN, uso G03 (S01 con régimen 616), objeto de impuesto 02,
  IVA 16 %, cantidad 1, unidad E48. \`unit_price\` es sin IVA, en pesos.
- **Claves del SAT:** no las invente. Búsquelas en los catálogos (\`/v1/sat_catalogs/{name}\`, por ejemplo
  \`product_keys\`) o guarde productos (\`/v1/products\`, \`prd_…\`) con su clave.
- **La respuesta** trae \`status: "valid"\` con UUID, PDF y XML. Si el PAC tarda llega
  \`processing\`: no repita con otra llave de idempotencia; espere el webhook \`invoice.stamped\`
  (o \`invoice.failed\`).
- **PDF y XML:** \`invoices.pdf(id)\`, \`invoices.xml(id)\`; \`invoices.send(id)\` lo manda por correo.
- **A crédito (PPD):** \`payment_method: "PPD"\`, \`payment_form: "99"\`; cada cobro lleva su
  complemento de pago (\`POST /v1/payments\`) a más tardar el día 5 del mes siguiente.
- Otros comprobantes: notas de crédito (\`/v1/credit_notes\`), anticipos (\`/v1/advances\`), nómina
  (\`/v1/payroll_receipts\`), retenciones (\`/v1/retentions\`), lotes de hasta 1,000
  (\`/v1/invoice_batches\`), factura global y autofactura por ticket (\`/v1/tickets\`).

## Errores

Cada error trae \`error.type\`, \`error.code\`, \`error.message\` (en español) y \`error.param\` (el
campo a corregir). Un rechazo del SAT llega como \`invoice_rejected\` con su regla en
\`error.sat_code\` (CFDI40…): muestre el mensaje a la persona y corrija el dato; no reintente igual.
El SDK solo reintenta lo que es seguro repetir. \`explain_error\` del MCP dice qué hacer con cada
código; la lista completa está en ${DOCS}/errores.md.

## Webhooks

Lo que pasa después (timbrado tardío, cancelación aceptada días después, lotes) llega a su endpoint
como evento firmado. Créelo en **Desarrolladores › Webhooks** o con \`POST /v1/webhook_endpoints\`
y guarde su secreto \`whsec_…\` en \`FISCALISTO_WEBHOOK_SECRET\`.

\`\`\`ts
import { FiscalistoWebhookError, verifyWebhook } from "fiscalisto";

export async function POST(request: Request) {
  try {
    // El cuerpo tal como llegó (texto), sin interpretarlo antes.
    const event = await verifyWebhook(await request.text(), request.headers, process.env.FISCALISTO_WEBHOOK_SECRET!);
    if (event.type === "invoice.stamped") await marcarFacturado(event.data.object);
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof FiscalistoWebhookError) return new Response(null, { status: 400 });
    throw error;
  }
}
\`\`\`

Conteste 2xx rápido y procese aparte; un evento puede llegar más de una vez: ignore el \`evt_…\` que
ya procesó. En desarrollo, \`npx fiscalisto listen --forward-to http://localhost:3000/webhooks\` le
reenvía los eventos de pruebas y \`npx fiscalisto trigger invoice.stamped\` provoca uno.

## Cancelar

\`invoices.cancel(id, { motive: "02" })\`: 02 con errores y sin sustituir (el usual), 01 con errores y sustituida
(\`substitution: "inv_…"\`, o \`invoices.substitute\` timbra la nueva y cancela la anterior), 03 no
se llevó a cabo y 04 solo en una factura global (una venta se facturó después a nombre del
cliente). Si el cliente debe aceptar llega
\`invoice.cancellation_pending\` y después \`invoice.canceled\` o \`invoice.cancellation_rejected\`.

## Probar

- Las llaves \`fk_test_\` aplican las mismas revisiones del SAT que producción; una cuenta nueva ya
  tiene un emisor de pruebas listo.
- RFC de prueba que provocan cada rechazo del SAT (por ejemplo \`NOM010101FK9\` → \`CFDI40145\`):
  ${DOCS}/pruebas-y-produccion.md#provocar-cada-rechazo-del-sat.
- \`call_api\` del MCP prueba un cuerpo real con la llave de pruebas antes de escribirlo en código.
- Pruebas automáticas: \`POST /v1/test_data/reset\` deja el modo de pruebas como nuevo.

## Nunca

- Poner la llave en el navegador o en una app móvil: la API rechaza el navegador
  (\`browser_not_supported\`). Llame desde su servidor.
- Usar una \`fk_live_\` para probar: timbra CFDI reales con valor fiscal.
- Inventar folios, UUID, RFC, regímenes o claves del SAT: consúltelos.

## Pasar a producción

Emisor real (\`POST /v1/issuers\`), su CSD (\`/certificates\`), la firma con e.firma del contrato
con el PAC (\`/efirma\`) o, más fácil, una liga para que el dueño lo haga
(\`POST /v1/issuers/{id}/onboarding_links\`); timbres en **Desarrolladores › Timbres**; y la llave
\`fk_live_\` en el servidor. Detalle: ${DOCS}/pruebas-y-produccion.md#pasar-a-produccion.
`;

/** The guide as an Agent Skill (agentskills.io): SKILL.md with its name and description. */
export const AGENT_SKILL = `---
name: fiscalisto
description: ${JSON.stringify(AGENT_SKILL_DESCRIPTION)}
---

${AGENT_GUIDE}`;
