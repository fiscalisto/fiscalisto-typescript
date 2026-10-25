// Generado por `bun run openapi` desde la especificación OpenAPI de la API: no lo edite.

import { type Client, Core, type List, type RequestOptions } from "./core.js";

/** La cuenta API de la llave que hizo la solicitud. */
export interface Account {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "account";
	/** El nombre de la cuenta API. */
	name: string;
	/** La versión de la API de la cuenta (la de sus solicitudes sin Fiscalisto-Version). Ver Versiones. */
	api_version: string;
	/** La versión más reciente de la API. */
	latest_api_version: string;
	/** La llave con que se hizo la solicitud: id, nombre y emisores a los que se limita. */
	key: {
		/** Id de la llave. */
		id: string;
		/** Nombre de la llave. */
		name: string;
		/** Emisores a los que se limita la llave; null si puede usar todos. */
		issuers: string[] | null;
		/** true si la llave solo consulta (key_read_only en lo demás). */
		read_only: boolean;
		/** Cuándo deja de funcionar: la vigencia elegida al crearla, o el fin del traslape al cambiarla. null si no vence. */
		expires_at: string | null;
		/** El entorno de prueba (sbx_…) de la llave: solo ve sus emisores, webhooks y eventos. null si es de la cuenta. */
		sandbox: string | null;
	};
}

/** Timbres de producción de la cuenta, por paquete, el que vence antes primero. */
export interface Balance {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "balance";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Timbres disponibles en total. */
	available: number;
	/** true si la cuenta timbra sin usar timbres. */
	unlimited: boolean;
	/** Con esta cantidad o menos llega balance.low (y otra vez al acabarse). Se elige en Desarrolladores › Timbres. */
	low_balance_at: number;
	/** La recarga automática con la tarjeta guardada, o null si está apagada. */
	auto_recharge: {
		/** Timbres del paquete que se compra. */
		timbres: number;
		/** Se compra con esta cantidad o menos. */
		at: number;
		/** Como máximo tantas compras al mes. */
		max_per_month: number;
	} | null;
	/** Los paquetes con timbres, el que vence antes primero (en ese orden se usan). */
	packs: {
		/** Timbres del paquete. */
		timbres: number;
		/** Los que le quedan. */
		remaining: number;
		/** Cuándo se compró. */
		purchased_at: string | null;
		/** Cuándo vencen; null si no vencen. */
		expires_at: string | null;
	}[];
}

/** Un emisor: un RFC que timbra desde su cuenta API. */
export interface Issuer {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "issuer";
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name: string | null;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system: string | null;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string | null;
	/** active: puede timbrar. needs_certificate: falta su CSD. needs_efirma: falta firmar una vez el contrato con el PAC con su e.firma (solo en producción). certificate_expired: su CSD venció. archived: archivado. */
	status: "active" | "needs_certificate" | "certificate_expired" | "needs_efirma" | "archived";
	/** Qué le falta al emisor para timbrar, y cómo dárselo. */
	requirement: string | null;
	/** El sello digital (CSD) cargado: número de serie y vencimiento. */
	certificate: {
		/** Número de serie (NoCertificado). */
		serial_number: string | null;
		/** Cuándo vence. */
		expires_at: string | null;
	} | null;
	/** Si puede pedirle al SAT sus facturas (POST /v1/sat_downloads): available es true en pruebas, y en producción mientras su e.firma guardada esté vigente (efirma_expires_at). */
	sat_downloads: {
		/** true si puede pedir descargas al SAT ahora: siempre en pruebas; en producción con su e.firma guardada y vigente. */
		available: boolean;
		/** Cuándo vence la e.firma guardada para las descargas, o null si no hay una. */
		efirma_expires_at: string | null;
	};
	/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
	employer_registration: string | null;
	/** CURP, 18 caracteres. */
	curp: string | null;
	/** RFC con el que se timbra: el del emisor en producción y el de pruebas del SAT (EKU9003173C9) en pruebas. */
	stamps_as: string;
	/** El entorno de prueba (sbx_…) al que pertenece, o null si es de la cuenta. Vea /v1/sandboxes. */
	sandbox: string | null;
	/** Su reloj de prueba (solo emisores de prueba): la hora que es «hoy» para él, o null si va con la hora real. Vea POST /v1/issuers/{id}/test_clock. */
	test_clock: {
		/** La hora del reloj. */
		frozen_time: string;
	} | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Cuándo se archivó (ya no timbra), o null. */
	archived_at: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata: Record<string, string>;
}

/** Un concepto, con los mismos campos con que se mandó. */
export type InvoiceItem = Record<string, unknown>;

/** Un CFDI 4.0 emitido: factura de ingreso o global, traslado, nota de crédito (E), complemento de pago (P) o recibo de nómina (N). */
export interface Invoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "invoice";
	/** El emisor (iss_…). */
	issuer: string;
	/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
	type: "I" | "E" | "P" | "T" | "N";
	/** processing: el PAC no ha contestado (se resuelve sola; escuche invoice.stamped). valid: timbrada. pending: timbrada con una cancelación en espera del cliente. rejected: el SAT o el PAC no la aceptaron (ver error). canceled: cancelada. */
	status: "processing" | "pending" | "valid" | "rejected" | "canceled";
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string | null;
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series: string | null;
	/** Folio (Folio). Fiscalisto asigna el siguiente de la serie; mande uno solo si debe ser ese. */
	folio: string | null;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string | null;
	/** Cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos en un objeto. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
		/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
		tax_system?: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip?: string;
		/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
		foreign?: Record<string, unknown>;
	};
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use: string | null;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form: string | null;
	/** Método de pago (MetodoPago): PUE (una sola exhibición, por omisión) o PPD (en parcialidades o diferido, se cobra con complementos de pago). */
	payment_method: string | null;
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency: string;
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate: number | null;
	/** Conceptos (Conceptos), al menos uno. */
	items: InvoiceItem[];
	/** Suma de los importes antes de impuestos y descuentos (SubTotal). */
	subtotal: number | null;
	/** Descuento (Descuento). */
	discount: number | null;
	/** Impuestos del comprobante, por tipo. */
	taxes: {
		/** IVA trasladado. */
		iva: number | null;
		/** IEPS trasladado. */
		ieps: number | null;
		/** IVA retenido. */
		iva_withheld: number | null;
		/** ISR retenido. */
		isr_withheld: number | null;
		/** Impuestos locales trasladados. */
		local_transferred: number | null;
		/** Impuestos locales retenidos. */
		local_withheld: number | null;
	} | null;
	/** Total en la moneda del comprobante (Total). */
	total: number | null;
	/** Si ya se cobró (Cuentas por cobrar): paid, partial (complementos de pago o notas de crédito por una parte) o unpaid. Una PUE está paid, salvo con paid_later hasta POST /v1/invoices/{id}/mark_paid. null si no es de ingreso o no está vigente. */
	payment_status: "paid" | "partial" | "unpaid" | null;
	/** Lo que falta por cobrar, en su moneda, o null. */
	amount_due: number | null;
	/** Lo cobrado: complementos de pago y notas de crédito vigentes, o todo si es PUE pagada. null si no aplica. */
	amount_paid: number | null;
	/** CFDI relacionados (CfdiRelacionados): tipo de relación de c_TipoRelacion y los UUID. */
	related: Record<string, unknown> | null;
	/** Solo en un complemento de pago (type P). */
	payment?: {
		/** Fecha del pago (FechaPago). */
		date: string | null;
		/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
		payment_form: string | null;
		/** Moneda del pago (MonedaP). */
		currency: string;
		/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
		exchange_rate: number | null;
		/** Monto del pago (Monto). */
		amount: number;
		/** Número de operación del pago (NumOperacion), como el rastreo SPEI. */
		operation_number: string | null;
		/** Las facturas que paga (DoctoRelacionado). */
		documents: {
			/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
			uuid: string;
			/** Serie de la factura pagada. */
			series: string | null;
			/** Folio de la factura pagada. */
			folio: string | null;
			/** Moneda de la factura pagada (MonedaDR). */
			currency: string;
			/** Número de parcialidad (NumParcialidad). */
			partiality: number;
			/** Saldo anterior de la factura (ImpSaldoAnt). */
			previous_balance: number;
			/** Lo que se paga de esa factura (ImpPagado), en la moneda de la factura. */
			amount: number;
			/** Saldo insoluto después de este pago (ImpSaldoInsoluto). */
			remaining: number;
		}[];
	} | null;
	/** Solo en un recibo de nómina (type N). */
	payroll?: {
		/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
		periodicity: string;
		/** Periodo (Periodo): mes inicial, mes final y año. */
		period: {
			/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
			start: string;
			/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
			end: string;
			/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
			payment_date: string;
		};
		/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
		days: number;
		/** El patrón (Emisor del complemento): registro patronal y CURP si es persona física. */
		employer: {
			/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
			employer_registration: string | null;
			/** CURP, 18 caracteres. */
			curp: string | null;
		};
		/** El empleado (emp_…). */
		employee: {
			/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
			id: string | null;
			/** Número de empleado (NumEmpleado). */
			number: string;
			/** CURP, 18 caracteres. */
			curp: string;
			/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
			social_security_number: string | null;
			/** Fecha de inicio de la relación laboral (FechaInicioRelLaboral), AAAA-MM-DD. */
			start_date: string;
			/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
			contract_type: string;
			/** true si es sindicalizado (Sindicalizado). */
			unionized: boolean;
			/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
			workday_type: string;
			/** Tipo de régimen (TipoRegimen): 02 sueldos y salarios. */
			regime_type: string;
			/** Departamento (Departamento). */
			department?: string | null;
			/** Puesto (Puesto). */
			position?: string | null;
			/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
			risk_class: string | null;
			/** Salario base de cotización (SalarioBaseCotApor). */
			contribution_base_salary: number | null;
			/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
			integrated_daily_salary: number | null;
			/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
			state: string;
		};
		/** Percepciones (Percepcion): sueldo y demás, gravado y exento. */
		perceptions: {
			/** Tipo de percepción (TipoPercepcion), c_TipoPercepcion: 001 sueldos… */
			type: string;
			/** Clave del patrón (Clave). */
			key: string;
			/** Concepto (Concepto). */
			concept: string;
			/** Importe gravado (ImporteGravado). */
			taxed: number;
			/** Importe exento (ImporteExento). */
			exempt: number;
		}[];
		/** Deducciones (Deduccion): ISR, cuotas IMSS y demás. */
		deductions: {
			/** Tipo de deducción (TipoDeduccion), c_TipoDeduccion: 001 IMSS, 002 ISR… */
			type: string;
			/** Clave del patrón (Clave). */
			key: string;
			/** Concepto (Concepto). */
			concept: string;
			/** Importe (Importe). */
			amount: number;
		}[];
		/** Otros pagos (OtroPago): subsidio para el empleo. */
		other_payments: {
			/** Tipo de otro pago (TipoOtroPago), c_TipoOtroPago: 002 subsidio para el empleo. */
			type: string;
			/** Clave del patrón (Clave). */
			key: string;
			/** Concepto (Concepto). */
			concept: string;
			/** Importe pagado (Importe). */
			amount: number;
			/** Subsidio causado (SubsidioCausado). */
			subsidy_caused?: number;
			/** Del subsidio causado, el ISR que evitó (no va en el XML). */
			subsidy_applied?: number;
		}[];
	};
	/** Solo en una factura global. */
	global?: Record<string, unknown>;
	/** La cancelación, si se pidió: estado, motivo, sustituto y cuándo. */
	cancellation: {
		/** pending (espera la respuesta del cliente), accepted (cancelada), rejected (el cliente la rechazó) o lapsed (venció; puede pedirla otra vez). */
		status: string | null;
		/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 nominativa en una global. */
		motive: string | null;
		/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
		substitution: string | null;
		/** Cuándo se canceló. */
		canceled_at: string | null;
	} | null;
	/** El envío por correo: a quién, con copia a quién y cuándo (null si no se ha enviado). */
	email: {
		/** A quién (correos separados por comas). */
		to: string | null;
		/** Con copia (correos separados por comas). */
		cc: string | null;
		/** Cuándo se envió. */
		sent_at: string | null;
	} | null;
	/** Por qué el SAT o el PAC no lo aceptaron: mensaje, código del SAT y texto original. */
	error: {
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
		/** Código del SAT o del PAC (CFDI40xxx). */
		sat_code: string | null;
		/** El texto original del PAC. */
		raw: string;
	} | null;
	/** La factura recurrente (rin_…) que la timbró sola, o null si se timbró con una llamada. */
	recurring_invoice: string | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata: Record<string, string>;
	/** Avisos que no impidieron timbrar (por ejemplo, el XML se guardará después). */
	warnings?: string[];
	/** Por qué no se pudo mandar el correo; el comprobante sí se timbró. */
	email_error?: string;
	/** La factura que esta sustituyó y si quedó cancelada. */
	substitutes?: {
		/** La factura sustituida (inv_…). */
		invoice: string;
		/** true si la sustituida ya quedó cancelada. */
		canceled: boolean;
		/** Por qué no se pudo cancelar la sustituida (cancélela con POST /v1/invoices/{id}/cancel). */
		cancel_error?: string;
	};
	/** La aplicación del anticipo: método, nota de aplicación y su estado. */
	advance_application?: {
		/** El anticipo, como factura (inv_…). */
		advance: string | null;
		/** El folio fiscal del anticipo. */
		advance_uuid: string;
		/** egreso (la factura completa y después una nota de crédito por el anticipo, opción A) o remanente (la factura solo por lo que falta, opción B). */
		method: "egreso" | "remanente";
		/** done (listo) o credit_note_pending (falta timbrar la nota de aplicación: repita la solicitud con la misma Idempotency-Key). */
		status: "done" | "credit_note_pending";
		/** La nota de aplicación del anticipo (inv_…), con method egreso. */
		credit_note: string | null;
		/** Por qué no se timbró la nota de aplicación (repita con la misma Idempotency-Key). */
		credit_note_error?: string;
	};
}

/** Una constancia de retenciones e información de pagos (CFDI de retenciones 2.0). */
export interface Retention {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "retention";
	/** El emisor (iss_…). */
	issuer: string;
	/** processing: el PAC no ha contestado. valid: timbrada. rejected: el SAT o el PAC no la aceptaron (ver error). canceled: cancelada. */
	status: "processing" | "valid" | "rejected" | "canceled";
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string | null;
	/** Folio (Folio). Fiscalisto asigna el siguiente de la serie; mande uno solo si debe ser ese. */
	folio: number | null;
	/** Folio interno (FolioInt): RET1, RET2… */
	internal_folio: string | null;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string | null;
	/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… */
	code: string;
	/** Descripción de la retención (DescRetenc). */
	description: string | null;
	/** Receptor de la constancia (Receptor): nacional con RFC y código postal, o extranjero. */
	recipient: {
		/** true si el receptor es extranjero (sin RFC). */
		foreign: boolean;
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
		/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
		zip?: string;
		/** CURP, 18 caracteres. */
		curp?: string | null;
	};
	/** Periodo (Periodo): mes inicial, mes final y año. */
	period: {
		/** Año (Ejercicio). */
		year: number;
		/** Mes inicial (MesIni), 1 a 12. */
		from_month: number;
		/** Mes final (MesFin), 1 a 12, del mismo año. */
		to_month: number;
	};
	/** Totales (Totales). */
	totals: {
		/** Monto total de la operación (MontoTotOperacion). */
		operation: number | null;
		/** Monto gravado (MontoTotGrav). Por omisión, operation menos exempt. */
		taxed: number | null;
		/** Monto exento (MontoTotExent). Por omisión 0. */
		exempt: number | null;
		/** Total retenido (MontoTotRet). */
		withheld: number | null;
	};
	/** Impuestos del comprobante, por tipo. */
	taxes: {
		/** Impuesto: isr, iva o ieps (ImpuestoRet 001, 002, 003). */
		tax: string;
		/** Base del impuesto retenido (BaseRet). */
		base: number;
		/** Monto retenido (MontoRet). */
		amount: number;
		/** Tipo de pago de la retención (TipoPagoRet): 01 definitivo IVA, 02 definitivo IEPS, 03 definitivo ISR, 04 provisional ISR. Por omisión el usual de cada impuesto. */
		payment_type: string;
	}[];
	/** Complemento de dividendos. */
	dividends?: Record<string, unknown>;
	/** Complemento de intereses. */
	interest?: Record<string, unknown>;
	/** Complemento de pagos a extranjeros. */
	foreign_payment?: Record<string, unknown>;
	/** La cancelación, si se pidió: estado, motivo, sustituto y cuándo. */
	cancellation: {
		/** pending (espera la respuesta del cliente), accepted (cancelada), rejected (el cliente la rechazó) o lapsed (venció; puede pedirla otra vez). */
		status: string;
		/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 nominativa en una global. */
		motive: string | null;
		/** Cuándo se canceló. */
		canceled_at: string | null;
	} | null;
	/** El envío por correo: a quién, con copia a quién y cuándo (null si no se ha enviado). */
	email: {
		/** A quién (correos separados por comas). */
		to: string | null;
		/** Cuándo se envió. */
		sent_at: string | null;
	} | null;
	/** Por qué el SAT o el PAC no lo aceptaron: mensaje, código del SAT y texto original. */
	error: {
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
		/** Código del SAT o del PAC (CFDI40xxx). */
		sat_code: string | null;
		/** El texto original del PAC. */
		raw: string;
	} | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata: Record<string, string>;
	/** Avisos que no impidieron timbrar (por ejemplo, el XML se guardará después). */
	warnings?: string[];
	/** Por qué no se pudo mandar el correo; el comprobante sí se timbró. */
	email_error?: string;
}

/** Un cliente del catálogo de un emisor. */
export interface Customer {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "customer";
	/** El emisor (iss_…). */
	issuer: string;
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name: string;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string;
	/** Correo del cliente (varios separados por comas), a donde van sus facturas. */
	email: string | null;
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use: string | null;
	/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
	foreign: {
		/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
		country: string;
		/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
		tax_id: string | null;
	} | null;
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
	ieps_taxpayer: boolean;
	/** Cuándo cambió por última vez, ISO 8601 (-06:00). */
	updated_at: string | null;
}

/** Un producto o servicio del catálogo de un emisor. */
export interface Product {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "product";
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre corto para encontrarlo, solo para usted. */
	name: string | null;
	/** Descripción que va en el CFDI (Descripcion). */
	description: string;
	/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
	product_key: string;
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
	unit_key: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price: number;
	/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
	taxability: string;
	/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
	iva: string;
	/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
	ieps: number | null;
	/** Tasa o Cuota (TipoFactor del IEPS). */
	ieps_factor: string | null;
	/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
	iva_retention: number;
	/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
	isr_retention: number;
	/** Cuándo cambió por última vez, ISO 8601 (-06:00). */
	updated_at: string | null;
}

/** Un empleado de un emisor, para sus recibos de nómina. */
export interface Employee {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "employee";
	/** El emisor (iss_…). */
	issuer: string;
	/** Número de empleado (NumEmpleado). */
	number: string;
	/** Nombre completo del empleado. */
	name: string;
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** CURP, 18 caracteres. */
	curp: string;
	/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
	social_security_number: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string;
	/** Correo del empleado, a donde van sus recibos. */
	email: string | null;
	/** Fecha de inicio de la relación laboral (FechaInicioRelLaboral), AAAA-MM-DD. */
	start_date: string;
	/** Último día trabajado si ya no trabaja ahí, AAAA-MM-DD. */
	end_date: string | null;
	/** Salario diario. */
	daily_salary: number;
	/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
	integrated_daily_salary: number;
	/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
	contract_type: string;
	/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
	workday_type: string;
	/** Tipo de régimen (TipoRegimen): 02 sueldos y salarios. */
	regime_type: string;
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity: string;
	/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
	risk_class: string;
	/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
	state: string;
	/** true si trabaja en la zona libre de la frontera norte (salario mínimo de frontera). */
	border_zone: boolean;
	/** true si es sindicalizado (Sindicalizado). */
	unionized: boolean;
	/** Departamento (Departamento). */
	department: string | null;
	/** Puesto (Puesto). */
	position: string | null;
	/** Lo que el SAT podría observar de sus datos, antes de timbrar. */
	warnings: string[];
}

/** El recibo como se timbraría: percepciones, deducciones (ISR, IMSS), otros pagos (subsidio) y el neto. */
export interface PayrollReceiptPreview {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_receipt_preview";
	/** El empleado (emp_…). */
	employee: string;
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity: string;
	/** Periodo (Periodo): mes inicial, mes final y año. */
	period: {
		/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
		start: string;
		/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
		end: string;
		/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
		payment_date: string;
	};
	/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
	days: number;
	/** Salario base de cotización (SalarioBaseCotApor). */
	contribution_base_salary: number;
	/** Percepciones (Percepcion): sueldo y demás, gravado y exento. */
	perceptions: {
		/** Tipo de percepción (TipoPercepcion), c_TipoPercepcion: 001 sueldos… */
		type: string;
		/** Clave del patrón (Clave). */
		key: string;
		/** Concepto (Concepto). */
		concept: string;
		/** Importe gravado (ImporteGravado). */
		taxed: number;
		/** Importe exento (ImporteExento). */
		exempt: number;
	}[];
	/** Deducciones (Deduccion): ISR, cuotas IMSS y demás. */
	deductions: {
		/** Tipo de deducción (TipoDeduccion), c_TipoDeduccion: 001 IMSS, 002 ISR… */
		type: string;
		/** Clave del patrón (Clave). */
		key: string;
		/** Concepto (Concepto). */
		concept: string;
		/** Importe (Importe). */
		amount: number;
	}[];
	/** Otros pagos (OtroPago): subsidio para el empleo. */
	other_payments: {
		/** Tipo de otro pago (TipoOtroPago), c_TipoOtroPago: 002 subsidio para el empleo. */
		type: string;
		/** Clave del patrón (Clave). */
		key: string;
		/** Concepto (Concepto). */
		concept: string;
		/** Importe pagado (Importe). */
		amount: number;
		/** Subsidio causado (SubsidioCausado). */
		subsidy_caused?: number;
		/** Del subsidio causado, el ISR que evitó (no va en el XML). */
		subsidy_applied?: number;
	}[];
	/** El cálculo del ISR del periodo: base, tarifa, subsidio y resultado. */
	isr: {
		/** ISR según la tarifa del periodo. */
		tariff: number;
		/** Subsidio para el empleo causado. */
		subsidy: number;
		/** ISR retenido (tarifa menos subsidio, no menos de 0). */
		withheld: number;
		/** true si gana el salario mínimo: no se le retiene ISR. */
		exempt_minimum: boolean;
		/** El ajuste de fin de mes: subsidio revertido y el ISR que retiene. */
		adjustment?: {
			/** Subsidio causado antes en el mes que se revierte. */
			reversed: number;
			/** El cálculo del ISR del periodo: base, tarifa, subsidio y resultado. */
			isr: number;
		};
	};
	/** Totales: percepciones, deducciones, otros pagos y el neto a pagar. */
	totals: {
		/** Total de sueldos, salarios y asimilados (TotalSueldos). */
		salaries: number;
		/** Total gravado (TotalGravado). */
		taxed: number;
		/** Total exento (TotalExento). */
		exempt: number;
		/** Total de percepciones (TotalPercepciones). */
		perceptions: number;
		/** Otras deducciones (TotalOtrasDeducciones). */
		other_deductions: number;
		/** Impuestos retenidos (TotalImpuestosRetenidos). */
		taxes_withheld: number;
		/** Total de deducciones (TotalDeducciones). */
		deductions: number;
		/** Total de otros pagos (TotalOtrosPagos). */
		other_payments: number;
		/** Subtotal del comprobante: percepciones más otros pagos. */
		subtotal: number;
		/** Neto a pagar al empleado. */
		net: number;
	};
}

/** Un anticipo timbrado que aún no se aplica. */
export interface Advance {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "advance";
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string;
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series: string | null;
	/** Folio (Folio). Fiscalisto asigna el siguiente de la serie; mande uno solo si debe ser ese. */
	folio: string | null;
	/** Cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos en un objeto. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** El anticipo antes de impuestos. */
	amount: number;
	/** Total en la moneda del comprobante (Total). */
	total: number;
	/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
	iva: string;
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency: string;
}

