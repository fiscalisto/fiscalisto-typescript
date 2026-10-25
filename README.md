# fiscalisto

El SDK de la [API de facturación de Fiscalisto](https://fiscalisto.com/docs/api): timbre CFDI 4.0 (facturas, pagos, notas de crédito, nómina, retenciones y lotes) desde TypeScript o JavaScript.

- Tipos para cada campo, con su descripción y su nombre en el XML del SAT.
- `Idempotency-Key` automática en cada `POST`: un reintento nunca timbra, crea ni manda nada dos veces.
- Reintentos solo de lo que es seguro repetir.
- Listas que se recorren solas con `for await`.
- Webhooks verificados en una línea.
- Sin dependencias: Node 20+, Bun, Deno y Cloudflare Workers.

```bash
npm install fiscalisto
```

```ts
import { Fiscalisto } from "fiscalisto";

const fiscalisto = new Fiscalisto(process.env.FISCALISTO_API_KEY);

const invoice = await fiscalisto.invoices.create(
  {
    customer: { tax_id: "ICV060329BY0", legal_name: "INMOBILIARIA CVA", tax_system: "601", zip: "33826" },
    payment_form: "03",
    items: [{ description: "Mensualidad", product_key: "86121700", quantity: 2, unit_price: 2500 }],
  },
  { idempotencyKey: "pedido-A-1042" },
);

console.log(invoice.uuid, invoice.total);
```

## CLI

El mismo paquete trae el CLI: `npx fiscalisto login` inicia sesión por el navegador, `npx fiscalisto init` deja el SDK y su llave en su proyecto, y `npx fiscalisto listen --forward-to http://localhost:3000/webhooks` le manda los webhooks de pruebas a su computadora. Con `--json`, para agentes y scripts. Vea [fiscalisto.com/docs/api/cli](https://fiscalisto.com/docs/api/cli).

La guía completa está en [fiscalisto.com/docs/api/sdk](https://fiscalisto.com/docs/api/sdk) y cada página de la [referencia](https://fiscalisto.com/docs/api) trae su ejemplo con el SDK.

## Desarrollo

`src/generated.ts` (tipos y métodos) se genera desde la especificación OpenAPI con `bun run openapi` en la raíz del repositorio; no lo edite. `src/core.ts` y `src/webhooks.ts` se escriben a mano. `npm run build` compila a `dist/`.
