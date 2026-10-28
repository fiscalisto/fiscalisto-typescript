// Generado por `bun run openapi` desde la lista de errores de la API: no lo edite.

/**
 * Los códigos de error de la API, para comparar `error.code` sin escribir el texto:
 * `if (error.code === ErrorCode.InvoiceRejected)`. Vea https://fiscalisto.com/docs/api/errores.
 */
export const ErrorCode = {
	/** No existe esa versión de la API (en Fiscalisto-Version o api_version). El mensaje dice cuáles hay; vea Versiones. */
	ApiVersionInvalid: "api_version_invalid",
	/** El depósito no se puede conciliar, clasificar o reabrir así (ya está conciliado, las facturas son de otro cliente o una está cancelada…). El mensaje dice por qué. */
	BankTransactionInvalid: "bank_transaction_invalid",
	/** Una factura del lote no pasa la revisión; param dice cuál (invoices.3.items.0.unit_price). Ninguna del lote se timbró. */
	BatchInvalid: "batch_invalid",
	/** El cuerpo pasa de 10 MB. Divida el trabajo en varios lotes. */
	BodyTooLarge: "body_too_large",
	/** El emisor ya tiene una sucursal con ese código postal (cada una lleva el suyo); el mensaje dice cuál. Si está archivada, restáurela con archived: false. */
	BranchExists: "branch_exists",
	/** La sucursal ya facturó, así que no se borra: archívela con archived: true y sus facturas la siguen nombrando. */
	BranchHasInvoices: "branch_has_invoices",
	/** La API se llama desde su servidor, nunca desde el navegador: la llave secreta quedaría expuesta. */
	BrowserNotSupported: "browser_not_supported",
	/** Mezcló las dos formas de emitir un recibo de nómina: POST /v1/payroll_receipts calcula el recibo con los datos del empleado (emp_…); POST /v1/payroll_receipts/external timbra los importes que calculó su sistema. Use el endpoint que corresponde. */
	CalculationModeAmbiguous: "calculation_mode_ambiguous",
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
	/** El mes no tiene pagos a proveedores: esa DIOT se presenta sin operaciones desde el portal del SAT. */
	DiotEmpty: "diot_empty",
	/** La e.firma no sirve: no es una e.firma (es un CSD), es de otro RFC, está vencida o la contraseña no abre la llave. */
	EfirmaInvalid: "efirma_invalid",
	/** Para pedirle al SAT las facturas de un emisor en producción, guarde antes su e.firma: POST /v1/issuers/{id}/efirma con keep_for_downloads: true. También si la guardada venció. */
	EfirmaRequired: "efirma_required",
	/** No se pudo mandar el correo; lo demás sí se hizo: el comprobante está timbrado o la cotización quedó enviada (su url funciona). Repita el envío con su ruta /send. */
	EmailFailed: "email_failed",
	/** Ya hay un webhook con esa dirección en este modo; el mensaje dice cuál. Cámbielo en vez de crear otro. */
	EndpointExists: "endpoint_exists",
	/** La cuenta llegó al máximo de webhooks en este modo. */
	EndpointLimit: "endpoint_limit",
	/** Un campo de expand[] no existe en la respuesta, no es el id de otro objeto, o se pidieron demasiados (hasta 10 campos, 4 niveles). Vea Expandir objetos. */
	ExpandInvalid: "expand_invalid",
	/** Idempotency-Key es de 1 a 255 caracteres ASCII, sin acentos ni ñ: el id de su pedido o un UUID. */
	IdempotencyKeyInvalid: "idempotency_key_invalid",
	/** Lo que timbra exige el encabezado Idempotency-Key (8 a 255 caracteres, uno nuevo por comprobante). Así un reintento nunca timbra dos veces. */
	IdempotencyKeyMissing: "idempotency_key_missing",
	/** Esa Idempotency-Key ya se usó en las últimas 24 horas con otra solicitud (otra ruta u otro cuerpo). Use una nueva para cada operación distinta. */
	IdempotencyKeyReused: "idempotency_key_reused",
	/** La cuenta no tiene timbres de producción: para timbrar, revisar RFC en las listas, consultar constancias o pedir descargas al SAT. Compre un paquete en Desarrolladores › Timbres. En pruebas nunca pasa. Para enterarse antes, escuche balance.low o active la recarga automática. */
	InsufficientBalance: "insufficient_balance",
	/** Algo falló de nuestro lado. Repita la solicitud con la misma Idempotency-Key: nunca se timbra dos veces. Si sigue, escríbanos con el request_id. */
	InternalError: "internal_error",
	/** La llave no existe, se revocó o expiró. Cree otra en Desarrolladores › Llaves. */
	InvalidApiKey: "invalid_api_key",
	/** El cuerpo no es un objeto JSON válido. */
	InvalidJson: "invalid_json",
	/** La respuesta no se pudo leer (api_error): no es el JSON de la API, sino la página de un proxy o de un portal de la red. status dice qué contestó. */
	InvalidResponse: "invalid_response",
	/** Inventario no lo permite: el mensaje dice por qué (un lote que no es de ese producto, otro ajuste del mismo almacén en curso). */
	InventoryRefused: "inventory_refused",
	/** La factura no cumple una regla del SAT que Fiscalisto revisa antes de mandarla al PAC (uso contra régimen, totales, complementos…). No se usó ningún timbre. */
	InvoiceInvalid: "invoice_invalid",
	/** Solo una factura de ingreso PUE vigente se marca pagada o por cobrar; una PPD se paga con su complemento de pago (type P). */
	InvoiceNotMarkable: "invoice_not_markable",
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
	/** La llave es de un entorno de prueba y la solicitud es de toda la cuenta (como crear o borrar entornos): use una llave de pruebas de la cuenta. */
	KeyInSandbox: "key_in_sandbox",
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
	/** Mandó un campo o un parámetro de la URL que no existe (casi siempre un nombre mal escrito, como legalName en vez de legal_name, o ?statuss= en vez de ?status=). Nunca se ignora en silencio. */
	ParameterUnknown: "parameter_unknown",
	/** Mandó el confirmation_token de una vista previa, pero el recibo que se calcularía ahora es otro (se timbró otro recibo del empleado ese mes, cambió su salario o se actualizaron las tablas). No se timbró: pida la vista previa otra vez y mande su token nuevo. */
	PayrollCalculationChanged: "payroll_calculation_changed",
	/** Fiscalisto calcula solo la nómina ordinaria (sueldo, ISR con el subsidio para el empleo y cuotas obreras del IMSS). Aguinaldo, PTU, finiquitos, liquidaciones, pensiones y demás los calcula su sistema de nómina: timbre esos importes con POST /v1/payroll_receipts/external. param dice qué campo lo pidió. */
	PayrollCalculationUnsupported: "payroll_calculation_unsupported",
	/** El recibo de nómina no se puede calcular o timbrar con esos datos (periodo, días, registro patronal del emisor…). En un recibo calculado por su sistema (/v1/payroll_receipts/external), errors trae todos los problemas, cada uno con su param, code (missing, not_allowed, invalid, catalog, totals_mismatch, rule) y message. No se usó ningún timbre. */
	PayrollInvalid: "payroll_invalid",
	/** El empleado ya tiene un recibo ordinario cuyo periodo se cruza con este (invoice). Un pago adicional del periodo va como recibo extraordinario (type E); para corregir aquel, use replaces. */
	PayrollPeriodOverlap: "payroll_period_overlap",
	/** El empleado ya tiene un recibo vigente de ese periodo (ordinario) o de esa corrida (payroll_run_id, extraordinario) con otros importes. invoice es ese recibo: corríjalo con replaces o cancélelo antes. Con los mismos importes se devuelve el mismo recibo, sin error. */
	PayrollReceiptExists: "payroll_receipt_exists",
	/** replaces no es un recibo de nómina vigente del mismo emisor y del mismo empleado. */
	PayrollReplacementInvalid: "payroll_replacement_invalid",
	/** La cotización no tiene los datos fiscales del cliente: agrégueselos con POST /v1/quotes/{id} (customer) o mándela con auto_invoice para que los dé al aceptarla. */
	QuoteCustomerMissing: "quote_customer_missing",
	/** La cotización no se pudo guardar o ya no cambia (aceptada, rechazada o facturada), o no se puede mandar así. El mensaje dice por qué. */
	QuoteInvalid: "quote_invalid",
	/** Solo se borra una cotización que nunca se envió. */
	QuoteNotDraft: "quote_not_draft",
	/** La cotización se rechazó o venció: no se factura. Si venció, cámbiele valid_until (es una versión nueva). */
	QuoteNotInvoiceable: "quote_not_invoiceable",
	/** Demasiadas solicitudes con la llave. Espere lo que dice Retry-After y reintente. */
	RateLimit: "rate_limit",
	/** La factura recurrente no se pudo guardar: el día, la hora, la zona o la factura no son válidos. El mensaje dice cuál. */
	RecurringInvalid: "recurring_invalid",
	/** El emisor ya tiene el máximo de facturas recurrentes activas (25 en pruebas, 5,000 en producción). Pause o borre las que ya no use. */
	RecurringLimit: "recurring_limit",
	/** Aún no toca timbrar la factura recurrente (409): su next_invoice_on es después de hoy. Para una factura antes de tiempo, use POST /v1/invoices. */
	RecurringNotDue: "recurring_not_due",
	/** La factura recurrente está en pausa: reanúdela con active: true para timbrarla. */
	RecurringPaused: "recurring_paused",
	/** Otra solicitud con la misma Idempotency-Key sigue en proceso, o otra solicitud está cambiando el mismo objeto (dos actualizaciones del mismo cliente a la vez esperan su turno hasta 15 segundos) (409, con Retry-After). Repítala en un momento con la misma llave: contestará lo mismo. */
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
	/** No se pudo crear el entorno de prueba: falta su nombre o la cuenta ya tiene 25 (borre uno que ya no use). */
	SandboxInvalid: "sandbox_invalid",
	/** Las declaraciones de ese emisor se consultaron en el SAT hace menos de 10 minutos (cada consulta entra al SAT con su e.firma). Retry-After dice cuántos segundos faltan; lo que ya trajo está en GET /v1/sat_declarations. */
	SatRefreshTooSoon: "sat_refresh_too_soon",
	/** El SAT rechazó la solicitud de descarga. El mensaje trae su motivo, por ejemplo que ya se pidió el mismo periodo con los mismos filtros demasiadas veces (el SAT pone un límite de por vida). */
	SatRequestRejected: "sat_request_rejected",
	/** El SAT no contestó o no dejó entrar con la e.firma del emisor. El mensaje trae lo que dijo; no se usó ningún timbre. Reintente en 10 minutos. */
	SatUnavailable: "sat_unavailable",
	/** Demasiados timbres seguidos del mismo emisor. Espere lo que dice Retry-After; para muchas facturas use POST /v1/invoice_batches. */
	StampRateLimit: "stamp_rate_limit",
	/** Esa tienda ya está conectada a este emisor. */
	StoreAlreadyConnected: "store_already_connected",
	/** La tienda no aceptó la conexión o no respondió como se esperaba (llaves equivocadas, permisos read_orders/write_orders que faltan, una tienda que no vende en pesos). El mensaje dice qué contestó. */
	StoreConnectionFailed: "store_connection_failed",
	/** La tienda se desconectó: conéctela otra vez con POST /v1/store_connections. */
	StoreDisconnected: "store_disconnected",
	/** El vendedor aún no autoriza la conexión en authorize_url. */
	StoreNotAuthorized: "store_not_authorized",
	/** Esa plataforma aún no está disponible en Fiscalisto. */
	StorePlatformUnavailable: "store_platform_unavailable",
	/** Los complementos de pago y las notas de crédito no se sustituyen: se cancelan y se emite otro. Un recibo de nómina se sustituye con POST /v1/payroll_receipts/external y replaces. */
	SubstitutionUnsupported: "substitution_unsupported",
	/** El reloj se está adelantando en otra solicitud (409, con Retry-After). Espere a test_clock.ready y repita. */
	TestClockAdvancing: "test_clock_advancing",
	/** El emisor ya tiene un reloj de prueba: adelántelo, o bórrelo para volver a la hora real. */
	TestClockExists: "test_clock_exists",
	/** frozen_time no sirve: no es una fecha y hora ISO 8601, es anterior a la hora del reloj (solo avanza) o va más de dos años adelante de la hora real. */
	TestClockInvalid: "test_clock_invalid",
	/** El emisor no tiene reloj de prueba: créelo con POST /v1/issuers/{id}/test_clock. */
	TestClockMissing: "test_clock_missing",
	/** Los relojes de prueba son de emisores de prueba: use su llave fk_test_ y un emisor de pruebas. */
	TestClockUnsupported: "test_clock_unsupported",
	/** Esto solo existe en pruebas (como reiniciar los datos de prueba): use su llave fk_test_. */
	TestModeOnly: "test_mode_only",
	/** Ese folio ya está registrado para el emisor con otro total o con otra propina (409). Con el mismo total se contesta el ticket que ya existe. */
	TicketFolioTaken: "ticket_folio_taken",
	/** El ticket no se pudo registrar: el folio trae caracteres no válidos, la fecha de venta está en el futuro o es de hace más de un año, el producto ya no está en el catálogo… El mensaje dice cuál. */
	TicketInvalid: "ticket_invalid",
	/** El ticket ya se facturó o entró en una factura global: no se puede cancelar. */
	TicketNotPending: "ticket_not_pending",
	/** La API no contestó a tiempo (connection_error). Con lo que timbra, repita con la misma Idempotency-Key para saber si se timbró. */
	Timeout: "timeout",
	/** Mande el cuerpo con Content-Type: application/json. */
	UnsupportedContentType: "unsupported_content_type",
} as const;

/** Un código de error de la API. */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