/** Un lote de hasta 1,000 facturas timbradas en segundo plano. */
export interface InvoiceBatch {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "invoice_batch";
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre del lote, para usted. */
	name: string;
	/** processing: timbrando. completed: ya no queda ninguna por timbrar. */
	status: "processing" | "completed";
	/** Cuántas facturas tiene el lote. */
	total: number;
	/** Cuántas se timbraron. */
	stamped: number;
	/** Cuántas no se timbraron (quedan con su motivo). */
	failed: number;
	/** Cuántas siguen en proceso. */
	processing?: number;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Cuándo terminó. */
	completed_at: string | null;
	/** Cada factura del lote (no viene en listas ni en eventos). */
	invoices?: {
		/** Su posición en invoices, desde 0. */
		index: number;
		/** Su identificador de esta factura (su número de pedido), hasta 100 caracteres. */
		reference: string | null;
		/** processing, valid (timbrada) o failed (no se timbró; ver error). */
		status: "processing" | "valid" | "failed";
		/** La factura timbrada (inv_…). */
		invoice: string | null;
		/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
		uuid: string | null;
		/** Total en la moneda del comprobante (Total). */
		total: number;
		/** Por qué no se timbró. */
		error: string | null;
	}[];
}

/** Una clave de un catálogo del SAT. */
export interface SatCatalogEntry {
	/** La clave en el catálogo del SAT. */
	code: string;
	/** Su descripción en el catálogo. */
	description: string;
}

/** Si un RFC aparece en las listas del SAT (69-B, 69-B Bis y art. 69). */
export interface SatListCheck {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_list_check";
	/** El RFC revisado. */
	tax_id: string;
	/** El nombre con que aparece en las listas del SAT (null si no aparece). */
	name: string | null;
	/** true si el RFC aparece en alguna lista, aunque haya desvirtuado. */
	listed: boolean;
	/** high: 69-B o 69-B Bis como presunto o definitivo (el SAT dice que simula operaciones; sus facturas no se pueden deducir). medium: una lista del art. 69 (no localizado, créditos firmes o exigibles, cancelados, sentencias, CSD sin efectos). none: no aparece, o ya desvirtuó o tiene sentencia favorable. */
	risk: "high" | "medium" | "none";
	/** Cada lista en que aparece; vacía si no aparece en ninguna. */
	lists: {
		/** 69b: art. 69-B (operaciones simuladas). 69b_bis: art. 69-B Bis (pérdidas fiscales). 69: art. 69 (no localizados, adeudos, cancelados). */
		list: "69" | "69b" | "69b_bis";
		/** El archivo del SAT de donde viene (clave). */
		source: string;
		/** El nombre del archivo del SAT, para mostrarlo. */
		source_name: string;
		/** Su situación según el SAT: Presunto, Definitivo, Desvirtuado, Sentencia favorable; en el art. 69, el supuesto (null si el archivo no la trae). */
		situation: string | null;
		/** Fecha de publicación en el SAT o en el DOF (null si no la trae). */
		published_on: string | null;
		/** Lo demás que publica el SAT para ese RFC (oficios, fechas, montos), tal cual; null si nada. */
		details: Record<string, string> | null;
	}[];
	/** Cuándo se actualizaron las listas por última vez (cada día a las 00:00 de la Ciudad de México). */
	lists_updated_at: string | null;
}

/** Si los datos fiscales de un cliente van a pasar el SAT. */
export interface TaxIdValidation {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "tax_id_validation";
	/** El RFC revisado. */
	tax_id: string;
	/** company (persona moral, 12 caracteres), person (persona física, 13) o generic (XAXX010101000, XEXX010101000). */
	kind: "company" | "person" | "generic";
	/** true si no hay errores: con lo que mandó, el SAT no debería rechazar la factura por los datos del cliente. */
	valid: boolean;
	/** true si se comparó con el registro del SAT (mandó cif_id y el SAT contestó). */
	checked_with_sat: boolean;
	/** Lo que haría que el SAT rechace la factura. Cada uno con el campo (param), un código, la explicación y, si se puede, el valor correcto (suggestion). */
	errors: {
		/** El campo: tax_id, legal_name, tax_system, zip, use o cif_id. */
		param: string;
		/** Qué falló, para su código: tax_id_format, tax_id_date, legal_name_capital_regime, legal_name_mismatch, tax_system_person, tax_system_mismatch, zip_unknown, zip_mismatch, use_tax_system, cif_id_not_found… */
		code: string;
		/** La explicación, para mostrarla a su usuario. */
		message: string;
		/** El valor correcto cuando se sabe (el del SAT con cif_id, o el nombre sin régimen de capital); null si no. */
		suggestion: string | null;
	}[];
	/** Lo que no impide timbrar pero conviene revisar: el dígito verificador, mayúsculas, si el RFC está en las listas del SAT. */
	warnings: {
		/** El campo. */
		param: string;
		/** tax_id_check_digit, legal_name_format, tax_id_listed_69b o tax_id_listed_69. */
		code: string;
		/** La explicación. */
		message: string;
		/** El valor sugerido, o null. */
		suggestion: string | null;
	}[];
	/** Lo que tiene el SAT en la constancia (con cif_id): nombre, código postal y regímenes vigentes. null sin cif_id. */
	sat_record: {
		/** El nombre o razón social, como lo tiene el SAT. */
		legal_name: string | null;
		/** El código postal de su domicilio fiscal. */
		zip: string | null;
		/** Sus regímenes vigentes (c_RegimenFiscal). */
		tax_systems: string[];
	} | null;
	/** Si el SAT no contestó a tiempo (con cif_id): reintente en unos minutos. null si contestó o no se consultó. */
	sat_error: string | null;
	/** Si el RFC aparece en las listas del SAT. null con un RFC genérico o mal escrito. */
	sat_lists: SatListCheck | null;
}

/** Una liga para que un cliente dé sus datos fiscales. */
export interface CustomerDataRequest {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "customer_data_request";
	/** El emisor que le va a facturar. */
	issuer: string;
	/** open (la liga espera), completed (el cliente mandó sus datos), expired (venció) o canceled. */
	status: "open" | "completed" | "expired" | "canceled";
	/** La liga para su cliente, en fiscalisto.com. null cuando ya no está abierta. */
	url: string | null;
	/** Su id para este cliente o pedido. */
	reference: string | null;
	/** Lo que el cliente ve arriba del formulario. */
	description: string | null;
	/** Cuándo deja de servir la liga. */
	expires_at: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
	/** Lo que mandó el cliente (el último envío: puede corregirlo en las 24 horas siguientes). null mientras no conteste. */
	submission: {
		/** Su RFC. */
		tax_id: string;
		/** Su nombre o razón social, como en su constancia. */
		legal_name: string;
		/** Su régimen fiscal (c_RegimenFiscal). */
		tax_system: string;
		/** El código postal de su domicilio fiscal. */
		zip: string;
		/** El uso del CFDI que eligió (c_UsoCFDI). */
		use: string;
		/** Su correo para recibir facturas, si lo dio. */
		email: string | null;
		/** constancia (leído de su constancia o del SAT con su idCIF) o manual (escrito). */
		source: "constancia" | "manual";
		/** El cliente (cus_…) en el catálogo del emisor: el nuevo, o el que ya existía con ese RFC. */
		customer: string | null;
		/** true si quedó en el catálogo. false si el cliente ya existía con otros datos: aplíquelos con POST /v1/customers/{id} si son correctos. */
		applied: boolean;
		/** Cuándo los mandó. */
		submitted_at: string | null;
	} | null;
}

/** Lo que se borró (y se creó) al reiniciar los datos de prueba. */
export interface TestDataReset {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "test_data_reset";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: false;
	/** Cuántos emisores de pruebas se vaciaron (archivados incluidos). */
	issuers: number;
	/** Cuántos registros se borraron: facturas, clientes, productos, lotes, ligas, descargas… */
	deleted_rows: number;
	/** Cuántos eventos de pruebas se borraron (con sus entregas). */
	deleted_events: number;
	/** Clientes de ejemplo creados (con seed). */
	customers_created: number;
	/** Productos de ejemplo creados (con seed). */
	products_created: number;
}

/** Un entorno de prueba: el modo de pruebas propio de una persona, con su emisor, llaves, webhooks y eventos aparte. */
export interface Sandbox {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sandbox";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: false;
	/** Nombre. */
	name: string;
	/** Emisores activos en el entorno. */
	issuers: number;
	/** El emisor de pruebas del SAT con que nace (solo al crearlo). */
	issuer?: Issuer | null;
	/** Solo al crearlo. */
	key?: {
		/** Id de la llave. */
		id: string;
		/** La llave fk_test_… del entorno. Solo se ve esta vez: guárdela. */
		secret: string;
	};
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Siempre true. */
	deleted?: boolean;
}

/** El reloj de prueba de un emisor de pruebas: su «hoy», que solo avanza cuando usted lo adelanta, haciendo día por día lo que toca. */
export interface TestClock {
	/** clk_ y la clave del emisor. */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "test_clock";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: false;
	/** El emisor de pruebas que vive en esta hora. */
	issuer: string;
	/** La hora del reloj: el «hoy» del emisor para sus facturas recurrentes, cotizaciones, cuentas por cobrar y tickets. */
	frozen_time: string;
	/** advancing mientras una solicitud lo adelanta; ready en cualquier otro momento. */
	status: "ready" | "advancing";
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Al adelantarlo: lo que se hizo en el camino. */
	advanced?: {
		/** Facturas recurrentes timbradas en el camino. */
		recurring_invoices: number;
		/** Cotizaciones que vencieron en el camino. */
		quotes_expired: number;
		/** Facturas globales de tickets timbradas en el camino. */
		global_invoices: number;
	};
	/** true si se detuvo antes de requested_time porque ya timbró 25 comprobantes en esta solicitud: adelántelo otra vez para seguir. */
	stopped_early?: boolean;
	/** A dónde se pidió adelantarlo (con stopped_early). */
	requested_time?: string;
	/** Siempre true. */
	deleted?: boolean;
}

/** Una solicitud al SAT de las facturas emitidas o recibidas de un emisor en un periodo. */
export interface SatDownload {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_download";
	/** El emisor cuyas facturas se piden. */
	issuer: string;
	/** received (las que le hicieron) o issued (las que emitió). */
	direction: "received" | "issued";
	/** Desde qué día (incluido). */
	from: string | null;
	/** Hasta qué día (incluido). */
	to: string | null;
	/** El tipo de comprobante pedido, o null si todos. */
	type: "I" | "E" | "P" | "T" | "N" | null;
	/** El RFC de la contraparte pedido, o null. */
	counterparty_tax_id: string | null;
	/** El folio fiscal pedido, o null. */
	uuid: string | null;
	/** processing (el SAT la está preparando: de minutos a horas), completed (las facturas ya están en GET /v1/sat_invoices) o failed (el motivo en error). */
	status: "processing" | "completed" | "failed";
	/** Cuántas facturas nuevas trajo (las que ya tenía no cuentan). null mientras no termine. */
	new_invoices: number | null;
	/** Por qué falló, como lo dijo el SAT. null si no falló. */
	error: string | null;
	/** Cuándo se pidió. */
	created_at: string | null;
	/** Cuándo terminó, o null. */
	completed_at: string | null;
}

/** Una factura que el SAT tiene del emisor, emitida o recibida, traída con una descarga. */
export interface SatInvoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_invoice";
	/** El emisor de su cuenta (iss_…) a quien pertenece esta factura. */
	issuer: string;
	/** El folio fiscal (UUID del timbre). */
	uuid: string;
	/** received (se la hicieron al emisor) o issued (la emitió). */
	direction: "received" | "issued";
	/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
	type: "I" | "E" | "P" | "T" | "N" | null;
	/** La fecha del comprobante (Fecha), en la hora local con que se emitió. */
	date: string;
	/** Serie (Serie), o null. */
	series: string | null;
	/** Folio (Folio), o null. */
	folio: string | null;
	/** Quien la emitió (Emisor). */
	issued_by: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** A quien se la emitieron (Receptor). */
	issued_to: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** Moneda (Moneda): MXN, USD… */
	currency: string | null;
	/** Tipo de cambio (TipoCambio), o null en pesos. */
	exchange_rate: number | null;
	/** Método de pago (MetodoPago): PUE o PPD. */
	payment_method: string | null;
	/** Forma de pago (FormaPago), clave de c_FormaPago. */
	payment_form: string | null;
	/** Uso del CFDI (UsoCFDI). */
	use: string | null;
	/** Subtotal (SubTotal). */
	subtotal: number | null;
	/** Total (Total). */
	total: number | null;
	/** Impuestos del comprobante: trasladados (iva, ieps), retenidos (iva_withheld, isr_withheld, ieps_withheld) y locales. */
	taxes: {
		/** IVA trasladado. */
		iva: number;
		/** IEPS trasladado. */
		ieps: number;
		/** IVA retenido. */
		iva_withheld: number;
		/** ISR retenido. */
		isr_withheld: number;
		/** IEPS retenido. */
		ieps_withheld: number;
		/** Impuestos locales trasladados (ISH y similares). */
		local_transferred: number;
		/** Impuestos locales retenidos. */
		local_withheld: number;
	};
	/** Su estado en el SAT cuando se revisó: active (vigente) o canceled. null si aún no se revisa. */
	sat_status: "active" | "canceled" | null;
	/** La descarga (sdl_…) que la trajo, o null. */
	sat_download: string | null;
	/** Cuándo llegó. */
	downloaded_at: string | null;
}

/** Una venta que su comprador puede facturar él mismo en el portal del emisor (autofactura). */
export interface Ticket {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "ticket";
	/** El emisor que vendió. */
	issuer: string;
	/** El folio de la venta en su sistema. */
	folio: string;
	/** Lo que su comprador escribe en el portal junto con el total: el folio y 4 caracteres al azar (A123-K7QX). Imprímalo en el ticket o mándelo con la compra. */
	code: string;
	/** pending (se puede facturar), invoiced (su comprador lo facturó: la factura en invoice), global (entró en la factura global del periodo) o cancelled. */
	status: "pending" | "invoiced" | "global" | "cancelled";
	/** La página del portal con el código ya escrito: el comprador pone el total y sus datos. Puede incrustarla con fiscalisto.js. null si ya no está pendiente. */
	url: string | null;
	/** Lo que se cobró, impuestos incluidos y sin propina. */
	total: number;
	/** La propina (no va en la factura). */
	tip: number;
	/** c_FormaPago de la venta. */
	payment_form: string;
	/** El concepto de la factura. */
	description: string;
	/** c_ClaveProdServ del concepto. */
	product_key: string;
	/** Cuándo se vendió. */
	sold_at: string;
	/** El último día (AAAA-MM-DD) en que el comprador puede facturarlo; después entra en la factura global. */
	invoiceable_until: string;
	/** La factura (inv_…) que hizo su comprador, o null. */
	invoice: string | null;
	/** La factura global (inv_…) en que entró, o null. */
	global_invoice: string | null;
	/** A quién se facturó, o null. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	} | null;
	/** Cuándo se registró. */
	created_at: string | null;
}

/** El portal de autofactura de un emisor y sus reglas. */
export interface SelfInvoicing {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "self_invoicing";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El portal permanente del emisor: ahí cualquier comprador factura con su código y su total. */
	portal_url: string;
	/** month: se factura hasta el fin del mes de la venta. days: hasta window_days días después. */
	window: "month" | "days";
	/** Días para facturar con window: days. */
	window_days: number;
	/** Cada cuánto se timbra sola la factura global con lo que nadie facturó: 01 diaria, 02 semanal, 03 quincenal, 04 mensual. */
	global_periodicity: "01" | "02" | "03" | "04";
}

/** Una factura que el emisor timbra solo, cada mes, semana o día. */
export interface RecurringInvoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "recurring_invoice";
	/** El emisor (iss_…). */
	issuer: string;
	/** Para reconocerla. */
	name: string;
	/** active (timbra en cada fecha) o paused. */
	status: "active" | "paused";
	/** Cada cuánto: frequency (monthly, weekly o daily), interval, day_of_month (con monthly; "last" es el último del mes), y la hora (hour, en time_zone) en que se timbra. */
	schedule: {
		/** monthly: cada interval meses en day_of_month. weekly o daily: cada interval semanas o días. */
		frequency: "monthly" | "weekly" | "daily";
		/** Cada cuántos meses, semanas o días. */
		interval: number;
		/** Con monthly: el día del mes, del 1 al 28, o "last" (el último). null con weekly o daily. */
		day_of_month: number | "last" | null;
		/** La hora (0 a 23) en que se timbra, en time_zone. */
		hour: number;
		/** La zona de esa hora (America/Mexico_City, America/Cancun…). */
		time_zone: string;
	};
	/** La fecha (AAAA-MM-DD) de la siguiente factura. */
	next_invoice_on: string;
	/** La fecha del último periodo que timbró, o null si aún no timbra ninguna. */
	last_invoiced_on: string | null;
	/** La última factura (inv_…) que timbró, o null. */
	last_invoice: string | null;
	/** Por qué no se pudo timbrar la última vez (sin timbres, el cliente borrado, el SAT la rechazó…), o null. Se vuelve a intentar a la siguiente hora del día siguiente; también llega recurring_invoice.failed. */
	last_error: {
		/** Qué pasó. */
		message: string | null;
	} | null;
	/** Si cada factura se manda al correo del cliente. */
	send_email: boolean;
	/** Si quedaron periodos sin timbrar: all los timbra todos, latest solo el más reciente. */
	catch_up: "all" | "latest";
	/** A quién se factura. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** La moneda de la factura. */
	currency: string;
	/** Los conceptos, con description tal como se guardó ({mes}, {año}… se llenan en cada factura). */
	items: {
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
		unit_key?: string;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number;
	}[];
	/** El total de cada factura con los precios de hoy. */
	total: number | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** La póliza de diario de un CFDI: sus cargos y abonos, que siempre cuadran. */
export interface JournalEntry {
	/** El número de la póliza: D-AAAAMM-NNNNN, en orden de fecha dentro del mes. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "journal_entry";
	/** El emisor. */
	issuer: string;
	/** La fecha del CFDI. */
	date: string;
	/** Factura o nota de crédito, su folio y la contraparte. */
	description: string;
	/** La factura (inv_…) si la timbró este emisor; null si la recibió. */
	invoice: string | null;
	/** El folio fiscal del CFDI. */
	uuid: string;
	/** El RFC de la contraparte (cliente o proveedor). */
	tax_id: string;
	/** El total del CFDI, en su moneda. */
	total: number;
	/** La moneda del CFDI. */
	currency: string;
	/** El tipo de cambio, si no es en pesos; null si es en pesos. */
	exchange_rate: number | null;
	/** Los movimientos, en pesos: el cargo (debit) o abono (credit) a cada cuenta. */
	lines: {
		/** El número de cuenta. */
		account: string;
		/** El nombre de la cuenta. */
		account_name: string;
		/** Su código agrupador del SAT. */
		grouping_code: string;
		/** El cargo, en pesos. */
		debit: number;
		/** El abono, en pesos. */
		credit: number;
	}[];
}

/** Una cuenta del catálogo, con su código agrupador del SAT. */
export interface LedgerAccount {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "ledger_account";
	/** El número de cuenta (NumCta). */
	number: string;
	/** Su nombre. */
	name: string;
	/** El código agrupador del SAT (Anexo 24). */
	grouping_code: string;
	/** debit (deudora) o credit (acreedora). */
	nature: "debit" | "credit";
}

/** La balanza de comprobación de un mes. */
export interface TrialBalance {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "trial_balance";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** Cuántas pólizas tuvo el mes. */
	journal_entries: number;
	/** Cada cuenta con movimiento o saldo: saldo inicial, cargos, abonos y saldo final. */
	accounts: {
		/** Qué tipo de objeto es («invoice», «customer»…). */
		object: "ledger_account";
		/** Número de empleado (NumEmpleado). */
		number: string;
		/** Nombre. */
		name: string;
		/** El código agrupador del SAT. */
		grouping_code: string;
		/** debit (deudora) o credit (acreedora). */
		nature: "debit" | "credit";
		/** El saldo al empezar el mes. */
		opening_balance: number;
		/** Los cargos del mes. */
		debit: number;
		/** Los abonos del mes. */
		credit: number;
		/** El saldo al terminar el mes. */
		closing_balance: number;
	}[];
	/** Cargos y abonos del mes: siempre iguales. */
	totals: {
		/** Todos los cargos del mes. */
		debit: number;
		/** Todos los abonos del mes. */
		credit: number;
	};
}

/** La DIOT de un mes: lo pagado a cada proveedor, por tipo de operación. */
export interface Diot {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "diot";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** La proporción de IVA acreditable del mes para gastos comunes (1 si no la aplica). */
	proportion: number;
	/** Una línea por proveedor y tipo de operación, con lo pagado en el mes. */
	lines: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre. */
		name: string | null;
		/** Tipo de tercero: 04 nacional, 05 extranjero, 15 global. */
		third_party_type: "15" | "04" | "05";
		/** Tipo de operación: 02 enajenación de bienes, 03 servicios profesionales, 06 uso o goce temporal, 07 importación, 85 otros, 87 operaciones globales. */
		operation_type: "85" | "87" | "02" | "03" | "06" | "07";
		/** Lo pagado en el mes por tasa, en pesos, con su IVA. */
		paid: {
			/** Valor de los actos al 16 %. */
			base_16: number;
			/** Valor de los actos al 8 % (región fronteriza). */
			base_8: number;
			/** Valor de los actos al 0 %. */
			base_0: number;
			/** Valor de los actos exentos. */
			exempt: number;
			/** Valor de los actos no objeto de IVA. */
			not_taxable: number;
			/** El IVA de esos actos. */
			vat: number;
		};
		/** Las devoluciones (notas de crédito) del mes, por tasa. */
		returns: {
			/** Valor de los actos al 16 %. */
			base_16: number;
			/** Valor de los actos al 8 % (región fronteriza). */
			base_8: number;
			/** Valor de los actos al 0 %. */
			base_0: number;
			/** Valor de las devoluciones exentas. */
			exempt: number;
			/** Valor de los actos no objeto de IVA. */
			not_taxable: number;
			/** El IVA de esos actos. */
			vat: number;
		};
		/** El proveedor está en la lista 69-B definitiva: revise si deduce sus CFDI. */
		blacklisted: boolean;
	}[];
	/** Lo que conviene revisar antes de presentarla. */
	warnings: string[];
}

/** Una tienda de Shopify o Mercado Libre cuyos pedidos pagados se vuelven tickets de autofactura del emisor. */
export interface StoreConnection {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "store_connection";
	/** El emisor dueño de la tienda. */
	issuer: string;
	/** shopify o mercadolibre. */
	platform: "shopify" | "mercadolibre";
	/** El dominio de la tienda de Shopify, o el id del vendedor en Mercado Libre (al autorizar). */
	shop: string | null;
	/** pending (Mercado Libre espera que el vendedor autorice en authorize_url), active o disconnected. */
	status: "pending" | "active" | "disconnected";
	/** Si está pending: la página de Mercado Libre donde el vendedor autoriza (vale un día; cada consulta da una nueva). Si no, null. */
	authorize_url: string | null;
	/** Cómo se vuelve ticket cada pedido. */
	settings: {
		/** c_ClaveProdServ de lo que vende, o null. */
		product_key: string | null;
		/** c_ClaveUnidad, o null (la de la clave del producto). */
		unit_key: string | null;
		/** Tasa de IVA incluida en los precios. */
		iva: "0" | "0.16" | "0.08" | "exento";
		/** El concepto fijo de cada ticket, o null (el pedido y sus artículos). */
		description: string | null;
		/** Lo que va antes del número del pedido en el folio. */
		folio_prefix: string;
		/** c_FormaPago cuando la del pedido no está en payment_forms, o null. */
		payment_form: string | null;
		/** c_FormaPago por pasarela o tipo de pago. */
		payment_forms: Record<string, string>;
		/** Mercado Libre: si se timbra al momento con los datos fiscales del comprador; null en Shopify. */
		auto_invoice: boolean | null;
	};
	/** Cuántos pedidos se han vuelto tickets. */
	orders_count: number;
	/** Cuándo llegó el último, o null. */
	last_order_at: string | null;
	/** El último problema (un pedido en dólares, un ticket que ya se facturó cuando se canceló el pedido…), o null. */
	last_error: {
		/** Qué pasó. */
		message: string;
		/** Cuándo. */
		at: string | null;
	} | null;
	/** Cuándo se conectó. */
	created_at: string | null;
}

/** Los pedidos pagados que se trajeron. */
export interface StoreImport {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "store_import";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** La conexión (stc_…). */
	store_connection: string;
	/** Desde qué día se buscaron pedidos. */
	since: string;
	/** Pedidos que son tickets (los que ya lo eran cuentan otra vez). */
	tickets: number;
	/** De ellos, los que se facturaron al momento con los datos del comprador. */
	invoiced: number;
	/** Los que no se volvieron ticket, con el motivo. */
	skipped: {
		/** El pedido. */
		order: string;
		/** Por qué no se volvió ticket. */
		reason: string;
	}[];
}

