import type { Event } from "./generated.js";

/**
 * Verificar que un webhook lo mandó Fiscalisto (Standard Webhooks): la firma HMAC-SHA256 de
 * `webhook-id.webhook-timestamp.cuerpo` con el secreto whsec_ del endpoint. Con WebCrypto, así
 * que funciona en Node, Bun, Deno y Cloudflare Workers.
 */

export class FiscalistoWebhookError extends Error {
	override readonly name = "FiscalistoWebhookError";
}

/** Headers, o los de Node (IncomingHttpHeaders): con nombres en minúsculas. */
export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

export interface VerifyOptions {
	/** Cuántos segundos de diferencia acepta con la hora del webhook. Por omisión 300. */
	tolerance?: number;
	/** La hora contra la que se compara (pruebas). */
	now?: Date;
}

const header = (headers: WebhookHeaders, name: string) => {
	if (typeof (headers as Headers).get === "function") return (headers as Headers).get(name);
	const value = (headers as Record<string, string | string[] | undefined>)[name];
	return Array.isArray(value) ? value[0] : value;
};

const fromBase64 = (text: string): Uint8Array<ArrayBuffer> =>
	Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

/**
 * Revisa la firma y la hora de un webhook y le devuelve el evento. Pase el cuerpo exactamente
 * como llegó (texto o bytes), no el JSON ya interpretado: un espacio de diferencia cambia la
 * firma. Lanza FiscalistoWebhookError si no es de Fiscalisto.
 */
export async function verifyWebhook(
	payload: string | Uint8Array | ArrayBuffer,
	headers: WebhookHeaders,
	secret: string,
	options: VerifyOptions = {},
): Promise<Event> {
	if (
		typeof payload !== "string" &&
		!(payload instanceof Uint8Array) &&
		!(payload instanceof ArrayBuffer)
	)
		throw new FiscalistoWebhookError(
			"Pase el cuerpo del webhook tal como llegó (texto o bytes), no el JSON ya interpretado.",
		);
	const body =
		typeof payload === "string" ? payload : new TextDecoder().decode(payload as Uint8Array);
	const id = header(headers, "webhook-id");
	const timestamp = header(headers, "webhook-timestamp");
	const signatures = header(headers, "webhook-signature");
	if (!id || !timestamp || !signatures)
		throw new FiscalistoWebhookError(
			"Faltan los encabezados webhook-id, webhook-timestamp o webhook-signature.",
		);
	const seconds = Number(timestamp);
	const now = (options.now ?? new Date()).getTime() / 1000;
	if (!Number.isInteger(seconds) || Math.abs(now - seconds) > (options.tolerance ?? 300))
		throw new FiscalistoWebhookError(
			"La hora del webhook está fuera de tolerancia: puede ser una repetición.",
		);
	if (!secret.startsWith("whsec_"))
		throw new FiscalistoWebhookError("El secreto del endpoint empieza con whsec_.");
	const key = await crypto.subtle.importKey(
		"raw",
		fromBase64(secret.slice("whsec_".length)),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["verify"],
	);
	const signed = new TextEncoder().encode(`${id}.${timestamp}.${body}`);
	// Several during a secret change, separated by spaces: any one valid is enough.
	for (const part of signatures.split(" ")) {
		const [version, signature] = part.split(",");
		if (version !== "v1" || !signature) continue;
		let bytes: Uint8Array<ArrayBuffer>;
		try {
			bytes = fromBase64(signature);
		} catch {
			continue;
		}
		if (await crypto.subtle.verify("HMAC", key, bytes, signed))
			return JSON.parse(body) as Event;
	}
	throw new FiscalistoWebhookError("La firma del webhook no coincide con el secreto.");
}

/** fiscalisto.webhooks: verificar lo que llega a su endpoint. */
export class Webhooks {
	/** Igual que verifyWebhook. */
	verify(
		payload: string | Uint8Array | ArrayBuffer,
		headers: WebhookHeaders,
		secret: string,
		options?: VerifyOptions,
	): Promise<Event> {
		return verifyWebhook(payload, headers, secret, options);
	}
}
