// Generado por `bun run openapi` desde la lista de errores de la API: no lo edite.

/**
 * Los códigos de error de la API, para comparar `error.code` sin escribir el texto:
 * `if (error.code === ErrorCode.InvoiceRejected)`. Vea https://fiscalisto.com/docs/api/errores.
 */
export const ErrorCode = {
	/** Una factura del lote no pasa la revisión; param dice cuál (invoices.3.items.0.unit_price). Ninguna del lote se timbró. */
	BatchInvalid: "batch_invalid",
	/** El cuerpo pasa de 10 MB. Divida el trabajo en varios lotes. */
	BodyTooLarge: "body_too_large",
	/** La API se llama desde su servidor, nunca desde el navegador: la llave secreta quedaría expuesta. */
	BrowserNotSupported: "browser_not_supported",
	/** El SAT no aceptó la solicitud de cancelación; message dice por qué. */
	CancellationFailed: "cancellation_failed",
	/** El catálogo del SAT no respondió (503). Reintente en unos segundos. */
	CatalogUnavailable: "catalog_unavailable",
	/** El CSD no sirve: no es un certificado de sello (es una e.firma), está vencido, el .key no corresponde o la contraseña no abre la llave. */
	CertificateInvalid: "certificate_invalid",
	/** Suba primero el CSD del emisor; después firme el contrato con su e.firma. */
	CertificateRequired: "certificate_required",
	/** No se pudo conectar con la API (connection_error). */
	ConnectionFailed: "connection_failed",
	/** Ya hay un cliente con ese RFC en el catálogo del emisor (o un producto con ese SKU). */
	CustomerExists: "customer_exists",
	/** Llegó al tope del día de algo que no se paga con timbres: comprobantes en pruebas (1,000), RFC revisados en las listas del SAT o constancias consultadas. Retry-After dice cuántos segundos faltan para la medianoche de la Ciudad de México. */
	DailyLimit: "daily_limit",
	/** El cliente ya mandó sus datos con esa liga: una solicitud completada no se cancela. */
	DataRequestCompleted: "data_request_completed",
	/** La e.firma no sirve: no es una e.firma (es un CSD), es de otro RFC, está vencida o la contraseña no abre la llave. */
	EfirmaInvalid: "efirma_invalid",
	/** Para pedirle al SAT las facturas de un emisor en producción, guarde antes su e.firma: POST /v1/issuers/{id}/efirma con keep_for_downloads: true. También si la guardada venció. */
	EfirmaRequired: "efirma_required",
	/** No se pudo mandar el correo; el comprobante sí está timbrado. */
	EmailFailed: "email_failed",
	/** La cuenta llegó al máximo de webhooks en este modo. */
	EndpointLimit: "endpoint_limit",
	/** Lo que timbra exige el encabezado Idempotency-Key (8 a 255 caracteres, uno nuevo por comprobante). Así un reintento nunca timbra dos veces. */
	IdempotencyKeyMissing: "idempotency_key_missing",
	/** Esa Idempotency-Key ya se usó con otro cuerpo. Use una nueva para un comprobante distinto. */
	IdempotencyKeyReused: "idempotency_key_reused",
	/** La cuenta no tiene timbres de producción. Compre un paquete en Desarrolladores › Timbres. En pruebas nunca pasa. Para enterarse antes, escuche balance.low o active la recarga automática. */
	InsufficientBalance: "insufficient_balance",
	/** Algo falló de nuestro lado. Repita la solicitud con la misma Idempotency-Key: nunca se timbra dos veces. Si sigue, escríbanos con el request_id. */
	InternalError: "internal_error",
	/** La llave no existe, se revocó o expiró. Cree otra en Desarrolladores › Llaves. */
	InvalidApiKey: "invalid_api_key",
	/** El cuerpo no es un objeto JSON válido. */
	InvalidJson: "invalid_json",
	/** La factura no cumple una regla del SAT que Fiscalisto revisa antes de mandarla al PAC (uso contra régimen, totales, complementos…). No se usó ningún timbre. */
	InvoiceInvalid: "invoice_invalid",
	/** La acción es para facturas timbradas (enviar, cancelar, sustituir). */
	InvoiceNotStamped: "invoice_not_stamped",
	/** El PAC o el SAT no la aceptaron. sat_code trae su código (CFDI40xxx) y message qué corregir. La factura queda como rejected; no se usó ningún timbre. */
	InvoiceRejected: "invoice_rejected",
	/** El emisor está archivado: ya no timbra. Sus comprobantes se pueden consultar y cancelar. */
	IssuerArchived: "issuer_archived",
	/** Se crearon 500 emisores en 24 horas. Escríbanos si necesita más. */
	IssuerCreationLimit: "issuer_creation_limit",
	/** Ese RFC ya es un emisor de la cuenta en este modo. */
	IssuerExists: "issuer_exists",
	/** No existe ese emisor en la cuenta (o es del otro modo). */
	IssuerMissing: "issuer_missing",
	/** La llave no puede usar ese emisor. */
	IssuerNotAllowed: "issuer_not_allowed",
	/** La cuenta tiene varios emisores y la solicitud no dice cuál: mande issuer (iss_…). */
	IssuerRequired: "issuer_required",
	/** La llave es de solo lectura: puede hacer GET, validar RFC, revisar listas del SAT y calcular recibos de nómina, pero nada que timbre, cancele, envíe o cambie datos. */
	KeyReadOnly: "key_read_only",
	/** La llave está limitada a algunos emisores y la solicitud toca otro (o crea uno nuevo, o usa algo de toda la cuenta como webhooks). */
	KeyRestricted: "key_restricted",
	/** El objeto es del otro modo: una llave fk_test_ solo ve lo de pruebas y una fk_live_ lo de producción. */
	LivemodeMismatch: "livemode_mismatch",
	/** La ruta existe pero no con ese método (por ejemplo, PUT: la API usa POST para actualizar). */
	MethodNotAllowed: "method_not_allowed",
	/** Falta el encabezado Authorization: Bearer fk_test_… o fk_live_…. */
	MissingApiKey: "missing_api_key",
	/** Un campo tiene un valor que no se acepta (formato, catálogo del SAT, rango). param dice cuál y message cómo corregirlo. */
	ParameterInvalid: "parameter_invalid",
	/** Falta un campo obligatorio. param dice cuál. */
	ParameterMissing: "parameter_missing",
	/** Mandó un campo que no existe (casi siempre un nombre mal escrito, como legalName en vez de legal_name). Nunca se ignora en silencio. */
	ParameterUnknown: "parameter_unknown",
	/** El recibo de nómina no se puede calcular o timbrar con esos datos (periodo, días, registro patronal del emisor…). */
	PayrollInvalid: "payroll_invalid",
	/** Demasiadas solicitudes con la llave. Espere lo que dice Retry-After y reintente. */
	RateLimit: "rate_limit",
	/** Otra solicitud con la misma Idempotency-Key sigue en proceso. Espere un momento y repítala. */
	RequestInProgress: "request_in_progress",
	/** No existe un objeto con ese id (o es de otro emisor o del otro modo). */
	ResourceMissing: "resource_missing",
	/** La constancia de retenciones no cumple una regla del SAT. No se usó ningún timbre. */
	RetentionInvalid: "retention_invalid",
	/** La acción es para constancias timbradas. */
	RetentionNotStamped: "retention_not_stamped",
	/** El PAC o el SAT no aceptaron la constancia; sat_code trae su código. */
	RetentionRejected: "retention_rejected",
	/** No existe esa ruta. Revise la dirección y la versión (/v1). */
	RouteNotFound: "route_not_found",
	/** El SAT rechazó la solicitud de descarga. El mensaje trae su motivo, por ejemplo que ya se pidió el mismo periodo con los mismos filtros demasiadas veces (el SAT pone un límite de por vida). */
	SatRequestRejected: "sat_request_rejected",
	/** Demasiados timbres seguidos del mismo emisor. Espere lo que dice Retry-After; para muchas facturas use POST /v1/invoice_batches. */
	StampRateLimit: "stamp_rate_limit",
	/** Los complementos de pago y las notas de crédito no se sustituyen: se cancelan y se emite otro. */
	SubstitutionUnsupported: "substitution_unsupported",
	/** Esto solo existe en pruebas (como reiniciar los datos de prueba): use su llave fk_test_. */
	TestModeOnly: "test_mode_only",
	/** La API no contestó a tiempo (connection_error). Con lo que timbra, repita con la misma Idempotency-Key para saber si se timbró. */
	Timeout: "timeout",
	/** Mande el cuerpo con Content-Type: application/json. */
	UnsupportedContentType: "unsupported_content_type",
} as const;

/** Un código de error de la API. */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