/** Una cotización: su cliente la ve en una liga, la acepta, pide cambios o la rechaza, y se factura. */
export interface Quote {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "quote";
	/** El emisor (iss_…). */
	issuer: string;
	/** Su serie y folio, como lo ve el cliente (COT-12). */
	number: string;
	/** Cambiar una ya enviada hace una versión nueva con el mismo número; el id contesta siempre la última. */
	version: number;
	/** draft, sent, viewed (el cliente abrió la liga), accepted, rejected, expired (pasó valid_until) o invoiced. */
	status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired" | "invoiced";
	/** La liga donde el cliente la ve, descarga su PDF, la acepta, pide cambios o la rechaza; null mientras sea borrador. */
	url: string | null;
	/** A quién va: tax_id null si aún no tiene sus datos fiscales; catalog_id es su cliente (cus_…) en su catálogo, o null. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Nombre. */
		name: string | null;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email: string | null;
		/** El cliente (cus_…) en su catálogo, o null si no está en él. */
		catalog_id: string | null;
	};
	/** La moneda. */
	currency: string;
	/** Los conceptos, como los de una factura. */
	items: {
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
		unit_key?: string;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number;
	}[];
	/** El total con impuestos. */
	total: number | null;
	/** Su último día de validez (AAAA-MM-DD). */
	valid_until: string;
	/** Las condiciones impresas: entrega, anticipo, garantía… */
	terms: string | null;
	/** Las notas, como las de una factura. */
	notes: string | null;
	/** Si al aceptarla se timbra la factura sola. */
	auto_invoice: boolean;
	/** Lo que escribió el cliente al pedir cambios o al rechazarla, o null. */
	customer_comment: string | null;
	/** Cuándo se envió. */
	sent_at: string | null;
	/** Cuándo el cliente abrió la liga por primera vez. */
	viewed_at: string | null;
	/** Cuándo se aceptó o rechazó. */
	decided_at: string | null;
	/** customer (en su liga) o user (usted, con POST /v1/quotes/{id}/accept o desde la app). */
	decided_by: "customer" | "user" | null;
	/** La factura (inv_…) que se timbró de ella, o null. */
	invoice: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Lo que un cliente le debe a un emisor en una moneda, de sus facturas abiertas. */
export interface Receivable {
	/** El RFC y la moneda (RFC:MXN): para starting_after. */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "receivable";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El cliente que debe. */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** La moneda de esas facturas. */
	currency: string;
	/** Lo que debe en total, en esa moneda. */
	amount_due: number;
	/** Cuántas facturas tiene abiertas. */
	open_invoices: number;
	/** La fecha (AAAA-MM-DD) de su factura abierta más antigua. */
	oldest_invoice_date: string;
}

/** Un depósito de la cuenta del emisor, y las facturas que pagó. */
export interface BankTransaction {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "bank_transaction";
	/** El emisor. */
	issuer: string;
	/** El día del depósito (AAAA-MM-DD). */
	date: string;
	/** Lo depositado, en pesos. */
	amount: number;
	/** El concepto del banco. */
	description: string;
	/** La referencia o clave de rastreo, o null. */
	reference: string | null;
	/** Los últimos 4 dígitos de la cuenta, o null. */
	account: string | null;
	/** El RFC de quien depositó, si se sabe. */
	payer_tax_id: string | null;
	/** open (sin conciliar), matched (pagó facturas) o classified (no es de una factura). */
	status: "open" | "matched" | "classified";
	/** classified: venta (aún sin facturar), prestamo, traspaso o devolucion; si no, null. */
	classification: "venta" | "prestamo" | "traspaso" | "devolucion" | null;
	/** Una nota al clasificarlo, o null. */
	note: string | null;
	/** Las facturas (inv_…) que pagó, si está conciliado. */
	invoices: string[];
	/** El complemento de pago (inv_…) timbrado con él, o null. */
	payment: string | null;
	/** Si está abierto, las facturas que parece pagar (por monto, RFC, folio en el concepto y fecha): invoices, lo que toca a cada una (amounts), method, confidence (high o medium) y por qué (reasons). null si ninguna encaja. */
	suggested_match: {
		/** Las facturas, como el cuerpo de POST /v1/invoices, con reference opcional. */
		invoices: string[];
		/** Lo que el depósito pagaría de cada factura (por inv_…). */
		amounts: Record<string, number>;
		/** egreso (la factura completa y después una nota de crédito por el anticipo, opción A) o remanente (la factura solo por lo que falta, opción B). */
		method: "PPD" | "PUE";
		/** high (el monto y además el RFC, el nombre o el folio coinciden) o medium (revíselo antes). */
		confidence: "high" | "medium";
		/** Por qué se sugiere, en palabras. */
		reasons: string[];
	} | null;
	/** Cuándo se mandó. */
	created_at: string | null;
}

/** Los depósitos que se agregaron. */
export interface BankImport {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "bank_import";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** Cuántos depósitos se agregaron. */
	added: number;
	/** Cuántos ya estaban (se omitieron). */
	duplicates: number;
	/** Los depósitos agregados. */
	data: BankTransaction[];
}

/** Una liga para que el dueño de un emisor suba su CSD y firme con su e.firma. */
export interface IssuerOnboardingLink {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "issuer_onboarding_link";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor que se da de alta. */
	issuer: string;
	/** La página para el dueño del emisor, en fiscalisto.com. Ábrala en el navegador de su cliente; no la incruste en un iframe. */
	url: string;
	/** A dónde regresa al terminar. */
	return_url: string | null;
	/** Cuándo deja de servir la liga. Pida otra cuando quiera. */
	expires_at: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Una dirección de su servidor que recibe eventos. */
export interface WebhookEndpoint {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "webhook_endpoint";
	/** El entorno de prueba (sbx_…) al que pertenece, o null si es de la cuenta. Vea /v1/sandboxes. */
	sandbox: string | null;
	/** Dirección https de su servidor que recibe los avisos. */
	url: string;
	/** Para qué es, para usted. */
	description: string | null;
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). Ver la lista en Webhooks. */
	events: string[];
	/** enabled: entregando. failing: sus entregas fallan (se apaga tras 5 días así). disabled: apagado. */
	status: "enabled" | "failing" | "disabled";
	/** Por qué se apagó (sus entregas fallaron 5 días seguidos, o usted lo apagó). */
	disabled_reason?: string | null;
	/** Desde cuándo fallan las entregas, o null. */
	failing_since?: string | null;
	/** Hasta cuándo el secreto anterior también firma (después de cambiarlo), o null. */
	previous_secret_expires_at: string | null;
	/** La versión de la API de sus eventos; null: la de la cuenta. */
	api_version: string | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Secreto de firma (whsec_…). Solo viene al crearlo o al cambiarlo: guárdelo para verificar las firmas. */
	secret?: string;
}

/** Un evento de prueba que se mandó a su webhook, y lo que respondió su servidor. */
export interface WebhookTest {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "webhook_test";
	/** El evento que se mandó, como lo recibió su servidor. */
	event: Event;
	/** Cómo le fue: ok si contestó 2xx, el código, el error y el inicio de su respuesta. */
	delivery: {
		/** true si su servidor contestó 2xx. */
		ok: boolean;
		/** El código HTTP que contestó; null si no se pudo conectar. */
		status: number | null;
		/** Qué falló (sin respuesta, no se pudo conectar, otro código), o null. */
		error: string | null;
		/** El inicio de lo que contestó su servidor (hasta 2,000 caracteres). */
		response_body: string | null;
		/** Cuánto tardó su servidor, en milisegundos. */
		duration_ms: number;
	};
}

/** Lo que puede pasar: el tipo de cada evento. */
export type EventType = "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.paid" | "invoice.partially_paid" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "issuer.ready" | "balance.low" | "test_clock.ready";

/** Algo que pasó en su cuenta: el objeto completo como quedó. Se manda a sus webhooks firmado (Standard Webhooks). */
export interface EventBase<T extends EventType = EventType, O = unknown> {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "event";
	/** Qué pasó: invoice.stamped, invoice.failed, invoice.canceled, invoice.cancellation_pending, invoice.cancellation_rejected, invoice.paid, invoice.partially_paid, retention.stamped, retention.failed, retention.canceled, invoice_batch.completed, customer_data_request.completed, sat_download.completed, sat_download.failed, ticket.invoiced, ticket.included_in_global, recurring_invoice.failed, quote.viewed, quote.accepted, quote.changes_requested, quote.rejected, issuer.ready, balance.low o test_clock.ready. */
	type: T;
	/** Versión de la API con que se armó el objeto. */
	api_version: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string;
	/** Lo que cambió, en data.object: el comprobante (o el lote) completo, como lo contesta su GET. */
	data: { object: O };
}

/** Un evento: según su type, data.object es la factura, la constancia o el lote. */
export type Event =
	| EventBase<"invoice.stamped", Invoice>
	| EventBase<"invoice.failed", Invoice>
	| EventBase<"invoice.canceled", Invoice>
	| EventBase<"invoice.cancellation_pending", Invoice>
	| EventBase<"invoice.cancellation_rejected", Invoice>
	| EventBase<"invoice.paid", Invoice>
	| EventBase<"invoice.partially_paid", Invoice>
	| EventBase<"retention.stamped", Retention>
	| EventBase<"retention.failed", Retention>
	| EventBase<"retention.canceled", Retention>
	| EventBase<"invoice_batch.completed", InvoiceBatch>
	| EventBase<"customer_data_request.completed", CustomerDataRequest>
	| EventBase<"sat_download.completed", SatDownload>
	| EventBase<"sat_download.failed", SatDownload>
	| EventBase<"ticket.invoiced", Ticket>
	| EventBase<"ticket.included_in_global", Ticket>
	| EventBase<"recurring_invoice.failed", RecurringInvoice>
	| EventBase<"quote.viewed", Quote>
	| EventBase<"quote.accepted", Quote>
	| EventBase<"quote.changes_requested", Quote>
	| EventBase<"quote.rejected", Quote>
	| EventBase<"issuer.ready", Issuer>
	| EventBase<"balance.low", Balance>
	| EventBase<"test_clock.ready", TestClock>;

/** Confirmación de que se borró. */
export interface Deleted {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: string;
	/** Siempre true. */
	deleted: true;
}

/** Todos los errores tienen esta forma. */
export interface ApiError {
	/** Por qué el SAT o el PAC no lo aceptaron: mensaje, código del SAT y texto original. */
	error: {
		/** La familia del error: invalid_request_error, authentication_error, permission_error, not_found_error, idempotency_error, rate_limit_error, invoice_error, balance_error o api_error. */
		type: "invalid_request_error" | "authentication_error" | "permission_error" | "not_found_error" | "idempotency_error" | "rate_limit_error" | "invoice_error" | "balance_error" | "api_error";
		/** La razón precisa, estable (ver Errores). */
		code: string;
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
		/** El campo con el problema (items.0.unit_price). */
		param?: string;
		/** Código del SAT o del PAC (CFDI40xxx). */
		sat_code?: string;
		/** Con Accept-Language: en, el mensaje original en español cuando message solo dice en inglés qué significa el código. */
		message_es?: string;
		/** La explicación de este código en la documentación. */
		doc_url: string;
		/** El id de la solicitud (req_…). Inclúyalo si nos escribe. */
		request_id: string;
	};
}

