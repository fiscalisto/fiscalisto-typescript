import { FiscalistoApi } from "./generated.js";
import { Webhooks } from "./webhooks.js";

/**
 * El SDK de la API de facturación de Fiscalisto.
 *
 * ```ts
 * import { Fiscalisto } from "fiscalisto";
 *
 * const fiscalisto = new Fiscalisto(process.env.FISCALISTO_API_KEY);
 * const factura = await fiscalisto.invoices.create({
 *   customer: { tax_id: "URE180429TM6", legal_name: "UNIVERSIDAD ROBOTICA ESPAÑOLA", tax_system: "601", zip: "86991" },
 *   payment_form: "03",
 *   items: [{ description: "Consultoría", product_key: "80101500", unit_price: 1000 }],
 * });
 * ```
 *
 * @see https://fiscalisto.com/docs/api
 */
export class Fiscalisto extends FiscalistoApi {
	readonly webhooks = new Webhooks();
}

export default Fiscalisto;
export {
	type ErrorType,
	type Fetch,
	FiscalistoError,
	type FiscalistoOptions,
	List,
	type Page,
	type RequestOptions,
	VERSION,
} from "./core.js";
export type * from "./generated.js";
export {
	FiscalistoWebhookError,
	type VerifyOptions,
	verifyWebhook,
	type WebhookHeaders,
} from "./webhooks.js";