export interface SandboxList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Sandbox[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface IssuerList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Issuer[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface InvoiceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Invoice[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ReceivableList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Receivable[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface BankTransactionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: BankTransaction[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface AdvanceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Advance[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface RetentionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Retention[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface EmployeeList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Employee[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface InvoiceBatchList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: InvoiceBatch[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface CustomerList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Customer[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface CustomerDataRequestList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: CustomerDataRequest[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ProductList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Product[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatCatalogEntryList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatCatalogEntry[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatListCheckList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatListCheck[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatDownloadList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatDownload[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatInvoiceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatInvoice[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface TicketList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Ticket[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface JournalEntryList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: JournalEntry[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface LedgerAccountList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: LedgerAccount[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface StoreConnectionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: StoreConnection[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface RecurringInvoiceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: RecurringInvoice[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface QuoteList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Quote[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface WebhookEndpointList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: WebhookEndpoint[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface EventList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Event[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

/** Una factura (CFDI 4.0). Un campo que no existe se rechaza con parameter_unknown, nunca se ignora. */
export interface InvoiceCreate {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos en un objeto. */
	customer: string | {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
		tax_system: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip: string;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email?: string | null;
		/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
		foreign?: {
			/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
			country: string;
			/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
			tax_id: string;
		};
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
		ieps_taxpayer?: boolean;
	};
	/** Conceptos (Conceptos), al menos uno. */
	items: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product?: string;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description?: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key?: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
		unit_key?: string;
		/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
		unit_name?: string | null;
		/** Número de identificación o SKU (NoIdentificacion). */
		sku?: string | null;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price?: number;
		/** Descuento (Descuento). */
		discount?: number;
		/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
		taxability?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
		/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
		ieps?: number;
		/** Tasa o Cuota (TipoFactor del IEPS). */
		ieps_factor?: "Tasa" | "Cuota";
		/** Unidades de IEPS a cuota (litros, cigarros…), si no son la cantidad. */
		ieps_units?: number;
		/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
		iva_retention?: number;
		/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
		isr_retention?: number;
		/** Números de cuenta predial (CuentaPredial) en arrendamiento. */
		predial?: string[];
		/** Números de pedimento (InformacionAduanera) de mercancía importada. */
		pedimentos?: string[];
		/** A cuenta de terceros (ACuentaTerceros): RFC, nombre, régimen y código postal. */
		third_party?: {
			/** RFC de a cuenta de quién (RfcACuentaTerceros). */
			tax_id: string;
			/** Nombre (NombreACuentaTerceros). */
			name: string;
			/** Régimen fiscal (RegimenFiscalACuentaTerceros), c_RegimenFiscal. */
			tax_system: string;
			/** Código postal de su domicilio fiscal (DomicilioFiscalACuentaTerceros). */
			zip: string;
		};
		/** Complemento de instituciones educativas privadas (IEDU): alumno, CURP, nivel y RVOE. */
		iedu?: {
			/** Nombre del alumno (nombreAlumno). */
			student_name: string;
			/** CURP, 18 caracteres. */
			curp: string;
			/** Nivel educativo (nivelEducativo). */
			level: "Preescolar" | "Primaria" | "Secundaria" | "Profesional técnico" | "Bachillerato o su equivalente";
			/** Reconocimiento de validez oficial de estudios (autRVOE). */
			rvoe: string;
			/** RFC de quien paga, si no es el receptor (rfcPago). */
			payer_tax_id?: string | null;
		};
		/** Complemento de vehículo usado. */
		used_vehicle?: {
			/** Monto de adquisición (montoAdquisicion). */
			purchase_amount: number;
			/** Monto de enajenación (montoEnajenacion). */
			sale_amount: number;
			/** Clave vehicular (claveVehicular). */
			vehicle_key: string;
			/** Marca (marca). */
			make: string;
			/** Tipo o versión (tipo). */
			type: string;
			/** Año del modelo (modelo), 4 dígitos. */
			model: string;
			/** Número de motor (numeroMotor). */
			engine_number?: string;
			/** Número de serie (numeroSerie). */
			serial_number?: string;
			/** Número de identificación vehicular (NIV). */
			niv?: string;
			/** Valor según la guía EBC o Libro Azul (valor). */
			guide_value: number;
			/** Información aduanera de la importación del vehículo (InformacionAduanera). */
			customs?: {
				/** Número del documento de importación (numero). */
				number: string;
				/** Fecha del documento (fecha), AAAA-MM-DD. */
				date: string;
				/** Aduana (aduana). */
				office?: string;
			}[];
		};
		/** Addenda del receptor (Walmart, Soriana…), con sus propios campos. */
		addenda?: Record<string, string>;
	}[];
	/** I ingreso (por omisión; con global, factura global) o T traslado. Notas de crédito: POST /v1/credit_notes. Pagos: POST /v1/payments. */
	type?: "I" | "T";
	/** Complemento Carta Porte 3.1 (traslado de mercancías). */
	carta_porte?: {
		/** Cómo viajan las mercancías (c_CveTransporte): 01 autotransporte, 02 marítimo, 03 aéreo, 04 ferroviario; varios si es intermodal. Por omisión 01. */
		modes?: ("01" | "02" | "03" | "04")[];
		/** Transporte internacional (TranspInternac Sí): entrada o salida, país, vía y regímenes aduaneros. */
		international?: {
			/** EntradaSalidaMerc: Entrada o Salida. */
			direction: "Entrada" | "Salida";
			/** País de origen o destino (PaisOrigenDestino), c_Pais. */
			country: string;
			/** Vía de entrada o salida (ViaEntradaSalida), c_CveTransporte (05 ducto incluido). */
			via: string;
			/** Regímenes aduaneros (RegimenAduanero), c_RegimenAduanero. */
			regimes: string[];
		};
		/** Corredor Interoceánico del Istmo de Tehuantepec: polos de origen y destino (c_RegistroISTMO). */
		istmo?: {
			/** Polo de origen (UbicacionPoloOrigen). */
			origin: string;
			/** Polo de destino (UbicacionPoloDestino). */
			destination: string;
		};
		/** Autotransporte: true si es logística inversa, recolección o devolución. */
		reverse_logistics?: boolean;
		/** Ubicación de origen (Ubicacion TipoUbicacion Origen): remitente, fecha y hora de salida y domicilio. */
		origin: {
			/** RFC del remitente (RFCRemitenteDestinatario); XEXX010101000 si es extranjero. */
			tax_id: string;
			/** Nombre del remitente (NombreRemitenteDestinatario). */
			name?: string;
			/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
			foreign?: {
				/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
				tax_id: string;
				/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
				country: string;
			};
			/** Fecha y hora de salida (origen) o llegada (destino), AAAA-MM-DDTHH:MM, hora local. */
			date_time: string;
			/** Distancia recorrida desde la ubicación anterior, en km (DistanciaRecorrida). Autotransporte y ferroviario. */
			distance_km?: number;
			/** Estación, puerto o aeropuerto (TipoEstacion y NumEstacion de c_Estaciones). Solo sin autotransporte. */
			station?: {
				/** Tipo de estación (TipoEstacion): 01 origen, 02 intermedia, 03 destino final. */
				type?: string;
				/** Clave de la estación, puerto o aeropuerto (NumEstacion), c_Estaciones. */
				number?: string;
				/** Nombre de la estación (NombreEstacion). */
				name?: string;
				/** true si la estación está en el extranjero (va sin TipoEstacion). */
				foreign?: boolean;
			};
			/** Marítimo: tipo de tráfico (NavegacionTrafico), Altura o Cabotaje. */
			navigation?: "Altura" | "Cabotaje";
			/** Domicilio (Domicilio). En México basta el código postal: estado, municipio y localidad se toman de c_CodigoPostal. */
			address: {
				/** Calle (Calle). */
				street?: string;
				/** Número exterior (NumeroExterior). */
				exterior?: string;
				/** Número interior (NumeroInterior). */
				interior?: string;
				/** Código postal (CodigoPostal). En México se deducen de él estado, municipio y localidad. */
				zip: string;
				/** País (Pais), c_Pais. Por omisión MEX. */
				country?: string;
				/** Estado (Estado): en el extranjero c_Estado para USA y CAN, o texto. */
				state?: string;
				/** Municipio (Municipio), en el extranjero como texto. */
				municipality?: string;
				/** Localidad (Localidad), en el extranjero como texto. */
				locality?: string;
				/** Colonia (Colonia), en el extranjero como texto. */
				colony?: string;
			};
		};
		/** Ubicaciones de destino (TipoUbicacion Destino), en orden: destinatario, llegada, distancia y domicilio. */
		destinations: {
			/** RFC del destinatario (RFCRemitenteDestinatario); XEXX010101000 si es extranjero. */
			tax_id: string;
			/** Nombre del destinatario (NombreRemitenteDestinatario). */
			name?: string;
			/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
			foreign?: {
				/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
				tax_id: string;
				/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
				country: string;
			};
			/** Fecha y hora de salida (origen) o llegada (destino), AAAA-MM-DDTHH:MM, hora local. */
			date_time: string;
			/** Distancia recorrida desde la ubicación anterior, en km (DistanciaRecorrida). Autotransporte y ferroviario. */
			distance_km?: number;
			/** Estación, puerto o aeropuerto (TipoEstacion y NumEstacion de c_Estaciones). Solo sin autotransporte. */
			station?: {
				/** Tipo de estación (TipoEstacion): 01 origen, 02 intermedia, 03 destino final. */
				type?: string;
				/** Clave de la estación, puerto o aeropuerto (NumEstacion), c_Estaciones. */
				number?: string;
				/** Nombre de la estación (NombreEstacion). */
				name?: string;
				/** true si la estación está en el extranjero (va sin TipoEstacion). */
				foreign?: boolean;
			};
			/** Marítimo: tipo de tráfico (NavegacionTrafico), Altura o Cabotaje. */
			navigation?: "Altura" | "Cabotaje";
			/** Domicilio (Domicilio). En México basta el código postal: estado, municipio y localidad se toman de c_CodigoPostal. */
			address: {
				/** Calle (Calle). */
				street?: string;
				/** Número exterior (NumeroExterior). */
				exterior?: string;
				/** Número interior (NumeroInterior). */
				interior?: string;
				/** Código postal (CodigoPostal). En México se deducen de él estado, municipio y localidad. */
				zip: string;
				/** País (Pais), c_Pais. Por omisión MEX. */
				country?: string;
				/** Estado (Estado): en el extranjero c_Estado para USA y CAN, o texto. */
				state?: string;
				/** Municipio (Municipio), en el extranjero como texto. */
				municipality?: string;
				/** Localidad (Localidad), en el extranjero como texto. */
				locality?: string;
				/** Colonia (Colonia), en el extranjero como texto. */
				colony?: string;
			};
		}[];
		/** Mercancías (Mercancia) que se transportan. */
		goods: {
			/** Clave del bien transportado (BienesTransp), c_ClaveProdServCP. */
			product_key: string;
			/** Descripción de la mercancía (Descripcion). */
			description: string;
			/** Cantidad (Cantidad). */
			quantity: number;
			/** Clave de unidad (ClaveUnidad), c_ClaveUnidad. */
			unit_key: string;
			/** Peso en kilogramos (PesoEnKg). */
			weight_kg: number;
			/** Dimensiones (Dimensiones), como 30/40/30cm o en plg. */
			dimensions?: string;
			/** Material peligroso (MaterialPeligroso Sí): clave UN y embalaje. */
			hazmat?: {
				/** Clave del material peligroso (CveMaterialPeligroso), c_MaterialPeligroso (número UN). */
				key: string;
				/** Tipo de embalaje (Embalaje), c_TipoEmbalaje. */
				packaging: string;
				/** Descripción del embalaje (DescripEmbalaje). */
				packaging_description?: string;
			};
			/** Datos COFEPRIS de la mercancía: sector y lo que pide cada uno (medicamentos, precursores, psicotrópicos, sustancias tóxicas, plaguicidas). */
			cofepris?: {
				/** Sector COFEPRIS (SectorCOFEPRIS): 01 medicamento, 02 precursores y químicos de uso dual, 03 psicotrópicos y estupefacientes, 04 sustancias tóxicas, 05 plaguicidas y fertilizantes. */
				sector: string;
				/** Nombre del ingrediente activo (NombreIngredienteActivo). */
				active_ingredient?: string;
				/** Nombre químico (NomQuimico). */
				chemical_name?: string;
				/** Denominación genérica del producto (DenominacionGenericaProd). */
				generic_name?: string;
				/** Denominación distintiva o marca (DenominacionDistintivaProd). */
				brand_name?: string;
				/** Fabricante (Fabricante). */
				manufacturer?: string;
				/** Fecha de caducidad (FechaCaducidad), AAAA-MM-DD. */
				expiry?: string;
				/** Lote del medicamento (LoteMedicamento). */
				lot?: string;
				/** Forma farmacéutica (FormaFarmaceutica), c_FormaFarmaceutica. */
				form?: string;
				/** Condiciones especiales de transporte (CondicionesEspTransp), c_CondicionesEspeciales. */
				conditions?: string;
				/** Registro sanitario o folio de autorización (RegistroSanitarioFolioAutorizacion). */
				sanitary_registry?: string;
				/** Permiso de importación (PermisoImportacion). */
				import_permit?: string;
				/** Folio de importación VUCEM (FolioImpoVUCEM). */
				vucem_folio?: string;
				/** Número CAS de la sustancia (NumCAS). */
				cas?: string;
				/** Razón social de la empresa importadora (RazonSocialEmpImp). */
				importer?: string;
				/** Registro sanitario de plaguicidas COFEPRIS (NumRegSanPlagCOFEPRIS). */
				pesticide_registry?: string;
				/** Datos del fabricante (DatosFabricante). */
				manufacturer_data?: string;
				/** Datos del formulador (DatosFormulador). */
				formulator_data?: string;
				/** Datos del maquilador (DatosMaquilador). */
				maquilador_data?: string;
				/** Uso autorizado (UsoAutorizado). */
				authorized_use?: string;
			};
			/** Valor de la mercancía (ValorMercancia); obligatorio en transporte aéreo. */
			value?: number;
			/** Moneda del valor de la mercancía (Moneda), c_Moneda. */
			currency?: string;
			/** Fracción arancelaria (FraccionArancelaria), 10 dígitos. Transporte internacional. */
			tariff?: string;
			/** UUID del CFDI con complemento de comercio exterior (UUIDComercioExt). */
			cce_uuid?: string;
			/** Tipo de materia (TipoMateria, c_TipoMateria) y su descripción si es «otra». */
			material?: {
				/** Tipo de materia (TipoMateria), c_TipoMateria. */
				type: string;
				/** Descripción de la materia (DescripcionMateria), con el tipo 05 otra. */
				description?: string;
			};
			/** Documentación aduanera (DocumentacionAduanera) de la mercancía en transporte internacional. */
			customs_docs?: {
				/** Tipo de documento (TipoDocumento), c_DocumentoAduanero: 01 pedimento… */
				type: string;
				/** Número de pedimento (NumPedimento), con el formato «NN  NN  NNNN  NNNNNNN». Solo con el tipo 01. */
				pedimento?: string;
				/** Identificador del documento aduanero (IdentDocAduanero), con un tipo distinto de 01. */
				doc_id?: string;
				/** RFC del importador (RFCImpo), con un pedimento. */
				importer_tax_id?: string;
			}[];
			/** Paquetería: guías de los paquetes o tarimas (GuiasIdentificacion). */
			guides?: {
				/** Número de guía (NumeroGuiaIdentificacion). */
				number: string;
				/** Descripción del contenido (DescripGuiaIdentificacion). */
				description: string;
				/** Peso en kilogramos (PesoEnKg). */
				weight_kg: number;
			}[];
			/** Cuánto va a cada destino (CantidadTransporta), por destino. */
			quantities?: {
				/** Cantidad que va a ese destino. */
				quantity: number;
				/** El destino, por su posición en destinations (desde 0). */
				destination: number;
				/** Medio en que va esa cantidad (CvesTransporte), c_CveTransporte. */
				mode?: "01" | "02" | "03" | "04";
			}[];
			/** Marítimo: detalle de la mercancía (DetalleMercancia): kilos netos, tara y piezas. */
			detail?: {
				/** Peso neto en kg (PesoNeto). */
				net_kg: number;
				/** Tara en kg (PesoTara). */
				tare_kg: number;
				/** Número de piezas (NumPiezas). */
				pieces?: number;
			};
			/** Ferroviario: clave STCC (ClaveSTCC). */
			stcc?: string;
		}[];
		/** Autotransporte (Autotransporte): vehículo, permiso SCT, seguros y remolques. */
		vehicle?: {
			/** Configuración vehicular (ConfigVehicular), c_ConfigAutotransporte: C2, T3S2… */
			config: string;
			/** Placa (PlacaVM), sin guiones ni espacios. */
			plate: string;
			/** Año del modelo (AnioModeloVM). */
			year: number;
			/** Peso bruto vehicular en toneladas (PesoBrutoVehicular). */
			gross_weight: number;
			/** Tipo de permiso SCT (PermSCT), c_TipoPermiso. */
			permit_type: string;
			/** Número de permiso SCT (NumPermisoSCT). */
			permit_number: string;
			/** Aseguradora de responsabilidad civil (AseguraRespCivil). */
			insurer: string;
			/** Póliza de responsabilidad civil (PolizaRespCivil). */
			policy: string;
			/** Aseguradora de daños al medio ambiente (AseguraMedAmbiente); obligatoria con material peligroso. */
			env_insurer?: string;
			/** Póliza de daños al medio ambiente (PolizaMedAmbiente). */
			env_policy?: string;
			/** Aseguradora de la carga (AseguraCarga). */
			cargo_insurer?: string;
			/** Póliza de la carga (PolizaCarga). */
			cargo_policy?: string;
			/** Prima del seguro (PrimaSeguro). */
			premium?: number;
			/** Remolques o semirremolques (Remolque): tipo (c_SubTipoRem) y placa. */
			trailers?: {
				/** Subtipo de remolque (SubTipoRem), c_SubTipoRem. */
				type: string;
				/** Placa del remolque (Placa). */
				plate: string;
			}[];
		};
		/** Transporte marítimo (TransporteMaritimo): embarcación, naviero y contenedores. */
		sea?: {
			/** Tipo de permiso SCT (PermSCT), c_TipoPermiso. */
			permit_type?: string;
			/** Número de permiso SCT (NumPermisoSCT). */
			permit_number?: string;
			/** Aseguradora de responsabilidad civil (AseguraRespCivil). */
			insurer?: string;
			/** Póliza de responsabilidad civil (PolizaRespCivil). */
			policy?: string;
			/** Tipo de embarcación (TipoEmbarcacion), c_ConfigMaritima. */
			vessel_type: string;
			/** Matrícula (Matricula). */
			registration: string;
			/** Número IMO (NumeroOMI): IMO y 7 dígitos. */
			imo: string;
			/** Año de la embarcación (AnioEmbarcacion). */
			year?: number;
			/** Nombre de la embarcación (NombreEmbarc). */
			vessel_name?: string;
			/** Nacionalidad de la embarcación (NacionalidadEmbarc), c_Pais. */
			flag: string;
			/** Unidades de arqueo bruto (UnidadesDeArqBruto). */
			gross_tonnage: number;
			/** Tipo de carga (TipoCarga), c_ClaveTipoCarga. */
			cargo_type: string;
			/** Eslora en metros (Eslora). */
			length?: number;
			/** Manga en metros (Manga). */
			beam?: number;
			/** Calado en metros (Calado). */
			draft?: number;
			/** Puntal en metros (Puntal). */
			depth?: number;
			/** Línea naviera (LineaNaviera). */
			line?: string;
			/** Nombre del agente naviero consignatario (NombreAgenteNaviero). */
			agent_name: string;
			/** Autorización del agente naviero (NumAutorizacionNaviero), c_NumAutorizacionNaviero. */
			agent_authorization: string;
			/** Número de viaje (NumViaje). */
			voyage?: string;
			/** Número de conocimiento de embarque (NumConocEmbarc). */
			bill_of_lading?: string;
			/** Permiso temporal de navegación (PermisoTempNavegacion), para una embarcación extranjera. */
			temp_permit?: string;
			/** Contenedores (Contenedor). */
			containers?: {
				/** Tipo de contenedor (TipoContenedor), c_ContenedorMaritimo o c_Contenedor en ferroviario. */
				type: string;
				/** Matrícula (Matricula). */
				registration?: string;
				/** Número de precinto (NumPrecinto). */
				seal?: string;
				/** Ferri: el IdCCP de la Carta Porte del autotransporte a bordo (IdCCPRelacionado). */
				related_id_ccp?: string;
				/** Ferri: placa del vehículo a bordo (PlacaVMCCP). */
				truck_plate?: string;
				/** Ferri: fecha de certificación de la Carta Porte del vehículo (FechaCertificacionCCP). */
				certified_at?: string;
				/** Remolques o semirremolques (Remolque): tipo (c_SubTipoRem) y placa. */
				trailers?: {
					/** Subtipo de remolque (SubTipoRem), c_SubTipoRem. */
					type: string;
					/** Placa del remolque (Placa). */
					plate: string;
				}[];
			}[];
		};
		/** Transporte aéreo (TransporteAereo): permiso, guía y transportista. */
		air?: {
			/** Tipo de permiso SCT (PermSCT), c_TipoPermiso. */
			permit_type: string;
			/** Número de permiso SCT (NumPermisoSCT). */
			permit_number: string;
			/** Matrícula de la aeronave (MatriculaAeronave). */
			aircraft?: string;
			/** Aseguradora de responsabilidad civil (AseguraRespCivil). */
			insurer?: string;
			/** Póliza de responsabilidad civil (PolizaRespCivil). */
			policy?: string;
			/** Número de guía aérea (NumeroGuia), de 12 a 15 caracteres. */
			waybill: string;
			/** Lugar del contrato (LugarContrato). */
			contract_place?: string;
			/** Código del transportista (CodigoTransportista), c_CodigoTransporteAereo. */
			carrier: string;
			/** Embarcador (RFCEmbarcador o NumRegIdTribEmbarc y ResidenciaFiscalEmbarc, NombreEmbarcador). */
			shipper?: {
				/** RFC del embarcador (RFCEmbarcador). */
				tax_id?: string;
				/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
				foreign?: {
					/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
					tax_id: string;
					/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
					country: string;
				};
				/** Nombre del embarcador (NombreEmbarcador). */
				name?: string;
			};
			/** Cargo por tasación (CargoPorTasacion). */
			rate_charge?: number;
		};
		/** Transporte ferroviario (TransporteFerroviario): servicio, tráfico, derechos de paso y carros. */
		rail?: {
			/** Tipo de servicio (TipoDeServicio), c_TipoDeServicio. */
			service: string;
			/** Tipo de tráfico (TipoDeTrafico), c_TipoDeTrafico. */
			traffic: string;
			/** Aseguradora de responsabilidad civil (AseguraRespCivil). */
			insurer?: string;
			/** Póliza de responsabilidad civil (PolizaRespCivil). */
			policy?: string;
			/** Derechos de paso (DerechosDePaso): tipo y kilómetros. */
			rights?: {
				/** Tipo de derecho de paso (TipoDerechoDePaso), c_DerechosDePaso. */
				type: string;
				/** Kilometraje pagado (KilometrajePagado). */
				km: number;
			}[];
			/** Carros (Carro). */
			cars: {
				/** Tipo de carro (TipoCarro), c_TipoCarro. */
				type: string;
				/** Matrícula (Matricula). */
				registration: string;
				/** Guía del carro (GuiaCarro). */
				guide: string;
				/** Toneladas netas del carro (ToneladasNetasCarro). */
				net_tons: number;
				/** Contenedores (Contenedor). */
				containers?: {
					/** Tipo de contenedor (TipoContenedor), c_ContenedorMaritimo o c_Contenedor en ferroviario. */
					type: string;
					/** Peso del contenedor vacío en kg (PesoContenedorVacio). */
					empty_kg: number;
					/** Peso neto en kg (PesoNeto). */
					net_kg: number;
				}[];
			}[];
		};
		/** Operadores (FiguraTransporte tipo 01): RFC, licencia y nombre. */
		drivers: {
			/** RFC del operador (RFCFigura); vacío si es extranjero (con foreign). */
			tax_id: string | "";
			/** Número de licencia (NumLicencia). */
			license: string;
			/** Nombre del operador (NombreFigura). */
			name: string;
			/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
			foreign?: {
				/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
				tax_id: string;
				/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
				country: string;
			};
		}[];
		/** Otras figuras de transporte: 02 propietario, 03 arrendador, 04 notificado, 05 integrante de coordinados. */
		figures?: {
			/** Tipo de figura (TipoFigura): 02 propietario, 03 arrendador, 04 notificado, 05 integrante. */
			type: "02" | "03" | "04" | "05";
			/** RFC de la figura (RFCFigura). */
			tax_id?: string;
			/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
			foreign?: {
				/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
				tax_id: string;
				/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
				country: string;
			};
			/** Nombre de la figura (NombreFigura). */
			name: string;
			/** Partes del transporte que posee o arrienda (ParteTransporte), c_ParteTransporte. */
			parts?: string[];
			/** Domicilio (Domicilio). En México basta el código postal: estado, municipio y localidad se toman de c_CodigoPostal. */
			address?: {
				/** Calle (Calle). */
				street?: string;
				/** Número exterior (NumeroExterior). */
				exterior?: string;
				/** Número interior (NumeroInterior). */
				interior?: string;
				/** Código postal (CodigoPostal). En México se deducen de él estado, municipio y localidad. */
				zip: string;
				/** País (Pais), c_Pais. Por omisión MEX. */
				country?: string;
				/** Estado (Estado): en el extranjero c_Estado para USA y CAN, o texto. */
				state?: string;
				/** Municipio (Municipio), en el extranjero como texto. */
				municipality?: string;
				/** Localidad (Localidad), en el extranjero como texto. */
				locality?: string;
				/** Colonia (Colonia), en el extranjero como texto. */
				colony?: string;
			};
		}[];
	};
	/** Complemento INE (procesos electorales). */
	ine?: {
		/** Tipo de proceso (TipoProceso): Ordinario, Precampaña o Campaña. */
		process: "Ordinario" | "Precampaña" | "Campaña";
		/** Tipo de comité (TipoComite), con el proceso Ordinario. */
		committee?: "Ejecutivo Nacional" | "Ejecutivo Estatal" | "Directivo Estatal";
		/** Clave de contabilidad (IdContabilidad), hasta 6 dígitos. */
		accounting_id?: string;
		/** Entidades (Entidad): clave del estado, ámbito y claves de contabilidad. */
		entities?: {
			/** Clave de la entidad (ClaveEntidad), 3 letras. */
			key: string;
			/** Ámbito (Ambito): Local o Federal. */
			scope?: "Local" | "Federal";
			/** Claves de contabilidad (IdContabilidad). */
			accounting_ids?: string[];
		}[];
	};
	/** Complemento de leyendas fiscales. */
	leyendas?: {
		/** Texto de la leyenda (textoLeyenda). */
		text: string;
		/** Disposición fiscal (disposicionFiscal), por ejemplo LISR. */
		disposition?: string;
		/** Norma o artículo (norma). */
		norm?: string;
	}[];
	/** Complemento de donatarias. */
	donation?: {
		/** true si el donativo es en especie (va sin forma de pago en efectivo). */
		in_kind?: boolean;
		/** true si el donativo es deducible para quien lo da. */
		deducted?: boolean;
	};
	/** Impuestos locales (complemento implocal): traslados y retenciones estatales. */
	local_taxes?: {
		/** true si es una retención local; false si es un traslado. */
		retention: boolean;
		/** Nombre del impuesto local (ImpLocTrasladado o ImpLocRetenido), como ISH. */
		name: string;
		/** Tasa en por ciento (TasadeTraslado o TasadeRetencion). */
		rate: number;
		/** Importe del impuesto local. */
		amount: number;
	}[];
	/** Exportación (Exportacion), c_Exportacion: 01 no aplica (por omisión), 02 definitiva… */
	export?: "01" | "02" | "03" | "04";
	/** Complemento de comercio exterior 2.0. */
	comercio_exterior?: {
		/** Motivo de traslado (MotivoTraslado): 05 envío de mercancías propias. */
		motive?: "05";
		/** Propietarios de la mercancía si no es el emisor (Propietario), con motive 05. */
		owners?: {
			/** Número de registro tributario del propietario (NumRegIdTrib). */
			tax_id: string;
			/** País de residencia del propietario (ResidenciaFiscal), c_Pais. */
			country: string;
		}[];
		/** Incoterm (Incoterm), c_INCOTERM: EXW, FOB, CIF, DAP, DDP… */
		incoterm?: string;
		/** Número de certificado de origen (NumCertificadoOrigen). */
		certificate?: string;
		/** Tipo de cambio a dólares (TipoCambioUSD). */
		usd_rate: number;
		/** CURP del emisor persona física (Emisor Curp). */
		issuer_curp?: string;
		/** Domicilio del emisor (Emisor Domicilio): calle y números; lo demás sale de su código postal. */
		issuer_address?: {
			/** Calle (Calle). */
			street: string;
			/** Número exterior (NumeroExterior). */
			exterior?: string;
			/** Número interior (NumeroInterior). */
			interior?: string;
			/** Código postal del emisor (CodigoPostal). */
			zip?: string;
		};
		/** Domicilio del receptor en el extranjero (Receptor Domicilio). */
		receiver_address?: {
			/** Calle (Calle). */
			street: string;
			/** Número exterior (NumeroExterior). */
			exterior?: string;
			/** Número interior (NumeroInterior). */
			interior?: string;
			/** Colonia (Colonia), en el extranjero como texto. */
			colony?: string;
			/** Localidad (Localidad), en el extranjero como texto. */
			locality?: string;
			/** Municipio (Municipio), en el extranjero como texto. */
			municipality?: string;
			/** Estado (Estado), c_Estado para USA y CAN. */
			state?: string;
			/** País (Pais), c_Pais. */
			country: string;
			/** Código postal en su país (CodigoPostal). */
			zip: string;
		};
		/** Destinatario, si no es el receptor (Destinatario). */
		recipient?: {
			/** Nombre del destinatario (Nombre). */
			name?: string;
			/** Número de registro tributario del destinatario (NumRegIdTrib). */
			tax_id?: string;
			/** Domicilio del destinatario (Domicilio). */
			address: {
				/** Calle (Calle). */
				street: string;
				/** Número exterior (NumeroExterior). */
				exterior?: string;
				/** Número interior (NumeroInterior). */
				interior?: string;
				/** Colonia (Colonia), en el extranjero como texto. */
				colony?: string;
				/** Localidad (Localidad), en el extranjero como texto. */
				locality?: string;
				/** Municipio (Municipio), en el extranjero como texto. */
				municipality?: string;
				/** Estado (Estado): en el extranjero c_Estado para USA y CAN, o texto. */
				state?: string;
				/** País (Pais), c_Pais. Por omisión MEX. */
				country: string;
				/** Código postal (CodigoPostal). En México se deducen de él estado, municipio y localidad. */
				zip: string;
			};
		};
		/** Mercancías (Mercancia), una por concepto exportado. */
		goods: {
			/** Número de identificación de la mercancía (NoIdentificacion): el sku de su concepto. */
			id?: string;
			/** Fracción arancelaria (FraccionArancelaria), 10 dígitos. Transporte internacional. */
			tariff?: string;
			/** Unidad aduana (UnidadAduana), c_UnidadAduana. */
			unit: string;
			/** Cantidad en la unidad aduana (CantidadAduana). */
			quantity?: number;
			/** Valor unitario en dólares (ValorUnitarioAduana). */
			unit_value_usd?: number;
		}[];
		/** Observaciones del complemento (Observaciones). */
		notes?: string;
	};
	/** Factura global a público en general (InformacionGlobal): periodicidad, meses y año. */
	global?: {
		/** Periodicidad (Periodicidad), c_Periodicidad: 01 diario, 02 semanal, 03 quincenal, 04 mensual, 05 bimestral. */
		periodicity: string;
		/** Meses (Meses), c_Meses: 01 a 12, o 13 a 18 bimestres. */
		months: string;
		/** Año (Año). */
		year: number;
	};
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form?: string;
	/** Método de pago (MetodoPago): PUE (una sola exhibición, por omisión) o PPD (en parcialidades o diferido, se cobra con complementos de pago). */
	payment_method?: "PUE" | "PPD";
	/** Con PUE: true si aún no le pagan («Por cobrar» en la app) aunque se pagará este mes. */
	paid_later?: boolean;
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency?: string;
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series?: string;
	/** Observaciones que aparecen en el PDF (no van en el XML). */
	notes?: string;
	/** Idioma del PDF: es (por omisión) o en. */
	pdf_language?: "es" | "en" | "bi";
	/** Addenda del receptor (Walmart, Soriana…), con sus propios campos. */
	addenda?: {
		type: "walmart" | "soriana" | "liverpool" | "homedepot" | "chedraui" | "generic";
		values: Record<string, string>;
		customer?: Record<string, string>;
	};
	/** CFDI relacionados (CfdiRelacionados): tipo de relación de c_TipoRelacion y los UUID. */
	related?: {
		/** Tipo de relación (TipoRelacion): 01 nota de crédito, 03 devolución, 04 sustitución, 07 anticipo… */
		relationship: string;
		/** Folios fiscales relacionados. */
		uuids: string[];
	};
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate?: number;
	/** Folio (Folio). Fiscalisto asigna el siguiente de la serie; mande uno solo si debe ser ese. */
	folio?: number;
	/** Con un folio elegido: true para que los siguientes sigan desde ese número. */
	continue_sequence?: boolean;
	/** Fecha de emisión (Fecha) si no es ahora, AAAA-MM-DDTHH:MM:SS hora de la Ciudad de México: hasta 72 horas antes. */
	date?: string;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Correos con copia, separados por comas. */
	email_cc?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface UpdateAccountParams {
	/** La versión de la API de la cuenta: la que reciben sus solicitudes sin Fiscalisto-Version y sus webhooks sin api_version propio. Pruebe antes la nueva con el encabezado. */
	api_version: string;
}

export interface ResetTestDataParams {
	/** true (por omisión) para dejarle a cada emisor de pruebas 3 clientes y 3 productos de ejemplo. false para dejarlo vacío. */
	seed?: boolean;
}

export interface CreateSandboxParams {
	/** Para quién o para qué es, por ejemplo el nombre de quien lo usa. */
	name: string;
}

export interface CreateTestClockParams {
	/** Dónde empieza el reloj; si no la manda, ahora. */
	frozen_time?: string;
}

export interface AdvanceTestClockParams {
	/** A dónde adelantarlo: después de la hora actual del reloj. Lo que toca en el camino se hace día por día. */
	frozen_time: string;
}

export interface CreateIssuerParams {
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name: string;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string;
	/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
	employer_registration?: string | null;
	/** CURP, 18 caracteres. */
	curp?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

/** Los parámetros de GET /v1/issuers. */
export interface ListIssuersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** Solo el de este RFC. */
	tax_id?: string;
	/** true para incluir los archivados. */
	include_archived?: boolean;
}

export interface UpdateIssuerParams {
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name?: string;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system?: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip?: string;
	/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
	employer_registration?: string | null;
	/** CURP, 18 caracteres. */
	curp?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string> | null;
}

export interface UploadCertificateParams {
	/** El archivo .cer en base64 (puede traer el prefijo data:). */
	cer: string;
	/** El archivo .key en base64 (puede traer el prefijo data:). */
	key: string;
	/** La contraseña de la llave privada (.key). Se usa para abrirla y no se guarda en texto. */
	password: string;
}

export interface SignEfirmaParams {
	/** El archivo .cer en base64 (puede traer el prefijo data:). */
	cer: string;
	/** El archivo .key en base64 (puede traer el prefijo data:). */
	key: string;
	/** La contraseña de la llave privada (.key). Se usa para abrirla y no se guarda en texto. */
	password: string;
	/** true para guardarla (cifrada) y poder pedir al SAT las facturas del emisor con POST /v1/sat_downloads. Sin esto solo firma el contrato con el PAC y no se guarda. */
	keep_for_downloads?: boolean;
}

export interface CreateIssuerOnboardingLinkParams {
	/** A dónde regresa el botón al terminar, por ejemplo la página de su plataforma donde su cliente sigue. Sin ella, la página solo dice que ya terminó. */
	return_url?: string;
	/** Horas que la liga sirve, de 1 a 168 (7 días). Por omisión 24. */
	expires_in_hours?: number;
}

/** Los parámetros de GET /v1/invoices. */
export interface ListInvoicesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** valid, pending, canceled, rejected o processing. */
	status?: "valid" | "pending" | "canceled" | "rejected" | "processing";
	/** I, E, P, T o N. */
	type?: "I" | "E" | "P" | "T" | "N";
	/** RFC del cliente. */
	customer?: string;
	/** Facturas de ingreso por lo que deben: unpaid, partial, open (unpaid o partial) o paid. */
	payment_status?: "unpaid" | "partial" | "open" | "paid";
	/** Creadas desde, en ISO 8601. Un día solo (2026-10-01) cuenta desde su inicio en hora de la Ciudad de México. */
	created_gte?: string;
	/** Creadas hasta, en ISO 8601. Un día solo (2026-10-31) incluye el día completo en hora de la Ciudad de México. */
	created_lte?: string;
}

/** Los parámetros de GET /v1/invoices/{id}. */
export interface GetInvoiceParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
	/** true para preguntar su estado al SAT ahora (cancelaciones en espera). */
	refresh?: boolean;
}

/** Los parámetros de GET /v1/invoices/{id}/pdf. */
export interface GetInvoicePdfParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
}

/** Los parámetros de GET /v1/invoices/{id}/xml. */
export interface GetInvoiceXmlParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
}

export interface SendInvoiceParams {
	/** A quién (correos separados por comas). */
	to?: string;
	/** Con copia (correos separados por comas). */
	cc?: string | null;
}

export interface CancelInvoiceParams {
	/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 nominativa en una global. */
	motive?: "01" | "02" | "03" | "04";
	/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
	substitution?: string;
}

/** Los parámetros de GET /v1/receivables. */
export interface ListReceivablesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo este RFC. */
	customer?: string;
}

export interface CreateBankTransactionsParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** La cuenta (CLABE o número; se guardan sus últimos 4 dígitos). */
	account?: string;
	/** Los depósitos, hasta 1,000 por solicitud. */
	transactions: {
		/** El día del depósito (AAAA-MM-DD). */
		date: string;
		/** Lo depositado, en pesos. Los retiros no se mandan. */
		amount: number;
		/** El concepto del banco, como viene (SPEI, nombre del ordenante…). */
		description: string;
		/** La referencia o clave de rastreo. */
		reference?: string;
		/** El RFC de quien depositó, si lo sabe (ayuda a sugerir la factura). */
		payer_tax_id?: string;
	}[];
}

/** Los parámetros de GET /v1/bank_transactions. */
export interface ListBankTransactionsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** open (sin conciliar), matched o classified. */
	status?: "open" | "matched" | "classified";
}

export interface MatchBankTransactionParams {
	/** Las facturas (inv_… o UUID) que pagó este depósito, de un mismo cliente. Sin ellas, las de suggested_match. */
	invoices?: string[];
}

export interface ClassifyBankTransactionParams {
	/** venta (una venta que aún no se factura), prestamo, traspaso (entre cuentas propias) o devolucion. */
	classification: "venta" | "prestamo" | "traspaso" | "devolucion";
	/** Una nota para su equipo (de dónde vino, por qué). */
	note?: string;
}

export interface CreatePaymentParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Fecha en que le pagaron (FechaPago), AAAA-MM-DD. Por omisión hoy. */
	date?: string;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form: string;
	/** Número de operación del pago (NumOperacion), como el rastreo SPEI. */
	operation_number?: string | null;
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency?: string;
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate?: number | null;
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series?: string;
	/** Las facturas que paga (DoctoRelacionado). */
	documents: {
		/** La factura (inv_… o su UUID). */
		invoice: string;
		/** Lo que se paga de esa factura (ImpPagado), en la moneda de la factura. */
		amount: number;
		/** Solo si la factura es de otra moneda que el pago: lo que recibió por ella en la moneda del pago. Fiscalisto calcula la equivalencia (EquivalenciaDR). */
		received?: number | null;
	}[];
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
	email?: string;
	/** Correos con copia, separados por comas. */
	email_cc?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
	/** El depósito (btx_…) con que le pagaron: queda conciliado con este complemento, y date es su día si no manda otra. */
	bank_transaction?: string;
}

export interface CreateCreditNoteParams {
	/** La factura (inv_… o su UUID). */
	invoice: string;
	/** Importe de la nota antes de impuestos: Fiscalisto agrega el IVA y las retenciones de la factura en la misma proporción. */
	amount: number;
	/** Descripción del concepto de la nota (Descripcion), como «Descuento por pronto pago». */
	description?: string;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form: string;
	/** Tipo de relación (TipoRelacion): 01 nota de crédito, 03 devolución, 04 sustitución, 07 anticipo… */
	relationship?: "01" | "03";
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
	email?: string;
	/** Correos con copia, separados por comas. */
	email_cc?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface CreateAdvanceParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos en un objeto. */
	customer: string | {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
		tax_system: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip: string;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email?: string | null;
		/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
		foreign?: {
			/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
			country: string;
			/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
			tax_id: string;
		};
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
		ieps_taxpayer?: boolean;
	};
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Lo que pagó el cliente, con IVA incluido. */
	amount: number;
	/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
	iva?: "0" | "0.16" | "0.08" | "exento";
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form: string;
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency?: string;
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate?: number;
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series?: string;
	/** Observaciones que aparecen en el PDF (no van en el XML). */
	notes?: string;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Correos con copia, separados por comas. */
	email_cc?: string | null;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

/** Los parámetros de GET /v1/advances. */
export interface ListAdvancesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** RFC del cliente. */
	customer?: string;
}

/** El cuerpo de POST /v1/invoices (la factura de lo vendido) con method y remainder. */
export type ApplyAdvanceParams = {
	/** egreso (la factura completa y después una nota de crédito por el anticipo, opción A) o remanente (la factura solo por lo que falta, opción B). */
	method?: "egreso" | "remanente";
	/** Cómo se paga lo que falta del anticipo: ahora con su forma de pago, o después (PPD). */
	remainder?: {
		/** true si lo que falta se paga ahora (PUE); false si después (PPD). */
		paid_now: boolean;
		/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
		payment_form?: string;
	};
} & InvoiceCreate;

export interface CreateRetentionParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… */
	code: string;
	/** Descripción de la retención (DescRetenc); obligatoria con la clave 25 (otro tipo). */
	description?: string | null;
	/** Receptor de la constancia (Receptor): nacional con RFC y código postal, o extranjero. */
	recipient: {
		/** true si el receptor es extranjero (sin RFC). */
		foreign?: boolean;
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id?: string | null;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
		zip?: string;
		/** CURP, 18 caracteres. */
		curp?: string | null;
	};
	/** Periodo (Periodo): mes inicial, mes final y año. */
	period: {
		/** Año (Ejercicio). */
		year: number;
		/** Un solo mes, del 1 al 12 (MesIni y MesFin iguales). */
		month?: number;
		/** Mes inicial (MesIni), 1 a 12. */
		from_month?: number;
		/** Mes final (MesFin), 1 a 12, del mismo año. */
		to_month?: number;
	};
	/** Totales (Totales). */
	totals: {
		/** Monto total de la operación (MontoTotOperacion). */
		operation: number;
		/** Monto gravado (MontoTotGrav). Por omisión, operation menos exempt. */
		taxed?: number;
		/** Monto exento (MontoTotExent). Por omisión 0. */
		exempt?: number;
	};
	/** Impuestos del comprobante, por tipo. */
	taxes: {
		/** Impuesto: isr, iva o ieps (ImpuestoRet 001, 002, 003). */
		tax: string;
		/** Base del impuesto retenido (BaseRet). */
		base: number;
		/** Monto retenido (MontoRet). */
		amount: number;
		/** Tipo de pago de la retención (TipoPagoRet): 01 definitivo IVA, 02 definitivo IEPS, 03 definitivo ISR, 04 provisional ISR. Por omisión el usual de cada impuesto. */
		payment_type?: string;
	}[];
	/** Complemento de dividendos. */
	dividends?: {
		/** Tipo de dividendo o utilidad distribuida (CveTipDivOUtil), c_TipoDividendoOUtilidadDistribuida. */
		type: "01" | "02" | "03" | "04" | "05" | "06";
		/** ISR acreditable en México (MontISRAcredRetMexico). */
		isr_mexico: number;
		/** ISR acreditable en el extranjero (MontISRAcredRetExtranjero). */
		isr_foreign: number;
		/** Retención en el extranjero sobre dividendos (MontRetExtDivExt). */
		foreign_retention?: number | null;
		/** Tipo de sociedad que distribuye (TipoSocDistrDiv): nacional o extranjera. */
		company: "nacional" | "extranjera";
		/** ISR acreditable nacional (MontISRAcredNal). */
		national_credit?: number | null;
		/** Dividendo acumulable nacional (MontDivAcumNal). */
		accumulated_national?: number | null;
		/** Dividendo acumulable extranjero (MontDivAcumExt). */
		accumulated_foreign?: number | null;
	};
	/** Complemento de intereses. */
	interest?: {
		/** true si los intereses vienen del sistema financiero (SistFinanciero). */
		financial_system: boolean;
		/** true si se retiraron los intereses en el periodo (RetiroAORESRetInt). */
		retirement: boolean;
		/** true si son operaciones financieras derivadas (OperFinancDerivad). */
		derivatives: boolean;
		/** Interés nominal (MontIntNominal). */
		nominal: number;
		/** Interés real (MontIntReal). */
		real: number;
		/** Pérdida (Perdida). */
		loss: number;
	};
	/** Complemento de pagos a extranjeros. */
	foreign_payment?: {
		/** true si quien recibe es el beneficiario efectivo (EsBenefEfectDelCobro). */
		beneficiary: boolean;
		/** País de residencia del extranjero (PaisDeResidParaEfecFisc), 2 letras. */
		country?: string | null;
		/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
		concept: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
		/** Descripción del concepto (DescripcionConcepto). */
		description: string;
		/** RFC del beneficiario, si no es quien recibe (RFC). */
		beneficiary_tax_id?: string | null;
		/** CURP del beneficiario (CURP). */
		beneficiary_curp?: string | null;
		/** Nombre o razón social del beneficiario (NomDenRazSocB). */
		beneficiary_name?: string | null;
	};
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
	email?: string;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

/** Los parámetros de GET /v1/retentions. */
export interface ListRetentionsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** valid, canceled, rejected o processing. */
	status?: "valid" | "canceled" | "rejected" | "processing";
	/** RFC del receptor. */
	recipient?: string;
	/** Ejercicio, 4 dígitos. */
	year?: string;
}

/** Los parámetros de GET /v1/retentions/{id}. */
export interface GetRetentionParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
	/** true para preguntar su estado al SAT ahora (cancelaciones en espera). */
	refresh?: boolean;
}

/** Los parámetros de GET /v1/retentions/{id}/pdf. */
export interface GetRetentionPdfParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
}

/** Los parámetros de GET /v1/retentions/{id}/xml. */
export interface GetRetentionXmlParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
}

export interface SendRetentionParams {
	/** A quién (correos separados por comas). */
	to?: string;
}

export interface CancelRetentionParams {
	/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 nominativa en una global. */
	motive?: "01" | "02" | "03" | "04";
	/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
	substitution?: string;
}

export interface CreateEmployeeParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Número de empleado (NumEmpleado). */
	number: string;
	/** Nombre completo del empleado, como en su constancia de situación fiscal. */
	name: string;
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** CURP, 18 caracteres. */
	curp: string;
	/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
	social_security_number: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string;
	/** Correo del empleado, a donde van sus recibos con send_email. */
	email?: string | null;
	/** Fecha de inicio de la relación laboral (FechaInicioRelLaboral), AAAA-MM-DD. */
	start_date: string;
	/** Último día trabajado si ya no trabaja ahí, AAAA-MM-DD. */
	end_date?: string | null;
	/** Salario diario. */
	daily_salary: number;
	/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
	integrated_daily_salary: number;
	/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
	contract_type?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
	/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
	workday_type?: string;
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity?: string;
	/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
	risk_class?: string;
	/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
	state: string;
	/** true si trabaja en la zona libre de la frontera norte (salario mínimo de frontera). */
	border_zone?: boolean;
	/** true si es sindicalizado (Sindicalizado). */
	unionized?: boolean;
	/** Departamento (Departamento). */
	department?: string | null;
	/** Puesto (Puesto). */
	position?: string | null;
}

/** Los parámetros de GET /v1/employees. */
export interface ListEmployeesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateEmployeeParams {
	/** Número de empleado (NumEmpleado). */
	number?: string;
	/** Nombre completo del empleado, como en su constancia de situación fiscal. */
	name?: string;
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id?: string;
	/** CURP, 18 caracteres. */
	curp?: string;
	/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
	social_security_number?: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip?: string;
	/** Correo del empleado, a donde van sus recibos con send_email. */
	email?: string | null;
	/** Fecha de inicio de la relación laboral (FechaInicioRelLaboral), AAAA-MM-DD. */
	start_date?: string;
	/** Último día trabajado si ya no trabaja ahí, AAAA-MM-DD. */
	end_date?: string | null;
	/** Salario diario. */
	daily_salary?: number;
	/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
	integrated_daily_salary?: number;
	/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
	contract_type?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
	/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
	workday_type?: string;
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity?: string;
	/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
	risk_class?: string;
	/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
	state?: string;
	/** true si trabaja en la zona libre de la frontera norte (salario mínimo de frontera). */
	border_zone?: boolean;
	/** true si es sindicalizado (Sindicalizado). */
	unionized?: boolean;
	/** Departamento (Departamento). */
	department?: string | null;
	/** Puesto (Puesto). */
	position?: string | null;
}

export interface CreatePayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** Periodo (Periodo): mes inicial, mes final y año. */
	period: {
		/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
		start: string;
		/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
		end: string;
		/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
		payment_date?: string;
	};
	/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
	days?: number;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface PreviewPayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** Periodo (Periodo): mes inicial, mes final y año. */
	period: {
		/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
		start: string;
		/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
		end: string;
		/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
		payment_date?: string;
	};
	/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
	days?: number;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface CreateInvoiceBatchParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Nombre del lote, para usted. */
	name?: string;
	/** Las facturas, como el cuerpo de POST /v1/invoices, con reference opcional. */
	invoices: (InvoiceCreate & {
		/** Su identificador de esta factura (su número de pedido), hasta 100 caracteres. */
		reference?: string;
	})[];
}

/** Los parámetros de GET /v1/invoice_batches. */
export interface ListInvoiceBatchesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface ValidateTaxIdParams {
	/** El RFC del cliente. */
	tax_id: string;
	/** El nombre o razón social que va a poner en la factura. */
	legal_name?: string;
	/** Su régimen fiscal (c_RegimenFiscal), como 601 o 612. */
	tax_system?: string;
	/** El código postal de su domicilio fiscal. */
	zip?: string;
	/** El uso del CFDI (c_UsoCFDI), como G03. */
	use?: string;
	/** El idCIF de su constancia de situación fiscal (11 dígitos, arriba a la izquierda, junto al QR). Con él se compara todo con lo que tiene el SAT. */
	cif_id?: string;
}

export interface CreateCustomerParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id: string;
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name: string;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip: string;
	/** Correo del cliente (varios separados por comas), a donde van sus facturas con send_email. */
	email?: string | null;
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
	foreign?: {
		/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
		country: string;
		/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
		tax_id: string;
	} | null;
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
	ieps_taxpayer?: boolean;
}

/** Los parámetros de GET /v1/customers. */
export interface ListCustomersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo el de este RFC. */
	tax_id?: string;
}

export interface UpdateCustomerParams {
	/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
	tax_id?: string;
	/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
	legal_name?: string;
	/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
	tax_system?: string;
	/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
	zip?: string;
	/** Correo del cliente (varios separados por comas), a donde van sus facturas con send_email. */
	email?: string | null;
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
	foreign?: {
		/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
		country: string;
		/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
		tax_id: string;
	} | null;
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
	ieps_taxpayer?: boolean;
}

export interface CreateCustomerDataRequestParams {
	/** El emisor (iss_…) que va a facturarle. Por omisión, su único emisor. */
	issuer?: string;
	/** Su id para este cliente o pedido, como «Pedido 1042». El cliente la ve arriba del formulario y viene de vuelta en el evento. */
	reference?: string;
	/** Una línea que el cliente ve arriba del formulario: para qué son sus datos. */
	description?: string;
	/** Días que la liga sirve, de 1 a 60. Por omisión 60. */
	expires_in_days?: number;
}

/** Los parámetros de GET /v1/customer_data_requests. */
export interface ListCustomerDataRequestsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateProductParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Nombre corto para encontrarlo, solo para usted; en el CFDI va description. */
	name?: string | null;
	/** Descripción. */
	description: string;
	/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
	product_key: string;
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
	unit_key?: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name?: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku?: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price: number;
	/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
	taxability?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
	/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
	iva?: "0" | "0.16" | "0.08" | "exento";
	/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
	ieps?: number | null;
	/** Tasa o Cuota (TipoFactor del IEPS). */
	ieps_factor?: "Tasa" | "Cuota";
	/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
	iva_retention?: number;
	/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
	isr_retention?: number;
}

/** Los parámetros de GET /v1/products. */
export interface ListProductsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo el de este SKU. */
	sku?: string;
	/** Solo los de esta clave del SAT. */
	product_key?: string;
}

export interface UpdateProductParams {
	/** Nombre corto para encontrarlo, solo para usted; en el CFDI va description. */
	name?: string | null;
	/** Descripción. */
	description?: string;
	/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
	product_key?: string;
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
	unit_key?: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name?: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku?: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price?: number;
	/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
	taxability?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
	/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
	iva?: "0" | "0.16" | "0.08" | "exento";
	/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
	ieps?: number | null;
	/** Tasa o Cuota (TipoFactor del IEPS). */
	ieps_factor?: "Tasa" | "Cuota";
	/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
	iva_retention?: number;
	/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
	isr_retention?: number;
}

/** Los parámetros de GET /v1/sat_catalogs/{name}. */
export interface GetSatCatalogParams {
	/** Qué buscar: palabras («consultoría») o una clave. */
	q?: string;
	/** Hasta cuántos, de 1 a 100 (búsquedas). Por omisión 20. */
	limit?: number;
}

export interface CheckSatListsParams {
	/** Los RFC a revisar, hasta 1000. */
	tax_ids: string[];
}

export interface CreateSatDownloadParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** received (las facturas que le hicieron al emisor, por omisión) o issued (las que emitió, aunque no haya sido con Fiscalisto). */
	direction?: "received" | "issued";
	/** Desde qué día (incluido), en hora de la Ciudad de México. */
	from: string;
	/** Hasta qué día (incluido). A lo más un año después de from, y no después de hoy. */
	to: string;
	/** Solo un tipo de comprobante: I, E, P, T o N. Por omisión, todos. */
	type?: "I" | "E" | "P" | "T" | "N";
	/** Solo las de un RFC: el emisor de las recibidas, o el receptor de las emitidas. */
	counterparty_tax_id?: string;
	/** Una sola factura, por su folio fiscal (UUID). */
	uuid?: string;
}

/** Los parámetros de GET /v1/sat_downloads. */
export interface ListSatDownloadsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/sat_invoices. */
export interface ListSatInvoicesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** received (por omisión) o issued. */
	direction?: "received" | "issued";
	/** I, E, P, T o N. */
	type?: "I" | "E" | "P" | "T" | "N";
	/** El RFC de quien la emitió (recibidas) o de quien la recibió (emitidas). */
	counterparty_tax_id?: string;
	/** Con fecha desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** Con fecha hasta este día (AAAA-MM-DD), incluido. */
	date_lte?: string;
}

export interface CreateTicketParams {
	/** El emisor (iss_…) que vendió. Por omisión, su único emisor. */
	issuer?: string;
	/** El folio de la venta en su sistema, único por emisor: letras, números, - _ / y punto. Registrar el mismo folio con el mismo total responde el ticket que ya existe. */
	folio: string;
	/** Lo que se cobró, impuestos incluidos y sin propina. */
	total: number;
	/** Propina: no va en la factura. El cliente puede escribir el total con ella o sin ella. */
	tip?: number;
	/** c_FormaPago de la venta: 01 efectivo, 04 tarjeta de crédito… */
	payment_form: string;
	/** Cuándo se vendió: ISO 8601 (2026-10-02T13:45:00-06:00) o la hora de la Ciudad de México sin zona. Por omisión, ahora. */
	sold_at?: string;
	/** Un producto (prd_…) de su catálogo: el concepto de la factura. */
	product?: string;
	/** El concepto. Con `product`, reemplaza su descripción; sin él, va con `product_key`. */
	description?: string;
	/** c_ClaveProdServ (8 dígitos), si no usa `product`. */
	product_key?: string;
	/** c_ClaveUnidad. Por omisión, la de la clave del producto. */
	unit_key?: string;
	/** Tasa de IVA incluida en el total. Por omisión 0.16. */
	iva?: "0" | "0.16" | "0.08" | "exento";
}

/** Los parámetros de GET /v1/tickets. */
export interface ListTicketsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** pending, invoiced, global o cancelled. */
	status?: "pending" | "invoiced" | "global" | "cancelled";
	/** Vendidos desde (ISO 8601 o AAAA-MM-DD). */
	sold_at_gte?: string;
	/** Vendidos hasta (ISO 8601 o AAAA-MM-DD, el día completo). */
	sold_at_lte?: string;
}

export interface UpdateSelfInvoicingParams {
	/** Hasta cuándo se puede facturar un ticket: `month`, hasta el fin del mes de la venta (lo usual ante el SAT); `days`, `window_days` días después. */
	window?: "month" | "days";
	/** Días para facturar con `window: days`. */
	window_days?: number;
	/** c_Periodicidad de la factura global con los tickets que nadie facturó: 01 diaria, 02 semanal, 03 quincenal, 04 mensual. */
	global_periodicity?: "01" | "02" | "03" | "04";
}

/** Los parámetros de GET /v1/accounting/journal_entries. */
export interface ListJournalEntriesParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** Cuántas por página, de 1 a 1,000. Por omisión 100. */
	limit?: number;
	/** El id de la última póliza de la página anterior. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/trial_balance. */
export interface GetTrialBalanceParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/accounts. */
export interface ListLedgerAccountsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/electronic_accounting. */
export interface GetElectronicAccountingParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** normal (BN, por omisión) o complementary (BC, con modified_on). */
	type?: "normal" | "complementary";
	/** complementary: el día en que se modificó (AAAA-MM-DD). */
	modified_on?: string;
	/** Para incluir las pólizas: AF acto de fiscalización, FC fiscalización compulsa (con order_number), DE devolución o CO compensación (con procedure_number). */
	journal_request?: "AF" | "FC" | "DE" | "CO";
	/** AF y FC: el número de orden (ABC1234567/26). */
	order_number?: string;
	/** DE y CO: el número de trámite (AB123456789012). */
	procedure_number?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/diot. */
export interface GetDiotParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/diot/file. */
export interface GetDiotFileParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** true para agrupar proveedores de hasta $50,000 en el mes (regla 4.5.2). */
	group_small_suppliers?: boolean;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateStoreConnectionParams {
	/** El emisor (iss_…) dueño de la tienda. Por omisión, su único emisor. */
	issuer?: string;
	/** shopify o mercadolibre. */
	platform: "shopify" | "mercadolibre";
	/** Shopify: el dominio de la tienda (mi-tienda.myshopify.com). */
	shop?: string;
	/** Shopify: el Client ID de la app de la tienda (Dev Dashboard). */
	client_id?: string;
	/** Shopify: el Client secret de esa app; con él se firman los webhooks. Se guarda cifrado y nunca se muestra. */
	client_secret?: string;
	/** Shopify, solo apps personalizadas antiguas: su token de la Admin API (shpat_…); client_secret es entonces su API secret key. */
	access_token?: string;
	/** Mercado Libre: a dónde volver después de autorizar (se agregan store_connection y status). */
	return_url?: string;
	/** Cómo se vuelve ticket cada pedido. */
	settings?: {
		/** c_ClaveProdServ de lo que vende (8 dígitos). */
		product_key?: string;
		/** c_ClaveUnidad. Por omisión, la de la clave del producto. */
		unit_key?: string;
		/** Tasa de IVA incluida en los precios. Por omisión 0.16. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** El concepto de cada ticket. Por omisión, el pedido y sus artículos («Pedido 1001: Playera (2), Gorra»). */
		description?: string;
		/** Lo que va antes del número del pedido en el folio del ticket. Por omisión SHOP- o ML-. */
		folio_prefix?: string;
		/** c_FormaPago cuando la forma de pago del pedido no está en payment_forms. Por omisión 04 (Shopify) o 31 (Mercado Libre). */
		payment_form?: string;
		/** c_FormaPago por pasarela de Shopify (shopify_payments, paypal, manual…) o tipo de pago de Mercado Libre (credit_card, debit_card, account_money, ticket, bank_transfer). */
		payment_forms?: Record<string, string>;
		/** Mercado Libre: timbrar en cuanto se paga si el comprador dejó sus datos fiscales completos. Por omisión true. */
		auto_invoice?: boolean;
	};
}

/** Los parámetros de GET /v1/store_connections. */
export interface ListStoreConnectionsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateStoreConnectionParams {
	/** Lo que cambia; lo demás queda. */
	settings: {
		/** c_ClaveProdServ de lo que vende (8 dígitos). */
		product_key?: string;
		/** c_ClaveUnidad. Por omisión, la de la clave del producto. */
		unit_key?: string;
		/** Tasa de IVA incluida en los precios. Por omisión 0.16. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** El concepto de cada ticket. Por omisión, el pedido y sus artículos («Pedido 1001: Playera (2), Gorra»). */
		description?: string;
		/** Lo que va antes del número del pedido en el folio del ticket. Por omisión SHOP- o ML-. */
		folio_prefix?: string;
		/** c_FormaPago cuando la forma de pago del pedido no está en payment_forms. Por omisión 04 (Shopify) o 31 (Mercado Libre). */
		payment_form?: string;
		/** c_FormaPago por pasarela de Shopify (shopify_payments, paypal, manual…) o tipo de pago de Mercado Libre (credit_card, debit_card, account_money, ticket, bank_transfer). */
		payment_forms?: Record<string, string>;
		/** Mercado Libre: timbrar en cuanto se paga si el comprador dejó sus datos fiscales completos. Por omisión true. */
		auto_invoice?: boolean;
	};
}

export interface ImportStoreOrdersParams {
	/** Desde qué día (AAAA-MM-DD, hasta 31 días atrás). Por omisión, hace 7 días. */
	since?: string;
}

export interface CreateRecurringInvoiceParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Para reconocerla: «Renta oficina 3», «Plan Pro de ACME». */
	name: string;
	/** Cada cuánto y a qué hora se timbra. */
	schedule: {
		/** monthly: cada interval meses en day_of_month. weekly o daily: cada interval semanas o días desde start_date. */
		frequency: "monthly" | "weekly" | "daily";
		/** Cada cuántos meses, semanas o días. Por omisión 1. Hasta 24 meses, 52 semanas o 365 días. */
		interval?: number;
		/** Con monthly: el día, del 1 al 28, o "last" (el último del mes). Por omisión el día de start_date, o el de hoy. */
		day_of_month?: number | "last";
		/** La primera factura, AAAA-MM-DD (hoy o después). Por omisión: con monthly, el próximo day_of_month; con weekly o daily, hoy. */
		start_date?: string;
		/** La hora (0 a 23) en que se timbra, en time_zone. Por omisión 7. */
		hour?: number;
		/** La zona de esa hora. Por omisión America/Mexico_City. */
		time_zone?: "America/Mexico_City" | "America/Cancun" | "America/Mazatlan" | "America/Hermosillo" | "America/Tijuana" | "America/Ciudad_Juarez";
	};
	/** La factura que se repite: el cuerpo de POST /v1/invoices, sin issuer, folio, date, global ni metadata. En description puede usar {mes}, {mes anterior}, {mes siguiente}, {año}, {año anterior}, {año siguiente} y {periodo}: cada factura los llena con su fecha. */
	invoice: InvoiceCreate;
	/** Mandar cada factura al correo del cliente (customer.email o el del catálogo). Por omisión true. */
	send_email?: boolean;
	/** Si quedaron periodos sin timbrar (sin timbres, en pausa con su fecha pasada): all los timbra todos, cada uno con su mes; latest solo el más reciente. Por omisión all. */
	catch_up?: "all" | "latest";
}

/** Los parámetros de GET /v1/recurring_invoices. */
export interface ListRecurringInvoicesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** active o paused. */
	status?: "active" | "paused";
}

export interface UpdateRecurringInvoiceParams {
	/** Nombre. */
	name?: string;
	/** Cada cuánto y a qué hora se timbra. */
	schedule?: {
		/** monthly: cada interval meses en day_of_month. weekly o daily: cada interval semanas o días desde start_date. */
		frequency?: "monthly" | "weekly" | "daily";
		/** Cada cuántos meses, semanas o días. Por omisión 1. Hasta 24 meses, 52 semanas o 365 días. */
		interval?: number;
		/** Con monthly: el día, del 1 al 28, o "last" (el último del mes). Por omisión el día de start_date, o el de hoy. */
		day_of_month?: number | "last";
		/** La primera factura, AAAA-MM-DD (hoy o después). Por omisión: con monthly, el próximo day_of_month; con weekly o daily, hoy. */
		start_date?: string;
		/** La hora (0 a 23) en que se timbra, en time_zone. Por omisión 7. */
		hour?: number;
		/** La zona de esa hora. Por omisión America/Mexico_City. */
		time_zone?: "America/Mexico_City" | "America/Cancun" | "America/Mazatlan" | "America/Hermosillo" | "America/Tijuana" | "America/Ciudad_Juarez";
	};
	/** La factura completa que se repite desde la siguiente vez (reemplaza la anterior). */
	invoice?: InvoiceCreate;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Si quedaron periodos sin timbrar: all los timbra todos, cada uno con su mes; latest solo el más reciente. */
	catch_up?: "all" | "latest";
	/** false la pausa; true la reanuda desde hoy, sin timbrar las fechas que pasaron en pausa. */
	active?: boolean;
}

export interface CreateQuoteParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Un cliente de su catálogo (cus_…), uno con sus datos fiscales (como en POST /v1/invoices: se agrega a sus clientes) o solo name y email si aún no los tiene. */
	customer: string | {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
		tax_system: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip: string;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email?: string | null;
		/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
		foreign?: {
			/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
			country: string;
			/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
			tax_id: string;
		};
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
		ieps_taxpayer?: boolean;
	} | {
		/** A quién va dirigida. */
		name: string;
		/** Su correo (hasta 5, separados por comas). */
		email?: string;
	};
	/** Los conceptos, como en POST /v1/invoices. */
	items: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product?: string;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description?: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key?: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
		unit_key?: string;
		/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
		unit_name?: string | null;
		/** Número de identificación o SKU (NoIdentificacion). */
		sku?: string | null;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price?: number;
		/** Descuento (Descuento). */
		discount?: number;
		/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
		taxability?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
		/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
		ieps?: number;
		/** Tasa o Cuota (TipoFactor del IEPS). */
		ieps_factor?: "Tasa" | "Cuota";
		/** Unidades de IEPS a cuota (litros, cigarros…), si no son la cantidad. */
		ieps_units?: number;
		/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
		iva_retention?: number;
		/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
		isr_retention?: number;
		/** Números de cuenta predial (CuentaPredial) en arrendamiento. */
		predial?: string[];
		/** Números de pedimento (InformacionAduanera) de mercancía importada. */
		pedimentos?: string[];
		/** A cuenta de terceros (ACuentaTerceros): RFC, nombre, régimen y código postal. */
		third_party?: {
			/** RFC de a cuenta de quién (RfcACuentaTerceros). */
			tax_id: string;
			/** Nombre (NombreACuentaTerceros). */
			name: string;
			/** Régimen fiscal (RegimenFiscalACuentaTerceros), c_RegimenFiscal. */
			tax_system: string;
			/** Código postal de su domicilio fiscal (DomicilioFiscalACuentaTerceros). */
			zip: string;
		};
		/** Complemento de instituciones educativas privadas (IEDU): alumno, CURP, nivel y RVOE. */
		iedu?: {
			/** Nombre del alumno (nombreAlumno). */
			student_name: string;
			/** CURP, 18 caracteres. */
			curp: string;
			/** Nivel educativo (nivelEducativo). */
			level: "Preescolar" | "Primaria" | "Secundaria" | "Profesional técnico" | "Bachillerato o su equivalente";
			/** Reconocimiento de validez oficial de estudios (autRVOE). */
			rvoe: string;
			/** RFC de quien paga, si no es el receptor (rfcPago). */
			payer_tax_id?: string | null;
		};
		/** Complemento de vehículo usado. */
		used_vehicle?: {
			/** Monto de adquisición (montoAdquisicion). */
			purchase_amount: number;
			/** Monto de enajenación (montoEnajenacion). */
			sale_amount: number;
			/** Clave vehicular (claveVehicular). */
			vehicle_key: string;
			/** Marca (marca). */
			make: string;
			/** Tipo o versión (tipo). */
			type: string;
			/** Año del modelo (modelo), 4 dígitos. */
			model: string;
			/** Número de motor (numeroMotor). */
			engine_number?: string;
			/** Número de serie (numeroSerie). */
			serial_number?: string;
			/** Número de identificación vehicular (NIV). */
			niv?: string;
			/** Valor según la guía EBC o Libro Azul (valor). */
			guide_value: number;
			/** Información aduanera de la importación del vehículo (InformacionAduanera). */
			customs?: {
				/** Número del documento de importación (numero). */
				number: string;
				/** Fecha del documento (fecha), AAAA-MM-DD. */
				date: string;
				/** Aduana (aduana). */
				office?: string;
			}[];
		};
		/** Addenda del receptor (Walmart, Soriana…), con sus propios campos. */
		addenda?: Record<string, string>;
	}[];
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency?: string;
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate?: number;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form?: string;
	/** Método de pago (MetodoPago): PUE (una sola exhibición, por omisión) o PPD (en parcialidades o diferido, se cobra con complementos de pago). */
	payment_method?: "PUE" | "PPD";
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Observaciones que aparecen en el PDF (no van en el XML). */
	notes?: string;
	/** Hasta cuándo es válida (AAAA-MM-DD, hasta un año). Por omisión, en 15 días. */
	valid_until?: string;
	/** Condiciones: tiempo de entrega, anticipo, garantía… */
	terms?: string;
	/** Al aceptarla, timbrar la factura sola (con los datos fiscales del cliente; si no los tiene, la página se los pide primero). Por omisión false: la factura se timbra con POST /v1/quotes/{id}/invoice. */
	auto_invoice?: boolean;
}

/** Los parámetros de GET /v1/quotes. */
export interface ListQuotesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo las que estén en este estado. */
	status?: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired" | "invoiced";
}

export interface UpdateQuoteParams {
	/** Un cliente de su catálogo (cus_…), uno con sus datos fiscales (como en POST /v1/invoices: se agrega a sus clientes) o solo name y email si aún no los tiene. */
	customer?: string | {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Régimen fiscal (RegimenFiscal), clave de c_RegimenFiscal: 601, 612, 626… */
		tax_system: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip: string;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email?: string | null;
		/** Si es extranjero: su país de residencia (ResidenciaFiscal, c_Pais) y su número de registro tributario (NumRegIdTrib), con el RFC genérico XEXX010101000. */
		foreign?: {
			/** País de residencia fiscal, clave de 3 letras de c_Pais (USA, CAN…). */
			country: string;
			/** Número de registro de identidad fiscal en su país (NumRegIdTrib). */
			tax_id: string;
		};
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio. */
		ieps_taxpayer?: boolean;
	} | {
		/** A quién va dirigida. */
		name: string;
		/** Su correo (hasta 5, separados por comas). */
		email?: string;
	};
	/** Los conceptos, como en POST /v1/invoices. */
	items?: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product?: string;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description?: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key?: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio (por omisión), H87 pieza, ACT actividad… */
		unit_key?: string;
		/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
		unit_name?: string | null;
		/** Número de identificación o SKU (NoIdentificacion). */
		sku?: string | null;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price?: number;
		/** Descuento (Descuento). */
		discount?: number;
		/** Objeto de impuesto (ObjetoImp), c_ObjetoImp: 01 no objeto, 02 sí objeto (por omisión), 03 sin desglose, 04 no causa… */
		taxability?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08";
		/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** IEPS trasladado: tasa (0.265…) o cuota en pesos por unidad, según ieps_factor. */
		ieps?: number;
		/** Tasa o Cuota (TipoFactor del IEPS). */
		ieps_factor?: "Tasa" | "Cuota";
		/** Unidades de IEPS a cuota (litros, cigarros…), si no son la cantidad. */
		ieps_units?: number;
		/** Tasa de IVA retenido (por ejemplo 0.106667, dos terceras partes del 16%). */
		iva_retention?: number;
		/** Tasa de ISR retenido (por ejemplo 0.10 honorarios, 0.0125 RESICO). */
		isr_retention?: number;
		/** Números de cuenta predial (CuentaPredial) en arrendamiento. */
		predial?: string[];
		/** Números de pedimento (InformacionAduanera) de mercancía importada. */
		pedimentos?: string[];
		/** A cuenta de terceros (ACuentaTerceros): RFC, nombre, régimen y código postal. */
		third_party?: {
			/** RFC de a cuenta de quién (RfcACuentaTerceros). */
			tax_id: string;
			/** Nombre (NombreACuentaTerceros). */
			name: string;
			/** Régimen fiscal (RegimenFiscalACuentaTerceros), c_RegimenFiscal. */
			tax_system: string;
			/** Código postal de su domicilio fiscal (DomicilioFiscalACuentaTerceros). */
			zip: string;
		};
		/** Complemento de instituciones educativas privadas (IEDU): alumno, CURP, nivel y RVOE. */
		iedu?: {
			/** Nombre del alumno (nombreAlumno). */
			student_name: string;
			/** CURP, 18 caracteres. */
			curp: string;
			/** Nivel educativo (nivelEducativo). */
			level: "Preescolar" | "Primaria" | "Secundaria" | "Profesional técnico" | "Bachillerato o su equivalente";
			/** Reconocimiento de validez oficial de estudios (autRVOE). */
			rvoe: string;
			/** RFC de quien paga, si no es el receptor (rfcPago). */
			payer_tax_id?: string | null;
		};
		/** Complemento de vehículo usado. */
		used_vehicle?: {
			/** Monto de adquisición (montoAdquisicion). */
			purchase_amount: number;
			/** Monto de enajenación (montoEnajenacion). */
			sale_amount: number;
			/** Clave vehicular (claveVehicular). */
			vehicle_key: string;
			/** Marca (marca). */
			make: string;
			/** Tipo o versión (tipo). */
			type: string;
			/** Año del modelo (modelo), 4 dígitos. */
			model: string;
			/** Número de motor (numeroMotor). */
			engine_number?: string;
			/** Número de serie (numeroSerie). */
			serial_number?: string;
			/** Número de identificación vehicular (NIV). */
			niv?: string;
			/** Valor según la guía EBC o Libro Azul (valor). */
			guide_value: number;
			/** Información aduanera de la importación del vehículo (InformacionAduanera). */
			customs?: {
				/** Número del documento de importación (numero). */
				number: string;
				/** Fecha del documento (fecha), AAAA-MM-DD. */
				date: string;
				/** Aduana (aduana). */
				office?: string;
			}[];
		};
		/** Addenda del receptor (Walmart, Soriana…), con sus propios campos. */
		addenda?: Record<string, string>;
	}[];
	/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
	currency?: string;
	/** Tipo de cambio a pesos (TipoCambio). Obligatorio si la moneda no es MXN; use el del DOF del día anterior. */
	exchange_rate?: number;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form?: string;
	/** Método de pago (MetodoPago): PUE (una sola exhibición, por omisión) o PPD (en parcialidades o diferido, se cobra con complementos de pago). */
	payment_method?: "PUE" | "PPD";
	/** Uso del CFDI (UsoCFDI), clave de c_UsoCFDI. Por omisión G03, o S01 con régimen 616. */
	use?: string;
	/** Observaciones que aparecen en el PDF (no van en el XML). */
	notes?: string;
	/** Hasta cuándo es válida (AAAA-MM-DD, hasta un año). Por omisión, en 15 días. */
	valid_until?: string;
	/** Condiciones: tiempo de entrega, anticipo, garantía… */
	terms?: string;
}

export interface SendQuoteParams {
	/** Mandarla por correo, con su PDF y la liga (por omisión true). Con false solo se marca enviada y contesta url, para que usted la mande. */
	send_email?: boolean;
	/** A quién (hasta 5 correos). Por omisión, el correo del cliente. */
	to?: string;
	/** Un mensaje en el correo. */
	message?: string;
	/** Al aceptarla, timbrar la factura sola (con los datos fiscales del cliente; si no los tiene, la página se los pide primero). Por omisión false: la factura se timbra con POST /v1/quotes/{id}/invoice. */
	auto_invoice?: boolean;
}

export interface CreateWebhookEndpointParams {
	/** Dirección https de su servidor que recibe los avisos. */
	url: string;
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). Ver la lista en Webhooks. */
	events?: string[] | null;
	/** Para qué es, para usted (no se manda en los eventos). */
	description?: string | null;
	/** La versión de la API en que llegan sus eventos (por ejemplo 2026-10-24); null o sin mandar: la de la cuenta. Así actualiza un endpoint a la vez. */
	api_version?: string | null;
}

/** Los parámetros de GET /v1/webhook_endpoints. */
export interface ListWebhookEndpointsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
}

export interface UpdateWebhookEndpointParams {
	/** Dirección https de su servidor que recibe los avisos. */
	url?: string;
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). Ver la lista en Webhooks. */
	events?: string[] | null;
	/** Para qué es, para usted (no se manda en los eventos). */
	description?: string | null;
	/** true para apagarlo sin borrarlo. */
	disabled?: boolean;
	/** La versión de la API en que llegan sus eventos (por ejemplo 2026-10-24); null o sin mandar: la de la cuenta. Así actualiza un endpoint a la vez. */
	api_version?: string | null;
}

export interface RollWebhookSecretParams {
	/** Segundos que el secreto anterior sigue firmando, de 0 (deja de firmar ya: úselo si se filtró) a 86400. Por omisión 86400 (24 horas). */
	previous_secret_expires_in?: number;
}

export interface TestWebhookEndpointParams {
	/** El evento a mandar. Por omisión invoice.stamped. */
	type?: "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.paid" | "invoice.partially_paid" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "issuer.ready" | "balance.low" | "test_clock.ready";
}

/** Los parámetros de GET /v1/events. */
export interface ListEventsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** Solo de este tipo. */
	type?: "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.paid" | "invoice.partially_paid" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "issuer.ready" | "balance.low" | "test_clock.ready";
	/** Solo los de este objeto (inv_…, ret_…, bat_…). */
	object?: string;
}

/** Cuenta: fiscalisto.account. */
export class AccountResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver la cuenta
	 *
	 * La cuenta API y la llave con que se hizo la solicitud. Útil para probar la llave.
	 *
	 * GET /v1/account
	 * @see https://fiscalisto.com/docs/api/referencia/cuenta/get-account
	 */
	get(options?: RequestOptions): Promise<Account> {
		return this.#client.request({ method: "GET", path: "/v1/account" }, options);
	}

	/**
	 * Cambiar la versión de la API
	 *
	 * Mueve la versión de la API de la cuenta: la que reciben sus solicitudes sin el encabezado Fiscalisto-Version y sus webhooks sin api_version propio. Antes, pruebe la nueva mandando Fiscalisto-Version en sus solicitudes. Con una llave de la cuenta con todos los permisos (no de un entorno de prueba). Queda en Desarrolladores › Actividad.
	 *
	 * POST /v1/account
	 * @see https://fiscalisto.com/docs/api/referencia/cuenta/update-account
	 */
	update(params: UpdateAccountParams, options?: RequestOptions): Promise<Account> {
		return this.#client.request({ method: "POST", path: "/v1/account", body: params, idempotent: true }, options);
	}
}

/** Cuenta: fiscalisto.testData. */
export class TestDataResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Reiniciar los datos de prueba
	 *
	 * Deja el modo de pruebas como nuevo: cada emisor de pruebas conserva su RFC y su CSD de pruebas pero pierde sus facturas, clientes, productos, lotes, ligas y descargas, y se borran los eventos y el registro de solicitudes de pruebas. Las llaves y los webhooks se quedan. Con seed (por omisión) deja 3 clientes y 3 productos de ejemplo. Solo con una llave fk_test_; producción nunca se toca.
	 *
	 * POST /v1/test_data/reset
	 * @see https://fiscalisto.com/docs/api/referencia/cuenta/reset-test-data
	 */
	reset(params?: ResetTestDataParams, options?: RequestOptions): Promise<TestDataReset> {
		return this.#client.request({ method: "POST", path: "/v1/test_data/reset", body: params, idempotent: true }, options);
	}
}

/** Entornos de prueba: fiscalisto.sandboxes. */
export class SandboxesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un entorno de prueba
	 *
	 * Un modo de pruebas propio para una persona o un proyecto: nace con el emisor de pruebas del SAT y una llave fk_test_ (key.secret, una sola vez) que solo ve los emisores, webhooks y eventos del entorno, y que reinicia solo los suyos. Se crea con una llave de pruebas de la cuenta (no de otro entorno ni limitada a emisores). Hasta 25 por cuenta.
	 *
	 * POST /v1/sandboxes
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/create-sandbox
	 */
	create(params: CreateSandboxParams, options?: RequestOptions): Promise<Sandbox> {
		return this.#client.request({ method: "POST", path: "/v1/sandboxes", body: params, idempotent: true }, options);
	}

	/**
	 * Listar entornos de prueba
	 *
	 * GET /v1/sandboxes
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/list-sandboxes
	 */
	list(options?: RequestOptions): Promise<SandboxList> {
		return this.#client.request({ method: "GET", path: "/v1/sandboxes" }, options);
	}

	/**
	 * Ver un entorno de prueba
	 *
	 * GET /v1/sandboxes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/get-sandbox
	 */
	get(id: string, options?: RequestOptions): Promise<Sandbox> {
		return this.#client.request({ method: "GET", path: `/v1/sandboxes/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Borrar un entorno de prueba
	 *
	 * Sus llaves dejan de funcionar al momento, sus emisores se archivan y sus webhooks se borran. No toca nada de la cuenta ni de otros entornos.
	 *
	 * DELETE /v1/sandboxes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/delete-sandbox
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/sandboxes/${encodeURIComponent(id)}` }, options);
	}
}

/** Entornos de prueba: fiscalisto.testClocks. */
export class TestClocksResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un reloj de prueba
	 *
	 * Le da a un emisor de pruebas su propia hora, congelada en frozen_time (ahora, si no la manda): sus facturas recurrentes, cotizaciones, cuentas por cobrar y tickets cuentan los días con ella, y nada de eso corre solo hasta que usted lo adelanta. Para ver en segundos lo que pasa en meses. Solo emisores de prueba; uno por emisor.
	 *
	 * POST /v1/issuers/{id}/test_clock
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/create-test-clock
	 */
	create(id: string, params?: CreateTestClockParams, options?: RequestOptions): Promise<TestClock> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/test_clock`, body: params, idempotent: true }, options);
	}

	/**
	 * Ver el reloj de prueba
	 *
	 * GET /v1/issuers/{id}/test_clock
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/get-test-clock
	 */
	get(id: string, options?: RequestOptions): Promise<TestClock> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/test_clock` }, options);
	}

	/**
	 * Borrar el reloj de prueba
	 *
	 * El emisor vuelve a la hora real; lo que el reloj dejó pendiente lo hacen los procesos diarios.
	 *
	 * DELETE /v1/issuers/{id}/test_clock
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/delete-test-clock
	 */
	delete(id: string, options?: RequestOptions): Promise<TestClock> {
		return this.#client.request({ method: "DELETE", path: `/v1/issuers/${encodeURIComponent(id)}/test_clock` }, options);
	}

	/**
	 * Adelantar el reloj de prueba
	 *
	 * Mueve el reloj hasta frozen_time haciendo, día por día, lo que habría pasado: timbra las facturas recurrentes de cada periodo, vence las cotizaciones y hace las facturas globales de tickets, con sus eventos. Contesta cuando terminó, con lo que hizo en advanced, y llega test_clock.ready. Hasta 25 comprobantes por solicitud: si se detiene antes, stopped_early y otra llamada sigue. Los CFDI se timbran con la fecha real (el SAT solo acepta la de hoy); el periodo, los vencimientos y los eventos siguen al reloj.
	 *
	 * POST /v1/issuers/{id}/test_clock/advance
	 * @see https://fiscalisto.com/docs/api/referencia/entornos-de-prueba/advance-test-clock
	 */
	advance(id: string, params: AdvanceTestClockParams, options?: RequestOptions): Promise<TestClock> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/test_clock/advance`, body: params, idempotent: true }, options);
	}
}

/** Cuenta: fiscalisto.balance. */
export class BalanceResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver los timbres
	 *
	 * Los timbres de producción que le quedan, por paquete. En pruebas se timbra gratis.
	 *
	 * GET /v1/balance
	 * @see https://fiscalisto.com/docs/api/referencia/cuenta/get-balance
	 */
	get(options?: RequestOptions): Promise<Balance> {
		return this.#client.request({ method: "GET", path: "/v1/balance" }, options);
	}
}

/** Emisores: fiscalisto.issuers. */
export class IssuersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un emisor
	 *
	 * Agrega un RFC que va a timbrar. Después suba su CSD (POST /v1/issuers/{id}/certificates) y, solo en producción, firme una vez el contrato con el PAC con su e.firma (POST /v1/issuers/{id}/efirma).
	 *
	 * POST /v1/issuers
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/create-issuer
	 */
	create(params: CreateIssuerParams, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "POST", path: "/v1/issuers", body: params, idempotent: true }, options);
	}

	/**
	 * Listar emisores
	 *
	 * GET /v1/issuers
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/list-issuers
	 */
	list(params?: ListIssuersParams, options?: RequestOptions): List<Issuer> {
		return this.#client.list({ path: "/v1/issuers", query: params }, options);
	}

	/**
	 * Ver un emisor
	 *
	 * GET /v1/issuers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/get-issuer
	 */
	get(id: string, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un emisor
	 *
	 * Solo cambia lo que mande. El RFC no cambia: cree otro emisor.
	 *
	 * POST /v1/issuers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/update-issuer
	 */
	update(id: string, params?: UpdateIssuerParams, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Archivar un emisor
	 *
	 * Deja de timbrar; sus comprobantes se quedan.
	 *
	 * DELETE /v1/issuers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/archive-issuer
	 */
	archive(id: string, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "DELETE", path: `/v1/issuers/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Subir el CSD
	 *
	 * El certificado de sello digital (.cer y .key en base64) y la contraseña de la llave. Se guarda cifrado y solo se usa para sellar. En pruebas se revisa pero se timbra con el CSD de pruebas del SAT.
	 *
	 * POST /v1/issuers/{id}/certificates
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/upload-certificate
	 */
	uploadCertificate(id: string, params: UploadCertificateParams, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/certificates`, body: params, idempotent: true }, options);
	}

	/**
	 * Firmar el contrato con el PAC
	 *
	 * Una sola vez por RFC antes de timbrar en producción: firma el contrato de servicio del PAC (Finkok) con la e.firma del emisor. La e.firma se usa en memoria para esa firma y no se guarda, salvo que mande keep_for_downloads: true para pedirle al SAT las facturas del emisor (POST /v1/sat_downloads); entonces se guarda cifrada y puede borrarla con DELETE.
	 *
	 * POST /v1/issuers/{id}/efirma
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/sign-efirma
	 */
	signEfirma(id: string, params: SignEfirmaParams, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/efirma`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar la e.firma guardada
	 *
	 * Borra la e.firma que guardó con keep_for_downloads. El emisor sigue timbrando; ya no puede pedir descargas al SAT hasta que la mande de nuevo.
	 *
	 * DELETE /v1/issuers/{id}/efirma
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/delete-efirma
	 */
	deleteEfirma(id: string, options?: RequestOptions): Promise<Issuer> {
		return this.#client.request({ method: "DELETE", path: `/v1/issuers/${encodeURIComponent(id)}/efirma` }, options);
	}

	/**
	 * Crear una liga de alta
	 *
	 * Una página en fiscalisto.com donde el dueño del emisor sube su CSD y firma el contrato con el PAC con su e.firma, sin que esos archivos ni sus contraseñas pasen por su plataforma. Mande a su cliente a url; al terminar vuelve a return_url y llega issuer.ready. Cada liga sirve para un emisor, hasta que vence.
	 *
	 * POST /v1/issuers/{id}/onboarding_links
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/create-issuer-onboarding-link
	 */
	createOnboardingLink(id: string, params?: CreateIssuerOnboardingLinkParams, options?: RequestOptions): Promise<IssuerOnboardingLink> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/onboarding_links`, body: params, idempotent: true }, options);
	}

	/**
	 * Ver el portal de autofactura de un emisor
	 *
	 * GET /v1/issuers/{id}/self_invoicing
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/get-self-invoicing
	 */
	getSelfInvoicing(id: string, options?: RequestOptions): Promise<SelfInvoicing> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/self_invoicing` }, options);
	}

	/**
	 * Cambiar las reglas de autofactura
	 *
	 * Hasta cuándo se puede facturar un ticket y cada cuánto se timbra la factura global.
	 *
	 * POST /v1/issuers/{id}/self_invoicing
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/update-self-invoicing
	 */
	updateSelfInvoicing(id: string, params?: UpdateSelfInvoicingParams, options?: RequestOptions): Promise<SelfInvoicing> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/self_invoicing`, body: params, idempotent: true }, options);
	}
}

/** Facturas: fiscalisto.invoices. */
export class InvoicesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar una factura
	 *
	 * Revisa la factura con las reglas del SAT, la sella y la timbra en una sola llamada. Responde con la factura timbrada (status valid) o, si el PAC tarda, en processing (escuche invoice.stamped). Lo que puede omitir tiene el valor usual: PUE, MXN, uso G03 (S01 con régimen 616), objeto de impuesto 02, IVA 16%, cantidad 1, unidad E48.
	 *
	 * POST /v1/invoices
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/create-invoice
	 */
	create(params: InvoiceCreate, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/invoices", body: params, idempotent: true }, options);
	}

	/**
	 * Listar facturas
	 *
	 * Las más recientes primero.
	 *
	 * GET /v1/invoices
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/list-invoices
	 */
	list(params?: ListInvoicesParams, options?: RequestOptions): List<Invoice> {
		return this.#client.list({ path: "/v1/invoices", query: params }, options);
	}

	/**
	 * Ver una factura
	 *
	 * Por su id (inv_…) o por su folio fiscal (UUID).
	 *
	 * GET /v1/invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/get-invoice
	 */
	get(id: string, params?: GetInvoiceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "GET", path: `/v1/invoices/${encodeURIComponent(id)}`, query: params }, options);
	}

	/**
	 * Descargar el PDF
	 *
	 * GET /v1/invoices/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/get-invoice-pdf
	 */
	pdf(id: string, params?: GetInvoicePdfParams, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/invoices/${encodeURIComponent(id)}/pdf`, query: params, as: "bytes" }, options);
	}

	/**
	 * Descargar el XML
	 *
	 * El CFDI timbrado, tal como lo tiene el SAT.
	 *
	 * GET /v1/invoices/{id}/xml
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/get-invoice-xml
	 */
	xml(id: string, params?: GetInvoiceXmlParams, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/invoices/${encodeURIComponent(id)}/xml`, query: params, as: "text" }, options);
	}

	/**
	 * Enviar por correo
	 *
	 * Manda el PDF y el XML con el diseño de Fiscalisto. Sin `to`, al correo del cliente. Con la misma Idempotency-Key no se manda dos veces.
	 *
	 * POST /v1/invoices/{id}/send
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/send-invoice
	 */
	send(id: string, params?: SendInvoiceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/send`, body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar una factura
	 *
	 * Pide la cancelación al SAT. Si el cliente debe aceptarla queda en pending (escuche invoice.canceled o invoice.cancellation_rejected). Usa un timbre la primera vez que el SAT acepta la solicitud; repetirla, o pedirla otra vez después de un rechazo, no. Nunca se niega por falta de timbres.
	 *
	 * POST /v1/invoices/{id}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/cancel-invoice
	 */
	cancel(id: string, params?: CancelInvoiceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/cancel`, body: params, idempotent: true }, options);
	}

	/**
	 * Sustituir una factura
	 *
	 * Timbra la factura corregida (el mismo cuerpo que POST /v1/invoices, relacionada 04) y cancela la anterior con motivo 01.
	 *
	 * POST /v1/invoices/{id}/substitute
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/substitute-invoice
	 */
	substitute(id: string, params: InvoiceCreate, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/substitute`, body: params, idempotent: true }, options);
	}

	/**
	 * Marcar pagada
	 *
	 * Una factura PUE timbrada con paid_later (o marcada por cobrar) ya se pagó: queda paid y llega invoice.paid. Una PPD se paga con su complemento de pago (POST /v1/payments).
	 *
	 * POST /v1/invoices/{id}/mark_paid
	 * @see https://fiscalisto.com/docs/api/referencia/cuentas-por-cobrar/mark-invoice-paid
	 */
	markPaid(id: string, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/mark_paid`, idempotent: true }, options);
	}

	/**
	 * Marcar por cobrar
	 *
	 * Una factura PUE que el cliente aún no paga (le paga este mes): queda unpaid hasta POST /v1/invoices/{id}/mark_paid. Si el mes termina sin pago, la ley pide sustituirla por una PPD (regla 2.7.1.39 de la RMF).
	 *
	 * POST /v1/invoices/{id}/mark_unpaid
	 * @see https://fiscalisto.com/docs/api/referencia/cuentas-por-cobrar/mark-invoice-unpaid
	 */
	markUnpaid(id: string, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/mark_unpaid`, idempotent: true }, options);
	}
}

/** Cuentas por cobrar: fiscalisto.receivables. */
export class ReceivablesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver lo que le deben
	 *
	 * Lo que debe cada cliente, por moneda, de sus facturas abiertas (PPD con saldo y PUE por cobrar), ordenado por RFC. Las facturas de cada uno: GET /v1/invoices?customer=RFC&payment_status=open.
	 *
	 * GET /v1/receivables
	 * @see https://fiscalisto.com/docs/api/referencia/cuentas-por-cobrar/list-receivables
	 */
	list(params?: ListReceivablesParams, options?: RequestOptions): List<Receivable> {
		return this.#client.list({ path: "/v1/receivables", query: params }, options);
	}
}

/** Conciliación bancaria: fiscalisto.bankTransactions. */
export class BankTransactionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Mandar depósitos
	 *
	 * Los depósitos de la cuenta del emisor (de la API de su banco o de un estado de cuenta), hasta 1,000 por solicitud. Uno que ya mandó (mismo día, monto, referencia y concepto) se omite, así que puede mandar periodos que se enciman. Cada uno trae suggested_match: las facturas que parece pagar.
	 *
	 * POST /v1/bank_transactions
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/create-bank-transactions
	 */
	create(params: CreateBankTransactionsParams, options?: RequestOptions): Promise<BankImport> {
		return this.#client.request({ method: "POST", path: "/v1/bank_transactions", body: params, idempotent: true }, options);
	}

	/**
	 * Listar depósitos
	 *
	 * Los más recientes primero; los abiertos con su suggested_match.
	 *
	 * GET /v1/bank_transactions
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/list-bank-transactions
	 */
	list(params?: ListBankTransactionsParams, options?: RequestOptions): List<BankTransaction> {
		return this.#client.list({ path: "/v1/bank_transactions", query: params }, options);
	}

	/**
	 * Ver un depósito
	 *
	 * GET /v1/bank_transactions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/get-bank-transaction
	 */
	get(id: string, options?: RequestOptions): Promise<BankTransaction> {
		return this.#client.request({ method: "GET", path: `/v1/bank_transactions/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Conciliar un depósito
	 *
	 * El depósito pagó estas facturas (de un mismo cliente), o sin invoices, las de suggested_match. Sus facturas PUE por cobrar quedan pagadas (invoice.paid). No timbra: para pagar una PPD con este depósito, POST /v1/payments con bank_transaction.
	 *
	 * POST /v1/bank_transactions/{id}/match
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/match-bank-transaction
	 */
	match(id: string, params?: MatchBankTransactionParams, options?: RequestOptions): Promise<BankTransaction> {
		return this.#client.request({ method: "POST", path: `/v1/bank_transactions/${encodeURIComponent(id)}/match`, body: params, idempotent: true }, options);
	}

	/**
	 * Explicar un depósito sin factura
	 *
	 * Un depósito que ninguna factura explica: venta (aún sin facturar), prestamo, traspaso o devolucion. El SAT puede presumir ingreso un depósito sin explicar (CFF art. 59 fr. III).
	 *
	 * POST /v1/bank_transactions/{id}/classify
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/classify-bank-transaction
	 */
	classify(id: string, params: ClassifyBankTransactionParams, options?: RequestOptions): Promise<BankTransaction> {
		return this.#client.request({ method: "POST", path: `/v1/bank_transactions/${encodeURIComponent(id)}/classify`, body: params, idempotent: true }, options);
	}

	/**
	 * Deshacer la conciliación
	 *
	 * Vuelve a open, y sus facturas vuelven a deber. Si se pagó con un complemento vigente, cancélelo antes.
	 *
	 * POST /v1/bank_transactions/{id}/reopen
	 * @see https://fiscalisto.com/docs/api/referencia/conciliacion-bancaria/reopen-bank-transaction
	 */
	reopen(id: string, options?: RequestOptions): Promise<BankTransaction> {
		return this.#client.request({ method: "POST", path: `/v1/bank_transactions/${encodeURIComponent(id)}/reopen`, idempotent: true }, options);
	}
}

/** Pagos y notas de crédito: fiscalisto.payments. */
export class PaymentsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar un complemento de pago
	 *
	 * El recibo de pago (CFDI tipo P, Pagos 2.0) de facturas PPD: parcialidad, saldo anterior e insoluto e impuestos de cada una los calcula Fiscalisto.
	 *
	 * POST /v1/payments
	 * @see https://fiscalisto.com/docs/api/referencia/pagos-y-notas-de-credito/create-payment
	 */
	create(params: CreatePaymentParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/payments", body: params, idempotent: true }, options);
	}
}

/** Pagos y notas de crédito: fiscalisto.creditNotes. */
export class CreditNotesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar una nota de crédito
	 *
	 * Un egreso (tipo E) relacionado 01 (o 03, devolución) a una factura, con su IVA y retenciones en la misma proporción. amount es antes de impuestos.
	 *
	 * POST /v1/credit_notes
	 * @see https://fiscalisto.com/docs/api/referencia/pagos-y-notas-de-credito/create-credit-note
	 */
	create(params: CreateCreditNoteParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/credit_notes", body: params, idempotent: true }, options);
	}
}

/** Anticipos: fiscalisto.advances. */
export class AdvancesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar un anticipo
	 *
	 * La factura del anticipo: un concepto «Anticipo del bien o servicio» (84111506, ACT). amount es lo que pagó el cliente con IVA.
	 *
	 * POST /v1/advances
	 * @see https://fiscalisto.com/docs/api/referencia/anticipos/create-advance
	 */
	create(params: CreateAdvanceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/advances", body: params, idempotent: true }, options);
	}

	/**
	 * Listar anticipos sin aplicar
	 *
	 * GET /v1/advances
	 * @see https://fiscalisto.com/docs/api/referencia/anticipos/list-advances
	 */
	list(params?: ListAdvancesParams, options?: RequestOptions): Promise<AdvanceList> {
		return this.#client.request({ method: "GET", path: "/v1/advances", query: params }, options);
	}

	/**
	 * Aplicar un anticipo
	 *
	 * Timbra la factura de lo vendido (el cuerpo de POST /v1/invoices) relacionada 07 al anticipo. Con method egreso, también la nota de aplicación. La misma Idempotency-Key continúa donde se quedó.
	 *
	 * POST /v1/advances/{id}/apply
	 * @see https://fiscalisto.com/docs/api/referencia/anticipos/apply-advance
	 */
	apply(id: string, params: ApplyAdvanceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/advances/${encodeURIComponent(id)}/apply`, body: params, idempotent: true }, options);
	}
}

/** Retenciones: fiscalisto.retentions. */
export class RetentionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar una constancia de retenciones
	 *
	 * POST /v1/retentions
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/create-retention
	 */
	create(params: CreateRetentionParams, options?: RequestOptions): Promise<Retention> {
		return this.#client.request({ method: "POST", path: "/v1/retentions", body: params, idempotent: true }, options);
	}

	/**
	 * Listar constancias
	 *
	 * GET /v1/retentions
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/list-retentions
	 */
	list(params?: ListRetentionsParams, options?: RequestOptions): List<Retention> {
		return this.#client.list({ path: "/v1/retentions", query: params }, options);
	}

	/**
	 * Ver una constancia
	 *
	 * GET /v1/retentions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/get-retention
	 */
	get(id: string, params?: GetRetentionParams, options?: RequestOptions): Promise<Retention> {
		return this.#client.request({ method: "GET", path: `/v1/retentions/${encodeURIComponent(id)}`, query: params }, options);
	}

	/**
	 * Descargar el PDF
	 *
	 * GET /v1/retentions/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/get-retention-pdf
	 */
	pdf(id: string, params?: GetRetentionPdfParams, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/retentions/${encodeURIComponent(id)}/pdf`, query: params, as: "bytes" }, options);
	}

	/**
	 * Descargar el XML
	 *
	 * GET /v1/retentions/{id}/xml
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/get-retention-xml
	 */
	xml(id: string, params?: GetRetentionXmlParams, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/retentions/${encodeURIComponent(id)}/xml`, query: params, as: "text" }, options);
	}

	/**
	 * Enviar por correo
	 *
	 * POST /v1/retentions/{id}/send
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/send-retention
	 */
	send(id: string, params?: SendRetentionParams, options?: RequestOptions): Promise<Retention> {
		return this.#client.request({ method: "POST", path: `/v1/retentions/${encodeURIComponent(id)}/send`, body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar una constancia
	 *
	 * Se cancela en el momento (no espera aceptación). Usa un timbre.
	 *
	 * POST /v1/retentions/{id}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/retenciones/cancel-retention
	 */
	cancel(id: string, params?: CancelRetentionParams, options?: RequestOptions): Promise<Retention> {
		return this.#client.request({ method: "POST", path: `/v1/retentions/${encodeURIComponent(id)}/cancel`, body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.employees. */
export class EmployeesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un empleado
	 *
	 * POST /v1/employees
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-employee
	 */
	create(params: CreateEmployeeParams, options?: RequestOptions): Promise<Employee> {
		return this.#client.request({ method: "POST", path: "/v1/employees", body: params, idempotent: true }, options);
	}

	/**
	 * Listar empleados
	 *
	 * GET /v1/employees
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/list-employees
	 */
	list(params?: ListEmployeesParams, options?: RequestOptions): List<Employee> {
		return this.#client.list({ path: "/v1/employees", query: params }, options);
	}

	/**
	 * Ver un empleado
	 *
	 * GET /v1/employees/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-employee
	 */
	get(id: string, options?: RequestOptions): Promise<Employee> {
		return this.#client.request({ method: "GET", path: `/v1/employees/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un empleado
	 *
	 * POST /v1/employees/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-employee
	 */
	update(id: string, params?: UpdateEmployeeParams, options?: RequestOptions): Promise<Employee> {
		return this.#client.request({ method: "POST", path: `/v1/employees/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un empleado
	 *
	 * Sus recibos timbrados se quedan.
	 *
	 * DELETE /v1/employees/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/delete-employee
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/employees/${encodeURIComponent(id)}` }, options);
	}
}

/** Nómina: fiscalisto.payrollReceipts. */
export class PayrollReceiptsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar un recibo de nómina
	 *
	 * Nómina ordinaria (Nómina 1.2): Fiscalisto calcula sueldo, ISR con subsidio al empleo e IMSS del empleado y el periodo, como la app. Queda como factura tipo N (GET /v1/invoices/{id}). El emisor necesita employer_registration.
	 *
	 * POST /v1/payroll_receipts
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-payroll-receipt
	 */
	create(params: CreatePayrollReceiptParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts", body: params, idempotent: true }, options);
	}

	/**
	 * Calcular un recibo sin timbrar
	 *
	 * POST /v1/payroll_receipts/preview
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/preview-payroll-receipt
	 */
	preview(params: PreviewPayrollReceiptParams, options?: RequestOptions): Promise<PayrollReceiptPreview> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/preview", body: params, idempotent: true }, options);
	}
}

/** Lotes: fiscalisto.invoiceBatches. */
export class InvoiceBatchesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar un lote de facturas
	 *
	 * Hasta 1,000 facturas de ingreso de un emisor, timbradas en segundo plano. Se revisan todas antes de empezar: si una no pasa, no se timbra ninguna. Responde 202; escuche invoice_batch.completed o consulte el lote.
	 *
	 * POST /v1/invoice_batches
	 * @see https://fiscalisto.com/docs/api/referencia/lotes/create-invoice-batch
	 */
	create(params: CreateInvoiceBatchParams, options?: RequestOptions): Promise<InvoiceBatch> {
		return this.#client.request({ method: "POST", path: "/v1/invoice_batches", body: params, idempotent: true }, options);
	}

	/**
	 * Listar lotes
	 *
	 * GET /v1/invoice_batches
	 * @see https://fiscalisto.com/docs/api/referencia/lotes/list-invoice-batches
	 */
	list(params?: ListInvoiceBatchesParams, options?: RequestOptions): List<InvoiceBatch> {
		return this.#client.list({ path: "/v1/invoice_batches", query: params }, options);
	}

	/**
	 * Ver un lote
	 *
	 * Con cada factura: su estado, su id y su error.
	 *
	 * GET /v1/invoice_batches/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/lotes/get-invoice-batch
	 */
	get(id: string, options?: RequestOptions): Promise<InvoiceBatch> {
		return this.#client.request({ method: "GET", path: `/v1/invoice_batches/${encodeURIComponent(id)}` }, options);
	}
}

/** Clientes: fiscalisto.taxIds. */
export class TaxIdsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Validar los datos fiscales de un cliente
	 *
	 * Antes de timbrar: si el RFC, el nombre, el régimen, el código postal y el uso van a pasar. Sin cif_id revisa lo que se puede revisar sin el SAT (formato, régimen para ese tipo de persona, código postal en el catálogo, uso para el régimen, nombre sin «S.A. de C.V.») y las listas del SAT. Con el idCIF de la constancia lee el registro del SAT y compara nombre, código postal y régimen, como hará el PAC. No usa timbres.
	 *
	 * POST /v1/tax_ids/validate
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/validate-tax-id
	 */
	validate(params: ValidateTaxIdParams, options?: RequestOptions): Promise<TaxIdValidation> {
		return this.#client.request({ method: "POST", path: "/v1/tax_ids/validate", body: params, idempotent: true }, options);
	}
}

/** Clientes: fiscalisto.customers. */
export class CustomersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un cliente
	 *
	 * POST /v1/customers
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/create-customer
	 */
	create(params: CreateCustomerParams, options?: RequestOptions): Promise<Customer> {
		return this.#client.request({ method: "POST", path: "/v1/customers", body: params, idempotent: true }, options);
	}

	/**
	 * Listar clientes
	 *
	 * GET /v1/customers
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/list-customers
	 */
	list(params?: ListCustomersParams, options?: RequestOptions): List<Customer> {
		return this.#client.list({ path: "/v1/customers", query: params }, options);
	}

	/**
	 * Ver un cliente
	 *
	 * GET /v1/customers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/get-customer
	 */
	get(id: string, options?: RequestOptions): Promise<Customer> {
		return this.#client.request({ method: "GET", path: `/v1/customers/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un cliente
	 *
	 * POST /v1/customers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/update-customer
	 */
	update(id: string, params?: UpdateCustomerParams, options?: RequestOptions): Promise<Customer> {
		return this.#client.request({ method: "POST", path: `/v1/customers/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un cliente
	 *
	 * DELETE /v1/customers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/delete-customer
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/customers/${encodeURIComponent(id)}` }, options);
	}
}

/** Clientes: fiscalisto.customerDataRequests. */
export class CustomerDataRequestsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Pedirle sus datos fiscales a un cliente
	 *
	 * Una liga (url) que usted le manda a su cliente: la abre en fiscalisto.com y da su RFC, nombre, régimen, código postal y uso, escritos o leídos de su constancia, revisados antes de aceptarlos. Al mandarlos llega customer_data_request.completed. Un cliente nuevo queda en el catálogo del emisor; si ya existía con otros datos, los nuevos vienen en submission para que usted los aplique.
	 *
	 * POST /v1/customer_data_requests
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/create-customer-data-request
	 */
	create(params?: CreateCustomerDataRequestParams, options?: RequestOptions): Promise<CustomerDataRequest> {
		return this.#client.request({ method: "POST", path: "/v1/customer_data_requests", body: params, idempotent: true }, options);
	}

	/**
	 * Listar solicitudes de datos
	 *
	 * GET /v1/customer_data_requests
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/list-customer-data-requests
	 */
	list(params?: ListCustomerDataRequestsParams, options?: RequestOptions): List<CustomerDataRequest> {
		return this.#client.list({ path: "/v1/customer_data_requests", query: params }, options);
	}

	/**
	 * Ver una solicitud de datos
	 *
	 * GET /v1/customer_data_requests/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/get-customer-data-request
	 */
	get(id: string, options?: RequestOptions): Promise<CustomerDataRequest> {
		return this.#client.request({ method: "GET", path: `/v1/customer_data_requests/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cancelar una solicitud de datos
	 *
	 * La liga deja de funcionar. Una que el cliente ya contestó no se cancela.
	 *
	 * DELETE /v1/customer_data_requests/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/cancel-customer-data-request
	 */
	cancel(id: string, options?: RequestOptions): Promise<CustomerDataRequest> {
		return this.#client.request({ method: "DELETE", path: `/v1/customer_data_requests/${encodeURIComponent(id)}` }, options);
	}
}

/** Productos: fiscalisto.products. */
export class ProductsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un producto
	 *
	 * POST /v1/products
	 * @see https://fiscalisto.com/docs/api/referencia/productos/create-product
	 */
	create(params: CreateProductParams, options?: RequestOptions): Promise<Product> {
		return this.#client.request({ method: "POST", path: "/v1/products", body: params, idempotent: true }, options);
	}

	/**
	 * Listar productos
	 *
	 * GET /v1/products
	 * @see https://fiscalisto.com/docs/api/referencia/productos/list-products
	 */
	list(params?: ListProductsParams, options?: RequestOptions): List<Product> {
		return this.#client.list({ path: "/v1/products", query: params }, options);
	}

	/**
	 * Ver un producto
	 *
	 * GET /v1/products/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/productos/get-product
	 */
	get(id: string, options?: RequestOptions): Promise<Product> {
		return this.#client.request({ method: "GET", path: `/v1/products/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un producto
	 *
	 * POST /v1/products/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/productos/update-product
	 */
	update(id: string, params?: UpdateProductParams, options?: RequestOptions): Promise<Product> {
		return this.#client.request({ method: "POST", path: `/v1/products/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un producto
	 *
	 * DELETE /v1/products/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/productos/delete-product
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/products/${encodeURIComponent(id)}` }, options);
	}
}

/** Catálogos del SAT: fiscalisto.satCatalogs. */
export class SatCatalogsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Consultar un catálogo del SAT
	 *
	 * product_keys y unit_keys se buscan con q (texto o clave). Los demás vienen completos: tax_systems, cfdi_uses, payment_forms, payment_methods, relationship_types, cancellation_motives, export_types, tax_objects, retention_codes.
	 *
	 * GET /v1/sat_catalogs/{name}
	 * @see https://fiscalisto.com/docs/api/referencia/catalogos-del-sat/get-sat-catalog
	 */
	get(name: string, params?: GetSatCatalogParams, options?: RequestOptions): Promise<SatCatalogEntryList> {
		return this.#client.request({ method: "GET", path: `/v1/sat_catalogs/${encodeURIComponent(name)}`, query: params }, options);
	}
}

/** Listas del SAT: fiscalisto.satLists. */
export class SatListsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Revisar un RFC en las listas del SAT
	 *
	 * Si el RFC aparece en la lista 69-B (operaciones simuladas), 69-B Bis o del art. 69 (no localizados, créditos firmes, exigibles, cancelados, sentencias, CSD sin efectos). Las listas se actualizan cada día con los archivos del SAT. No usa timbres.
	 *
	 * GET /v1/sat_lists/{tax_id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-del-sat/get-sat-list-check
	 */
	get(tax_id: string, options?: RequestOptions): Promise<SatListCheck> {
		return this.#client.request({ method: "GET", path: `/v1/sat_lists/${encodeURIComponent(tax_id)}` }, options);
	}

	/**
	 * Revisar varios RFC en las listas del SAT
	 *
	 * Hasta 1,000 RFC en una solicitud, en el mismo orden en que los mandó (sin repetidos). No usa timbres.
	 *
	 * POST /v1/sat_lists/check
	 * @see https://fiscalisto.com/docs/api/referencia/listas-del-sat/check-sat-lists
	 */
	check(params: CheckSatListsParams, options?: RequestOptions): Promise<SatListCheckList> {
		return this.#client.request({ method: "POST", path: "/v1/sat_lists/check", body: params, idempotent: true }, options);
	}
}

/** Descargas del SAT: fiscalisto.satDownloads. */
export class SatDownloadsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Pedirle al SAT las facturas de un emisor
	 *
	 * La descarga masiva del SAT: las facturas que el emisor recibió (o emitió) en un periodo de hasta un año, con su XML. Contesta 202 de inmediato; el SAT tarda de minutos a horas y al terminar llega sat_download.completed (o sat_download.failed) y las facturas quedan en GET /v1/sat_invoices. En producción necesita la e.firma guardada del emisor; en pruebas no se le pregunta al SAT: la descarga trae facturas de ejemplo al instante. No usa timbres.
	 *
	 * POST /v1/sat_downloads
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/create-sat-download
	 */
	create(params: CreateSatDownloadParams, options?: RequestOptions): Promise<SatDownload> {
		return this.#client.request({ method: "POST", path: "/v1/sat_downloads", body: params, idempotent: true }, options);
	}

	/**
	 * Listar descargas del SAT
	 *
	 * GET /v1/sat_downloads
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/list-sat-downloads
	 */
	list(params?: ListSatDownloadsParams, options?: RequestOptions): List<SatDownload> {
		return this.#client.list({ path: "/v1/sat_downloads", query: params }, options);
	}

	/**
	 * Ver una descarga del SAT
	 *
	 * GET /v1/sat_downloads/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-download
	 */
	get(id: string, options?: RequestOptions): Promise<SatDownload> {
		return this.#client.request({ method: "GET", path: `/v1/sat_downloads/${encodeURIComponent(id)}` }, options);
	}
}

/** Descargas del SAT: fiscalisto.satInvoices. */
export class SatInvoicesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar facturas del SAT
	 *
	 * Las facturas que trajeron sus descargas (y las demás que Fiscalisto tenga del emisor), de la más reciente a la más antigua por fecha.
	 *
	 * GET /v1/sat_invoices
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/list-sat-invoices
	 */
	list(params?: ListSatInvoicesParams, options?: RequestOptions): List<SatInvoice> {
		return this.#client.list({ path: "/v1/sat_invoices", query: params }, options);
	}

	/**
	 * Ver una factura del SAT
	 *
	 * GET /v1/sat_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-invoice
	 */
	get(id: string, options?: RequestOptions): Promise<SatInvoice> {
		return this.#client.request({ method: "GET", path: `/v1/sat_invoices/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Descargar el XML de una factura del SAT
	 *
	 * El CFDI tal como lo entregó el SAT.
	 *
	 * GET /v1/sat_invoices/{id}/xml
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-invoice-xml
	 */
	xml(id: string, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/sat_invoices/${encodeURIComponent(id)}/xml`, as: "text" }, options);
	}
}

/** Autofactura: fiscalisto.tickets. */
export class TicketsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Registrar un ticket
	 *
	 * Una venta que su comprador factura él mismo: con el código (code) y el total en el portal del emisor (url, que puede incrustar en su página con fiscalisto.js), da sus datos fiscales y la factura se timbra al momento con los timbres de su cuenta. Lo que nadie factura entra solo en la factura global del periodo. Registrar otra vez el mismo folio con el mismo total contesta el ticket que ya existe (los reintentos son seguros); con otro total, 409.
	 *
	 * POST /v1/tickets
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/create-ticket
	 */
	create(params: CreateTicketParams, options?: RequestOptions): Promise<Ticket> {
		return this.#client.request({ method: "POST", path: "/v1/tickets", body: params, idempotent: true }, options);
	}

	/**
	 * Listar tickets
	 *
	 * Del más reciente al más antiguo por fecha de venta.
	 *
	 * GET /v1/tickets
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/list-tickets
	 */
	list(params?: ListTicketsParams, options?: RequestOptions): List<Ticket> {
		return this.#client.list({ path: "/v1/tickets", query: params }, options);
	}

	/**
	 * Ver un ticket
	 *
	 * GET /v1/tickets/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/get-ticket
	 */
	get(id: string, options?: RequestOptions): Promise<Ticket> {
		return this.#client.request({ method: "GET", path: `/v1/tickets/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cancelar un ticket
	 *
	 * Una venta que no se hizo (devolución, error): ya no se puede facturar ni entra en la factura global. Solo mientras esté pendiente.
	 *
	 * DELETE /v1/tickets/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/autofactura/cancel-ticket
	 */
	cancel(id: string, options?: RequestOptions): Promise<Ticket> {
		return this.#client.request({ method: "DELETE", path: `/v1/tickets/${encodeURIComponent(id)}` }, options);
	}
}

/** Contabilidad: fiscalisto.accounting. */
export class AccountingResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar las pólizas de un mes
	 *
	 * Una póliza de diario por cada CFDI de ingreso o egreso vigente del mes, emitido o recibido (los recibidos con la categoría de su gasto), con sus cuentas y código agrupador del SAT. En pesos; un CFDI en otra moneda sin tipo de cambio no se registra. Es un punto de partida para su contador: no incluye bancos, nómina ni depreciaciones.
	 *
	 * GET /v1/accounting/journal_entries
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-journal-entries
	 */
	journalEntries(params: ListJournalEntriesParams, options?: RequestOptions): List<JournalEntry> {
		return this.#client.list({ path: "/v1/accounting/journal_entries", query: params }, options);
	}

	/**
	 * Ver la balanza de comprobación
	 *
	 * Saldo inicial, cargos, abonos y saldo final de cada cuenta en el mes. Los saldos iniciales se acumulan desde el primer CFDI (las de resultados, desde enero), y los resultados de cada año anterior se cierran a capital.
	 *
	 * GET /v1/accounting/trial_balance
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-trial-balance
	 */
	trialBalance(params: GetTrialBalanceParams, options?: RequestOptions): Promise<TrialBalance> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/trial_balance", query: params }, options);
	}

	/**
	 * Ver el catálogo de cuentas
	 *
	 * Las cuentas que usan las pólizas, con su código agrupador del SAT.
	 *
	 * GET /v1/accounting/accounts
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-ledger-accounts
	 */
	accounts(params?: ListLedgerAccountsParams, options?: RequestOptions): Promise<LedgerAccountList> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/accounts", query: params }, options);
	}

	/**
	 * Descargar la contabilidad electrónica
	 *
	 * El ZIP del mes para el Buzón Tributario: el catálogo (CT) y la balanza (BN, o BC si es complementaria), cada uno en su ZIP con el nombre que espera el SAT, en el formato 1.3 del Anexo 24. Con journal_request, también las pólizas (PL), que se entregan cuando el SAT las pide.
	 *
	 * GET /v1/accounting/electronic_accounting
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-electronic-accounting
	 */
	electronicAccounting(params: GetElectronicAccountingParams, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/electronic_accounting", query: params, as: "text" }, options);
	}

	/**
	 * Ver la DIOT de un mes
	 *
	 * Lo efectivamente pagado a cada proveedor en el mes (facturas PUE y complementos de pago recibidos), con sus notas de crédito como devoluciones, por tipo de operación. Sale de las facturas recibidas que trajo de las descargas del SAT. Desde enero de 2025 (formato 2025).
	 *
	 * GET /v1/accounting/diot
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-diot
	 */
	diot(params: GetDiotParams, options?: RequestOptions): Promise<Diot> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/diot", query: params }, options);
	}

	/**
	 * Descargar la DIOT para el SAT
	 *
	 * El TXT de carga masiva de la DIOT 2025: 54 campos separados por |, pesos enteros. Con group_small_suppliers=true junta en una línea global a los proveedores chicos (regla 4.5.2 RMF). Un mes sin pagos a proveedores responde diot_empty: esa se presenta sin operaciones en el portal del SAT.
	 *
	 * GET /v1/accounting/diot/file
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-diot-file
	 */
	diotFile(params: GetDiotFileParams, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/diot/file", query: params, as: "text" }, options);
	}
}

/** Tiendas en línea: fiscalisto.storeConnections. */
export class StoreConnectionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Conectar una tienda
	 *
	 * Shopify: con el dominio y las llaves de la app de la tienda (Dev Dashboard, permisos read_orders y write_orders) registra los webhooks y queda active. Mercado Libre: queda pending hasta que el vendedor autorice en authorize_url. Desde entonces cada pedido pagado es un ticket (folio SHOP-1001 o ML-…), que su comprador factura en el portal o entra en la factura global; un pedido cancelado o reembolsado completo cancela su ticket.
	 *
	 * POST /v1/store_connections
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/create-store-connection
	 */
	create(params: CreateStoreConnectionParams, options?: RequestOptions): Promise<StoreConnection> {
		return this.#client.request({ method: "POST", path: "/v1/store_connections", body: params, idempotent: true }, options);
	}

	/**
	 * Listar tiendas
	 *
	 * Las más recientes primero, también las desconectadas.
	 *
	 * GET /v1/store_connections
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/list-store-connections
	 */
	list(params?: ListStoreConnectionsParams, options?: RequestOptions): List<StoreConnection> {
		return this.#client.list({ path: "/v1/store_connections", query: params }, options);
	}

	/**
	 * Ver una tienda
	 *
	 * GET /v1/store_connections/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/get-store-connection
	 */
	get(id: string, options?: RequestOptions): Promise<StoreConnection> {
		return this.#client.request({ method: "GET", path: `/v1/store_connections/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar cómo se vuelven tickets sus pedidos
	 *
	 * Cuenta para los pedidos que lleguen; los tickets ya hechos no cambian.
	 *
	 * POST /v1/store_connections/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/update-store-connection
	 */
	update(id: string, params: UpdateStoreConnectionParams, options?: RequestOptions): Promise<StoreConnection> {
		return this.#client.request({ method: "POST", path: `/v1/store_connections/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Desconectar una tienda
	 *
	 * Sus pedidos dejan de llegar y se borran sus llaves y webhooks. Los tickets que ya hizo siguen.
	 *
	 * DELETE /v1/store_connections/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/delete-store-connection
	 */
	delete(id: string, options?: RequestOptions): Promise<StoreConnection> {
		return this.#client.request({ method: "DELETE", path: `/v1/store_connections/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Traer pedidos pagados
	 *
	 * Los pedidos pagados desde una fecha (hasta 31 días, 200 a la vez) que no llegaron por webhook: la tienda se conectó después o estuvo caída. Un pedido que ya es ticket no se repite.
	 *
	 * POST /v1/store_connections/{id}/import_orders
	 * @see https://fiscalisto.com/docs/api/referencia/tiendas-en-linea/import-store-orders
	 */
	importOrders(id: string, params?: ImportStoreOrdersParams, options?: RequestOptions): Promise<StoreImport> {
		return this.#client.request({ method: "POST", path: `/v1/store_connections/${encodeURIComponent(id)}/import_orders`, body: params, idempotent: true }, options);
	}
}

/** Facturas recurrentes: fiscalisto.recurringInvoices. */
export class RecurringInvoicesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear una factura recurrente
	 *
	 * Una factura que el emisor timbra solo en cada fecha (cada interval meses en day_of_month, o cada interval semanas o días), a la hora que elija, con los timbres de su cuenta, y la manda al cliente si send_email. Cada una es una factura normal (invoice.stamped, con recurring_invoice) y nunca se timbra dos veces el mismo periodo. invoice es el cuerpo de POST /v1/invoices: se revisa ahora, con las mismas reglas.
	 *
	 * POST /v1/recurring_invoices
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/create-recurring-invoice
	 */
	create(params: CreateRecurringInvoiceParams, options?: RequestOptions): Promise<RecurringInvoice> {
		return this.#client.request({ method: "POST", path: "/v1/recurring_invoices", body: params, idempotent: true }, options);
	}

	/**
	 * Listar facturas recurrentes
	 *
	 * Las más recientes primero.
	 *
	 * GET /v1/recurring_invoices
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/list-recurring-invoices
	 */
	list(params?: ListRecurringInvoicesParams, options?: RequestOptions): List<RecurringInvoice> {
		return this.#client.list({ path: "/v1/recurring_invoices", query: params }, options);
	}

	/**
	 * Ver una factura recurrente
	 *
	 * GET /v1/recurring_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/get-recurring-invoice
	 */
	get(id: string, options?: RequestOptions): Promise<RecurringInvoice> {
		return this.#client.request({ method: "GET", path: `/v1/recurring_invoices/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar o pausar una factura recurrente
	 *
	 * Solo lo que mande cambia. invoice reemplaza la factura completa desde la siguiente vez. active: false la pausa; active: true la reanuda desde hoy, sin timbrar las fechas que pasaron en pausa. schedule.start_date mueve la siguiente fecha.
	 *
	 * POST /v1/recurring_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/update-recurring-invoice
	 */
	update(id: string, params?: UpdateRecurringInvoiceParams, options?: RequestOptions): Promise<RecurringInvoice> {
		return this.#client.request({ method: "POST", path: `/v1/recurring_invoices/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar una factura recurrente
	 *
	 * Ya no timbra más; las facturas que timbró se quedan.
	 *
	 * DELETE /v1/recurring_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/delete-recurring-invoice
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/recurring_invoices/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Saltar la siguiente factura
	 *
	 * La siguiente fecha pasa a la que sigue, sin timbrar nada.
	 *
	 * POST /v1/recurring_invoices/{id}/skip
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/skip-recurring-invoice
	 */
	skip(id: string, options?: RequestOptions): Promise<RecurringInvoice> {
		return this.#client.request({ method: "POST", path: `/v1/recurring_invoices/${encodeURIComponent(id)}/skip`, idempotent: true }, options);
	}

	/**
	 * Timbrar ahora la que toca
	 *
	 * Timbra el periodo que ya toca (next_invoice_on es hoy o antes) sin esperar su hora. Si no toca aún, 409 recurring_not_due. Si la hora llega mientras tanto, no se timbra dos veces: es el mismo periodo.
	 *
	 * POST /v1/recurring_invoices/{id}/run
	 * @see https://fiscalisto.com/docs/api/referencia/facturas-recurrentes/run-recurring-invoice
	 */
	run(id: string, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/recurring_invoices/${encodeURIComponent(id)}/run`, idempotent: true }, options);
	}
}

/** Cotizaciones: fiscalisto.quotes. */
export class QuotesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear una cotización
	 *
	 * Una cotización en borrador, con los conceptos y las condiciones de pago de una factura (se revisan con las mismas reglas, así que siempre se puede facturar). customer es un cliente de su catálogo, uno con sus datos fiscales (se agrega a sus clientes) o solo name y email si aún no los tiene. Se manda con POST /v1/quotes/{id}/send.
	 *
	 * POST /v1/quotes
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/create-quote
	 */
	create(params: CreateQuoteParams, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: "/v1/quotes", body: params, idempotent: true }, options);
	}

	/**
	 * Listar cotizaciones
	 *
	 * Las más recientes primero, cada una en su última versión.
	 *
	 * GET /v1/quotes
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/list-quotes
	 */
	list(params?: ListQuotesParams, options?: RequestOptions): List<Quote> {
		return this.#client.list({ path: "/v1/quotes", query: params }, options);
	}

	/**
	 * Ver una cotización
	 *
	 * Su última versión.
	 *
	 * GET /v1/quotes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/get-quote
	 */
	get(id: string, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "GET", path: `/v1/quotes/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar una cotización
	 *
	 * Solo lo que mande cambia. Un borrador cambia ahí mismo; una que ya se envió se vuelve una versión nueva en borrador (mismo número, version + 1) que el cliente ve al mandarla; mientras, su liga muestra la anterior. Una aceptada, rechazada o facturada ya no cambia.
	 *
	 * POST /v1/quotes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/update-quote
	 */
	update(id: string, params?: UpdateQuoteParams, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar una cotización
	 *
	 * Solo una que nunca se envió; si no, 400 quote_not_draft.
	 *
	 * DELETE /v1/quotes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/delete-quote
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/quotes/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Mandar una cotización
	 *
	 * La manda por correo con su PDF y la liga donde el cliente la ve, la acepta, pide cambios o la rechaza. Con send_email: false solo se marca enviada y contesta url, para que usted la mande por WhatsApp o su propio correo.
	 *
	 * POST /v1/quotes/{id}/send
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/send-quote
	 */
	send(id: string, params?: SendQuoteParams, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}/send`, body: params, idempotent: true }, options);
	}

	/**
	 * Marcar aceptada
	 *
	 * El cliente le dijo que sí por teléfono, en persona… Llega quote.accepted. No timbra: para eso, POST /v1/quotes/{id}/invoice.
	 *
	 * POST /v1/quotes/{id}/accept
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/accept-quote
	 */
	accept(id: string, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}/accept`, idempotent: true }, options);
	}

	/**
	 * Facturar una cotización
	 *
	 * Timbra la factura con los conceptos de la cotización y los datos fiscales del cliente, y la deja facturada (invoice). Si no estaba aceptada, la marca aceptada. Una en otra moneda va al tipo de cambio de hoy. Sin los datos fiscales del cliente, 400 quote_customer_missing; rechazada o vencida, 400 quote_not_invoiceable. Si ya se facturó, contesta esa factura.
	 *
	 * POST /v1/quotes/{id}/invoice
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/invoice-quote
	 */
	invoice(id: string, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}/invoice`, idempotent: true }, options);
	}

	/**
	 * Descargar el PDF
	 *
	 * El PDF de su última versión, con el diseño de PDF del emisor.
	 *
	 * GET /v1/quotes/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/get-quote-pdf
	 */
	pdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/quotes/${encodeURIComponent(id)}/pdf`, as: "bytes" }, options);
	}
}

/** Webhooks: fiscalisto.webhookEndpoints. */
export class WebhookEndpointsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un webhook
	 *
	 * La respuesta trae el secreto de firma (secret) una sola vez.
	 *
	 * POST /v1/webhook_endpoints
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/create-webhook-endpoint
	 */
	create(params: CreateWebhookEndpointParams, options?: RequestOptions): Promise<WebhookEndpoint> {
		return this.#client.request({ method: "POST", path: "/v1/webhook_endpoints", body: params, idempotent: true }, options);
	}

	/**
	 * Listar webhooks
	 *
	 * GET /v1/webhook_endpoints
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/list-webhook-endpoints
	 */
	list(params?: ListWebhookEndpointsParams, options?: RequestOptions): List<WebhookEndpoint> {
		return this.#client.list({ path: "/v1/webhook_endpoints", query: params }, options);
	}

	/**
	 * Ver un webhook
	 *
	 * GET /v1/webhook_endpoints/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/get-webhook-endpoint
	 */
	get(id: string, options?: RequestOptions): Promise<WebhookEndpoint> {
		return this.#client.request({ method: "GET", path: `/v1/webhook_endpoints/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un webhook
	 *
	 * POST /v1/webhook_endpoints/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/update-webhook-endpoint
	 */
	update(id: string, params?: UpdateWebhookEndpointParams, options?: RequestOptions): Promise<WebhookEndpoint> {
		return this.#client.request({ method: "POST", path: `/v1/webhook_endpoints/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un webhook
	 *
	 * DELETE /v1/webhook_endpoints/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/delete-webhook-endpoint
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/webhook_endpoints/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar el secreto
	 *
	 * Un secreto nuevo, que la respuesta trae una sola vez. El anterior sigue firmando (una segunda firma en webhook-signature) el tiempo que elija, 24 horas por omisión, para que cambie su servidor sin rechazar eventos. Si se filtró, mande previous_secret_expires_in: 0.
	 *
	 * POST /v1/webhook_endpoints/{id}/roll_secret
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/roll-webhook-secret
	 */
	rollSecret(id: string, params?: RollWebhookSecretParams, options?: RequestOptions): Promise<WebhookEndpoint> {
		return this.#client.request({ method: "POST", path: `/v1/webhook_endpoints/${encodeURIComponent(id)}/roll_secret`, body: params, idempotent: true }, options);
	}

	/**
	 * Mandar un evento de prueba
	 *
	 * Manda ahora, una sola vez y sin reintentos, un evento del tipo que elija con un objeto de ejemplo (sus id no existen), firmado como los reales, aunque el webhook no escuche ese tipo. La respuesta trae lo que contestó su servidor. El evento no sale en GET /v1/events, pero sí en las entregas del webhook.
	 *
	 * POST /v1/webhook_endpoints/{id}/test
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/test-webhook-endpoint
	 */
	test(id: string, params?: TestWebhookEndpointParams, options?: RequestOptions): Promise<WebhookTest> {
		return this.#client.request({ method: "POST", path: `/v1/webhook_endpoints/${encodeURIComponent(id)}/test`, body: params, idempotent: true }, options);
	}
}

/** Eventos: fiscalisto.events. */
export class EventsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar eventos
	 *
	 * Los de los últimos 30 días, los más recientes primero.
	 *
	 * GET /v1/events
	 * @see https://fiscalisto.com/docs/api/referencia/eventos/list-events
	 */
	list(params?: ListEventsParams, options?: RequestOptions): List<Event> {
		return this.#client.list({ path: "/v1/events", query: params }, options);
	}

	/**
	 * Ver un evento
	 *
	 * GET /v1/events/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/eventos/get-event
	 */
	get(id: string, options?: RequestOptions): Promise<Event> {
		return this.#client.request({ method: "GET", path: `/v1/events/${encodeURIComponent(id)}` }, options);
	}
}

/** Cada recurso de la API. Úselo por medio de Fiscalisto (index.ts). */
export class FiscalistoApi extends Core {
	readonly account = new AccountResource(this);
	readonly testData = new TestDataResource(this);
	readonly sandboxes = new SandboxesResource(this);
	readonly testClocks = new TestClocksResource(this);
	readonly balance = new BalanceResource(this);
	readonly issuers = new IssuersResource(this);
	readonly invoices = new InvoicesResource(this);
	readonly receivables = new ReceivablesResource(this);
	readonly bankTransactions = new BankTransactionsResource(this);
	readonly payments = new PaymentsResource(this);
	readonly creditNotes = new CreditNotesResource(this);
	readonly advances = new AdvancesResource(this);
	readonly retentions = new RetentionsResource(this);
	readonly employees = new EmployeesResource(this);
	readonly payrollReceipts = new PayrollReceiptsResource(this);
	readonly invoiceBatches = new InvoiceBatchesResource(this);
	readonly taxIds = new TaxIdsResource(this);
	readonly customers = new CustomersResource(this);
	readonly customerDataRequests = new CustomerDataRequestsResource(this);
	readonly products = new ProductsResource(this);
	readonly satCatalogs = new SatCatalogsResource(this);
	readonly satLists = new SatListsResource(this);
	readonly satDownloads = new SatDownloadsResource(this);
	readonly satInvoices = new SatInvoicesResource(this);
	readonly tickets = new TicketsResource(this);
	readonly accounting = new AccountingResource(this);
	readonly storeConnections = new StoreConnectionsResource(this);
	readonly recurringInvoices = new RecurringInvoicesResource(this);
	readonly quotes = new QuotesResource(this);
	readonly webhookEndpoints = new WebhookEndpointsResource(this);
	readonly events = new EventsResource(this);
}
