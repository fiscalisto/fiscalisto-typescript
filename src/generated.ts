// Generado por `bun run openapi` desde la especificación OpenAPI de la API: no lo edite.

import { type Client, Core, type List, type RequestOptions } from "./core.js";

/** La cuenta API de la llave que hizo la solicitud. */
export interface Account {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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

/** Una marca de entrada o salida de Asistencia (registro electrónico de jornada, LFT art. 132). */
export interface AttendanceMark {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "attendance_mark";
	/** El empleado (emp_…). */
	employee: string;
	/** in: entrada; out: salida. */
	kind: "in" | "out";
	/** Cuándo marcó (UTC). */
	at: string;
	/** El día al que cuenta, AAAA-MM-DD en la hora del lugar. */
	date: string;
	/** La hora en el lugar, HH:MM. */
	time: string;
	/** Cómo marcó: kiosk_qr (el código del checador), kiosk_pin (número y NIP en el checador), printed_qr (el QR impreso), remote (fuera de la sucursal, con su ubicación), manual (corrección en la app), api. */
	method: "kiosk_qr" | "kiosk_pin" | "printed_qr" | "remote" | "manual" | "api";
	/** El lugar donde marcó, o null. */
	place: string | null;
	/** A cuántos metros del lugar estaba, si dio su ubicación; si no, null. */
	distance_m: number | null;
	/** Notas para revisar (la marca nunca se rechaza por ellas): no_location (no dio su ubicación), far (lejos del lugar), imprecise (ubicación imprecisa), remote (fuera de la sucursal), new_device (un celular nuevo). */
	flags: ("no_location" | "far" | "imprecise" | "remote" | "new_device")[];
	/** Por qué se agregó, en una corrección o desde la API (el empleado lo ve); null si la hizo él. */
	reason: string | null;
	/** Quién la agregó, en una corrección; null si la hizo él. */
	created_by: string | null;
	/** true si se quitó: queda tachada, no cuenta, y se ve con su motivo. */
	voided: boolean;
	/** Por qué se quitó, o null. */
	void_reason: string | null;
	/** Quién la quitó, o null. */
	voided_by: string | null;
	/** Cuándo se quitó, o null. */
	voided_at: string | null;
}

/** La asistencia de un periodo, por empleado: horas contra su horario, faltas, retardos y horas extra dobles y triples por semana, como Nómina › Asistencia › Registro. */
export interface AttendanceReport {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "attendance_report";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…), el patrón. */
	issuer: string;
	/** Primer día del periodo, AAAA-MM-DD. */
	from: string;
	/** Último día del periodo, AAAA-MM-DD. */
	to: string;
	/** true: las horas extra cuentan solo hasta lo que la empresa autorizó cada día. */
	overtime_approval: boolean;
	/** Cómo llegan las horas extra a la nómina: approval (necesitan autorización), all (cuentan todas) o none (no hay horas extra: quedan en el registro y nunca cuentan). */
	overtime_policy: "approval" | "all" | "none";
	/** Cada empleado del emisor en el periodo. */
	employees: {
		/** El empleado (emp_…). */
		employee: string;
		/** Su nombre. */
		name: string;
		/** Su número de empleado, o null. */
		number: string | null;
		/** Donde marca, o null (cualquier lugar). */
		place: string | null;
		/** Minutos trabajados en el periodo. */
		worked_minutes: number;
		/** Minutos de su horario en el periodo. */
		scheduled_minutes: number;
		/** Faltas: días de trabajo sin marcas ni nota. */
		absences: number;
		/** Días con nota de incapacidad. */
		disability_days: number;
		/** Días con nota de vacaciones. */
		vacation_days: number;
		/** Cuántos días llegó tarde. */
		late_count: number;
		/** Minutos de retardo en total. */
		late_minutes: number;
		/** Días con una marca sin su pareja (sin salida). */
		incomplete_days: number;
		/** Marcas con una nota para revisar (flags). */
		flagged_marks: number;
		/** Horas extra que se pagan dobles (hasta 9 por semana en 2026, 12 desde 2027). */
		overtime_double_minutes: number;
		/** Horas extra que se pagan triples (las que pasan del límite de la semana). */
		overtime_triple_minutes: number;
		/** Todos los minutos de más en el registro, autorizados o no. */
		overtime_minutes: number;
		/** Minutos de más que nadie autorizó: quedan en el registro y no cuentan para la nómina. */
		unapproved_overtime_minutes: number;
		/** Minutos de más que la empresa rechazó: quedan en el registro, no cuentan para la nómina y ya no están por autorizar. */
		rejected_overtime_minutes: number;
		/** Días de descanso en que trabajó. */
		rest_days_worked: number;
		/** Días festivos en que trabajó. */
		holidays_worked: number;
		/** Semanas que el empleado confirmó en su enlace. */
		weeks_confirmed: number;
		/** Las semanas con las que el empleado no está de acuerdo. */
		weeks_disputed: {
			/** El lunes de la semana, AAAA-MM-DD. */
			week: string;
			/** Lo que el empleado dijo que no coincide. */
			text: string;
		}[];
		/** Cada día del periodo, solo cuando se pide un employee; si no, null. */
		days: {
			/** AAAA-MM-DD. */
			date: string;
			/** worked (trabajó), incomplete (falta una marca), absent (falta), rest (descanso), holiday (día festivo), excused (justificado con una nota), upcoming (por venir), before (antes de empezar su registro). */
			status: "worked" | "incomplete" | "absent" | "rest" | "holiday" | "excused" | "upcoming" | "before";
			/** Su horario ese día, o null si descansa. */
			scheduled: {
				/** Hora de entrada, HH:MM. */
				start: string;
				/** Hora de salida, HH:MM (antes de la entrada: al día siguiente). */
				end: string;
				/** Minutos de comida que no se pagan. */
				break_minutes: number;
			} | null;
			/** Minutos trabajados ese día. */
			worked_minutes: number;
			/** Minutos de retardo, pasada la tolerancia. */
			late_minutes: number;
			/** Minutos de más ese día (horas extra). */
			overtime_minutes: number;
			/** De esos, los que cuentan para la nómina: con overtime_policy approval, hasta lo autorizado ese día; con all, todos; con none, ninguno. */
			approved_overtime_minutes: number;
			/** De esos, los que la empresa rechazó ese día: no cuentan para la nómina. */
			rejected_overtime_minutes: number;
			/** La nota del día que puso la empresa, o null. */
			note: "vacaciones" | "incapacidad" | "permiso_con_goce" | "permiso_sin_goce" | "descanso" | "festivo" | "falta" | null;
			/** El nombre del día festivo, o null. */
			holiday: string | null;
		}[] | null;
		/** Sus marcas, también las quitadas, solo cuando se pide un employee; si no, null. */
		marks: AttendanceMark[] | null;
	}[];
}

/** Las horas extra que la empresa autorizó o rechazó para un día de un empleado, antes o después de ese día. */
export interface AttendanceOvertime {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "attendance_overtime";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El empleado (emp_…). */
	employee: string;
	/** El día, AAAA-MM-DD. */
	date: string;
	/** Hasta cuántos minutos de horas extra de ese día cuentan para la nómina (0 si se rechazaron); null: sin decisión. */
	minutes: number | null;
	/** true: la empresa rechazó las horas extra de ese día. */
	rejected: boolean;
	/** Por qué, o null. */
	comment: string | null;
}

/** Timbres de producción de la cuenta, por paquete, el que vence antes primero. */
export interface Balance {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "balance";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Timbres de sus paquetes, en total: un solo saldo para la API y la app, comprados en Desarrolladores o en Plan y pagos. */
	available: number;
	/** true si la cuenta timbra sin usar timbres. */
	unlimited: boolean;
	/** Con esta cantidad o menos llega balance.low (y otra vez al acabarse). Se elige en Desarrolladores › Timbres y pagos. */
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
	/** Siempre true: los RFC de la empresa (type own) timbran primero con los timbres del mes de su plan y después con `available`, los paquetes de su único saldo (comprados en Desarrolladores o en Plan y pagos). Los emisores conectados usan solo `available`. Se conserva por compatibilidad. */
	use_plan_timbres: boolean;
	/** Los timbres del mes del plan de su empresa, que los RFC de la empresa (type own) usan antes que `available`; no se suman a `available`. null si la empresa no tiene un plan de paga con timbres al mes (Gratis o una prueba sin pagar) o en modo de prueba. */
	plan_timbres: {
		/** El plan de la empresa (despacho, negocio…). */
		plan: string;
		/** Los que le quedan este mes. */
		remaining: number;
		/** Los que trae el plan cada mes. */
		included: number;
		/** El día en que vuelven a estar completos (AAAA-MM-DD). */
		resets_on: string;
	} | null;
	/** Los paquetes con timbres, el que vence antes primero (en ese orden se usan). */
	packs: {
		/** welcome: los timbres de bienvenida (no vencen); purchase: un paquete comprado o una recarga automática; referral: los de una recomendación. */
		type: "welcome" | "purchase" | "referral";
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

/** Las solicitudes de producción de los últimos 30 días contra las que tiene. */
export interface Usage {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "usage";
	/** Siempre true: solo cuenta producción. */
	livemode: boolean;
	/** Los días que cuenta: los últimos 30. */
	period_days: number;
	/** Solicitudes de producción en esos días. */
	requests: number;
	/** Las que tiene: 10,000 en el plan Gratis o 100,000 con un plan de paga, más 500 por cada timbre de la API que usó en esos días. */
	allowance: number;
	/** Llega al usar el 80 % y otra vez al 100 %. */
	percent_used: 80 | 100;
	/** free: la empresa está en Gratis (o en su prueba); paid: tiene un plan de paga. */
	plan: "free" | "paid";
	/** Qué pasa al pasarlas: refused (Gratis: 429 monthly_allowance) o slowed (de paga: 10 solicitudes cada 10 segundos). */
	over_allowance: "refused" | "slowed";
}

/** Un emisor: un RFC que timbra desde su cuenta API. */
export interface Issuer {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "issuer";
	/** api si lo creó con la API o en Desarrolladores; empresa si es una empresa de la app conectada a su cuenta (Desarrolladores › Emisores › Conectar una empresa): con ella solo se usa su Portal de proveedores, y status siempre es active. */
	source: "api" | "empresa";
	/** own: un RFC de la empresa de esta API (lo da de alta la empresa en la app; no se archiva por la API). connected: un emisor conectado, que su plataforma agregó con POST /v1/issuers. portal: otra empresa de Fiscalisto conectada por su Portal de proveedores. */
	type: "own" | "connected" | "portal";
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
	/** Si puede pedirle al SAT sus facturas (POST /v1/sat_downloads): available es true en pruebas, y en producción mientras su e.firma guardada esté vigente (efirma_expires_at); un RFC de su empresa (type own) usa la que la empresa guardó en la app. En pruebas, efirma_expires_at muestra la del mismo RFC en producción, o la que mande en pruebas. */
	sat_downloads: {
		/** true si puede pedir descargas al SAT ahora: siempre en pruebas; en producción con su e.firma guardada y vigente (la de la app, en un RFC de su empresa). */
		available: boolean;
		/** Cuándo vence la e.firma guardada para las descargas, o null si no hay una. En pruebas, la que mandó en pruebas o, si no, la que guarda en producción para el mismo RFC. */
		efirma_expires_at: string | null;
	};
	/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
	employer_registration: string | null;
	/** CURP, 18 caracteres. */
	curp: string | null;
	/** Donataria autorizada (régimen 603): el oficio del SAT que la autoriza a recibir donativos deducibles (o su renovación). Va en cada recibo de donativo (`donation` de POST /v1/invoices); null lo quita. El emisor debe tener tax_system 603. En pruebas sirve cualquier número y una fecha pasada. */
	donation_authorization: {
		/** Número del oficio de autorización, hasta 100 caracteres. */
		number: string;
		/** Fecha del oficio, AAAA-MM-DD; no puede ser futura. */
		date: string | null;
	} | null;
	/** RFC con el que se timbra: el del emisor en producción y, en pruebas, el contribuyente de pruebas del SAT de su tipo: EKU9003173C9 para una persona moral, CACX7605101P8 para una persona física (con su CURP en la nómina). Se timbra con el régimen y el código postal del emisor. */
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

/** El complemento de nómina 1.2 como se timbró: tipo, periodo, patrón, empleado, percepciones, deducciones, otros pagos, sus nodos y los totales. */
export interface InvoicePayroll {
	/** TipoNomina: O ordinaria, E extraordinaria. */
	type: "O" | "E";
	/** fiscalisto: lo calculó Fiscalisto (POST /v1/payroll_receipts); external: lo calculó su sistema de nómina y se timbró tal cual (POST /v1/payroll_receipts/external). */
	calculation: "fiscalisto" | "external";
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity: string;
	/** Periodo pagado: FechaInicialPago, FechaFinalPago y FechaPago. */
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
	/** Los ids de su sistema de nómina (solo en recibos external). */
	references: {
		/** El id del empleado en su sistema de nómina. */
		employee_id: string | null;
		/** El id de la corrida de nómina en su sistema. */
		payroll_run_id: string | null;
	} | null;
	/** El patrón (Emisor del complemento): registro patronal y CURP si es persona física. */
	employer: {
		/** Registro patronal ante el IMSS (RegistroPatronal), 11 caracteres. Necesario para timbrar nómina. */
		employer_registration: string | null;
		/** CURP, 18 caracteres. */
		curp: string | null;
		/** RFC del patrón de origen (RfcPatronOrigen). */
		origin_tax_id?: string;
		/** Entidad del SNCF (EntidadSNCF). */
		sncf?: {
			/** Origen del recurso (OrigenRecurso): IP, IF o IM. */
			resource_origin: string;
			/** Monto de recursos propios (MontoRecursoPropio), con IM. */
			own_resource_amount: number | null;
		};
	};
	/** El empleado (Nomina/Receptor), como se timbró. */
	employee: {
		/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
		id: string | null;
		/** Número de empleado (NumEmpleado). */
		number: string;
		/** CURP, 18 caracteres. */
		curp: string;
		/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
		social_security_number: string | null;
		/** Fecha de inicio de la relación laboral (FechaInicioRelLaboral), AAAA-MM-DD. */
		start_date: string | null;
		/** Antigüedad (P52W, P1Y2M3D). */
		seniority: string | null;
		/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
		contract_type: string;
		/** true si es sindicalizado (Sindicalizado). */
		unionized: boolean | null;
		/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
		workday_type: string | null;
		/** Tipo de régimen (TipoRegimen): 02 sueldos y salarios. */
		regime_type: string;
		/** Departamento (Departamento). */
		department: string | null;
		/** Puesto (Puesto). */
		position: string | null;
		/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
		risk_class: string | null;
		/** Salario base de cotización (SalarioBaseCotApor). */
		contribution_base_salary: number | null;
		/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
		integrated_daily_salary: number | null;
		/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
		state: string;
		/** Banco (Banco), c_Banco. */
		bank?: string;
		/** Cuenta bancaria o CLABE (CuentaBancaria). */
		bank_account?: string;
		/** Subcontratación (SubContratacion). */
		subcontracting?: {
			/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
			tax_id: string;
			/** Porcentaje de tiempo (PorcentajeTiempo). */
			percentage: number;
		}[];
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
		/** Horas extra (HorasExtra), con la percepción 019. */
		overtime?: {
			/** Días con horas extra (Dias). */
			days: number;
			/** c_TipoHoras: 01 dobles, 02 triples, 03 simples. */
			hours_type: string;
			/** Horas extra (HorasExtra). */
			hours: number;
			/** Importe pagado (ImportePagado). */
			amount_paid: number;
		}[];
		/** Acciones o títulos (AccionesOTitulos), con la percepción 045. */
		stock_options?: {
			/** Valor de mercado (ValorMercado). */
			market_value: number;
			/** Precio al otorgarse (PrecioAlOtorgarse). */
			grant_price: number;
		};
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
		/** Compensación del saldo a favor (CompensacionSaldosAFavor), con el 004. */
		balance_compensation?: {
			/** Saldo a favor (SaldoAFavor). */
			balance: number;
			/** Año del saldo a favor (Año). */
			year: number;
			/** Remanente del saldo a favor (RemanenteSalFav). */
			remaining: number;
		};
	}[];
	/** SeparacionIndemnizacion (percepciones 022, 023, 025). */
	separation?: {
		/** Total pagado (TotalPagado). */
		total_paid: number;
		/** Años de servicio (NumAñosServicio). */
		years_of_service: number;
		/** Último sueldo mensual ordinario (UltimoSueldoMensOrd). */
		last_monthly_salary: number;
		/** Ingreso acumulable (IngresoAcumulable). */
		accumulable_income: number;
		/** Ingreso no acumulable (IngresoNoAcumulable). */
		non_accumulable_income: number;
	};
	/** JubilacionPensionRetiro (percepciones 039, 044). */
	retirement?: {
		/** Total en una exhibición (TotalUnaExhibicion). */
		total_one_payment?: number;
		/** Total en parcialidades (TotalParcialidad). */
		total_installment?: number;
		/** Monto diario (MontoDiario). */
		daily_amount?: number;
		/** Ingreso acumulable (IngresoAcumulable). */
		accumulable_income: number;
		/** Ingreso no acumulable (IngresoNoAcumulable). */
		non_accumulable_income: number;
	};
	/** Incapacidades (percepción 014 o deducción 006). */
	disabilities?: {
		/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
		days: number;
		/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
		type: string;
		/** Importe. */
		amount: number | null;
	}[];
	/** En un recibo que calculó Fiscalisto: los días del IMSS. */
	imss_days?: {
		/** Días naturales del periodo que trabajó para el patrón: las cuotas del IMSS se causan por mes calendario (LSS art. 39), no por los días pagados. */
		calendar_days: number;
		/** Faltas del recibo. */
		absences: number;
		/** Días de incapacidad del recibo. */
		disability_days: number;
		/** Días que cotiza en enfermedades y maternidad (excedente, prestaciones en dinero, gastos médicos de pensionados): el periodo sin la incapacidad; las faltas cuentan (LSS art. 31 fr. I). */
		sickness_and_maternity: number;
		/** Días que cotiza en invalidez y vida y en cesantía en edad avanzada y vejez: además sin las faltas, hasta 7 por mes. */
		disability_and_old_age: number;
	};
	/** Totales: percepciones, deducciones, otros pagos y el neto a pagar. */
	totals: {
		/** Total de sueldos, salarios y asimilados (TotalSueldos). */
		salaries: number;
		/** Total gravado (TotalGravado). */
		taxed: number;
		/** Total exento (TotalExento). */
		exempt: number;
		/** Total de separación e indemnización (TotalSeparacionIndemnizacion). */
		separation: number;
		/** Total de jubilación, pensión o retiro (TotalJubilacionPensionRetiro). */
		retirement: number;
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

/** Un CFDI 4.0 emitido: factura de ingreso o global, traslado, nota de crédito (E), complemento de pago (P) o recibo de nómina (N). */
export interface Invoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "invoice";
	/** El emisor (iss_…). */
	issuer: string;
	/** La sucursal (brn_…) desde donde se timbró, o null (el domicilio fiscal del emisor). Sus pagos y notas de crédito la siguen. */
	branch: string | null;
	/** Su centro de costo (ccn_…), o null. El que mandó al crearla, o el que le puso o cambió después con POST /v1/invoices/{id}. */
	cost_center: string | null;
	/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
	type: "I" | "E" | "P" | "T" | "N";
	/** processing: el PAC no ha contestado (se resuelve sola; escuche invoice.stamped). valid: timbrada. pending: timbrada con una cancelación en espera del cliente. rejected: el SAT o el PAC no la aceptaron (ver error). canceled: cancelada. */
	status: "processing" | "pending" | "valid" | "rejected" | "canceled";
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string | null;
	/** La serie (Serie) con que se timbró, o null. */
	series: string | null;
	/** Folio interno. En una rechazada es el que se intentó: no se gasta, y el siguiente CFDI de la serie lo usa. */
	folio: string | null;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string | null;
	/** El cliente (Receptor) como quedó en el CFDI: RFC, nombre, régimen fiscal y código postal (y foreign si es extranjero). */
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
	/** Condiciones de pago (CondicionesDePago), hasta 1,000 caracteres sin «|»: «Crédito a 30 días», «50 % anticipo». Van en el XML y en el PDF; solo en ingresos y egresos. No cambian cuándo vence (due_date usa los días de crédito del cliente). */
	payment_terms: string | null;
	/** Nota para el cliente: sale en el PDF, no en el XML. Se cambia después de timbrar con POST /v1/invoices/{id} (el XML no cambia; el siguiente PDF ya la lleva). */
	notes: string | null;
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
	/** Los impuestos del comprobante sumados por tipo: IVA e IEPS trasladados, IVA e ISR retenidos e impuestos locales; null en un complemento de pago. */
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
	/** Una PUE que estuvo por cobrar (paid_later o mark_unpaid): el día en que el cliente pagó (AAAA-MM-DD), el que dijo POST /v1/invoices/{id}/mark_paid o el del depósito conciliado con ella. null si no hay fecha de pago registrada (una PUE pagada al timbrarse), si no se ha pagado o si es PPD (sus pagos están en sus complementos). */
	paid_on: string | null;
	/** Mientras falta cobrarla (unpaid o partial): el día en que vence (AAAA-MM-DD), su fecha más los días de crédito de la ficha del cliente (o de su grupo de clientes) o, sin ellos, los de la empresa (30 si no los cambió); una PUE con paid_later, el último día de su mes. Son los días que usan Cuentas por cobrar y los recordatorios de cobranza. null si ya se pagó o no aplica. */
	due_date: string | null;
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
	payroll?: InvoicePayroll;
	/** Solo en una factura global. */
	global?: Record<string, unknown>;
	/** La cancelación, si se pidió: estado, motivo, sustituto y cuándo. */
	cancellation: {
		/** `pending`: el SAT tiene la solicitud (la termina en minutos, o espera la respuesta del receptor). `accepted`: cancelada. `rejected`: el receptor la rechazó. `lapsed`: el SAT nunca la registró; puede pedirse otra vez. `scheduled`: el SAT aún no la acepta (no registra el CFDI que la sustituye, o rechazó la firma un momento) y Fiscalisto la vuelve a pedir sola. `failed`: Fiscalisto dejó de intentarlo; pídala de nuevo con POST /v1/invoices/{id}/cancel. */
		status: string | null;
		/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
		motive: string | null;
		/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
		substitution: string | null;
		/** Cuándo se canceló. */
		canceled_at: string | null;
		/** Con `scheduled`: cuándo la vuelve a pedir Fiscalisto (null: en los próximos 15 minutos). */
		next_attempt_at: string | null;
		/** Con `scheduled` o `failed`: por qué no ha pasado. */
		error: string | null;
	} | null;
	/** El envío por correo: a quién, con copia a quién y cuándo (null si no se ha enviado). */
	email: {
		/** A quién (correos separados por comas). */
		to: string | null;
		/** Con copia (correos separados por comas). */
		cc: string | null;
		/** Cuándo se envió. */
		sent_at: string | null;
		/** Lo que pasó con el último envío: el peor de sus destinatarios (bounced o complained pesan más que opened o delivered). sent hasta que el servidor del cliente conteste. */
		status: "sent" | "delayed" | "delivered" | "opened" | "bounced" | "complained";
		/** Cada dirección del envío (para y copia), con su entrega. */
		recipients: {
			/** La dirección de correo del destinatario. */
			address: string;
			/** Estado del objeto. */
			status: "sent" | "delayed" | "delivered" | "opened" | "bounced" | "complained";
			/** Cuando el servidor del destinatario lo aceptó. */
			delivered_at: string | null;
			/** La primera vez que se abrió (aproximado: algunos correos cargan las imágenes solos o no las cargan). */
			opened_at: string | null;
			/** Cuando rebotó. */
			bounced_at: string | null;
			/** Por qué rebotó, en español: «buzón no existe», «buzón lleno»… */
			bounce_reason: string | null;
			/** Cuando el destinatario lo marcó como spam. */
			complained_at: string | null;
		}[];
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
	/** Avisos sobre la factura (solo en la respuesta que la timbra o, con 202, la que la deja en proceso): se timbra como se mandó. */
	warnings?: string[];
	/** Por qué no se pudo mandar el correo; el comprobante sí se timbró. */
	email_error?: string;
	/** La factura que esta sustituyó y si quedó cancelada. */
	substitutes?: {
		/** La factura sustituida (inv_…). */
		invoice: string;
		/** true si la sustituida ya quedó cancelada. false no es definitivo: vea substitutes.cancellation. */
		canceled: boolean;
		/** Por qué no se pudo cancelar la sustituida (cancélela con POST /v1/invoices/{id}/cancel). */
		cancel_error?: string;
		/** La cancelación de la anterior, igual que su `cancellation` en GET /v1/invoices/{id}: `accepted` si ya quedó cancelada, `pending` si el SAT la está terminando (o espera al receptor), `scheduled` si Fiscalisto la vuelve a pedir sola, `failed` si hay que pedirla de nuevo. El webhook de la anterior dice cuando cambia. */
		cancellation: {
			/** `pending`: el SAT tiene la solicitud (la termina en minutos, o espera la respuesta del receptor). `accepted`: cancelada. `rejected`: el receptor la rechazó. `lapsed`: el SAT nunca la registró; puede pedirse otra vez. `scheduled`: el SAT aún no la acepta (no registra el CFDI que la sustituye, o rechazó la firma un momento) y Fiscalisto la vuelve a pedir sola. `failed`: Fiscalisto dejó de intentarlo; pídala de nuevo con POST /v1/invoices/{id}/cancel. */
			status: string | null;
			/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
			motive: string | null;
			/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
			substitution: string | null;
			/** Cuándo se canceló. */
			canceled_at: string | null;
			/** Con `scheduled`: cuándo la vuelve a pedir Fiscalisto (null: en los próximos 15 minutos). */
			next_attempt_at: string | null;
			/** Con `scheduled` o `failed`: por qué no ha pasado. */
			error: string | null;
		} | null;
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** El número de la constancia en la serie del emisor (internal_folio es el que se imprime, RET1…). */
	folio: number | null;
	/** Folio interno (FolioInt): RET1, RET2… */
	internal_folio: string | null;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string | null;
	/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
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
	/** Complemento de pagos a extranjeros: obligatorio con code 18, y con 01, 02, 04 y 05 cuando el receptor es extranjero. */
	foreign_payment?: Record<string, unknown>;
	/** Complemento de dividendos con su nodo Remanente (remanente distribuible), obligatorio con code 15. Si no lo manda, va sin proporción. */
	distributable_remainder?: Record<string, unknown>;
	/** Complemento de arrendamiento en fideicomiso (Arrendamientoenfideicomiso 1.0), obligatorio con code 17. */
	trust_lease?: Record<string, unknown>;
	/** Complemento de enajenación de acciones u operaciones de valores (EnajenaciondeAcciones 1.0), obligatorio con code 06 y 19. */
	share_sale?: Record<string, unknown>;
	/** Complemento de premios (Premios 1.0), obligatorio con code 20. Sus montos son los de totals. */
	prize?: Record<string, unknown>;
	/** Complemento de fideicomisos que no realizan actividades empresariales (Fideicomisonoempresarial 1.0), obligatorio con code 21. */
	trust?: Record<string, unknown>;
	/** Complemento de planes personales de retiro (Planesderetiro 1.1), obligatorio con code 22: lo del año anterior. */
	retirement_plan?: Record<string, unknown>;
	/** Complemento de intereses reales deducibles por créditos hipotecarios (Intereseshipotecarios 1.0), obligatorio con code 23. */
	mortgage_interest?: Record<string, unknown>;
	/** Complemento de operaciones financieras derivadas de capital (Operacionesconderivados 1.0), obligatorio con code 24. */
	financial_derivatives?: Record<string, unknown>;
	/** Complemento de servicios de plataformas tecnológicas (ServiciosPlataformasTecnologicas 1.0), obligatorio con code 26: una constancia por mes, receptor y tipo de servicio. totals y taxes se calculan de services con las tasas del SAT (ISR de LISR 113-A y LIF 2026 art. 25; IVA 50% o 100%; IEPS en apuestas); si los manda, deben coincidir. */
	platform?: Record<string, unknown>;
	/** La cancelación, si se pidió: estado, motivo, sustituto y cuándo. */
	cancellation: {
		/** pending (el SAT la tiene: la termina en minutos o espera la respuesta del cliente), accepted (cancelada), rejected (el cliente la rechazó), lapsed (venció; puede pedirla otra vez), scheduled (Fiscalisto la vuelve a pedir sola) o failed (Fiscalisto dejó de intentarlo; pídala de nuevo). */
		status: string;
		/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
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
	/** Solo al timbrar con `replaces`: la constancia que corrige y si se canceló (motivo 01). Si no, `error` dice por qué y se cancela con POST /v1/sat_retentions/{id}/cancel. */
	replaced?: {
		/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
		uuid: string;
		/** true si la sustituida ya quedó cancelada. false no es definitivo: vea substitutes.cancellation. */
		canceled: boolean;
		/** Por qué no se pudo cancelar la anterior; `null` si se canceló. */
		error: string | null;
	};
}

/** Un cliente del catálogo de un emisor. */
export interface Customer {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
	ieps_taxpayer: boolean;
	/** Días de crédito que se le dan, de 0 a 365, o null para no cambiar los del cliente. */
	credit_days: number | null;
	/** Condiciones de pago (CondicionesDePago), hasta 1,000 caracteres sin «|»: «Crédito a 30 días», «50 % anticipo». Van en el XML y en el PDF; solo en ingresos y egresos. No cambian cuándo vence (due_date usa los días de crédito del cliente). */
	payment_terms: string | null;
	/** Su grupo de clientes (cgr_…), o null si no está en ninguno. */
	group: string | null;
	/** Lista de precios (prl_…). En un cliente, la suya propia, que gana a la de su grupo; null para usar la de su grupo o la de todos. */
	price_list: string | null;
	/** Porcentaje de descuento sobre el precio, de 0 a 100; en el CFDI va como Descuento de cada concepto. */
	discount_percent: number | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string;
	/** Cuándo cambió por última vez, ISO 8601 (-06:00). */
	updated_at: string | null;
}

/** Un producto o servicio del catálogo de un emisor. */
export interface Product {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
	unit_key: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku: string | null;
	/** Su categoría, con las de arriba separadas por › («Ferretería › Tornillos»), o null si no tiene. */
	category: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price: number;
	/** Precio abierto: el producto no tiene precio fijo y cada concepto con él manda su unit_price. */
	open_price: boolean;
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
	/** Impuestos locales (complemento implocal): traslados y retenciones estatales. */
	local_taxes: {
		/** true si es una retención local; false si es un traslado. */
		retention: boolean;
		/** Nombre del impuesto local (ImpLocTrasladado o ImpLocRetenido), como ISH. */
		name: string;
		/** Tasa en por ciento (TasadeTraslado o TasadeRetencion). */
		rate: number;
	}[];
	/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
	hydrocarbon: {
		/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
		permit_type: string;
		/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
		permit_number: string;
		/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
		subproduct: string;
	} | null;
	/** true si lleva existencias (Inventario). */
	track_stock: boolean;
	/** Su costo por unidad en pesos sin IVA, o null. */
	cost: number | null;
	/** Su código de barras, o null. */
	barcode: string | null;
	/** Su existencia mínima, o null. */
	min_stock: number | null;
	/** true si se ofrece en el Portal del cliente para hacer pedidos. */
	portal_visible: boolean;
	/** Lo mínimo que se pide de él en el Portal del cliente, o null sin mínimo. */
	min_order_qty: number | null;
	/** De cuántos en cuántos se pide en el Portal del cliente (6 para pedir 6, 12, 18…), o null de uno en uno. */
	order_step: number | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string;
	/** Cuándo cambió por última vez, ISO 8601 (-06:00). */
	updated_at: string | null;
}

/** Un empleado de un emisor, para sus recibos de nómina. */
export interface Employee {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** El SDI de los elementos fijos (cuota diaria con aguinaldo, prima vacacional y demás prestaciones fijas). */
	integrated_daily_salary: number;
	/** La parte variable del SDI desde variable_salary_from: lo que las horas extra triples, la prima dominical y los premios del bimestre anterior suman por día (artículo 30 de la LSS). Se fija con POST /v1/variable_salaries; los recibos usan integrated_daily_salary más esta. */
	variable_integrated_daily_salary: number;
	/** Desde cuándo aplica variable_integrated_daily_salary (AAAA-MM-DD). */
	variable_salary_from: string | null;
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
	/** CLABE de su cuenta, a donde le paga el archivo para el banco, o null. */
	clabe: string | null;
	/** Nombre(s) como en su CURP, o null (los archivos del IMSS lo separan con la CURP). */
	given_names: string | null;
	/** Primer apellido como en su CURP, o null. */
	first_surname: string | null;
	/** Segundo apellido, o null. */
	second_surname: string | null;
	/** Tipo de trabajador del IMSS: 1 permanente, 2 eventual de la ciudad, 3 eventual de la construcción, 4 eventual del campo. */
	imss_worker_type: string;
	/** Tipo de salario del IMSS: 0 fijo, 1 variable, 2 mixto. */
	imss_salary_type: string;
	/** Semana o jornada reducida: 0 normal, 1 a 5 días a la semana, 6 jornada de menos de 8 horas. */
	imss_reduced_week: string;
	/** Unidad de medicina familiar del IMSS, o null. */
	family_medicine_unit: string | null;
	/** Causa de la baja ante el IMSS cuando tiene end_date (2 separación voluntaria por omisión), o null. */
	exit_reason: string | null;
	/** Lo que el SAT podría observar de sus datos, antes de timbrar. */
	warnings: string[];
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string;
}

/** El recibo como se timbraría: percepciones, deducciones (ISR, IMSS), otros pagos (subsidio) y el neto. */
export interface PayrollReceiptPreview {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_receipt_preview";
	/** Mándelo en POST /v1/payroll_receipts para timbrar exactamente este recibo: si al timbrar se calcula otro, contesta 409 payroll_calculation_changed sin timbrar. */
	confirmation_token: string;
	/** Lo que el recibo no incluye o pronto no se podrá calcular; no impide timbrar. */
	warnings: {
		/** finiquito_not_included: el empleado se fue en el periodo y el recibo no trae su finiquito; absences_over_monthly_limit: con este recibo pasa de 7 faltas en el mes y las de más cotizan como días trabajados (para dejar de cotizar, presente su aviso de baja); payroll_rates_pending: aún no se cargan los valores (ISR, subsidio, salario mínimo, UMA) de una fecha próxima. */
		code: string;
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
	}[];
	/** El empleado (emp_…). */
	employee: string;
	/** Periodicidad del pago (PeriodicidadPago): 02 semanal, 03 catorcenal, 04 quincenal (por omisión), 05 mensual. */
	periodicity: string;
	/** El periodo de pago: primer y último día y el día de pago (FechaInicialPago, FechaFinalPago y FechaPago). */
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
	/** Los días por los que se calcularon las cuotas obreras del IMSS. */
	imss_days: {
		/** Días naturales del periodo que trabajó para el patrón: las cuotas del IMSS se causan por mes calendario (LSS art. 39), no por los días pagados. */
		calendar_days: number;
		/** Faltas del recibo. */
		absences: number;
		/** Días de incapacidad del recibo. */
		disability_days: number;
		/** Días que cotiza en enfermedades y maternidad (excedente, prestaciones en dinero, gastos médicos de pensionados): el periodo sin la incapacidad; las faltas cuentan (LSS art. 31 fr. I). */
		sickness_and_maternity: number;
		/** Días que cotiza en invalidez y vida y en cesantía en edad avanzada y vejez: además sin las faltas, hasta 7 por mes. */
		disability_and_old_age: number;
	};
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
		/** Horas extra (HorasExtra), con la percepción 019. */
		overtime?: {
			/** Días con horas extra (Dias). */
			days: number;
			/** c_TipoHoras: 01 dobles, 02 triples, 03 simples. */
			hours_type: string;
			/** Horas extra (HorasExtra). */
			hours: number;
			/** Importe pagado (ImportePagado). */
			amount_paid: number;
		}[];
		/** Acciones o títulos (AccionesOTitulos), con la percepción 045. */
		stock_options?: {
			/** Valor de mercado (ValorMercado). */
			market_value: number;
			/** Precio al otorgarse (PrecioAlOtorgarse). */
			grant_price: number;
		};
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
		/** Compensación del saldo a favor (CompensacionSaldosAFavor), con el 004. */
		balance_compensation?: {
			/** Saldo a favor (SaldoAFavor). */
			balance: number;
			/** Año del saldo a favor (Año). */
			year: number;
			/** Remanente del saldo a favor (RemanenteSalFav). */
			remaining: number;
		};
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
			/** El subsidio para el empleo que se revierte en el ajuste. */
			reversed: number;
			/** El ISR que se retiene después del ajuste. */
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
		/** Total de separación e indemnización (TotalSeparacionIndemnizacion). */
		separation: number;
		/** Total de jubilación, pensión o retiro (TotalJubilacionPensionRetiro). */
		retirement: number;
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

/** Un aguinaldo, PTU o finiquito como se timbraría (nómina extraordinaria): lo que paga, su parte exenta, el ISR y el neto. */
export interface ExtraordinaryPayrollReceiptPreview {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_receipt_preview";
	/** Lo calculó Fiscalisto, como nómina extraordinaria. */
	calculation: "extraordinary";
	/** Mándelo en POST /v1/payroll_receipts/extraordinary para timbrar exactamente este recibo: si al timbrar se calcula otro, contesta 409 payroll_calculation_changed sin timbrar. */
	confirmation_token: string;
	/** El empleado (emp_…). */
	employee: string;
	/** Qué paga: aguinaldo, ptu o finiquito. */
	kind: "aguinaldo" | "ptu" | "finiquito";
	/** El periodo (FechaInicialPago, FechaFinalPago) de un recibo extraordinario es un solo día: payment_date (aguinaldo, PTU) o el último día trabajado (finiquito); payment_date es FechaPago. */
	period: {
		/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
		start: string;
		/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
		end: string;
		/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
		payment_date: string;
	};
	/** Salario base de cotización (SalarioBaseCotApor). */
	contribution_base_salary: number;
	/** Lo que paga, como lo muestra la app. */
	lines: {
		/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
		concept: string;
		/** Cómo se calculó (días, años, salario). */
		detail: string;
		/** Importe. */
		gross: number;
		/** De él, la parte exenta del ISR. */
		exempt: number;
	}[];
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
		/** Horas extra (HorasExtra), con la percepción 019. */
		overtime?: {
			/** Días con horas extra (Dias). */
			days: number;
			/** c_TipoHoras: 01 dobles, 02 triples, 03 simples. */
			hours_type: string;
			/** Horas extra (HorasExtra). */
			hours: number;
			/** Importe pagado (ImportePagado). */
			amount_paid: number;
		}[];
		/** Acciones o títulos (AccionesOTitulos), con la percepción 045. */
		stock_options?: {
			/** Valor de mercado (ValorMercado). */
			market_value: number;
			/** Precio al otorgarse (PrecioAlOtorgarse). */
			grant_price: number;
		};
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
		/** Compensación del saldo a favor (CompensacionSaldosAFavor), con el 004. */
		balance_compensation?: {
			/** Saldo a favor (SaldoAFavor). */
			balance: number;
			/** Año del saldo a favor (Año). */
			year: number;
			/** Remanente del saldo a favor (RemanenteSalFav). */
			remaining: number;
		};
	}[];
	/** SeparacionIndemnizacion: solo en una liquidación (indemnización y prima de antigüedad). */
	separation: {
		/** Total pagado (TotalPagado). */
		total_paid: number;
		/** Años de servicio (NumAñosServicio). */
		years_of_service: number;
		/** Último sueldo mensual ordinario (UltimoSueldoMensOrd). */
		last_monthly_salary: number;
		/** Ingreso acumulable (IngresoAcumulable). */
		accumulable_income: number;
		/** Ingreso no acumulable (IngresoNoAcumulable). */
		non_accumulable_income: number;
	} | null;
	/** El cálculo del ISR del periodo: base, tarifa, subsidio y resultado. */
	isr: {
		/** ISR retenido. */
		amount: number;
		/** aguinaldo y ptu: ISR con la parte gravada sumada al sueldo del mes. */
		art96?: number;
		/** aguinaldo y ptu: ISR con el procedimiento del art. 174 del Reglamento. */
		art174?: number;
		/** aguinaldo y ptu: el cálculo que se aplicó. */
		method?: "art96" | "art174";
	};
	/** Totales: percepciones, deducciones, otros pagos y el neto a pagar. */
	totals: {
		/** Total de sueldos, salarios y asimilados (TotalSueldos). */
		salaries: number;
		/** Total gravado (TotalGravado). */
		taxed: number;
		/** Total exento (TotalExento). */
		exempt: number;
		/** Total de separación e indemnización (TotalSeparacionIndemnizacion). */
		separation: number;
		/** Total de jubilación, pensión o retiro (TotalJubilacionPensionRetiro). */
		retirement: number;
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

/** Un recibo calculado por su sistema, revisado y sin timbrar: lo que se timbraría, tal cual. */
export interface ExternalPayrollReceiptPreview {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_receipt_preview";
	/** external: los importes son los que calculó su sistema. */
	calculation: "external";
	/** El emisor (iss_…). */
	issuer: string;
	/** El empleado como receptor del CFDI (Receptor). */
	customer: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string;
		/** Código postal del domicilio fiscal del cliente (DomicilioFiscalReceptor), 5 dígitos. */
		zip: string;
	};
	/** El recibo de nómina 1.2: empleado, periodo, percepciones, deducciones y otros pagos. */
	payroll: InvoicePayroll;
	/** SubTotal: percepciones más otros pagos. */
	subtotal: number;
	/** Descuento: las deducciones. */
	discount: number;
	/** Total: el neto a pagar. */
	total: number;
	/** Lo que el SAT podría observar; no impide timbrar. */
	warnings: {
		/** El campo de la solicitud. */
		param: string;
		/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
		code: string;
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
	}[];
	/** El XML que se mandaría al PAC, sin sello ni timbre: sus importes son exactamente los que mandó. */
	unsigned_xml: string;
}

/** Una factura revisada y sin timbrar: lo que se timbraría ahora con POST /v1/invoices y el mismo cuerpo. */
export interface InvoicePreview {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "invoice_preview";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Sucursal (brn_…) desde donde se factura: su código postal va en LugarExpedicion, su dirección en el PDF y, si las tiene, sus series. Sin ella, el domicilio fiscal del emisor (la Matriz). */
	branch: string | null;
	/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
	type: "I" | "E" | "T";
	/** Serie (Serie), hasta 25 caracteres. Cada serie lleva sus propios folios. */
	series: string | null;
	/** El folio que tendría si se timbrara ahora; otra factura timbrada antes puede tomarlo. */
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
	/** Los impuestos de la factura, por tipo: IVA e IEPS trasladados, IVA e ISR retenidos e impuestos locales. */
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
	total: number;
	/** Lo que conviene revisar antes de timbrar (un cliente en las listas 69 o 69-B del SAT, una factura que parece duplicada); no impide timbrar. */
	warnings: {
		/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
		code: string;
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
	}[];
	/** El XML que se mandaría al PAC, sin sello ni timbre. */
	unsigned_xml: string;
}

/** Las facturas de un emisor en un periodo, en un ZIP o en Excel. */
export interface Export {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "export";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** zip (los archivos de cada factura) o xlsx (un Excel con una fila por factura). */
	format: "zip" | "xlsx";
	/** Qué archivos de cada factura lleva el ZIP; null en un Excel. */
	files: "xml" | "pdf" | "xml_and_pdf" | null;
	/** EntradaSalidaMerc: Entrada o Salida. */
	direction: "issued" | "received";
	/** Desde qué día (incluido), por la fecha de emisión. */
	from: string | null;
	/** Hasta qué día (incluido), por la fecha de emisión. */
	to: string | null;
	/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
	type: "I" | "E" | "P" | "T" | "N" | null;
	/** processing: se está generando. completed: listo para descargar. failed: falló (ver error); pídala otra vez. expired: pasaron 30 días y el archivo se borró. */
	status: "processing" | "completed" | "failed" | "expired";
	/** Cuántas facturas lleva. */
	invoice_count: number;
	/** El tamaño del archivo en bytes, cuando está listo. */
	size_bytes: number | null;
	/** Por qué falló la exportación, en palabras; null si no falló. */
	error: string | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Cuándo terminó. */
	completed_at: string | null;
	/** Hasta cuándo se descarga (30 días después de completed). */
	expires_at: string | null;
}

/** Una persona que entra a la empresa en la app. */
export interface Member {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "member";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre. */
	name: string | null;
	/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
	email: string;
	/** El rol (id de GET /v1/roles). */
	role: string;
	/** true: todos los permisos, incluidos los que se agreguen después. */
	all_permissions: boolean;
	/** Permisos además de los del rol. */
	permissions_added: string[];
	/** Permisos del rol que esta persona no tiene. */
	permissions_removed: string[];
	/** Solo trabaja con estos RFC de la empresa; null: con todos. */
	tax_ids: string[] | null;
	/** Solo emite desde estas sucursales (brn_…, o "matriz"); null: desde todas. */
	branches: string[] | null;
	/** Lo que puede hacer al final: los permisos del rol, más los agregados, menos los quitados. */
	permissions: string[];
	/** Si entra con verificación en dos pasos. */
	two_factor_enabled: boolean;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string;
}

/** Una invitación a la empresa que aún no se acepta. */
export interface Invitation {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "invitation";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
	email: string;
	/** El rol (id de GET /v1/roles). */
	role: string;
	/** true: todos los permisos, incluidos los que se agreguen después. */
	all_permissions: boolean;
	/** Permisos además de los del rol. */
	permissions_added: string[];
	/** Permisos del rol que esta persona no tiene. */
	permissions_removed: string[];
	/** Solo trabaja con estos RFC de la empresa; null: con todos. */
	tax_ids: string[] | null;
	/** Solo emite desde estas sucursales (brn_…, o "matriz"); null: desde todas. */
	branches: string[] | null;
	/** pending: su enlace sirve. canceled: se canceló. */
	status: "pending" | "canceled";
	/** Hasta cuándo sirve su enlace (7 días). */
	expires_at: string;
}

/** Un rol de la empresa: un nombre y sus permisos. */
export interface Role {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "role";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre. */
	name: string;
	/** Descripción. */
	description: string | null;
	/** true: el rol tiene todos los permisos, incluidos los futuros. */
	all_permissions: boolean;
	/** Sus permisos (vacío con all_permissions). */
	permissions: string[];
	/** owner: Propietario. starter: uno de los de Fiscalisto (se puede cambiar, no borrar). custom: uno de la empresa. */
	type: "owner" | "starter" | "custom";
	/** Cuántos miembros lo tienen. */
	members: number;
	/** Cuántas invitaciones pendientes lo dan. */
	invitations: number;
}

/** Algo que una persona puede hacer en la empresa. */
export interface Permission {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "permission";
	/** Nombre. */
	name: string;
	/** Su grupo, como en Ajustes › Roles. */
	group: string;
	/** Delicado (equipo, credenciales, seguridad, plan): darlo o quitarlo se hace en la app. */
	sensitive: boolean;
}

/** Un anticipo timbrado que aún no se aplica. */
export interface Advance {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "advance";
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string;
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string;
	/** La serie (Serie) del anticipo, o null. */
	series: string | null;
	/** El folio (Folio) del anticipo, o null. */
	folio: string | null;
	/** El cliente del anticipo: RFC y nombre. */
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
		/** Solo en la respuesta de POST /v1/invoice_batches: los avisos de esta factura antes de timbrarla, los mismos que daría POST /v1/invoices. Se timbra como se mandó. */
		warnings?: string[];
	}[];
}

/** Una nómina completa (hasta 1,000 recibos) timbrada en segundo plano. */
export interface PayrollBatch {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_batch";
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre del lote, para usted. */
	name: string;
	/** fiscalisto: Fiscalisto calculó cada recibo (receipts); external: se timbraron los importes de su sistema (external_receipts). */
	calculation: "fiscalisto" | "external";
	/** processing: timbrando. completed: ya no queda ningún recibo por timbrar. */
	status: "processing" | "completed";
	/** Cuántos recibos tiene el lote. */
	total: number;
	/** Cuántos recibos se timbraron. */
	stamped: number;
	/** Cuántos no se timbraron (cada uno con su error). */
	failed: number;
	/** Cuántos faltan por timbrar. */
	processing: number;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Cuándo terminó. */
	completed_at: string | null;
	/** El recibo de cada empleado, en el orden en que los mandó (no viene en listas). */
	receipts?: {
		/** Su posición en receipts (o external_receipts), desde 0. */
		index: number;
		/** Su identificador de esta factura (su número de pedido), hasta 100 caracteres. */
		reference: string | null;
		/** El empleado (emp_…), cuando Fiscalisto calculó el recibo. */
		employee: string | null;
		/** El RFC del empleado. */
		tax_id: string;
		/** Nombre. */
		name: string | null;
		/** Estado del objeto. */
		status: "processing" | "valid" | "failed";
		/** El recibo (inv_…, una factura tipo N); también el que el SAT rechazó. */
		invoice: string | null;
		/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
		uuid: string | null;
		/** El neto del recibo timbrado. */
		total: number | null;
		/** Por qué no se timbró este recibo: su código y su mensaje. */
		error: {
			/** payroll_invalid, payroll_period_overlap, payroll_receipt_exists, invoice_rejected, invoice_invalid, insufficient_balance… */
			code: string;
			/** Qué pasó y cómo corregirlo, para una persona. */
			message: string;
		} | null;
	}[];
}

/** El archivo para pagar la nómina desde el portal del banco (no cobra nada). */
export interface PayrollBankFile {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_bank_file";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** El formato del banco: bbva, banamex, banorte, santander o spei (CSV). */
	layout: "bbva" | "banamex" | "banorte" | "santander" | "spei";
	/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
	payment_date: string;
	/** La CLABE de la cuenta de cargo. */
	account: string | null;
	/** El nombre con que el portal del banco lo espera. */
	file_name: string;
	/** text/plain para los portales de los bancos, text/csv para spei. */
	content_type: "text/plain" | "text/csv";
	/** El archivo como texto, con renglones terminados en CR LF. */
	content: string;
	/** El mismo archivo en Windows-1252 (ANSI), en base64: guárdelo tal cual para subirlo. */
	content_base64: string;
	/** Total en la moneda del comprobante (Total). */
	total: number;
	/** Cuántos pagos lleva. */
	count: number;
	/** Cada pago del archivo, en el orden en que va. */
	payments: {
		/** El empleado (emp_…); null si el recibo lo timbró otro sistema y no hay empleado con ese RFC. */
		employee: string | null;
		/** Número de empleado (NumEmpleado). */
		number: string | null;
		/** Nombre. */
		name: string;
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** El neto a pagar: la suma de sus recibos con esa fecha de pago. */
		amount: number;
		/** La CLABE a donde se paga. */
		clabe: string;
		/** true: a otro banco por SPEI; false: a una cuenta del mismo banco. */
		spei: boolean;
		/** Serie y folio de los recibos que paga. */
		receipts: string[];
	}[];
	/** Quién no va en el archivo y por qué (sin CLABE, otro banco…). */
	excluded: {
		/** El empleado (emp_…); null si el recibo lo timbró otro sistema y no hay empleado con ese RFC. */
		employee: string | null;
		/** Número de empleado (NumEmpleado). */
		number: string | null;
		/** Nombre. */
		name: string;
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** El neto a pagar: la suma de sus recibos con esa fecha de pago. */
		amount: number;
		/** Por qué no va en el archivo. */
		reason: string;
	}[];
}

/** Un movimiento afiliatorio del IMSS de un empleado: alta, modificación de salario, baja o reingreso. */
export interface ImssMovement {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "imss_movement";
	/** El emisor (iss_…). */
	issuer: string;
	/** El empleado (emp_…). */
	employee: string;
	/** Su número de empleado. */
	employee_number: string;
	/** Su nombre completo. */
	employee_name: string;
	/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
	social_security_number: string;
	/** alta, reingreso, modificacion (de salario) o baja. */
	kind: "alta" | "reingreso" | "modificacion" | "baja";
	/** El tipo de movimiento del IMSS: 08 alta o reingreso, 07 modificación, 02 baja. */
	movement_type: "08" | "07" | "02";
	/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
	date: string;
	/** Salario diario integrado (SalarioDiarioIntegrado): no menor al salario diario. */
	integrated_daily_salary: number | null;
	/** En bajas, la causa (1 a 9 o A); null en los demás. */
	exit_reason: string | null;
	/** automatic: lo registró el alta o el cambio del empleado; manual: se agregó a mano. */
	source: "automatic" | "manual";
	/** pending: falta presentarlo al IMSS; reported: ya se presentó (ya no cambia). */
	status: "pending" | "reported";
	/** Cuándo se marcó como presentado, o null. */
	reported_at: string | null;
	/** Lo que el IMSS rechazaría en su renglón (vacío: listo para el archivo). */
	problems: string[];
}

/** Un descuento que se repite en cada recibo ordinario de un empleado: Infonavit, Fonacot, pensión alimenticia, préstamo, caja de ahorro o cuota sindical. Cada recibo lo toma con los límites de la Ley Federal del Trabajo. */
export interface EmployeeDeduction {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "employee_deduction";
	/** El emisor (iss_…). */
	issuer: string;
	/** El empleado (emp_…). */
	employee: string;
	/** infonavit, fonacot, pension (pensión alimenticia), prestamo, anticipo (de salarios), caja (de ahorro) o sindical. */
	kind: "infonavit" | "fonacot" | "pension" | "prestamo" | "anticipo" | "caja" | "sindical";
	/** La clave del SAT con que va en el recibo (c_TipoDeduccion): 010, 011, 007, 004, 012, 018 o 019. */
	deduction_type: string;
	/** Cómo se calcula (vea POST /v1/employee_deductions). */
	mode: "percent_sbc" | "fixed_month" | "vsm" | "percent_net" | "percent_gross" | "fixed_period" | "percent_salary";
	/** El porcentaje, el factor de VSM o el monto. */
	value: number;
	/** El monto de un préstamo o anticipo. */
	total: number | null;
	/** Lo que ya descontaron los recibos timbrados. */
	paid: number;
	/** Lo que falta de un préstamo o anticipo. */
	balance: number | null;
	/** El número de crédito, el expediente o una nota. */
	reference: string | null;
	/** A quién se paga una pensión. */
	beneficiary: string | null;
	/** Desde qué día se descuenta. */
	start_date: string;
	/** Hasta qué día, o null. */
	end_date: string | null;
	/** Una pensión que también se descuenta del aguinaldo, la PTU y el finiquito. */
	extraordinary: boolean;
}

/** La parte variable del SDI de un bimestre (artículo 30 de la LSS): las horas extra triples, la prima dominical, otros ingresos y lo que los premios de puntualidad y asistencia pasan del 10% del SBC, entre los días trabajados. */
export interface VariableSalary {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "variable_salary";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** AAAA-B: 1 es enero–febrero, 6 noviembre–diciembre. */
	bimester: string;
	/** El primer día del bimestre. */
	period_start: string;
	/** El último día del bimestre. */
	period_end: string;
	/** Desde cuándo aplica: el primer día del bimestre siguiente. */
	effective_date: string;
	/** El último día para presentar la modificación en IDSE: el quinto día hábil del mes (artículo 34 de la LSS). */
	deadline: string;
	/** Cada empleado con ingresos variables, o con una parte variable que cambia. */
	employees: {
		/** El empleado (emp_…). */
		employee: string;
		/** Su número de empleado. */
		employee_number: string;
		/** Su nombre. */
		employee_name: string;
		/** Lo que se integra del bimestre (artículo 27 de la LSS). */
		variable_income: number;
		/** Los días de salario devengado: los del bimestre menos faltas e incapacidades. */
		days: number;
		/** variable_income entre days. */
		daily_variable: number;
		/** El SDI de los elementos fijos. */
		fixed_integrated_daily_salary: number;
		/** La parte variable que tiene hoy. */
		current_variable: number;
		/** El SDI desde effective_date: el fijo más daily_variable. */
		new_integrated_daily_salary: number;
		/** Si cambia lo que tiene. */
		changes: boolean;
		/** Si ya se aplicó este bimestre. */
		applied: boolean;
		/** De dónde sale variable_income. */
		lines: {
			/** El tipo de percepción (019, 020, 010, 049, 038). */
			type: string;
			/** Qué es. */
			label: string;
			/** Lo que se integra. */
			amount: number;
		}[];
	}[];
}

/** El ajuste anual del ISR de un ejercicio (artículo 97 de la Ley del ISR): el ISR del año de cada empleado contra lo retenido. */
export interface AnnualAdjustment {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "annual_adjustment";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** El ejercicio. */
	year: number;
	/** Desde cuándo lo llevan los recibos: el 1 de enero del año siguiente. */
	applies_from: string;
	/** La fecha de pago del último recibo timbrado del año. */
	last_payment_date: string | null;
	/** Cada empleado que trabajó en el año. */
	employees: {
		/** El empleado (emp_…). */
		employee: string;
		/** Su número de empleado. */
		employee_number: string;
		/** Su nombre. */
		employee_name: string;
		/** Todo lo que le pagaron sus recibos del año, gravado y exento: si pasa de $400,000 presenta su propia declaración. */
		income: number;
		/** Lo gravado del año. */
		taxable_income: number;
		/** El ISR del ejercicio: la tarifa del artículo 152 sobre taxable_income. */
		annual_tax: number;
		/** El subsidio para el empleo que le correspondió en el año. */
		employment_subsidy: number;
		/** annual_tax menos employment_subsidy, nunca negativo. */
		tax_due: number;
		/** El ISR que le retuvieron sus recibos del año. */
		tax_withheld: number;
		/** tax_due menos tax_withheld: positivo a cargo, negativo a favor. */
		balance: number;
		/** Por qué no se le calcula (artículo 97): started, entró después del 1 de enero; left, salió antes del 1 de diciembre; income, ganó más de $400,000; files_own, presenta su declaración. */
		excluded: "started" | "left" | "income" | "files_own" | null;
		/** Si avisó por escrito que presentará su declaración anual. */
		files_own_return: boolean;
		/** Los meses sin recibo timbrado: falta alguno de otro sistema. */
		missing_months: number[];
		/** La diferencia aplicada (positiva a cargo, negativa a favor), o null. */
		applied_amount: number | null;
		/** Lo que de applied_amount aún no lleva ningún recibo timbrado. */
		remaining: number | null;
	}[];
}

/** El impuesto sobre nómina de un mes, por estado. */
export interface PayrollTax {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_tax";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** El mes: 2026-11. */
	month: string;
	/** Lo que paga en todos los estados. */
	total: number;
	/** Cada estado con recibos del mes, de mayor a menor base. */
	states: {
		/** El estado donde trabajan (c_Estado de ClaveEntFed): CMX. */
		state: string;
		/** Su nombre. */
		name: string;
		/** Los empleados con recibo. */
		employees: number;
		/** Los recibos timbrados. */
		receipts: number;
		/** Lo que pagaron sus percepciones, gravado y exento. */
		paid: number;
		/** Lo de excluded_perception_types: no suma a la base. */
		excluded: number;
		/** paid menos excluded. */
		base: number;
		/** La tasa (0.03 es 3%); en Sinaloa, la efectiva de su tabla. */
		rate: number;
		/** El impuesto sobre nómina: base por rate. */
		tax: number;
		/** Las sobretasas del estado sobre el impuesto o la base. */
		surcharges: {
			/** La sobretasa. */
			label: string;
			/** Importe. */
			amount: number;
		}[];
		/** tax más surcharges. */
		total: number;
		/** La opción de tasa elegida, en los estados que la tienen. */
		option: string | null;
		/** Las opciones de tasa del estado (tamaño de la empresa), o null. */
		options: {
			/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
			id: string;
			/** La opción, como la muestra la app. */
			label: string;
		}[] | null;
		/** El artículo que lo cobra. */
		law: string | null;
	}[];
	/** Las percepciones del mes. */
	perceptions: {
		/** c_TipoPercepcion. */
		type: string;
		/** Su nombre en el catálogo del SAT. */
		label: string;
		/** Lo que pagó en el mes. */
		amount: number;
		/** Si no suma a la base. */
		excluded: boolean;
	}[];
	/** Las percepciones que no suman a la base. */
	excluded_perception_types: string[];
}

/** Las vacaciones de un empleado por año de servicio (LFT 76, 81 y 516). */
export interface EmployeeVacations {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "employee_vacations";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El empleado (emp_…). */
	employee: string;
	/** El día del saldo. */
	as_of: string;
	/** Los días de años de servicio cumplidos que le quedan y no han prescrito: los que paga el finiquito. */
	pending_days: number;
	/** El año de servicio en curso. */
	current_year: {
		/** Su número: 1 el primer año de servicio. */
		year: number;
		/** Su aniversario. */
		completes_on: string;
		/** Los días que le tocan al cumplirlo. */
		days: number;
		/** Los que ya tomó por adelantado. */
		taken_in_advance: number;
		/** Su parte proporcional al día del saldo, menos lo adelantado. */
		accrued_days: number;
	};
	/** Cada año de servicio cumplido, del más antiguo al más reciente. */
	years: {
		/** El año de servicio; 0 es el saldo de antes de Fiscalisto. */
		year: number;
		/** El aniversario que lo cumple. */
		owed_from: string;
		/** Los días que le tocan (artículo 76). */
		days: number;
		/** Los que ya tomó. */
		taken_days: number;
		/** Los que le quedan. */
		remaining_days: number;
		/** El último día para dárselos (artículo 81). */
		grant_by: string;
		/** El día en que prescriben (artículo 516). */
		prescribes_on: string;
		/** taken, disfrutadas; pending, por disfrutar; late, pasó el plazo para darlas y no han prescrito; prescribed, prescritas. */
		status: "taken" | "pending" | "late" | "prescribed";
	}[];
	/** El saldo de antes de Fiscalisto, o null. */
	opening: {
		/** El día del saldo inicial. */
		date: string;
		/** Los de años cumplidos. */
		pending_days: number;
		/** Los tomados del año en curso. */
		taken_days: number;
	} | null;
	/** Los días de vacaciones de sus recibos timbrados. */
	taken: {
		/** El fin del periodo del recibo. */
		date: string;
		/** Los días de vacaciones que pagó. */
		days: number;
	}[];
}

/** Qué no grava el impuesto sobre nómina del emisor y sus opciones de tasa. */
export interface PayrollTaxSettings {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_tax_settings";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Las percepciones que no suman a la base; null, las comunes. */
	excluded_perception_types: string[] | null;
	/** La opción de tasa de cada estado, por su c_Estado. */
	state_options: Record<string, string>;
}

/** Los archivos para presentar movimientos en IDSE o importarlos en SUA. */
export interface ImssFiles {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "imss_files";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** idse o sua. */
	format: "idse" | "sua";
	/** Los archivos: en IDSE uno por tipo de movimiento; en SUA ASEG.TXT y MOVT.TXT. */
	files: {
		/** El nombre del archivo. */
		file_name: string;
		/** Qué lleva, en palabras. */
		description: string;
		/** Cuántos movimientos lleva. */
		count: number;
		/** El archivo como texto, renglones terminados en CR LF. */
		content: string;
		/** El archivo en Windows-1252 (ANSI, como lo leen IDSE y SUA), en base64. */
		content_base64: string;
	}[];
	/** Los movimientos que van en los archivos. */
	movements: string[];
	/** Los que se quedaron fuera y por qué (un NSS inválido…). */
	refused: {
		/** El movimiento (imv_…). */
		movement: string;
		/** El nombre del empleado. */
		employee_name: string;
		/** Lo que el IMSS rechazaría en su renglón. */
		problems: string[];
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
	/** high: 69-B o 69-B Bis como presunto o definitivo (el SAT dice que simula operaciones; sus facturas no se pueden deducir). medium: una lista del art. 69 (no localizado, créditos firmes o exigibles, cancelados, sentencias, CSD sin efectos). none: no aparece en ninguna, con todas las listas al día, o ya desvirtuó o tiene sentencia favorable. unknown: no aparece, pero alguna lista no se pudo actualizar (vea lists_unavailable): no lo dé por limpio. */
	risk: "high" | "medium" | "none" | "unknown";
	/** true si todas las listas se leyeron con éxito en los últimos dos días. Con false, que no aparezca no significa que esté limpio. */
	verified: boolean;
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
	/** Las listas que no se pudieron confirmar (su última actualización falló, falta o tiene más de dos días). Vacía si todas están al día. */
	lists_unavailable: string[];
}

/** Si los sellos del XML son auténticos, como los revisa el SAT: el Sello del emisor contra la cadena original y su certificado, y el SelloSAT del timbre contra el certificado del SAT. */
export interface CfdiSeals {
	/** true si no hay ningún problema: el Sello corresponde a los datos y al certificado del emisor (un CSD de su RFC, vigente en la fecha de emisión) y el timbre es de este comprobante y del SAT. */
	valid: boolean;
	/** Si el Sello del emisor firma la cadena original de este XML con la llave del certificado que trae. false si alguien cambió un monto, un nombre o una fecha después de sellar. */
	issuer_seal_valid: boolean;
	/** El certificado del emisor que trae el XML (Certificado): número, RFC, nombre, si es CSD o e.firma y su vigencia. null si no se pudo leer. */
	certificate: {
		/** El número del certificado (20 dígitos), como lo da el SAT. */
		number: string;
		/** El RFC dueño del certificado. */
		tax_id: string | null;
		/** El nombre o razón social en el certificado. */
		name: string | null;
		/** csd si es un sello digital; fiel si es una e.firma (no se debe sellar con ella). */
		kind: "csd" | "fiel";
		/** Desde cuándo vale el certificado. */
		valid_from: string;
		/** Hasta cuándo vale el certificado. */
		valid_to: string;
	} | null;
	/** El timbre (TimbreFiscalDigital): si su SelloSAT es del SAT, con qué certificado del SAT y qué PAC lo timbró. null si el XML no está timbrado. */
	stamp: {
		/** Si el SelloSAT firma el timbre con el certificado del SAT (NoCertificadoSAT). null si el certificado del SAT no se pudo obtener en ese momento. */
		sat_seal_valid: boolean | null;
		/** El número del certificado del SAT que selló el timbre. */
		sat_certificate_number: string;
		/** El RFC del PAC que timbró (RfcProvCertif). */
		pac_tax_id: string | null;
	} | null;
	/** Cada problema, con su código y qué significa. Vacía si valid es true. */
	problems: {
		/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
		code: "malformed_xml" | "missing_seal" | "certificate_unreadable" | "certificate_number_mismatch" | "certificate_not_issuer" | "certificate_not_csd" | "certificate_not_valid_at_issue" | "seal_mismatch" | "stamp_not_for_this_seal" | "sat_seal_mismatch";
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
	}[];
	/** La cadena original del comprobante, como la arma el SAT con sus XSLT. null si el XML no se pudo leer. */
	original_string: string | null;
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Su centro de costo (ccn_…), o null. Póngalo o cámbielo con POST /v1/sat_invoices/{id}. */
	cost_center: string | null;
	/** La descarga (sdl_…) que la trajo, o null. */
	sat_download: string | null;
	/** Cuándo llegó. */
	downloaded_at: string | null;
}

/** Un CFDI de retenciones e información de pagos del emisor, recibido (la constancia que le dio un banco, una plataforma o quien le pagó) o emitido, como lo muestra Facturas › Retenciones. */
export interface SatRetention {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_retention";
	/** El emisor de su cuenta (iss_…) a quien pertenece esta constancia. */
	issuer: string;
	/** El folio fiscal (UUID del timbre). */
	uuid: string;
	/** received (se la dieron al emisor: un banco, una plataforma, quien le pagó) o issued (la emitió). */
	direction: "received" | "issued";
	/** La fecha de expedición (FechaExp). */
	date: string;
	/** Folio interno (FolioInt), o null. */
	internal_folio: string | null;
	/** Clave de la retención (CveRetenc), como 14 dividendos, 16 intereses o 26 plataformas. */
	code: string | null;
	/** Descripción de la retención (DescRetenc), o null. */
	description: string | null;
	/** Quien retuvo (Emisor). */
	issued_by: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** A quien le retuvieron (Receptor). */
	issued_to: {
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Nombre o razón social tal como está en la constancia de situación fiscal, sin el régimen de capital (sin «S.A. de C.V.»). */
		legal_name: string | null;
	};
	/** Los meses y el ejercicio que cubre (Periodo), o null si no se pudo leer. */
	period: {
		/** Ejercicio (Ejercicio). */
		year: number;
		/** Mes inicial (MesIni), 1 a 12. */
		month_start: number;
		/** Mes final (MesFin), 1 a 12. */
		month_end: number;
	} | null;
	/** Los montos de Totales. */
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
	/** Cada impuesto retenido (ImpRetenidos). */
	withheld_taxes: {
		/** Base del impuesto retenido (BaseRet). */
		base: number | null;
		/** Impuesto: isr, iva o ieps (ImpuestoRet 001, 002, 003). */
		tax: string | null;
		/** Importe. */
		amount: number | null;
		/** Tipo de pago de la retención (TipoPagoRet): 01 definitivo IVA, 02 definitivo IEPS, 03 definitivo ISR, 04 provisional ISR. Por omisión el usual de cada impuesto. */
		payment_type: string | null;
	}[];
	/** active o canceled: la canceló el emisor en Fiscalisto, o el SAT la reporta cancelada (se revisa cada mes). Una cancelada ya no es impuesto retenido. */
	status: "active" | "canceled";
	/** Si su XML no se pudo leer, por qué; sus campos quedan en null. Si no, null. */
	read_error: string | null;
	/** Cuándo llegó a Fiscalisto. */
	downloaded_at: string | null;
}

/** Una declaración que el emisor presentó ante el SAT (provisional o definitiva, anual o del servicio anterior Declaraciones y pagos), con sus cifras y sus archivos. */
export interface SatDeclaration {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_declaration";
	/** El emisor que la presentó. */
	issuer: string;
	/** monthly (provisional o definitiva, desde 2022), annual (la anual de persona moral) o dyp (el servicio anterior Declaraciones y pagos, 2021 y antes). */
	source: "monthly" | "annual" | "dyp";
	/** El ejercicio. */
	year: number;
	/** El mes (1 a 12), o null en la anual y otros periodos. */
	month: number | null;
	/** El periodo como lo nombra el SAT: «Enero», «Del Ejercicio»… */
	period: string;
	/** normal o complementary (complementaria). */
	type: "normal" | "complementary";
	/** En una complementaria, su tipo como lo dice el SAT («Modificación de Obligaciones», «Obligación no presentada», «Dejar sin efecto obligación»). Se liga con la que corrige por source, year, month y period. */
	complementary_type: string | null;
	/** El número de operación que le dio el SAT. */
	operation_number: string;
	/** La línea de captura, si hubo algo a pagar. */
	payment_line: string | null;
	/** Cuándo se presentó (AAAA-MM-DD). */
	filed_on: string | null;
	/** El coeficiente de utilidad que aplicó (ISR de personas morales), o null. */
	profit_coefficient: number | null;
	/** El ISR a cargo, según el acuse. */
	isr_due: number | null;
	/** El IVA a cargo, según el acuse. */
	vat_due: number | null;
	/** El total a pagar, según el acuse. */
	total_due: number | null;
	/** Las cifras de la declaración por impuesto (tax), cada una con su texto como lo imprime el SAT (label) y su valor. Vacío en las de Declaraciones y pagos (su PDF trae dos columnas que no se leen con certeza) o si el PDF aún no llega. */
	sections: {
		/** Impuesto: isr, iva o ieps (ImpuestoRet 001, 002, 003). */
		tax: string;
		/** Los renglones del impuesto, en el orden del PDF. */
		fields: {
			/** El renglón como lo imprime el SAT. */
			label: string;
			/** El valor del renglón como lo trae la declaración (número o texto). */
			value: number | string;
		}[];
	}[];
	/** Lo que dice el acuse: cada concepto con su cantidad a cargo y a pagar, el total, la línea de captura y su vigencia. null si el acuse aún no llega. */
	receipt: {
		/** Cada impuesto del acuse. */
		concepts: {
			/** El concepto de la línea de captura (ISR, IVA…) como lo da el SAT. */
			concept: string;
			/** Lo que resultó a cargo. */
			due: number | null;
			/** La cantidad a cargo. */
			amount_due: number | null;
			/** La cantidad a pagar. */
			amount_to_pay: number | null;
			/** El saldo a favor que dice el acuse (la anual de personas físicas); null si no lo trae. */
			in_favor: number | null;
		}[];
		/** Total en la moneda del comprobante (Total). */
		total: number | null;
		/** La línea de captura del acuse. */
		payment_line: string | null;
		/** Hasta cuándo sirve la línea de captura (AAAA-MM-DD). */
		valid_until: string | null;
	} | null;
	/** Las mismas cifras con nombres fijos, por obligación (ISR, IVA, cada retención), para leerlas igual cada mes sin conocer el formato del SAT. Una cifra que no viene en la declaración o no se pudo leer es null, nunca 0. En Declaraciones y pagos solo trae lo del acuse. */
	summary: {
		/** Cada obligación de la declaración: isr, vat, ieps, isr_salaries, isr_assimilated_salaries, isr_professional_services, isr_rent, vat_withholdings u other. */
		obligations: {
			/** Qué obligación es. */
			obligation: "isr" | "vat" | "ieps" | "isr_salaries" | "isr_assimilated_salaries" | "isr_professional_services" | "isr_rent" | "vat_withholdings" | "other";
			/** Su nombre como lo imprime el SAT. */
			name: string;
			/** true si sus cifras se leyeron de la declaración; false si solo vienen del acuse. */
			read: boolean;
			/** La cantidad a cargo. */
			amount_due: number | null;
			/** La cantidad a pagar. */
			amount_to_pay: number | null;
			/** El saldo a favor, de la declaración o del acuse; null si no hay o no se pudo leer. */
			in_favor: number | null;
			/** Las cifras de la obligación con nombres fijos (en IVA: taxable_16, taxable_0, exempt, charged, charged_16, charged_16_invoiced, paid_16, creditable, withheld, balance_applied; en todas: surcharges, inflation, paid_before, due, in_favor, to_pay). null si la declaración no la trae o no se pudo leer, nunca 0. */
			figures: Record<string, number | null>;
		}[];
		/** El total a pagar del acuse; si no hay acuse, la suma de las obligaciones cuando todas se conocen. */
		total_to_pay: number | null;
	};
	/** read: ya se leyó su PDF (sections, summary, receipt y los *_due vienen de él; una cifra en null es que la declaración no la trae). pending: está listada pero su PDF aún no se descarga, así que sus cifras vienen vacías o en null; se descarga sola, sin otro timbre, para figures_expected_at. unavailable: el SAT no ha dado el PDF (files_error dice por qué); se vuelve a pedir en la siguiente lectura. */
	figures_status: "read" | "pending" | "unavailable";
	/** Cuándo deberían estar sus cifras, si no están (la lectura en segundo plano que termina una consulta cortada por tiempo). null cuando ya están o cuando no hay una lectura programada: entonces llegan con el siguiente POST /v1/sat_declarations/refresh. */
	figures_expected_at: string | null;
	/** Su pago en el banco, de «Declaraciones pagadas» del SAT (solo las mensuales; null en las demás). status: paid (el SAT tiene el pago), unpaid (tiene algo a pagar y el SAT no lo tenía pagado en checked_at), overdue (igual, con la línea de captura vencida), nothing_to_pay o unchecked (aún no se revisa). paid_on, amount_paid y bank del pago más reciente, y cada pago en payments con su banco, día, línea de captura, medio (channel), importe, número de operación del banco y llave de pago. */
	payment: {
		/** paid, unpaid (algo a pagar que el SAT no tenía pagado), overdue (igual, línea de captura vencida), nothing_to_pay o unchecked (aún no se sabe: sus cifras no se han leído, ver figures_status, o su pago no se ha buscado; checked_at viene en null). */
		status: "paid" | "unpaid" | "overdue" | "nothing_to_pay" | "unchecked";
		/** El día del pago más reciente (AAAA-MM-DD). */
		paid_on: string | null;
		/** Lo pagado, en pesos (la suma de los pagos). */
		amount_paid: number | null;
		/** El banco del pago más reciente. */
		bank: string | null;
		/** Cuándo se buscó por última vez en «Declaraciones pagadas». */
		checked_at: string | null;
		/** Cada pago como el SAT lo registró del banco. */
		payments: {
			/** La institución de crédito. */
			bank: string | null;
			/** El día del pago (AAAA-MM-DD). */
			date: string | null;
			/** La línea de captura pagada. */
			payment_line: string | null;
			/** Cómo se pagó, como lo dice el SAT («Ventanilla», «Internet»). */
			channel: string | null;
			/** El importe pagado. */
			amount: number | null;
			/** El número de operación del banco. */
			bank_operation_number: string | null;
			/** La llave de pago. */
			payment_key: string | null;
		}[];
	} | null;
	/** Qué archivos ya tiene: pdf (GET …/pdf), receipt (GET …/receipt), payment_record (GET …/payment_record, cuando el SAT la tiene como pagada) y financial_statements (GET …/financial_statements, solo en la anual de persona moral). */
	files: {
		/** Si ya tiene la declaración en PDF (GET …/pdf). */
		pdf: boolean;
		/** Si ya tiene el acuse (GET …/receipt). */
		receipt: boolean;
		/** Si ya tiene el registro del pago (GET …/payment_record). */
		payment_record: boolean;
		/** Si ya tiene el Excel de estados financieros (GET …/financial_statements), solo en la anual de persona moral. */
		financial_statements: boolean;
	};
	/** Por qué falta un archivo, como lo dijo el SAT (por ejemplo «No se puede generar el archivo»). Se vuelve a pedir en la siguiente consulta. */
	files_error: string | null;
	/** Cuándo se trajo por primera vez. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** El ejercicio del emisor mes por mes: qué obligaciones presentó, cuáles parecen faltar y cuáles aún no vencen. */
export interface SatDeclarationCalendar {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_declaration_calendar";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El ejercicio. */
	year: number;
	/** Cuántas obligaciones ya vencidas no encontramos presentadas en el SAT. */
	missing: number;
	/** Los 12 meses y, en persona moral, la anual (month null). Las obligaciones se deducen de lo que el emisor presenta: ISR e IVA cada mes desde el primero que presentó; una retención si la presentó en 2 de los 3 meses anteriores o antes y después. La opinión de cumplimiento del SAT es la que manda. */
	months: {
		/** El mes (1 a 12), o null para la anual. */
		month: number | null;
		/** El último día para presentarla (AAAA-MM-DD). */
		due_on: string;
		/** Las obligaciones del mes. */
		obligations: {
			/** Qué obligación es (las de summary.obligations), o annual_return para la anual. */
			obligation: "isr" | "vat" | "ieps" | "isr_salaries" | "isr_assimilated_salaries" | "isr_professional_services" | "isr_rent" | "vat_withholdings" | "other" | "annual_return";
			/** filed (presentada), missing (venció y no la encontramos) o due (aún no vence). */
			status: "filed" | "missing" | "due";
			/** Las declaraciones (dcl_…) que la presentaron, la normal y sus complementarias. */
			declarations: string[];
		}[];
	}[];
}

/** Lo que el SAT precargará en la declaración anual de una persona física: sus sueldos y retenciones, y sus deducciones personales. */
export interface SatAnnualPreload {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_annual_preload";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El ejercicio de la anual. */
	year: number;
	/** Lo que dice el visor de nómina del SAT: lo que le pagaron sus patrones y el ISR que le retuvieron, según sus recibos de nómina. null si aún no se lee. */
	payroll: {
		/** Hasta qué día tiene procesados el SAT los recibos (AAAA-MM-DD). */
		updated_on: string | null;
		/** Cuándo se leyó del SAT. */
		read_at: string;
		/** Los totales del ejercicio de todos sus patrones. */
		concepts: {
			/** La clave del SAT: PIRA1 ingresos por asimilados, PISR1 ISR retenido, y las de sueldos y salarios. */
			code: string;
			/** El grupo en que el SAT la muestra. */
			group: string;
			/** Su nombre en el SAT. */
			title: string;
			/** El monto del ejercicio, en pesos. */
			amount: number;
		}[];
		/** Cada patrón (retenedor) con sus totales. */
		employers: {
			/** El RFC del patrón. */
			tax_id: string;
			/** Su nombre o razón social. */
			name: string;
			/** Sus totales del ejercicio por clave. */
			concepts: {
				/** La clave del SAT, como en concepts. */
				code: string;
				/** Su nombre en el SAT. */
				title: string;
				/** El monto del ejercicio de ese patrón, en pesos. */
				amount: number;
			}[];
		}[];
	} | null;
	/** Lo que dice el visor de deducciones personales del SAT. null si aún no se lee. */
	personal_deductions: {
		/** Cuándo actualizó el SAT el visor. */
		updated_at: string | null;
		/** Cuándo se leyó del SAT. */
		read_at: string;
		/** Las deducciones personales que el SAT precarga. */
		total_taken: number;
		/** Lo que podría deducirse y el SAT no toma (gastos factibles de ser deducción personal). */
		total_possible: number;
		/** Lo que toma, por tipo de deducción. */
		taken: {
			/** La clave del tipo de deducción del SAT (A a J). */
			code: string;
			/** Su nombre en el SAT. */
			description: string;
			/** Cuántos CFDI. */
			invoices: number;
			/** La suma, en pesos. */
			total: number;
		}[];
		/** Lo que no toma, por el tipo de deducción que parece. */
		possible: {
			/** La clave del tipo de deducción del SAT (A a J). */
			code: string;
			/** Su nombre en el SAT. */
			description: string;
			/** Cuántos CFDI. */
			invoices: number;
			/** La suma, en pesos. */
			total: number;
		}[];
		/** Cada CFDI que el visor considera. */
		invoices: {
			/** El folio fiscal. */
			uuid: string;
			/** El RFC de quien lo emitió. */
			issuer_tax_id: string;
			/** Su nombre. */
			issuer_name: string;
			/** Su fecha de emisión (AAAA-MM-DD). */
			date: string | null;
			/** Su total, en pesos. */
			total: number;
			/** La forma de pago, como la da el SAT. */
			payment_form: string | null;
			/** El método de pago, como lo da el SAT. */
			payment_method: string | null;
			/** La clave de producto o servicio. */
			product_code: string | null;
			/** Sus conceptos. */
			description: string | null;
			/** El tipo de deducción en que lo puso el SAT (A a J), o L si no lo clasificó y podría deducirse. */
			deduction_code: string | null;
			/** Ese tipo, como lo nombra el SAT. */
			deduction_type: string | null;
			/** Si no lo tomó (L), el tipo que parece; null si lo tomó. */
			possible_code: string | null;
			/** Por qué no lo toma, o lo que el SAT observa al tomarlo, en sus palabras. */
			reasons: string[];
			/** Si es una aportación o depósito para el retiro que reportó su banco (sin CFDI), cuál; null si es un CFDI. */
			retirement_deposit: string | null;
		}[];
	} | null;
}

/** Una sucursal del emisor: otro lugar desde donde factura, con su código postal (LugarExpedicion), su dirección en el PDF, sus series y, si quiere, su propia marca (nombre comercial, logo, color y estilo del PDF). */
export interface Branch {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "branch";
	/** El emisor de la sucursal. */
	issuer: string;
	/** Cómo la llama su equipo; va en el PDF. */
	name: string;
	/** Su código postal: el LugarExpedicion de sus CFDI. */
	zip: string;
	/** Su dirección, en el PDF de sus facturas. */
	address: {
		/** Calle (Calle). */
		street: string | null;
		/** Número exterior (NumeroExterior). */
		exterior: string | null;
		/** Número interior (NumeroInterior). */
		interior: string | null;
		/** Colonia. */
		neighborhood: string | null;
		/** Municipio o alcaldía. */
		city: string | null;
		/** Estado (Estado): en el extranjero c_Estado para USA y CAN, o texto. */
		state: string | null;
	};
	/** Teléfono, en el PDF, o null. */
	phone: string | null;
	/** Correo, en el PDF, o null. */
	email: string | null;
	/** La serie de cada tipo de CFDI que se timbra desde ella; null usa la del emisor. */
	series: {
		/** Serie de sus facturas (tipo I); null, la del emisor. */
		invoice: string | null;
		/** Serie de sus notas de crédito (tipo E); null, la del emisor. */
		credit_note: string | null;
		/** Serie de sus complementos de pago (tipo P); null, la del emisor. */
		payment: string | null;
		/** Serie de sus traslados (tipo T); null, la del emisor. */
		transfer: string | null;
	};
	/** Su nombre comercial propio (PDF, correo y página de la factura); null: el del emisor. */
	trade_name: string | null;
	/** Su logo propio, para el PDF (se sube en Ajustes › Sucursales); null: el del emisor. */
	logo_url: string | null;
	/** Color de su PDF, como #2563EB; null: el del emisor. */
	pdf_color: string | null;
	/** Estilo de su PDF; null: el del emisor. */
	pdf_style: "clasico" | "moderno" | "compacto" | "minimalista" | null;
	/** true si está archivada: ya no se factura desde ella. */
	archived: boolean;
	/** Cuándo se creó. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** Un centro de costo del emisor: una obra, proyecto, sucursal o área por la que separa sus ingresos y gastos. */
export interface CostCenter {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cost_center";
	/** El emisor del centro de costo. */
	issuer: string;
	/** Cómo lo llama su equipo, por ejemplo «Obra Norte». */
	name: string;
	/** Su clave (por ejemplo «CC-01»), o null. */
	code: string | null;
	/** true si está archivado: ya no se ponen facturas en él, pero las suyas lo conservan. */
	archived: boolean;
	/** Cuántas facturas tiene, emitidas y recibidas. */
	invoices: number;
	/** Cuándo se creó. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** Una lista de precios: parte del precio del catálogo (o de otra lista), lo mueve un porcentaje y lo redondea, con precios propios por producto, presentación y desde cierta cantidad (escalones de mayoreo). items solo viene al ver una lista. */
export interface PriceList {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "price_list";
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre. */
	name: string;
	/** Descripción. */
	description: string | null;
	/** La lista (prl_…) de la que parte; null parte del precio del catálogo de cada producto. */
	base_list: string | null;
	/** Cuánto sube (positivo) o baja (negativo) el precio del que parte, en porcentaje. */
	adjust_percent: number;
	/** A cuánto redondea los precios que calcula (0.5, 1, 10…), o null sin redondear. */
	round_to: number | null;
	/** Desde qué día vale (YYYY-MM-DD, Ciudad de México), o null desde siempre. */
	starts_on: string | null;
	/** Hasta qué día vale, ese día incluido (YYYY-MM-DD), o null sin fin. */
	ends_on: string | null;
	/** true si es la lista de todos los clientes que no tienen otra (solo puede haber una). */
	is_default: boolean;
	/** false la pausa; true la reanuda desde hoy. */
	active: boolean;
	/** Cuántos grupos de clientes la usan. */
	groups: number;
	/** Cuántos clientes la tienen como suya. */
	customers: number;
	/** Conceptos (Conceptos), al menos uno. */
	items: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product: string;
		/** Unidad aduana (UnidadAduana), c_UnidadAduana. */
		unit: string | null;
		/** Desde cuántas unidades (de su presentación) vale este precio: un escalón de mayoreo. 1 por omisión. */
		min_quantity: number;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number | null;
		/** Porcentaje que baja el precio de la lista para este producto, en vez de un precio fijo. */
		discount_percent: number | null;
	}[] | null;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
	/** Cuándo cambió por última vez, ISO 8601 (-06:00). */
	updated_at: string | null;
}

/** Un grupo de clientes: su lista de precios, descuento, días de crédito, pedido mínimo y si piden desde su Portal del cliente. */
export interface CustomerGroup {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "customer_group";
	/** El emisor (iss_…). */
	issuer: string;
	/** Nombre. */
	name: string;
	/** Color de su etiqueta en la app: info, warning, positive, critical o muted. */
	color: string;
	/** Lista de precios (prl_…). En un cliente, la suya propia, que gana a la de su grupo; null para usar la de su grupo o la de todos. */
	price_list: string | null;
	/** Porcentaje de descuento sobre el precio, de 0 a 100; en el CFDI va como Descuento de cada concepto. */
	discount_percent: number;
	/** Días de crédito que se le dan, de 0 a 365, o null para no cambiar los del cliente. */
	credit_days: number | null;
	/** Pedido mínimo, sin IVA, para pedir desde el Portal del cliente, o null sin mínimo. */
	min_order: number | null;
	/** true si sus clientes pueden hacer pedidos desde su Portal del cliente. */
	portal_ordering: boolean;
	/** Hasta cuándo sus clientes cambian o cancelan desde su portal un pedido que mandaron ahí: none, until_confirmed (hasta que usted lo confirme) o until_delivered (hasta que se entregue o facture algo). */
	portal_changes: "none" | "until_confirmed" | "until_delivered";
	/** Días de la semana en que les entrega (0 domingo a 6 sábado), o null si cualquier día. El Portal del cliente solo ofrece esos días. */
	delivery_days: number[] | null;
	/** Hora de corte (0 a 23, Ciudad de México): un pedido del portal después de ella cuenta desde el día siguiente; null sin hora de corte. */
	cutoff_hour: number | null;
	/** Días para preparar un pedido antes de poder entregarlo. */
	prep_days: number;
	/** Cuántos clientes hay en el grupo. */
	customers: number;
	/** Cuándo se creó, ISO 8601 con la hora de la Ciudad de México (-06:00). */
	created_at: string | null;
}

/** Lo que un cliente paga por unos productos a una cantidad: su precio por unidad sin IVA (de su lista), su descuento y el siguiente escalón de mayoreo. */
export interface PriceQuote {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "price_quote";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El cliente (cus_…) cuyos precios se calcularon. */
	customer: string;
	/** Conceptos (Conceptos), al menos uno. */
	items: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
		/** Unidad aduana (UnidadAduana), c_UnidadAduana. */
		unit: string | null;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number;
		/** Su precio del catálogo, por unidad y sin IVA, antes de su lista. */
		catalog_price: number;
		/** El descuento del cliente (el suyo, o el de su grupo) sobre ese precio; va como Descuento en el CFDI. */
		discount_percent: number;
		/** La lista (prl_…) de donde sale el precio, o null si es el del catálogo. */
		price_list: string | null;
		/** El siguiente escalón de mayoreo: desde qué cantidad y a qué precio. null si no hay. */
		next_step: {
			/** Desde cuántas unidades (de su presentación) vale este precio: un escalón de mayoreo. 1 por omisión. */
			min_quantity: number;
			/** Precio unitario antes de impuestos (ValorUnitario). */
			unit_price: number;
		} | null;
	}[];
}

/** Alguien que viaja o gasta por el emisor: un empleado (de Nómina) o alguien por honorarios. Tiene un enlace propio para subir sus facturas sin cuenta. */
export interface ExpensePerson {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_person";
	/** El emisor por el que gasta. */
	issuer: string;
	/** empleado (sueldos y salarios: viáticos exentos en su recibo de nómina) o honorarios. */
	kind: "empleado" | "honorarios";
	/** Su empleado de Nómina (emp_…), o null si es por honorarios. */
	employee: string | null;
	/** Su nombre. */
	name: string;
	/** Su RFC, o null. */
	tax_id: string | null;
	/** Su correo, a donde se le manda su enlace y los avisos, o null. */
	email: string | null;
	/** Dónde trabaja: un viaje a más de 50 km de ahí es de viáticos. */
	base_city: string | null;
	/** Su área, o null. */
	department: string | null;
	/** true si tiene un enlace que funciona para subir sus facturas. */
	link_active: boolean;
	/** true si está archivada. */
	archived: boolean;
	/** Cuándo se agregó. */
	created_at: string | null;
}

/** El enlace de una persona: ahí ve solo sus comprobaciones y sube sus facturas desde el teléfono, sin cuenta. */
export interface ExpensePersonLink {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_person_link";
	/** La persona (exp_…). */
	person: string;
	/** Su enlace, o null si está apagado. */
	url: string | null;
}

/** Un gasto de una comprobación. */
export interface ExpenseItem {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_item";
	/** Cuándo se gastó (AAAA-MM-DD). */
	date: string;
	/** De qué es: hospedaje, alimentos, avion, transporte, auto, combustible, comidas, papeleria, mensajeria, software u otros. */
	category: "hospedaje" | "alimentos" | "avion" | "transporte" | "auto" | "combustible" | "comidas" | "papeleria" | "mensajeria" | "software" | "otros";
	/** Qué fue (el proveedor), o null. */
	description: string | null;
	/** En pesos. */
	amount: number;
	/** En su moneda, o null. */
	foreign_amount: number | null;
	/** Su moneda (USD, EUR…), o null. */
	foreign_currency: string | null;
	/** Cuántas personas comieron (en alimentos el tope es por persona). */
	people: number;
	/** Cómo se pagó: tarjeta_empresa, tarjeta_propia, efectivo, transferencia u otro, o null. */
	payment: "tarjeta_empresa" | "tarjeta_propia" | "efectivo" | "transferencia" | "otro" | null;
	/** Su comprobante: cfdi, extranjero, ticket o ninguno. */
	receipt: "cfdi" | "extranjero" | "ticket" | "ninguno";
	/** El UUID de su factura, o null. */
	uuid: string | null;
	/** La nota de la persona, o null. */
	note: string | null;
	/** true si quien aprueba lo rechazó. */
	rejected: boolean;
	/** Por qué se rechazó, o null. */
	reject_reason: string | null;
	/** Lo que se deduce de este gasto. */
	deductible: number;
	/** Lo que no se deduce. */
	non_deductible: number;
	/** true si pasa un tope de la política. */
	over_policy: boolean;
	/** Sus avisos contra la ley y la política. */
	issues: {
		/** error (impide enviarla), warning, policy (pasa la política) o info. */
		level: "error" | "warning" | "policy" | "info";
		/** Qué es, como código estable. */
		code: string;
		/** Qué es, en palabras. */
		message: string;
	}[];
	/** Cuándo se agregó. */
	created_at: string | null;
}

/** Dinero que se le dio a la persona (anticipo, reembolso) o que devolvió. */
export interface ExpenseMovement {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_movement";
	/** anticipo, reembolso o devolucion. */
	kind: "anticipo" | "reembolso" | "devolucion";
	/** En pesos. */
	amount: number;
	/** Cuándo se pagó (AAAA-MM-DD). */
	date: string;
	/** transferencia, efectivo, tarjeta o nomina (en su recibo de nómina). */
	method: "transferencia" | "efectivo" | "tarjeta" | "nomina";
	/** Su referencia, o null. */
	reference: string | null;
	/** true si ya se pagó en un recibo de nómina. */
	in_payroll: boolean;
	/** Cuándo se registró. */
	created_at: string | null;
}

/** Una comprobación de viáticos (un viaje) o de gastos de un periodo: sus gastos revisados contra la ley y la política, y el dinero dado o devuelto. Al aprobarla sus facturas se deducen y entra en las pólizas por 107.01. */
export interface ExpenseReport {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_report";
	/** El emisor. */
	issuer: string;
	/** Su número, consecutivo por emisor. */
	number: number;
	/** Cómo se muestra, por ejemplo «VIA-0012». */
	label: string;
	/** Quién la comprueba (exp_…). */
	person: string;
	/** El nombre de esa persona. */
	person_name: string;
	/** viaje o gastos (de oficina, de un periodo). */
	kind: "viaje" | "gastos";
	/** Su nombre. */
	title: string;
	/** Para qué fue, o null. */
	purpose: string | null;
	/** A dónde, o null. */
	destination: string | null;
	/** true si fue al extranjero. */
	abroad: boolean;
	/** true si fue a más de 50 km de donde trabaja la persona. */
	far: boolean;
	/** La salida o el inicio del periodo (AAAA-MM-DD), o null. */
	start_date: string | null;
	/** El regreso o el fin del periodo (AAAA-MM-DD), o null. */
	end_date: string | null;
	/** draft (abierta), submitted (por aprobar), rejected (devuelta para corregir), approved (por liquidar) o closed (cerrada, con el saldo en cero). */
	status: "draft" | "submitted" | "rejected" | "approved" | "closed";
	/** Hasta cuándo hay para comprobarla (la política), o null. */
	due_date: string | null;
	/** Cuándo se envió a aprobar, o null. */
	submitted_at: string | null;
	/** Cuándo se aprobó o se devolvió, o null. */
	decided_at: string | null;
	/** La nota de quien la aprobó o la devolvió, o null. */
	decision_note: string | null;
	/** Cuándo se cerró, o null. */
	closed_at: string | null;
	/** true si ya se reportó en un recibo de nómina (viáticos 050 y 081). */
	in_payroll: boolean;
	/** Lo gastado, sin los gastos rechazados. */
	spent: number;
	/** Lo de los gastos rechazados. */
	rejected: number;
	/** Lo comprobado con factura o comprobante del extranjero. */
	proven: number;
	/** Lo que se deduce, con los topes de la ley. */
	deductible: number;
	/** Lo que no se deduce (pasa los topes o no tiene comprobante). */
	non_deductible: number;
	/** Lo que se le dio en anticipos. */
	advances: number;
	/** Lo que se le reembolsó. */
	reimbursed: number;
	/** Lo que devolvió. */
	returned: number;
	/** Positivo, lo que la persona debe devolver; negativo, lo que la empresa le debe reembolsar; 0, liquidada. Lo pagado con la tarjeta de la empresa no cuenta. */
	balance: number;
	/** true si se puede enviar o aprobar: ningún gasto tiene errores. */
	ready: boolean;
	/** Avisos de la comprobación entera. */
	issues: {
		/** error (impide enviarla), warning, policy (pasa la política) o info. */
		level: "error" | "warning" | "policy" | "info";
		/** Qué es, como código estable. */
		code: string;
		/** Qué es, en palabras. */
		message: string;
	}[];
	/** Para un empleado, cómo irá en su recibo de nómina (o null). */
	payroll: {
		/** Viáticos exentos comprobados (OtroPago/Percepción 050, ImporteExento). */
		exempt: number;
		/** Lo que grava como sueldo (050, ImporteGravado): lo gastado sin comprobar. */
		taxed: number;
		/** Lo que se descuenta (deducción 081) por lo que ya se le dio y sobró. */
		adjustment: number;
		/** Lo que neto cobra o paga en el recibo por esta comprobación. */
		net: number;
	} | null;
	/** Sus gastos. */
	items: ExpenseItem[];
	/** El dinero que se le dio o devolvió. */
	movements: ExpenseMovement[];
	/** Cuándo se abrió. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** La política de viáticos y gastos del emisor: topes por categoría, hasta cuánto sin factura y en cuántos días se comprueba. */
export interface ExpensePolicy {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "expense_policy";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** Topes por categoría (hospedaje, alimentos…): las que no están no tienen tope. */
	limits: Record<string, {
		domestic: number | null;
		abroad: number | null;
		per: "dia" | "gasto";
	}>;
	/** Hasta cuánto se acepta un gasto sin factura; 0: todos la piden. */
	ticket_limit: number;
	/** Días después del regreso para comprobar. */
	due_days: number;
	/** true si pide una nota en cada gasto que pase un tope. */
	note_over_limit: boolean;
	/** true si avisa por correo a quien aprueba. */
	notify_approvers: boolean;
	/** true si avisa a la persona cuando se aprueba, se devuelve o se le paga. */
	notify_people: boolean;
	/** Cómo se suben los tickets y recibos: image (foto), pdf o los dos. El XML de una factura siempre se acepta. */
	receipt_formats: ("image" | "pdf")[];
}

/** Un almacén del emisor: el de la Matriz y uno por sucursal se crean solos; cada factura saca existencias del de su sucursal. */
export interface Warehouse {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "warehouse";
	/** El emisor del almacén. */
	issuer: string;
	/** Su nombre («Matriz», el de su sucursal, o el que le dieron en la app). */
	name: string;
	/** Su clave corta, o null. */
	code: string | null;
	/** warehouse (almacén propio) o consignment (mercancía en consignación con un cliente, todavía suya). */
	type: "warehouse" | "consignment";
	/** Su sucursal (brn_…), o null si es de la Matriz. */
	branch: string | null;
	/** true si es el almacén del que vende y recibe su sucursal. */
	default: boolean;
	/** true si está archivado. */
	archived: boolean;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Lo que hay de un producto en un almacén, y lo que vale. */
export interface StockLevel {
	/** Su id (stl_…): el producto en ese almacén. Sirve como starting_after. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "stock_level";
	/** El producto (prd_…). */
	product: string;
	/** El almacén (whs_…). */
	warehouse: string;
	/** Lo que hay, en la unidad del producto (todos sus lotes). */
	on_hand: number;
	/** Lo apartado por cotizaciones aceptadas que no se han facturado. */
	reserved: number;
	/** on_hand menos reserved: lo que se puede vender. */
	available: number;
	/** Lo que valen esas existencias a su costo, en pesos sin IVA. */
	value: number;
	/** value / on_hand: el costo por unidad, o null sin existencias. */
	average_cost: number | null;
}

/** Una entrada o salida de existencias (el kárdex): una venta, una compra, un ajuste, un traspaso… */
export interface StockMovement {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "stock_movement";
	/** El emisor. */
	issuer: string;
	/** El producto (prd_…). */
	product: string;
	/** El almacén (whs_…). */
	warehouse: string;
	/** sale (una factura), purchase (una compra), customer_return, supplier_return, adjustment, count (conteo físico), transfer_out, transfer_in, production_consumption (un componente que salió a producción), production_output (lo producido), initial, cost (un ajuste de costo) o reversal (deshace otro, como una factura cancelada). */
	type: "sale" | "purchase" | "customer_return" | "supplier_return" | "adjustment" | "count" | "transfer_out" | "transfer_in" | "production_consumption" | "production_output" | "initial" | "cost" | "reversal";
	/** Cuánto entró (positivo) o salió (negativo). */
	quantity: number;
	/** El costo por unidad con que entró o salió, en pesos sin IVA. */
	unit_cost: number;
	/** quantity × unit_cost: lo que cambió el valor del inventario. */
	value: number;
	/** El lote o número de serie, o null. */
	lot: string | null;
	/** Lo que lo causó: type invoice (id es el UUID del CFDI), adjustment (adj_…), production (mfo_…), receipt, transfer, count o ticket. */
	source: {
		/** Qué lo movió: invoice (una factura; id es su UUID), adjustment (un ajuste, adj_…), production (una orden de producción, mfo_…), count (un conteo) u otro origen. */
		type: string;
		/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
		id: string;
	};
	/** El motivo de un ajuste, o null. */
	reason: string | null;
	/** Cuándo pasó, hora de la Ciudad de México (la Fecha del CFDI en una venta). */
	date: string | null;
	/** true si un movimiento posterior lo deshizo. */
	reversed: boolean;
	/** Cuándo se registró. */
	created_at: string | null;
}

/** Un ajuste de existencias: lo que entró o salió de un almacén por inventario inicial, merma, robo, conteo… */
export interface StockAdjustment {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "stock_adjustment";
	/** El emisor. */
	issuer: string;
	/** El almacén (whs_…). */
	warehouse: string;
	/** El motivo (ver POST /v1/stock_adjustments). */
	reason: "shrinkage" | "theft" | "damage" | "expiration" | "internal_use" | "gift" | "initial" | "surplus" | "count" | "other";
	/** Su nota, o null. */
	note: string | null;
	/** applied (ya movió existencias), pending (espera aprobación en la app), rejected o reversed (se deshizo). */
	status: "applied" | "pending" | "rejected" | "reversed";
	/** Lo que vale lo que movió, en pesos sin IVA. */
	value: number;
	/** Lo que entró o salió de cada producto. */
	lines: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
		/** El costo por unidad que se dio al ajuste, en pesos sin IVA, o null (el costo promedio). */
		unit_cost: number | null;
		/** Lote del medicamento (LoteMedicamento). */
		lot: string | null;
	}[];
	/** Cuándo se hizo. */
	created_at: string | null;
}

/** Una orden de producción: los componentes de la receta salen de un almacén y lo producido entra a otro a su costo real. */
export interface ProductionOrder {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "production_order";
	/** El emisor. */
	issuer: string;
	/** Su folio, como OP-12. */
	number: string;
	/** draft (borrador, nada se ha movido), in_process (los componentes ya salieron), completed (lo producido ya entró) o cancelled (todo regresó). */
	status: "draft" | "in_process" | "completed" | "cancelled";
	/** Lo que se produce (prd_…). */
	product: string;
	/** Cuántas unidades se planearon. */
	quantity: number;
	/** Cuántas salieron de verdad, o null si no ha terminado. */
	quantity_made: number | null;
	/** El almacén de donde salen los componentes (whs_…). */
	warehouse: string;
	/** El almacén al que entra lo producido (whs_…). */
	destination_warehouse: string;
	/** El lote de lo producido, o null. */
	lot: string | null;
	/** Para cuándo (AAAA-MM-DD), o null. */
	due_date: string | null;
	/** Su nota, o null. */
	note: string | null;
	/** Lo que lleva, de la receta para quantity con su merma: quantity lo planeado, quantity_used lo que salió y value lo que costó (pesos sin IVA). tracks_stock false es un servicio: solo suma su costo. */
	components: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
		/** Lo que de verdad salió de ese componente, o null antes de iniciar la orden. */
		quantity_used: number | null;
		/** true si lleva existencias; false es un servicio, que solo suma su costo. */
		tracks_stock: boolean;
		/** Valor de la mercancía (ValorMercancia); obligatorio en transporte aéreo. */
		value: number | null;
	}[];
	/** Mano de obra, gas, empaque…: se suman al costo de lo producido. */
	other_costs: {
		/** Descripción. */
		description: string;
		/** Importe. */
		amount: number;
	}[];
	/** Lo que costaron los componentes que salieron, o null antes de iniciar. */
	materials_cost: number | null;
	/** (materials_cost + other_costs) ÷ quantity_made: el costo con que entró cada unidad, o null si no ha terminado. */
	unit_cost: number | null;
	/** Cuándo se hizo. */
	created_at: string | null;
	/** Cuándo salieron los componentes, o null. */
	started_at: string | null;
	/** Cuándo entró lo producido, o null. */
	completed_at: string | null;
	/** Cuándo se canceló, o null. */
	cancelled_at: string | null;
}

/** La opinión de cumplimiento de obligaciones fiscales (32-D) más reciente del emisor, como la dio el SAT. */
export interface ComplianceOpinion {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "compliance_opinion";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** positive, negative, no_obligations (inscrito sin obligaciones) o suspended (en suspensión de actividades); null si no se ha consultado. */
	result: "positive" | "negative" | "no_obligations" | "suspended" | null;
	/** El día que la emitió el SAT (AAAA-MM-DD), o null. */
	date: string | null;
	/** Su folio, o null. */
	folio: string | null;
	/** Si es negativa, lo que el SAT marca como pendiente. */
	reasons: string[];
	/** true si su PDF está en GET /v1/issuers/{id}/compliance_opinion/pdf. */
	pdf: boolean;
	/** Cuándo se consultó por última vez, o null. */
	checked_at: string | null;
	/** Por qué falló la última consulta, o null. */
	last_error: string | null;
}

/** La constancia de situación fiscal más reciente del emisor, generada en el SAT con su e.firma. */
export interface TaxStatusCertificate {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "tax_status_certificate";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El día que la emitió el SAT (AAAA-MM-DD), o null. */
	issued_on: string | null;
	/** Su idCIF, o null. */
	id_cif: string | null;
	/** El RFC. */
	tax_id: string;
	/** Nombre o razón social como la tiene el SAT, o null. */
	legal_name: string | null;
	/** Sus regímenes fiscales (clave de c_RegimenFiscal y nombre). */
	tax_systems: {
		/** Clave del régimen fiscal (c_RegimenFiscal): 601, 612, 626… */
		code: string;
		/** Nombre del régimen fiscal, como lo escribe el SAT. */
		name: string;
	}[];
	/** El código postal de su domicilio fiscal, o null. */
	zip: string | null;
	/** Estatus en el padrón (ACTIVO, SUSPENDIDO…), o null. */
	status: string | null;
	/** true si su PDF está en GET /v1/issuers/{id}/tax_status_certificate/pdf. */
	pdf: boolean;
	/** Cuándo se generó. */
	created_at: string | null;
}

/** Un aviso del buzón tributario del SAT del emisor. */
export interface SatMailboxMessage {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_mailbox_message";
	/** El emisor. */
	issuer: string;
	/** Su asunto. */
	subject: string;
	/** Su texto, resumido, o null. */
	summary: string | null;
	/** mailbox (el buzón del portal) o email (un aviso que el SAT mandó por correo). */
	source: "mailbox" | "email";
	/** true si no se ha leído en el SAT. */
	unread: boolean;
	/** urgent (un requerimiento, un plazo), attention o informational. */
	urgency: "urgent" | "attention" | "informational";
	/** Qué es: requerimiento, carta invitación, informativo… */
	kind: string;
	/** true si pide hacer algo. */
	action_required: boolean;
	/** Cuándo llegó, como lo dice el SAT. */
	received_at: string | null;
	/** Cuándo lo trajo Fiscalisto. */
	created_at: string | null;
}

/** Una consulta al SAT de las declaraciones o de un documento del emisor (opinión de cumplimiento, constancia o buzón): se contesta al aceptarla (status processing) y termina sola; sat_refresh.completed o sat_refresh.failed dicen cómo. */
export interface SatRefresh {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_refresh";
	/** El id de la consulta (srf_…): GET /v1/sat_refreshes/{id} dice cómo va. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** Qué se consultó: declarations, compliance_opinion, tax_status_certificate o sat_mailbox. */
	document: "declarations" | "compliance_opinion" | "tax_status_certificate" | "sat_mailbox";
	/** processing (el SAT se está consultando), completed (lo que trajo está en url) o failed (el SAT no contestó: motivo en error, el timbre regresó). */
	status: "processing" | "completed" | "failed";
	/** Lo que trajo, con status completed: en declarations cuántas listó y bajó; en los demás, dónde leer el documento. null mientras sigue o si falló. */
	result: {
		/** Cuántas declaraciones listó el SAT en los años consultados. */
		found: number;
		/** Cuántos archivos bajó. */
		downloaded: number;
		/** Cuántas declaraciones quedan con archivos por bajar: siguen solas en la siguiente hora, sin otro timbre. */
		pending: number;
		/** Si una parte del SAT falló (por ejemplo, la anual), lo que dijo; lo demás sí se trajo. */
		warning: string | null;
		/** Con pending: cuándo deberían estar los archivos y las cifras que faltan. Mientras, GET /v1/sat_declarations ya las lista, con figures_status pending. */
		completes_at: string | null;
	} | {
		/** Dónde leer el documento. */
		url: string;
	} | null;
	/** Con status failed: lo que dijo el SAT. null en los demás. */
	error: string | null;
	/** true cuando se usó su timbre (el SAT contestó). En pruebas siempre false: no se usan timbres. */
	charged: boolean;
	/** true mientras sigue: su timbre está apartado (GET /v1/balance ya no lo cuenta) y regresa si el SAT no contesta. */
	timbre_held: boolean;
	/** Cuándo se pidió. */
	created_at: string;
	/** Cuándo terminó (completed o failed). null mientras sigue. */
	completed_at: string | null;
	/** Cuándo se pidió (igual que created_at). */
	refreshed_at: string;
	/** Desde cuándo se puede pedir otra vez para el mismo emisor (10 minutos después). */
	next_refresh_at: string;
	/** Dónde leer lo que trajo. */
	url: string;
}

/** Un tipo de hallazgo en los CFDI del emisor (un proveedor en la lista 69-B, un CFDI cancelado, un pago en efectivo de más de $2,000…), con cuántos CFDI lo tienen. */
export interface SatFinding {
	/** El código del hallazgo (el mismo que code). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_finding";
	/** El emisor. */
	issuer: string;
	/** El código del hallazgo, estable (por ejemplo efos_definitivo). */
	code: string;
	/** critical (grave), warning (revisar) o info. */
	severity: "critical" | "warning" | "info";
	/** Qué es, en palabras. */
	title: string;
	/** Por qué importa y qué hacer, o null. */
	explanation: string | null;
	/** Qué hacer con este hallazgo, en una frase o dos. */
	next_step: string;
	/** Cuántos CFDI lo tienen, sin revisar. */
	invoices: number;
	/** De cuántos proveedores o clientes son esos CFDI. */
	counterparties: number;
	/** La suma de sus totales, en pesos (los de otra moneda, a su tipo de cambio). */
	amount: number;
	/** La fecha del CFDI más reciente que lo tiene (AAAA-MM-DD). */
	last_date: string | null;
}

/** Un proveedor o cliente con hallazgos sin revisar en los CFDI del emisor: cuántos CFDI, cuánto suman y qué tipos de hallazgo tiene. */
export interface SatFindingCounterparty {
	/** Su RFC (el mismo que rfc). Sirve como starting_after. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sat_finding_counterparty";
	/** El emisor. */
	issuer: string;
	/** El RFC del proveedor (en recibidos) o del cliente (en emitidos). */
	rfc: string;
	/** Su nombre como viene en el CFDI, o null. */
	name: string | null;
	/** Su hallazgo más grave: critical, warning o info. */
	severity: "critical" | "warning" | "info";
	/** Cuántos de sus CFDI tienen algún hallazgo sin revisar. */
	invoices: number;
	/** La suma de los totales de esos CFDI, en pesos, cada uno una vez aunque tenga varios hallazgos. */
	amount: number;
	/** La fecha del más reciente de esos CFDI (AAAA-MM-DD). */
	last_date: string | null;
	/** Sus tipos de hallazgo, del más grave al más leve. */
	findings: {
		/** El código del hallazgo (el code de GET /v1/sat_findings). */
		code: string;
		/** critical (grave), warning (revisar) o info. */
		severity: "critical" | "warning" | "info";
		/** Qué es, en palabras. */
		title: string;
		/** En cuántos de sus CFDI está, sin revisar. */
		invoices: number;
		/** Qué hacer con este hallazgo, en una frase o dos. */
		next_step: string;
	}[];
}

/** El Reporte de la empresa de un emisor en un periodo: su salud fiscal, sus indicadores de riesgo, sus años, sus clientes y proveedores, sus socios y los avisos de sus contrapartes. */
export interface CompanyReport {
	/** Siempre company_report. */
	object: "company_report";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Su RFC. */
	tax_id: string;
	/** Su razón social, o null si Fiscalisto no la conoce. */
	name: string | null;
	/** El primer día del periodo (AAAA-MM-DD). */
	date_gte: string;
	/** El último día del periodo (AAAA-MM-DD), hoy a lo más. */
	date_lte: string;
	/** full: todo; executive: los indicadores principales y 5 clientes y proveedores. */
	version: "full" | "executive";
	/** La salud fiscal: una calificación de 0 a 1,000 que explica cada punto. */
	fiscal_health: {
		/** De 0 a 1,000; null si ningún factor tuvo datos. */
		score: number | null;
		/** attention (menos de 250), fair (250 a 499), good (500 a 749) o excellent (750 o más). */
		band: "attention" | "fair" | "good" | "excellent" | null;
		/** Factores con datos. */
		factors_used: number;
		/** Todos los factores. */
		factors_total: number;
		/** Cada factor, con su razón. */
		factors: {
			/** cumplimiento, listas, declaraciones, contrapartes, cancelaciones, concentracion, cobranza, buzon o crecimiento. */
			key: string;
			/** Su nombre, como en la app. */
			label: string;
			/** Los puntos que puede dar. */
			max_points: number;
			/** Los que dio; null sin datos (no cuenta en la calificación). */
			points: number | null;
			/** Por qué dio esos puntos. */
			reason: string;
			/** Qué daría los que faltan, o null si dio todos. */
			to_improve: string | null;
		}[];
	};
	/** Los indicadores de riesgo, cada uno contra su umbral. */
	indicators: {
		/** El indicador (el de PATCH del umbral en la app). */
		key: string;
		/** Su nombre, como en la app. */
		label: string;
		/** ok, risk (pasa el umbral) o no_data. */
		state: "ok" | "risk" | "no_data";
		/** La cifra: por ciento 0 a 100, HHI, cuántos, pesos o días; null sin datos. */
		value: number | null;
		/** La cifra en palabras («HHI 1,954», «3 %»). */
		display: string;
		/** Desde dónde se marca en riesgo. */
		threshold: number | null;
		/** El umbral es el que puso la empresa, no el de Fiscalisto. */
		custom_threshold: boolean;
	}[];
	/** Los años lado a lado: este y al menos los dos anteriores. */
	years: {
		/** Año (Ejercicio). */
		year: number;
		/** El año en curso, hasta hoy. */
		partial: boolean;
		/** Ingresos facturados sin impuestos, no cancelados. */
		income: number;
		/** Ingresos facturados y cancelados. */
		income_cancelled: number;
		/** Por ciento de ingresos en PUE. */
		cash_share: number | null;
		/** Por ciento de ingresos en PPD. */
		credit_share: number | null;
		/** Por ciento de lo PPD ya cobrado (con complemento). */
		collected_share: number | null;
		/** Días promedio (ponderados) de la factura al cobro. */
		days_to_collect: number | null;
		/** Gastos recibidos sin impuestos, no cancelados. */
		expenses: number;
		/** Gastos recibidos y cancelados. */
		expenses_cancelled: number;
		/** Por ciento de lo PPD ya pagado. */
		paid_share: number | null;
		/** Días promedio de la factura al pago. */
		days_to_pay: number | null;
		/** Nómina que timbró: lo que percibieron sus trabajadores, antes de deducciones. */
		payroll_paid: number;
		/** Sueldos que recibió de sus patrones (recibos de nómina a su RFC), antes de deducciones: lo que gana una persona física asalariada. */
		payroll_received: number;
		/** Lo que de verdad recibió de esos sueldos: el total de los recibos, después del ISR retenido y las deducciones. */
		payroll_received_net: number;
		/** Ingresos menos gastos y nómina. */
		profit: number;
		/** Lo que queda, por ciento de ingresos. */
		margin: number | null;
	}[];
	/** Totales del periodo, en pesos. */
	totals: {
		/** Ingresos del periodo, netos de notas de crédito. */
		income: number;
		/** Gastos del periodo, netos de notas de crédito. */
		expenses: number;
		/** Lo que le deben sus clientes del periodo. */
		receivable: number;
		/** Lo que debe a sus proveedores del periodo. */
		payable: number;
	};
	/** Sus clientes del periodo. */
	customers: {
		/** Cuántos hay en el periodo. */
		count: number;
		/** Su concentración (índice Herfindahl-Hirschman, 0 a 10,000; más de 1,500 es concentrado), sin el público en general. */
		hhi: number | null;
		/** Por ciento del total que suman los 10 principales, sin el público en general. */
		top10_share: number | null;
		/** Los principales, de mayor a menor: 15, o 5 en executive. */
		parties: {
			/** Su RFC. XAXX010101000 y XEXX010101000 son una sola fila cada uno («Público en general», «Residentes en el extranjero») con todas las personas que facturaron con ese RFC. */
			tax_id: string;
			/** Nombre. */
			name: string | null;
			/** Lo facturado en el periodo, sin impuestos. */
			total: number;
			/** Por ciento del total. */
			share: number;
			/** Cuántas facturas del periodo. */
			invoices: number;
			/** Lo pendiente de cobrar o pagar. */
			balance: number;
		}[];
	};
	/** Sus proveedores del periodo. */
	suppliers: {
		/** Cuántos hay en el periodo. */
		count: number;
		/** Su concentración (índice Herfindahl-Hirschman, 0 a 10,000; más de 1,500 es concentrado), sin el público en general. */
		hhi: number | null;
		/** Por ciento del total que suman los 10 principales, sin el público en general. */
		top10_share: number | null;
		/** Los principales, de mayor a menor: 15, o 5 en executive. */
		parties: {
			/** Su RFC. XAXX010101000 y XEXX010101000 son una sola fila cada uno («Público en general», «Residentes en el extranjero») con todas las personas que facturaron con ese RFC. */
			tax_id: string;
			/** Nombre. */
			name: string | null;
			/** Lo facturado en el periodo, sin impuestos. */
			total: number;
			/** Por ciento del total. */
			share: number;
			/** Cuántas facturas del periodo. */
			invoices: number;
			/** Lo pendiente de cobrar o pagar. */
			balance: number;
		}[];
	};
	/** De los CFDI de retenciones por dividendos (clave 14), hasta 20 de cada lado; null en executive. */
	shareholders: {
		/** A quién pagó dividendos: sus socios. */
		paid_to: {
			/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
			tax_id: string;
			/** Nombre. */
			name: string | null;
			/** Los dividendos de sus CFDI de retenciones, en pesos. */
			total: number;
			/** El día del más reciente. */
			last_date: string;
			/** Cuántos CFDI de retenciones. */
			retentions: number;
		}[];
		/** Quién le pagó dividendos: dónde tiene acciones. */
		received_from: {
			/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
			tax_id: string;
			/** Nombre. */
			name: string | null;
			/** Los dividendos de sus CFDI de retenciones, en pesos. */
			total: number;
			/** El día del más reciente. */
			last_date: string;
			/** Cuántos CFDI de retenciones. */
			retentions: number;
		}[];
	} | null;
	/** Clientes y proveedores que publicaron en los últimos 13 meses su liquidación, fusión, escisión, transformación o reducción de capital en las Publicaciones de Sociedades Mercantiles de la Secretaría de Economía; null en executive. */
	counterparty_notices: {
		/** El RFC del cliente o proveedor. */
		tax_id: string;
		/** Su nombre en sus facturas. */
		name: string | null;
		/** customer (cliente) o supplier (proveedor). */
		side: "customer" | "supplier";
		/** Qué publicó («Aviso de liquidación», «Fusión»…). */
		type: string;
		/** Su grupo de publicaciones. */
		group: string | null;
		/** El día que se publicó (AAAA-MM-DD). */
		date: string;
		/** Su número de publicación. */
		number: string;
		/** Su PDF, cuando ya se conoce. */
		pdf_url: string | null;
	}[] | null;
}

/** Un proveedor del emisor en el periodo: cuánto le facturó, cuánto de eso tiene su evidencia completa (acuerdo, entrega y pago) y, si está en la lista 69-B, su plazo. */
export interface MaterialitySupplier {
	/** Su RFC (el mismo que tax_id). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "materiality_supplier";
	/** El emisor que recibió sus facturas. */
	issuer: string;
	/** El RFC del proveedor. */
	tax_id: string;
	/** Su nombre como viene en el CFDI, o null. */
	name: string | null;
	/** Cuántas facturas recibidas (ingresos, no canceladas) le dio en el periodo. */
	invoices: number;
	/** Lo que suman, en pesos (las de otra moneda, a su tipo de cambio). */
	total: number;
	/** Lo que suman las que no tienen su evidencia completa, en pesos. */
	unproven: number;
	/** Cuántas facturas están complete (acuerdo, entrega y pago), partial (alguna) y none (ninguna). */
	states: {
		/** Facturas con acuerdo, entrega y pago. */
		complete: number;
		/** Facturas con alguna de las tres pruebas, no todas. */
		partial: number;
		/** Facturas sin ninguna prueba. */
		none: number;
	};
	/** A cuántas facturas les falta el acuerdo, la entrega y el pago. */
	missing: {
		/** Facturas sin acuerdo (contrato u orden de compra). */
		agreement: number;
		/** Facturas sin entrega (recepción, entregables o fotos). */
		delivery: number;
		/** Facturas sin pago (complemento, pago en el portal o en la orden, banco o comprobante). */
		payment: number;
	};
	/** Si está en la lista 69-B: definitive (definitivo) o presumed (presunto); en definitivo, el día que se publicó, el último día de los 30 días hábiles para acreditar las operaciones o corregir y cuántos días hábiles quedan (negativo: ya venció). null: no está. */
	sat_list: {
		/** definitive (69-B definitivo) o presumed (69-B presunto). */
		status: "definitive" | "presumed";
		/** El día que el SAT lo publicó como definitivo (AAAA-MM-DD), o null. */
		published_on: string | null;
		/** El último de los 30 días hábiles para acreditar las operaciones o corregir (AAAA-MM-DD), o null. */
		deadline: string | null;
		/** Días hábiles que quedan, sin contar hoy; negativo si ya venció. null si no es definitivo. */
		business_days_left: number | null;
	} | null;
	/** Si está en el Portal de proveedores del emisor (para pedirle la evidencia desde la app). */
	in_supplier_portal: boolean;
	/** Cuándo se le pidió evidencia que todavía no manda, o null. */
	evidence_requested_at: string | null;
}

/** Una factura recibida (ingreso) con lo que prueba que la operación existió: qué tiene, qué le falta y de dónde salió cada evidencia. */
export interface MaterialityInvoice {
	/** El UUID de la factura (el mismo que uuid). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "materiality_invoice";
	/** El emisor que la recibió. */
	issuer: string;
	/** El folio fiscal (UUID). */
	uuid: string;
	/** Su serie, o null. */
	series: string | null;
	/** Su folio, o null. */
	folio: string | null;
	/** Su fecha (AAAA-MM-DD). */
	date: string;
	/** El RFC del proveedor que la emitió. */
	supplier_tax_id: string;
	/** Su nombre como viene en el CFDI, o null. */
	supplier_name: string | null;
	/** Su total en pesos (de otra moneda, a su tipo de cambio). */
	total: number;
	/** complete (tiene acuerdo, entrega y pago), partial (alguno) o none (ninguno). */
	state: "complete" | "partial" | "none";
	/** Lo que ya tiene: agreement (contrato u orden de compra), delivery (recepción, entregables o fotos), payment (complemento, pago en el portal o en la orden, banco o comprobante). */
	has: ("agreement" | "delivery" | "payment")[];
	/** Lo que le falta, de lo mismo. */
	missing: ("agreement" | "delivery" | "payment")[];
	/** De dónde salió cada evidencia: source es un código estable (orden_compra, recepcion, complemento_pago, pago_banco, foto, mensaje_portal…), proves lo que prueba (null: respaldo que no prueba nada solo) y label lo dice en palabras. */
	evidence: {
		/** De dónde salió: orden_compra, recepcion, complemento_pago, pago_banco, foto, mensaje_portal… */
		source: string;
		/** Lo que prueba: agreement, delivery o payment; null si solo respalda. */
		proves: "agreement" | "delivery" | "payment" | null;
		/** De dónde salió, en palabras. */
		label: string;
	}[];
}

/** Una venta que su comprador puede facturar él mismo en el portal del emisor (autofactura). */
export interface Ticket {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** La página del portal con el código (c) y el total (t) del ticket: el portal lo encuentra solo y el comprador solo da sus datos. Quien tenga la liga puede facturar el ticket: désela solo al comprador (como el ticket impreso). Puede incrustarla con fiscalisto.js. null si ya no está pendiente. */
	url: string | null;
	/** Lo que se cobró, impuestos incluidos y sin propina. */
	total: number;
	/** La propina (no va en la factura). */
	tip: number;
	/** c_FormaPago de la venta. */
	payment_form: string;
	/** El concepto de la factura (el primero, si lleva varios). */
	description: string;
	/** c_ClaveProdServ del concepto (el primero, si lleva varios). */
	product_key: string;
	/** Sus conceptos, en orden: uno solo si se registró sin lines. Cada uno con su producto (prd_… o null), descripción, claves del SAT, IVA (null si no es objeto de impuesto), unidades y lo que se cobró por él, impuestos incluidos. */
	lines: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product: string | null;
		/** Descripción. */
		description: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
		unit_key: string;
		/** Tasa de IVA trasladado: 0.16 (por omisión), 0.08 (región fronteriza), 0 o exento. */
		iva: string | null;
		/** Sus impuestos locales (los de su producto o los que mandó), incluidos en su total. */
		local_taxes: {
			/** true si es una retención local; false si es un traslado. */
			retention: boolean;
			/** Nombre del impuesto local (ImpLocTrasladado o ImpLocRetenido), como ISH. */
			name: string;
			/** Tasa en por ciento (TasadeTraslado o TasadeRetencion). */
			rate: number;
		}[];
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
		/** Total en la moneda del comprobante (Total). */
		total: number;
	}[];
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
	/** La sucursal (brn_…) donde se hizo la venta, o null (la Matriz). Su factura se timbra desde ahí y el portal muestra su nombre y su logo. */
	branch: string | null;
	/** Quién pagó, como lo conoce el origen de la venta (el `buyer` que mandó, o el cliente de un pago de Stripe). No es el receptor de la factura (`customer`). */
	buyer: {
		/** Nombre. */
		name: string | null;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email: string | null;
	} | null;
	/** Cuándo se registró. */
	created_at: string | null;
}

/** Cómo se ve el portal además de su tema, color y esquinas (Autofactura › Cómo se ve el portal). */
export interface PortalStyle {
	/** checkout: la factura se llena junto al formulario. compact: solo el formulario, la factura plegada. card: el formulario en una tarjeta al centro. */
	layout: "checkout" | "compact" | "card";
	/** comfortable o compact. */
	density: "comfortable" | "compact";
	/** Qué dice arriba: name_rfc, name, logo_name o logo. */
	header: "logo" | "name" | "name_rfc" | "logo_name";
	/** El tamaño del logo: s, m o l. */
	logo_size: "s" | "m" | "l";
	/** La forma del logo: square, rounded o circle. */
	logo_shape: "square" | "rounded" | "circle";
	/** La letra: system o una de Google Fonts. */
	font: string;
	/** La letra de los títulos, o null para la misma del texto. */
	heading_font: string | null;
	/** El tamaño del título: s, m o l. */
	heading_size: "s" | "m" | "l";
	/** Los bordes: none, subtle o strong. */
	borders: "none" | "subtle" | "strong";
	/** La sombra: none, soft o strong. */
	shadow: "none" | "soft" | "strong";
	/** Las formas de dar sus datos además de escribirlos. */
	ways: {
		/** Subir la constancia (PDF). */
		constancia: boolean;
		/** Escanear el QR de la constancia. */
		qr: boolean;
		/** Buscar los datos con RFC e idCIF. */
		cif: boolean;
		/** «Ya le hemos facturado antes»: RFC y correo. */
		recall: boolean;
		/** Facturar a clientes en el extranjero. */
		abroad: boolean;
		/** «No tengo RFC»: a nombre de la persona, con XAXX010101000. */
		norfc: boolean;
	};
	/** Si no se factura sin correo. */
	email_required: boolean;
	/** Si dice hasta cuándo se puede facturar. */
	show_deadline: boolean;
	/** El botón al terminar para volver a su sitio, o null. */
	back: {
		/** El texto del botón. */
		label: string;
		/** A dónde lleva (https). */
		url: string;
	} | null;
	/** CSS propio, ya limpio. */
	css: string;
	/** Los colores de la página; null usa el del tema. */
	colors: {
		/** El fondo de la página, o null. */
		background: string | null;
		/** El fondo de los campos y tarjetas, o null. */
		card: string | null;
		/** El texto, o null. */
		text: string | null;
		/** El texto de los botones, o null. */
		button_text: string | null;
	};
	/** Cómo llama el portal a lo que se factura («reservacion» en un hotel). */
	noun: "ticket" | "nota" | "cuenta" | "compra" | "pedido" | "orden" | "reservacion" | "estancia" | "boleto";
	/** Los textos propios por llave (step_ticket, submit, success_title, concepts_title…), cada uno con es y en. Uno que falta lleva el de Fiscalisto. */
	texts: Record<string, {
		es?: string;
		en?: string;
	}>;
}

/** Los conceptos de la factura que se hace el comprador en el portal. */
export interface InvoiceConcepts {
	/** itemized: un concepto por renglón del ticket; single: uno solo; grouped: uno por cada grupo de groups. Lo que lleva otro juego de impuestos (como una noche con ISH) va siempre en su propio concepto. */
	mode: "itemized" | "single" | "grouped";
	/** Si el comprador puede elegir en el portal entre las opciones de customer_options. */
	customer_choice: boolean;
	/** Las opciones que ve el comprador cuando puede elegir (incluye siempre mode, que llega elegida). */
	customer_options: ("itemized" | "single" | "grouped")[];
	/** La descripción del concepto único, como «Consumo». */
	description: string;
	/** La ClaveProdServ del concepto único, o null para la del renglón más grande. */
	product_key: string | null;
	/** Su ClaveUnidad, o null para la del renglón más grande. */
	unit_key: string | null;
	/** Los grupos de «Por categoría», en orden: cada renglón va en el primero que lo tome. */
	groups: {
		/** El nombre del concepto, como «Alimentos y bebidas». */
		name: string;
		/** Su ClaveProdServ, o null para la del renglón más grande del grupo. */
		product_key: string | null;
		/** Su ClaveUnidad, o null para la del renglón más grande. */
		unit_key: string | null;
		/** Las claves del SAT que toma, completas o su inicio (de 2 a 8 dígitos, como 9010). */
		sat_keys: string[];
		/** Las categorías de producto que toma, por su ruta («Hotel › Habitaciones»); una categoría toma también las de adentro. */
		categories: string[];
	}[];
	/** Lo que ningún grupo toma: itemized, desglosado; group, en un concepto más llamado ungrouped_name. */
	ungrouped: "itemized" | "group";
	/** El nombre del concepto para lo que ningún grupo toma. */
	ungrouped_name: string;
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
	/** auto: los tickets que nadie facturó van solos a la factura global de su periodo. off: Fiscalisto no hace factura global de estos tickets (la hace usted en otro lado). */
	global_invoice: "auto" | "off";
	/** Si el portal pide el total para encontrar el ticket (true) o solo su código (false). */
	ask_total: boolean;
	/** El título del portal, o null para «Facture su ticket». */
	portal_title: string | null;
	/** El mensaje bajo el título, o null. */
	portal_message: string | null;
	/** Dónde encuentra el comprador su código, bajo el campo; null para el texto de Fiscalisto. */
	code_hint: string | null;
	/** auto: el tema del dispositivo del comprador, que puede cambiarlo. light o dark: siempre ese, en la página del portal, sus QR y dentro de su sitio. */
	portal_theme: "auto" | "light" | "dark";
	/** El color de los botones del portal («#rrggbb»), o null para el de Fiscalisto. */
	portal_accent: string | null;
	/** Las esquinas del portal en píxeles (0 a 24), o null para las de Fiscalisto. */
	portal_radius: number | null;
	/** Cómo se ve el portal además de su tema, color y esquinas: acomodo, encabezado, colores, letra, textos, formas de dar los datos, botón para volver y CSS. */
	portal_style: PortalStyle;
	/** Desglosados, en un solo concepto o por los grupos de la empresa, y qué puede elegir el comprador (Autofactura › Conceptos de la factura). */
	invoice_concepts: InvoiceConcepts;
	/** Cuando se factura una persona moral que retiene (1.25% de ISR en RESICO, o lo del producto). keep_total: la base crece y la factura suma lo que se pagó. subtract: la base es la del ticket y el total es lo pagado menos la retención. */
	retention_mode: "keep_total" | "subtract";
	/** La serie de las facturas que se emiten desde el portal y desde un ticket, como AF, o null para la serie de facturas del emisor. La factura global no la usa. */
	invoice_series: string | null;
	/** true: el portal le pide al comprador una nota para el PDF de su factura (hasta 500 caracteres). Solo sale en el PDF, nunca en el XML. */
	customer_notes: boolean;
	/** ticket: la factura global lleva un concepto «Venta» por ticket, con su folio. summary: solo el monto total del periodo, uno por combinación de impuestos (NoIdentificacion «Resumen»), para una persona física en RESICO (regla 2.7.1.21 de la RMF 2026). */
	global_concepts: "ticket" | "summary";
}

/** Una factura que el emisor timbra solo, cada mes, semana o día. */
export interface RecurringInvoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
		unit_key?: string;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number;
	}[];
	/** El total de cada factura con los precios de hoy. */
	total: number | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Una póliza de diario (de un CFDI, un pago, un recibo de nómina o la depreciación del mes): sus cargos y abonos, que siempre cuadran. */
export interface JournalEntry {
	/** El número de la póliza: D-AAAAMM-NNNNN, en orden de fecha dentro del mes. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "journal_entry";
	/** El emisor. */
	issuer: string;
	/** De qué es: invoice (un CFDI de ingreso o egreso), payment_received o payment_made (un pago de un complemento), payroll (un recibo de nómina), employee_expenses (un anticipo, reembolso, devolución o comprobación de viáticos, contra 107.01 «Funcionarios y empleados»), depreciation (la depreciación del mes de los activos fijos), manual (una póliza capturada a mano, o la reversión de una provisión) o asset_disposal (la venta o baja de un activo fijo). */
	type: "invoice" | "payment_received" | "payment_made" | "payroll" | "employee_expenses" | "depreciation" | "manual" | "asset_disposal" | "bank_identification";
	/** Con type manual: la póliza capturada (mje_…), también en su reversión; null en las demás. */
	manual_entry: string | null;
	/** La fecha del CFDI o del pago; en la depreciación, el último día del mes. */
	date: string;
	/** El documento, su folio y la contraparte. */
	description: string;
	/** La factura (inv_…) si es la póliza de un CFDI que timbró este emisor; null en los demás casos. */
	invoice: string | null;
	/** El folio fiscal del CFDI (o del complemento de pago); null en la depreciación. */
	uuid: string | null;
	/** El RFC de la contraparte (cliente, proveedor o empleado); null en la depreciación. */
	tax_id: string | null;
	/** El total del documento, en su moneda. */
	total: number;
	/** La moneda del documento. */
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

/** Una póliza capturada a mano (ajuste, provisión, reclasificación): entra a las pólizas, la balanza, los estados financieros y la contabilidad electrónica de su mes. */
export interface ManualJournalEntry {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "manual_journal_entry";
	/** El emisor. */
	issuer: string;
	/** La fecha de la póliza. */
	date: string;
	/** Su concepto. */
	description: string;
	/** adjustment (ajuste), accrual (provisión), reclassification (reclasificación) u other. */
	kind: "adjustment" | "accrual" | "reclassification" | "other";
	/** El tipo de póliza: journal (diario), income (ingresos) o expense (egresos). */
	journal_type: "journal" | "income" | "expense";
	/** true: una provisión o un ajuste de cierre (como la revaluación cambiaria) que se revierte solo el día 1 del mes siguiente. */
	reverse_next_month: boolean;
	/** El día de su reversión, o null si no se revierte. */
	reverses_on: string | null;
	/** El último mes (AAAA-MM) en que se repite cada mes, o null si es de una sola fecha. */
	repeat_until: string | null;
	/** El UUID del CFDI con el que se relaciona, o null. */
	uuid: string | null;
	/** El RFC de la otra parte de ese CFDI, o null. */
	uuid_tax_id: string | null;
	/** La suma de sus cargos (igual a la de sus abonos). */
	total: number;
	/** Sus renglones: la cuenta y su cargo (debit) o abono (credit). */
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
		/** Su centro de costo (ccn_…), o null. */
		cost_center: string | null;
	}[];
	/** Cuándo se capturó. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** Un activo fijo del emisor en su contabilidad al cierre de un mes: su monto original, su depreciación en línea recta (tasas del artículo 34 de la LISR) y su valor en libros. */
export interface FixedAsset {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "fixed_asset";
	/** El emisor. */
	issuer: string;
	/** Qué es: lo capturado, o el emisor del CFDI. */
	description: string;
	/** cfdi (llegó con una factura recibida de uso I01 a I08) o manual (capturado sin factura). */
	source: "cfdi" | "manual";
	/** Su tipo por uso CFDI (I01 a I08), que da su tasa. */
	cfdi_use: string;
	/** El nombre de su tipo, por ejemplo «Equipo de cómputo». */
	class: string;
	/** El UUID de su CFDI, o null si se capturó. */
	uuid: string | null;
	/** Desde cuándo se usa: se deprecia desde el mes siguiente. */
	in_use_since: string;
	/** Su monto original sin IVA. */
	cost: number;
	/** Su tasa anual de depreciación (0.3 es 30%). */
	annual_rate: number;
	/** Lo que se deprecia cada mes mientras dura. */
	monthly_depreciation: number;
	/** El mes (AAAA-MM) a cuyo cierre van las cifras. */
	month: string;
	/** Lo que se depreció en ese mes. */
	month_depreciation: number;
	/** Lo depreciado hasta el cierre de ese mes. */
	accumulated_depreciation: number;
	/** Su valor en libros: el monto original menos lo depreciado; 0 después de su baja. */
	book_value: number;
	/** Su venta o baja (date, reason sale o write_off, note), o null si sigue en uso. */
	disposal: {
		/** El día de la venta o la baja. */
		date: string;
		/** sale (venta) o write_off (robo, pérdida, desecho). */
		reason: "sale" | "write_off";
		/** La nota que se dejó, o null. */
		note: string | null;
	} | null;
}

/** Un movimiento de banco que ninguna factura explica (un retiro, o un depósito clasificado como préstamo, traspaso o devolución) y su póliza de ingresos o egresos contra Bancos, cuando ya se registró. */
export interface AccountingBankMovement {
	/** btx_… para un depósito (el mismo de la conciliación) o bwd_… para un retiro. */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "accounting_bank_movement";
	/** El emisor. */
	issuer: string;
	/** deposit (depósito) o withdrawal (retiro). */
	direction: "deposit" | "withdrawal";
	/** El día del movimiento (AAAA-MM-DD), que es el de su póliza. */
	date: string;
	/** El texto del banco, como vino en el estado de cuenta. */
	description: string;
	/** La referencia o clave de rastreo, si la trae. */
	reference: string | null;
	/** El importe, en positivo. */
	amount: number;
	/** El banco del estado de cuenta. */
	bank: string;
	/** Los últimos 4 dígitos de la cuenta, si se sabe. */
	bank_account: string | null;
	/** Un depósito: lo que dijo la conciliación (loan, transfer o refund). null en un retiro. */
	classification: "loan" | "transfer" | "refund" | null;
	/** pending (por registrar), posted (con póliza), paid_invoices (pagó facturas que ya están en la contabilidad) o ignored (no se registra). */
	status: "pending" | "posted" | "paid_invoices" | "ignored";
	/** Su póliza (mje_…), que se ve y se corrige como cualquier póliza capturada, o null. */
	manual_entry: string | null;
	/** El número de la cuenta que va contra Bancos en su póliza, o null. */
	account: string | null;
	/** La cuenta que sugiere un movimiento anterior con el mismo texto registrado con remember, o null. */
	suggested_account: string | null;
}

/** Hasta qué mes está cerrada la contabilidad del emisor: lo capturado (pólizas a mano y de banco, bajas de activos, saldos iniciales) con fecha en un mes cerrado no se registra, corrige ni borra. */
export interface ClosedPeriod {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "closed_period";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El último mes cerrado (AAAA-MM), con todos los anteriores; null si ninguno está cerrado. */
	closed_through: string | null;
	/** Cuándo se cerró, o null. */
	closed_at: string | null;
}

/** La revaluación cambiaria de un mes (NIF B-15): las facturas PPD en otra moneda que seguían pendientes al cierre, lo que se debe por moneda con el tipo de cambio de cierre que sugerimos (el FIX del DOF) y la póliza de ajuste que registra la diferencia, si ya se registró. */
export interface FxRevaluation {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "fx_revaluation";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** El último día del mes: la fecha de la póliza. Su reversión es del día 1 del mes siguiente. */
	date: string;
	/** Cada moneda con saldos pendientes: receivable (lo que le deben sus clientes, en esa moneda), payable (lo que usted debe a sus proveedores), closing_rate (el FIX publicado en el DOF el día hábil siguiente al cierre, o null si no se pudo leer) y closing_rate_date (el día de esa publicación). */
	currencies: {
		/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
		currency: string;
		/** Lo que le deben sus clientes al cierre, en esa moneda. */
		receivable: number;
		/** Lo que usted debe a sus proveedores al cierre, en esa moneda. */
		payable: number;
		/** El tipo de cambio de cierre que sugerimos (pesos por unidad): el FIX publicado en el DOF el día hábil siguiente al cierre, o null si no se pudo leer. */
		closing_rate: number | null;
		/** El día en que se publicó ese FIX, o null. */
		closing_rate_date: string | null;
	}[];
	/** Las facturas PPD en otra moneda aún pendientes al cierre: direction issued (de un cliente) o received (de un proveedor), balance (lo que faltaba pagar, en su moneda) y booked_rate (su TipoCambio, al que se registró). */
	documents: {
		/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
		uuid: string;
		/** EntradaSalidaMerc: Entrada o Salida. */
		direction: "issued" | "received";
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string;
		/** Nombre. */
		name: string;
		/** Su serie y folio, o null si no tiene. */
		series_folio: string | null;
		/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
		date: string;
		/** Moneda de la factura pagada (MonedaDR). */
		currency: string;
		/** Lo que faltaba pagar al cierre del mes, en su moneda. */
		balance: number;
		/** Su TipoCambio: los pesos por unidad a los que se registró. */
		booked_rate: number;
	}[];
	/** Sus cuentas de banco en otra moneda: statement_balance (el saldo del último estado de cuenta al cierre, en su moneda, o null si no hay), statement_date y book_balance (lo que sus libros traen en pesos antes de la revaluación). La diferencia contra statement_balance × el tipo de cambio de cierre va a Utilidad o Pérdida cambiaria. */
	bank_accounts: {
		/** Nombre. */
		name: string;
		/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
		currency: string;
		/** El saldo de su último estado de cuenta del mes, en su moneda, o null si no hay. */
		statement_balance: number | null;
		/** La fecha de ese saldo, o null. */
		statement_date: string | null;
		/** Los pesos que la cuenta lleva en los libros al cierre, sin la póliza de revaluación. */
		book_balance: number;
	}[];
	/** La póliza de revaluación (mje_…) si ya se registró, o null. Es una póliza a mano de tipo adjustment con reverse_next_month. */
	manual_entry: string | null;
}

/** Las cuotas patronales de un mes en la contabilidad: lo que la empresa debe al IMSS, al SAR y al Infonavit por los días del mes según sus recibos de nómina timbrados, el impuesto sobre nómina del mes y la póliza de provisión que los registra, si ya se registró. */
export interface PayrollProvision {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "payroll_provision";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** El último día del mes: la fecha de la póliza. */
	date: string;
	/** La prima de riesgo de trabajo del cálculo, como fracción (0.0054355 es 0.54355%). */
	employer_risk_premium: number;
	/** true si es la que se guardó al registrar; false si es la prima media de la clase de sus empleados. */
	employer_risk_premium_saved: boolean;
	/** Lo calculado: imss (enfermedades y maternidad, invalidez y vida, riesgos de trabajo y guarderías), sar (retiro y cesantía y vejez), infonavit y payroll_tax (el impuesto sobre nómina del mes, como GET /v1/payroll_taxes). */
	calculated: {
		/** Calculado: enfermedades y maternidad, invalidez y vida, riesgos de trabajo y guarderías. */
		imss: number;
		/** Calculado: retiro y cesantía en edad avanzada y vejez. */
		sar: number;
		/** Calculado: la aportación al Infonavit (5%). */
		infonavit: number;
		/** Calculado: el impuesto sobre nómina del mes. */
		payroll_tax: number;
	};
	/** Los importes de la póliza registrada (pueden ser los que escribió), o null si no se ha registrado. */
	posted: {
		/** Registrado: enfermedades y maternidad, invalidez y vida, riesgos de trabajo y guarderías. */
		imss: number;
		/** Registrado: retiro y cesantía en edad avanzada y vejez. */
		sar: number;
		/** Registrado: la aportación al Infonavit (5%). */
		infonavit: number;
		/** Registrado: el impuesto sobre nómina del mes. */
		payroll_tax: number;
	} | null;
	/** El cálculo por empleado: su salario base de cotización, los días de cada ramo (las faltas solo cotizan en enfermedades y maternidad; las incapacidades solo en retiro e Infonavit) y lo que toca a cada parte. minimum_wage: la empresa paga también la parte del trabajador (LSS art. 36). */
	employees: {
		/** El empleado (emp_…). */
		employee: string | null;
		/** Nombre. */
		name: string;
		/** Su salario base de cotización: el SDI del recibo, entre el salario mínimo y 25 UMA. */
		sbc: number;
		/** Días del mes en enfermedades y maternidad: menos las incapacidades. */
		days_health: number;
		/** Días en invalidez y vida, riesgos de trabajo, guarderías y cesantía y vejez: menos faltas (hasta 7 al mes) e incapacidades. */
		days_disability_life: number;
		/** Días en retiro e Infonavit: menos las faltas; las incapacidades sí cuentan. */
		days_retirement: number;
		/** Gana el salario mínimo: la empresa paga también su parte (LSS art. 36). */
		minimum_wage: boolean;
		/** Sus cuotas patronales al IMSS. */
		imss: number;
		/** Su retiro y cesantía y vejez. */
		sar: number;
		/** Su aportación al Infonavit. */
		infonavit: number;
	}[];
	/** El impuesto sobre nómina de cada estado. */
	payroll_tax_states: {
		/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
		state: string;
		/** Base del impuesto retenido (BaseRet). */
		base: number;
		/** Importe. */
		amount: number;
	}[];
	/** La póliza de provisión (mje_…) si ya se registró, o null. Es una póliza a mano de tipo adjustment. */
	manual_entry: string | null;
}

/** El presupuesto de un año (de toda la empresa o de un centro de costo) por cuenta de resultados y mes, y cómo va lo real contra él: el mes y de enero a ese mes. */
export interface Budget {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "budget";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Año (Ejercicio). */
	year: number;
	/** El mes de la comparación: el que pidió, el actual en el año en curso, 12 en uno pasado (0 en uno futuro). */
	month: number;
	/** El centro de costo (ccn_…) del presupuesto, o null: toda la empresa. */
	cost_center: string | null;
	/** Lo presupuestado por cuenta, como se guardó. */
	lines: {
		/** El número de cuenta. */
		account: string;
		/** El nombre de la cuenta. */
		account_name: string;
		/** Su código agrupador del SAT. */
		grouping_code: string;
		/** Enero a diciembre. */
		months: number[];
		/** La suma de los 12 meses. */
		annual: number;
	}[];
	/** Cada cuenta con presupuesto o con movimiento: lo presupuestado contra lo real. */
	comparison: {
		/** El número de la cuenta en su catálogo. */
		account: string;
		/** Su nombre. */
		account_name: string;
		/** Su código agrupador del SAT. */
		grouping_code: string;
		/** Su parte del estado de resultados. */
		section: "revenue" | "cost_of_sales" | "operating_expenses" | "financing" | "other";
		/** El mes. */
		month: {
			/** El mes: lo presupuestado. */
			budget: number;
			/** El mes: lo real, de sus pólizas. */
			actual: number;
			/** Real menos presupuesto. */
			variance: number;
			/** La variación como porcentaje del presupuesto (null sin presupuesto). */
			variance_percent: number | null;
			/** true si lo real deja al menos la utilidad presupuestada: más ingresos o menos gastos. */
			favorable: boolean;
		};
		/** De enero al mes. */
		year_to_date: {
			/** De enero al mes: lo presupuestado. */
			budget: number;
			/** De enero al mes: lo real, de sus pólizas. */
			actual: number;
			/** Real menos presupuesto. */
			variance: number;
			/** La variación como porcentaje del presupuesto (null sin presupuesto). */
			variance_percent: number | null;
			/** true si lo real deja al menos la utilidad presupuestada: más ingresos o menos gastos. */
			favorable: boolean;
		};
		/** Lo presupuestado en todo el año. */
		annual_budget: number;
	}[];
	/** La utilidad antes de impuestos. */
	income_before_taxes: {
		/** El mes. */
		month: {
			/** Presupuestada. */
			budget: number;
			/** Real. */
			actual: number;
		};
		/** De enero al mes. */
		year_to_date: {
			/** Presupuestada. */
			budget: number;
			/** Real. */
			actual: number;
		};
		/** Presupuestada en todo el año. */
		annual_budget: number;
	};
}

/** El estado de resultados por centro de costo: lo que cada uno dejó de utilidad, de las facturas que se le pusieron y de los renglones de póliza que lo llevan. Juntos suman el estado de resultados de la empresa. */
export interface CostCenterResults {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cost_center_results";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Un solo mes, del 1 al 12 (MesIni y MesFin iguales). */
	month: string;
	/** El mes. */
	month_results: {
		/** El centro de costo (ccn_…), o null: lo que no tiene centro. */
		cost_center: string | null;
		/** Su nombre. */
		cost_center_name: string | null;
		/** Ingresos. */
		revenue: number;
		/** Costo de ventas, en negativo. */
		cost_of_sales: number;
		/** Gastos de operación, en negativo. */
		operating_expenses: number;
		/** Resultado integral de financiamiento. */
		financing: number;
		/** Otros ingresos y gastos. */
		other: number;
		/** Utilidad (o pérdida) antes de impuestos. */
		income_before_taxes: number;
		/** Utilidad entre ingresos, en porcentaje (null sin ingresos). */
		margin_percent: number | null;
	}[];
	/** De enero al mes. */
	year_to_date: {
		/** El centro de costo (ccn_…), o null: lo que no tiene centro. */
		cost_center: string | null;
		/** Su nombre. */
		cost_center_name: string | null;
		/** Ingresos. */
		revenue: number;
		/** Costo de ventas, en negativo. */
		cost_of_sales: number;
		/** Gastos de operación, en negativo. */
		operating_expenses: number;
		/** Resultado integral de financiamiento. */
		financing: number;
		/** Otros ingresos y gastos. */
		other: number;
		/** Utilidad (o pérdida) antes de impuestos. */
		income_before_taxes: number;
		/** Utilidad entre ingresos, en porcentaje (null sin ingresos). */
		margin_percent: number | null;
	}[];
}

/** La determinación de impuestos de un mes en la contabilidad: el IVA cobrado y pagado del mes (de sus pólizas) que pasa a IVA por pagar o a favor, el pago provisional de ISR sugerido y la póliza que los registra, si ya se registró. */
export interface TaxDetermination {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "tax_determination";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** El último día del mes: la fecha de la póliza. */
	date: string;
	/** El IVA trasladado cobrado en el mes, según sus pólizas. */
	vat_collected: number;
	/** El IVA acreditable pagado en el mes, según sus pólizas. */
	vat_creditable: number;
	/** El IVA que le retuvieron sus clientes en el mes. */
	vat_withheld_by_customers: number;
	/** vat_collected − vat_creditable − vat_withheld_by_customers: positivo, IVA por pagar; negativo, IVA a favor. */
	vat: number;
	/** El pago provisional de ISR que calcula Impuestos con su configuración, o null si no está configurado. */
	suggested_isr: number | null;
	/** La póliza de determinación (mje_…) si ya se registró, o null. Es una póliza a mano de tipo adjustment. */
	manual_entry: string | null;
}

/** El costo de ventas de un mes en la contabilidad (sistema de inventarios periódico): las compras del mes, el inventario en libros y al cierre, y la póliza que lleva la diferencia a Costo de ventas, si ya se registró. */
export interface CostOfSales {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cost_of_sales";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** El último día del mes: la fecha de la póliza. */
	date: string;
	/** Las compras del mes por cuenta (código agrupador 502: cargos menos abonos), sin la póliza del mes. */
	purchases: {
		/** La cuenta: su número y nombre en el catálogo. */
		account: string;
		/** Importe. */
		amount: number;
	}[];
	/** Las devoluciones y descuentos sobre compras del mes por cuenta (503: abonos menos cargos). */
	purchase_returns: {
		/** La cuenta: su número y nombre en el catálogo. */
		account: string;
		/** Importe. */
		amount: number;
	}[];
	/** purchases − purchase_returns. */
	net_purchases: number;
	/** El saldo de las cuentas de inventario (115) al cierre del mes en sus libros, sin la póliza del mes. */
	book_inventory: number;
	/** Lo que valen sus existencias al cierre del mes según Inventario (con su método de valuación), o null si no lleva existencias en Fiscalisto: entonces use su conteo físico. */
	suggested_ending_inventory: number | null;
	/** La póliza de costo de ventas (mje_…) si ya se registró, o null. Es una póliza a mano de tipo adjustment. */
	manual_entry: string | null;
}

/** Una cuenta de banco que la contabilidad lleva aparte: su propia subcuenta de Bancos, con la moneda en que se revalúa. */
export interface LedgerBankAccount {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "ledger_bank_account";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** Los últimos 4 dígitos de la cuenta, como los muestra su estado de cuenta. */
	last4: string;
	/** Su nombre en el catálogo. */
	name: string;
	/** Su número de cuenta en el catálogo (código agrupador 102.01). */
	account: string;
	/** Su moneda (MXN, USD…). */
	currency: string;
}

/** Las pólizas que entraron de otro sistema (CONTPAQi, COI, una hoja de cálculo) en una importación. */
export interface ManualEntryImport {
	/** La importación (mji_…), para deshacerla; null si todas las pólizas ya estaban. */
	id: string | null;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "manual_entry_import";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** Cuántas pólizas entraron. */
	imported: number;
	/** Cuántas se saltaron porque ya estaban importadas. */
	duplicates: number;
	/** La fecha de la primera póliza del archivo. */
	from: string;
	/** La fecha de la última. */
	to: string;
	/** Las pólizas que entraron (mje_…). */
	manual_entries: string[];
}

/** Los saldos iniciales del emisor: con qué saldo empieza cada cuenta el día en que empiezan sus libros. */
export interface OpeningBalances {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "opening_balances";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El día en que empiezan sus libros, o null si no tiene saldos iniciales. */
	date: string | null;
	/** El saldo de cada cuenta: deudor (debit) o acreedor (credit). */
	lines: {
		/** El número de cuenta. */
		account: string;
		/** El nombre de la cuenta. */
		account_name: string;
		/** El cargo, en pesos. */
		debit: number;
		/** El abono, en pesos. */
		credit: number;
	}[];
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

/** El auxiliar de cuentas (libro mayor) de un periodo de hasta 12 meses: cada cuenta con su saldo inicial, cada cargo y abono con su póliza y el saldo que deja, y su saldo final. */
export interface GeneralLedger {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "general_ledger";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El primer mes (AAAA-MM). */
	from_month: string;
	/** El último mes (AAAA-MM). */
	to_month: string;
	/** Cada cuenta que se movió en el periodo (o la que pidió con account): sus saldos, sus sumas y sus movimientos. */
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
		/** Cada cargo y abono de la cuenta en el periodo, en el orden de sus pólizas, con el saldo que deja. */
		movements: {
			/** Fecha de emisión (Fecha), hora de la Ciudad de México. */
			date: string;
			/** La póliza (el mismo id de GET /v1/accounting/journal_entries). */
			journal_entry: string;
			/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
			type: "invoice" | "payment_received" | "payment_made" | "payroll" | "employee_expenses" | "depreciation" | "manual" | "asset_disposal" | "bank_identification";
			/** Descripción. */
			description: string;
			/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
			tax_id: string | null;
			/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
			uuid: string | null;
			/** El cargo. */
			debit: number;
			/** El abono. */
			credit: number;
			/** El saldo de la cuenta después de este movimiento, en su naturaleza. */
			balance: number;
		}[];
	}[];
}

/** El estado de resultados y el balance general de un mes, leídos de su balanza. */
export interface FinancialStatements {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "financial_statements";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** El estado de resultados del mes (month) y del año hasta ese mes (year_to_date). Cada sección suma en positivo lo que aumenta la utilidad (ingresos) y en negativo lo que la reduce (costos y gastos). */
	income_statement: {
		/** El estado de resultados del mes. */
		month: {
			/** Ingresos, costos, gastos, financiamiento y otros, cada uno con su total. */
			sections: {
				/** La sección: ingresos, costos, gastos, financiamiento u otros. */
				key: "ingresos" | "costos" | "gastos" | "financiamiento" | "otros";
				/** Nombre. */
				name: string;
				/** Total en la moneda del comprobante (Total). */
				total: number;
				/** Su monto por el primer nivel del código agrupador. */
				groups: {
					/** El primer nivel del código agrupador (401, 601…). */
					grouping_code: string;
					/** Nombre. */
					name: string;
					/** Importe. */
					amount: number;
					/** Las cuentas del grupo con su monto. */
					accounts: {
						/** Número de empleado (NumEmpleado). */
						number: string;
						/** Nombre. */
						name: string;
						/** Importe. */
						amount: number;
					}[];
				}[];
			}[];
			/** La utilidad (o pérdida, negativa) antes de impuestos del mes. */
			net_income: number;
		};
		/** El estado de resultados de enero al mes. */
		year_to_date: {
			/** Ingresos, costos, gastos, financiamiento y otros, cada uno con su total. */
			sections: {
				/** La sección: ingresos, costos, gastos, financiamiento u otros. */
				key: "ingresos" | "costos" | "gastos" | "financiamiento" | "otros";
				/** Nombre. */
				name: string;
				/** Total en la moneda del comprobante (Total). */
				total: number;
				/** Su monto por el primer nivel del código agrupador. */
				groups: {
					/** El primer nivel del código agrupador (401, 601…). */
					grouping_code: string;
					/** Nombre. */
					name: string;
					/** Importe. */
					amount: number;
					/** Las cuentas del grupo con su monto. */
					accounts: {
						/** Número de empleado (NumEmpleado). */
						number: string;
						/** Nombre. */
						name: string;
						/** Importe. */
						amount: number;
					}[];
				}[];
			}[];
			/** La utilidad (o pérdida, negativa) antes de impuestos de enero al mes. */
			net_income: number;
		};
	};
	/** El balance general al cierre del mes, agrupado por el primer nivel del código agrupador. difference es activo menos pasivo y capital: 0 cuando los libros cuadran. */
	balance_sheet: {
		/** El activo: su total y sus grupos. */
		assets: {
			/** Total en la moneda del comprobante (Total). */
			total: number;
			/** Su monto por el primer nivel del código agrupador. */
			groups: {
				/** El primer nivel del código agrupador (401, 601…). */
				grouping_code: string;
				/** Nombre. */
				name: string;
				/** Importe. */
				amount: number;
				/** Las cuentas del grupo con su monto. */
				accounts: {
					/** Número de empleado (NumEmpleado). */
					number: string;
					/** Nombre. */
					name: string;
					/** Importe. */
					amount: number;
				}[];
			}[];
		};
		/** El pasivo: su total y sus grupos. */
		liabilities: {
			/** Total en la moneda del comprobante (Total). */
			total: number;
			/** Su monto por el primer nivel del código agrupador. */
			groups: {
				/** El primer nivel del código agrupador (401, 601…). */
				grouping_code: string;
				/** Nombre. */
				name: string;
				/** Importe. */
				amount: number;
				/** Las cuentas del grupo con su monto. */
				accounts: {
					/** Número de empleado (NumEmpleado). */
					number: string;
					/** Nombre. */
					name: string;
					/** Importe. */
					amount: number;
				}[];
			}[];
		};
		/** El capital contable sin el resultado del ejercicio: su total y sus grupos. */
		equity: {
			/** Total en la moneda del comprobante (Total). */
			total: number;
			/** Su monto por el primer nivel del código agrupador. */
			groups: {
				/** El primer nivel del código agrupador (401, 601…). */
				grouping_code: string;
				/** Nombre. */
				name: string;
				/** Importe. */
				amount: number;
				/** Las cuentas del grupo con su monto. */
				accounts: {
					/** Número de empleado (NumEmpleado). */
					number: string;
					/** Nombre. */
					name: string;
					/** Importe. */
					amount: number;
				}[];
			}[];
		};
		/** El resultado del ejercicio hasta el mes, parte del capital. */
		net_income_year_to_date: number;
		/** Pasivo más capital más el resultado del ejercicio. */
		liabilities_and_equity: number;
		/** Activo menos pasivo y capital: 0 cuando los libros cuadran. */
		difference: number;
	};
	/** Cuántas pólizas tuvo el mes. */
	journal_entries: number;
	/** Desde qué fecha cuentan los saldos iniciales capturados en la app; null si no hay. */
	opening_balances_date: string | null;
	/** Pagos que se refieren a facturas que no están en Fiscalisto y no se registraron. */
	missing_invoices: number;
}

/** Lo que el emisor declaró cada mes contra lo que dicen sus CFDI, el IVA a favor y el régimen con que factura. */
export interface CrossChecks {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cross_checks";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El ejercicio. */
	year: number;
	/** Cada mes cuya declaración mensual ya venció (el día 17 del mes siguiente), con sus cruces. Un mes con complementaria toma, por impuesto, la más reciente que lo trae. */
	months: {
		/** El mes (AAAA-MM). */
		month: string;
		/** El peor de sus cruces: differs (no coincide), unreadable (una cifra no se pudo leer), not_filed (sin declaración mensual) o matches. */
		status: "matches" | "differs" | "not_filed" | "unreadable";
		/** Un cruce por cifra. */
		checks: {
			/** Qué cifra: vat_charged (IVA trasladado), vat_creditable (IVA acreditable), vat_withheld (IVA que le retuvieron), isr_income (ingresos para ISR: nominales en persona moral, cobrados en los demás) y, solo en los meses en que retuvo, isr_withheld_salaries (ISR retenido por salarios y asimilados, contra sus recibos de nómina), isr_withheld_suppliers (ISR retenido por honorarios y arrendamiento, contra las facturas recibidas que pagó) o vat_withheld_suppliers (IVA retenido a proveedores). */
			key: "vat_charged" | "vat_creditable" | "vat_withheld" | "isr_income" | "isr_withheld_salaries" | "isr_withheld_suppliers" | "vat_withheld_suppliers";
			/** matches (hasta $2 de diferencia), differs, not_filed (no hay declaración del mes, o en una retención ninguna declaración del mes la trae) o unreadable (la declaración no trae la cifra en un renglón reconocible). */
			status: "matches" | "differs" | "not_filed" | "unreadable";
			/** Lo declarado, en pesos; null si no hay declaración o no se pudo leer. */
			declared: number | null;
			/** De declared, lo que la propia declaración dice que no salió de facturas: en isr_income los ingresos nominales adicionales (cobrado sin factura, intereses) y en vat_charged el IVA al 16% por encima de la precarga del SAT. Se compara aparte; 0 si no hay. */
			declared_without_cfdi: number;
			/** Lo que dicen los CFDI del mes, con los mismos cálculos de Impuestos. */
			invoiced: number;
			/** declared menos declared_without_cfdi menos invoiced; null si declared es null. */
			difference: number | null;
			/** El número de operación de la declaración de donde salió la cifra. */
			operation_number: string | null;
		}[];
	}[];
	/** El IVA a favor que muestran las declaraciones del año y lo que meses posteriores acreditaron. Una estimación con las declaraciones leídas, no la cuenta del SAT. */
	vat_balance_in_favor: {
		/** Cada mes con IVA a favor. */
		periods: {
			/** El mes cuya declaración muestra el IVA a favor. */
			month: string;
			/** El IVA a favor de ese mes. */
			amount: number;
			/** El número de operación de esa declaración. */
			operation_number: string;
		}[];
		/** La suma del IVA a favor del año. */
		total: number;
		/** Lo que las declaraciones del año acreditaron de saldos a favor de periodos anteriores. */
		credited: number;
		/** total menos credited, nunca menos de 0: lo que quedaría por acreditar o pedir en devolución. */
		remaining: number;
	};
	/** Los regímenes del emisor (registered, de su constancia) y con cuáles facturó en el año. */
	tax_regimes: {
		/** Los regímenes de su constancia (c_RegimenFiscal), capturados en la app. */
		registered: string[];
		/** Cada régimen con que facturó en el año (RegimenFiscal del emisor). */
		invoiced: {
			/** El régimen (c_RegimenFiscal). */
			tax_regime: string;
			/** Cuántos CFDI lo llevan (ingreso, egreso y pago, sin cancelados). */
			invoices: number;
			/** La fecha del primero (AAAA-MM-DD). */
			first_date: string;
			/** La fecha del último (AAAA-MM-DD). */
			last_date: string;
			/** Si el régimen está en su constancia; null si no se capturaron los regímenes de la constancia. */
			registered: boolean | null;
		}[];
	};
}

/** Los CFDI que forman una cifra del cruce de un mes (invoiced): cada uno con lo que aporta, y el ajuste que Impuestos agrega encima. */
export interface CrossCheckCfdi {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cross_check_cfdi";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El mes (AAAA-MM). */
	month: string;
	/** La cifra: vat_charged (IVA trasladado), vat_creditable (IVA acreditable), vat_withheld (IVA que le retuvieron), isr_income (ingresos para ISR), isr_withheld_salaries (ISR retenido en sus recibos de nómina), isr_withheld_suppliers o vat_withheld_suppliers (ISR o IVA que retuvo a proveedores). */
	key: "vat_charged" | "vat_creditable" | "vat_withheld" | "isr_income" | "isr_withheld_salaries" | "isr_withheld_suppliers" | "vat_withheld_suppliers";
	/** El cruce de esa cifra, como en GET /v1/accounting/cross_checks: matches, differs, not_filed o unreadable. */
	status: "matches" | "differs" | "not_filed" | "unreadable";
	/** Lo declarado, en pesos; null si no hay declaración o no se pudo leer. */
	declared: number | null;
	/** De declared, lo que la propia declaración dice que no salió de facturas (ingresos nominales adicionales en isr_income, IVA al 16% sobre la precarga del SAT en vat_charged); 0 si no hay. */
	declared_without_cfdi: number;
	/** Lo que dicen los CFDI del mes: la suma de cfdi más adjustment. */
	invoiced: number;
	/** declared menos declared_without_cfdi menos invoiced; null si declared es null. */
	difference: number | null;
	/** El número de operación de la declaración de donde salió la cifra. */
	operation_number: string | null;
	/** Cada CFDI que suma en el mes, de mayor a menor: los PUE y las notas de crédito en su mes, las facturas PPD por lo que se pagó en el mes. */
	cfdi: {
		/** El folio fiscal (UUID) del CFDI; el de la factura PPD en un pago. */
		uuid: string | null;
		/** invoice (factura de ingreso, PUE), credit_note (nota de crédito: resta) o payment (lo pagado en el mes de una factura PPD). */
		type: "invoice" | "credit_note" | "payment" | "withholding_certificate";
		/** La fecha del CFDI, o la del pago (AAAA-MM-DD). */
		date: string | null;
		/** El RFC de la contraparte: el cliente en lo emitido, el proveedor en lo recibido. */
		tax_id: string | null;
		/** El nombre de la contraparte, como viene en el CFDI. */
		name: string | null;
		/** Lo que aporta a la cifra, en pesos; negativo en una nota de crédito. */
		amount: number;
	}[];
	/** Lo que Impuestos agrega sobre los CFDI: en vat_creditable, la proporción de gastos comunes, el IVA retenido enterado del mes anterior y las importaciones; 0 en las demás. */
	adjustment: number;
	/** Qué CFDI explicarían la diferencia; null si coincide. */
	explanation: {
		/** La diferencia. */
		difference: number;
		/** Los CFDI cuyo effect suma la diferencia; null si ninguno. */
		exact: {
			/** Los CFDI de la combinación. */
			cfdi: {
				/** El folio fiscal (UUID) del CFDI; el de la factura PPD en un pago. */
				uuid: string | null;
				/** La fecha del CFDI, o la del pago (AAAA-MM-DD). */
				date: string | null;
				/** El RFC de la contraparte: el cliente en lo emitido, el proveedor en lo recibido. */
				tax_id: string | null;
				/** El nombre de la contraparte, como viene en el CFDI. */
				name: string | null;
				/** Lo que aporta a la cifra, en pesos; negativo en una nota de crédito. */
				amount: number;
				/** Cuánto cambiaría invoiced. */
				effect: number;
				/** Por qué lo explicaría. */
				reason: "cancelled" | "ppd_not_collected" | "other_month" | "month_edge" | "credit_note" | "ppd_payment" | "duplicate" | "left_out" | "withholding_certificate";
				/** true si está en cfdi. */
				in_invoiced: boolean;
			}[];
			/** Lo que queda (redondeo). */
			remainder: number;
		} | null;
		/** true si varias combinaciones la suman. */
		ambiguous: boolean;
		/** Las posibles causas, por motivo. */
		causes: {
			/** El motivo que comparten. */
			reason: "cancelled" | "ppd_not_collected" | "other_month" | "month_edge" | "credit_note" | "ppd_payment" | "duplicate" | "left_out" | "withholding_certificate";
			/** La suma de su effect. */
			total: number;
			/** Sus CFDI. */
			cfdi: {
				/** El folio fiscal (UUID) del CFDI; el de la factura PPD en un pago. */
				uuid: string | null;
				/** La fecha del CFDI, o la del pago (AAAA-MM-DD). */
				date: string | null;
				/** El RFC de la contraparte: el cliente en lo emitido, el proveedor en lo recibido. */
				tax_id: string | null;
				/** El nombre de la contraparte, como viene en el CFDI. */
				name: string | null;
				/** Lo que aporta a la cifra, en pesos; negativo en una nota de crédito. */
				amount: number;
				/** Cuánto cambiaría invoiced. */
				effect: number;
				/** Por qué lo explicaría. */
				reason: "cancelled" | "ppd_not_collected" | "other_month" | "month_edge" | "credit_note" | "ppd_payment" | "duplicate" | "left_out" | "withholding_certificate";
				/** true si está en cfdi. */
				in_invoiced: boolean;
			}[];
		}[];
	} | null;
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

/** El IVA a favor del emisor mes por mes, qué pasó con cada saldo y, con un mes, la revisión antes de pedir su devolución. */
export interface VatRefund {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "vat_refund";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El IVA a favor que todavía puede pedir de vuelta: lo que queda de cada saldo sin acreditar, sin solicitud y sin prescribir. */
	available: number;
	/** Lo pedido en solicitudes que siguen en trámite o ya se resolvieron sin depósito. */
	in_refund: number;
	/** Lo que el SAT ya depositó. */
	refunded: number;
	/** true si algún mes sale de sus CFDI porque su declaración no se ha leído (POST /v1/sat_declarations/refresh). */
	estimated: boolean;
	/** Cada mes con IVA a favor en los últimos cinco años, del más reciente al más antiguo. */
	balances: {
		/** El mes del saldo (AAAA-MM). */
		month: string;
		/** declaration si sale de la declaración leída; cfdi si se calculó con sus CFDI. */
		source: "declaration" | "cfdi";
		/** El saldo a favor del mes. */
		amount: number;
		/** El número de operación de la declaración, o null. */
		operation_number: string | null;
		/** Lo que de este saldo se acreditó en meses posteriores, del saldo más antiguo primero. */
		credited: number;
		/** En qué mes se acreditó cada parte y cuánto. */
		credited_in: {
			/** El mes en que se acreditó esa parte (AAAA-MM). */
			month: string;
			/** Lo acreditado ese mes. */
			amount: number;
		}[];
		/** Lo que queda de este saldo para pedir de vuelta. */
		available: number;
		/** available (se puede pedir), credited (ya se acreditó), in_refund (con solicitud), refunded (depositado), denied (negado) o prescribed (pasaron cinco años). */
		status: "available" | "credited" | "in_refund" | "refunded" | "denied" | "prescribed";
		/** Cuándo prescribe el derecho a pedirlo: cinco años desde su declaración (AAAA-MM-DD). */
		prescribes_on: string;
	}[];
	/** Con month, la revisión de ese mes antes de pedirlo; null sin month. */
	review: {
		/** El mes revisado (AAAA-MM). */
		month: string;
		/** Lo que conviene pedir, en pesos sin centavos como lo pide el SAT. */
		amount_to_request: number;
		/** true si ya acreditó parte del saldo y lo que pide es el remanente. */
		remainder: boolean;
		/** true si ninguna revisión bloquea la solicitud. */
		ready: boolean;
		/** Cada revisión, de la más grave a la que está bien. */
		checks: {
			/** Qué se revisó, estable para su código. */
			key: string;
			/** ok, warning (conviene revisar), blocking (el SAT la rechazaría) o pending (falta un dato). */
			result: "ok" | "warning" | "blocking" | "pending";
			/** La revisión, en una línea. */
			title: string;
			/** Qué encontró y qué hacer. */
			detail: string;
			/** Los pesos que toca, como el IVA en riesgo, o null. */
			amount: number | null;
		}[];
		/** Los proveedores del mes, para la relación que pide el SAT. */
		suppliers: {
			/** Cuántos proveedores tuvo en el mes. */
			count: number;
			/** Cuántos CFDI recibidos suman al IVA acreditable. */
			cfdi: number;
			/** Cuántos proveedores juntan el 80% del IVA acreditable. */
			main: number;
			/** El IVA de CFDI de proveedores que el SAT no reconocería: cancelados, de EFOS o con otros hallazgos. */
			vat_at_risk: number;
		};
		/** Los clientes del mes. */
		customers: {
			/** Cuántos clientes tuvo en el mes. */
			count: number;
			/** Cuántos CFDI emitidos suman al IVA cobrado. */
			cfdi: number;
		};
	} | null;
}

/** Una tienda de Shopify, WooCommerce, Tiendanube, Mercado Libre o Amazon cuyos pedidos pagados se vuelven tickets de autofactura del emisor. */
export interface StoreConnection {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "store_connection";
	/** El emisor dueño de la tienda. */
	issuer: string;
	/** shopify, woocommerce, tiendanube, mercadolibre, amazon, mercadopago, conekta u openpay. */
	platform: "shopify" | "mercadolibre" | "amazon" | "tiendanube" | "woocommerce" | "mercadopago" | "conekta" | "openpay";
	/** El dominio de la tienda (Shopify, WooCommerce), el id de la tienda en Tiendanube o del vendedor en Mercado Libre y Amazon (al autorizar), el id de la cuenta de Mercado Pago, el ID de comercio de Openpay, o una referencia de la cuenta de Conekta. */
	shop: string | null;
	/** El nombre de la tienda según su plataforma, o null. */
	name: string | null;
	/** pending (Mercado Libre, Tiendanube o Amazon esperan que se autorice en authorize_url), active o disconnected. */
	status: "pending" | "active" | "disconnected";
	/** Si está pending: la página de la plataforma donde el vendedor autoriza (vale un día; cada consulta da una nueva). Si no, null. */
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
		/** Mercado Libre: si se timbra al momento con los datos fiscales del comprador; null en las demás plataformas. */
		auto_invoice: boolean | null;
		/** WooCommerce y Tiendanube: si el comprador recibe su enlace para facturar (nota del pedido o correo); null en las demás plataformas. */
		notify_buyer: boolean | null;
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
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** draft, sent, viewed (el cliente abrió la liga), accepted, rejected, withdrawn (usted la retiró), expired (pasó valid_until) o invoiced. */
	status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "withdrawn" | "expired" | "invoiced";
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
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
	/** Si se le manda un recordatorio por correo 3 días antes de su último día mientras no responda (remind en POST /v1/quotes/{id}/send). */
	remind: boolean;
	/** Cuándo se mandó el recordatorio, o null. */
	reminded_at: string | null;
	/** Lo que escribió el cliente al pedir cambios o al rechazarla, la nota de usted al retirarla o marcarla rechazada, o null. */
	customer_comment: string | null;
	/** Cuándo se envió. */
	sent_at: string | null;
	/** Cuándo el cliente abrió la liga por primera vez. */
	viewed_at: string | null;
	/** Cuándo se aceptó, se rechazó o se retiró. */
	decided_at: string | null;
	/** customer (en su liga) o user (usted: POST /v1/quotes/{id}/accept, /reject o /withdraw, o desde la app). */
	decided_by: "customer" | "user" | null;
	/** La factura (inv_…) que se timbró de ella, o null. */
	invoice: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Un pedido de venta: lo que su cliente pidió, cómo se entrega (remisiones) y cómo se factura y se cobra. */
export interface SalesOrder {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sales_order";
	/** El emisor (iss_…). */
	issuer: string;
	/** Su serie y folio (PED-12). */
	number: string;
	/** draft (borrador), confirmed, partially_delivered, delivered (todo entregado), invoiced (todo facturado), paid (sus facturas pagadas), closed (se dio por terminado) o canceled. Cambia solo, con lo que pasa. */
	status: "draft" | "confirmed" | "partially_delivered" | "delivered" | "invoiced" | "paid" | "closed" | "canceled";
	/** La etapa del negocio en que va («Por empacar», «En ruta»…), o null. Se elige en la app. */
	stage: string | null;
	/** La liga donde su cliente ve el pedido, lo confirma, firma cada entrega y abre sus facturas. null mientras sea borrador o no se haya mandado. */
	url: string | null;
	/** El cliente: su RFC, nombre, correo y su id en su catálogo. */
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
	/** El número de orden de compra de su cliente, o null. */
	customer_po: string | null;
	/** La cotización (quo_…) de donde salió, o null. */
	quote: string | null;
	/** La moneda. */
	currency: string;
	/** Los conceptos: id (para entregar o facturar una parte), lo pedido, lo entregado, lo facturado y lo que ya no se entregará (canceled). goods es true cuando sale del almacén. */
	items: {
		/** El id del concepto en el pedido: con él entrega o factura una parte (line). */
		id: number;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key: string | null;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
		/** La unidad, como la ve el cliente. */
		unit: string | null;
		/** Precio unitario antes de impuestos (ValorUnitario). */
		unit_price: number;
		/** El descuento del concepto, en dinero. */
		discount: number;
		/** El importe del concepto, sin impuestos. */
		amount: number;
		/** true si sale del almacén con cada entrega; false si es un servicio (solo se factura). */
		goods: boolean;
		/** Cuánto ya se entregó. */
		delivered: number;
		/** Cuánto ya se facturó. */
		invoiced: number;
		/** Cuánto ya no se entregará (POST /v1/sales_orders/{id}/cancel_remaining). */
		canceled: number;
	}[];
	/** El subtotal, sin impuestos. */
	subtotal: number;
	/** El total con impuestos. */
	total: number;
	/** La suma de sus facturas timbradas (sin las canceladas). */
	invoiced_total: number;
	/** Lo que ya se pagó de esas facturas. */
	paid_total: number;
	/** La entrega estimada (AAAA-MM-DD), o null. */
	expected_on: string | null;
	/** Días de crédito: cada factura vence esos días después de su fecha. */
	payment_days: number;
	/** delivered: cada factura lleva lo ya entregado; ordered: se factura lo pedido, entregado o no. */
	invoice_policy: "delivered" | "ordered";
	/** Dónde se entrega, o null. */
	ship_to: string | null;
	/** Las condiciones impresas en el pedido, o null. */
	terms: string | null;
	/** Las notas, como las de una factura. */
	notes: string | null;
	/** La nota interna (su cliente no la ve), o null. */
	internal_note: string | null;
	/** Sus entregas, cada una con su remisión. */
	deliveries: SalesOrderDelivery[];
	/** Sus facturas timbradas (inv_…), con lo que falta por pagar de cada una (balance). */
	invoices: {
		/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
		id: string;
		/** stamped, o canceled (lo que llevaba se puede volver a facturar). */
		status: "stamped" | "canceled";
		/** El total de la factura. */
		total: number;
		/** Lo que falta por pagar de esa factura, o null si aún no se sabe. */
		balance: number | null;
	}[];
	/** Cuándo su cliente lo confirmó en su liga, o null. */
	customer_confirmed_at: string | null;
	/** Cuándo se mandó, o null. */
	sent_at: string | null;
	/** Cuándo su cliente abrió la liga por primera vez, o null. */
	viewed_at: string | null;
	/** Cuándo se confirmó, o null. */
	confirmed_at: string | null;
	/** Cuándo quedó todo entregado, o null. */
	delivered_at: string | null;
	/** Cuándo quedó todo facturado, o null. */
	invoiced_at: string | null;
	/** Cuándo quedaron pagadas sus facturas, o null. */
	paid_at: string | null;
	/** Cuándo se cerró, o null. */
	closed_at: string | null;
	/** Cuándo se canceló, o null. */
	canceled_at: string | null;
	/** Por qué se canceló, o null. */
	cancel_reason: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Un proveedor del Portal de proveedores del emisor: su alta, sus documentos, la cuenta a la que se le paga y su calificación. */
export interface PortalSupplier {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "portal_supplier";
	/** El emisor de su cuenta (iss_…) cuyo portal es. */
	issuer: string;
	/** El RFC del proveedor; uno del extranjero, sin RFC, trae su clave `EXT-<país>-<tax ID>` (país en c_Pais del SAT, «EXT-USA-123456789»). */
	tax_id: string;
	/** Su nombre o razón social, o null si aún no lo da. */
	name: string | null;
	/** Los correos a los que le escribimos. */
	emails: string[];
	/** Su teléfono, o null. */
	phone: string | null;
	/** invited (invitado), onboarding (dando su alta), in_review (alta por revisar), approved (puede mandar facturas), rejected o suspended. */
	status: "invited" | "onboarding" | "in_review" | "approved" | "rejected" | "suspended";
	/** true si da servicios especializados (REPSE). */
	repse: boolean;
	/** Su alta: complete cuando todo lo obligatorio está aprobado y vigente, y cuántos documentos faltan, esperan revisión, vencieron o están por vencer. */
	documents: {
		/** true cuando todo lo obligatorio de su alta está aprobado y vigente. */
		complete: boolean;
		/** Cuántos documentos obligatorios no ha subido. */
		missing: number;
		/** Cuántos esperan revisión. */
		pending: number;
		/** Cuántos vencieron. */
		expired: number;
		/** Cuántos vencen en los próximos 7 días. */
		expiring: number;
	};
	/** La cuenta a la que se le paga, o null. Una nueva queda pending hasta que se aprueba en la app; mientras, se le paga a previous_clabe. */
	bank_account: {
		/** La CLABE de 18 dígitos. */
		clabe: string;
		/** El banco, o null. */
		bank: string | null;
		/** El titular de la cuenta, o null. */
		holder: string | null;
		/** Estado del objeto. */
		status: "pending" | "approved" | "rejected";
		/** Mientras una CLABE nueva está pending, la anterior, a la que se le sigue pagando; si no, null. */
		previous_clabe: string | null;
	} | null;
	/** Su calificación de 0 a 100 de los últimos 12 meses (value, null sin datos; level excellent, good, fair o poor) y cada parte: invoices (facturas a la primera), deliveries (entregas a tiempo), prices (precio y cantidad de la orden), documents (documentos al día) y complements (complementos de pago), con good de total casos. */
	score: {
		/** Valor de la mercancía (ValorMercancia); obligatorio en transporte aéreo. */
		value: number | null;
		/** Nivel educativo (nivelEducativo). */
		level: "excellent" | "good" | "fair" | "poor" | null;
		/** Partes del transporte que posee o arrienda (ParteTransporte), c_ParteTransporte. */
		parts: {
			/** invoices (facturas a la primera), deliveries (entregas a tiempo), prices (precio y cantidad de la orden), documents (documentos al día) o complements (complementos de pago). */
			part: "invoices" | "deliveries" | "prices" | "documents" | "complements";
			/** Valor de la mercancía (ValorMercancia); obligatorio en transporte aéreo. */
			value: number | null;
			/** En cuántos de los total casos lo hizo bien. */
			good: number;
			/** Total en la moneda del comprobante (Total). */
			total: number;
		}[];
	};
	/** La última vez que entró a su portal, o null. */
	last_seen_at: string | null;
	/** Cuándo se invitó o se registró. */
	created_at: string | null;
	/** Cuándo cambió por última vez. */
	updated_at: string | null;
}

/** Una factura que un proveedor le mandó al emisor por su Portal de proveedores, con lo que se revisó, su orden de compra, su contrarecibo y sus fechas de pago. */
export interface SupplierInvoice {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "supplier_invoice";
	/** El emisor de su cuenta (iss_…) que la recibió. */
	issuer: string;
	/** El proveedor (sup_…) que la mandó. */
	supplier: string;
	/** El RFC del proveedor, o la clave `EXT-<país>-<tax ID>` de uno del extranjero. */
	supplier_tax_id: string;
	/** El folio fiscal (UUID del timbre); la factura de un proveedor del extranjero, que no lleva CFDI, trae `EXT-…` y sat_invoice null. */
	uuid: string;
	/** La misma factura en sus facturas recibidas (sat_…), para su XML y su PDF, o null. */
	sat_invoice: string | null;
	/** Su serie, o null. */
	series: string | null;
	/** Su folio, o null. */
	folio: string | null;
	/** income (factura de ingreso) o credit_note (nota de crédito). */
	type: "income" | "credit_note";
	/** La fecha de la factura. */
	date: string;
	/** La moneda. */
	currency: string;
	/** El total de la factura. */
	total: number;
	/** Lo que se le paga: el total sin las diferencias con su orden ni el descuento de pronto pago aceptado. */
	payable: number;
	/** PUE o PPD. */
	payment_method: string | null;
	/** received (por revisar), approved, scheduled (con fecha de pago), paid o rejected. */
	status: "received" | "approved" | "scheduled" | "paid" | "rejected";
	/** La orden de compra que factura (OC-12), o null. */
	purchase_order: string | null;
	/** true si cuadró con su orden, false si tuvo diferencias, null sin orden. */
	matches_purchase_order: boolean | null;
	/** El folio de su contrarecibo, o null. */
	contrarecibo: string | null;
	/** El día en que vence por sus fechas de pago, o null. */
	due_on: string | null;
	/** El día programado para pagarla, o null. */
	scheduled_on: string | null;
	/** El día en que se pagó, o null. */
	paid_on: string | null;
	/** Lo que se pagó, o null. */
	paid_amount: number | null;
	/** La referencia del pago, o null. */
	payment_reference: string | null;
	/** Por qué se rechazó, o null. */
	rejection_reason: string | null;
	/** Lo que se revisó y quedó como aviso (code y message), para que su equipo lo vea. */
	warnings: {
		/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
		code: string;
		/** Qué pasó y cómo corregirlo, para una persona. */
		message: string;
	}[];
	/** Cuándo llegó. */
	received_at: string | null;
	/** Cuándo se aprobó, o null. */
	approved_at: string | null;
}

/** Una entrega del pedido, con su remisión (REM-1): lo que salió del almacén. */
export interface SalesOrderDelivery {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "sales_order_delivery";
	/** Su remisión (REM-1). */
	number: string;
	/** delivered, o canceled (la mercancía regresó al almacén). */
	status: "delivered" | "canceled";
	/** El día en que salió (AAAA-MM-DD). */
	delivered_on: string;
	/** El transporte, o null. */
	carrier: string | null;
	/** El número de guía, o null. */
	tracking: string | null;
	/** Una nota, o null. */
	note: string | null;
	/** Quién recibió (lo firmó en la liga o lo anotó usted), o null. */
	received_by: string | null;
	/** Cuándo se recibió, o null. */
	received_at: string | null;
	/** Cuánto salió de cada concepto (line es items[].id del pedido). */
	items: {
		/** El concepto del pedido (su items[].id). */
		line: number;
		/** Cuánto salió de él. */
		quantity: number;
	}[];
	/** Cuándo se registró. */
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
	/** De eso, lo que ya pasó de su vencimiento (el due_date de cada factura), en esa moneda. */
	amount_overdue: number;
	/** Cuántas facturas tiene abiertas. */
	open_invoices: number;
	/** La fecha (AAAA-MM-DD) de su factura abierta más antigua. */
	oldest_invoice_date: string;
}

/** Cómo paga un cliente: de sus facturas a crédito (PPD) de los últimos 12 meses y sus complementos de pago, en pesos. */
export interface CustomerPaymentBehavior {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "customer_payment_behavior";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor. */
	issuer: string;
	/** El cliente (cus_…). */
	customer: string;
	/** Su RFC. */
	tax_id: string;
	/** Sus días de crédito: los suyos (Clientes, o los de su grupo) o los de la empresa (Ajustes › Cobranza automática). Contra ellos se mide el atraso. */
	credit_days: number;
	/** on_time (80 % o más llega a tiempo y atraso promedio de 5 días o menos), sometimes_late (hasta 15 días), late (hasta 45), very_late (más) o no_history (menos de 2 facturas pagadas y nada vencido). */
	rating: "on_time" | "sometimes_late" | "late" | "very_late" | "no_history";
	/** Facturas PPD con un pago en los últimos 12 meses. */
	paid_invoices: number;
	/** Días de la factura a su pago, en promedio por monto; null sin pagos. */
	average_days_to_pay: number | null;
	/** La factura típica: la mitad se pagó en estos días o menos. */
	median_days_to_pay: number | null;
	/** 3 de cada 4 facturas se pagaron en estos días o menos. */
	p75_days_to_pay: number | null;
	/** La parte (0 a 1) de lo pagado que llegó antes de vencer; lo vencido sin pagar cuenta como tarde. */
	on_time_share: number | null;
	/** Días después del vencimiento, en promedio por monto; lo vencido sin pagar cuenta con sus días de atraso hasta hoy. */
	average_days_late: number | null;
	/** Los últimos 3 meses contra los 9 anteriores; null con menos de 2 facturas pagadas en cada lado. */
	trend: {
		/** slower: tarda 7 días o más que antes; faster: 7 o más menos. */
		direction: "slower" | "faster" | "steady";
		/** Días promedio para pagar de los últimos 3 meses. */
		recent_days: number;
		/** Días promedio de los 9 meses anteriores. */
		earlier_days: number;
	} | null;
	/** Lo que debe ya vencido, en pesos. */
	overdue_amount: number;
	/** Cuántas facturas tiene vencidas. */
	overdue_invoices: number;
	/** Cómo le pagó, la mayor primero. */
	payment_forms: {
		/** Clave de forma de pago del SAT (c_FormaPago): 03 transferencia, 02 cheque… */
		payment_form: string;
		/** Lo pagado así, en pesos. */
		amount: number;
		/** Su parte de lo pagado (0 a 1). */
		share: number;
	}[];
	/** Cada uno de los últimos 12 meses, el más antiguo primero. */
	months: {
		/** El mes de los pagos (AAAA-MM). */
		month: string;
		/** Días promedio (por monto) de los pagos de ese mes; null sin pagos. */
		average_days_to_pay: number | null;
		/** Lo pagado ese mes, en pesos. */
		amount: number;
		/** Facturas con un pago ese mes. */
		paid_invoices: number;
	}[];
	/** Su último pago; null sin pagos en 12 meses. */
	last_payment: {
		/** El día (AAAA-MM-DD). */
		date: string;
		/** Lo pagado ese día, en pesos. */
		amount: number;
	} | null;
	/** Facturas de contado (PUE) de los últimos 12 meses: se pagan al emitirse y no cuentan en lo demás. */
	cash_invoices: number;
	/** Lo que debe ahora, la factura más antigua primero. */
	open_invoices: {
		/** El UUID (folio fiscal) de la factura. */
		uuid: string;
		/** Su fecha (AAAA-MM-DD). */
		date: string;
		/** PPD a crédito; PUE que le pagan este mes. */
		payment_method: "PPD" | "PUE";
		/** Lo que falta, en pesos. */
		amount_due: number;
		/** Cuándo vence: su fecha más los días de crédito (una PUE, al fin de su mes). */
		due_date: string;
		/** Cuándo le llegaría: su fecha más lo que el cliente suele tardar (sin historial, el vencimiento). */
		expected_payment_date: string;
	}[];
}

/** El flujo de efectivo de las próximas 13 semanas: lo que le deben (con lo que cada cliente suele tardar), lo que debe a proveedores, la nómina, las declaraciones, las facturas recurrentes y sus movimientos previstos, desde el saldo que usted dio. Una estimación: no cambia nada. */
export interface CashForecast {
	/** Siempre cash_forecast. */
	object: "cash_forecast";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Hoy en la Ciudad de México (AAAA-MM-DD): el inicio. */
	today: string;
	/** El último día de la semana 13. */
	end: string;
	/** Todo en pesos: lo de otra moneda, a su tipo de cambio. */
	currency: "MXN";
	/** El saldo de hoy que usted dio; null si no lo ha dado (el flujo parte de 0). */
	starting_balance: {
		/** Lo que tenía en el banco, en pesos. */
		amount: number;
		/** El día de ese saldo. */
		date: string;
	} | null;
	/** Lo menos que quiere tener; cada semana debajo trae un aviso. 0 si no lo dio. */
	minimum_balance: number;
	/** El saldo de sus últimos estados de cuenta en Conciliación (60 días), solo como sugerencia; null sin ellos. */
	suggested_starting_balance: {
		/** La suma de los saldos, en pesos. */
		amount: number;
		/** El día del estado de cuenta más reciente. */
		date: string;
	} | null;
	/** El escenario con que se calculó: el de los parámetros de la consulta. */
	scenario: {
		/** Días que se movieron los cobros (0 como siempre). */
		customers_pay_days_later: number;
		/** Días que se movieron los pagos a proveedores. */
		pay_suppliers_days_later: number;
		/** Si cuenta lo que lleva más de 90 días de atraso. */
		include_doubtful: boolean;
		/** Si cuenta las facturas recurrentes que aún no se emiten. */
		include_recurring: boolean;
		/** Por ciento que cambiaron las recurrentes (−20 a +10…). */
		recurring_sales_change: number;
	};
	/** Las 13 semanas juntas. */
	totals: {
		/** Lo que entra en las 13 semanas. */
		inflows: number;
		/** Lo que sale en las 13 semanas. */
		outflows: number;
		/** El saldo al final de la semana 13. */
		ending_balance: number;
		/** El saldo más bajo al cierre de una semana. */
		lowest_balance: number;
		/** La semana de ese saldo (1 a 13). */
		lowest_week: number;
		/** Cuántas semanas cierran debajo de minimum_balance (o de 0). */
		weeks_below_minimum: number;
		/** Lo que se dejó fuera por llevar más de 90 días de atraso. */
		doubtful_left_out: number;
	};
	/** Las 13 semanas, en orden. */
	weeks: {
		/** 1 a 13; la 1 va de hoy al domingo. */
		week: number;
		/** El primer día (AAAA-MM-DD). */
		start: string;
		/** El último día, un domingo. */
		end: string;
		/** El saldo al empezar la semana. */
		starting_balance: number;
		/** Lo que entra. */
		inflows: number;
		/** Lo que sale. */
		outflows: number;
		/** El saldo al cerrar la semana. */
		ending_balance: number;
		/** Lo de cada tipo de renglón (lines[].type) esa semana, en pesos. */
		by_type: Record<string, number>;
	}[];
	/** Cada cosa que entra o sale, de la que se suman las semanas. */
	lines: {
		/** El renglón, para cambiarlo con POST /v1/cash_forecast/adjustments. */
		line: string;
		/** receivable: lo que le deben sus clientes; recurring_invoice: lo que facturarán sus recurrentes; planned_inflow / planned_outflow: un movimiento previsto que usted agregó; payable: lo que debe a proveedores; payroll: la nómina; taxes: las declaraciones mensuales. */
		type: "receivable" | "recurring_invoice" | "planned_inflow" | "payable" | "payroll" | "taxes" | "planned_outflow";
		/** inflow entra; outflow sale. */
		direction: "inflow" | "outflow";
		/** El día en que se cuenta, con cambios y escenario. */
		date: string;
		/** El día que se estimó. */
		estimated_date: string;
		/** La semana en que cae; null si se dejó fuera (left_out). */
		week: number | null;
		/** Lo que se cuenta, en pesos. */
		amount: number;
		/** Lo que se estimó, en pesos. */
		estimated_amount: number;
		/** Qué es, como en la app. */
		description: string;
		/** El RFC del cliente o proveedor, o null. */
		tax_id: string | null;
		/** Cuántas facturas suma, o null. */
		invoices: number | null;
		/** Cuándo vencía, o null. */
		due_date: string | null;
		/** Días de atraso si ya pasó el día esperado, o null. */
		days_overdue: number | null;
		/** Cómo se estimó, en palabras. */
		basis: string;
		/** high: un monto y día conocidos; medium: un promedio; low: atrasado o sin historial. */
		confidence: "high" | "medium" | "low";
		/** Por qué no cuenta: excluded usted lo quitó; doubtful más de 90 días de atraso; scenario el escenario lo quitó; after_horizon cae después de la semana 13. null si cuenta. */
		left_out: "excluded" | "doubtful" | "scenario" | "after_horizon" | null;
		/** true si usted le cambió el día, monto o lo quitó. */
		adjusted: boolean;
		/** El movimiento previsto (cfi_…) del que viene, o null. */
		planned_item: string | null;
	}[];
	/** Avisos con lo que puede hacer; usted decide. */
	warnings: {
		/** no_starting_balance: falta el saldo de hoy; stale_starting_balance: tiene más de 7 días; shortfall: una semana cierra debajo del mínimo; overdue_receivables: mucho por cobrar está atrasado; customer_concentration: un cliente es 40 % o más de lo que entra; doubtful_left_out: se dejó fuera lo de más de 90 días. */
		type: "no_starting_balance" | "stale_starting_balance" | "shortfall" | "overdue_receivables" | "customer_concentration" | "doubtful_left_out";
		/** Qué tan urgente es. */
		severity: "critical" | "warning" | "info";
		/** El aviso, en palabras. */
		title: string;
		/** Qué puede hacer; nada cambia solo. */
		detail: string;
		/** La semana, o null. */
		week: number | null;
		/** Lo que faltaría, en pesos, o null. */
		shortfall: number | null;
	}[];
	/** Sus movimientos previstos. */
	planned_items: CashForecastItem[];
	/** Lo que no se pudo estimar y por qué. */
	notes: string[];
}

/** Algo que espera pagar o cobrar y que ninguna factura dice (una renta, un crédito, una venta de contado), que cuenta en el flujo de efectivo. */
export interface CashForecastItem {
	/** El movimiento previsto (cfi_…). */
	id: string;
	/** Siempre cash_forecast_item. */
	object: "cash_forecast_item";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** El emisor (iss_…). */
	issuer: string;
	/** Qué es: «Renta», «Crédito del banco». */
	description: string;
	/** inflow entra dinero; outflow sale. */
	direction: "inflow" | "outflow";
	/** Cuánto, en pesos. */
	amount: number;
	/** El día (AAAA-MM-DD), o la primera vez si se repite. */
	date: string;
	/** once una vez; weekly cada semana; biweekly cada dos; monthly cada mes. */
	frequency: "once" | "weekly" | "biweekly" | "monthly";
	/** El último día en que se repite; null sin fin. */
	until: string | null;
}

/** Un depósito de la cuenta del emisor, y las facturas que pagó. */
export interface BankTransaction {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
		/** PUE: facturas por cobrar que quedan pagadas al conciliar; PPD: se pagan con su complemento de pago (POST /v1/payments). */
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

/** Un ticket de compra del emisor sin factura: lo que se leyó de su foto y si ya se pidió, llegó o no es deducible. */
export interface PurchaseReceipt {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "purchase_receipt";
	/** El emisor (el que compró). */
	issuer: string;
	/** pending (por pedir), requested (pedida a la tienda), invoiced (ya tiene factura) o non_deductible (no hubo factura). */
	status: "pending" | "requested" | "invoiced" | "non_deductible";
	/** La tienda: name, tax_id (su RFC), email, portal_url (su portal o la liga del QR) y on_fiscalisto (factura con Fiscalisto: method fiscalisto la timbra al momento). */
	store: {
		/** Nombre. */
		name: string | null;
		/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
		tax_id: string | null;
		/** Correo a donde se envía (varios separados por comas). Solo se usa si se pide enviarlo. */
		email: string | null;
		/** Su portal de facturación o la liga del QR, o null. */
		portal_url: string | null;
		/** true si factura con Fiscalisto: method fiscalisto timbra la factura al momento. */
		on_fiscalisto: boolean;
	};
	/** El día de la compra (AAAA-MM-DD), o null. */
	date: string | null;
	/** El total pagado, en pesos, o null. */
	total: number | null;
	/** efectivo, tarjeta u otro, o null. */
	payment_method: "efectivo" | "tarjeta" | "otro" | null;
	/** El folio o número de ticket, o null. */
	folio: string | null;
	/** Otros datos que pide el portal de la tienda para facturar (Web ID, sucursal, caja…). */
	fields: {
		/** Cómo lo llama el ticket (Web ID, Sucursal…). */
		label: string;
		/** Lo que dice el ticket en ese dato. */
		value: string;
	}[];
	/** El uso del CFDI que se pide, o null: G03 si el régimen del emisor lo permite, si no S01. */
	use: string | null;
	/** Una nota, o null. */
	note: string | null;
	/** El tipo del archivo guardado (image/jpeg, application/pdf…). */
	file_type: string | null;
	/** true si se pagó en efectivo más de $2,000: aunque tenga factura, no es deducible (LISR art. 27 fr. III). */
	cash_over_limit: boolean;
	/** Por pedir: los días que le quedan al mes de la compra, en hora de México (muchas tiendas solo facturan dentro del mes); si no, null. */
	days_left_in_month: number | null;
	/** Cuándo y cómo se pidió (method: fiscalisto, email, portal o manual; to: la tienda o su correo), o null. */
	requested: {
		/** egreso (la factura completa y después una nota de crédito por el anticipo, opción A) o remanente (la factura solo por lo que falta, opción B). */
		method: string | null;
		/** A quién (correos separados por comas). */
		to: string | null;
		/** Cuándo se pidió. */
		at: string | null;
	} | null;
	/** El folio fiscal de la factura que lo cubre, o null. */
	invoice_uuid: string | null;
	/** La factura recibida (sat_…) que lo cubre, si ya llegó con las descargas del SAT, o null. */
	invoice: string | null;
	/** Cuándo quedó facturado, o null. */
	invoiced_at: string | null;
	/** Cuándo se marcó no deducible, o null. */
	non_deductible_at: string | null;
	/** Cuándo se guardó. */
	created_at: string | null;
}

/** Una liga para que el dueño de un emisor suba su CSD y firme con su e.firma (y, con keep_efirma, la guarde para consultar el SAT). */
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
	/** La página también guarda la e.firma (cifrada) para las consultas al SAT del emisor. */
	keep_efirma: boolean;
	/** La página pide solo la e.firma, sin el CSD (para consultar el SAT). */
	efirma_only: boolean;
	/** Cuándo deja de servir la liga. Pida otra cuando quiera. */
	expires_at: string | null;
	/** Cuándo se creó. */
	created_at: string | null;
}

/** Una dirección de su servidor que recibe eventos. */
export interface WebhookEndpoint {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
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
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). La lista con cuándo llega cada uno: [Tipos de evento](https://fiscalisto.com/docs/api/webhooks#tipos-de-evento). */
	events: string[];
	/** enabled: entregando. failing: sus entregas fallan (se apaga tras 5 días así). disabled: apagado. */
	status: "enabled" | "failing" | "disabled";
	/** Por qué se apagó: failing (sus entregas fallaron 5 días seguidos), gone (su servidor contestó 410 Gone) o manual (usted lo apagó). */
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

/** Un evento que se mandó otra vez: a cuántos webhooks salió. Cada entrega es un intento aparte, ahora; véalo en las entregas del webhook. */
export interface EventResend {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "event_resend";
	/** El evento (evt_…) que se mandó otra vez. */
	event: string;
	/** A cuántos webhooks salió. 0 si ninguno encendido escucha ese tipo de evento. */
	deliveries: number;
}

/** Cómo se ven los documentos de un emisor: nombre comercial, estilo y color del PDF, y logo. */
export interface IssuerBranding {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "issuer_branding";
	/** El emisor (iss_…). */
	issuer: string;
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Su nombre comercial: va en grande en el PDF, el correo y la página de la factura; null: la razón social. */
	trade_name: string | null;
	/** Estilo del PDF: clasico, moderno, compacto o minimalista; null: clasico. */
	pdf_style: "clasico" | "moderno" | "compacto" | "minimalista" | null;
	/** Color del PDF (#RRGGBB); null: el de Fiscalisto (#5B48EE). */
	pdf_color: string | null;
	/** Dirección pública del logo; null si no tiene. */
	logo_url: string | null;
}

/** Lo que pasó con un evento en un webhook: su último intento, cuántos lleva y cuándo va el siguiente. */
export interface WebhookDelivery {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "webhook_delivery";
	/** El último intento (whd_…). Úselo en starting_after para la página siguiente. */
	id: string;
	/** El webhook (whe_…). */
	webhook_endpoint: string;
	/** El evento (evt_…). Reenvíelo con POST /v1/events/{id}/resend. */
	event: string;
	/** El tipo del evento (invoice.stamped…). */
	event_type: string | null;
	/** true si su servidor contestó 2xx en el último intento. */
	succeeded: boolean;
	/** El código HTTP que contestó su servidor; null si no se pudo conectar. */
	status: number | null;
	/** Qué falló (tiempo de espera, DNS, o el inicio de su respuesta); null si llegó. */
	error: string | null;
	/** Cuánto tardó su servidor en contestar el último intento. */
	duration_ms: number;
	/** Cuántas veces se ha mandado a este webhook, reenvíos incluidos. */
	attempts: number;
	/** true si el último intento fue un reenvío (POST /v1/events/{id}/resend). */
	resent: boolean;
	/** true si es un evento de prueba (POST /v1/webhook_endpoints/{id}/test); no se reintenta. */
	test: boolean;
	/** Cuándo fue el último intento. */
	created_at: string;
	/** Cuándo va el siguiente reintento automático; null si llegó o ya no hay más. */
	next_retry_at: string | null;
}

/** Lo que dice el SAT de un CFDI: si existe, si está vigente o cancelado y si se puede cancelar, con su emisor y su receptor en las listas del SAT. */
export interface CfdiVerification {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "cfdi_verification";
	/** true en producción (llaves fk_live_), false en pruebas (fk_test_). Lo de pruebas no vale ante el SAT. */
	livemode: boolean;
	/** Folio fiscal que asigna el SAT (UUID del Timbre Fiscal Digital), en mayúsculas. */
	uuid: string;
	/** El RFC del emisor que se consultó. */
	issuer_tax_id: string;
	/** El RFC del receptor que se consultó. */
	receiver_tax_id: string;
	/** Total en la moneda del comprobante (Total). */
	total: number;
	/** De dónde se leyeron el UUID, los RFC y el total: xml, qr o fields. */
	source: "xml" | "qr" | "fields";
	/** Lo que dice el SAT: active (vigente), canceled (cancelado), not_found (no lo tiene: no se timbró, se timbró hace minutos o es de pruebas) o data_mismatch (el UUID existe pero los RFC o el total no coinciden). */
	sat_status: "active" | "canceled" | "not_found" | "data_mismatch";
	/** Si está vigente, cómo se cancela: without_acceptance (sin que el receptor acepte), with_acceptance (el receptor tiene 3 días hábiles para aceptar) o not_cancellable (por ejemplo, tiene documentos relacionados vigentes). null si no está vigente o el SAT no lo dijo. */
	cancellable: "without_acceptance" | "with_acceptance" | "not_cancellable" | null;
	/** Una cancelación en curso o terminada: in_process (esperando al receptor), rejected (el receptor la rechazó), deadline_passed (pasó el plazo y se canceló), accepted o without_acceptance (cancelado con o sin aceptación). null si nadie la pidió. */
	cancellation_status: "in_process" | "rejected" | "deadline_passed" | "accepted" | "without_acceptance" | null;
	/** true si el SAT dice que el emisor está en la lista 69-B como definitivo (EFOS); false si no; null si no lo dijo. */
	issuer_efos: boolean | null;
	/** La respuesta del SAT tal cual (CodigoEstatus, Estado, EsCancelable, EstatusCancelacion, ValidacionEFOS), por si la necesita igual que el SAT. */
	sat: {
		/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
		code: string;
		/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
		state: string;
		/** EsCancelable, tal cual lo dijo el SAT. */
		cancellable: string | null;
		/** EstatusCancelacion, tal cual lo dijo el SAT. */
		cancellation_status: string | null;
		/** ValidacionEFOS: 200 si el emisor no es EFOS, 100 si lo es. */
		efos_validation: string | null;
	};
	/** Lo que trae el XML además (versión, tipo, fechas, nombres, moneda), si mandó xml; null si no. */
	xml: {
		/** La versión del CFDI (4.0 o 3.3). */
		version: string | null;
		/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
		type: string | null;
		/** La fecha de emisión (Fecha), como viene en el XML. */
		issued_at: string | null;
		/** La fecha de timbrado (FechaTimbrado), como viene en el XML. */
		stamped_at: string | null;
		/** El nombre del emisor en el XML. */
		issuer_name: string | null;
		/** El nombre del receptor en el XML. */
		receiver_name: string | null;
		/** Moneda, clave ISO 4217 de c_Moneda (MXN, USD, EUR…). Por omisión MXN. */
		currency: string | null;
	} | null;
	/** Los sellos del XML, si mandó xml de un CFDI 4.0: si el comprobante no se modificó después de sellarse y si el timbre es del SAT. null con qr o fields, o con un CFDI 3.3. */
	seals: CfdiSeals | null;
	/** El emisor en las listas del SAT (69-B, 69-B Bis y art. 69), como GET /v1/sat_lists/{tax_id}, sin costo. Solo cuando el SAT tiene el comprobante (active o canceled); null si no, o si las listas no se pudieron leer. */
	issuer_sat_lists: SatListCheck | null;
	/** El receptor en las listas del SAT, igual que el emisor. */
	receiver_sat_lists: SatListCheck | null;
	/** Cuándo se le preguntó al SAT. */
	checked_at: string;
}

/** Lo que puede pasar: el tipo de cada evento. */
export type EventType = "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.cancellation_failed" | "invoice.paid" | "invoice.partially_paid" | "invoice.email_bounced" | "invoice.email_complained" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "payroll_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "sat_declaration.created" | "sat_declaration.updated" | "sat_refresh.completed" | "sat_refresh.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "quote.withdrawn" | "sales_order.confirmed" | "sales_order.customer_confirmed" | "sales_order.delivered" | "sales_order.paid" | "sales_order.canceled" | "supplier_invoice.received" | "supplier_invoice.approved" | "supplier_invoice.rejected" | "supplier_invoice.scheduled" | "supplier_invoice.paid" | "portal_supplier.approved" | "issuer.ready" | "balance.low" | "usage.high" | "test_clock.ready";

/** Algo que pasó en su cuenta: el objeto completo como quedó. Se manda a sus webhooks firmado (Standard Webhooks). */
export interface EventBase<T extends EventType = EventType, O = unknown> {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "event";
	/** Qué pasó: invoice.stamped, invoice.failed, invoice.canceled, invoice.cancellation_pending, invoice.cancellation_rejected, invoice.cancellation_failed, invoice.paid, invoice.partially_paid, retention.stamped, retention.failed, retention.canceled, invoice_batch.completed, payroll_batch.completed, customer_data_request.completed, sat_download.completed, sat_download.failed, sat_declaration.created, sat_declaration.updated, sat_refresh.completed, sat_refresh.failed, ticket.invoiced, ticket.included_in_global, recurring_invoice.failed, quote.viewed, quote.accepted, quote.changes_requested, quote.rejected, quote.withdrawn, sales_order.confirmed, sales_order.customer_confirmed, sales_order.delivered, sales_order.paid, sales_order.canceled, supplier_invoice.received, supplier_invoice.approved, supplier_invoice.rejected, supplier_invoice.scheduled, supplier_invoice.paid, portal_supplier.approved, issuer.ready, balance.low, usage.high o test_clock.ready. */
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
	| EventBase<"invoice.cancellation_failed", Invoice>
	| EventBase<"invoice.paid", Invoice>
	| EventBase<"invoice.partially_paid", Invoice>
	| EventBase<"invoice.email_bounced", Invoice>
	| EventBase<"invoice.email_complained", Invoice>
	| EventBase<"retention.stamped", Retention>
	| EventBase<"retention.failed", Retention>
	| EventBase<"retention.canceled", Retention>
	| EventBase<"invoice_batch.completed", InvoiceBatch>
	| EventBase<"payroll_batch.completed", PayrollBatch>
	| EventBase<"customer_data_request.completed", CustomerDataRequest>
	| EventBase<"sat_download.completed", SatDownload>
	| EventBase<"sat_download.failed", SatDownload>
	| EventBase<"sat_declaration.created", SatDeclaration>
	| EventBase<"sat_declaration.updated", SatDeclaration>
	| EventBase<"sat_refresh.completed", SatRefresh>
	| EventBase<"sat_refresh.failed", SatRefresh>
	| EventBase<"ticket.invoiced", Ticket>
	| EventBase<"ticket.included_in_global", Ticket>
	| EventBase<"recurring_invoice.failed", RecurringInvoice>
	| EventBase<"quote.viewed", Quote>
	| EventBase<"quote.accepted", Quote>
	| EventBase<"quote.changes_requested", Quote>
	| EventBase<"quote.rejected", Quote>
	| EventBase<"quote.withdrawn", Quote>
	| EventBase<"sales_order.confirmed", SalesOrder>
	| EventBase<"sales_order.customer_confirmed", SalesOrder>
	| EventBase<"sales_order.delivered", SalesOrder>
	| EventBase<"sales_order.paid", SalesOrder>
	| EventBase<"sales_order.canceled", SalesOrder>
	| EventBase<"supplier_invoice.received", SupplierInvoice>
	| EventBase<"supplier_invoice.approved", SupplierInvoice>
	| EventBase<"supplier_invoice.rejected", SupplierInvoice>
	| EventBase<"supplier_invoice.scheduled", SupplierInvoice>
	| EventBase<"supplier_invoice.paid", SupplierInvoice>
	| EventBase<"portal_supplier.approved", PortalSupplier>
	| EventBase<"issuer.ready", Issuer>
	| EventBase<"balance.low", Balance>
	| EventBase<"usage.high", Usage>
	| EventBase<"test_clock.ready", TestClock>;

/** Confirmación de que se borró. */
export interface Deleted {
	/** Identificador del objeto, con su prefijo (iss_, inv_, ret_, cus_, prd_, emp_, bat_, brn_, whs_, stm_, adj_, evt_, whe_). */
	id: string;
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: string;
	/** Siempre true. */
	deleted: true;
}

/** Todos los errores tienen esta forma. */
export interface ApiError {
	/** El error: type, code, message (en el idioma pedido), param (el campo a corregir), doc_url y request_id. */
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

export interface PurchaseReceiptList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: PurchaseReceipt[];
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

export interface PayrollBatchList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: PayrollBatch[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ImssMovementList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: ImssMovement[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface EmployeeDeductionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: EmployeeDeduction[];
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

export interface BranchList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Branch[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface CostCenterList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: CostCenter[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface PriceListList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: PriceList[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface CustomerGroupList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: CustomerGroup[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ExpensePersonList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: ExpensePerson[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ExpenseReportList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: ExpenseReport[];
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

export interface SatMailboxMessageList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatMailboxMessage[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatFindingList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatFinding[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatFindingCounterpartyList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatFindingCounterparty[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface MaterialitySupplierList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: MaterialitySupplier[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface MaterialityInvoiceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: MaterialityInvoice[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface WarehouseList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Warehouse[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface StockLevelList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: StockLevel[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface StockMovementList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: StockMovement[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface StockAdjustmentList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: StockAdjustment[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ProductionOrderList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: ProductionOrder[];
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

export interface MemberList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Member[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface InvitationList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Invitation[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface RoleList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Role[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface PermissionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Permission[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface ExportList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: Export[];
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

export interface SatRetentionList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatRetention[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface PortalSupplierList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: PortalSupplier[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SupplierInvoiceList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SupplierInvoice[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatRefreshList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatRefresh[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface SatDeclarationList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SatDeclaration[];
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

export interface ManualJournalEntryList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: ManualJournalEntry[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface FixedAssetList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: FixedAsset[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface LedgerBankAccountList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: LedgerBankAccount[];
	/** true si hay más: pida la siguiente con starting_after igual al id del último. */
	has_more: boolean;
	/** La ruta de esta lista. */
	url: string;
}

export interface AccountingBankMovementList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: AccountingBankMovement[];
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

export interface SalesOrderList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: SalesOrder[];
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

export interface WebhookDeliveryList {
	/** Qué tipo de objeto es («invoice», «customer»…). */
	object: "list";
	/** Los objetos de esta página. */
	data: WebhookDelivery[];
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
	/** Sucursal (brn_…) desde donde se factura: su código postal va en LugarExpedicion, su dirección en el PDF y, si las tiene, sus series. Sin ella, el domicilio fiscal del emisor (la Matriz). */
	branch?: string;
	/** Su centro de costo (ccn_…): la obra, proyecto, sucursal o área a la que pertenece, para ver ingresos y gastos por centro en Reportes. No cambia el CFDI. Sus notas de crédito lo toman solas. */
	cost_center?: string;
	/** Almacén (whs_…) de donde salen sus productos con track_stock. Por omisión, el de su sucursal (o el de la Matriz). */
	warehouse?: string;
	/** El cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos. Obligatorio salvo en un traslado (type T), cuyo receptor es el propio emisor. */
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
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
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
		/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
		hydrocarbon?: {
			/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
			permit_type: string;
			/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
			permit_number: string;
			/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
			subproduct: string;
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
	/** Solo en un traslado (type T) sin carta_porte: la regla de la RMF 2026 que lo permite. 2.7.7.2.1 mercancías propias en un traslado local (no medicamentos, hidrocarburos ni mercancías para despacho aduanero); 2.7.7.2.2 paquetería o mensajería en primera o última milla, un concepto por paquete con su número de guía en sku; 2.7.7.2.3 grúa de arrastre o salvamento local, relacionando con related (05) la factura de ingreso del servicio. Mandarlo es declarar que el traslado no transita por ningún tramo de jurisdicción federal. Los conceptos van con unit_price 0 y taxability 01 (por omisión en un traslado). */
	carta_porte_exemption?: "2.7.7.2.1" | "2.7.7.2.2" | "2.7.7.2.3";
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
			/** Clave de la entidad (ClaveEntidad): la del estado (JAL, QUE…), NAC (nacional) o la circunscripción CR1 a CR5; estas seis no van con ámbito Local. */
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
	/** Complemento de donatarias: un recibo de donativo. El emisor debe ser donataria (tax_system 603) con su oficio en donation_authorization (POST /v1/issuers/{id}). */
	donation?: {
		/** true si el donativo es en especie (bienes): va con forma de pago 12 (dación en pago) y un concepto por cada tipo de bien. */
		in_kind?: boolean;
		/** true si el donante ya había deducido los bienes que dona: el recibo dice que el donativo no es deducible. */
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
	/** Exportación (Exportacion), c_Exportacion: 01 no aplica (por omisión), 02 definitiva con clave A1 (lleva comercio_exterior), 03 temporal (sin él), 04 definitiva con clave distinta a A1 o sin enajenación (con o sin comercio_exterior; con él, incoterm opcional). */
	export?: "01" | "02" | "03" | "04";
	/** Complemento de comercio exterior 2.0. */
	comercio_exterior?: {
		/** Motivo de traslado (MotivoTraslado), c_MotivoTraslado, solo en un traslado: 01 mercancías facturadas con anterioridad (relacione la factura de venta en related), 02 reubicación de mercancías propias, 03 consignación, 04 para posterior enajenación, 05 propiedad de terceros (con owners), 99 otros. */
		motive?: "99" | "01" | "02" | "03" | "04" | "05";
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
			/** Fracción arancelaria (FraccionArancelaria), 10 dígitos con el NICO, vigente en c_FraccionArancelaria (búsquela en `GET /v1/sat_catalogs/customs_tariffs`); una que no lo esté se rechaza antes de timbrar. */
			tariff?: string;
			/** Unidad aduana (UnidadAduana), c_UnidadAduana; 99 en un servicio. Con `tariff` puede omitirse: va la UMT de la fracción en el catálogo del SAT (otra la rechaza el SAT con CCE161). */
			unit?: string;
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
		/** Año (Año): el de la fecha de la factura o hasta cinco años antes (CFDI40136). */
		year: number;
		/** Solo emisores con régimen 603 (donatarias y asociaciones): true conserva la descripción, claves, unidad y cantidad de cada concepto en vez de «Venta», 01010101, ACT. */
		keep_concepts?: boolean;
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
	/** Condiciones de pago (CondicionesDePago), hasta 1,000 caracteres sin «|»: «Crédito a 30 días», «50 % anticipo». Van en el XML y en el PDF; solo en ingresos y egresos. No cambian cuándo vence (due_date usa los días de crédito del cliente). */
	payment_terms?: string;
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
	/** Solo en POST /v1/invoices. true: responde 202 en cuanto la factura queda guardada con su folio (status processing) y la timbra después de responder; invoice.stamped o invoice.failed dicen cómo terminó. En las demás rutas que reciben una factura no cambia nada. */
	async?: boolean;
}

/** Un recibo de nómina que calculó su sistema, con todos sus conceptos e importes: se timbra tal cual. */
export interface ExternalPayrollReceiptCreate {
	/** El emisor (patrón) del recibo; sin él, el único emisor de su cuenta en este modo. */
	issuer?: string;
	/** TipoNomina: O ordinaria (periodicidad 01–10) o E extraordinaria (periodicidad 99). */
	type: "O" | "E";
	/** PeriodicidadPago (c_PeriodicidadPago). */
	periodicity: string;
	/** FechaInicialPago, FechaFinalPago y FechaPago. */
	period: {
		/** Primer día del periodo (FechaInicialPago), AAAA-MM-DD. */
		start: string;
		/** Último día del periodo (FechaFinalPago), AAAA-MM-DD. */
		end: string;
		/** Fecha de pago (FechaPago), AAAA-MM-DD. Por omisión el último día del periodo. */
		payment_date: string;
	};
	/** NumDiasPagados: de 0.001 a 36160, hasta 3 decimales. */
	days: number;
	/** El patrón (Emisor del complemento): registro patronal y CURP si es persona física. */
	employer?: {
		/** Registro patronal. Sin el campo: el del emisor cuando el contrato es 01–08. null: sin registro patronal. */
		registration?: string | null;
		/** CURP del patrón persona física. Sin el campo: la guardada en el emisor. */
		curp?: string | null;
		/** RfcPatronOrigen. */
		origin_tax_id?: string;
		/** EntidadSNCF, solo para entidades adheridas al SNCF. */
		sncf?: {
			/** OrigenRecurso: IP, IF o IM. */
			resource_origin: string;
			/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
			own_resource_amount?: number;
		};
	};
	/** El empleado (Receptor y Nomina/Receptor) con los datos de su sistema de nómina; no usa ni cambia los empleados de Fiscalisto. */
	employee: {
		/** RFC del empleado. XAXX010101000 si falleció: con su nombre y su CURP. */
		tax_id: string;
		/** Nombre. */
		name: string;
		/** Código postal del domicilio fiscal, 5 dígitos, como en la constancia de situación fiscal. El de un emisor es el lugar de expedición (LugarExpedicion) de sus comprobantes. */
		zip: string;
		/** CURP, 18 caracteres. */
		curp: string;
		/** NumEmpleado. */
		number: string;
		/** Para send_email; no va en el XML. */
		email?: string | null;
		/** Número de seguridad social (NumSeguridadSocial), 11 dígitos. */
		social_security_number?: string;
		/** FechaInicioRelLaboral. */
		start_date?: string;
		/** Antigüedad (P52W o P1Y2M3D). Sin el campo y con registro patronal: semanas desde start_date hasta el fin del periodo (días si es menos de una semana, P3D). */
		seniority?: string;
		/** Tipo de contrato (TipoContrato), c_TipoContrato. Por omisión 01, por tiempo indeterminado. */
		contract_type: string;
		/** Tipo de régimen (TipoRegimen): 02 sueldos y salarios. */
		regime_type: string;
		/** true si es sindicalizado (Sindicalizado). */
		unionized?: boolean;
		/** Tipo de jornada (TipoJornada), c_TipoJornada. Por omisión 01, diurna. */
		workday_type?: string;
		/** Clase de riesgo del puesto ante el IMSS (RiesgoPuesto), 1 a 5. Por omisión 1. */
		risk_class?: string;
		/** Departamento (Departamento). */
		department?: string;
		/** Puesto (Puesto). */
		position?: string;
		/** SalarioBaseCotApor. */
		contribution_base_salary?: number;
		/** SalarioDiarioIntegrado. */
		integrated_daily_salary?: number;
		/** ClaveEntFed (c_Estado): JAL, CMX, NLE… */
		state: string;
		/** Banco (c_Banco); no va con una CLABE. */
		bank?: string;
		/** CuentaBancaria: CLABE de 18 dígitos, tarjeta o cuenta. */
		bank_account?: string;
		/** SubContratacion: el porcentaje suma 100. */
		subcontracting?: {
			/** RFC (Rfc), 12 caracteres una persona moral y 13 una física. */
			tax_id: string;
			/** PorcentajeTiempo. */
			percentage: number;
		}[];
	};
	/** Percepciones (Percepcion): sueldo y demás, gravado y exento. */
	perceptions?: {
		/** TipoPercepcion (c_TipoPercepcion): 001 sueldos, 002 aguinaldo… */
		type: string;
		/** Clave del patrón (3 a 15 caracteres). */
		key: string;
		/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
		concept: string;
		/** ImporteGravado. */
		taxed: number;
		/** ImporteExento. */
		exempt: number;
		/** HorasExtra: solo con la percepción 019. */
		overtime?: {
			/** Días con horas extra (Dias). */
			days: number;
			/** c_TipoHoras: 01 dobles, 02 triples, 03 simples. */
			hours_type: string;
			/** Horas extra (HorasExtra). */
			hours: number;
			/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
			amount_paid: number;
		}[];
		/** AccionesOTitulos: solo con la percepción 045. */
		stock_options?: {
			/** Valor de mercado (ValorMercado). */
			market_value: number;
			/** Precio al otorgarse (PrecioAlOtorgarse). */
			grant_price: number;
		};
	}[];
	/** SeparacionIndemnizacion: con las percepciones 022, 023 o 025. */
	separation?: {
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		total_paid: number;
		/** NumAñosServicio. */
		years_of_service: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		last_monthly_salary: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		accumulable_income: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		non_accumulable_income: number;
	};
	/** JubilacionPensionRetiro: con las percepciones 039 o 044. */
	retirement?: {
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		total_one_payment?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		total_installment?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		daily_amount?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		accumulable_income: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		non_accumulable_income: number;
	};
	/** Deducciones (Deduccion): ISR, cuotas IMSS y demás. */
	deductions?: {
		/** TipoDeduccion (c_TipoDeduccion): 001 IMSS, 002 ISR, 010 Infonavit… */
		type: string;
		/** El archivo .key en base64 (puede traer el prefijo data:). */
		key: string;
		/** Concepto de los egresos (IntegracEgresos/ConceptoS), hasta 100 caracteres. */
		concept: string;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		amount: number;
	}[];
	/** Otros pagos (OtroPago): subsidio para el empleo. */
	other_payments?: {
		/** TipoOtroPago (c_TipoOtroPago): 002 subsidio para el empleo… */
		type: string;
		/** El archivo .key en base64 (puede traer el prefijo data:). */
		key: string;
		/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
		concept: string;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		amount: number;
		/** SubsidioCausado: solo con el 002. */
		subsidy_caused?: number;
		/** CompensacionSaldosAFavor: solo con el 004. */
		balance_compensation?: {
			/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
			balance: number;
			/** Año (Ejercicio). */
			year: number;
			/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
			remaining: number;
		};
	}[];
	/** Incapacidades: con la percepción 014 o la deducción 006. */
	disabilities?: {
		/** Días pagados (NumDiasPagados). Por omisión, todos los del periodo que le tocan. */
		days: number;
		/** Tipo de comprobante (TipoDeComprobante): I ingreso, E egreso, P pago, T traslado, N nómina. */
		type: string;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		amount?: number;
	}[];
	/** Los totales que calculó su sistema: Fiscalisto los compara al centavo con las líneas y rechaza el recibo si no cuadran. */
	totals: {
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		perceptions: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		deductions: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		other_payments: number;
		/** Neto: percepciones más otros pagos menos deducciones. */
		net: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		salaries?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		separation?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		retirement?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		taxed?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		exempt?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		taxes_withheld?: number;
		/** Pesos con hasta 2 decimales, como se timbran: Fiscalisto no los redondea. */
		other_deductions?: number;
	};
	/** Sus ids: el empleado y la corrida de nómina. payroll_run_id es obligatorio en un recibo extraordinario. */
	references?: {
		/** El id del empleado en su sistema. */
		employee_id?: string;
		/** El id de la corrida de nómina en su sistema. */
		payroll_run_id?: string;
	};
	/** El recibo vigente (inv_… o UUID) que este sustituye: relación 04 y se cancela con motivo 01. */
	replaces?: string;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface UpdateAccountParams {
	/** La versión de la API de la cuenta: la que reciben sus solicitudes sin Fiscalisto-Version y sus webhooks sin api_version propio. Pruebe antes la nueva con el encabezado. */
	api_version: string;
}

export interface ResetTestDataParams {
	/** true (por omisión) para dejarle a cada emisor de pruebas 2 clientes y 3 productos de ejemplo. false para dejarlo vacío. */
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
	/** Donataria autorizada (régimen 603): el oficio del SAT que la autoriza a recibir donativos deducibles (o su renovación). Va en cada recibo de donativo (`donation` de POST /v1/invoices); null lo quita. El emisor debe tener tax_system 603. En pruebas sirve cualquier número y una fecha pasada. */
	donation_authorization?: {
		/** Número del oficio de autorización, hasta 100 caracteres. */
		number: string;
		/** Fecha del oficio, AAAA-MM-DD; no puede ser futura. */
		date: string;
	} | null;
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
	/** Donataria autorizada (régimen 603): el oficio del SAT que la autoriza a recibir donativos deducibles (o su renovación). Va en cada recibo de donativo (`donation` de POST /v1/invoices); null lo quita. El emisor debe tener tax_system 603. En pruebas sirve cualquier número y una fecha pasada. */
	donation_authorization?: {
		/** Número del oficio de autorización, hasta 100 caracteres. */
		number: string;
		/** Fecha del oficio, AAAA-MM-DD; no puede ser futura. */
		date: string;
	} | null;
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

export interface UpdateIssuerBrandingParams {
	/** Su nombre comercial, si se presenta con otra marca: va en grande en el PDF, en el correo y en la página de la factura. null: la razón social. */
	trade_name?: string | null;
	/** Estilo del PDF: clasico (por omisión), moderno (encabezado y total con color, renglones alternados), compacto (letra chica, márgenes cortos) o minimalista (sin rellenos, el color solo en el total). */
	pdf_style?: "clasico" | "moderno" | "compacto" | "minimalista" | null;
	/** Color del PDF, como #2563EB. null: el de Fiscalisto (#5B48EE). */
	pdf_color?: string | null;
}

export interface UploadIssuerLogoParams {
	/** El logo, PNG o JPG de hasta 1 MB, en base64 (con o sin el prefijo data:image/png;base64,). Uno muy grande se reduce para el PDF. */
	file: string;
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
	/** true para que la página también guarde (cifrada) la e.firma de su cliente, con su autorización, y pueda pedir al SAT sus facturas (POST /v1/sat_downloads), sus declaraciones (/v1/sat_declarations), su opinión de cumplimiento, constancia y buzón tributario. Sin esto la e.firma solo firma el contrato con el PAC y no se guarda. */
	keep_efirma?: boolean;
	/** true para pedir solo la e.firma, sin el CSD: para consultar el SAT por su cliente sin timbrar por él. Implica keep_efirma. El emisor sigue sin poder timbrar hasta que suba su CSD. */
	efirma_only?: boolean;
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
	/** RFC del cliente o su id (cus_…). */
	customer?: string;
	/** Facturas de ingreso por lo que deben: unpaid, partial, open (unpaid o partial) o paid. */
	payment_status?: "unpaid" | "partial" | "open" | "paid";
	/** Creadas desde, en ISO 8601. Un día solo (2026-10-01) cuenta desde su inicio en hora de la Ciudad de México. */
	created_gte?: string;
	/** Creadas hasta, en ISO 8601. Un día solo (2026-10-31) incluye el día completo en hora de la Ciudad de México. */
	created_lte?: string;
	/** Solo las de este centro de costo (ccn_…), o none para las que no tienen. */
	cost_center?: string;
}

/** Los parámetros de GET /v1/invoices/{id}. */
export interface GetInvoiceParams {
	/** Con un UUID en vez del id, el emisor (iss_…) si la cuenta tiene varios. */
	issuer?: string;
	/** true para preguntar su estado al SAT ahora (cancelaciones en espera). */
	refresh?: boolean;
}

export interface UpdateInvoiceParams {
	/** Su centro de costo (ccn_…), o null para quitárselo. Solo facturas, notas de crédito y recibos de nómina timbrados. */
	cost_center?: string | null;
	/** Nota para el cliente en el PDF (hasta 1,000 caracteres), o null para quitarla. No va en el XML: la factura timbrada no cambia y el siguiente PDF (GET /v1/invoices/{id}/pdf, el correo) ya la lleva. Cada cambio queda en el historial de la factura en Fiscalisto. */
	notes?: string | null;
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

/** Los parámetros de GET /v1/invoices/{id}/cancellation_receipt. */
export interface GetInvoiceCancellationReceiptParams {
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
	/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
	motive?: "01" | "02" | "03" | "04";
	/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
	substitution?: string;
}

export interface MarkInvoicePaidParams {
	/** El día en que el cliente pagó (AAAA-MM-DD, no antes de la factura ni después de hoy); hoy si no se indica. Queda en paid_on. */
	paid_on?: string;
}

/** Los parámetros de GET /v1/receivables. */
export interface ListReceivablesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo este cliente: su RFC o su id (cus_…). */
	customer?: string;
}

/** Los parámetros de GET /v1/cash_forecast. */
export interface GetCashForecastParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Escenario: sus clientes le pagan estos días después (0 a 120). */
	customers_pay_days_later?: number;
	/** Escenario: usted paga a sus proveedores estos días después (0 a 120). */
	pay_suppliers_days_later?: number;
	/** true cuenta lo que lleva más de 90 días de atraso (por omisión no). */
	include_doubtful?: boolean;
	/** false deja fuera las facturas recurrentes que aún no se emiten. */
	include_recurring?: boolean;
	/** Escenario: por ciento que cambian sus recurrentes (−100 a 100). */
	recurring_sales_change?: number;
}

export interface UpdateCashForecastParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** El saldo de hoy en sus cuentas de banco; null lo quita. */
	starting_balance?: {
		/** Lo que tiene en el banco, en pesos. */
		amount: number;
		/** El día de ese saldo (AAAA-MM-DD); hoy si no se indica. */
		date?: string;
	} | null;
	/** Lo menos que quiere tener: cada semana debajo trae un aviso. 0 para ninguno. */
	minimum_balance?: number;
}

export interface CreateCashForecastItemParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Qué es: «Renta», «Crédito del banco». */
	description: string;
	/** inflow si es dinero que entra; outflow si sale. */
	direction: "inflow" | "outflow";
	/** Cuánto, en pesos. */
	amount: number;
	/** El día (o la primera vez, si se repite). */
	date: string;
	/** once (por omisión), weekly, biweekly (cada dos semanas) o monthly. */
	frequency?: "once" | "weekly" | "biweekly" | "monthly";
	/** El último día en que se repite; null sin fin. */
	until?: string | null;
}

export interface UpdateCashForecastItemParams {
	/** Qué es: «Renta», «Crédito del banco». */
	description?: string;
	/** inflow si es dinero que entra; outflow si sale. */
	direction?: "inflow" | "outflow";
	/** Cuánto, en pesos. */
	amount?: number;
	/** El día (o la primera vez, si se repite). */
	date?: string;
	/** once (por omisión), weekly, biweekly (cada dos semanas) o monthly. */
	frequency?: "once" | "weekly" | "biweekly" | "monthly";
	/** El último día en que se repite; null sin fin. */
	until?: string | null;
}

export interface AdjustCashForecastParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** El renglón (lines[].line de GET /v1/cash_forecast). */
	line: string;
	/** Otro día para ese renglón; null el estimado. */
	date?: string | null;
	/** Otro monto, en pesos; null el estimado. */
	amount?: number | null;
	/** true para no contarlo. */
	excluded?: boolean;
	/** Por qué (lo ve quien abra la semana en la app). */
	note?: string | null;
	/** true lo regresa a lo estimado; lo demás se ignora. */
	reset?: boolean;
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

export interface CreatePurchaseReceiptParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** La foto (JPG, PNG o WebP) o el PDF, en base64; hasta 8 MB. */
	file: string;
	/** image/jpeg, image/png, image/webp o application/pdf. */
	file_type: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
	/** Lo que dice el código QR del ticket, si ya lo leyó (suele ser la liga del portal). */
	qr_text?: string;
	/** El nombre de la tienda. */
	store_name?: string | null;
	/** El RFC de la tienda (el que factura). */
	store_tax_id?: string | null;
	/** El día de la compra (AAAA-MM-DD). */
	date?: string | null;
	/** El total pagado, en pesos. */
	total?: number | null;
	/** efectivo, tarjeta u otro. */
	payment_method?: "efectivo" | "tarjeta" | "otro" | null;
	/** El folio o número de ticket. */
	folio?: string | null;
	/** Otros datos que pide el portal de la tienda (Web ID, sucursal, caja…), hasta 8. */
	fields?: {
		/** Cómo lo llama el ticket (Web ID, Sucursal…). */
		label: string;
		/** Lo que dice el ticket en ese dato. */
		value: string;
	}[];
	/** La dirección del portal de facturación de la tienda (o la liga de autofactura de su QR). */
	portal_url?: string | null;
	/** El correo de facturación de la tienda. */
	store_email?: string | null;
	/** El uso del CFDI (G03, I01…). Por omisión G03 si el régimen del emisor lo permite. */
	use?: string | null;
	/** Una nota para su equipo. */
	note?: string | null;
}

/** Los parámetros de GET /v1/purchase_receipts. */
export interface ListPurchaseReceiptsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** pending, requested, invoiced o non_deductible. */
	status?: "pending" | "requested" | "invoiced" | "non_deductible";
}

export interface UpdatePurchaseReceiptParams {
	/** El nombre de la tienda. */
	store_name?: string | null;
	/** El RFC de la tienda (el que factura). */
	store_tax_id?: string | null;
	/** El día de la compra (AAAA-MM-DD). */
	date?: string | null;
	/** El total pagado, en pesos. */
	total?: number | null;
	/** efectivo, tarjeta u otro. */
	payment_method?: "efectivo" | "tarjeta" | "otro" | null;
	/** El folio o número de ticket. */
	folio?: string | null;
	/** Otros datos que pide el portal de la tienda (Web ID, sucursal, caja…), hasta 8. */
	fields?: {
		/** Cómo lo llama el ticket (Web ID, Sucursal…). */
		label: string;
		/** Lo que dice el ticket en ese dato. */
		value: string;
	}[];
	/** La dirección del portal de facturación de la tienda (o la liga de autofactura de su QR). */
	portal_url?: string | null;
	/** El correo de facturación de la tienda. */
	store_email?: string | null;
	/** El uso del CFDI (G03, I01…). Por omisión G03 si el régimen del emisor lo permite. */
	use?: string | null;
	/** Una nota para su equipo. */
	note?: string | null;
}

export interface RequestPurchaseReceiptInvoiceParams {
	/** fiscalisto (la tienda factura con Fiscalisto: se timbra al momento), email (le mandamos a la tienda sus datos y la foto), portal o manual (usted la pidió; solo se marca pedida). */
	method: "fiscalisto" | "email" | "portal" | "manual";
	/** email: el correo de la tienda. Por omisión, store_email. */
	to?: string;
	/** email: unas líneas para la tienda. */
	message?: string;
	/** email y fiscalisto: el correo al que la tienda manda la factura. Por omisión, el correo de respuesta del emisor. */
	reply_to?: string;
}

export interface MarkPurchaseReceiptInvoicedParams {
	/** La factura recibida que lo cubre: su id (sat_…) o su folio fiscal (UUID). Sin ella, solo se marca facturado. */
	invoice?: string;
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
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** La factura (inv_… o su UUID). */
	invoice: string;
	/** Importe de la nota antes de impuestos: Fiscalisto agrega el IVA y las retenciones de la factura en la misma proporción. */
	amount: number;
	/** Descripción del concepto de la nota (Descripcion), como «Descuento por pronto pago». */
	description?: string;
	/** Forma de pago (FormaPago), clave de c_FormaPago: 01 efectivo, 03 transferencia, 04 tarjeta de crédito, 28 débito, 99 por definir… Obligatoria con PUE; con PPD es 99. */
	payment_form: string;
	/** Tipo de relación (TipoRelacion) con la factura: 01 nota de crédito (por omisión) o 03 devolución de mercancía. */
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
	/** El cliente (Receptor): el id de uno de su catálogo (cus_…) o sus datos. Obligatorio salvo en un traslado (type T), cuyo receptor es el propio emisor. */
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
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
	/** RFC del cliente o su id (cus_…). */
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
	/** Clave de la retención (CveRetenc), c_CveRetenc: 01 servicios profesionales, 05 arrendamiento, 14 dividendos, 16 intereses, 18 pagos al extranjero… Las claves 06, 14 a 24 llevan su complemento, como lo pide el catálogo del SAT (share_sale con 06 y 19, dividends con 14, distributable_remainder con 15, interest, trust_lease, foreign_payment, prize, trust, retirement_plan, mortgage_interest, financial_derivatives); 01, 02, 04 y 05 llevan foreign_payment cuando el receptor es extranjero; la 26 (plataformas tecnológicas) lleva platform, y sus totals y taxes se calculan de las operaciones. 27 y 28 no se pueden emitir aquí. */
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
	totals?: {
		/** Monto total de la operación (MontoTotOperacion). */
		operation: number;
		/** Monto gravado (MontoTotGrav). Por omisión, operation menos exempt. */
		taxed?: number;
		/** Monto exento (MontoTotExent). Por omisión 0. */
		exempt?: number;
	};
	/** Impuestos del comprobante, por tipo. */
	taxes?: {
		/** Impuesto: isr, iva o ieps (ImpuestoRet 001, 002, 003). */
		tax: string;
		/** Base del impuesto retenido (BaseRet). */
		base: number;
		/** Monto retenido (MontoRet). */
		amount: number;
		/** Tipo de pago de la retención (TipoPagoRet): 01 definitivo IVA, 02 definitivo IEPS, 03 definitivo ISR, 04 provisional ISR. Por omisión el usual de cada impuesto. */
		payment_type?: string;
	}[];
	/** Complemento de servicios de plataformas tecnológicas (ServiciosPlataformasTecnologicas 1.0), obligatorio con code 26: una constancia por mes, receptor y tipo de servicio. totals y taxes se calculan de services con las tasas del SAT (ISR de LISR 113-A y LIF 2026 art. 25; IVA 50% o 100%; IEPS en apuestas); si los manda, deben coincidir. */
	platform?: {
		/** Tipo de servicio (TipoDeServ), c_TipoDeServ: 01 transporte de pasajeros, 02 entrega de alimentos, 03 entrega de bienes, 04 hospedaje, 05 comercio de bienes, 06 otros servicios, 07 a 09 servicios digitales de extranjeros, 11 apuestas y sorteos (desde 2026). */
		type: string;
		/** Cada cuánto paga la plataforma (Periodicidad): 01 semanal, 02 mensual (por omisión), 03 diaria, 04 quincenal, 05 otra. */
		periodicity?: string;
		/** true si la persona física optó por que el ISR retenido sea pago definitivo (LISR 113-B): TipoPagoRet 03 en lugar de 04. */
		isr_definitive?: boolean;
		/** true si se le deposita en una cuenta en el extranjero: se retiene el 100% del IVA (LIF 2026 art. 25-IX-c). */
		foreign_account?: boolean;
		/** Cada operación (DetallesDelServicio), hasta 5,000. Lo pagado en efectivo (payment_form 01) va en la constancia pero no en las bases. */
		services: {
			/** Fecha en que el cliente pagó (FechaServ), AAAA-MM-DD, dentro del mes del periodo. */
			date: string;
			/** Forma de pago de la operación (FormaPagoServ), c_FormaPagoServ: 01 efectivo, 02 transferencia, 03 tarjeta de crédito, 04 monedero, 05 dinero electrónico, 06 débito, 07 tarjeta de servicios, 08 intermediario de pagos, 09 premios o bonificaciones. */
			payment_form: string;
			/** Precio sin IVA (PrecioServSinIVA). */
			price: number;
			/** Tasa del impuesto trasladado (TasaCuota): 0.16 (por omisión), 0.08 o 0 de IVA; 0.5 de IEPS solo con type 11, donde cada jugada va dos veces: una operación con su IVA y otra con su IEPS (el SAT pide un impuesto por operación). Sin tasa en premios (09), que desde 2026 no suman en totals. */
			rate?: number | string | null;
			/** Subtipo (SubTipServ), c_SubTipoServ: con type 01, 01 personal (por omisión), 02 compartido, 03 plus o 04 cancelación; con type 11, 08 apuestas (por omisión) o 09 sorteos. */
			subtype?: string | null;
			/** RFC (persona física) del tercero autorizado que prestó el servicio (RFCTerceroAutorizado). */
			authorized_tax_id?: string | null;
			/** Comisión de la plataforma por la operación (ComisionDelServicio): amount mayor que cero y percent opcional (0.001 a 1). Obligatoria en cada operación con IVA; no va en premios ni en las de IEPS. */
			commission?: {
				/** Importe. */
				amount: number;
				/** El porcentaje de la comisión sobre el precio, de 0.001 a 1 (0.25 es 25%). Opcional. */
				percent?: number | null;
			} | null;
			/** Contribución gubernamental pagada, como el impuesto sobre hospedaje (ContribucionGubernamental): amount de al menos 1.00 y state (01 a 32). */
			contribution?: {
				/** Importe. */
				amount: number;
				/** Entidad federativa donde trabaja (ClaveEntFed): JAL, CMX, NLE… */
				state: string;
			} | null;
		}[];
	};
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
	/** Complemento de pagos a extranjeros: obligatorio con code 18, y con 01, 02, 04 y 05 cuando el receptor es extranjero. */
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
	/** Complemento de dividendos con su nodo Remanente (remanente distribuible), obligatorio con code 15. Si no lo manda, va sin proporción. */
	distributable_remainder?: {
		/** Porcentaje de participación del integrante o socio en el remanente (ProporcionRem), opcional. */
		proportion?: number | null;
	};
	/** Complemento de arrendamiento en fideicomiso (Arrendamientoenfideicomiso 1.0), obligatorio con code 17. */
	trust_lease?: {
		/** Pago provisional que el fiduciario efectuó al arrendador en el periodo (PagProvEfecPorFiduc). */
		trustee_payment: number;
		/** Rendimientos del periodo por el arrendamiento de los bienes (RendimFideicom). */
		income: number;
		/** Deducciones del arrendamiento en el periodo (DeduccCorresp). */
		deductions: number;
		/** Monto total retenido del arrendamiento en el periodo (MontTotRet). */
		withheld_total?: number | null;
		/** Resultado fiscal distribuido por FIBRAS (MontResFiscDistFibras). */
		fibra_result?: number | null;
		/** Monto de otros conceptos distribuidos (MontOtrosConceptDistr). */
		other_amount?: number | null;
		/** Qué son los otros conceptos distribuidos (DescrMontOtrosConceptDistr); obligatoria con other_amount. */
		other_description?: string | null;
	};
	/** Complemento de enajenación de acciones u operaciones de valores (EnajenaciondeAcciones 1.0), obligatorio con code 06 y 19. */
	share_sale?: {
		/** Descripción del contrato de intermediación (ContratoIntermediacion). */
		contract: string;
		/** Ganancia obtenida (Ganancia). */
		gain: number;
		/** Pérdida (Perdida). */
		loss: number;
	};
	/** Complemento de premios (Premios 1.0), obligatorio con code 20. Sus montos son los de totals. */
	prize?: {
		/** Entidad federativa donde se paga el premio (EntidadFederativa), c_EntidadesFederativas de catRetenciones: 01 Aguascalientes … 09 Ciudad de México … 32 Zacatecas. */
		state: string;
	};
	/** Complemento de fideicomisos que no realizan actividades empresariales (Fideicomisonoempresarial 1.0), obligatorio con code 21. */
	trust?: {
		/** Ingresos o entradas del fideicomiso en el periodo (IngresosOEntradas) y la parte del receptor. */
		income: {
			/** Concepto de los ingresos (IntegracIngresos/Concepto), hasta 100 caracteres. */
			concept: string;
			/** Ingresos totales del fideicomiso en el periodo (MontTotEntradasPeriodo). */
			total: number;
			/** Parte proporcional de los ingresos acumulables del receptor (PartPropAcumDelFideicom). */
			share: number;
			/** Proporción de participación del receptor según el contrato (PropDelMontTot). */
			proportion: number;
		};
		/** Deducciones o salidas del fideicomiso en el periodo (DeduccOSalidas) y la parte del receptor. */
		deductions: {
			/** Concepto de los egresos (IntegracEgresos/ConceptoS), hasta 100 caracteres. */
			concept: string;
			/** Egresos totales del fideicomiso en el periodo (MontTotEgresPeriodo). */
			total: number;
			/** Parte proporcional de las deducciones autorizadas del receptor (PartPropDelFideicom). */
			share: number;
			/** Proporción de participación del receptor según el contrato (PropDelMontTot). */
			proportion: number;
		};
		/** Retención efectuada al fideicomiso (RetEfectFideicomiso). */
		withholding: {
			/** Monto de la retención (MontRetRelPagFideic). */
			amount: number;
			/** Descripción de la retención (DescRetRelPagFideic), hasta 100 caracteres. */
			description: string;
		};
	};
	/** Complemento de planes personales de retiro (Planesderetiro 1.1), obligatorio con code 22: lo del año anterior. */
	retirement_plan?: {
		/** true si el plan es del sistema financiero (SistemaFinanc). */
		financial_system: boolean;
		/** Aportaciones actualizadas del año anterior (MontTotAportAnioInmAnterior). */
		contributions_last_year?: number | null;
		/** Intereses reales devengados o percibidos el año anterior (MontIntRealesDevengAniooInmAnt). */
		real_interest: number;
		/** true si hubo retiros antes de cumplir los requisitos de permanencia (HuboRetirosAnioInmAntPer). */
		early_withdrawals: boolean;
		/** Monto retirado antes de cumplir la permanencia (MontTotRetiradoAnioInmAntPer); obligatorio con early_withdrawals. */
		early_withdrawn?: number | null;
		/** Monto exento de lo retirado el año anterior (MontTotExentRetiradoAnioInmAnt). */
		exempt_withdrawn?: number | null;
		/** Excedente del monto exento de lo retirado el año anterior (MontTotExedenteAnioInmAnt). */
		excess_withdrawn?: number | null;
		/** true si hubo retiros el año anterior (HuboRetirosAnioInmAnt). */
		withdrawals: boolean;
		/** Monto retirado el año anterior (MontTotRetiradoAnioInmAnt); obligatorio con withdrawals. */
		withdrawn?: number | null;
		/** Número de referencia, contrato o cuenta del cliente (NumReferencia). */
		reference?: string | null;
		/** Aportaciones o depósitos (AportacionesODepositos), uno por tipo y hasta tres. */
		contributions?: {
			/** Tipo de aportación (TipoAportacionODeposito): a (art. 151 fracc. V LISR), b (art. 185 LISR) o c (art. 258 RLISR, con trustee_rfc). */
			type: "a" | "b" | "c";
			/** Monto de la aportación o depósito (MontAportODep). */
			amount: number;
			/** RFC de la fiduciaria que administra el plan (RFCFiduciaria); obligatorio con el tipo c. */
			trustee_rfc?: string | null;
		}[];
	};
	/** Complemento de intereses reales deducibles por créditos hipotecarios (Intereseshipotecarios 1.0), obligatorio con code 23. */
	mortgage_interest?: {
		/** true si el crédito lo otorgó una institución financiera (CreditoDeInstFinanc). */
		financial_institution: boolean;
		/** Saldo insoluto al 31 de diciembre del año anterior, o a la fecha del contrato si es de este año (SaldoInsoluto). */
		outstanding_balance: number;
		/** Proporción deducible del crédito sobre los intereses reales devengados y pagados (PropDeducDelCredit). */
		deductible_proportion?: number | null;
		/** Intereses nominales devengados (MontTotIntNominalesDev). */
		nominal_accrued?: number | null;
		/** Intereses nominales devengados y pagados (MontTotIntNominalesDevYPag). */
		nominal_accrued_paid?: number | null;
		/** Intereses reales pagados deducibles (MontTotIntRealPagDeduc). */
		real_deductible?: number | null;
		/** Número de contrato del crédito hipotecario (NumContrato). */
		contract?: string | null;
	};
	/** Complemento de operaciones financieras derivadas de capital (Operacionesconderivados 1.0), obligatorio con code 24. */
	financial_derivatives?: {
		/** Ganancia acumulable (MontGanAcum). */
		gain: number;
		/** Pérdida deducible (MontPerdDed). */
		loss: number;
	};
	/** Folio fiscal (UUID) de la constancia que esta corrige: vigente, del mismo emisor y al mismo receptor (emitida aquí o en otro sistema). Va en CfdiRetenRelacionados (04) y, timbrada esta, la anterior se cancela con el motivo 01; `replaced` dice si se canceló. */
	replaces?: string;
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
	/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
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
	/** CLABE de 18 dígitos de la cuenta del empleado: a donde le paga el archivo para el banco (POST /v1/payroll_bank_files). */
	clabe?: string | null;
	/** Nombre(s), como en su CURP. Con first_surname y second_surname, los archivos del IMSS (IDSE y SUA) escriben el nombre en sus tres partes; sin ellos, Fiscalisto lo separa con la CURP. */
	given_names?: string | null;
	/** Primer apellido, como en su CURP. */
	first_surname?: string | null;
	/** Segundo apellido (vacío si tiene uno). */
	second_surname?: string | null;
	/** Tipo de trabajador del IMSS: 1 permanente, 2 eventual de la ciudad, 3 eventual de la construcción, 4 eventual del campo. Por omisión 1. */
	imss_worker_type?: "1" | "2" | "3" | "4";
	/** Tipo de salario del IMSS: 0 fijo, 1 variable, 2 mixto. Por omisión 0. */
	imss_salary_type?: "0" | "1" | "2";
	/** Semana o jornada reducida: 0 normal, 1 a 5 los días que trabaja a la semana, 6 jornada de menos de 8 horas. Por omisión 0. */
	imss_reduced_week?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
	/** Unidad de medicina familiar (UMF) del IMSS, opcional. */
	family_medicine_unit?: string | null;
	/** Causa de la baja ante el IMSS, con end_date: 1 término de contrato, 2 separación voluntaria (la usual), 3 abandono, 4 defunción, 5 clausura, 6 otras, 7 ausentismo, 8 rescisión, 9 jubilación, A pensión. */
	exit_reason?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | null;
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
	/** CLABE de 18 dígitos de la cuenta del empleado: a donde le paga el archivo para el banco (POST /v1/payroll_bank_files). */
	clabe?: string | null;
	/** Nombre(s), como en su CURP. Con first_surname y second_surname, los archivos del IMSS (IDSE y SUA) escriben el nombre en sus tres partes; sin ellos, Fiscalisto lo separa con la CURP. */
	given_names?: string | null;
	/** Primer apellido, como en su CURP. */
	first_surname?: string | null;
	/** Segundo apellido (vacío si tiene uno). */
	second_surname?: string | null;
	/** Tipo de trabajador del IMSS: 1 permanente, 2 eventual de la ciudad, 3 eventual de la construcción, 4 eventual del campo. Por omisión 1. */
	imss_worker_type?: "1" | "2" | "3" | "4";
	/** Tipo de salario del IMSS: 0 fijo, 1 variable, 2 mixto. Por omisión 0. */
	imss_salary_type?: "0" | "1" | "2";
	/** Semana o jornada reducida: 0 normal, 1 a 5 los días que trabaja a la semana, 6 jornada de menos de 8 horas. Por omisión 0. */
	imss_reduced_week?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
	/** Unidad de medicina familiar (UMF) del IMSS, opcional. */
	family_medicine_unit?: string | null;
	/** Causa de la baja ante el IMSS, con end_date: 1 término de contrato, 2 separación voluntaria (la usual), 3 abandono, 4 defunción, 5 clausura, 6 otras, 7 ausentismo, 8 rescisión, 9 jubilación, A pensión. */
	exit_reason?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | null;
}

/** Los parámetros de GET /v1/employees/{id}/vacations. */
export interface GetEmployeeVacationsParams {
	/** El día del saldo (AAAA-MM-DD); por omisión hoy, o su último día si ya salió. */
	as_of?: string;
}

export interface UpdateEmployeeVacationsParams {
	/** El día del saldo, según sus registros de antes de Fiscalisto; null lo quita. Los recibos timbrados antes de ese día no se cuentan. */
	opening_date: string | null;
	/** Los días que ese día le quedaban de años de servicio cumplidos. */
	opening_pending_days?: number;
	/** Los días del año de servicio en curso que ya había tomado ese día. */
	opening_taken_days?: number;
}

export interface CreatePayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** El periodo de pago: primer y último día (FechaInicialPago, FechaFinalPago) y, si no es el último, el día de pago (FechaPago). */
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
	/** Faltas del periodo (días sin goce de sueldo), de 0 a 31: no se pagan (salen de days) y cotizan al IMSS solo en enfermedades y maternidad, hasta 7 por mes (LSS art. 31 fr. I). */
	absences?: number;
	/** Días de incapacidad que expidió el IMSS en el periodo, de 0 a 31: no se pagan (salen de days) y no causan cuotas obreras del IMSS (LSS art. 31 fr. IV). */
	disability_days?: number;
	/** Incidencias del periodo, como en Nómina › Emitir recibos: horas extra, domingos trabajados, vacaciones y premios. Fiscalisto calcula sus importes, su parte exenta y el ISR con el sueldo. */
	incidents?: {
		/** Horas extra dobles (pagadas al doble), horas completas: hasta 9 por semana en 2026 y 2027, 10 en 2028, 11 en 2029 y 12 desde 2030 (LFT arts. 66 y transitorio cuarto del decreto DOF 01-05-2026). Exentas la mitad, hasta 5 UMA por semana; todas si gana el salario mínimo (LISR art. 93 fr. I). */
		double_hours?: number;
		/** Horas extra triples, las que pasan de las dobles de la semana (LFT art. 68). Gravadas. */
		triple_hours?: number;
		/** Días en que se trabajaron las horas extra (nodo HorasExtra); uno por cada 3 horas si no lo manda. */
		overtime_days?: number;
		/** Domingos trabajados: prima dominical del 25% del salario diario por cada uno (LFT art. 71), exenta hasta 1 UMA por domingo. */
		sundays?: number;
		/** Días de vacaciones que disfrutó en el periodo (se pagan como sueldo dentro de days): su prima vacacional con el porcentaje del empleado, exenta hasta 15 UMA en el año. */
		vacation_days?: number;
		/** Premios y bonos del periodo, gravados. */
		bonuses?: {
			/** 010 premio de puntualidad, 049 premio de asistencia, 038 otro bono (c_TipoPercepcion). */
			type: "010" | "049" | "038";
			/** Importe. */
			amount: number;
			/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
			concept?: string;
		}[];
	};
	/** El recibo vigente (inv_… o UUID) que este corrige, calculado por Fiscalisto para el mismo empleado: el nuevo se calcula con los datos del empleado como están ahora, va relacionado con 04 y el anterior se cancela con motivo 01. Para un recibo que calculó su sistema use POST /v1/payroll_receipts/external con replaces. */
	replaces?: string;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
	/** El confirmation_token de POST /v1/payroll_receipts/preview: timbra solo si el recibo calculado ahora es exactamente el que revisó (si no, 409 payroll_calculation_changed y no timbra). Sin él, timbra el que calcule en ese momento. */
	confirmation_token?: string;
}

export interface PreviewPayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** El periodo de pago: primer y último día (FechaInicialPago, FechaFinalPago) y, si no es el último, el día de pago (FechaPago). */
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
	/** Faltas del periodo (días sin goce de sueldo), de 0 a 31: no se pagan (salen de days) y cotizan al IMSS solo en enfermedades y maternidad, hasta 7 por mes (LSS art. 31 fr. I). */
	absences?: number;
	/** Días de incapacidad que expidió el IMSS en el periodo, de 0 a 31: no se pagan (salen de days) y no causan cuotas obreras del IMSS (LSS art. 31 fr. IV). */
	disability_days?: number;
	/** Incidencias del periodo, como en Nómina › Emitir recibos: horas extra, domingos trabajados, vacaciones y premios. Fiscalisto calcula sus importes, su parte exenta y el ISR con el sueldo. */
	incidents?: {
		/** Horas extra dobles (pagadas al doble), horas completas: hasta 9 por semana en 2026 y 2027, 10 en 2028, 11 en 2029 y 12 desde 2030 (LFT arts. 66 y transitorio cuarto del decreto DOF 01-05-2026). Exentas la mitad, hasta 5 UMA por semana; todas si gana el salario mínimo (LISR art. 93 fr. I). */
		double_hours?: number;
		/** Horas extra triples, las que pasan de las dobles de la semana (LFT art. 68). Gravadas. */
		triple_hours?: number;
		/** Días en que se trabajaron las horas extra (nodo HorasExtra); uno por cada 3 horas si no lo manda. */
		overtime_days?: number;
		/** Domingos trabajados: prima dominical del 25% del salario diario por cada uno (LFT art. 71), exenta hasta 1 UMA por domingo. */
		sundays?: number;
		/** Días de vacaciones que disfrutó en el periodo (se pagan como sueldo dentro de days): su prima vacacional con el porcentaje del empleado, exenta hasta 15 UMA en el año. */
		vacation_days?: number;
		/** Premios y bonos del periodo, gravados. */
		bonuses?: {
			/** 010 premio de puntualidad, 049 premio de asistencia, 038 otro bono (c_TipoPercepcion). */
			type: "010" | "049" | "038";
			/** Importe. */
			amount: number;
			/** Concepto del pago (ConceptoPago), c_TipoContribuyenteSujetoRetencion. */
			concept?: string;
		}[];
	};
	/** El recibo vigente (inv_… o UUID) que este corrige, calculado por Fiscalisto para el mismo empleado: el nuevo se calcula con los datos del empleado como están ahora, va relacionado con 04 y el anterior se cancela con motivo 01. Para un recibo que calculó su sistema use POST /v1/payroll_receipts/external con replaces. */
	replaces?: string;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface CreateExtraordinaryPayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** aguinaldo (sus días al año, al menos 15, en proporción a los trabajados), ptu (la parte que le toca de las utilidades) o finiquito (al último día trabajado, end_date del empleado: aguinaldo, vacaciones y prima vacacional proporcionales y, con exit_reason dismissal, la indemnización y la prima de antigüedad). */
	kind: "aguinaldo" | "ptu" | "finiquito";
	/** FechaPago del recibo. */
	payment_date: string;
	/** aguinaldo: el año que paga (por omisión, el de payment_date). ptu: el año de la utilidad (por omisión, el anterior a payment_date). */
	year?: number;
	/** aguinaldo: los días trabajados en el año, si no son todos los que estuvo contratado (faltas o incapacidades que no cuentan). */
	days_worked?: number;
	/** ptu: lo que le toca a este empleado (la mitad de la PTU por días trabajados y la mitad por salario, con el tope de tres meses de salario). Fiscalisto calcula su parte exenta (15 UMA) y su ISR. */
	ptu_amount?: number;
	/** aguinaldo y ptu: cómo retener el ISR de la parte gravada. lower (por omisión) el que retenga menos; art96 sumada al sueldo del mes; art174 el procedimiento opcional del Reglamento de la LISR. */
	isr_method?: "lower" | "art96" | "art174";
	/** finiquito: resignation (renuncia o común acuerdo, por omisión) o dismissal (despido sin causa: suma 3 meses de salario integrado y la prima de antigüedad). */
	exit_reason?: "resignation" | "dismissal";
	/** finiquito con dismissal: incluye 20 días por año de servicio (LFT art. 50), cuando el patrón no lo reinstala. */
	twenty_days_per_year?: boolean;
	/** finiquito: los días de vacaciones del año de servicio en curso que ya tomó. Por omisión, los de sus recibos timbrados (GET /v1/employees/{id}/vacations). */
	vacation_days_taken?: number;
	/** finiquito: los días de vacaciones de años de servicio cumplidos que no disfrutó ni han prescrito; se pagan con su prima vacacional. Por omisión, pending_days de sus vacaciones. */
	vacation_days_owed?: number;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
	/** El confirmation_token de POST /v1/payroll_receipts/extraordinary/preview: timbra solo si el recibo calculado ahora es el que revisó (si no, 409 payroll_calculation_changed). */
	confirmation_token?: string;
}

export interface PreviewExtraordinaryPayrollReceiptParams {
	/** El empleado (emp_…). */
	employee: string;
	/** aguinaldo (sus días al año, al menos 15, en proporción a los trabajados), ptu (la parte que le toca de las utilidades) o finiquito (al último día trabajado, end_date del empleado: aguinaldo, vacaciones y prima vacacional proporcionales y, con exit_reason dismissal, la indemnización y la prima de antigüedad). */
	kind: "aguinaldo" | "ptu" | "finiquito";
	/** FechaPago del recibo. */
	payment_date: string;
	/** aguinaldo: el año que paga (por omisión, el de payment_date). ptu: el año de la utilidad (por omisión, el anterior a payment_date). */
	year?: number;
	/** aguinaldo: los días trabajados en el año, si no son todos los que estuvo contratado (faltas o incapacidades que no cuentan). */
	days_worked?: number;
	/** ptu: lo que le toca a este empleado (la mitad de la PTU por días trabajados y la mitad por salario, con el tope de tres meses de salario). Fiscalisto calcula su parte exenta (15 UMA) y su ISR. */
	ptu_amount?: number;
	/** aguinaldo y ptu: cómo retener el ISR de la parte gravada. lower (por omisión) el que retenga menos; art96 sumada al sueldo del mes; art174 el procedimiento opcional del Reglamento de la LISR. */
	isr_method?: "lower" | "art96" | "art174";
	/** finiquito: resignation (renuncia o común acuerdo, por omisión) o dismissal (despido sin causa: suma 3 meses de salario integrado y la prima de antigüedad). */
	exit_reason?: "resignation" | "dismissal";
	/** finiquito con dismissal: incluye 20 días por año de servicio (LFT art. 50), cuando el patrón no lo reinstala. */
	twenty_days_per_year?: boolean;
	/** finiquito: los días de vacaciones del año de servicio en curso que ya tomó. Por omisión, los de sus recibos timbrados (GET /v1/employees/{id}/vacations). */
	vacation_days_taken?: number;
	/** finiquito: los días de vacaciones de años de servicio cumplidos que no disfrutó ni han prescrito; se pagan con su prima vacacional. Por omisión, pending_days de sus vacaciones. */
	vacation_days_owed?: number;
	/** true para mandar el PDF y el XML por correo al timbrar, con el diseño de Fiscalisto. Por omisión no se envía. */
	send_email?: boolean;
	/** Sus propios datos: hasta 50 llaves de 40 caracteres con valores de texto de hasta 500. No van al CFDI; vuelven en el objeto y en los webhooks. */
	metadata?: Record<string, string>;
}

export interface CreatePayrollBatchParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Nombre del lote, para usted (Quincena 20). */
	name?: string;
	/** El periodo de pago: primer y último día (FechaInicialPago, FechaFinalPago) y, si no es el último, el día de pago (FechaPago). Va para todos los recibos de receipts que no traen el suyo. */
	period?: {
		/** Primer día pagado (FechaInicialPago). */
		start: string;
		/** Último día pagado (FechaFinalPago). */
		end: string;
		/** Día de pago (FechaPago); sin él, el último día del periodo. */
		payment_date?: string;
	};
	/** Mandar a cada empleado su recibo por correo (a los que tienen correo). Solo con receipts. */
	send_email?: boolean;
	/** Los recibos que Fiscalisto calcula: un empleado (emp_…) en cada uno, como en POST /v1/payroll_receipts. */
	receipts?: {
		/** El empleado (emp_…) del emisor del lote. */
		employee: string;
		/** Su periodo de pago (FechaInicialPago, FechaFinalPago y FechaPago), si no es el del lote (period). */
		period?: {
			/** Primer día pagado (FechaInicialPago). */
			start: string;
			/** Último día pagado (FechaFinalPago). */
			end: string;
			/** Día de pago (FechaPago); sin él, el último día del periodo. */
			payment_date?: string;
		};
		/** Días pagados; sin él, todos los días que le tocan del periodo menos absences y disability_days. */
		days?: number;
		/** Faltas del periodo (días sin goce de sueldo), de 0 a 31: no se pagan (salen de days) y cotizan al IMSS solo en enfermedades y maternidad, hasta 7 por mes (LSS art. 31 fr. I). */
		absences?: number;
		/** Días de incapacidad que expidió el IMSS en el periodo, de 0 a 31: no se pagan (salen de days) y no causan cuotas obreras del IMSS (LSS art. 31 fr. IV). */
		disability_days?: number;
		/** Mandarle su recibo por correo; sin él, lo que diga send_email del lote. Con true el empleado debe tener correo. */
		send_email?: boolean;
		/** Su identificador de este recibo, hasta 100 caracteres. */
		reference?: string;
	}[];
	/** Los recibos que calculó su sistema de nómina, timbrados tal cual. En lugar de receipts. */
	external_receipts?: (ExternalPayrollReceiptCreate & {
		/** Su identificador de este recibo, hasta 100 caracteres. */
		reference?: string;
	})[];
}

/** Los parámetros de GET /v1/payroll_batches. */
export interface ListPayrollBatchesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreatePayrollBankFileParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** La fecha de pago de los recibos (FechaPago): se pagan los recibos de nómina timbrados con esa fecha, sumados por empleado. También es el día en que el banco aplica el archivo. */
	payment_date: string;
	/** El formato del banco: bbva (Net Cash), banamex (BancaNet, layout D), banorte (Banorte en su Empresa), santander (Enlace, solo cuentas Santander) o spei (CSV para cualquier banco). Por omisión, el del banco de account. */
	layout?: "bbva" | "banamex" | "banorte" | "santander" | "spei";
	/** La CLABE de la cuenta de cargo del emisor. Por omisión, la que se usó la última vez en la app, o su primera cuenta bancaria. */
	account?: string;
	/** El archivo del día (1 a 99): un segundo archivo el mismo día lleva otro número. Por omisión 1. */
	sequence?: number;
	/** Banamex: su número de cliente de BancaNet (12 dígitos). */
	client_number?: string;
	/** Banorte: su número de emisora (5 dígitos). */
	issuer_number?: string;
}

export interface CreateImssMovementParams {
	/** El empleado (emp_…). */
	employee: string;
	/** alta (o reingreso): tipo 08; modificacion: cambio de salario, tipo 07; baja: tipo 02. */
	kind: "alta" | "reingreso" | "modificacion" | "baja";
	/** El día en que surte efecto (AAAA-MM-DD, hora de México). El IMSS no acepta más de unos días de anticipación. */
	date: string;
	/** El salario diario integrado que se declara (en altas, reingresos y modificaciones). El archivo lo topa a 25 UMA y nunca baja del salario mínimo. */
	integrated_daily_salary?: number | null;
	/** Solo en bajas: 1 término de contrato, 2 separación voluntaria, 3 abandono, 4 defunción, 5 clausura, 6 otras, 7 ausentismo, 8 rescisión, 9 jubilación, A pensión. */
	exit_reason?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | null;
}

/** Los parámetros de GET /v1/imss_movements. */
export interface ListImssMovementsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** pending (por omisión) o reported. */
	status?: "pending" | "reported";
}

export interface ReportImssMovementsParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Los movimientos (imv_…) que el IMSS ya recibió, hasta 1,000. */
	movements: string[];
	/** true (por omisión): marcarlos como presentados; false: devolverlos a pendientes (si los marcó por error). */
	reported?: boolean;
}

export interface UpdateImssMovementParams {
	/** alta (o reingreso): tipo 08; modificacion: cambio de salario, tipo 07; baja: tipo 02. */
	kind?: "alta" | "reingreso" | "modificacion" | "baja";
	/** El día en que surte efecto (AAAA-MM-DD, hora de México). El IMSS no acepta más de unos días de anticipación. */
	date?: string;
	/** El salario diario integrado que se declara (en altas, reingresos y modificaciones). El archivo lo topa a 25 UMA y nunca baja del salario mínimo. */
	integrated_daily_salary?: number | null;
	/** Solo en bajas: 1 término de contrato, 2 separación voluntaria, 3 abandono, 4 defunción, 5 clausura, 6 otras, 7 ausentismo, 8 rescisión, 9 jubilación, A pensión. */
	exit_reason?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | null;
}

export interface CreateImssFilesParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** idse: los archivos de IDSE (uno por tipo: reingresos, modificaciones, bajas); sua: ASEG.TXT (altas) y MOVT.TXT (los demás) para importar en SUA. */
	format: "idse" | "sua";
	/** Los movimientos (imv_…) pendientes que van en los archivos. Por omisión, todos los pendientes. */
	movements?: string[];
	/** IDSE: la guía de 5 dígitos de su subdelegación. Por omisión, la que se guardó en la app. */
	guide?: string;
}

export interface CreateEmployeeDeductionParams {
	/** El empleado (emp_…). */
	employee: string;
	/** infonavit (deducción 010), fonacot (011), pension (pensión alimenticia, 007), prestamo (préstamo del patrón, 004), anticipo (anticipo de salarios, 012), caja (caja de ahorro, 018) o sindical (cuota sindical, 019). */
	kind: "infonavit" | "fonacot" | "pension" | "prestamo" | "anticipo" | "caja" | "sindical";
	/** Cómo se calcula. infonavit: percent_sbc (porcentaje del SBC por día), fixed_month (cuota fija al mes) o vsm (factor de VSM al mes, por la UMI de 100.81), como dice el aviso de retención. fonacot: fixed_month (la retención mensual de la cédula). pension: percent_net (del neto después de ISR e IMSS), percent_gross (de todas las percepciones) o fixed_month. prestamo, anticipo y caja: fixed_period (monto por recibo). sindical: percent_salary (del sueldo) o fixed_period. */
	mode: "percent_sbc" | "fixed_month" | "vsm" | "percent_net" | "percent_gross" | "fixed_period" | "percent_salary";
	/** El porcentaje (de más de 0 a 100), el factor de VSM o el monto en pesos, según mode. */
	value: number;
	/** Solo prestamo y anticipo: el monto prestado. Se descuenta hasta pagarlo; no puede pasar de un mes de salario (artículo 110 de la LFT). */
	total?: number | null;
	/** El número de crédito de Infonavit o Fonacot, el expediente o una nota. */
	reference?: string | null;
	/** Solo pension, y obligatorio: a quién se paga. */
	beneficiary?: string | null;
	/** Desde qué día se descuenta (AAAA-MM-DD). */
	start_date: string;
	/** Hasta qué día (incluido). Sin él, hasta que se borre (o se pague el préstamo). */
	end_date?: string | null;
	/** Solo pension: también se descuenta del aguinaldo, la PTU y el finiquito (por omisión, true). */
	extraordinary?: boolean;
}

/** Los parámetros de GET /v1/employee_deductions. */
export interface ListEmployeeDeductionsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo los de este empleado (emp_…). */
	employee?: string;
}

export interface UpdateEmployeeDeductionParams {
	/** infonavit (deducción 010), fonacot (011), pension (pensión alimenticia, 007), prestamo (préstamo del patrón, 004), anticipo (anticipo de salarios, 012), caja (caja de ahorro, 018) o sindical (cuota sindical, 019). */
	kind?: "infonavit" | "fonacot" | "pension" | "prestamo" | "anticipo" | "caja" | "sindical";
	/** Cómo se calcula. infonavit: percent_sbc (porcentaje del SBC por día), fixed_month (cuota fija al mes) o vsm (factor de VSM al mes, por la UMI de 100.81), como dice el aviso de retención. fonacot: fixed_month (la retención mensual de la cédula). pension: percent_net (del neto después de ISR e IMSS), percent_gross (de todas las percepciones) o fixed_month. prestamo, anticipo y caja: fixed_period (monto por recibo). sindical: percent_salary (del sueldo) o fixed_period. */
	mode?: "percent_sbc" | "fixed_month" | "vsm" | "percent_net" | "percent_gross" | "fixed_period" | "percent_salary";
	/** El porcentaje (de más de 0 a 100), el factor de VSM o el monto en pesos, según mode. */
	value?: number;
	/** Solo prestamo y anticipo: el monto prestado. Se descuenta hasta pagarlo; no puede pasar de un mes de salario (artículo 110 de la LFT). */
	total?: number | null;
	/** El número de crédito de Infonavit o Fonacot, el expediente o una nota. */
	reference?: string | null;
	/** Solo pension, y obligatorio: a quién se paga. */
	beneficiary?: string | null;
	/** Desde qué día se descuenta (AAAA-MM-DD). */
	start_date?: string;
	/** Hasta qué día (incluido). Sin él, hasta que se borre (o se pague el préstamo). */
	end_date?: string | null;
	/** Solo pension: también se descuenta del aguinaldo, la PTU y el finiquito (por omisión, true). */
	extraordinary?: boolean;
}

/** Los parámetros de GET /v1/variable_salaries. */
export interface GetVariableSalaryParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** AAAA-B: 2026-5 es septiembre–octubre de 2026. */
	bimester: string;
}

export interface ApplyVariableSalaryParams {
	/** El emisor (iss_…); por omisión, el único de la cuenta. */
	issuer?: string;
	/** El bimestre: AAAA-B, de 1 (enero–febrero) a 6 (noviembre–diciembre). */
	bimester: string;
	/** Los empleados (emp_…) a los que se aplica. */
	employees: string[];
}

/** Los parámetros de GET /v1/annual_adjustments. */
export interface GetAnnualAdjustmentParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** El ejercicio: 2026. */
	year: number;
}

export interface UpdateAnnualAdjustmentParams {
	/** El emisor (iss_…); por omisión, el único de la cuenta. */
	issuer?: string;
	/** El ejercicio: 2026. */
	year: number;
	/** apply: aplica la diferencia en sus siguientes recibos (desde enero del año siguiente). undo: la quita si ningún recibo timbrado la lleva. files_own_return: avisó por escrito que presentará su declaración anual (artículo 97, c): no se le calcula. no_own_return: lo deshace. */
	action: "apply" | "undo" | "files_own_return" | "no_own_return";
	/** Los empleados (emp_…). */
	employees: string[];
}

/** Los parámetros de GET /v1/payroll_taxes. */
export interface GetPayrollTaxParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** El mes: 2026-11. */
	month: string;
}

export interface UpdatePayrollTaxSettingsParams {
	/** El emisor (iss_…); por omisión, el único de la cuenta. */
	issuer?: string;
	/** Las percepciones (c_TipoPercepcion) que no suman a la base, como las deja fuera la ley de su estado. Reemplaza la lista entera. */
	excluded_perception_types?: string[];
	/** La opción de tasa de cada estado que la tiene, por su c_Estado: {"BCN": "hasta50"}. */
	state_options?: Record<string, string>;
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

export interface CreateBranchParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Cómo la llama su equipo, por ejemplo «Sucursal Monterrey». Va en el PDF. */
	name: string;
	/** Su código postal (LugarExpedicion de sus CFDI). Varias sucursales pueden compartirlo, y también el del domicilio fiscal del emisor. */
	zip: string;
	/** La dirección que va en el PDF de sus facturas. */
	address?: {
		/** Calle. */
		street?: string | null;
		/** Número exterior. */
		exterior?: string | null;
		/** Número interior. */
		interior?: string | null;
		/** Colonia. */
		neighborhood?: string | null;
		/** Municipio o alcaldía. */
		city?: string | null;
		/** Estado; por omisión, el de su código postal. */
		state?: string | null;
	};
	/** Teléfono, para el PDF. */
	phone?: string | null;
	/** Correo, para el PDF. */
	email?: string | null;
	/** La serie de cada tipo de CFDI que se timbra desde ella (invoice, credit_note, payment, transfer), hasta 25 caracteres cada una; la que no mande usa la del emisor. */
	series?: {
		/** Serie de sus facturas (tipo I); sin ella, la del emisor. */
		invoice?: string | null;
		/** Serie de sus notas de crédito (tipo E); sin ella, la del emisor. */
		credit_note?: string | null;
		/** Serie de sus complementos de pago (tipo P); sin ella, la del emisor. */
		payment?: string | null;
		/** Serie de sus traslados (tipo T); sin ella, la del emisor. */
		transfer?: string | null;
	};
	/** Su nombre comercial, si se presenta con otra marca: va en grande en el PDF de lo que se factura desde ella, en el correo y en la página de la factura. null toma el del emisor. */
	trade_name?: string | null;
	/** Color del PDF de sus facturas, como #2563EB. null toma el del emisor. */
	pdf_color?: string | null;
	/** Estilo del PDF de sus facturas: clasico, moderno, compacto o minimalista. null toma el del emisor. */
	pdf_style?: "clasico" | "moderno" | "compacto" | "minimalista" | null;
}

/** Los parámetros de GET /v1/branches. */
export interface ListBranchesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** true para incluir las archivadas. */
	include_archived?: boolean;
	/** Solo la de este código postal. */
	zip?: string;
}

export interface UpdateBranchParams {
	/** Cómo la llama su equipo, por ejemplo «Sucursal Monterrey». Va en el PDF. */
	name?: string;
	/** Su código postal (LugarExpedicion de sus CFDI). Varias sucursales pueden compartirlo, y también el del domicilio fiscal del emisor. */
	zip?: string;
	/** La dirección que va en el PDF de sus facturas. */
	address?: {
		/** Calle. */
		street?: string | null;
		/** Número exterior. */
		exterior?: string | null;
		/** Número interior. */
		interior?: string | null;
		/** Colonia. */
		neighborhood?: string | null;
		/** Municipio o alcaldía. */
		city?: string | null;
		/** Estado; por omisión, el de su código postal. */
		state?: string | null;
	};
	/** Teléfono, para el PDF. */
	phone?: string | null;
	/** Correo, para el PDF. */
	email?: string | null;
	/** La serie de cada tipo de CFDI que se timbra desde ella (invoice, credit_note, payment, transfer), hasta 25 caracteres cada una; la que no mande usa la del emisor. */
	series?: {
		/** Serie de sus facturas (tipo I); sin ella, la del emisor. */
		invoice?: string | null;
		/** Serie de sus notas de crédito (tipo E); sin ella, la del emisor. */
		credit_note?: string | null;
		/** Serie de sus complementos de pago (tipo P); sin ella, la del emisor. */
		payment?: string | null;
		/** Serie de sus traslados (tipo T); sin ella, la del emisor. */
		transfer?: string | null;
	};
	/** Su nombre comercial, si se presenta con otra marca: va en grande en el PDF de lo que se factura desde ella, en el correo y en la página de la factura. null toma el del emisor. */
	trade_name?: string | null;
	/** Color del PDF de sus facturas, como #2563EB. null toma el del emisor. */
	pdf_color?: string | null;
	/** Estilo del PDF de sus facturas: clasico, moderno, compacto o minimalista. null toma el del emisor. */
	pdf_style?: "clasico" | "moderno" | "compacto" | "minimalista" | null;
	/** true la archiva: ya no se puede facturar desde ella, y sus facturas la siguen nombrando. false la restaura. */
	archived?: boolean;
}

export interface UploadBranchLogoParams {
	/** El logo, PNG o JPG de hasta 1 MB, en base64 (con o sin el prefijo data:image/png;base64,). Uno muy grande se reduce para el PDF. */
	file: string;
}

export interface CreateCostCenterParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Cómo lo llama su equipo, por ejemplo «Obra Norte». No se repite en el emisor (sin importar mayúsculas). */
	name: string;
	/** Su clave, si su contabilidad usa claves (por ejemplo «CC-01»). */
	code?: string | null;
}

/** Los parámetros de GET /v1/cost_centers. */
export interface ListCostCentersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** true para incluir los archivados. */
	include_archived?: boolean;
}

export interface UpdateCostCenterParams {
	/** Cómo lo llama su equipo, por ejemplo «Obra Norte». No se repite en el emisor (sin importar mayúsculas). */
	name?: string;
	/** Su clave, si su contabilidad usa claves (por ejemplo «CC-01»). */
	code?: string | null;
	/** true lo archiva: ya no se pueden poner facturas en él, pero las suyas lo conservan. false lo restaura. */
	archived?: boolean;
}

/** Los parámetros de DELETE /v1/cost_centers/{id}. */
export interface DeleteCostCenterParams {
	/** Otro centro de costo (ccn_…) que se queda con sus facturas. */
	move_to?: string;
}

export interface CreatePriceListParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Mayoreo, Distribuidor, Buen Fin… */
	name: string;
	/** Descripción. */
	description?: string | null;
	/** Otra lista (prl_…) de la que parte; null o sin ella: el precio del catálogo. */
	base_list?: string | null;
	/** Cuánto mueve el precio del que parte: −10 lo baja 10 %, 5 lo sube 5 %. */
	adjust_percent?: number;
	/** Redondea a: 0.5, 1, 5, 10… (null: a centavos). */
	round_to?: number | null;
	/** Desde qué día vale (YYYY-MM-DD, Ciudad de México), o null desde siempre. */
	starts_on?: string | null;
	/** Hasta qué día vale, ese día incluido (YYYY-MM-DD), o null sin fin. */
	ends_on?: string | null;
	/** La tienen los clientes sin otra lista (ni ellos ni su grupo). Solo una lo es. */
	is_default?: boolean;
	/** Sus precios propios; al mandarlos reemplazan a los que tenía. */
	items?: {
		/** El producto (prd_…). */
		product: string;
		/** Una presentación del producto (su id de unidad, un entero de GET /v1/products/{id}/units), por ejemplo una caja de 12; null o sin él: su propia unidad. */
		unit?: string | null;
		/** Desde cuántas aplica (1 por omisión): varios renglones del mismo producto son sus escalones de mayoreo. */
		min_quantity?: number;
		/** Su precio por unidad sin IVA. Mande este o discount_percent. */
		unit_price?: number;
		/** Un descuento sobre el precio de la lista. Mande este o unit_price. */
		discount_percent?: number;
	}[];
}

/** Los parámetros de GET /v1/price_lists. */
export interface ListPriceListsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdatePriceListParams {
	/** Mayoreo, Distribuidor, Buen Fin… */
	name?: string;
	/** Descripción. */
	description?: string | null;
	/** Otra lista (prl_…) de la que parte; null o sin ella: el precio del catálogo. */
	base_list?: string | null;
	/** Cuánto mueve el precio del que parte: −10 lo baja 10 %, 5 lo sube 5 %. */
	adjust_percent?: number;
	/** Redondea a: 0.5, 1, 5, 10… (null: a centavos). */
	round_to?: number | null;
	/** Desde qué día vale (YYYY-MM-DD, Ciudad de México), o null desde siempre. */
	starts_on?: string | null;
	/** Hasta qué día vale, ese día incluido (YYYY-MM-DD), o null sin fin. */
	ends_on?: string | null;
	/** La tienen los clientes sin otra lista (ni ellos ni su grupo). Solo una lo es. */
	is_default?: boolean;
	/** Sus precios propios; al mandarlos reemplazan a los que tenía. */
	items?: {
		/** El producto (prd_…). */
		product: string;
		/** Una presentación del producto (su id de unidad, un entero de GET /v1/products/{id}/units), por ejemplo una caja de 12; null o sin él: su propia unidad. */
		unit?: string | null;
		/** Desde cuántas aplica (1 por omisión): varios renglones del mismo producto son sus escalones de mayoreo. */
		min_quantity?: number;
		/** Su precio por unidad sin IVA. Mande este o discount_percent. */
		unit_price?: number;
		/** Un descuento sobre el precio de la lista. Mande este o unit_price. */
		discount_percent?: number;
	}[];
}

export interface CreateCustomerGroupParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Nombre. */
	name: string;
	/** Color de su etiqueta en la app: info, warning, positive, critical o muted. */
	color?: "info" | "warning" | "positive" | "critical" | "muted";
	/** Su lista (prl_…); null: la que aplica a todos. */
	price_list?: string | null;
	/** Un descuento en cada concepto, como descuento del CFDI. */
	discount_percent?: number;
	/** Días de crédito que se le dan, de 0 a 365, o null para no cambiar los del cliente. */
	credit_days?: number | null;
	/** El pedido mínimo antes de IVA desde el Portal del cliente. */
	min_order?: number | null;
	/** Sus clientes pueden hacer pedidos desde su Portal del cliente (true por omisión). */
	portal_ordering?: boolean;
	/** Hasta cuándo sus clientes cambian o cancelan desde su portal un pedido que mandaron ahí: none, until_confirmed (hasta que usted lo confirme; por omisión) o until_delivered (hasta que se entregue o facture algo). */
	portal_changes?: "none" | "until_confirmed" | "until_delivered";
	/** Días de la semana en que les entrega (0 domingo a 6 sábado); null: cualquier día. El portal solo ofrece esos días. */
	delivery_days?: number[] | null;
	/** Hora de corte (0 a 23, Ciudad de México): un pedido del portal después de ella cuenta desde el día siguiente; null: sin hora de corte. */
	cutoff_hour?: number | null;
	/** Días para preparar un pedido antes de poder entregarlo (0 por omisión). */
	prep_days?: number;
}

/** Los parámetros de GET /v1/customer_groups. */
export interface ListCustomerGroupsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateCustomerGroupParams {
	/** Nombre. */
	name?: string;
	/** Color de su etiqueta en la app: info, warning, positive, critical o muted. */
	color?: "info" | "warning" | "positive" | "critical" | "muted";
	/** Su lista (prl_…); null: la que aplica a todos. */
	price_list?: string | null;
	/** Un descuento en cada concepto, como descuento del CFDI. */
	discount_percent?: number;
	/** Días de crédito que se le dan, de 0 a 365, o null para no cambiar los del cliente. */
	credit_days?: number | null;
	/** El pedido mínimo antes de IVA desde el Portal del cliente. */
	min_order?: number | null;
	/** Sus clientes pueden hacer pedidos desde su Portal del cliente (true por omisión). */
	portal_ordering?: boolean;
	/** Hasta cuándo sus clientes cambian o cancelan desde su portal un pedido que mandaron ahí: none, until_confirmed (hasta que usted lo confirme; por omisión) o until_delivered (hasta que se entregue o facture algo). */
	portal_changes?: "none" | "until_confirmed" | "until_delivered";
	/** Días de la semana en que les entrega (0 domingo a 6 sábado); null: cualquier día. El portal solo ofrece esos días. */
	delivery_days?: number[] | null;
	/** Hora de corte (0 a 23, Ciudad de México): un pedido del portal después de ella cuenta desde el día siguiente; null: sin hora de corte. */
	cutoff_hour?: number | null;
	/** Días para preparar un pedido antes de poder entregarlo (0 por omisión). */
	prep_days?: number;
}

export interface QuotePricesParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** El cliente (cus_…) o su RFC. */
	customer: string;
	/** Conceptos (Conceptos), al menos uno. */
	items: {
		/** El producto (prd_…). */
		product: string;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity?: number;
		/** Unidad aduana (UnidadAduana), c_UnidadAduana. */
		unit?: string | null;
	}[];
}

/** Los parámetros de GET /v1/attendance. */
export interface GetAttendanceParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Primer día, AAAA-MM-DD. */
	from: string;
	/** Último día, AAAA-MM-DD (hasta 92 días después de from). */
	to: string;
	/** Solo este empleado (emp_…), con sus días y marcas. */
	employee?: string;
}

export interface CreateAttendanceMarkParams {
	/** El empleado (emp_…). */
	employee: string;
	/** in: entrada; out: salida. */
	kind: "in" | "out";
	/** Cuándo marcó, con su zona horaria (2027-01-04T09:02:00-06:00). No en el futuro ni de hace más de 400 días. */
	at: string;
	/** Por qué se registra (se guarda y el empleado lo ve en su enlace). Por omisión «Registrada por la API». */
	reason?: string;
}

export interface VoidAttendanceMarkParams {
	/** Por qué se quita: queda tachada con este motivo y el empleado lo ve. */
	reason: string;
}

export interface ApproveAttendanceOvertimeParams {
	/** El empleado (emp_…). */
	employee: string;
	/** AAAA-MM-DD. */
	date: string;
	/** Hasta cuántos minutos de horas extra de ese día cuentan para la nómina (0 a 960); null quita la decisión. Con rejected: true se ignora. */
	minutes: number | null;
	/** true rechaza todas las horas extra de ese día: quedan en el registro, no cuentan para la nómina y dejan de estar por autorizar. Pide comment. */
	rejected?: boolean;
	/** Por qué (obligatorio al rechazar; el empleado lo ve). */
	comment?: string;
}

export interface CreateExpensePersonParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** empleado (sus viáticos van en su recibo de nómina; sus facturas pueden ir a su nombre en un viaje) o honorarios (sus facturas deben ir a nombre del emisor). */
	kind: "empleado" | "honorarios";
	/** Un empleado de Nómina (emp_…): su nombre, RFC y correo se toman de ahí y sus viáticos van en su recibo. Solo con kind empleado. */
	employee?: string | null;
	/** Su nombre. Obligatorio sin employee. */
	name?: string | null;
	/** Su RFC. */
	tax_id?: string | null;
	/** Su correo: para mandarle su enlace y avisarle cuando se aprueba o se le paga. */
	email?: string | null;
	/** Dónde trabaja (por ejemplo «Guadalajara, Jal.»): un viaje a menos de 50 km no es deducible como viáticos. */
	base_city?: string | null;
	/** Su área. */
	department?: string | null;
}

/** Los parámetros de GET /v1/expense_people. */
export interface ListExpensePeopleParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** true para incluir las archivadas. */
	include_archived?: boolean;
}

export interface UpdateExpensePersonParams {
	/** empleado (sus viáticos van en su recibo de nómina; sus facturas pueden ir a su nombre en un viaje) o honorarios (sus facturas deben ir a nombre del emisor). */
	kind?: "empleado" | "honorarios";
	/** Un empleado de Nómina (emp_…): su nombre, RFC y correo se toman de ahí y sus viáticos van en su recibo. Solo con kind empleado. */
	employee?: string | null;
	/** Su nombre. Obligatorio sin employee. */
	name?: string | null;
	/** Su RFC. */
	tax_id?: string | null;
	/** Su correo: para mandarle su enlace y avisarle cuando se aprueba o se le paga. */
	email?: string | null;
	/** Dónde trabaja (por ejemplo «Guadalajara, Jal.»): un viaje a menos de 50 km no es deducible como viáticos. */
	base_city?: string | null;
	/** Su área. */
	department?: string | null;
	/** true la archiva (y apaga su enlace): ya no se le abren comprobaciones. false la restaura. */
	archived?: boolean;
}

export interface CreateExpensePersonLinkParams {
	/** true le da un enlace nuevo: el anterior deja de funcionar en ese momento (por ejemplo, si se compartió por error). */
	renew?: boolean;
}

export interface CreateExpenseReportParams {
	/** La persona (exp_…). */
	person: string;
	/** viaje (por omisión) o gastos (gastos de oficina de un periodo que la empresa reembolsa). */
	kind?: "viaje" | "gastos";
	/** Su nombre. Por omisión, «Viaje a {destination}» o el periodo. */
	title?: string | null;
	/** Para qué fue: el SAT pide que el viaje sea por el negocio. */
	purpose?: string | null;
	/** A dónde. */
	destination?: string | null;
	/** Al extranjero: cambian los topes de alimentos y hospedaje. */
	abroad?: boolean;
	/** A más de 50 km de donde trabaja la persona (por omisión, true). Más cerca, no son viáticos deducibles. */
	far?: boolean;
	/** La salida (o el inicio del periodo). */
	start_date?: string | null;
	/** El regreso (o el fin del periodo). */
	end_date?: string | null;
}

/** Los parámetros de GET /v1/expense_reports. */
export interface ListExpenseReportsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo las de un estado: draft, submitted, rejected, approved o closed. */
	status?: string;
	/** Solo las de una persona (exp_…). */
	person?: string;
}

export interface UpdateExpenseReportParams {
	/** Su nombre. Por omisión, «Viaje a {destination}» o el periodo. */
	title?: string | null;
	/** Para qué fue: el SAT pide que el viaje sea por el negocio. */
	purpose?: string | null;
	/** A dónde. */
	destination?: string | null;
	/** Al extranjero: cambian los topes de alimentos y hospedaje. */
	abroad?: boolean;
	/** A más de 50 km de donde trabaja la persona (por omisión, true). Más cerca, no son viáticos deducibles. */
	far?: boolean;
	/** La salida (o el inicio del periodo). */
	start_date?: string | null;
	/** El regreso (o el fin del periodo). */
	end_date?: string | null;
}

export interface ApproveExpenseReportParams {
	/** Una nota para la persona. */
	note?: string | null;
}

export interface ReturnExpenseReportParams {
	/** Qué debe corregir: se le manda a la persona. */
	note: string;
}

export interface CreateExpenseItemParams {
	/** El UUID de una factura recibida del emisor (GET /v1/sat_invoices): la fecha, el monto, el proveedor y la forma de pago salen de ella. */
	uuid?: string;
	/** De qué es: hospedaje, alimentos, avion, transporte, auto, combustible (gasolina, casetas y estacionamiento), comidas (en restaurante, fuera de viaje), papeleria, mensajeria, software u otros. */
	category: "hospedaje" | "alimentos" | "avion" | "transporte" | "auto" | "combustible" | "comidas" | "papeleria" | "mensajeria" | "software" | "otros";
	/** Cuándo se gastó. Con uuid, la fecha de la factura. */
	date?: string;
	/** Qué fue (el proveedor). Con uuid, su emisor. */
	description?: string | null;
	/** En pesos. Con uuid, el total de la factura. */
	amount?: number;
	/** En su moneda, si fue en otra. */
	foreign_amount?: number | null;
	/** La moneda (USD, EUR…). */
	foreign_currency?: string | null;
	/** En alimentos, cuántas personas comieron: el tope es por persona. */
	people?: number;
	/** Cómo se pagó: tarjeta_empresa (no se le reembolsa), tarjeta_propia, efectivo, transferencia u otro. */
	payment?: "tarjeta_empresa" | "tarjeta_propia" | "efectivo" | "transferencia" | "otro" | null;
	/** Su comprobante: cfdi, extranjero, ticket o ninguno. Con uuid, cfdi. */
	receipt?: "cfdi" | "extranjero" | "ticket" | "ninguno";
	/** Por qué, si pasa la política (la política puede pedirla). */
	note?: string | null;
}

export interface UpdateExpenseItemParams {
	/** De qué es: hospedaje, alimentos, avion, transporte, auto, combustible (gasolina, casetas y estacionamiento), comidas (en restaurante, fuera de viaje), papeleria, mensajeria, software u otros. */
	category?: "hospedaje" | "alimentos" | "avion" | "transporte" | "auto" | "combustible" | "comidas" | "papeleria" | "mensajeria" | "software" | "otros";
	/** Cuándo se gastó. Con uuid, la fecha de la factura. */
	date?: string;
	/** Qué fue (el proveedor). Con uuid, su emisor. */
	description?: string | null;
	/** En pesos. Con uuid, el total de la factura. */
	amount?: number;
	/** En su moneda, si fue en otra. */
	foreign_amount?: number | null;
	/** La moneda (USD, EUR…). */
	foreign_currency?: string | null;
	/** En alimentos, cuántas personas comieron: el tope es por persona. */
	people?: number;
	/** Cómo se pagó: tarjeta_empresa (no se le reembolsa), tarjeta_propia, efectivo, transferencia u otro. */
	payment?: "tarjeta_empresa" | "tarjeta_propia" | "efectivo" | "transferencia" | "otro" | null;
	/** Su comprobante: cfdi, extranjero, ticket o ninguno. Con uuid, cfdi. */
	receipt?: "cfdi" | "extranjero" | "ticket" | "ninguno";
	/** Por qué, si pasa la política (la política puede pedirla). */
	note?: string | null;
	/** Al aprobar: true lo rechaza (no se paga ni se deduce), false lo vuelve a incluir. Solo en una comprobación enviada. */
	rejected?: boolean;
	/** Por qué se rechaza. */
	reject_reason?: string | null;
}

export interface CreateExpenseMovementParams {
	/** anticipo (dinero que se le da antes o durante; hasta que se aprueba), reembolso (lo que la empresa le debe, ya aprobada) o devolucion (lo que le sobró, ya aprobada). */
	kind: "anticipo" | "reembolso" | "devolucion";
	/** En pesos. */
	amount: number;
	/** Cuándo se pagó. */
	date: string;
	/** transferencia (por omisión), efectivo, tarjeta o nomina (en el siguiente recibo de nómina del empleado; solo si está en Nómina). */
	method?: "transferencia" | "efectivo" | "tarjeta" | "nomina";
	/** Su referencia (folio de la transferencia). */
	reference?: string | null;
}

/** Los parámetros de GET /v1/expense_policy. */
export interface GetExpensePolicyParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateExpensePolicyParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Topes por categoría. Una categoría con null deja de tener tope; las que no manda no cambian. Un gasto que pase un tope no se rechaza: se marca para quien aprueba. */
	limits?: Record<string, {
		/** En México; null sin tope. */
		domestic: number | null;
		/** En el extranjero; null sin tope. */
		abroad: number | null;
		/** dia (al día y por persona) o gasto. */
		per: "dia" | "gasto";
	} | null>;
	/** Hasta cuánto se acepta un gasto sin factura; 0: todos la piden. */
	ticket_limit?: number;
	/** Días después del regreso para comprobar. */
	due_days?: number;
	/** Pedir una nota en cada gasto que pase un tope. */
	note_over_limit?: boolean;
	/** Avisar por correo a quien aprueba cuando le envían una comprobación. */
	notify_approvers?: boolean;
	/** Avisar a la persona cuando se aprueba, se devuelve o se le paga. */
	notify_people?: boolean;
	/** Cómo se suben los tickets y recibos: image (foto), pdf o los dos. Un archivo de otro tipo se rechaza con invalid_request_error. El XML de una factura siempre se acepta. */
	receipt_formats?: ("image" | "pdf")[];
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
	/** Su grupo de clientes (cgr_…), o null para ninguno. */
	group?: string | null;
	/** Su propia lista de precios (prl_…), que gana sobre la de su grupo; null: la de su grupo o la de todos. */
	price_list?: string | null;
	/** Su propio descuento en cada concepto, en %; null: el de su grupo. */
	discount_percent?: number | null;
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
	ieps_taxpayer?: boolean;
	/** Sus días de crédito: sus facturas vencen estos días después de su fecha (due_date, cobranza); null: los de su grupo o los de la empresa. */
	credit_days?: number | null;
	/** Sus condiciones de pago («Crédito a 30 días»): las facturas nuevas en la app empiezan con ellas; null: las de la empresa. POST /v1/invoices no las pone solas: mándelas en payment_terms. */
	payment_terms?: string | null;
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
	/** Su grupo de clientes (cgr_…), o null para ninguno. */
	group?: string | null;
	/** Su propia lista de precios (prl_…), que gana sobre la de su grupo; null: la de su grupo o la de todos. */
	price_list?: string | null;
	/** Su propio descuento en cada concepto, en %; null: el de su grupo. */
	discount_percent?: number | null;
	/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
	ieps_taxpayer?: boolean;
	/** Sus días de crédito: sus facturas vencen estos días después de su fecha (due_date, cobranza); null: los de su grupo o los de la empresa. */
	credit_days?: number | null;
	/** Sus condiciones de pago («Crédito a 30 días»): las facturas nuevas en la app empiezan con ellas; null: las de la empresa. POST /v1/invoices no las pone solas: mándelas en payment_terms. */
	payment_terms?: string | null;
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
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
	unit_key?: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name?: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku?: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price?: number;
	/** Precio abierto: sin precio fijo (una noche de hotel que cambia cada día); cada factura manda su unit_price. */
	open_price?: boolean;
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
	/** Impuestos locales que lleva, como el ISH 3% de hospedaje: van en cada factura con él, sobre sus conceptos. */
	local_taxes?: {
		/** true si es una retención local; false si es un traslado. */
		retention: boolean;
		/** Nombre del impuesto local (ImpLocTrasladado o ImpLocRetenido), como ISH. */
		name: string;
		/** Tasa en por ciento (TasadeTraslado o TasadeRetencion). */
		rate: number;
	}[];
	/** Diésel (15101505) y gasolinas (15101514, 15101515): el permiso de la CNE que lleva cada factura con él en el complemento de Hidrocarburos y Petrolíferos. Una factura cuyo concepto trae su propio hydrocarbon usa ese. null lo quita. */
	hydrocarbon?: {
		/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
		permit_type: string;
		/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
		permit_number: string;
		/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
		subproduct?: string;
	} | null;
	/** Lleva existencias (Inventario): cada factura que lo vende las saca del almacén de su sucursal, y una cancelada las regresa. Ver GET /v1/products/{id}/stock. */
	track_stock?: boolean;
	/** Su costo por unidad en pesos sin IVA, hasta que sus compras den otro: vale las existencias que entran sin unit_cost. */
	cost?: number | null;
	/** Código de barras (EAN, UPC o el suyo). Una factura cuyo concepto lo trae como NoIdentificacion saca existencias de este producto. */
	barcode?: string | null;
	/** Existencia mínima: por debajo, el aviso de existencias bajas lo incluye. */
	min_stock?: number | null;
	/** Se vende en el Portal del cliente: sus clientes lo piden desde ahí, a sus precios (listas de precios), y el pedido llega por confirmar. */
	portal_visible?: boolean;
	/** Lo menos que se le pide desde el portal, en su unidad. */
	min_order_qty?: number | null;
	/** Se pide de tantos en tantos desde el portal (12: de 12 en 12). */
	order_step?: number | null;
	/** Su categoría, con las de arriba separadas por › (también > o /): «Ferretería › Tornillos». Si no existe, se crea. null la quita. */
	category?: string | null;
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
	/** Solo los de esta categoría y sus subcategorías: «Ferretería» o «Ferretería › Tornillos». */
	category?: string;
}

export interface UpdateProductParams {
	/** Nombre corto para encontrarlo, solo para usted; en el CFDI va description. */
	name?: string | null;
	/** Descripción. */
	description?: string;
	/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
	product_key?: string;
	/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
	unit_key?: string;
	/** Nombre de la unidad (Unidad), hasta 20 caracteres. */
	unit_name?: string | null;
	/** Número de identificación o SKU (NoIdentificacion). */
	sku?: string | null;
	/** Precio unitario antes de impuestos (ValorUnitario). */
	unit_price?: number;
	/** Precio abierto: sin precio fijo (una noche de hotel que cambia cada día); cada factura manda su unit_price. */
	open_price?: boolean;
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
	/** Impuestos locales que lleva, como el ISH 3% de hospedaje: van en cada factura con él, sobre sus conceptos. */
	local_taxes?: {
		/** true si es una retención local; false si es un traslado. */
		retention: boolean;
		/** Nombre del impuesto local (ImpLocTrasladado o ImpLocRetenido), como ISH. */
		name: string;
		/** Tasa en por ciento (TasadeTraslado o TasadeRetencion). */
		rate: number;
	}[];
	/** Diésel (15101505) y gasolinas (15101514, 15101515): el permiso de la CNE que lleva cada factura con él en el complemento de Hidrocarburos y Petrolíferos. Una factura cuyo concepto trae su propio hydrocarbon usa ese. null lo quita. */
	hydrocarbon?: {
		/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
		permit_type: string;
		/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
		permit_number: string;
		/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
		subproduct?: string;
	} | null;
	/** Lleva existencias (Inventario): cada factura que lo vende las saca del almacén de su sucursal, y una cancelada las regresa. Ver GET /v1/products/{id}/stock. */
	track_stock?: boolean;
	/** Su costo por unidad en pesos sin IVA, hasta que sus compras den otro: vale las existencias que entran sin unit_cost. */
	cost?: number | null;
	/** Código de barras (EAN, UPC o el suyo). Una factura cuyo concepto lo trae como NoIdentificacion saca existencias de este producto. */
	barcode?: string | null;
	/** Existencia mínima: por debajo, el aviso de existencias bajas lo incluye. */
	min_stock?: number | null;
	/** Se vende en el Portal del cliente: sus clientes lo piden desde ahí, a sus precios (listas de precios), y el pedido llega por confirmar. */
	portal_visible?: boolean;
	/** Lo menos que se le pide desde el portal, en su unidad. */
	min_order_qty?: number | null;
	/** Se pide de tantos en tantos desde el portal (12: de 12 en 12). */
	order_step?: number | null;
	/** Su categoría, con las de arriba separadas por › (también > o /): «Ferretería › Tornillos». Si no existe, se crea. null la quita. */
	category?: string | null;
}

/** Los parámetros de GET /v1/sat_mailbox_messages. */
export interface ListSatMailboxMessagesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** true para solo los no leídos en el SAT, false para los leídos. */
	unread?: boolean;
}

/** Los parámetros de GET /v1/sat_findings. */
export interface ListSatFindingsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** issued (emitidos) o received (recibidos); sin él, los dos. */
	direction?: "issued" | "received";
	/** CFDI desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** CFDI hasta este día (AAAA-MM-DD, completo). */
	date_lte?: string;
	/** Solo los de esta gravedad: critical, warning o info. */
	severity?: "critical" | "warning" | "info";
	/** Solo los CFDI de este proveedor o cliente (su RFC): qué hallazgos tiene. */
	counterparty?: string;
}

/** Los parámetros de GET /v1/sat_finding_counterparties. */
export interface ListSatFindingCounterpartiesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** issued (emitidos: clientes) o received (recibidos: proveedores); sin él, los dos. */
	direction?: "issued" | "received";
	/** CFDI desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** CFDI hasta este día (AAAA-MM-DD, completo). */
	date_lte?: string;
	/** Solo los de esta gravedad: critical, warning o info. */
	severity?: "critical" | "warning" | "info";
	/** Solo quienes tienen este hallazgo (efos_definitivo, cancelado, regla_12…; el code de GET /v1/sat_findings). */
	code?: string;
}

/** Los parámetros de GET /v1/company_report. */
export interface GetCompanyReportParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** Hasta este día (AAAA-MM-DD, completo; hoy a lo más). */
	date_lte?: string;
	/** full (por omisión) o executive: solo la calificación, los indicadores principales, los años y 5 clientes y proveedores. */
	version?: "full" | "executive";
}

/** Los parámetros de GET /v1/materiality_suppliers. */
export interface ListMaterialitySuppliersParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Facturas desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** Facturas hasta este día (AAAA-MM-DD, completo). */
	date_lte?: string;
	/** Solo este proveedor (su RFC). */
	supplier_tax_id?: string;
}

/** Los parámetros de GET /v1/materiality_invoices. */
export interface ListMaterialityInvoicesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Facturas desde este día (AAAA-MM-DD). */
	date_gte?: string;
	/** Facturas hasta este día (AAAA-MM-DD, completo). */
	date_lte?: string;
	/** Solo las de este proveedor (su RFC). */
	supplier_tax_id?: string;
	/** Solo las de este estado: complete, partial o none. Sin él, las que no están completas. */
	state?: "complete" | "partial" | "none";
}

/** Los parámetros de GET /v1/warehouses. */
export interface ListWarehousesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** true para incluir los archivados. */
	include_archived?: boolean;
}

/** Los parámetros de GET /v1/warehouses/{id}/stock. */
export interface ListWarehouseStockParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** true para incluir los productos con track_stock que están en 0. */
	include_empty?: boolean;
}

/** Los parámetros de GET /v1/stock_movements. */
export interface ListStockMovementsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo los de este producto (prd_…). */
	product?: string;
	/** Solo los de este almacén (whs_…). */
	warehouse?: string;
	/** Solo los de este tipo. */
	type?: "sale" | "purchase" | "customer_return" | "supplier_return" | "adjustment" | "count" | "transfer_out" | "transfer_in" | "production_consumption" | "production_output" | "initial" | "cost" | "reversal";
	/** Desde este día (AAAA-MM-DD) u hora (AAAA-MM-DDTHH:MM:SS) de la Ciudad de México. */
	date_gte?: string;
	/** Hasta este día (completo) u hora de la Ciudad de México. */
	date_lte?: string;
}

export interface CreateStockAdjustmentParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** El almacén (whs_…). Por omisión, el de la Matriz. */
	warehouse?: string;
	/** Por qué: shrinkage (merma), theft (robo o extravío), damage (daño), expiration (caducidad), internal_use (uso interno), gift (muestra o regalo), initial (inventario inicial), surplus (sobrante), count (conteo físico) u other. */
	reason: "shrinkage" | "theft" | "damage" | "expiration" | "internal_use" | "gift" | "initial" | "surplus" | "count" | "other";
	/** Una nota, para el kárdex. */
	note?: string | null;
	/** Lo que entra o sale de cada producto, hasta 500 líneas. */
	lines: {
		/** El producto (prd_…), con track_stock: true. */
		product: string;
		/** Cuánto entra (positivo) o sale (negativo), en la unidad del producto. */
		quantity: number;
		/** Lo que costó cada unidad que entra, en pesos sin IVA; sin él, el costo promedio de hoy. */
		unit_cost?: number;
		/** El lote o número de serie, si el producto los lleva. */
		lot?: string;
		/** La caducidad de un lote nuevo (AAAA-MM-DD). */
		expires_on?: string;
	}[];
}

/** Los parámetros de GET /v1/stock_adjustments. */
export interface ListStockAdjustmentsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo los de este almacén (whs_…). */
	warehouse?: string;
	/** applied, pending, rejected o reversed. */
	status?: "applied" | "pending" | "rejected" | "reversed";
}

export interface CreateProductionOrderParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Lo que va a producir (prd_…): un producto con receta (su hoja de costo en Compras › Costos y márgenes). */
	product: string;
	/** Cuántas unidades, en la unidad del producto. */
	quantity: number;
	/** El almacén de donde salen los componentes (whs_…). Por omisión, el de la Matriz. */
	warehouse?: string;
	/** El almacén al que entra lo producido (whs_…). Por omisión, warehouse. */
	destination_warehouse?: string;
	/** Para cuándo (AAAA-MM-DD). */
	due_date?: string | null;
	/** Una nota. */
	note?: string | null;
}

/** Los parámetros de GET /v1/production_orders. */
export interface ListProductionOrdersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo las de este producto (prd_…). */
	product?: string;
	/** draft, in_process, completed o cancelled. */
	status?: "draft" | "in_process" | "completed" | "cancelled";
}

export interface StartProductionOrderParams {
	/** Lo que de verdad se usó de algún componente; los que no mande salen como dice la orden. */
	components?: {
		/** El componente (prd_…) de la orden. */
		product: string;
		/** Lo que de verdad se usó, en la unidad del componente. */
		quantity_used: number;
	}[];
}

export interface CompleteProductionOrderParams {
	/** Cuántas unidades salieron. Por omisión, quantity. */
	quantity_made?: number;
	/** El lote de lo producido, si el producto lleva lotes. Por omisión, OP-<folio>. */
	lot?: string;
	/** La caducidad de ese lote (AAAA-MM-DD). */
	expires_on?: string;
	/** Los otros costos como de verdad fueron; por omisión, los de la receta. */
	other_costs?: {
		/** Qué fue: gas, mano de obra… */
		description: string;
		/** Cuánto, en pesos sin IVA. */
		amount: number;
	}[];
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

export interface VerifyCfdiParams {
	/** El XML del CFDI, como texto. Se leen de él el UUID, los dos RFC y el total. Hasta 4 millones de caracteres. */
	xml?: string;
	/** El texto del QR del PDF (https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=…&re=…&rr=…&tt=…&fe=…), si no tiene el XML. */
	qr?: string;
	/** El folio fiscal, sin XML ni QR. Va con issuer_tax_id, receiver_tax_id y total. */
	uuid?: string;
	/** El RFC del emisor, sin XML ni QR. */
	issuer_tax_id?: string;
	/** El RFC del receptor, sin XML ni QR. */
	receiver_tax_id?: string;
	/** El total del comprobante, sin XML ni QR. El SAT lo compara como número. */
	total?: number;
}

/** Los parámetros de GET /v1/members. */
export interface ListMembersParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateMemberParams {
	/** El rol (id de GET /v1/roles, como admin, contador, facturista o uno suyo). owner es Propietario: solo un propietario da o quita ese rol. */
	role?: string;
	/** true: todos los permisos, incluidos los que se agreguen después (además de los del rol). */
	all_permissions?: boolean;
	/** Permisos además de los del rol (GET /v1/permissions). */
	permissions_added?: string[];
	/** Permisos del rol que esta persona no tiene. */
	permissions_removed?: string[];
	/** Solo trabaja con estos RFC de la empresa. null: con todos. */
	tax_ids?: string[] | null;
	/** Solo emite desde estas sucursales (brn_…, o "matriz" para el domicilio fiscal). null: desde todas. */
	branches?: string[] | null;
}

/** Los parámetros de DELETE /v1/members/{id}. */
export interface DeleteMemberParams {
	/** El miembro (mem_…) que recibe su trabajo; sin él, cualquiera con permiso. */
	transfer_to?: string;
}

/** Los parámetros de GET /v1/invitations. */
export interface ListInvitationsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateInvitationParams {
	/** El emisor (iss_…) de la empresa. Por omisión, su único emisor. */
	issuer?: string;
	/** El correo de la persona: le llega la invitación, válida 7 días. */
	email: string;
	/** El rol (id de GET /v1/roles, como admin, contador, facturista o uno suyo). owner es Propietario: solo un propietario da o quita ese rol. */
	role: string;
	/** true: todos los permisos, incluidos los que se agreguen después (además de los del rol). */
	all_permissions?: boolean;
	/** Permisos además de los del rol (GET /v1/permissions). */
	permissions_added?: string[];
	/** Permisos del rol que esta persona no tiene. */
	permissions_removed?: string[];
	/** Solo trabaja con estos RFC de la empresa. null: con todos. */
	tax_ids?: string[] | null;
	/** Solo emite desde estas sucursales (brn_…, o "matriz" para el domicilio fiscal). null: desde todas. */
	branches?: string[] | null;
}

/** Los parámetros de GET /v1/roles. */
export interface ListRolesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateRoleParams {
	/** El emisor (iss_…) de la empresa. Por omisión, su único emisor. */
	issuer?: string;
	/** Como se ve en la app. */
	name: string;
	/** Descripción. */
	description?: string | null;
	/** true: todos los permisos, incluidos los que se agreguen después. */
	all_permissions?: boolean;
	/** Sus permisos (GET /v1/permissions). Los que otro necesita se agregan solos (timbrar pide ver facturas). */
	permissions?: string[];
}

export interface UpdateRoleParams {
	/** El emisor (iss_…) de la empresa. Por omisión, su único emisor. */
	issuer?: string;
	/** Descripción. */
	description?: string | null;
	/** true: todos los permisos, incluidos los que se agreguen después. */
	all_permissions?: boolean;
	/** Sus permisos (GET /v1/permissions). Los que otro necesita se agregan solos (timbrar pide ver facturas). */
	permissions?: string[];
	/** Como se ve en la app. */
	name?: string;
}

/** Los parámetros de DELETE /v1/roles/{id}. */
export interface DeleteRoleParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateExportParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Un mes completo (AAAA-MM), por la fecha de emisión en hora de la Ciudad de México. Mande month, o from y to. */
	month?: string;
	/** Desde qué día (incluido), en lugar de month. */
	from?: string;
	/** Hasta qué día (incluido), en lugar de month. A lo más 7 ejercicios. */
	to?: string;
	/** issued (las facturas que emitió el emisor, por omisión) o received (las que le hicieron). */
	direction?: "issued" | "received";
	/** Solo un tipo de comprobante: I, E, P, T o N. Por omisión, todos. */
	type?: "I" | "E" | "P" | "T" | "N";
	/** zip (los archivos de cada factura, por omisión) o xlsx (un Excel con una fila por factura). */
	format?: "zip" | "xlsx";
	/** Con format zip: xml (por omisión), pdf, o xml_and_pdf (los dos de cada factura). */
	files?: "xml" | "pdf" | "xml_and_pdf";
}

/** Los parámetros de GET /v1/exports. */
export interface ListExportsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
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
	/** Solo las de este centro de costo (ccn_…), o none para las que no tienen. */
	cost_center?: string;
}

export interface UpdateSatInvoiceParams {
	/** Su centro de costo (ccn_…), o null para quitárselo. Los complementos de pago y los traslados no llevan. */
	cost_center?: string | null;
}

/** Los parámetros de GET /v1/sat_retentions. */
export interface ListSatRetentionsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** received (por omisión) o issued. */
	direction?: "received" | "issued";
	/** active o canceled. Sin él, las dos. */
	status?: "active" | "canceled";
	/** El RFC de quien retuvo (recibidas) o a quien le retuvo (emitidas). */
	counterparty_tax_id?: string;
	/** Clave de la retención (CveRetenc) de dos dígitos, como 16 o 26. */
	code?: string;
	/** Solo las de un ejercicio, como 2025. */
	year?: number;
	/** Solo las que cubren este mes (1 a 12): una anual de enero a diciembre cubre todos. */
	month?: number;
}

export interface CancelSatRetentionParams {
	/** Motivo de cancelación (c_MotivoCancelacion): 01 con errores con relación (lleva substitution), 02 con errores sin relación (por omisión), 03 no se llevó a cabo, 04 solo en una factura global, cuando una venta incluida se facturó a nombre del cliente. */
	motive?: "01" | "02" | "03" | "04";
	/** El comprobante que sustituye a este (su id o su UUID), con el motivo 01. */
	substitution?: string;
}

/** Los parámetros de GET /v1/portal_suppliers. */
export interface ListPortalSuppliersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo los que estén en este estado. */
	status?: "invited" | "onboarding" | "in_review" | "approved" | "rejected" | "suspended";
	/** Solo el de este RFC. */
	tax_id?: string;
}

/** Los parámetros de GET /v1/supplier_invoices. */
export interface ListSupplierInvoicesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo las que estén en este estado. */
	status?: "received" | "approved" | "scheduled" | "paid" | "rejected";
	/** Solo las de este proveedor (sup_…). */
	supplier?: string;
	/** Solo las que llegaron desde este día (AAAA-MM-DD). */
	received_since?: string;
}

export interface ScheduleSupplierInvoiceParams {
	/** El día en que la pagará (AAAA-MM-DD, hoy o después). El proveedor lo ve. */
	pay_on: string;
}

export interface MarkSupplierInvoicePaidParams {
	/** El día en que la pagó (AAAA-MM-DD, hoy o antes). */
	paid_on: string;
	/** La referencia del pago (la de la transferencia o del ERP), o null. */
	reference?: string | null;
}

export interface RefreshSatDeclarationsParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
}

/** Los parámetros de GET /v1/sat_refreshes. */
export interface ListSatRefreshesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** Solo las de un emisor (iss_…). */
	issuer?: string;
	/** Solo las de un documento. */
	document?: "declarations" | "compliance_opinion" | "tax_status_certificate" | "sat_mailbox";
}

/** Los parámetros de GET /v1/sat_declarations. */
export interface ListSatDeclarationsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo las de un ejercicio, como 2025. */
	year?: number;
	/** monthly (provisionales o definitivas), annual (la anual) o dyp (Declaraciones y pagos). */
	source?: "monthly" | "annual" | "dyp";
	/** Solo las de un mes (1 a 12). */
	month?: number;
	/** normal o complementary (complementarias). */
	type?: "normal" | "complementary";
}

/** Los parámetros de GET /v1/sat_declarations/calendar. */
export interface GetSatDeclarationCalendarParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** El ejercicio, como 2026. Por omisión, el actual. */
	year?: number;
}

/** Los parámetros de GET /v1/sat_declarations/annual_preload. */
export interface GetSatAnnualPreloadParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** El ejercicio, como 2025. Por omisión, el anterior (el que se declara). */
	year?: number;
}

export interface CreateTicketParams {
	/** El emisor (iss_…) que vendió. Por omisión, su único emisor. */
	issuer?: string;
	/** El folio de la venta en su sistema, único por emisor: letras, números, - _ / y punto. Registrar el mismo folio con el mismo total responde el ticket que ya existe. */
	folio: string;
	/** Lo que se cobró, impuestos incluidos y sin propina. Con `lines` puede omitirlo (es su suma); si lo manda, debe ser igual. */
	total?: number;
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
	/** Impuestos locales incluidos en su total, como el ISH 3.5% de hospedaje, con `product_key` (un producto lleva los suyos). Cada uno se calcula sobre la base de este concepto y la factura los suma por nombre y tasa en el complemento de impuestos locales. */
	local_taxes?: {
		/** `false`: un traslado local que se suma (el ISH). `true`: una retención local que el cliente resta (el cedular); la factura global, a público en general, no la lleva. */
		retention: boolean;
		/** Su nombre en el CFDI (ImpLocTrasladado o ImpLocRetenido), como «ISH». */
		name: string;
		/** La tasa en porcentaje: 3.5 es 3.5%. */
		rate: number;
	}[];
	/** Quién pagó, para reconocer la venta en Tickets. No es el receptor de la factura (eso lo escribe el comprador en el portal) y no se le manda nada. */
	buyer?: {
		/** Su nombre o el de su empresa, como lo conoce su sistema. */
		name?: string;
		/** Su correo. */
		email?: string;
	};
	/** Sucursal (brn_…) donde se hizo la venta: su factura se timbra desde ahí (su código postal en LugarExpedicion) y el portal muestra el nombre comercial y el logo de la sucursal. Sin ella, la Matriz. */
	branch?: string;
	/** Una venta de varios conceptos (el folio de un hotel: noches, desayunos, lavandería), cada uno con su producto o sus claves, sus impuestos y lo que se cobró por él; hasta 200. En lugar de `product`, `description`, `product_key`, `unit_key` e `iva`. La factura del cliente lleva un concepto por línea; la factura global, uno por cada combinación de impuestos del ticket. */
	lines?: {
		/** Un producto (prd_…) de su catálogo: sus claves, IVA e impuestos locales. */
		product?: string;
		/** El concepto. Con `product`, reemplaza su descripción; sin él, va con `product_key`. */
		description?: string;
		/** c_ClaveProdServ (8 dígitos), si no usa `product`. */
		product_key?: string;
		/** c_ClaveUnidad. Por omisión, la de la clave del producto. */
		unit_key?: string;
		/** Tasa de IVA incluida en su total. Por omisión 0.16. */
		iva?: "0" | "0.16" | "0.08" | "exento";
		/** Impuestos locales incluidos en su total, como el ISH 3.5% de hospedaje, con `product_key` (un producto lleva los suyos). Cada uno se calcula sobre la base de este concepto y la factura los suma por nombre y tasa en el complemento de impuestos locales. */
		local_taxes?: {
			/** `false`: un traslado local que se suma (el ISH). `true`: una retención local que el cliente resta (el cedular); la factura global, a público en general, no la lleva. */
			retention: boolean;
			/** Su nombre en el CFDI (ImpLocTrasladado o ImpLocRetenido), como «ISH». */
			name: string;
			/** La tasa en porcentaje: 3.5 es 3.5%. */
			rate: number;
		}[];
		/** Unidades (noches, piezas). Por omisión 1. */
		quantity?: number;
		/** Lo que se cobró por este concepto, impuestos incluidos. */
		total: number;
	}[];
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
	/** `auto` (por omisión): los tickets que nadie facturó van solos a la factura global al terminar su periodo. `off`: Fiscalisto no hace factura global de los tickets (por ejemplo, porque su punto de venta ya la hace); quedan pendientes y usted responde por ellos ante el SAT. */
	global_invoice?: "auto" | "off";
	/** `true` (por omisión): el comprador busca su ticket con el código y el total. `false`: solo con el código (sus 4 caracteres al azar; cada ticket se bloquea tras varios intentos fallidos). */
	ask_total?: boolean;
	/** El título del portal, en lugar de «Facture su ticket». `null` lo quita. */
	portal_title?: string | null;
	/** Un mensaje bajo el título (instrucciones, horario, a quién escribir). `null` lo quita. */
	portal_message?: string | null;
	/** Dónde encuentra el comprador su código, bajo el campo («Viene en su correo de salida»). `null` pone el de Fiscalisto. */
	code_hint?: string | null;
	/** El tema del portal: `auto` (por omisión), el del dispositivo del comprador, que puede cambiarlo; `light` o `dark`, siempre ese. Vale en su página, sus QR y dentro de su sitio (salvo que el código para incrustarlo elija otro). */
	portal_theme?: "auto" | "light" | "dark";
	/** El color de los botones del portal, como `#0b7c77`. `null` pone el de Fiscalisto. */
	portal_accent?: string | null;
	/** Lo redondo de las esquinas del portal, en píxeles (0 a 24). `null` pone el de Fiscalisto (10). */
	portal_radius?: number | null;
	/** Todo lo demás de cómo se ve el portal (Autofactura › Cómo se ve el portal): acomodo, encabezado, colores, letra, bordes, textos en español e inglés, las formas de dar los datos, el botón para volver a su sitio y CSS propio. Mande solo lo que cambia: `colors`, `ways` y `texts` se combinan por llave (un texto en `null` lo quita); lo demás se reemplaza. `null` regresa todo al diseño de Fiscalisto. La leyenda «Facturado con Fiscalisto» no se puede ocultar. */
	portal_style?: {
		/** `checkout` (por omisión): la factura se llena junto al formulario. `compact`: solo el formulario, la factura plegada. `card`: el formulario en una tarjeta al centro. */
		layout?: "checkout" | "compact" | "card";
		/** `comfortable` o `compact`. */
		density?: "comfortable" | "compact";
		/** Qué dice arriba: `name_rfc` (por omisión), `name`, `logo_name` o `logo`. El logo y el nombre salen de Marca y documentos. */
		header?: "logo" | "name" | "name_rfc" | "logo_name";
		/** El tamaño del logo: `s`, `m` o `l`. */
		logo_size?: "s" | "m" | "l";
		/** La forma del logo: `square`, `rounded` o `circle`. */
		logo_shape?: "square" | "rounded" | "circle";
		/** Los colores de la página; cada uno se combina con lo guardado. */
		colors?: {
			/** El fondo de la página, como `#f5f1e8`; `null` usa el del tema. */
			background?: string | null;
			/** El fondo de los campos y tarjetas, como `#f5f1e8`; `null` usa el del tema. */
			card?: string | null;
			/** El texto, como `#f5f1e8`; `null` usa el del tema. */
			text?: string | null;
			/** El texto de los botones, como `#f5f1e8`; `null` usa el del tema. */
			button_text?: string | null;
		};
		/** La letra: `system` (por omisión) o una de Google Fonts. */
		font?: "system" | "inter" | "manrope" | "dm-sans" | "work-sans" | "nunito" | "space-grotesk" | "montserrat" | "lora" | "merriweather" | "playfair-display" | "cormorant-garamond";
		/** La letra de los títulos; `null`, la misma del texto. */
		heading_font?: "system" | "inter" | "manrope" | "dm-sans" | "work-sans" | "nunito" | "space-grotesk" | "montserrat" | "lora" | "merriweather" | "playfair-display" | "cormorant-garamond" | null;
		/** El tamaño del título: `s`, `m` o `l`. */
		heading_size?: "s" | "m" | "l";
		/** Los bordes: `none`, `subtle` (por omisión) o `strong`. */
		borders?: "none" | "subtle" | "strong";
		/** La sombra: `none`, `soft` (por omisión) o `strong`. */
		shadow?: "none" | "soft" | "strong";
		/** Cómo llama el portal a lo que se factura, en todos sus textos: `ticket` (por omisión), `nota`, `cuenta`, `compra`, `pedido`, `orden`, `reservacion`, `estancia` o `boleto`. Un hotel usa `reservacion`: «Esta reservación ya se facturó». */
		noun?: "ticket" | "nota" | "cuenta" | "compra" | "pedido" | "orden" | "reservacion" | "estancia" | "boleto";
		/** Los textos, cada uno con `es` y `en`, combinados por llave con lo guardado. El título, el mensaje y dónde viene el código en español son `portal_title`, `portal_message` y `code_hint`; aquí van en inglés. */
		texts?: {
			/** El título (en español es `portal_title`); `null` vuelve al de Fiscalisto. */
			title?: {
				/** El título (en español es `portal_title`) en inglés. */
				en?: string;
			} | null;
			/** El mensaje bajo el título (en español es `portal_message`); `null` vuelve al de Fiscalisto. */
			message?: {
				/** El mensaje bajo el título (en español es `portal_message`) en inglés. */
				en?: string;
			} | null;
			/** Dónde viene el código (en español es `code_hint`); `null` vuelve al de Fiscalisto. */
			code_hint?: {
				/** Dónde viene el código (en español es `code_hint`) en inglés. */
				en?: string;
			} | null;
			/** El nombre del paso 1; `null` vuelve al de Fiscalisto. */
			step_ticket?: {
				/** El nombre del paso 1 en español. */
				es?: string;
				/** El nombre del paso 1 en inglés. */
				en?: string;
			} | null;
			/** El nombre del paso 2; `null` vuelve al de Fiscalisto. */
			step_data?: {
				/** El nombre del paso 2 en español. */
				es?: string;
				/** El nombre del paso 2 en inglés. */
				en?: string;
			} | null;
			/** El nombre del paso 3; `null` vuelve al de Fiscalisto. */
			step_invoice?: {
				/** El nombre del paso 3 en español. */
				es?: string;
				/** El nombre del paso 3 en inglés. */
				en?: string;
			} | null;
			/** El botón para buscar el ticket; `null` vuelve al de Fiscalisto. */
			find_button?: {
				/** El botón para buscar el ticket en español. */
				es?: string;
				/** El botón para buscar el ticket en inglés. */
				en?: string;
			} | null;
			/** La pregunta de cómo dar los datos; `null` vuelve al de Fiscalisto. */
			how_question?: {
				/** La pregunta de cómo dar los datos en español. */
				es?: string;
				/** La pregunta de cómo dar los datos en inglés. */
				en?: string;
			} | null;
			/** El botón para facturar; `null` vuelve al de Fiscalisto. */
			submit?: {
				/** El botón para facturar en español. */
				es?: string;
				/** El botón para facturar en inglés. */
				en?: string;
			} | null;
			/** El título al terminar; `null` vuelve al de Fiscalisto. */
			success_title?: {
				/** El título al terminar en español. */
				es?: string;
				/** El título al terminar en inglés. */
				en?: string;
			} | null;
			/** El mensaje al terminar; `null` vuelve al de Fiscalisto. */
			success_message?: {
				/** El mensaje al terminar en español. */
				es?: string;
				/** El mensaje al terminar en inglés. */
				en?: string;
			} | null;
			/** El título de la elección de conceptos («Conceptos en su factura»; ver `invoice_concepts`); `null` vuelve al de Fiscalisto. */
			concepts_title?: {
				/** El título de la elección de conceptos («Conceptos en su factura»; ver `invoice_concepts`) en español. */
				es?: string;
				/** El título de la elección de conceptos («Conceptos en su factura»; ver `invoice_concepts`) en inglés. */
				en?: string;
			} | null;
			/** La opción de conceptos desglosados («Desglosados»); `null` vuelve al de Fiscalisto. */
			concepts_itemized?: {
				/** La opción de conceptos desglosados («Desglosados») en español. */
				es?: string;
				/** La opción de conceptos desglosados («Desglosados») en inglés. */
				en?: string;
			} | null;
			/** La opción de un solo concepto («Un solo concepto»); `null` vuelve al de Fiscalisto. */
			concepts_single?: {
				/** La opción de un solo concepto («Un solo concepto») en español. */
				es?: string;
				/** La opción de un solo concepto («Un solo concepto») en inglés. */
				en?: string;
			} | null;
			/** La opción de conceptos por categoría («Por categoría»); `null` vuelve al de Fiscalisto. */
			concepts_grouped?: {
				/** La opción de conceptos por categoría («Por categoría») en español. */
				es?: string;
				/** La opción de conceptos por categoría («Por categoría») en inglés. */
				en?: string;
			} | null;
		};
		/** Las formas de dar sus datos además de escribirlos. Todas `true` por omisión menos `norfc`. */
		ways?: {
			/** Ofrecer subir la constancia (PDF). */
			constancia?: boolean;
			/** Ofrecer escanear el QR de la constancia. */
			qr?: boolean;
			/** Ofrecer buscar los datos con RFC e idCIF. */
			cif?: boolean;
			/** Ofrecer «Ya le hemos facturado antes» (RFC y correo). */
			recall?: boolean;
			/** Ofrecer facturar a clientes en el extranjero (el tax ID es opcional). */
			abroad?: boolean;
			/** Ofrecer «No tengo RFC»: facturar a nombre de la persona con XAXX010101000, régimen 616, uso S01 y el CP del emisor. `false` por omisión. */
			norfc?: boolean;
		};
		/** `true`: no se factura sin correo. Por omisión `false`. */
		email_required?: boolean;
		/** Decir hasta cuándo se puede facturar. Por omisión `true`. */
		show_deadline?: boolean;
		/** Un botón al terminar para volver a su sitio; `null` lo quita. */
		back?: {
			/** El texto del botón. */
			label: string;
			/** A dónde lleva (https). */
			url: string;
		} | null;
		/** CSS propio, dentro del portal y sin llegar a su pie. Se quitan @import, url() y lo que cargue o ejecute algo; la leyenda «Facturado con Fiscalisto» se queda. */
		css?: string;
	} | null;
	/** Cuando se factura una persona moral y retiene (1.25% de ISR a un emisor en RESICO, artículo 113-J de la LISR, o lo que diga el producto): `keep_total` (por omisión), la base crece para que la factura sume lo que se pagó; `subtract`, la base es la del ticket y la retención se resta, así que el total de la factura es menor a lo pagado. */
	retention_mode?: "keep_total" | "subtract";
	/** La serie de las facturas que los compradores se hacen en el portal (y las que se emiten desde un ticket), como `AF`: hasta 25 caracteres, sin `|`. `null` o una vacía usa la serie de facturas del emisor. La factura global sigue con la serie de siempre. */
	invoice_series?: string | null;
	/** `true`: el portal le pide al comprador una nota para el PDF de su factura (hasta 500 caracteres; Autofactura › Nota del cliente). Solo sale en el PDF, nunca en el XML. Por omisión `false`. */
	customer_notes?: boolean;
	/** Los conceptos de la factura que se hace el comprador (Autofactura › Conceptos de la factura): desglosados o en uno solo, y si el comprador puede elegir. Mande solo lo que cambia; `null` regresa a desglosados sin elección. */
	invoice_concepts?: {
		/** `itemized` (por omisión): un concepto por renglón del ticket (Hospedaje, Restaurante, Bar…). `single`: uno solo, con `description`. `grouped`: los conceptos de `groups`. Un concepto lleva un solo juego de impuestos, así que los renglones con otros (una noche con ISH, IVA 0 %, retenciones) van aparte. El total y los impuestos no cambian. */
		mode?: "itemized" | "single" | "grouped";
		/** `true`: el comprador elige en el portal (también dentro de su sitio) entre `customer_options`, empezando en `mode`. */
		customer_choice?: boolean;
		/** Entre qué puede elegir el comprador, por omisión `itemized` y `single`. `mode` va siempre; `grouped` necesita `groups`. */
		customer_options?: ("itemized" | "single" | "grouped")[];
		/** La descripción del concepto único, como «Consumo» (por omisión) o «Servicios de hospedaje y alimentos». */
		description?: string;
		/** La ClaveProdServ del concepto único. `null` (por omisión): la del renglón más grande del ticket. */
		product_key?: string | null;
		/** Su ClaveUnidad, con `product_key`, como `E48`. `null`: la del renglón más grande. */
		unit_key?: string | null;
		/** Los conceptos de `grouped`, hasta 12: cada renglón va al primero que lo toma, por su clave del SAT (`sat_keys`) o la categoría de su producto (`categories`). Reemplaza la lista guardada. */
		groups?: {
			/** La descripción del concepto, como «Alimentos y bebidas». */
			name: string;
			/** Su ClaveProdServ. `null` (por omisión): la de su renglón más grande. */
			product_key?: string | null;
			/** Su ClaveUnidad, con `product_key`, como `E48`. */
			unit_key?: string | null;
			/** Los renglones cuya clave del SAT empieza así: `9010` toma 90101501 (restaurante) y 90101503 (bar); `90111800`, solo hospedaje. */
			sat_keys?: string[];
			/** Los renglones de los productos de estas categorías y sus subcategorías, por su ruta como la da `category` del producto («Alimentos › Bebidas»). */
			categories?: string[];
		}[];
		/** Con `grouped`, los renglones que ningún grupo toma: `itemized` (por omisión) como vienen, o `group` en un concepto más llamado `ungrouped_name`. */
		ungrouped?: "itemized" | "group";
		/** El nombre de ese concepto, por omisión «Otros». */
		ungrouped_name?: string;
	} | null;
	/** Los conceptos de la factura global: `ticket` (por omisión), uno «Venta» por ticket con su folio como `NoIdentificacion`; `summary`, solo el monto total del periodo, uno por combinación de impuestos con `NoIdentificacion` «Resumen» (regla 2.7.1.21 de la RMF 2026). `summary` es solo para un emisor persona física en RESICO (626); otro contesta `invalid_request`. */
	global_concepts?: "ticket" | "summary";
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

/** Los parámetros de GET /v1/accounting/general_ledger. */
export interface GetGeneralLedgerParams {
	/** El primer mes (AAAA-MM). */
	from_month: string;
	/** El último mes (AAAA-MM), hasta 12 meses después; por omisión, from_month. */
	to_month?: string;
	/** Solo esta cuenta, por su número en el catálogo. */
	account?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/financial_statements. */
export interface GetFinancialStatementsParams {
	/** El mes (AAAA-MM). */
	month: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/cross_checks. */
export interface GetCrossChecksParams {
	/** El ejercicio. Por omisión, el actual. */
	year?: number;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/vat_refund. */
export interface GetVatRefundParams {
	/** El mes del saldo a revisar (AAAA-MM). Sin él, solo los saldos. */
	month?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/cross_checks/cfdi. */
export interface GetCrossCheckCfdiParams {
	/** El mes (AAAA-MM), cuya declaración ya venció. */
	month: string;
	/** La cifra: vat_charged, vat_creditable, vat_withheld, isr_income, isr_withheld_salaries, isr_withheld_suppliers o vat_withheld_suppliers. */
	key: "vat_charged" | "vat_creditable" | "vat_withheld" | "isr_income" | "isr_withheld_salaries" | "isr_withheld_suppliers" | "vat_withheld_suppliers";
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/accounts. */
export interface ListLedgerAccountsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateLedgerAccountParams {
	/** Su número en el catálogo, por ejemplo 210-01-01. No se repite. */
	number: string;
	/** Su nombre. */
	name: string;
	/** Una subcuenta del código agrupador del SAT (Anexo 24), por ejemplo 210.01. */
	grouping_code: string;
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
}

export interface CreateManualEntryParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** La fecha de la póliza (AAAA-MM-DD). */
	date: string;
	/** Su concepto. */
	description: string;
	/** adjustment (ajuste), accrual (provisión), reclassification (reclasificación) u other. */
	kind?: "adjustment" | "accrual" | "reclassification" | "other";
	/** El tipo de póliza: journal (diario), income (ingresos) o expense (egresos). */
	journal_type?: "journal" | "income" | "expense";
	/** Solo con kind accrual o adjustment: la póliza se revierte sola el día 1 del mes siguiente (una provisión, para cuando llegue la factura; un ajuste de cierre como la revaluación cambiaria). */
	reverse_next_month?: boolean;
	/** El UUID del CFDI con el que se relaciona, si hay uno. */
	uuid?: string | null;
	/** Con uuid: el RFC de la otra parte de ese CFDI. */
	uuid_tax_id?: string | null;
	/** Una póliza recurrente: se repite cada mes, el mismo día (el último si la fecha es el último del mes), hasta este mes (AAAA-MM), hasta 60 meses. null: solo en su fecha. */
	repeat_until?: string | null;
	/** Sus cargos y abonos: cada renglón uno u otro; los cargos suman lo mismo que los abonos. */
	lines: {
		/** El número de la cuenta en su catálogo (GET /v1/accounting/accounts), por ejemplo 205-06. */
		account: string;
		/** El cargo. */
		debit?: number;
		/** El abono. */
		credit?: number;
		/** Su centro de costo (ccn_…, GET /v1/cost_centers), opcional: los resultados por centro de costo y los presupuestos lo leen. */
		cost_center?: string | null;
	}[];
}

/** Los parámetros de GET /v1/accounting/manual_entries. */
export interface ListManualEntriesParams {
	/** Cuántas por página, de 1 a 1,000. Por omisión 100. */
	limit?: number;
	/** La última (mje_…) de la página anterior. */
	starting_after?: string;
	/** Desde este día (AAAA-MM-DD). */
	from?: string;
	/** Hasta este día (AAAA-MM-DD). */
	to?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateManualEntryParams {
	/** La fecha de la póliza (AAAA-MM-DD). */
	date: string;
	/** Su concepto. */
	description: string;
	/** adjustment (ajuste), accrual (provisión), reclassification (reclasificación) u other. */
	kind?: "adjustment" | "accrual" | "reclassification" | "other";
	/** El tipo de póliza: journal (diario), income (ingresos) o expense (egresos). */
	journal_type?: "journal" | "income" | "expense";
	/** Solo con kind accrual o adjustment: la póliza se revierte sola el día 1 del mes siguiente (una provisión, para cuando llegue la factura; un ajuste de cierre como la revaluación cambiaria). */
	reverse_next_month?: boolean;
	/** El UUID del CFDI con el que se relaciona, si hay uno. */
	uuid?: string | null;
	/** Con uuid: el RFC de la otra parte de ese CFDI. */
	uuid_tax_id?: string | null;
	/** Una póliza recurrente: se repite cada mes, el mismo día (el último si la fecha es el último del mes), hasta este mes (AAAA-MM), hasta 60 meses. null: solo en su fecha. */
	repeat_until?: string | null;
	/** Sus cargos y abonos: cada renglón uno u otro; los cargos suman lo mismo que los abonos. */
	lines: {
		/** El número de la cuenta en su catálogo (GET /v1/accounting/accounts), por ejemplo 205-06. */
		account: string;
		/** El cargo. */
		debit?: number;
		/** El abono. */
		credit?: number;
		/** Su centro de costo (ccn_…, GET /v1/cost_centers), opcional: los resultados por centro de costo y los presupuestos lo leen. */
		cost_center?: string | null;
	}[];
}

export interface ImportManualEntriesParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Las pólizas, hasta 3,000. */
	entries: {
		/** La fecha de la póliza (AAAA-MM-DD). */
		date: string;
		/** El tipo de póliza: journal (diario), income (ingresos) o expense (egresos). */
		journal_type?: "journal" | "income" | "expense";
		/** Su número en el otro sistema (por ejemplo Dr 15). Con la fecha, el tipo y el total, reconoce una póliza ya importada y la salta. */
		number?: string | null;
		/** Su concepto. */
		description: string;
		/** Sus cargos y abonos: cada renglón uno u otro; los cargos suman lo mismo que los abonos. */
		lines: {
			/** El número de la cuenta en su catálogo (GET /v1/accounting/accounts), por ejemplo 205-06. */
			account: string;
			/** El cargo. */
			debit?: number;
			/** El abono. */
			credit?: number;
			/** Su centro de costo (ccn_…, GET /v1/cost_centers), opcional: los resultados por centro de costo y los presupuestos lo leen. */
			cost_center?: string | null;
		}[];
	}[];
}

/** Los parámetros de GET /v1/accounting/opening_balances. */
export interface GetOpeningBalancesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface SetOpeningBalancesParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Cuándo empiezan sus libros (el día 1 de un mes): lo anterior no se cuenta. */
	date: string;
	/** El saldo de cada cuenta, deudor o acreedor; las dos columnas suman lo mismo. Sin renglones, borra los saldos iniciales. */
	lines: {
		/** El número de la cuenta en su catálogo (GET /v1/accounting/accounts), por ejemplo 205-06. */
		account: string;
		/** Su saldo deudor. */
		debit?: number;
		/** Su saldo acreedor. */
		credit?: number;
	}[];
}

/** Los parámetros de GET /v1/accounting/fixed_assets. */
export interface ListFixedAssetsParams {
	/** El mes (AAAA-MM) a cuyo cierre van las cifras. Por omisión, el actual. */
	month?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateFixedAssetParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Qué es. */
	description: string;
	/** El tipo de activo por su uso CFDI: I01 construcciones, I02 mobiliario, I03 transporte, I04 cómputo, I05 dados y troqueles, I06 telefonía, I07 satelital, I08 otra maquinaria. Da su tasa de depreciación. */
	cfdi_use: "I01" | "I02" | "I03" | "I04" | "I05" | "I06" | "I07" | "I08";
	/** El monto original sin IVA. */
	cost: number;
	/** La fecha de compra. */
	acquired_on: string;
	/** Desde cuándo se usa (se deprecia desde el mes siguiente); por omisión, la de compra. */
	in_use_since?: string | null;
}

export interface DisposeFixedAssetParams {
	/** El día de la venta o la baja. */
	date: string;
	/** sale (venta) o write_off (robo, pérdida, desecho). */
	reason?: "sale" | "write_off";
	/** Una nota. */
	note?: string | null;
}

/** Los parámetros de GET /v1/accounting/closed_period. */
export interface GetClosedPeriodParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface SetClosedPeriodParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** El último mes cerrado (AAAA-MM); los anteriores quedan cerrados también. null reabre todos. */
	closed_through: string | null;
}

/** Los parámetros de GET /v1/accounting/fx_revaluations/{month}. */
export interface GetFxRevaluationParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateFxRevaluationParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** El tipo de cambio de cierre (pesos por unidad) de cada moneda que aparece en currencies, por ejemplo {"USD": 18.2915}. Por lo general, el FIX que trae closing_rate. */
	rates: Record<string, number>;
}

/** Los parámetros de DELETE /v1/accounting/fx_revaluations/{month}. */
export interface DeleteFxRevaluationParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/cost_of_sales/{month}. */
export interface GetCostOfSalesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateCostOfSalesParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** Lo que vale el inventario al cierre del mes en pesos (0 si no hay). Por lo general, suggested_ending_inventory o el de su conteo físico. */
	ending_inventory: number;
}

/** Los parámetros de DELETE /v1/accounting/cost_of_sales/{month}. */
export interface DeleteCostOfSalesParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/budgets/{year}. */
export interface GetBudgetParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** El centro de costo (ccn_…). Sin él, toda la empresa. */
	cost_center?: string;
	/** El mes de la comparación, de 1 a 12. Por omisión el actual en el año en curso, 12 en uno pasado. */
	month?: number;
}

export interface SaveBudgetParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** El centro de costo (ccn_…) del presupuesto. Sin él, el de toda la empresa. Cada centro tiene el suyo. */
	cost_center?: string | null;
	/** Las cuentas del presupuesto. Reemplaza todo el presupuesto de ese año (y centro): una cuenta que no mande sale; una lista vacía lo borra. */
	lines: {
		/** El número de una cuenta de resultados (código agrupador 4 a 7) de su catálogo, por ejemplo 601-84. */
		account: string;
		/** Los 12 meses, de enero a diciembre, en pesos y en la naturaleza de la cuenta: un ingreso como ingreso, un gasto como gasto. */
		months: number[];
	}[];
}

/** Los parámetros de GET /v1/accounting/cost_center_results/{month}. */
export interface GetCostCenterResultsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/payroll_provisions/{month}. */
export interface GetPayrollProvisionParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreatePayrollProvisionParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** La prima de riesgo de trabajo de su determinación anual, como fracción (0.0054355 es 0.54355%). Se guarda para los meses siguientes. Sin ella, la guardada o la prima media de la clase. */
	employer_risk_premium?: number;
	/** Las cuotas patronales al IMSS en pesos, si no quiere el calculado (el del SUA, por ejemplo). */
	imss?: number;
	/** Retiro y cesantía y vejez en pesos, si no quiere el calculado (el del SUA, por ejemplo). */
	sar?: number;
	/** La aportación al Infonavit en pesos, si no quiere el calculado (el del SUA, por ejemplo). */
	infonavit?: number;
	/** El impuesto sobre nómina en pesos, si no quiere el calculado (el del SUA, por ejemplo). */
	payroll_tax?: number;
}

/** Los parámetros de DELETE /v1/accounting/payroll_provisions/{month}. */
export interface DeletePayrollProvisionParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/tax_determinations/{month}. */
export interface GetTaxDeterminationParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface CreateTaxDeterminationParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** El pago provisional de ISR del mes en pesos (0 si no hay). Por lo general, suggested_isr. */
	isr: number;
}

/** Los parámetros de DELETE /v1/accounting/tax_determinations/{month}. */
export interface DeleteTaxDeterminationParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

/** Los parámetros de GET /v1/accounting/bank_accounts. */
export interface ListLedgerBankAccountsParams {
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface UpdateLedgerBankAccountParams {
	/** El emisor (iss_…). Por omisión, su único emisor. */
	issuer?: string;
	/** La moneda de la cuenta (ISO 4217: MXN, USD…). Una en otra moneda se revalúa con las revaluaciones cambiarias. */
	currency: string;
	/** Su nombre en el catálogo. */
	name?: string;
}

/** Los parámetros de GET /v1/accounting/bank_movements. */
export interface ListBankMovementsParams {
	/** El mes (AAAA-MM). Por omisión, el actual. */
	month?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
}

export interface PostBankMovementParams {
	/** El número de la cuenta del catálogo que va contra Bancos (GET /v1/accounting/accounts). */
	account: string;
	/** El concepto de la póliza. Sin él, el texto del banco. */
	description?: string;
	/** Sugerir esta cuenta para los movimientos con el mismo texto del banco (suggested_account). */
	remember?: boolean;
}

export interface MarkBankMovementParams {
	/** paid_invoices: pagó facturas que ya están en la contabilidad; ignored: no se registra; pending: vuelve a por registrar. Solo retiros. */
	status: "pending" | "paid_invoices" | "ignored";
}

/** Los parámetros de GET /v1/accounting/electronic_accounting. */
export interface GetElectronicAccountingParams {
	/** El mes (AAAA-MM), o AAAA-13 para la balanza de cierre de un ejercicio ya terminado. */
	month: string;
	/** Solo con AAAA-13: true (por omisión) incluye la póliza de cierre, que cancela ingresos, costos y gastos contra el resultado del ejercicio (305.01 utilidad o 305.02 pérdida); false manda los saldos de diciembre sin movimientos. */
	closing_entry?: "true" | "false";
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
	/** shopify, woocommerce, mercadolibre, tiendanube, amazon, mercadopago, conekta u openpay. */
	platform: "shopify" | "mercadolibre" | "amazon" | "tiendanube" | "woocommerce" | "mercadopago" | "conekta" | "openpay";
	/** Shopify: el dominio de la tienda (mi-tienda.myshopify.com). */
	shop?: string;
	/** Shopify: el Client ID de la app de la tienda (Dev Dashboard). */
	client_id?: string;
	/** Shopify: el Client secret de esa app; con él se firman los webhooks. Se guarda cifrado y nunca se muestra. */
	client_secret?: string;
	/** Mercado Pago: el Access Token de producción (APP_USR-…), en Tus integraciones › su aplicación › Credenciales de producción. Shopify, solo apps personalizadas antiguas: su token de la Admin API (shpat_…); client_secret es entonces su API secret key. Se guarda cifrado y nunca se muestra. */
	access_token?: string;
	/** Conekta: la llave privada (key_…). Openpay: la llave privada (sk_…). Se guarda cifrada y nunca se muestra. */
	private_key?: string;
	/** Openpay: el ID de comercio (m…). */
	merchant_id?: string;
	/** Openpay: true para conectar su comercio de pruebas (sandbox). */
	sandbox?: boolean;
	/** WooCommerce: la dirección de la tienda (https://mitienda.com). */
	site?: string;
	/** WooCommerce: la Clave de cliente (ck_…) de una llave de la API REST con permisos de Lectura/Escritura. */
	consumer_key?: string;
	/** WooCommerce: la Clave secreta de cliente (cs_…) de esa llave. Se guarda cifrada y nunca se muestra. */
	consumer_secret?: string;
	/** Mercado Libre, Tiendanube y Amazon: a dónde volver después de autorizar (se agregan store_connection y status). */
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
		/** c_FormaPago por pasarela de Shopify (shopify_payments, paypal, manual…) o tipo de pago de Mercado Libre y Mercado Pago (credit_card, debit_card, account_money, ticket, bank_transfer), o de Conekta y Openpay (credit_card, debit_card, cash, spei). */
		payment_forms?: Record<string, string>;
		/** Mercado Libre: timbrar en cuanto se paga si el comprador dejó sus datos fiscales completos. Por omisión true. */
		auto_invoice?: boolean;
		/** WooCommerce, Tiendanube, Mercado Pago, Conekta y Openpay: mandar al comprador el enlace para facturar (WooCommerce, como nota al cliente del pedido; los demás, por correo, cuando la plataforma da su correo). Por omisión true. */
		notify_buyer?: boolean;
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
		/** c_FormaPago por pasarela de Shopify (shopify_payments, paypal, manual…) o tipo de pago de Mercado Libre y Mercado Pago (credit_card, debit_card, account_money, ticket, bank_transfer), o de Conekta y Openpay (credit_card, debit_card, cash, spei). */
		payment_forms?: Record<string, string>;
		/** Mercado Libre: timbrar en cuanto se paga si el comprador dejó sus datos fiscales completos. Por omisión true. */
		auto_invoice?: boolean;
		/** WooCommerce, Tiendanube, Mercado Pago, Conekta y Openpay: mandar al comprador el enlace para facturar (WooCommerce, como nota al cliente del pedido; los demás, por correo, cuando la plataforma da su correo). Por omisión true. */
		notify_buyer?: boolean;
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
	/** La factura que se repite: el cuerpo de POST /v1/invoices, sin issuer, folio, date, global ni metadata. En description puede usar {mes}, {mes anterior}, {mes siguiente}, {año}, {año anterior}, {año siguiente} y {periodo}: cada factura los llena con su fecha. Como se escriben es como salen: {mes} «noviembre», {Mes} «Noviembre», {MES} «NOVIEMBRE». */
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
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
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
		/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
		hydrocarbon?: {
			/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
			permit_type: string;
			/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
			permit_number: string;
			/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
			subproduct: string;
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
	status?: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "withdrawn" | "expired" | "invoiced";
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
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
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
		/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
		hydrocarbon?: {
			/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
			permit_type: string;
			/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
			permit_number: string;
			/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
			subproduct: string;
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
	/** Recordarle por correo, a los mismos destinatarios, 3 días antes de su último día si no ha respondido (una vez). Solo al mandarla por correo; por omisión false. */
	remind?: boolean;
}

export interface WithdrawQuoteParams {
	/** Por qué (queda en customer_comment; el cliente no la ve). */
	note?: string;
}

export interface RejectQuoteParams {
	/** Por qué (queda en customer_comment; el cliente no la ve). */
	note?: string;
}

export interface CreateSalesOrderParams {
	/** Emisor (iss_…). Si la llave tiene un solo emisor o la cuenta tiene uno solo, puede omitirse. */
	issuer?: string;
	/** Hacerlo de una cotización (quo_…): toma su cliente y sus conceptos, y la cotización queda aceptada. Sin customer ni items. */
	quote?: string;
	/** Un cliente de su catálogo (cus_…) o uno con sus datos fiscales (como en POST /v1/invoices: se agrega a sus clientes). */
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
		ieps_taxpayer?: boolean;
	};
	/** Los conceptos, como en POST /v1/invoices (hasta 200). */
	items?: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product?: string;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description?: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key?: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
		/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
		hydrocarbon?: {
			/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
			permit_type: string;
			/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
			permit_number: string;
			/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
			subproduct: string;
		};
		/** Addenda del receptor (Walmart, Soriana…), con sus propios campos. */
		addenda?: Record<string, string>;
	}[];
	/** Confirmarlo en el mismo paso (por omisión false: queda en draft). Confirmado, aparta lo pedido en el almacén. */
	confirm?: boolean;
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
	/** El número de orden de compra de su cliente (va en la nota de cada factura). */
	customer_po?: string;
	/** A dónde mandarle el pedido y sus remisiones (hasta 5 correos, separados por comas). Por omisión, el del cliente. */
	email?: string;
	/** Entrega estimada (AAAA-MM-DD). */
	expected_on?: string;
	/** Días de crédito (0: de contado). */
	payment_days?: number;
	/** Qué se factura: delivered (por omisión), lo ya entregado; ordered, todo lo pedido desde el inicio (por ejemplo con pago por adelantado). */
	invoice_policy?: "delivered" | "ordered";
	/** Dónde se entrega. */
	ship_to?: string;
	/** Condiciones del pedido. */
	terms?: string;
	/** Nota interna (su cliente no la ve). */
	internal_note?: string;
}

/** Los parámetros de GET /v1/sales_orders. */
export interface ListSalesOrdersParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** El emisor (iss_…). Puede omitirse si la llave o la cuenta tienen uno solo. */
	issuer?: string;
	/** Solo los que estén en este estado. */
	status?: "draft" | "confirmed" | "partially_delivered" | "delivered" | "invoiced" | "paid" | "closed" | "canceled";
	/** Solo los de este RFC. */
	customer?: string;
}

export interface UpdateSalesOrderParams {
	/** Un cliente de su catálogo (cus_…) o uno con sus datos fiscales (como en POST /v1/invoices: se agrega a sus clientes). */
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
		/** true si el cliente es contribuyente de IEPS: el IEPS va desglosado en vez de sumado al precio, salvo el del alcohol y los tabacos (tasas 0.5, 1.6 y 0.304), que va en el precio siempre (LIEPS art. 19 fr. II). */
		ieps_taxpayer?: boolean;
	};
	/** Los conceptos, como en POST /v1/invoices (hasta 200). */
	items?: {
		/** Un producto de su catálogo (prd_…): toma su clave, unidad, precio e impuestos. */
		product?: string;
		/** Descripción del concepto (Descripcion), hasta 1,000 caracteres. */
		description?: string;
		/** Clave del producto o servicio (ClaveProdServ), 8 dígitos de c_ClaveProdServ. Búsquela con GET /v1/sat_catalogs/product_keys?q=… */
		product_key?: string;
		/** Clave de unidad (ClaveUnidad) de c_ClaveUnidad: E48 unidad de servicio, H87 pieza, ACT actividad… Por omisión H87 si la clave del producto es de un bien (segmentos 10 a 60) y E48 si es de un servicio. */
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
		/** Complemento de Hidrocarburos y Petrolíferos: obligatorio en cada concepto de diésel (15101505) o gasolina (15101514, 15101515) de una factura o nota de crédito, en litros (LTR). */
		hydrocarbon?: {
			/** Tipo de permiso de la CNE o la CRE (TipoPermiso, c_TipoPermiso): PER01 a PER11. */
			permit_type: string;
			/** Número de permiso de la CNE o la CRE (NumeroPermiso), como PL/12345/EXP/ES/2016: de 15 a 35 caracteres. */
			permit_number: string;
			/** Subproducto (SubProductoHYP, c_SubProductoHYP): SP16 gasolina regular, SP17 premium, SP18 diésel automotriz… */
			subproduct: string;
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
	/** El número de orden de compra de su cliente (va en la nota de cada factura). */
	customer_po?: string;
	/** A dónde mandarle el pedido y sus remisiones (hasta 5 correos, separados por comas). Por omisión, el del cliente. */
	email?: string;
	/** Entrega estimada (AAAA-MM-DD). */
	expected_on?: string;
	/** Días de crédito (0: de contado). */
	payment_days?: number;
	/** Qué se factura: delivered (por omisión), lo ya entregado; ordered, todo lo pedido desde el inicio (por ejemplo con pago por adelantado). */
	invoice_policy?: "delivered" | "ordered";
	/** Dónde se entrega. */
	ship_to?: string;
	/** Condiciones del pedido. */
	terms?: string;
	/** Nota interna (su cliente no la ve). */
	internal_note?: string;
}

export interface CreateSalesOrderDeliveryParams {
	/** Cuánto sale de cada concepto. Por omisión, todo lo que falta por entregar. */
	items?: {
		/** El id del concepto (items[].id). */
		line: number;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
	}[];
	/** Por omisión, hoy. */
	delivered_on?: string;
	/** Transporte. */
	carrier?: string;
	/** Número de guía. */
	tracking?: string;
	/** Una nota en la remisión. */
	note?: string;
	/** Quién recibió, si ya lo sabe (si no, su cliente lo firma en url). */
	received_by?: string;
}

export interface CancelSalesOrderDeliveryParams {
	/** Por qué (queda en el historial). */
	reason?: string;
}

export interface InvoiceSalesOrderParams {
	/** Cuánto facturar de cada concepto. Por omisión, lo entregado sin facturar (o todo lo pedido con invoice_policy ordered). */
	items?: {
		/** El id del concepto (items[].id). */
		line: number;
		/** Cantidad (Cantidad). Por omisión 1. */
		quantity: number;
	}[];
	/** Facturar también lo que aún no se entrega (con invoice_policy delivered). */
	include_undelivered?: boolean;
	/** Registrar también la entrega de lo que lleva la factura al timbrarla (venta de mostrador). */
	deliver?: boolean;
}

export interface SendSalesOrderParams {
	/** Mandarlo por correo, con su PDF y url (por omisión true). Con false solo contesta url, para que usted la mande. */
	send_email?: boolean;
	/** A quién (hasta 5 correos). Por omisión, el correo del pedido. */
	to?: string;
	/** Qué pasó y cómo corregirlo, para una persona. */
	message?: string;
}

export interface CloseSalesOrderParams {
	/** Por qué (queda en el historial). */
	reason?: string;
}

export interface CancelSalesOrderParams {
	/** Por qué (queda en el historial). */
	reason?: string;
}

export interface CreateWebhookEndpointParams {
	/** Dirección https de su servidor que recibe los avisos. */
	url: string;
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). La lista con cuándo llega cada uno: [Tipos de evento](https://fiscalisto.com/docs/api/webhooks#tipos-de-evento). */
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
	/** Eventos que quiere recibir, o ["*"] para todos (por omisión). La lista con cuándo llega cada uno: [Tipos de evento](https://fiscalisto.com/docs/api/webhooks#tipos-de-evento). */
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
	type?: "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.cancellation_failed" | "invoice.paid" | "invoice.partially_paid" | "invoice.email_bounced" | "invoice.email_complained" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "payroll_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "sat_declaration.created" | "sat_declaration.updated" | "sat_refresh.completed" | "sat_refresh.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "quote.withdrawn" | "sales_order.confirmed" | "sales_order.customer_confirmed" | "sales_order.delivered" | "sales_order.paid" | "sales_order.canceled" | "supplier_invoice.received" | "supplier_invoice.approved" | "supplier_invoice.rejected" | "supplier_invoice.scheduled" | "supplier_invoice.paid" | "portal_supplier.approved" | "issuer.ready" | "balance.low" | "usage.high" | "test_clock.ready";
}

/** Los parámetros de GET /v1/webhook_endpoints/{id}/deliveries. */
export interface ListWebhookDeliveriesParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** false: solo los que fallaron en su último intento. true: solo los que llegaron. */
	succeeded?: boolean;
}

/** Los parámetros de GET /v1/events. */
export interface ListEventsParams {
	/** Cuántos por página, de 1 a 100. Por omisión 10. */
	limit?: number;
	/** El id del último de la página anterior, para la siguiente. */
	starting_after?: string;
	/** Solo de este tipo (invoice.stamped), o todos los de un recurso con un comodín (invoice.*). */
	type?: "invoice.stamped" | "invoice.failed" | "invoice.canceled" | "invoice.cancellation_pending" | "invoice.cancellation_rejected" | "invoice.cancellation_failed" | "invoice.paid" | "invoice.partially_paid" | "invoice.email_bounced" | "invoice.email_complained" | "retention.stamped" | "retention.failed" | "retention.canceled" | "invoice_batch.completed" | "payroll_batch.completed" | "customer_data_request.completed" | "sat_download.completed" | "sat_download.failed" | "sat_declaration.created" | "sat_declaration.updated" | "sat_refresh.completed" | "sat_refresh.failed" | "ticket.invoiced" | "ticket.included_in_global" | "recurring_invoice.failed" | "quote.viewed" | "quote.accepted" | "quote.changes_requested" | "quote.rejected" | "quote.withdrawn" | "sales_order.confirmed" | "sales_order.customer_confirmed" | "sales_order.delivered" | "sales_order.paid" | "sales_order.canceled" | "supplier_invoice.received" | "supplier_invoice.approved" | "supplier_invoice.rejected" | "supplier_invoice.scheduled" | "supplier_invoice.paid" | "portal_supplier.approved" | "issuer.ready" | "balance.low" | "usage.high" | "test_clock.ready" | "invoice.*" | "invoice_batch.*" | "payroll_batch.*" | "recurring_invoice.*" | "quote.*" | "sales_order.*" | "supplier_invoice.*" | "portal_supplier.*" | "ticket.*" | "retention.*" | "customer_data_request.*" | "sat_download.*" | "sat_declaration.*" | "sat_refresh.*" | "issuer.*" | "balance.*" | "usage.*" | "test_clock.*";
	/** Solo los de este objeto (inv_…, ret_…, bat_…). */
	object?: string;
	/** false: los que algún webhook no recibió (su último intento falló). true: los que recibieron todos los webhooks a los que se mandaron. */
	delivery_success?: boolean;
}

export interface ResendEventParams {
	/** El webhook (whe_…) al que mandarlo otra vez. Sin mandar: a todos los webhooks encendidos que escuchan ese tipo de evento. */
	endpoint?: string;
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
	 * Deja el modo de pruebas como nuevo: cada emisor de pruebas conserva su RFC y su CSD de pruebas pero pierde sus facturas, clientes, productos, lotes, ligas y descargas, y se borran los eventos y el registro de solicitudes de pruebas. Las llaves y los webhooks se quedan. Con seed (por omisión) deja 2 clientes y 3 productos de ejemplo. Solo con una llave fk_test_; producción nunca se toca.
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
	 * Los entornos de prueba de la cuenta, cada uno con su emisor de prueba y su llave fk_test_. Hasta 25 por cuenta.
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
	 * Un entorno de prueba: su nombre, su emisor y lo que lleva usado hoy de sus reinicios.
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
	 * La hora que es «hoy» para un emisor de prueba y hasta dónde se ha adelantado. Solo emisores de prueba.
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
	 * Los emisores de la cuenta en el modo de la llave, los más recientes primero. Una llave limitada a algunos emisores solo ve los suyos.
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
	 * Un emisor: sus datos fiscales, si ya puede timbrar (status, CSD y contrato con el PAC) y su registro patronal.
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
	 * Ver el diseño del PDF
	 *
	 * Cómo se ven los documentos del emisor: su nombre comercial, el estilo y el color del PDF y su logo. Es lo mismo que Ajustes › Marca y documentos en la app.
	 *
	 * GET /v1/issuers/{id}/branding
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/get-issuer-branding
	 */
	getBranding(id: string, options?: RequestOptions): Promise<IssuerBranding> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/branding` }, options);
	}

	/**
	 * Cambiar el diseño del PDF
	 *
	 * Cambia el nombre comercial, el estilo (clasico, moderno, compacto o minimalista) y el color del PDF de las facturas, notas, pagos, recibos y cotizaciones del emisor, y de sus correos. Lo que no mande se queda como está; null vuelve al de omisión. Se ve en el siguiente PDF que pida, también de lo ya timbrado. Una sucursal puede tener el suyo (POST /v1/branches/{id}).
	 *
	 * POST /v1/issuers/{id}/branding
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/update-issuer-branding
	 */
	updateBranding(id: string, params?: UpdateIssuerBrandingParams, options?: RequestOptions): Promise<IssuerBranding> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/branding`, body: params, idempotent: true }, options);
	}

	/**
	 * Subir el logo
	 *
	 * El logo del emisor (PNG o JPG de hasta 1 MB, en base64): va en sus PDF, sus correos y la página de la factura que ve su cliente. Reemplaza el anterior.
	 *
	 * POST /v1/issuers/{id}/logo
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/upload-issuer-logo
	 */
	uploadLogo(id: string, params: UploadIssuerLogoParams, options?: RequestOptions): Promise<IssuerBranding> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/logo`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar el logo
	 *
	 * Sus PDF y correos van sin logo, con su nombre.
	 *
	 * DELETE /v1/issuers/{id}/logo
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/delete-issuer-logo
	 */
	deleteLogo(id: string, options?: RequestOptions): Promise<IssuerBranding> {
		return this.#client.request({ method: "DELETE", path: `/v1/issuers/${encodeURIComponent(id)}/logo` }, options);
	}

	/**
	 * Firmar el contrato con el PAC
	 *
	 * Una sola vez por RFC antes de timbrar en producción: firma el contrato de servicio del PAC con la e.firma del emisor. La e.firma se usa en memoria para esa firma y no se guarda, salvo que mande keep_for_downloads: true para pedirle al SAT las facturas del emisor (POST /v1/sat_downloads); entonces se guarda cifrada y puede borrarla con DELETE. En pruebas no firma nada ni se guarda: con keep_for_downloads se revisa igual y queda su vencimiento en sat_downloads.efirma_expires_at.
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
	 * Una página en fiscalisto.com donde el dueño del emisor sube su CSD y firma el contrato con el PAC con su e.firma, sin que esos archivos ni sus contraseñas pasen por su plataforma. Con keep_efirma: true la página también le pide autorización para guardar su e.firma cifrada, para consultar el SAT (descargas, declaraciones, opinión, constancia y buzón); con efirma_only: true pide solo la e.firma, sin el CSD. Mande a su cliente a url; al terminar vuelve a return_url y llega issuer.ready. Cada liga sirve para un emisor, hasta que vence.
	 *
	 * POST /v1/issuers/{id}/onboarding_links
	 * @see https://fiscalisto.com/docs/api/referencia/emisores/create-issuer-onboarding-link
	 */
	createOnboardingLink(id: string, params?: CreateIssuerOnboardingLinkParams, options?: RequestOptions): Promise<IssuerOnboardingLink> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/onboarding_links`, body: params, idempotent: true }, options);
	}

	/**
	 * Ver la opinión de cumplimiento (32-D)
	 *
	 * La última opinión que trajo del SAT: positiva, negativa (con sus motivos), sin obligaciones o en suspensión. result es null hasta la primera consulta. No usa timbres.
	 *
	 * GET /v1/issuers/{id}/compliance_opinion
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-compliance-opinion
	 */
	complianceOpinion(id: string, options?: RequestOptions): Promise<ComplianceOpinion> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/compliance_opinion` }, options);
	}

	/**
	 * Pedir la opinión de cumplimiento al SAT
	 *
	 * La pide al SAT con la e.firma guardada del emisor (POST /v1/issuers/{id}/efirma con keep_for_downloads: true); llega a GET /v1/issuers/{id}/compliance_opinion. 1 timbre en producción, una vez cada 10 minutos. Contesta 202 en cuanto la acepta (status processing) y consulta al SAT en segundo plano: sat_refresh.completed o sat_refresh.failed dicen cómo terminó, y GET /v1/sat_refreshes/{id} también. Su timbre se aparta al aceptarla (sin timbres contesta 402 de inmediato), se usa cuando el SAT contesta y regresa si no contesta. En pruebas da una positiva de ejemplo al instante (la consulta ya viene completed y también llega sat_refresh.completed).
	 *
	 * POST /v1/issuers/{id}/compliance_opinion/refresh
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/refresh-compliance-opinion
	 */
	refreshComplianceOpinion(id: string, options?: RequestOptions): Promise<SatRefresh> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/compliance_opinion/refresh`, idempotent: true }, options);
	}

	/**
	 * Descargar el PDF de la opinión de cumplimiento
	 *
	 * El PDF de la última opinión, como lo da el SAT. No usa timbres.
	 *
	 * GET /v1/issuers/{id}/compliance_opinion/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-compliance-opinion-pdf
	 */
	complianceOpinionPdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/compliance_opinion/pdf`, as: "bytes" }, options);
	}

	/**
	 * Ver la constancia de situación fiscal
	 *
	 * Lo que dice la última constancia generada: razón social, regímenes, código postal, estatus en el padrón e idCIF. No usa timbres.
	 *
	 * GET /v1/issuers/{id}/tax_status_certificate
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-tax-status-certificate
	 */
	taxStatusCertificate(id: string, options?: RequestOptions): Promise<TaxStatusCertificate> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/tax_status_certificate` }, options);
	}

	/**
	 * Generar la constancia de situación fiscal en el SAT
	 *
	 * Genera una constancia nueva con la e.firma guardada del emisor; llega a GET /v1/issuers/{id}/tax_status_certificate. 1 timbre en producción, una vez cada 10 minutos. Contesta 202 en cuanto la acepta (status processing) y consulta al SAT en segundo plano: sat_refresh.completed o sat_refresh.failed dicen cómo terminó, y GET /v1/sat_refreshes/{id} también. Su timbre se aparta al aceptarla (sin timbres contesta 402 de inmediato), se usa cuando el SAT contesta y regresa si no contesta. En pruebas hace una con los datos del emisor al instante.
	 *
	 * POST /v1/issuers/{id}/tax_status_certificate/refresh
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/refresh-tax-status-certificate
	 */
	refreshTaxStatusCertificate(id: string, options?: RequestOptions): Promise<SatRefresh> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/tax_status_certificate/refresh`, idempotent: true }, options);
	}

	/**
	 * Descargar el PDF de la constancia
	 *
	 * El PDF de la última constancia, como lo da el SAT. No usa timbres.
	 *
	 * GET /v1/issuers/{id}/tax_status_certificate/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-tax-status-certificate-pdf
	 */
	taxStatusCertificatePdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/issuers/${encodeURIComponent(id)}/tax_status_certificate/pdf`, as: "bytes" }, options);
	}

	/**
	 * Revisar el buzón tributario en el SAT
	 *
	 * Lee los avisos del buzón tributario del emisor con su e.firma guardada; nunca abre notificaciones (abrirlas firma el acuse y corren los plazos). Llegan a GET /v1/sat_mailbox_messages. 1 timbre en producción, una vez cada 10 minutos. Contesta 202 en cuanto la acepta (status processing) y consulta al SAT en segundo plano: sat_refresh.completed o sat_refresh.failed dicen cómo terminó, y GET /v1/sat_refreshes/{id} también. Su timbre se aparta al aceptarla (sin timbres contesta 402 de inmediato), se usa cuando el SAT contesta y regresa si no contesta. En pruebas deja dos avisos de ejemplo al instante.
	 *
	 * POST /v1/issuers/{id}/sat_mailbox/refresh
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/refresh-sat-mailbox
	 */
	refreshSatMailbox(id: string, options?: RequestOptions): Promise<SatRefresh> {
		return this.#client.request({ method: "POST", path: `/v1/issuers/${encodeURIComponent(id)}/sat_mailbox/refresh`, idempotent: true }, options);
	}

	/**
	 * Ver el portal de autofactura de un emisor
	 *
	 * El portal de autofactura del emisor: su dirección, hasta cuándo se puede facturar un ticket y cómo se arma la factura global.
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
	 * Revisa la factura con las reglas del SAT, la sella y la timbra en una sola llamada. Responde con la factura timbrada (status valid) o, si el PAC tarda o el SAT no responde, 202 en processing: Fiscalisto la reintenta sola y invoice.stamped avisa. Con async: true responde 202 de inmediato y timbra después. Lo que puede omitir tiene el valor usual: PUE, MXN, uso G03 (S01 con régimen 616), objeto de impuesto 02, IVA 16%, cantidad 1, unidad E48.
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
	 * Revisar una factura sin timbrar
	 *
	 * El mismo cuerpo y las mismas revisiones que POST /v1/invoices, sin timbrar ni usar timbres: devuelve la factura como se timbraría ahora (con los datos fiscales del emisor, el siguiente folio, el subtotal, los impuestos y el total que calcula Fiscalisto), los avisos (un cliente en las listas del SAT, un duplicado) y el XML sin sellar (unsigned_xml). Úsela para mostrar el total antes de cobrar o para validar en su sistema; si algo falla, invoice_invalid como al timbrar. No pide Idempotency-Key y sirve con una llave de solo lectura.
	 *
	 * POST /v1/invoices/preview
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/preview-invoice
	 */
	preview(params: InvoiceCreate, options?: RequestOptions): Promise<InvoicePreview> {
		return this.#client.request({ method: "POST", path: "/v1/invoices/preview", body: params, idempotent: true }, options);
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
	 * Actualizar una factura
	 *
	 * Lo que se puede cambiar de una factura timbrada sin tocar el CFDI: su centro de costo (cost_center, o null para quitárselo; los complementos de pago y los traslados no llevan) y la nota para el cliente del PDF (notes, o null para quitarla; el XML no cambia y el siguiente PDF y correo ya la llevan).
	 *
	 * POST /v1/invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/update-invoice
	 */
	update(id: string, params?: UpdateInvoiceParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Descargar el PDF
	 *
	 * La representación impresa del CFDI, como la recibe su cliente. En vez del id puede usar el UUID (con issuer si la cuenta tiene varios emisores).
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
	 * Descargar el acuse de cancelación
	 *
	 * El acuse de cancelación del SAT (XML firmado por el SAT) de una factura cancelada: la prueba de que el SAT la canceló y cuándo. Antes de que el SAT la cancele (status valid o pending), 409 invoice_not_canceled.
	 *
	 * GET /v1/invoices/{id}/cancellation_receipt
	 * @see https://fiscalisto.com/docs/api/referencia/facturas/get-invoice-cancellation-receipt
	 */
	cancellationReceipt(id: string, params?: GetInvoiceCancellationReceiptParams, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/invoices/${encodeURIComponent(id)}/cancellation_receipt`, query: params, as: "text" }, options);
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
	 * Pide la cancelación al SAT. Si el cliente debe aceptarla queda en pending (escuche invoice.canceled o invoice.cancellation_rejected). No usa timbres. El SAT registra cada comprobante unos minutos después de timbrarlo: si lo cancela antes, contesta 409 cancellation_too_early con Retry-After; repita la misma solicitud.
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
	 * Una factura PUE timbrada con paid_later (o marcada por cobrar) ya se pagó: queda paid, con paid_on el día que indique (hoy si no), y llega invoice.paid. Una PPD se paga con su complemento de pago (POST /v1/payments).
	 *
	 * POST /v1/invoices/{id}/mark_paid
	 * @see https://fiscalisto.com/docs/api/referencia/cuentas-por-cobrar/mark-invoice-paid
	 */
	markPaid(id: string, params?: MarkInvoicePaidParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/invoices/${encodeURIComponent(id)}/mark_paid`, body: params, idempotent: true }, options);
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

/** Cuentas por cobrar: fiscalisto.customers. */
export class CustomersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver cómo paga un cliente
	 *
	 * Cuántos días tarda en pagar, qué parte llega a tiempo con sus días de crédito, si paga más lento que antes, cómo le paga y cuándo le llegaría lo que debe. De sus facturas a crédito (PPD) de los últimos 12 meses y sus complementos de pago, como «Cómo paga» en la app. No aplica a XAXX010101000 ni XEXX010101000.
	 *
	 * GET /v1/customers/{id}/payment_behavior
	 * @see https://fiscalisto.com/docs/api/referencia/cuentas-por-cobrar/get-customer-payment-behavior
	 */
	paymentBehavior(id: string, options?: RequestOptions): Promise<CustomerPaymentBehavior> {
		return this.#client.request({ method: "GET", path: `/v1/customers/${encodeURIComponent(id)}/payment_behavior` }, options);
	}

	/**
	 * Crear un cliente
	 *
	 * Un cliente del catálogo del emisor, con sus datos fiscales como vienen en su constancia. Un RFC que ya está en el catálogo contesta customer_exists.
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
	 * Los clientes del emisor, los más recientes primero. Con tax_id, el de ese RFC.
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
	 * Un cliente del catálogo.
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
	 * Cambia solo los campos que manda. Las facturas ya timbradas no cambian.
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
	 * Lo quita del catálogo. Sus facturas timbradas siguen igual.
	 *
	 * DELETE /v1/customers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/clientes/delete-customer
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/customers/${encodeURIComponent(id)}` }, options);
	}
}

/** Flujo de efectivo: fiscalisto.cashForecast. */
export class CashForecastResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver el flujo de efectivo
	 *
	 * Las próximas 13 semanas del emisor, como «Flujo de efectivo» en la app: lo que le deben, con lo que cada cliente suele tardar en pagar; lo que debe a proveedores; la nómina; las declaraciones mensuales; las facturas recurrentes y sus movimientos previstos, desde el saldo que dio. Trae avisos con lo que puede hacer, y con los parámetros, un escenario (no se guarda). Una estimación: nada cambia solo.
	 *
	 * GET /v1/cash_forecast
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/get-cash-forecast
	 */
	get(params?: GetCashForecastParams, options?: RequestOptions): Promise<CashForecast> {
		return this.#client.request({ method: "GET", path: "/v1/cash_forecast", query: params }, options);
	}

	/**
	 * Dar el saldo de hoy
	 *
	 * El saldo de hoy en sus cuentas de banco (de donde parte el flujo) y lo menos que quiere tener. Solo lo que mande cambia. Responde el flujo con el saldo nuevo.
	 *
	 * POST /v1/cash_forecast
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/update-cash-forecast
	 */
	update(params?: UpdateCashForecastParams, options?: RequestOptions): Promise<CashForecast> {
		return this.#client.request({ method: "POST", path: "/v1/cash_forecast", body: params, idempotent: true }, options);
	}

	/**
	 * Agregar un movimiento previsto
	 *
	 * Algo que espera pagar o cobrar y que ninguna factura dice: una renta, un crédito, una venta de contado. Una vez o cada semana, dos semanas o mes. Hasta 200.
	 *
	 * POST /v1/cash_forecast/planned_items
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/create-cash-forecast-item
	 */
	createItem(params: CreateCashForecastItemParams, options?: RequestOptions): Promise<CashForecastItem> {
		return this.#client.request({ method: "POST", path: "/v1/cash_forecast/planned_items", body: params, idempotent: true }, options);
	}

	/**
	 * Cambiar un movimiento previsto
	 *
	 * Solo lo que mande cambia.
	 *
	 * POST /v1/cash_forecast/planned_items/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/update-cash-forecast-item
	 */
	updateItem(id: string, params?: UpdateCashForecastItemParams, options?: RequestOptions): Promise<CashForecastItem> {
		return this.#client.request({ method: "POST", path: `/v1/cash_forecast/planned_items/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un movimiento previsto
	 *
	 * Ya no cuenta en el flujo.
	 *
	 * DELETE /v1/cash_forecast/planned_items/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/delete-cash-forecast-item
	 */
	deleteItem(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/cash_forecast/planned_items/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar un renglón del flujo
	 *
	 * Otro día o monto para un renglón (lines[].line), o no contarlo: un cliente le avisó que paga después, o una factura ya se pagó por fuera. Solo cambia el pronóstico, nunca la factura. reset: true lo regresa a lo estimado. Responde el flujo con el cambio.
	 *
	 * POST /v1/cash_forecast/adjustments
	 * @see https://fiscalisto.com/docs/api/referencia/flujo-de-efectivo/adjust-cash-forecast
	 */
	adjust(params: AdjustCashForecastParams, options?: RequestOptions): Promise<CashForecast> {
		return this.#client.request({ method: "POST", path: "/v1/cash_forecast/adjustments", body: params, idempotent: true }, options);
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
	 * Un depósito mandado a conciliación, con las facturas que se le encontraron o el pago que se registró con él.
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

/** Tickets de compra: fiscalisto.purchaseReceipts. */
export class PurchaseReceiptsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Guardar un ticket de compra
	 *
	 * La foto o el PDF de un ticket que el emisor pagó sin factura, en base64, con los datos que usted tenga: la tienda, su RFC, la fecha, el total, la forma de pago, el folio, los datos que pide su portal y la liga de facturación. Si qr_text es la liga de una tienda que factura con Fiscalisto, el folio y el total se llenan solos. El mismo archivo dos veces devuelve el ticket que ya estaba. Si llega una factura de esa tienda por el mismo total con las descargas del SAT, el ticket queda invoiced solo.
	 *
	 * POST /v1/purchase_receipts
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/create-purchase-receipt
	 */
	create(params: CreatePurchaseReceiptParams, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: "/v1/purchase_receipts", body: params, idempotent: true }, options);
	}

	/**
	 * Listar tickets de compra
	 *
	 * Los más recientes primero.
	 *
	 * GET /v1/purchase_receipts
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/list-purchase-receipts
	 */
	list(params?: ListPurchaseReceiptsParams, options?: RequestOptions): List<PurchaseReceipt> {
		return this.#client.list({ path: "/v1/purchase_receipts", query: params }, options);
	}

	/**
	 * Ver un ticket de compra
	 *
	 * Con la factura recibida que lo cubre, si ya llegó.
	 *
	 * GET /v1/purchase_receipts/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/get-purchase-receipt
	 */
	get(id: string, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "GET", path: `/v1/purchase_receipts/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Corregir un ticket de compra
	 *
	 * Corrige o llena sus datos; solo cambia lo que mande (null borra un dato). Con store_tax_id y total corregidos se vuelve a buscar su factura.
	 *
	 * POST /v1/purchase_receipts/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/update-purchase-receipt
	 */
	update(id: string, params?: UpdatePurchaseReceiptParams, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: `/v1/purchase_receipts/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un ticket de compra
	 *
	 * El ticket y su archivo, para siempre.
	 *
	 * DELETE /v1/purchase_receipts/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/delete-purchase-receipt
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/purchase_receipts/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Pedir la factura a la tienda
	 *
	 * fiscalisto: la tienda factura con Fiscalisto (store.on_fiscalisto), se timbra al momento con los datos fiscales del emisor y el ticket queda invoiced. email: le manda a la tienda los datos fiscales y la foto; las respuestas van a reply_to. portal o manual: usted la pidió, solo queda requested. Pide el uso de use (G03 por omisión).
	 *
	 * POST /v1/purchase_receipts/{id}/request
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/request-purchase-receipt-invoice
	 */
	requestInvoice(id: string, params: RequestPurchaseReceiptInvoiceParams, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: `/v1/purchase_receipts/${encodeURIComponent(id)}/request`, body: params, idempotent: true }, options);
	}

	/**
	 * Ya llegó la factura
	 *
	 * Para una factura que llegó por otro lado. Con invoice (sat_… o UUID), la factura recibida que lo cubre; una factura cubre un solo ticket.
	 *
	 * POST /v1/purchase_receipts/{id}/mark_invoiced
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/mark-purchase-receipt-invoiced
	 */
	markInvoiced(id: string, params?: MarkPurchaseReceiptInvoicedParams, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: `/v1/purchase_receipts/${encodeURIComponent(id)}/mark_invoiced`, body: params, idempotent: true }, options);
	}

	/**
	 * Marcar como no deducible
	 *
	 * La tienda no dio factura: el gasto queda como no deducible.
	 *
	 * POST /v1/purchase_receipts/{id}/mark_non_deductible
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/mark-purchase-receipt-non-deductible
	 */
	markNonDeductible(id: string, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: `/v1/purchase_receipts/${encodeURIComponent(id)}/mark_non_deductible`, idempotent: true }, options);
	}

	/**
	 * Volver a pedir la factura
	 *
	 * Deshace mark_non_deductible o mark_invoiced: vuelve a requested si ya se había pedido, si no a pending.
	 *
	 * POST /v1/purchase_receipts/{id}/reopen
	 * @see https://fiscalisto.com/docs/api/referencia/tickets-de-compra/reopen-purchase-receipt
	 */
	reopen(id: string, options?: RequestOptions): Promise<PurchaseReceipt> {
		return this.#client.request({ method: "POST", path: `/v1/purchase_receipts/${encodeURIComponent(id)}/reopen`, idempotent: true }, options);
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
	 * Los anticipos timbrados que todavía no se aplican a una factura, con lo que queda de cada uno. Filtre por customer para los de un cliente.
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
	 * Timbra una constancia de retenciones e información de pagos (Retenciones 2.0) con los folios RET1, RET2… del emisor. Una vez por Idempotency-Key; con send_email y email la manda al receptor al timbrarla.
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
	 * Las constancias del emisor, las más recientes primero.
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
	 * Una constancia de retenciones con su estado, sus impuestos retenidos y, si se mandó, a quién.
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
	 * La representación impresa de la constancia.
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
	 * El XML timbrado de la constancia, tal como lo tiene el SAT.
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
	 * Manda el PDF y el XML de la constancia a los correos de to (o al que se dio al timbrarla). Dos envíos a la vez de la misma constancia: el segundo contesta email_failed.
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
	 * Se cancela en el momento (no espera aceptación). No usa timbres.
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
	 * Un empleado del emisor para sus recibos de nómina: RFC, CURP, NSS, salario diario, salario diario integrado y periodicidad. Lo que no mande tiene el valor usual (contrato indefinido, jornada diurna, quincenal, riesgo clase I). warnings dice lo que el SAT podría rechazar.
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
	 * Los empleados del emisor, los más recientes primero.
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
	 * Un empleado con sus datos y lo que el SAT podría rechazar en warnings.
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
	 * Cambia solo los campos que manda; los recibos ya timbrados no cambian.
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

	/**
	 * Vacaciones de un empleado
	 *
	 * Los días de vacaciones de cada año de servicio (artículo 76 de la LFT: 12 el primero, dos más cada año hasta 20 y luego dos más cada cinco), los que tomó (los días de vacaciones de sus recibos timbrados, restados del año más antiguo que le quede), hasta cuándo dárselos (seis meses después del aniversario, artículo 81) y cuándo prescriben (un año después, artículo 516). pending_days son los de años cumplidos que no han prescrito: los que paga el finiquito.
	 *
	 * GET /v1/employees/{id}/vacations
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-employee-vacations
	 */
	vacations(id: string, params?: GetEmployeeVacationsParams, options?: RequestOptions): Promise<EmployeeVacations> {
		return this.#client.request({ method: "GET", path: `/v1/employees/${encodeURIComponent(id)}/vacations`, query: params }, options);
	}

	/**
	 * Saldo de vacaciones antes de Fiscalisto
	 *
	 * Guarda lo que el empleado tenía en un día según sus registros: los días que le quedaban de años cumplidos y los que ya había tomado del año en curso. Los recibos timbrados antes de ese día no se cuentan. opening_date null lo quita.
	 *
	 * POST /v1/employees/{id}/vacations
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-employee-vacations
	 */
	updateVacations(id: string, params: UpdateEmployeeVacationsParams, options?: RequestOptions): Promise<EmployeeVacations> {
		return this.#client.request({ method: "POST", path: `/v1/employees/${encodeURIComponent(id)}/vacations`, body: params, idempotent: true }, options);
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
	 * Nómina ordinaria (Nómina 1.2): Fiscalisto calcula sueldo, ISR con subsidio al empleo e IMSS del empleado y el periodo, con sus incidencias (incidents: horas extra, domingos, vacaciones y premios), como la app: el aguinaldo, la PTU y los finiquitos los calcula POST /v1/payroll_receipts/extraordinary; comisiones, Infonavit o préstamos los calcula su sistema y se timbran con POST /v1/payroll_receipts/external (pedirlos aquí contesta payroll_calculation_unsupported). Revise antes el recibo con POST /v1/payroll_receipts/preview y mande su confirmation_token: así solo se timbra el recibo que revisó (si cambió, 409 payroll_calculation_changed). Queda como factura tipo N (GET /v1/invoices/{id}). El emisor necesita employer_registration.
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
	 * El recibo como se timbraría (percepciones con sus incidencias, ISR con el subsidio para el empleo, cuotas IMSS y el neto), sin timbrar ni usar timbres, con el confirmation_token que lo timbra tal cual y los avisos de lo que no incluye (un finiquito, valores del año que aún no se cargan).
	 *
	 * POST /v1/payroll_receipts/preview
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/preview-payroll-receipt
	 */
	preview(params: PreviewPayrollReceiptParams, options?: RequestOptions): Promise<PayrollReceiptPreview> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/preview", body: params, idempotent: true }, options);
	}

	/**
	 * Timbrar un aguinaldo, PTU o finiquito
	 *
	 * Nómina extraordinaria (TipoNomina E) que calcula Fiscalisto, como la app en Nómina › Aguinaldo, PTU y finiquitos: el aguinaldo (los días al año del empleado, al menos 15, en proporción a los trabajados, 30 UMA exentas), la PTU (la parte que le toca, 15 UMA exentas) o el finiquito al último día trabajado (end_date): aguinaldo, vacaciones y prima vacacional proporcionales, menos lo que ya se le pagó en el año, y con exit_reason dismissal la indemnización de 3 meses, opcionalmente 20 días por año, y la prima de antigüedad (90 UMA exentas por año de servicio). El ISR de un aguinaldo o PTU, con el cálculo que retenga menos (art. 96 LISR o 174 del Reglamento) salvo que pida uno. Uno por empleado, tipo y año (el finiquito, por fecha de baja): pedirlo otra vez devuelve el mismo; cancelado, se emite de nuevo. Revíselo antes con POST /v1/payroll_receipts/extraordinary/preview y mande su confirmation_token. Queda como factura tipo N.
	 *
	 * POST /v1/payroll_receipts/extraordinary
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-extraordinary-payroll-receipt
	 */
	createExtraordinary(params: CreateExtraordinaryPayrollReceiptParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/extraordinary", body: params, idempotent: true }, options);
	}

	/**
	 * Calcular un aguinaldo, PTU o finiquito sin timbrar
	 *
	 * El recibo extraordinario como se timbraría (lo que paga, su parte exenta, el ISR con los dos cálculos y el neto), sin timbrar ni usar timbres, con el confirmation_token que lo timbra tal cual.
	 *
	 * POST /v1/payroll_receipts/extraordinary/preview
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/preview-extraordinary-payroll-receipt
	 */
	previewExtraordinary(params: PreviewExtraordinaryPayrollReceiptParams, options?: RequestOptions): Promise<ExtraordinaryPayrollReceiptPreview> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/extraordinary/preview", body: params, idempotent: true }, options);
	}

	/**
	 * Timbrar un recibo calculado por su sistema
	 *
	 * Para un sistema de nómina que ya calculó el recibo: timbra exactamente sus percepciones (gravado y exento), deducciones, otros pagos, horas extra, incapacidades, separación o jubilación, ordinario (type O) o extraordinario (type E: aguinaldo, PTU, finiquito). Fiscalisto no recalcula ni redondea nada: revisa el XSD, los catálogos del SAT, la Matriz de errores y que sus totales cuadren, y si algo falla responde payroll_invalid con todos los problemas en errors[] (cada uno con su param). Un recibo ordinario por empleado (RFC) y periodo; uno extraordinario por empleado y payroll_run_id. Repetirlo con los mismos importes devuelve el mismo recibo; con otros importes, 409 payroll_receipt_exists (corríjalo con replaces). Queda como factura tipo N.
	 *
	 * POST /v1/payroll_receipts/external
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-external-payroll-receipt
	 */
	createExternal(params: ExternalPayrollReceiptCreate, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/external", body: params, idempotent: true }, options);
	}

	/**
	 * Revisar un recibo calculado por su sistema, sin timbrar
	 *
	 * Las mismas revisiones que al timbrar, sin timbrar ni usar timbres: devuelve el recibo como se timbraría, los avisos y el XML sin sellar (unsigned_xml), con sus importes tal cual. Si algo falla, payroll_invalid con errors[].
	 *
	 * POST /v1/payroll_receipts/external/preview
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/preview-external-payroll-receipt
	 */
	previewExternal(params: ExternalPayrollReceiptCreate, options?: RequestOptions): Promise<ExternalPayrollReceiptPreview> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_receipts/external/preview", body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.payrollBatches. */
export class PayrollBatchesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Timbrar una nómina completa (lote)
	 *
	 * Toda una corrida de nómina en una solicitud: hasta 1,000 recibos de un emisor, timbrados en segundo plano uno tras otro, sin el límite de timbres por segundo de una sola solicitud. De una de dos formas, nunca mezcladas: receipts (ids de empleado; Fiscalisto calcula cada recibo con el periodo del lote) o external_receipts (los recibos que calculó su sistema, como en POST /v1/payroll_receipts/external, con reference en lugar de metadata). Todo lo que se puede revisar antes se revisa antes: si algo falla, no se timbra ninguno y el error dice qué recibo (param receipts.3.employee). Lo que solo se sabe al timbrar (un periodo ya pagado, el SAT que rechaza un RFC) queda en ese recibo, con su error. Un recibo por empleado y periodo: mandar la corrida otra vez, aun con otra Idempotency-Key, devuelve los recibos que ya tiene. Responde 202; escuche payroll_batch.completed o consulte el lote.
	 *
	 * POST /v1/payroll_batches
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-payroll-batch
	 */
	create(params?: CreatePayrollBatchParams, options?: RequestOptions): Promise<PayrollBatch> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_batches", body: params, idempotent: true }, options);
	}

	/**
	 * Listar lotes de nómina
	 *
	 * Los lotes de nómina, los más recientes primero, con cuántos recibos se timbraron y cuántos no.
	 *
	 * GET /v1/payroll_batches
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/list-payroll-batches
	 */
	list(params?: ListPayrollBatchesParams, options?: RequestOptions): List<PayrollBatch> {
		return this.#client.list({ path: "/v1/payroll_batches", query: params }, options);
	}

	/**
	 * Ver un lote de nómina
	 *
	 * Con el recibo de cada empleado: timbrado (su factura y UUID) o por qué no (error.code y error.message).
	 *
	 * GET /v1/payroll_batches/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-payroll-batch
	 */
	get(id: string, options?: RequestOptions): Promise<PayrollBatch> {
		return this.#client.request({ method: "GET", path: `/v1/payroll_batches/${encodeURIComponent(id)}` }, options);
	}
}

/** Nómina: fiscalisto.payrollBankFiles. */
export class PayrollBankFilesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Archivo para pagar la nómina en el banco
	 *
	 * El archivo de dispersión que paga el neto de cada empleado desde el portal de su banco: BBVA (Net Cash), Banamex (BancaNet, layout D), Banorte (Banorte en su Empresa), Santander (Enlace) o un CSV de SPEI para cualquier banco. Toma los recibos de nómina timbrados (y no cancelados) con esa fecha de pago, los suma por empleado y le paga a la CLABE de su ficha (clabe en el empleado): a la misma institución por cuenta, a otra por SPEI. No cobra ni mueve dinero: usted lo sube al banco y lo autoriza ahí. Quien no se puede pagar (sin CLABE, otro banco en Santander) va en excluded con su razón. Suba el primero como prueba: cada portal lo valida antes de cargar nada.
	 *
	 * POST /v1/payroll_bank_files
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-payroll-bank-file
	 */
	create(params: CreatePayrollBankFileParams, options?: RequestOptions): Promise<PayrollBankFile> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_bank_files", body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.imssMovements. */
export class ImssMovementsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Agregar un movimiento del IMSS
	 *
	 * Un movimiento afiliatorio a mano. Casi nunca hace falta: al crear un empleado se registra su alta, al cambiar su integrated_daily_salary la modificación (con fecha de hoy), al ponerle end_date su baja y al volver a contratarlo su reingreso. Queda pendiente de presentar.
	 *
	 * POST /v1/imss_movements
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-imss-movement
	 */
	create(params: CreateImssMovementParams, options?: RequestOptions): Promise<ImssMovement> {
		return this.#client.request({ method: "POST", path: "/v1/imss_movements", body: params, idempotent: true }, options);
	}

	/**
	 * Listar movimientos del IMSS
	 *
	 * Los movimientos del emisor por presentar (status=pending, por omisión: todos, del más antiguo al más reciente, como van en los archivos) o ya presentados (status=reported: los 500 más recientes).
	 *
	 * GET /v1/imss_movements
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/list-imss-movements
	 */
	list(params?: ListImssMovementsParams, options?: RequestOptions): List<ImssMovement> {
		return this.#client.list({ path: "/v1/imss_movements", query: params }, options);
	}

	/**
	 * Marcar movimientos como presentados
	 *
	 * Cuando el IMSS ya los recibió (el acuse de IDSE o la importación en SUA): pasan a reported y ya no cambian ni se borran. Con reported false vuelven a pendientes. Devuelve los movimientos como quedaron.
	 *
	 * POST /v1/imss_movements/report
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/report-imss-movements
	 */
	report(params: ReportImssMovementsParams, options?: RequestOptions): Promise<ImssMovementList> {
		return this.#client.request({ method: "POST", path: "/v1/imss_movements/report", body: params, idempotent: true }, options);
	}

	/**
	 * Ver un movimiento del IMSS
	 *
	 * El movimiento con lo que el IMSS rechazaría en problems.
	 *
	 * GET /v1/imss_movements/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-imss-movement
	 */
	get(id: string, options?: RequestOptions): Promise<ImssMovement> {
		return this.#client.request({ method: "GET", path: `/v1/imss_movements/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar un movimiento del IMSS
	 *
	 * Solo uno pendiente: uno ya presentado se queda como lo tiene el IMSS.
	 *
	 * POST /v1/imss_movements/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-imss-movement
	 */
	update(id: string, params?: UpdateImssMovementParams, options?: RequestOptions): Promise<ImssMovement> {
		return this.#client.request({ method: "POST", path: `/v1/imss_movements/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un movimiento del IMSS
	 *
	 * Solo uno pendiente (por ejemplo, un alta registrada por error).
	 *
	 * DELETE /v1/imss_movements/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/delete-imss-movement
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/imss_movements/${encodeURIComponent(id)}` }, options);
	}
}

/** Nómina: fiscalisto.imssFiles. */
export class ImssFilesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Archivos para IDSE o SUA
	 *
	 * Los archivos de los movimientos pendientes: para IDSE (formato de 168 posiciones, un archivo por tipo: reingresos, modificaciones de salario y bajas; necesita la guía de su subdelegación) o para importar en SUA (ASEG.TXT con las altas y MOVT.TXT con los demás). El salario se declara topado a 25 UMA y nunca abajo del mínimo. El emisor necesita employer_registration. Los que el IMSS rechazaría van en refused con su razón. No los marca como presentados: hágalo con POST /v1/imss_movements/report cuando el IMSS los reciba.
	 *
	 * POST /v1/imss_files
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-imss-files
	 */
	create(params: CreateImssFilesParams, options?: RequestOptions): Promise<ImssFiles> {
		return this.#client.request({ method: "POST", path: "/v1/imss_files", body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.employeeDeductions. */
export class EmployeeDeductionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Agregar un descuento a un empleado
	 *
	 * Infonavit, Fonacot, pensión alimenticia, préstamo o anticipo del patrón, caja de ahorro o cuota sindical. Cada recibo ordinario desde start_date lo toma solo (POST /v1/payroll_receipts), con los límites de la Ley Federal del Trabajo: Infonavit por cada día del periodo aunque haya faltas, más $15 de seguro de daños por bimestre; Fonacot hasta el 20% del sueldo; préstamos, anticipos y caja hasta el 30% de lo que el sueldo excede del salario mínimo; del salario mínimo solo la pensión, Infonavit (20%) y Fonacot (10%). La pensión va primero, y lo que no alcanza del neto no se descuenta.
	 *
	 * POST /v1/employee_deductions
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/create-employee-deduction
	 */
	create(params: CreateEmployeeDeductionParams, options?: RequestOptions): Promise<EmployeeDeduction> {
		return this.#client.request({ method: "POST", path: "/v1/employee_deductions", body: params, idempotent: true }, options);
	}

	/**
	 * Listar descuentos
	 *
	 * Los descuentos vigentes del emisor, o de un empleado con employee.
	 *
	 * GET /v1/employee_deductions
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/list-employee-deductions
	 */
	list(params?: ListEmployeeDeductionsParams, options?: RequestOptions): Promise<EmployeeDeductionList> {
		return this.#client.request({ method: "GET", path: "/v1/employee_deductions", query: params }, options);
	}

	/**
	 * Ver un descuento
	 *
	 * El descuento con lo que ya tomaron los recibos (paid) y lo que falta de un préstamo (balance).
	 *
	 * GET /v1/employee_deductions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-employee-deduction
	 */
	get(id: string, options?: RequestOptions): Promise<EmployeeDeduction> {
		return this.#client.request({ method: "GET", path: `/v1/employee_deductions/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar un descuento
	 *
	 * Desde el siguiente recibo; los timbrados se quedan como están.
	 *
	 * POST /v1/employee_deductions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-employee-deduction
	 */
	update(id: string, params?: UpdateEmployeeDeductionParams, options?: RequestOptions): Promise<EmployeeDeduction> {
		return this.#client.request({ method: "POST", path: `/v1/employee_deductions/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar un descuento
	 *
	 * Los recibos siguientes ya no lo toman; los timbrados lo conservan.
	 *
	 * DELETE /v1/employee_deductions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/delete-employee-deduction
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/employee_deductions/${encodeURIComponent(id)}` }, options);
	}
}

/** Nómina: fiscalisto.variableSalaries. */
export class VariableSalariesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Salario variable de un bimestre
	 *
	 * Lo que las horas extra triples, la prima dominical, otros ingresos y lo que los premios de puntualidad y asistencia pasan del 10% del SBC suman al SDI de cada empleado, de los recibos timbrados del bimestre, entre sus días trabajados (artículos 27 y 30 de la LSS). Las horas dobles no cuentan. No cambia nada: aplíquelo con POST /v1/variable_salaries.
	 *
	 * GET /v1/variable_salaries
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-variable-salary
	 */
	get(params: GetVariableSalaryParams, options?: RequestOptions): Promise<VariableSalary> {
		return this.#client.request({ method: "GET", path: "/v1/variable_salaries", query: params }, options);
	}

	/**
	 * Aplicar el salario variable de un bimestre
	 *
	 * A los empleados que diga: su parte variable del SDI desde el primer día del bimestre siguiente (los recibos de periodos anteriores siguen con la que tenían) y la modificación de salario pendiente de presentar en IDSE (GET /v1/imss_movements), a más tardar el quinto día hábil del mes (artículo 34 de la LSS). Repetirlo no hace nada.
	 *
	 * POST /v1/variable_salaries
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/apply-variable-salary
	 */
	apply(params: ApplyVariableSalaryParams, options?: RequestOptions): Promise<VariableSalary> {
		return this.#client.request({ method: "POST", path: "/v1/variable_salaries", body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.annualAdjustments. */
export class AnnualAdjustmentsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ajuste anual del ISR
	 *
	 * El ISR del ejercicio de cada empleado (tarifa del artículo 152 sobre lo gravado de sus recibos timbrados del año, menos el subsidio para el empleo del año) contra lo que le retuvieron (artículo 97 de la Ley del ISR). balance positivo es a cargo del empleado; negativo, a su favor. excluded dice por qué no se le calcula. No cambia nada: aplíquelo con POST /v1/annual_adjustments.
	 *
	 * GET /v1/annual_adjustments
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-annual-adjustment
	 */
	get(params: GetAnnualAdjustmentParams, options?: RequestOptions): Promise<AnnualAdjustment> {
		return this.#client.request({ method: "GET", path: "/v1/annual_adjustments", query: params }, options);
	}

	/**
	 * Aplicar el ajuste anual
	 *
	 * action apply: la diferencia de cada empleado va en sus siguientes recibos ordinarios pagados desde el 1 de enero del año siguiente: a cargo como Deducción 101 (hasta su neto; el resto, en el siguiente), a favor como OtroPago 004 con CompensacionSaldosAFavor. Repetirlo no hace nada. undo la quita mientras ningún recibo timbrado la lleve. files_own_return y no_own_return marcan si el empleado presentará su propia declaración anual.
	 *
	 * POST /v1/annual_adjustments
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-annual-adjustment
	 */
	update(params: UpdateAnnualAdjustmentParams, options?: RequestOptions): Promise<AnnualAdjustment> {
		return this.#client.request({ method: "POST", path: "/v1/annual_adjustments", body: params, idempotent: true }, options);
	}
}

/** Nómina: fiscalisto.payrollTaxes. */
export class PayrollTaxesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Impuesto sobre nómina del mes
	 *
	 * El impuesto sobre nómina de cada estado: la suma de los recibos timbrados con fecha de pago en el mes, por el estado donde trabaja cada empleado (ClaveEntFed), menos las percepciones de excluded_perception_types, por la tasa del estado y sus sobretasas. Se declara y paga en el portal de finanzas de cada estado.
	 *
	 * GET /v1/payroll_taxes
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/get-payroll-tax
	 */
	get(params: GetPayrollTaxParams, options?: RequestOptions): Promise<PayrollTax> {
		return this.#client.request({ method: "GET", path: "/v1/payroll_taxes", query: params }, options);
	}

	/**
	 * Qué no grava el impuesto sobre nómina
	 *
	 * Las percepciones que no suman a la base (por omisión, las que casi todos los estados dejan fuera: PTU, reembolsos, indemnizaciones, primas de antigüedad, jubilaciones, cuotas de seguridad social pagadas por el patrón y viáticos) y la opción de tasa de cada estado que la tiene, guardadas para el emisor. Lo que no mande se queda como estaba.
	 *
	 * POST /v1/payroll_taxes/settings
	 * @see https://fiscalisto.com/docs/api/referencia/nomina/update-payroll-tax-settings
	 */
	updateSettings(params?: UpdatePayrollTaxSettingsParams, options?: RequestOptions): Promise<PayrollTaxSettings> {
		return this.#client.request({ method: "POST", path: "/v1/payroll_taxes/settings", body: params, idempotent: true }, options);
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
	 * Los lotes de facturas, los más recientes primero, con cuántas se timbraron y cuántas fallaron.
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

/** Sucursales: fiscalisto.branches. */
export class BranchesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear una sucursal
	 *
	 * Otro lugar desde donde factura el emisor, con su propio código postal: sus facturas llevan ese CP en LugarExpedicion (y su zona horaria en la Fecha, y el IVA 8 % si es de la franja fronteriza), su dirección en el PDF y, si las da, sus propias series. Varias sucursales pueden tener el mismo CP (dos locales en una plaza), incluso el del domicilio fiscal del emisor: cada factura recuerda de cuál salió. Hasta 200 por emisor.
	 *
	 * POST /v1/branches
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/create-branch
	 */
	create(params: CreateBranchParams, options?: RequestOptions): Promise<Branch> {
		return this.#client.request({ method: "POST", path: "/v1/branches", body: params, idempotent: true }, options);
	}

	/**
	 * Listar sucursales
	 *
	 * Las sucursales del emisor, las más recientes primero. Las archivadas solo con include_archived=true.
	 *
	 * GET /v1/branches
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/list-branches
	 */
	list(params?: ListBranchesParams, options?: RequestOptions): List<Branch> {
		return this.#client.list({ path: "/v1/branches", query: params }, options);
	}

	/**
	 * Ver una sucursal
	 *
	 * Una sucursal del emisor.
	 *
	 * GET /v1/branches/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/get-branch
	 */
	get(id: string, options?: RequestOptions): Promise<Branch> {
		return this.#client.request({ method: "GET", path: `/v1/branches/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar una sucursal
	 *
	 * Cambia solo los campos que manda; una serie en null vuelve a la del emisor. archived: true la archiva (ya no se factura desde ella y sus facturas la siguen nombrando), false la restaura. El código postal de una sucursal que ya facturó no cambia: si se mudó, archívela y cree otra.
	 *
	 * POST /v1/branches/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/update-branch
	 */
	update(id: string, params?: UpdateBranchParams, options?: RequestOptions): Promise<Branch> {
		return this.#client.request({ method: "POST", path: `/v1/branches/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar una sucursal
	 *
	 * Solo una que nunca facturó; con facturas contesta branch_has_invoices: archívela con archived: true.
	 *
	 * DELETE /v1/branches/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/delete-branch
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/branches/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Subir el logo de la sucursal
	 *
	 * El logo de la sucursal (PNG o JPG de hasta 1 MB, en base64): va en lo que factura desde ella y en el portal de autofactura de los tickets que la nombran. Reemplaza el anterior; sin logo propio usa el del emisor.
	 *
	 * POST /v1/branches/{id}/logo
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/upload-branch-logo
	 */
	uploadLogo(id: string, params: UploadBranchLogoParams, options?: RequestOptions): Promise<Branch> {
		return this.#client.request({ method: "POST", path: `/v1/branches/${encodeURIComponent(id)}/logo`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar el logo de la sucursal
	 *
	 * Lo que factura y sus tickets vuelven al logo del emisor. Sin logo contesta 404.
	 *
	 * DELETE /v1/branches/{id}/logo
	 * @see https://fiscalisto.com/docs/api/referencia/sucursales/delete-branch-logo
	 */
	deleteLogo(id: string, options?: RequestOptions): Promise<Branch> {
		return this.#client.request({ method: "DELETE", path: `/v1/branches/${encodeURIComponent(id)}/logo` }, options);
	}
}

/** Centros de costo: fiscalisto.costCenters. */
export class CostCentersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un centro de costo
	 *
	 * Una parte del negocio del emisor que quiere ver por separado: una obra, un proyecto, una sucursal, un área. Sus facturas lo toman con cost_center al crearlas, o después con POST /v1/invoices/{id} y POST /v1/sat_invoices/{id}. Un nombre que ya existe contesta cost_center_exists. Hasta 500 por emisor.
	 *
	 * POST /v1/cost_centers
	 * @see https://fiscalisto.com/docs/api/referencia/centros-de-costo/create-cost-center
	 */
	create(params: CreateCostCenterParams, options?: RequestOptions): Promise<CostCenter> {
		return this.#client.request({ method: "POST", path: "/v1/cost_centers", body: params, idempotent: true }, options);
	}

	/**
	 * Listar centros de costo
	 *
	 * Los centros de costo del emisor, los más recientes primero, con cuántas facturas tiene cada uno. Los archivados solo con include_archived=true.
	 *
	 * GET /v1/cost_centers
	 * @see https://fiscalisto.com/docs/api/referencia/centros-de-costo/list-cost-centers
	 */
	list(params?: ListCostCentersParams, options?: RequestOptions): List<CostCenter> {
		return this.#client.list({ path: "/v1/cost_centers", query: params }, options);
	}

	/**
	 * Ver un centro de costo
	 *
	 * Un centro de costo del emisor.
	 *
	 * GET /v1/cost_centers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/centros-de-costo/get-cost-center
	 */
	get(id: string, options?: RequestOptions): Promise<CostCenter> {
		return this.#client.request({ method: "GET", path: `/v1/cost_centers/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un centro de costo
	 *
	 * Cambia solo lo que manda. archived: true lo archiva (ya no se ponen facturas en él y las suyas lo conservan), false lo restaura.
	 *
	 * POST /v1/cost_centers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/centros-de-costo/update-cost-center
	 */
	update(id: string, params?: UpdateCostCenterParams, options?: RequestOptions): Promise<CostCenter> {
		return this.#client.request({ method: "POST", path: `/v1/cost_centers/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un centro de costo
	 *
	 * Sus facturas pasan a move_to (así junta dos en uno) o se quedan sin centro de costo. No se puede deshacer; para dejar de usarlo sin tocar sus facturas, archívelo.
	 *
	 * DELETE /v1/cost_centers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/centros-de-costo/delete-cost-center
	 */
	delete(id: string, params?: DeleteCostCenterParams, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/cost_centers/${encodeURIComponent(id)}`, query: params }, options);
	}
}

/** Listas de precios: fiscalisto.priceLists. */
export class PriceListsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear una lista de precios
	 *
	 * Parte del precio del catálogo (o de base_list, otra lista), lo mueve adjust_percent y lo redondea a round_to; con starts_on y ends_on es una promoción. items le pone precios propios por producto, por presentación (unit, una caja) y desde min_quantity (escalones de mayoreo), cada uno con unit_price o discount_percent. is_default: la tienen los clientes sin otra. Hasta 100.
	 *
	 * POST /v1/price_lists
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/create-price-list
	 */
	create(params: CreatePriceListParams, options?: RequestOptions): Promise<PriceList> {
		return this.#client.request({ method: "POST", path: "/v1/price_lists", body: params, idempotent: true }, options);
	}

	/**
	 * Listar listas de precios
	 *
	 * Las listas de precios en el orden de la app, con cuántos grupos y clientes la tienen. items viene al ver una.
	 *
	 * GET /v1/price_lists
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/list-price-lists
	 */
	list(params?: ListPriceListsParams, options?: RequestOptions): List<PriceList> {
		return this.#client.list({ path: "/v1/price_lists", query: params }, options);
	}

	/**
	 * Ver una lista de precios
	 *
	 * Una lista de precios con sus precios propios (items).
	 *
	 * GET /v1/price_lists/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/get-price-list
	 */
	get(id: string, options?: RequestOptions): Promise<PriceList> {
		return this.#client.request({ method: "GET", path: `/v1/price_lists/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar una lista de precios
	 *
	 * Cambia solo lo que manda; items reemplaza todos sus precios propios. Las facturas, cotizaciones y pedidos ya hechos no cambian.
	 *
	 * POST /v1/price_lists/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/update-price-list
	 */
	update(id: string, params?: UpdatePriceListParams, options?: RequestOptions): Promise<PriceList> {
		return this.#client.request({ method: "POST", path: `/v1/price_lists/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar una lista de precios
	 *
	 * La archiva: sus grupos y clientes pasan a la lista que aplica a todos (o al precio del catálogo).
	 *
	 * DELETE /v1/price_lists/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/delete-price-list
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/price_lists/${encodeURIComponent(id)}` }, options);
	}
}

/** Listas de precios: fiscalisto.customerGroups. */
export class CustomerGroupsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un grupo de clientes
	 *
	 * Lo que tienen todos sus clientes: price_list, discount_percent (el descuento de cada concepto en el CFDI), credit_days, min_order (antes de IVA, desde el portal) y portal_ordering. Un cliente entra con group en POST /v1/customers/{id}.
	 *
	 * POST /v1/customer_groups
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/create-customer-group
	 */
	create(params: CreateCustomerGroupParams, options?: RequestOptions): Promise<CustomerGroup> {
		return this.#client.request({ method: "POST", path: "/v1/customer_groups", body: params, idempotent: true }, options);
	}

	/**
	 * Listar grupos de clientes
	 *
	 * Los grupos de clientes, con cuántos clientes tiene cada uno.
	 *
	 * GET /v1/customer_groups
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/list-customer-groups
	 */
	list(params?: ListCustomerGroupsParams, options?: RequestOptions): List<CustomerGroup> {
		return this.#client.list({ path: "/v1/customer_groups", query: params }, options);
	}

	/**
	 * Ver un grupo de clientes
	 *
	 * Un grupo de clientes.
	 *
	 * GET /v1/customer_groups/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/get-customer-group
	 */
	get(id: string, options?: RequestOptions): Promise<CustomerGroup> {
		return this.#client.request({ method: "GET", path: `/v1/customer_groups/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar un grupo de clientes
	 *
	 * Cambia solo lo que manda.
	 *
	 * POST /v1/customer_groups/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/update-customer-group
	 */
	update(id: string, params?: UpdateCustomerGroupParams, options?: RequestOptions): Promise<CustomerGroup> {
		return this.#client.request({ method: "POST", path: `/v1/customer_groups/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar un grupo de clientes
	 *
	 * Sus clientes se quedan sin grupo.
	 *
	 * DELETE /v1/customer_groups/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/delete-customer-group
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/customer_groups/${encodeURIComponent(id)}` }, options);
	}
}

/** Listas de precios: fiscalisto.prices. */
export class PricesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver los precios de un cliente
	 *
	 * Lo que un cliente paga por unos productos a una cantidad: el precio por unidad sin IVA de su lista (la suya, la de su grupo o la de todos), su descuento y el siguiente escalón de mayoreo. No guarda nada.
	 *
	 * POST /v1/prices
	 * @see https://fiscalisto.com/docs/api/referencia/listas-de-precios/quote-prices
	 */
	quote(params: QuotePricesParams, options?: RequestOptions): Promise<PriceQuote> {
		return this.#client.request({ method: "POST", path: "/v1/prices", body: params, idempotent: true }, options);
	}
}

/** Asistencia: fiscalisto.attendance. */
export class AttendanceResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver la asistencia de un periodo
	 *
	 * El registro de jornada del emisor (LFT art. 132) del periodo, por empleado: minutos trabajados contra su horario, faltas, retardos, días sin salida, marcas con notas y horas extra dobles y triples por semana. Con employee, también cada día y cada marca (con sus correcciones). Hasta 92 días a la vez.
	 *
	 * GET /v1/attendance
	 * @see https://fiscalisto.com/docs/api/referencia/asistencia/get-attendance
	 */
	get(params: GetAttendanceParams, options?: RequestOptions): Promise<AttendanceReport> {
		return this.#client.request({ method: "GET", path: "/v1/attendance", query: params }, options);
	}

	/**
	 * Registrar una marca
	 *
	 * Una entrada o salida que viene de otro reloj checador. Queda con method api y su motivo, y el empleado la ve en su enlace. Una marca igual del mismo empleado dentro de 60 segundos no se duplica.
	 *
	 * POST /v1/attendance/marks
	 * @see https://fiscalisto.com/docs/api/referencia/asistencia/create-attendance-mark
	 */
	createMark(params: CreateAttendanceMarkParams, options?: RequestOptions): Promise<AttendanceMark> {
		return this.#client.request({ method: "POST", path: "/v1/attendance/marks", body: params, idempotent: true }, options);
	}

	/**
	 * Quitar una marca
	 *
	 * La marca deja de contar y queda tachada con su motivo, quién y cuándo (nunca se borra). En la app se puede restaurar.
	 *
	 * POST /v1/attendance/marks/{id}/void
	 * @see https://fiscalisto.com/docs/api/referencia/asistencia/void-attendance-mark
	 */
	voidMark(id: string, params: VoidAttendanceMarkParams, options?: RequestOptions): Promise<AttendanceMark> {
		return this.#client.request({ method: "POST", path: `/v1/attendance/marks/${encodeURIComponent(id)}/void`, body: params, idempotent: true }, options);
	}

	/**
	 * Autorizar o rechazar horas extra
	 *
	 * Hasta cuántos minutos de horas extra de un día de un empleado cuentan para la nómina, antes o después de ese día, o rechazarlas todas (rejected: true, con comment). minutes null quita la decisión. Con la regla de horas extra «Necesitan autorización», lo que nadie autorizó queda en el registro como sin autorizar.
	 *
	 * POST /v1/attendance/overtime
	 * @see https://fiscalisto.com/docs/api/referencia/asistencia/approve-attendance-overtime
	 */
	approveOvertime(params: ApproveAttendanceOvertimeParams, options?: RequestOptions): Promise<AttendanceOvertime> {
		return this.#client.request({ method: "POST", path: "/v1/attendance/overtime", body: params, idempotent: true }, options);
	}
}

/** Viáticos y gastos: fiscalisto.expensePeople. */
export class ExpensePeopleResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Agregar a una persona
	 *
	 * Alguien que viaja o gasta por el emisor: un empleado (employee, emp_…: sus anticipos y reembolsos «En la nómina» van en su siguiente recibo) o alguien por honorarios (name y tax_id). Con email, Fiscalisto le puede mandar su enlace.
	 *
	 * POST /v1/expense_people
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/create-expense-person
	 */
	create(params: CreateExpensePersonParams, options?: RequestOptions): Promise<ExpensePerson> {
		return this.#client.request({ method: "POST", path: "/v1/expense_people", body: params, idempotent: true }, options);
	}

	/**
	 * Listar personas
	 *
	 * Las personas que comprueban gastos del emisor, las más recientes primero. Las archivadas solo con include_archived=true.
	 *
	 * GET /v1/expense_people
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/list-expense-people
	 */
	list(params?: ListExpensePeopleParams, options?: RequestOptions): List<ExpensePerson> {
		return this.#client.list({ path: "/v1/expense_people", query: params }, options);
	}

	/**
	 * Ver una persona
	 *
	 * Una persona que comprueba gastos del emisor.
	 *
	 * GET /v1/expense_people/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/get-expense-person
	 */
	get(id: string, options?: RequestOptions): Promise<ExpensePerson> {
		return this.#client.request({ method: "GET", path: `/v1/expense_people/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar una persona
	 *
	 * Cambia solo lo que manda. archived: true la archiva (ya no se le abren comprobaciones y su enlace deja de funcionar), false la restaura.
	 *
	 * POST /v1/expense_people/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/update-expense-person
	 */
	update(id: string, params?: UpdateExpensePersonParams, options?: RequestOptions): Promise<ExpensePerson> {
		return this.#client.request({ method: "POST", path: `/v1/expense_people/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Dar su enlace a una persona
	 *
	 * El enlace donde la persona ve solo sus comprobaciones y sube sus facturas desde el teléfono, sin cuenta. Con renew: true le da uno nuevo y el anterior deja de funcionar.
	 *
	 * POST /v1/expense_people/{id}/link
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/create-expense-person-link
	 */
	createLink(id: string, params?: CreateExpensePersonLinkParams, options?: RequestOptions): Promise<ExpensePersonLink> {
		return this.#client.request({ method: "POST", path: `/v1/expense_people/${encodeURIComponent(id)}/link`, body: params, idempotent: true }, options);
	}

	/**
	 * Apagar el enlace de una persona
	 *
	 * Su enlace deja de funcionar (url: null). Puede darle uno nuevo después con POST /v1/expense_people/{id}/link.
	 *
	 * DELETE /v1/expense_people/{id}/link
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/delete-expense-person-link
	 */
	deleteLink(id: string, options?: RequestOptions): Promise<ExpensePersonLink> {
		return this.#client.request({ method: "DELETE", path: `/v1/expense_people/${encodeURIComponent(id)}/link` }, options);
	}
}

/** Viáticos y gastos: fiscalisto.expenseReports. */
export class ExpenseReportsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Abrir una comprobación
	 *
	 * Una por viaje (kind viaje) o una por periodo de gastos de oficina que la empresa reembolsa (kind gastos). Queda abierta (draft): se le agregan gastos y anticipos, y se envía con POST /v1/expense_reports/{id}/submit.
	 *
	 * POST /v1/expense_reports
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/create-expense-report
	 */
	create(params: CreateExpenseReportParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: "/v1/expense_reports", body: params, idempotent: true }, options);
	}

	/**
	 * Listar comprobaciones
	 *
	 * Las comprobaciones del emisor, las más recientes primero, con sus gastos y movimientos.
	 *
	 * GET /v1/expense_reports
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/list-expense-reports
	 */
	list(params?: ListExpenseReportsParams, options?: RequestOptions): List<ExpenseReport> {
		return this.#client.list({ path: "/v1/expense_reports", query: params }, options);
	}

	/**
	 * Ver una comprobación
	 *
	 * Una comprobación con sus gastos, lo deducible de cada uno, sus avisos (issues) contra la ley y la política, y su saldo.
	 *
	 * GET /v1/expense_reports/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/get-expense-report
	 */
	get(id: string, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "GET", path: `/v1/expense_reports/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar una comprobación
	 *
	 * Cambia solo lo que manda: su nombre, el propósito, el destino y las fechas. Mientras no esté aprobada.
	 *
	 * POST /v1/expense_reports/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/update-expense-report
	 */
	update(id: string, params?: UpdateExpenseReportParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar una comprobación
	 *
	 * Una que no esté aprobada y no tenga anticipos ni pagos (quítelos antes). No se puede deshacer.
	 *
	 * DELETE /v1/expense_reports/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/delete-expense-report
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/expense_reports/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Enviar a aprobar
	 *
	 * La persona termina: pasa a submitted (por aprobar). Contesta expense_report_invalid si un gasto tiene un error (issues con level error).
	 *
	 * POST /v1/expense_reports/{id}/submit
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/submit-expense-report
	 */
	submit(id: string, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/submit`, idempotent: true }, options);
	}

	/**
	 * Aprobar una comprobación
	 *
	 * Pasa a approved (por liquidar): sus facturas se deducen en los impuestos del emisor y entra en las pólizas contra 107.01 Funcionarios y empleados. Con el saldo en cero se cierra sola; si no, liquide con un reembolso o una devolución.
	 *
	 * POST /v1/expense_reports/{id}/approve
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/approve-expense-report
	 */
	approve(id: string, params?: ApproveExpenseReportParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/approve`, body: params, idempotent: true }, options);
	}

	/**
	 * Devolver para corregir
	 *
	 * Regresa a la persona (rejected, «Devuelta») con una nota de qué corregir. La corrige y la vuelve a enviar.
	 *
	 * POST /v1/expense_reports/{id}/return
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/return-expense-report
	 */
	sendBack(id: string, params: ReturnExpenseReportParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/return`, body: params, idempotent: true }, options);
	}

	/**
	 * Reabrir una comprobación
	 *
	 * Una aprobada vuelve a abierta: sus facturas dejan de deducirse y sale de las pólizas. No si ya se reportó en la nómina.
	 *
	 * POST /v1/expense_reports/{id}/reopen
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/reopen-expense-report
	 */
	reopen(id: string, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/reopen`, idempotent: true }, options);
	}

	/**
	 * Agregar un gasto
	 *
	 * Con uuid, una factura recibida del emisor (GET /v1/sat_invoices): la fecha, el monto y el proveedor salen de ella. Sin uuid, un gasto con su category, date y amount (un ticket, un comprobante del extranjero). Contesta la comprobación revisada.
	 *
	 * POST /v1/expense_reports/{id}/items
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/create-expense-item
	 */
	createItem(id: string, params: CreateExpenseItemParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/items`, body: params, idempotent: true }, options);
	}

	/**
	 * Actualizar un gasto
	 *
	 * Cambia solo lo que manda. Al revisarla, rejected: true con reject_reason rechaza el gasto (no se paga ni se deduce) y false lo vuelve a incluir.
	 *
	 * POST /v1/expense_reports/{id}/items/{item}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/update-expense-item
	 */
	updateItem(id: string, item: string, params?: UpdateExpenseItemParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/items/${encodeURIComponent(item)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar un gasto
	 *
	 * Lo quita de la comprobación mientras no esté aprobada. Contesta la comprobación.
	 *
	 * DELETE /v1/expense_reports/{id}/items/{item}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/delete-expense-item
	 */
	deleteItem(id: string, item: string, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "DELETE", path: `/v1/expense_reports/${encodeURIComponent(id)}/items/${encodeURIComponent(item)}` }, options);
	}

	/**
	 * Registrar dinero dado o devuelto
	 *
	 * Un anticipo (antes de aprobarla), un reembolso o una devolución (ya aprobada). Con method nomina va en el siguiente recibo de nómina del empleado. Con el saldo en cero, una aprobada se cierra.
	 *
	 * POST /v1/expense_reports/{id}/movements
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/create-expense-movement
	 */
	createMovement(id: string, params: CreateExpenseMovementParams, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "POST", path: `/v1/expense_reports/${encodeURIComponent(id)}/movements`, body: params, idempotent: true }, options);
	}

	/**
	 * Deshacer un movimiento
	 *
	 * Lo quita (una cerrada vuelve a por liquidar). No uno que ya se pagó en la nómina.
	 *
	 * DELETE /v1/expense_reports/{id}/movements/{movement}
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/delete-expense-movement
	 */
	deleteMovement(id: string, movement: string, options?: RequestOptions): Promise<ExpenseReport> {
		return this.#client.request({ method: "DELETE", path: `/v1/expense_reports/${encodeURIComponent(id)}/movements/${encodeURIComponent(movement)}` }, options);
	}
}

/** Viáticos y gastos: fiscalisto.expensePolicy. */
export class ExpensePolicyResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver la política
	 *
	 * La política de viáticos y gastos del emisor: topes por categoría, hasta cuánto sin factura y los días para comprobar.
	 *
	 * GET /v1/expense_policy
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/get-expense-policy
	 */
	get(params?: GetExpensePolicyParams, options?: RequestOptions): Promise<ExpensePolicy> {
		return this.#client.request({ method: "GET", path: "/v1/expense_policy", query: params }, options);
	}

	/**
	 * Cambiar la política
	 *
	 * Cambia solo lo que manda; en limits, una categoría con null deja de tener tope. Un gasto que pasa un tope no se rechaza: se marca para quien aprueba.
	 *
	 * POST /v1/expense_policy
	 * @see https://fiscalisto.com/docs/api/referencia/viaticos-y-gastos/update-expense-policy
	 */
	update(params?: UpdateExpensePolicyParams, options?: RequestOptions): Promise<ExpensePolicy> {
		return this.#client.request({ method: "POST", path: "/v1/expense_policy", body: params, idempotent: true }, options);
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
	 * Las ligas para pedir datos fiscales, las más recientes primero, con su estado.
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
	 * Una solicitud de datos: su liga y, si el cliente ya contestó, sus datos fiscales y el cliente que se guardó.
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
	 * Un producto o servicio del catálogo del emisor, con su clave del SAT, su unidad, su precio y sus impuestos, para usarlo en items con product.
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
	 * Los productos del emisor, los más recientes primero. Filtre por sku, product_key o category.
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
	 * Un producto del catálogo.
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
	 * Cambia solo los campos que manda. Las facturas ya timbradas no cambian.
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
	 * Lo quita del catálogo. Las facturas que lo usaron siguen igual.
	 *
	 * DELETE /v1/products/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/productos/delete-product
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/products/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Ver las existencias de un producto
	 *
	 * Lo que hay del producto en cada almacén del emisor (también en 0), apartado por cotizaciones y disponible.
	 *
	 * GET /v1/products/{id}/stock
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/get-product-stock
	 */
	stock(id: string, options?: RequestOptions): Promise<StockLevelList> {
		return this.#client.request({ method: "GET", path: `/v1/products/${encodeURIComponent(id)}/stock` }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.satMailboxMessages. */
export class SatMailboxMessagesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar avisos del buzón tributario
	 *
	 * Los avisos que trajo del buzón del emisor, los más recientes primero. No usa timbres.
	 *
	 * GET /v1/sat_mailbox_messages
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/list-sat-mailbox-messages
	 */
	list(params?: ListSatMailboxMessagesParams, options?: RequestOptions): List<SatMailboxMessage> {
		return this.#client.list({ path: "/v1/sat_mailbox_messages", query: params }, options);
	}

	/**
	 * Ver un aviso del buzón tributario
	 *
	 * Un aviso del buzón, con su urgencia y si pide hacer algo.
	 *
	 * GET /v1/sat_mailbox_messages/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-sat-mailbox-message
	 */
	get(id: string, options?: RequestOptions): Promise<SatMailboxMessage> {
		return this.#client.request({ method: "GET", path: `/v1/sat_mailbox_messages/${encodeURIComponent(id)}` }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.satFindings. */
export class SatFindingsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar hallazgos en los CFDI
	 *
	 * Lo que Fiscalisto encontró en los CFDI del emisor (los suyos y los descargados del SAT) y nadie ha revisado, por tipo y del más grave al más leve: proveedores en la lista 69-B, CFDI cancelados, pagos en efectivo de más de $2,000, errores de CFDI 4.0. Todos en una página. No usa timbres.
	 *
	 * GET /v1/sat_findings
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/list-sat-findings
	 */
	list(params?: ListSatFindingsParams, options?: RequestOptions): Promise<SatFindingList> {
		return this.#client.request({ method: "GET", path: "/v1/sat_findings", query: params }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.satFindingCounterparties. */
export class SatFindingCounterpartiesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar proveedores y clientes con hallazgos
	 *
	 * Los proveedores (en recibidos) y clientes (en emitidos) con hallazgos sin revisar en los CFDI del emisor, del más grave al más leve y después por cuántos CFDI, cada uno con sus tipos de hallazgo. Con code, quién tiene ese hallazgo. No usa timbres.
	 *
	 * GET /v1/sat_finding_counterparties
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/list-sat-finding-counterparties
	 */
	list(params?: ListSatFindingCounterpartiesParams, options?: RequestOptions): List<SatFindingCounterparty> {
		return this.#client.list({ path: "/v1/sat_finding_counterparties", query: params }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.companyReport. */
export class CompanyReportResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver el reporte de la empresa
	 *
	 * Como Impuestos y SAT › Reporte de la empresa en la app: la salud fiscal del emisor en una calificación de 0 a 1,000 con la razón de cada factor, los indicadores de riesgo contra su umbral, los años lado a lado (ingresos, gastos, PUE y PPD, días de cobro y pago, margen), sus principales clientes y proveedores con su concentración (HHI), sus socios por los CFDI de retenciones por dividendos y los clientes y proveedores que publicaron su liquidación o fusión. Sale de lo que Fiscalisto ya tiene: no consulta al SAT y no usa timbres. Sin fechas, los últimos 12 meses.
	 *
	 * GET /v1/company_report
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/get-company-report
	 */
	get(params?: GetCompanyReportParams, options?: RequestOptions): Promise<CompanyReport> {
		return this.#client.request({ method: "GET", path: "/v1/company_report", query: params }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.materialitySuppliers. */
export class MaterialitySuppliersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar la materialidad por proveedor
	 *
	 * Como Materialidad en la app: los proveedores de las facturas recibidas (ingresos) del emisor en un periodo, con cuánto de lo que facturaron tiene evidencia completa de que la operación existió (acuerdo, entrega y pago). Primero los que están en 69-B definitivo (corre su plazo de 30 días hábiles), después los de más importe sin probar. Una página, hasta 500. Sin fechas, este año hasta hoy. No usa timbres.
	 *
	 * GET /v1/materiality_suppliers
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/list-materiality-suppliers
	 */
	list(params?: ListMaterialitySuppliersParams, options?: RequestOptions): Promise<MaterialitySupplierList> {
		return this.#client.request({ method: "GET", path: "/v1/materiality_suppliers", query: params }, options);
	}
}

/** Cumplimiento SAT: fiscalisto.materialityInvoices. */
export class MaterialityInvoicesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar facturas recibidas por probar
	 *
	 * Las facturas recibidas (ingresos) del emisor en un periodo que no tienen su evidencia completa, de mayor a menor importe, cada una con lo que tiene, lo que le falta y de dónde salió cada evidencia (orden de compra, recepción, complemento de pago, banco, archivos). Con state, solo las de ese estado. Una página, hasta 300; has_more dice que hay más (acorte el periodo o filtre por proveedor). No usa timbres.
	 *
	 * GET /v1/materiality_invoices
	 * @see https://fiscalisto.com/docs/api/referencia/cumplimiento-sat/list-materiality-invoices
	 */
	list(params?: ListMaterialityInvoicesParams, options?: RequestOptions): Promise<MaterialityInvoiceList> {
		return this.#client.request({ method: "GET", path: "/v1/materiality_invoices", query: params }, options);
	}
}

/** Inventario: fiscalisto.warehouses. */
export class WarehousesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar almacenes
	 *
	 * Los almacenes del emisor, los más recientes primero: el de la Matriz y uno por sucursal se crean solos. Todos en una página.
	 *
	 * GET /v1/warehouses
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/list-warehouses
	 */
	list(params?: ListWarehousesParams, options?: RequestOptions): Promise<WarehouseList> {
		return this.#client.request({ method: "GET", path: "/v1/warehouses", query: params }, options);
	}

	/**
	 * Ver un almacén
	 *
	 * Un almacén del emisor.
	 *
	 * GET /v1/warehouses/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/get-warehouse
	 */
	get(id: string, options?: RequestOptions): Promise<Warehouse> {
		return this.#client.request({ method: "GET", path: `/v1/warehouses/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Ver las existencias de un almacén
	 *
	 * Lo que hay de cada producto en el almacén, el producto más reciente primero. Solo los que tienen existencias, salvo con include_empty=true (todos los que llevan track_stock).
	 *
	 * GET /v1/warehouses/{id}/stock
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/list-warehouse-stock
	 */
	stock(id: string, params?: ListWarehouseStockParams, options?: RequestOptions): List<StockLevel> {
		return this.#client.list({ path: `/v1/warehouses/${encodeURIComponent(id)}/stock`, query: params }, options);
	}
}

/** Inventario: fiscalisto.stockMovements. */
export class StockMovementsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar movimientos (kárdex)
	 *
	 * Cada entrada y salida de existencias, la más reciente primero: ventas (de sus facturas), compras, ajustes, traspasos y lo que deshizo una cancelación.
	 *
	 * GET /v1/stock_movements
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/list-stock-movements
	 */
	list(params?: ListStockMovementsParams, options?: RequestOptions): List<StockMovement> {
		return this.#client.list({ path: "/v1/stock_movements", query: params }, options);
	}

	/**
	 * Ver un movimiento
	 *
	 * Una entrada o salida de existencias, con lo que la causó (source).
	 *
	 * GET /v1/stock_movements/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/get-stock-movement
	 */
	get(id: string, options?: RequestOptions): Promise<StockMovement> {
		return this.#client.request({ method: "GET", path: `/v1/stock_movements/${encodeURIComponent(id)}` }, options);
	}
}

/** Inventario: fiscalisto.stockAdjustments. */
export class StockAdjustmentsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ajustar existencias
	 *
	 * Mete o saca existencias de un almacén con su motivo: el inventario inicial, una merma, un robo, un sobrante. Las entradas valen su unit_cost (o el costo promedio), las salidas el costo del emisor (promedio o PEPS). Los productos deben llevar track_stock: true. Se aplica al momento (status applied).
	 *
	 * POST /v1/stock_adjustments
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/create-stock-adjustment
	 */
	create(params: CreateStockAdjustmentParams, options?: RequestOptions): Promise<StockAdjustment> {
		return this.#client.request({ method: "POST", path: "/v1/stock_adjustments", body: params, idempotent: true }, options);
	}

	/**
	 * Listar ajustes
	 *
	 * Los ajustes del emisor, los más recientes primero.
	 *
	 * GET /v1/stock_adjustments
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/list-stock-adjustments
	 */
	list(params?: ListStockAdjustmentsParams, options?: RequestOptions): List<StockAdjustment> {
		return this.#client.list({ path: "/v1/stock_adjustments", query: params }, options);
	}

	/**
	 * Ver un ajuste
	 *
	 * Un ajuste de existencias, con sus líneas.
	 *
	 * GET /v1/stock_adjustments/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/get-stock-adjustment
	 */
	get(id: string, options?: RequestOptions): Promise<StockAdjustment> {
		return this.#client.request({ method: "GET", path: `/v1/stock_adjustments/${encodeURIComponent(id)}` }, options);
	}
}

/** Inventario: fiscalisto.productionOrders. */
export class ProductionOrdersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear una orden de producción
	 *
	 * Una orden en borrador (status draft) para producir quantity de un producto con receta: sus components salen de la receta (la hoja de costo de Compras › Costos y márgenes) con su merma y rendimiento, y sus other_costs se escalan a la cantidad. Nada se mueve hasta iniciarla. Enciende Producción en el inventario si estaba apagada. Un producto sin receta: 400 inventory_refused.
	 *
	 * POST /v1/production_orders
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/create-production-order
	 */
	create(params: CreateProductionOrderParams, options?: RequestOptions): Promise<ProductionOrder> {
		return this.#client.request({ method: "POST", path: "/v1/production_orders", body: params, idempotent: true }, options);
	}

	/**
	 * Listar órdenes de producción
	 *
	 * Las órdenes del emisor, las más recientes primero.
	 *
	 * GET /v1/production_orders
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/list-production-orders
	 */
	list(params?: ListProductionOrdersParams, options?: RequestOptions): List<ProductionOrder> {
		return this.#client.list({ path: "/v1/production_orders", query: params }, options);
	}

	/**
	 * Ver una orden de producción
	 *
	 * Una orden con sus componentes, sus otros costos y, al terminar, su costo por unidad.
	 *
	 * GET /v1/production_orders/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/get-production-order
	 */
	get(id: string, options?: RequestOptions): Promise<ProductionOrder> {
		return this.#client.request({ method: "GET", path: `/v1/production_orders/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Iniciar una orden de producción
	 *
	 * Los componentes salen del almacén (status in_process), cada lote el que caduca primero, al costo del emisor (promedio o PEPS). Mande components para lo que de verdad se usó de alguno. Con existencias negativas en «No permitir», uno que no alcanza: 400 inventory_refused.
	 *
	 * POST /v1/production_orders/{id}/start
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/start-production-order
	 */
	start(id: string, params?: StartProductionOrderParams, options?: RequestOptions): Promise<ProductionOrder> {
		return this.#client.request({ method: "POST", path: `/v1/production_orders/${encodeURIComponent(id)}/start`, body: params, idempotent: true }, options);
	}

	/**
	 * Terminar una orden de producción
	 *
	 * Lo producido entra al almacén destino a su costo real: (materials_cost + other_costs) ÷ quantity_made (status completed). Una en borrador se inicia antes con lo planeado.
	 *
	 * POST /v1/production_orders/{id}/complete
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/complete-production-order
	 */
	complete(id: string, params?: CompleteProductionOrderParams, options?: RequestOptions): Promise<ProductionOrder> {
		return this.#client.request({ method: "POST", path: `/v1/production_orders/${encodeURIComponent(id)}/complete`, body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar una orden de producción
	 *
	 * Los componentes regresan a su almacén y lo producido sale (status cancelled). Una ya cancelada: 400 inventory_refused.
	 *
	 * POST /v1/production_orders/{id}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/inventario/cancel-production-order
	 */
	cancel(id: string, options?: RequestOptions): Promise<ProductionOrder> {
		return this.#client.request({ method: "POST", path: `/v1/production_orders/${encodeURIComponent(id)}/cancel`, idempotent: true }, options);
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
	 * product_keys, unit_keys y customs_tariffs (fracciones arancelarias de Comercio Exterior, con su customs_unit) se buscan con q (texto o clave). Los demás vienen completos: tax_systems, cfdi_uses, payment_forms, payment_methods, relationship_types, cancellation_motives, export_types, tax_objects, retention_codes.
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

/** Verificar comprobantes: fiscalisto.cfdiVerifications. */
export class CfdiVerificationsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Verificar un CFDI en el SAT
	 *
	 * Si cualquier CFDI (suyo, de un proveedor o de un cliente) existe en el SAT y está vigente o cancelado, si se puede cancelar, y si su emisor y su receptor están en las listas del SAT. Mande su XML, el texto de su QR, o el UUID con los dos RFC y el total. Consulta el servicio público del SAT, sin e.firma. No usa timbres. En pruebas también consulta el SAT real: los comprobantes de prueba no están ahí y responden not_found.
	 *
	 * POST /v1/cfdi_verifications
	 * @see https://fiscalisto.com/docs/api/referencia/verificar-comprobantes/verify-cfdi
	 */
	create(params?: VerifyCfdiParams, options?: RequestOptions): Promise<CfdiVerification> {
		return this.#client.request({ method: "POST", path: "/v1/cfdi_verifications", body: params, idempotent: true }, options);
	}
}

/** Equipo: fiscalisto.members. */
export class MembersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar miembros
	 *
	 * Quién entra a la empresa en la app, con su rol, sus permisos y los RFC y sucursales a su alcance, como Ajustes › Miembros. Todos, los más antiguos primero. Pide que quien creó la llave tenga el permiso de ver el equipo.
	 *
	 * GET /v1/members
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/list-members
	 */
	list(params?: ListMembersParams, options?: RequestOptions): Promise<MemberList> {
		return this.#client.request({ method: "GET", path: "/v1/members", query: params }, options);
	}

	/**
	 * Ver un miembro
	 *
	 * Su rol, sus permisos (los agregados, los quitados y los que tiene al final) y su alcance.
	 *
	 * GET /v1/members/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/get-member
	 */
	get(id: string, options?: RequestOptions): Promise<Member> {
		return this.#client.request({ method: "GET", path: `/v1/members/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar el acceso de un miembro
	 *
	 * Su rol, los permisos que se le agregan o quitan y los RFC y sucursales a su alcance; lo que no mande se queda como está. Nadie da más de lo que tiene quien creó la llave. Dar, quitar o tocar un permiso delicado (equipo, credenciales, seguridad, plan) contesta 403 team_change_requires_app: se hace en la app, que confirma la identidad.
	 *
	 * POST /v1/members/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/update-member
	 */
	update(id: string, params?: UpdateMemberParams, options?: RequestOptions): Promise<Member> {
		return this.#client.request({ method: "POST", path: `/v1/members/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar a un miembro
	 *
	 * La persona deja de entrar a la empresa y sus invitaciones se cancelan; lo que hizo se queda con su nombre. Lo que le esperaba (pasos de aprobación que la nombran, aprobaciones pendientes, avisos, ausencias, viáticos que aprueba) pasa a `transfer_to` o, sin él, a cualquiera con el permiso. Siempre queda al menos un propietario; quitar a alguien con permisos delicados se hace en la app.
	 *
	 * DELETE /v1/members/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/delete-member
	 */
	delete(id: string, params?: DeleteMemberParams, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/members/${encodeURIComponent(id)}`, query: params }, options);
	}
}

/** Equipo: fiscalisto.invitations. */
export class InvitationsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar invitaciones
	 *
	 * Las invitaciones pendientes de la empresa, las más antiguas primero.
	 *
	 * GET /v1/invitations
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/list-invitations
	 */
	list(params?: ListInvitationsParams, options?: RequestOptions): Promise<InvitationList> {
		return this.#client.request({ method: "GET", path: "/v1/invitations", query: params }, options);
	}

	/**
	 * Invitar a alguien a la empresa
	 *
	 * Le manda un correo con un enlace para entrar a la empresa con ese rol, válido 7 días, como Invitar en Ajustes › Miembros. Invitar otra vez al mismo correo reemplaza la invitación. Una invitación con permisos delicados (equipo, credenciales, seguridad, plan) o como propietario se hace en la app.
	 *
	 * POST /v1/invitations
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/create-invitation
	 */
	create(params: CreateInvitationParams, options?: RequestOptions): Promise<Invitation> {
		return this.#client.request({ method: "POST", path: "/v1/invitations", body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar una invitación
	 *
	 * Su enlace deja de servir. Contesta la invitación con status canceled.
	 *
	 * DELETE /v1/invitations/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/cancel-invitation
	 */
	cancel(id: string, options?: RequestOptions): Promise<Invitation> {
		return this.#client.request({ method: "DELETE", path: `/v1/invitations/${encodeURIComponent(id)}` }, options);
	}
}

/** Equipo: fiscalisto.roles. */
export class RolesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar roles
	 *
	 * Propietario, los roles de Fiscalisto (como se editaron en la empresa) y los suyos, con sus permisos y cuántas personas los tienen.
	 *
	 * GET /v1/roles
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/list-roles
	 */
	list(params?: ListRolesParams, options?: RequestOptions): Promise<RoleList> {
		return this.#client.request({ method: "GET", path: "/v1/roles", query: params }, options);
	}

	/**
	 * Crear un rol
	 *
	 * Un rol de la empresa con su nombre y sus permisos (GET /v1/permissions), como Ajustes › Roles. No puede tener permisos que no tenga quien creó la llave; uno con permisos delicados se hace en la app.
	 *
	 * POST /v1/roles
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/create-role
	 */
	create(params: CreateRoleParams, options?: RequestOptions): Promise<Role> {
		return this.#client.request({ method: "POST", path: "/v1/roles", body: params, idempotent: true }, options);
	}

	/**
	 * Cambiar un rol
	 *
	 * Su nombre, su descripción o sus permisos; lo que no mande se queda. Cambia el acceso de todos los que lo tienen. Propietario no se cambia.
	 *
	 * POST /v1/roles/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/update-role
	 */
	update(id: string, params?: UpdateRoleParams, options?: RequestOptions): Promise<Role> {
		return this.#client.request({ method: "POST", path: `/v1/roles/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un rol
	 *
	 * Solo uno de la empresa (type custom), cuando nadie lo tiene ni lo da una invitación pendiente.
	 *
	 * DELETE /v1/roles/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/delete-role
	 */
	delete(id: string, params?: DeleteRoleParams, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/roles/${encodeURIComponent(id)}`, query: params }, options);
	}
}

/** Equipo: fiscalisto.permissions. */
export class PermissionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar permisos
	 *
	 * Cada permiso que un rol o una persona puede tener, con su nombre en la app, su grupo y si es delicado.
	 *
	 * GET /v1/permissions
	 * @see https://fiscalisto.com/docs/api/referencia/equipo/list-permissions
	 */
	list(options?: RequestOptions): Promise<PermissionList> {
		return this.#client.request({ method: "GET", path: "/v1/permissions" }, options);
	}
}

/** Exportaciones: fiscalisto.exports. */
export class ExportsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Exportar las facturas de un mes
	 *
	 * Un ZIP con el XML (y si quiere el PDF) de cada factura que el emisor emitió o recibió en un mes o un periodo, o un Excel con una fila por factura: los mismos archivos que Facturas › Exportar en la app, para su contador, un respaldo o una auditoría. Contesta 202 de inmediato con status processing; consulte GET /v1/exports/{id} hasta completed y descárguelo con GET /v1/exports/{id}/download durante 30 días. No usa timbres y sirve con una llave de solo lectura.
	 *
	 * POST /v1/exports
	 * @see https://fiscalisto.com/docs/api/referencia/exportaciones/create-export
	 */
	create(params?: CreateExportParams, options?: RequestOptions): Promise<Export> {
		return this.#client.request({ method: "POST", path: "/v1/exports", body: params, idempotent: true }, options);
	}

	/**
	 * Listar exportaciones
	 *
	 * Las exportaciones del emisor pedidas por la API, las más recientes primero.
	 *
	 * GET /v1/exports
	 * @see https://fiscalisto.com/docs/api/referencia/exportaciones/list-exports
	 */
	list(params?: ListExportsParams, options?: RequestOptions): List<Export> {
		return this.#client.list({ path: "/v1/exports", query: params }, options);
	}

	/**
	 * Ver una exportación
	 *
	 * Su estado (processing, completed, failed o expired), cuántas facturas lleva, su tamaño y hasta cuándo se descarga.
	 *
	 * GET /v1/exports/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/exportaciones/get-export
	 */
	get(id: string, options?: RequestOptions): Promise<Export> {
		return this.#client.request({ method: "GET", path: `/v1/exports/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Descargar una exportación
	 *
	 * El ZIP o el Excel, cuando status es completed. Antes, 409 export_not_ready; pasados 30 días, 410 export_expired.
	 *
	 * GET /v1/exports/{id}/download
	 * @see https://fiscalisto.com/docs/api/referencia/exportaciones/download-export
	 */
	download(id: string, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/exports/${encodeURIComponent(id)}/download`, as: "text" }, options);
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
	 * La descarga masiva del SAT: las facturas que el emisor recibió (o emitió) en un periodo de hasta un año, con su XML. Contesta 202 de inmediato; el SAT tarda de minutos a horas y al terminar llega sat_download.completed (o sat_download.failed) y las facturas quedan en GET /v1/sat_invoices. En producción necesita la e.firma guardada del emisor; en pruebas no se le pregunta al SAT: la descarga trae facturas de ejemplo al instante. En producción usa 1 timbre por cada 100 CFDI que trae (al menos 1).
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
	 * Las descargas pedidas al SAT, las más recientes primero, con su estado.
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
	 * Una descarga del SAT: su periodo, su estado y cuántos CFDI trajo. Al terminar llega sat_download.completed.
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
	 * Un CFDI que trajo una descarga del SAT, con sus importes y su estado ante el SAT.
	 *
	 * GET /v1/sat_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-invoice
	 */
	get(id: string, options?: RequestOptions): Promise<SatInvoice> {
		return this.#client.request({ method: "GET", path: `/v1/sat_invoices/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Actualizar una factura del SAT
	 *
	 * Lo que se puede cambiar de un CFDI del SAT sin tocarlo: su centro de costo (cost_center, o null para quitárselo), para ver sus gastos por obra, proyecto o área.
	 *
	 * POST /v1/sat_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/update-sat-invoice
	 */
	update(id: string, params?: UpdateSatInvoiceParams, options?: RequestOptions): Promise<SatInvoice> {
		return this.#client.request({ method: "POST", path: `/v1/sat_invoices/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
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

	/**
	 * Descargar el PDF de una factura del SAT
	 *
	 * El CFDI en PDF, como lo ofrece Facturas: si se timbró en Fiscalisto, el mismo que recibió el cliente; si no, dibujado con el diseño de PDF del emisor (el de un proveedor, con su estilo y color, nunca con su logo). El XML es el documento válido ante el SAT.
	 *
	 * GET /v1/sat_invoices/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-invoice-pdf
	 */
	pdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sat_invoices/${encodeURIComponent(id)}/pdf`, as: "bytes" }, options);
	}
}

/** Descargas del SAT: fiscalisto.satRetentions. */
export class SatRetentionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar constancias de retenciones
	 *
	 * Los CFDI de retenciones e información de pagos del emisor, como los muestra Facturas › Retenciones: los que recibió (descargados del SAT o subidos) o los que emitió, del más reciente al más antiguo, con las canceladas marcadas. Las que emite por la API también están en GET /v1/retentions.
	 *
	 * GET /v1/sat_retentions
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/list-sat-retentions
	 */
	list(params?: ListSatRetentionsParams, options?: RequestOptions): List<SatRetention> {
		return this.#client.list({ path: "/v1/sat_retentions", query: params }, options);
	}

	/**
	 * Ver una constancia de retenciones
	 *
	 * Una constancia de retenciones del emisor, con sus montos, impuestos y estado.
	 *
	 * GET /v1/sat_retentions/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-retention
	 */
	get(id: string, options?: RequestOptions): Promise<SatRetention> {
		return this.#client.request({ method: "GET", path: `/v1/sat_retentions/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Descargar el XML de una constancia de retenciones
	 *
	 * El CFDI de retenciones tal como llegó.
	 *
	 * GET /v1/sat_retentions/{id}/xml
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-retention-xml
	 */
	xml(id: string, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/sat_retentions/${encodeURIComponent(id)}/xml`, as: "text" }, options);
	}

	/**
	 * Descargar el PDF de una constancia de retenciones
	 *
	 * La constancia en PDF, como la ofrece Facturas › Retenciones. El XML es el documento válido ante el SAT.
	 *
	 * GET /v1/sat_retentions/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/get-sat-retention-pdf
	 */
	pdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sat_retentions/${encodeURIComponent(id)}/pdf`, as: "bytes" }, options);
	}

	/**
	 * Cancelar una constancia de retenciones emitida
	 *
	 * Una que el emisor emitió (direction issued), también si la timbró desde otro sistema con el mismo PAC y solo llegó del SAT. Se cancela en el momento (no espera aceptación) y no usa timbres. Una que timbró otro PAC se cancela en el portal del SAT: contesta cancellation_failed y lo explica. Con motive 01, substitution es la constancia que la sustituye (su srt_… o su UUID).
	 *
	 * POST /v1/sat_retentions/{id}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/descargas-del-sat/cancel-sat-retention
	 */
	cancel(id: string, params?: CancelSatRetentionParams, options?: RequestOptions): Promise<SatRetention> {
		return this.#client.request({ method: "POST", path: `/v1/sat_retentions/${encodeURIComponent(id)}/cancel`, body: params, idempotent: true }, options);
	}
}

/** Portal de proveedores: fiscalisto.portalSuppliers. */
export class PortalSuppliersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar proveedores del portal
	 *
	 * Los proveedores invitados o registrados en el Portal de proveedores del emisor, los más recientes primero: su alta, sus documentos, la cuenta a la que se le paga y su calificación.
	 *
	 * GET /v1/portal_suppliers
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/list-portal-suppliers
	 */
	list(params?: ListPortalSuppliersParams, options?: RequestOptions): List<PortalSupplier> {
		return this.#client.list({ path: "/v1/portal_suppliers", query: params }, options);
	}

	/**
	 * Ver un proveedor del portal
	 *
	 * Su alta, sus documentos, su cuenta bancaria y su calificación por partes.
	 *
	 * GET /v1/portal_suppliers/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/get-portal-supplier
	 */
	get(id: string, options?: RequestOptions): Promise<PortalSupplier> {
		return this.#client.request({ method: "GET", path: `/v1/portal_suppliers/${encodeURIComponent(id)}` }, options);
	}
}

/** Portal de proveedores: fiscalisto.supplierInvoices. */
export class SupplierInvoicesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar facturas de proveedores
	 *
	 * Las facturas que mandaron sus proveedores por el portal, las más recientes primero. Para llevar a su ERP lo aprobado: status=approved, o escuche supplier_invoice.approved.
	 *
	 * GET /v1/supplier_invoices
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/list-supplier-invoices
	 */
	list(params?: ListSupplierInvoicesParams, options?: RequestOptions): List<SupplierInvoice> {
		return this.#client.list({ path: "/v1/supplier_invoices", query: params }, options);
	}

	/**
	 * Ver una factura de proveedor
	 *
	 * Con su estado, su orden de compra, su contrarecibo y sus fechas de pago. Su XML y su PDF: GET /v1/sat_invoices/{sat_invoice}/xml y /pdf.
	 *
	 * GET /v1/supplier_invoices/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/get-supplier-invoice
	 */
	get(id: string, options?: RequestOptions): Promise<SupplierInvoice> {
		return this.#client.request({ method: "GET", path: `/v1/supplier_invoices/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Programar el pago de una factura de proveedor
	 *
	 * El día en que la pagará, como «Programar pago» en la app: el proveedor lo ve en su portal y llega supplier_invoice.scheduled. Solo una aprobada o ya programada; si el SAT la reporta cancelada, 400 supplier_invoice_invalid.
	 *
	 * POST /v1/supplier_invoices/{id}/schedule
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/schedule-supplier-invoice
	 */
	schedule(id: string, params: ScheduleSupplierInvoiceParams, options?: RequestOptions): Promise<SupplierInvoice> {
		return this.#client.request({ method: "POST", path: `/v1/supplier_invoices/${encodeURIComponent(id)}/schedule`, body: params, idempotent: true }, options);
	}

	/**
	 * Marcar pagada una factura de proveedor
	 *
	 * El pago que hizo su ERP o su banco, como «Marcar pagada» en la app: el proveedor lo ve, y si es PPD le pedimos su complemento de pago. Llega supplier_invoice.paid.
	 *
	 * POST /v1/supplier_invoices/{id}/mark_paid
	 * @see https://fiscalisto.com/docs/api/referencia/portal-de-proveedores/mark-supplier-invoice-paid
	 */
	markPaid(id: string, params: MarkSupplierInvoicePaidParams, options?: RequestOptions): Promise<SupplierInvoice> {
		return this.#client.request({ method: "POST", path: `/v1/supplier_invoices/${encodeURIComponent(id)}/mark_paid`, body: params, idempotent: true }, options);
	}
}

/** Declaraciones del SAT: fiscalisto.satDeclarations. */
export class SatDeclarationsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Consultar las declaraciones de un emisor en el SAT
	 *
	 * Entra al SAT con la e.firma guardada del emisor y trae las declaraciones que presentó: provisionales o definitivas (desde 2022), la anual de persona moral (desde 2019) y las del servicio anterior Declaraciones y pagos, con su PDF, su acuse y sus cifras. La primera consulta trae todos los años que el SAT conserva; las siguientes, este año y el anterior. Solo consulta: nunca presenta ni firma nada. En producción usa 1 timbre por consulta y se puede hacer una vez cada 10 minutos por emisor. Contesta 202 en cuanto la acepta (status processing) y consulta al SAT en segundo plano: sat_refresh.completed o sat_refresh.failed dicen cómo terminó, y GET /v1/sat_refreshes/{id} también. Su timbre se aparta al aceptarla (sin timbres contesta 402 de inmediato), se usa cuando el SAT contesta y regresa si no contesta. Si al terminar queda algo por bajar (result.pending), sigue solo en la siguiente hora sin otro timbre. En pruebas no se le pregunta al SAT: trae declaraciones de ejemplo al instante (la consulta ya viene completed y también llega sat_refresh.completed).
	 *
	 * POST /v1/sat_declarations/refresh
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/refresh-sat-declarations
	 */
	refresh(params?: RefreshSatDeclarationsParams, options?: RequestOptions): Promise<SatRefresh> {
		return this.#client.request({ method: "POST", path: "/v1/sat_declarations/refresh", body: params, idempotent: true }, options);
	}

	/**
	 * Listar declaraciones del SAT
	 *
	 * Las declaraciones que trajeron sus consultas, del ejercicio y mes más recientes a los más antiguos (la anual antes de los meses de su año). No usa timbres.
	 *
	 * GET /v1/sat_declarations
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/list-sat-declarations
	 */
	list(params?: ListSatDeclarationsParams, options?: RequestOptions): List<SatDeclaration> {
		return this.#client.list({ path: "/v1/sat_declarations", query: params }, options);
	}

	/**
	 * Ver el año mes por mes
	 *
	 * Cada mes del ejercicio con sus obligaciones: presentada (con sus declaraciones), falta (venció y no la encontramos) o por presentar, con el día en que vence (el 17 del mes siguiente, o el día hábil siguiente, más los días por el sexto dígito del RFC). Se arma con lo que trajeron sus consultas; no usa timbres.
	 *
	 * GET /v1/sat_declarations/calendar
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration-calendar
	 */
	calendar(params?: GetSatDeclarationCalendarParams, options?: RequestOptions): Promise<SatDeclarationCalendar> {
		return this.#client.request({ method: "GET", path: "/v1/sat_declarations/calendar", query: params }, options);
	}

	/**
	 * Ver la precarga de la anual de una persona física
	 *
	 * Lo que el SAT precargará en la declaración anual de un emisor persona física, de sus visores: los sueldos o asimilados y el ISR que le retuvieron, por patrón, y las deducciones personales que toma de sus facturas, con las que podrían deducirse y no toma, y por qué. Se lee con la e.firma en cada consulta (POST /v1/sat_declarations/refresh), del ejercicio anterior y del actual; no usa timbres. Un emisor persona moral recibe parameter_invalid.
	 *
	 * GET /v1/sat_declarations/annual_preload
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-annual-preload
	 */
	annualPreload(params?: GetSatAnnualPreloadParams, options?: RequestOptions): Promise<SatAnnualPreload> {
		return this.#client.request({ method: "GET", path: "/v1/sat_declarations/annual_preload", query: params }, options);
	}

	/**
	 * Ver una declaración del SAT
	 *
	 * Una declaración presentada al SAT, con sus cifras en summary y si ya están su PDF y su acuse.
	 *
	 * GET /v1/sat_declarations/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration
	 */
	get(id: string, options?: RequestOptions): Promise<SatDeclaration> {
		return this.#client.request({ method: "GET", path: `/v1/sat_declarations/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Descargar el PDF de una declaración
	 *
	 * La declaración como la da el SAT. No usa timbres.
	 *
	 * GET /v1/sat_declarations/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration-pdf
	 */
	pdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sat_declarations/${encodeURIComponent(id)}/pdf`, as: "bytes" }, options);
	}

	/**
	 * Descargar el acuse de una declaración
	 *
	 * El acuse de recibo, con la línea de captura si hay algo a pagar. No usa timbres.
	 *
	 * GET /v1/sat_declarations/{id}/receipt
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration-receipt
	 */
	receipt(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sat_declarations/${encodeURIComponent(id)}/receipt`, as: "bytes" }, options);
	}

	/**
	 * Descargar el registro del pago de una declaración
	 *
	 * La «Información registrada de pagos de contribuciones federales» de una declaración mensual pagada, como la da el SAT: el banco, el día, el importe, el número de operación del banco y la llave de pago. Existe cuando payment.status es paid. No usa timbres.
	 *
	 * GET /v1/sat_declarations/{id}/payment_record
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration-payment-record
	 */
	paymentRecord(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sat_declarations/${encodeURIComponent(id)}/payment_record`, as: "bytes" }, options);
	}

	/**
	 * Descargar los estados financieros de una anual
	 *
	 * El Excel de estados financieros de la anual de persona moral, como lo da el SAT. No usa timbres.
	 *
	 * GET /v1/sat_declarations/{id}/financial_statements
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-declaration-financial-statements
	 */
	financialStatements(id: string, options?: RequestOptions): Promise<string> {
		return this.#client.request({ method: "GET", path: `/v1/sat_declarations/${encodeURIComponent(id)}/financial_statements`, as: "text" }, options);
	}
}

/** Declaraciones del SAT: fiscalisto.satRefreshes. */
export class SatRefreshesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar consultas al SAT
	 *
	 * Las consultas al SAT que pidió (declaraciones, opinión de cumplimiento, constancia y buzón), de la más reciente a la más antigua, con cómo van. No usa timbres.
	 *
	 * GET /v1/sat_refreshes
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/list-sat-refreshes
	 */
	list(params?: ListSatRefreshesParams, options?: RequestOptions): List<SatRefresh> {
		return this.#client.list({ path: "/v1/sat_refreshes", query: params }, options);
	}

	/**
	 * Ver una consulta al SAT
	 *
	 * Cómo va una consulta al SAT (srf_…): processing mientras se consulta, completed con lo que trajo en result o failed con el motivo en error (su timbre regresó). No usa timbres.
	 *
	 * GET /v1/sat_refreshes/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/declaraciones-del-sat/get-sat-refresh
	 */
	get(id: string, options?: RequestOptions): Promise<SatRefresh> {
		return this.#client.request({ method: "GET", path: `/v1/sat_refreshes/${encodeURIComponent(id)}` }, options);
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
	 * Una venta que su comprador factura él mismo: con el código (code) y el total en el portal del emisor (url, que puede incrustar en su página con fiscalisto.js), da sus datos fiscales y la factura se timbra al momento con los timbres de su cuenta. Lo que nadie factura entra solo en la factura global del periodo. Registrar otra vez el mismo folio con el mismo total contesta el ticket que ya existe (los reintentos son seguros); con otro total, 409. Una venta de varios conceptos (el folio de un hotel) va en lines, cada uno con su clave SAT, descripción, impuestos y monto.
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
	 * Un ticket de autofactura: si ya se facturó (invoice) o entró en la factura global (global_invoice).
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
	 * Las pólizas de diario del mes, con sus cuentas y código agrupador del SAT: una por cada CFDI de ingreso o egreso vigente, emitido o recibido (los recibidos con la categoría de su gasto); una por cada pago de un complemento; una por cada recibo de nómina; una con la depreciación de los activos fijos; una por cada venta o baja de un activo, y las capturadas a mano (POST /v1/accounting/manual_entries) con las reversiones de sus provisiones. Un PUE se registra cobrado o pagado según su forma de pago. En pesos; un CFDI en otra moneda sin tipo de cambio no se registra. No incluye movimientos de banco sin CFDI.
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
	 * Saldo inicial, cargos, abonos y saldo final de cada cuenta en el mes. Los saldos iniciales se acumulan desde el primer CFDI, o desde los saldos iniciales capturados en la app (las de resultados, desde enero), y los resultados de cada año anterior se cierran a capital.
	 *
	 * GET /v1/accounting/trial_balance
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-trial-balance
	 */
	trialBalance(params: GetTrialBalanceParams, options?: RequestOptions): Promise<TrialBalance> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/trial_balance", query: params }, options);
	}

	/**
	 * Ver el auxiliar de cuentas
	 *
	 * El libro mayor de un periodo de hasta 12 meses: el saldo inicial de cada cuenta, cada cargo y abono con su póliza (journal_entry, el mismo id de journal_entries), su CFDI y el saldo que deja, y el saldo final. Solo las cuentas que se movieron, o la que pida con account aunque no tenga movimientos. Una cuenta que no está en el catálogo contesta account_missing.
	 *
	 * GET /v1/accounting/general_ledger
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-general-ledger
	 */
	generalLedger(params: GetGeneralLedgerParams, options?: RequestOptions): Promise<GeneralLedger> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/general_ledger", query: params }, options);
	}

	/**
	 * Ver los estados financieros
	 *
	 * El estado de resultados (del mes y del año hasta ese mes) y el balance general al cierre del mes, leídos de la misma balanza, así que siempre suman las mismas pólizas.
	 *
	 * GET /v1/accounting/financial_statements
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-financial-statements
	 */
	financialStatements(params: GetFinancialStatementsParams, options?: RequestOptions): Promise<FinancialStatements> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/financial_statements", query: params }, options);
	}

	/**
	 * Cruzar lo declarado con lo facturado
	 *
	 * Cada mes ya vencido del año: el IVA trasladado, acreditable y retenido y los ingresos para ISR que el emisor declaró (de GET /v1/sat_declarations, después de POST /v1/sat_declarations/refresh) contra lo que dicen sus CFDI. Hasta $2 de diferencia es redondeo (las declaraciones van en pesos enteros). Una cifra que la declaración no trae en un renglón reconocible es unreadable con declared null, nunca 0. También el IVA a favor y el régimen con que factura. Gratis: no consulta al SAT.
	 *
	 * GET /v1/accounting/cross_checks
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-cross-checks
	 */
	crossChecks(params?: GetCrossChecksParams, options?: RequestOptions): Promise<CrossChecks> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/cross_checks", query: params }, options);
	}

	/**
	 * Ver el IVA a favor y preparar su devolución
	 *
	 * El IVA a favor de cada mes de los últimos cinco años (de las declaraciones leídas con POST /v1/sat_declarations/refresh o, sin ellas, de sus CFDI, con estimated en true), cuánto se acreditó después (del saldo más antiguo primero), cuánto queda, qué está en devolución y cuándo prescribe. Con `month`, la revisión de ese mes antes de pedirlo en el SAT: declaración, cruce con CFDI, DIOT, opinión de cumplimiento, Buzón Tributario, e.firma, listas del SAT, CFDI de proveedores con hallazgos y CLABE, con el monto a pedir. No presenta nada en el SAT. Gratis.
	 *
	 * GET /v1/accounting/vat_refund
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-vat-refund
	 */
	vatRefund(params?: GetVatRefundParams, options?: RequestOptions): Promise<VatRefund> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/vat_refund", query: params }, options);
	}

	/**
	 * Ver los CFDI de una cifra del cruce
	 *
	 * Los CFDI que forman lo facturado (invoiced) de una cifra del cruce de un mes, con los mismos cálculos de Impuestos: cada factura PUE o nota de crédito en su mes y cada factura PPD por lo que se pagó en el mes, con lo que aporta. La suma de cfdi más adjustment es invoiced. Sirve para ver por qué una cifra differs: con una diferencia, explanation trae los CFDI cuya combinación la suma (cancelados después, PPD sin cobro en el mes, de los días vecinos de otro mes, notas de crédito, cobros de PPD, repetidos o no declarados) y las posibles causas. Gratis: no consulta al SAT.
	 *
	 * GET /v1/accounting/cross_checks/cfdi
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-cross-check-cfdi
	 */
	crossCheckCfdi(params: GetCrossCheckCfdiParams, options?: RequestOptions): Promise<CrossCheckCfdi> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/cross_checks/cfdi", query: params }, options);
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
	 * Agregar una cuenta al catálogo
	 *
	 * Una cuenta propia del emisor, para sus pólizas a mano: su número (que no se repite), su nombre y una subcuenta del código agrupador del SAT. Entra al catálogo de la contabilidad electrónica.
	 *
	 * POST /v1/accounting/accounts
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-ledger-account
	 */
	createAccount(params: CreateLedgerAccountParams, options?: RequestOptions): Promise<LedgerAccount> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/accounts", body: params, idempotent: true }, options);
	}

	/**
	 * Descargar la contabilidad electrónica
	 *
	 * El ZIP del mes para el Buzón Tributario: el catálogo (CT) y la balanza (BN, o BC si es complementaria), cada uno en su ZIP con el nombre que espera el SAT, en el formato 1.3 del Anexo 24. Con journal_request, también las pólizas (PL), que se entregan cuando el SAT las pide. Con month AAAA-13, la balanza de comprobación ajustada al cierre del ejercicio (regla 2.8.1.6 RMF): solo la balanza, con los saldos finales de diciembre como saldos iniciales y, con closing_entry, la póliza de cierre.
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

/** Contabilidad: fiscalisto.manualEntries. */
export class ManualEntriesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Capturar una póliza
	 *
	 * Una póliza a mano: un ajuste, una provisión (reverse_next_month la revierte el día 1 del mes siguiente), una reclasificación. Cada renglón lleva una cuenta del catálogo por su número y un cargo o un abono; si no cuadran contesta entry_unbalanced, y una cuenta que no existe, account_missing. Entra a journal_entries, trial_balance, financial_statements y electronic_accounting de su mes. No puede ser antes de los saldos iniciales.
	 *
	 * POST /v1/accounting/manual_entries
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-manual-entry
	 */
	create(params: CreateManualEntryParams, options?: RequestOptions): Promise<ManualJournalEntry> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/manual_entries", body: params, idempotent: true }, options);
	}

	/**
	 * Listar las pólizas capturadas
	 *
	 * Las pólizas capturadas a mano del emisor, las más recientes primero.
	 *
	 * GET /v1/accounting/manual_entries
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-manual-entries
	 */
	list(params?: ListManualEntriesParams, options?: RequestOptions): List<ManualJournalEntry> {
		return this.#client.list({ path: "/v1/accounting/manual_entries", query: params }, options);
	}

	/**
	 * Ver una póliza capturada
	 *
	 * Una póliza capturada a mano.
	 *
	 * GET /v1/accounting/manual_entries/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-manual-entry
	 */
	get(id: string, options?: RequestOptions): Promise<ManualJournalEntry> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/manual_entries/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Corregir una póliza capturada
	 *
	 * La reemplaza con lo que manda, con las mismas reglas que al capturarla.
	 *
	 * POST /v1/accounting/manual_entries/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/update-manual-entry
	 */
	update(id: string, params: UpdateManualEntryParams, options?: RequestOptions): Promise<ManualJournalEntry> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/manual_entries/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar una póliza capturada
	 *
	 * Sale de la contabilidad con su reversión, si tenía.
	 *
	 * DELETE /v1/accounting/manual_entries/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-manual-entry
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/manual_entries/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Importar pólizas de otro sistema
	 *
	 * Hasta 3,000 pólizas de una vez (las de CONTPAQi, COI o una hoja de cálculo), todas o ninguna: cada una con las reglas de POST /v1/accounting/manual_entries, y el error dice cuál (param entries[i].…). Entran como kind other. Una con el mismo number, fecha, tipo y total que una ya importada se salta (duplicates). DELETE /v1/accounting/manual_entry_imports/{id} quita las de una importación.
	 *
	 * POST /v1/accounting/manual_entry_imports
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/import-manual-entries
	 */
	importEntries(params: ImportManualEntriesParams, options?: RequestOptions): Promise<ManualEntryImport> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/manual_entry_imports", body: params, idempotent: true }, options);
	}

	/**
	 * Deshacer una importación de pólizas
	 *
	 * Borra todas las pólizas que trajo esa importación (mji_…). No se puede si alguna es de un mes cerrado (period_closed).
	 *
	 * DELETE /v1/accounting/manual_entry_imports/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/undo-manual-entries-import
	 */
	undoImport(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/manual_entry_imports/${encodeURIComponent(id)}` }, options);
	}
}

/** Contabilidad: fiscalisto.openingBalances. */
export class OpeningBalancesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver los saldos iniciales
	 *
	 * Los saldos de cada cuenta con los que empiezan los libros del emisor (date), como Estados financieros › Saldos iniciales en la app. Sin saldos iniciales, date es null.
	 *
	 * GET /v1/accounting/opening_balances
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-opening-balances
	 */
	get(params?: GetOpeningBalancesParams, options?: RequestOptions): Promise<OpeningBalances> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/opening_balances", query: params }, options);
	}

	/**
	 * Guardar los saldos iniciales
	 *
	 * Reemplaza los saldos iniciales: el día 1 del mes en que empiezan sus libros y el saldo deudor o acreedor de cada cuenta (por su número); las dos columnas suman lo mismo o contesta entry_unbalanced. Son los saldos finales de la balanza de su sistema anterior. Sin renglones, los borra. Nada antes de esa fecha cuenta.
	 *
	 * POST /v1/accounting/opening_balances
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/set-opening-balances
	 */
	set(params: SetOpeningBalancesParams, options?: RequestOptions): Promise<OpeningBalances> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/opening_balances", body: params, idempotent: true }, options);
	}
}

/** Contabilidad: fiscalisto.fixedAssets. */
export class FixedAssetsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar los activos fijos
	 *
	 * Los activos fijos del emisor al cierre de un mes: los que llegaron con una factura recibida de uso I01 a I08 (fxc_…) y los capturados sin ella (fxa_…), con su depreciación mensual y acumulada y su valor en libros.
	 *
	 * GET /v1/accounting/fixed_assets
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-fixed-assets
	 */
	list(params?: ListFixedAssetsParams, options?: RequestOptions): Promise<FixedAssetList> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/fixed_assets", query: params }, options);
	}

	/**
	 * Agregar un activo fijo sin factura
	 *
	 * Uno que compró antes de usar Fiscalisto o cuya factura no está aquí. Se deprecia cada mes desde el siguiente a in_use_since, en la contabilidad y en el cálculo del ISR. Su costo no entra solo a los libros: va en los saldos iniciales o en una póliza (POST /v1/accounting/manual_entries).
	 *
	 * POST /v1/accounting/fixed_assets
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-fixed-asset
	 */
	create(params: CreateFixedAssetParams, options?: RequestOptions): Promise<FixedAsset> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/fixed_assets", body: params, idempotent: true }, options);
	}

	/**
	 * Ver un activo fijo
	 *
	 * Un activo fijo, con sus cifras al cierre del mes actual.
	 *
	 * GET /v1/accounting/fixed_assets/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-fixed-asset
	 */
	get(id: string, options?: RequestOptions): Promise<FixedAsset> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/fixed_assets/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Borrar un activo fijo capturado
	 *
	 * Solo uno capturado sin factura (fxa_…); uno con CFDI contesta asset_from_cfdi: véndalo o dele de baja.
	 *
	 * DELETE /v1/accounting/fixed_assets/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-fixed-asset
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/fixed_assets/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Vender o dar de baja un activo fijo
	 *
	 * Deja de depreciarse el mes de date, y ese día una póliza (asset_disposal) cancela el activo y su depreciación acumulada; su valor en libros va a pérdida en venta o baja (703). El ingreso de una venta entra con la factura que emita. Uno ya dado de baja contesta asset_already_disposed.
	 *
	 * POST /v1/accounting/fixed_assets/{id}/dispose
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/dispose-fixed-asset
	 */
	dispose(id: string, params: DisposeFixedAssetParams, options?: RequestOptions): Promise<FixedAsset> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/fixed_assets/${encodeURIComponent(id)}/dispose`, body: params, idempotent: true }, options);
	}

	/**
	 * Deshacer la baja de un activo fijo
	 *
	 * El activo vuelve a depreciarse como si nunca se hubiera dado de baja.
	 *
	 * DELETE /v1/accounting/fixed_assets/{id}/disposal
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/undispose-fixed-asset
	 */
	undispose(id: string, options?: RequestOptions): Promise<FixedAsset> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/fixed_assets/${encodeURIComponent(id)}/disposal` }, options);
	}
}

/** Contabilidad: fiscalisto.closedPeriod. */
export class ClosedPeriodResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver hasta qué mes está cerrada la contabilidad
	 *
	 * El último mes cerrado del emisor (closed_through), como Cierre del mes › Cerrar la contabilidad en la app.
	 *
	 * GET /v1/accounting/closed_period
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-closed-period
	 */
	get(params?: GetClosedPeriodParams, options?: RequestOptions): Promise<ClosedPeriod> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/closed_period", query: params }, options);
	}

	/**
	 * Cerrar o reabrir meses de la contabilidad
	 *
	 * Cierra la contabilidad hasta closed_through (y los meses anteriores), o la reabre con un mes anterior o null. En un mes cerrado, crear, corregir o borrar una póliza a mano, registrar o quitar la póliza de un movimiento de banco y dar de baja un activo contestan period_closed. Las facturas siguen llegando del SAT.
	 *
	 * POST /v1/accounting/closed_period
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/set-closed-period
	 */
	set(params: SetClosedPeriodParams, options?: RequestOptions): Promise<ClosedPeriod> {
		return this.#client.request({ method: "POST", path: "/v1/accounting/closed_period", body: params, idempotent: true }, options);
	}
}

/** Contabilidad: fiscalisto.fxRevaluations. */
export class FxRevaluationsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver la revaluación cambiaria de un mes
	 *
	 * Las facturas PPD en otra moneda que seguían pendientes al cierre del mes, lo pendiente por moneda con el tipo de cambio de cierre que sugerimos (el FIX del DOF) y la póliza de revaluación, si ya se registró. Como Cierre del mes › Revaluación cambiaria en la app.
	 *
	 * GET /v1/accounting/fx_revaluations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-fx-revaluation
	 */
	get(month: string, params?: GetFxRevaluationParams, options?: RequestOptions): Promise<FxRevaluation> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/fx_revaluations/${encodeURIComponent(month)}`, query: params }, options);
	}

	/**
	 * Registrar la revaluación cambiaria de un mes
	 *
	 * Registra (o reemplaza) la póliza de ajuste del último día del mes que lleva lo pendiente en otra moneda al tipo de cambio de cierre (rates): Clientes contra Utilidad o Pérdida cambiaria, y Proveedores contra Pérdida o Utilidad cambiaria. Se revierte sola el día 1 del mes siguiente, para que cada pago siga calculando su diferencia cambiaria desde el tipo de cambio de la factura. Sin facturas pendientes, o sin diferencia a esos tipos de cambio, contesta parameter_invalid en month; en un mes cerrado, period_closed.
	 *
	 * POST /v1/accounting/fx_revaluations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-fx-revaluation
	 */
	create(month: string, params: CreateFxRevaluationParams, options?: RequestOptions): Promise<FxRevaluation> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/fx_revaluations/${encodeURIComponent(month)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar la revaluación cambiaria de un mes
	 *
	 * Quita la póliza de revaluación del mes y su reversión. En un mes cerrado contesta period_closed.
	 *
	 * DELETE /v1/accounting/fx_revaluations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-fx-revaluation
	 */
	delete(month: string, params?: DeleteFxRevaluationParams, options?: RequestOptions): Promise<FxRevaluation> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/fx_revaluations/${encodeURIComponent(month)}`, query: params }, options);
	}
}

/** Contabilidad: fiscalisto.costOfSales. */
export class CostOfSalesResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver el costo de ventas de un mes
	 *
	 * Las compras netas del mes según sus pólizas, el inventario en libros, lo que vale el inventario según Inventario y la póliza de costo de ventas, si ya se registró. Como Cierre del mes › Inventario y costo de ventas en la app.
	 *
	 * GET /v1/accounting/cost_of_sales/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-cost-of-sales
	 */
	get(month: string, params?: GetCostOfSalesParams, options?: RequestOptions): Promise<CostOfSales> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/cost_of_sales/${encodeURIComponent(month)}`, query: params }, options);
	}

	/**
	 * Registrar el costo de ventas de un mes
	 *
	 * Registra (o reemplaza) la póliza del último día del mes en el sistema de inventarios periódico: Inventario queda en ending_inventory, las compras (502) y sus devoluciones (503) se cancelan y la diferencia va a Costo de ventas (501.01): inventario inicial + compras netas − inventario final, el costo de lo vendido que se deduce (LISR arts. 25-II y 39). Sin compras ni cambio de inventario contesta parameter_invalid en month; en un mes cerrado, period_closed.
	 *
	 * POST /v1/accounting/cost_of_sales/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-cost-of-sales
	 */
	create(month: string, params: CreateCostOfSalesParams, options?: RequestOptions): Promise<CostOfSales> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/cost_of_sales/${encodeURIComponent(month)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar el costo de ventas de un mes
	 *
	 * Quita la póliza de costo de ventas del mes. En un mes cerrado contesta period_closed.
	 *
	 * DELETE /v1/accounting/cost_of_sales/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-cost-of-sales
	 */
	delete(month: string, params?: DeleteCostOfSalesParams, options?: RequestOptions): Promise<CostOfSales> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/cost_of_sales/${encodeURIComponent(month)}`, query: params }, options);
	}
}

/** Contabilidad: fiscalisto.budgets. */
export class BudgetsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver el presupuesto de un año contra lo real
	 *
	 * El presupuesto del año por cuenta de resultados y mes, y la comparación con lo real de sus pólizas: el mes y de enero a ese mes, con la variación, su porcentaje y si es favorable (deja más utilidad que lo planeado). Con cost_center, el presupuesto y lo real de ese centro de costo; sin él, de toda la empresa. Como Estados financieros › Presupuesto en la app.
	 *
	 * GET /v1/accounting/budgets/{year}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-budget
	 */
	get(year: string, params?: GetBudgetParams, options?: RequestOptions): Promise<Budget> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/budgets/${encodeURIComponent(year)}`, query: params }, options);
	}

	/**
	 * Guardar el presupuesto de un año
	 *
	 * Reemplaza el presupuesto del año (de toda la empresa, o del centro de costo de cost_center) con las cuentas que mande: cada una con sus 12 meses en la naturaleza de la cuenta. Solo cuentas de resultados (códigos agrupadores 4 a 7); una cuenta dos veces contesta parameter_invalid en lines. Una lista vacía borra el presupuesto.
	 *
	 * POST /v1/accounting/budgets/{year}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/save-budget
	 */
	save(year: string, params: SaveBudgetParams, options?: RequestOptions): Promise<Budget> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/budgets/${encodeURIComponent(year)}`, body: params, idempotent: true }, options);
	}
}

/** Contabilidad: fiscalisto.costCenterResults. */
export class CostCenterResultsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver el estado de resultados por centro de costo
	 *
	 * Lo que cada centro de costo dejó de utilidad en el mes y de enero a ese mes: sus ingresos, costo de ventas, gastos y otros, de las facturas que se le pusieron (POST /v1/cost_centers/{id}/invoices) y de los renglones de póliza a mano que lo llevan (lines[].cost_center). Lo que no tiene centro va con cost_center null; todos suman el estado de resultados de la empresa.
	 *
	 * GET /v1/accounting/cost_center_results/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-cost-center-results
	 */
	get(month: string, params?: GetCostCenterResultsParams, options?: RequestOptions): Promise<CostCenterResults> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/cost_center_results/${encodeURIComponent(month)}`, query: params }, options);
	}
}

/** Contabilidad: fiscalisto.payrollProvisions. */
export class PayrollProvisionsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver las cuotas patronales de un mes
	 *
	 * Lo que la empresa debe al IMSS, al SAR y al Infonavit por los días del mes, calculado de sus recibos de nómina timbrados (su salario base de cotización y sus días, con faltas e incapacidades como dice la Ley del Seguro Social), el impuesto sobre nómina del mes y la póliza de provisión, si ya se registró. Como Cierre del mes › Cuotas patronales del mes en la app. Se calcula con las tasas de 2026; otro año contesta parameter_invalid en month.
	 *
	 * GET /v1/accounting/payroll_provisions/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-payroll-provision
	 */
	get(month: string, params?: GetPayrollProvisionParams, options?: RequestOptions): Promise<PayrollProvision> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/payroll_provisions/${encodeURIComponent(month)}`, query: params }, options);
	}

	/**
	 * Registrar las cuotas patronales de un mes
	 *
	 * Registra (o reemplaza) la provisión del último día del mes: Cuotas patronales al IMSS (601.26), Aportaciones patronales al Infonavit (601.27), al SAR (601.28) e Impuesto sobre nómina (601.29) contra IMSS, SAR e Infonavit por pagar (211.01 a 211.03) e Impuesto sobre nómina por pagar (213.04). Los importes que mande reemplazan los calculados; employer_risk_premium se guarda para los meses siguientes. Al pagarlos, registre el retiro del banco contra esas cuentas. Sin recibos ni importes contesta parameter_invalid en month; en un mes cerrado, period_closed.
	 *
	 * POST /v1/accounting/payroll_provisions/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-payroll-provision
	 */
	create(month: string, params?: CreatePayrollProvisionParams, options?: RequestOptions): Promise<PayrollProvision> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/payroll_provisions/${encodeURIComponent(month)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar las cuotas patronales de un mes
	 *
	 * Quita la póliza de provisión del mes. En un mes cerrado contesta period_closed.
	 *
	 * DELETE /v1/accounting/payroll_provisions/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-payroll-provision
	 */
	delete(month: string, params?: DeletePayrollProvisionParams, options?: RequestOptions): Promise<PayrollProvision> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/payroll_provisions/${encodeURIComponent(month)}`, query: params }, options);
	}
}

/** Contabilidad: fiscalisto.taxDeterminations. */
export class TaxDeterminationsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Ver la determinación de impuestos de un mes
	 *
	 * El IVA cobrado y pagado del mes según sus pólizas (y el que le retuvieron sus clientes), el IVA por pagar o a favor que resulta, el pago provisional de ISR que sugiere Impuestos y la póliza de determinación, si ya se registró. Como Cierre del mes › Impuestos del mes en la app.
	 *
	 * GET /v1/accounting/tax_determinations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/get-tax-determination
	 */
	get(month: string, params?: GetTaxDeterminationParams, options?: RequestOptions): Promise<TaxDetermination> {
		return this.#client.request({ method: "GET", path: `/v1/accounting/tax_determinations/${encodeURIComponent(month)}`, query: params }, options);
	}

	/**
	 * Registrar la determinación de impuestos de un mes
	 *
	 * Registra (o reemplaza) la póliza del último día del mes: IVA trasladado cobrado contra IVA acreditable pagado y el IVA retenido por clientes, la diferencia a IVA por pagar o IVA a favor, e isr a Pagos provisionales de ISR contra ISR por pagar. Al pagarlos, registre el retiro del banco contra esas cuentas (POST /v1/accounting/bank_movements/{id}/post). Sin IVA ni ISR contesta parameter_invalid en month; en un mes cerrado, period_closed.
	 *
	 * POST /v1/accounting/tax_determinations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/create-tax-determination
	 */
	create(month: string, params: CreateTaxDeterminationParams, options?: RequestOptions): Promise<TaxDetermination> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/tax_determinations/${encodeURIComponent(month)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar la determinación de impuestos de un mes
	 *
	 * Quita la póliza de determinación del mes. En un mes cerrado contesta period_closed.
	 *
	 * DELETE /v1/accounting/tax_determinations/{month}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/delete-tax-determination
	 */
	delete(month: string, params?: DeleteTaxDeterminationParams, options?: RequestOptions): Promise<TaxDetermination> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/tax_determinations/${encodeURIComponent(month)}`, query: params }, options);
	}
}

/** Contabilidad: fiscalisto.ledgerBankAccounts. */
export class LedgerBankAccountsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar las cuentas de banco de la contabilidad
	 *
	 * Las cuentas de banco del emisor que la contabilidad lleva aparte, cada una su propia subcuenta de Bancos (102-01-<últimos 4>): las de sus cuentas bancarias y las que ya tienen pólizas. Lo que la conciliación identifica en el estado de cuenta (depósitos ligados a su CFDI, retiros marcados como pago de facturas) pasa de Bancos a esa cuenta; lo que ningún estado de cuenta explica se queda en Bancos.
	 *
	 * GET /v1/accounting/bank_accounts
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-ledger-bank-accounts
	 */
	list(params?: ListLedgerBankAccountsParams, options?: RequestOptions): Promise<LedgerBankAccountList> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/bank_accounts", query: params }, options);
	}

	/**
	 * Cambiar la moneda de una cuenta de banco
	 *
	 * Cambia la moneda (y el nombre) de una cuenta de banco de la contabilidad, por sus últimos 4 dígitos. Una cuenta en otra moneda se revalúa en las revaluaciones cambiarias con el saldo de su último estado de cuenta.
	 *
	 * POST /v1/accounting/bank_accounts/{last_four}
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/update-ledger-bank-account
	 */
	update(last_four: string, params: UpdateLedgerBankAccountParams, options?: RequestOptions): Promise<LedgerBankAccount> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/bank_accounts/${encodeURIComponent(last_four)}`, body: params, idempotent: true }, options);
	}
}

/** Contabilidad: fiscalisto.bankMovements. */
export class BankMovementsResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Listar los movimientos de banco sin factura
	 *
	 * Los movimientos de banco de un mes que ninguna factura explica: los retiros de los estados de cuenta importados en la conciliación (comisiones, impuestos, pagos de préstamos, traspasos) y los depósitos que ahí se clasificaron como préstamo, traspaso o devolución. Cada uno con su póliza, si ya se registró, y la cuenta sugerida. Lo que pagó o cobró una factura ya está en la contabilidad por su CFDI.
	 *
	 * GET /v1/accounting/bank_movements
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/list-bank-movements
	 */
	list(params?: ListBankMovementsParams, options?: RequestOptions): Promise<AccountingBankMovementList> {
		return this.#client.request({ method: "GET", path: "/v1/accounting/bank_movements", query: params }, options);
	}

	/**
	 * Registrar un movimiento de banco
	 *
	 * Le hace su póliza con fecha del movimiento: de ingresos (Bancos contra account) a un depósito, de egresos (account contra Bancos) a un retiro. Entra a la balanza, el auxiliar y la contabilidad electrónica como cualquier póliza capturada (manual_entry). Uno ya registrado contesta bank_movement_posted; un depósito sin clasificar o un retiro marcado, bank_movement_not_bookable.
	 *
	 * POST /v1/accounting/bank_movements/{id}/post
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/post-bank-movement
	 */
	post(id: string, params: PostBankMovementParams, options?: RequestOptions): Promise<AccountingBankMovement> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/bank_movements/${encodeURIComponent(id)}/post`, body: params, idempotent: true }, options);
	}

	/**
	 * Quitar la póliza de un movimiento de banco
	 *
	 * Su póliza sale de la contabilidad y el movimiento vuelve a pending. Sin póliza contesta bank_movement_not_posted.
	 *
	 * DELETE /v1/accounting/bank_movements/{id}/post
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/unpost-bank-movement
	 */
	unpost(id: string, options?: RequestOptions): Promise<AccountingBankMovement> {
		return this.#client.request({ method: "DELETE", path: `/v1/accounting/bank_movements/${encodeURIComponent(id)}/post` }, options);
	}

	/**
	 * Marcar un retiro
	 *
	 * paid_invoices: pagó facturas que ya están en la contabilidad por su CFDI; ignored: no se registra; pending: vuelve a por registrar. Solo retiros sin póliza.
	 *
	 * POST /v1/accounting/bank_movements/{id}/mark
	 * @see https://fiscalisto.com/docs/api/referencia/contabilidad/mark-bank-movement
	 */
	mark(id: string, params: MarkBankMovementParams, options?: RequestOptions): Promise<AccountingBankMovement> {
		return this.#client.request({ method: "POST", path: `/v1/accounting/bank_movements/${encodeURIComponent(id)}/mark`, body: params, idempotent: true }, options);
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
	 * Shopify: con el dominio y las llaves de la app de la tienda (Dev Dashboard, permisos read_orders y write_orders) registra los webhooks y queda active. WooCommerce: con la dirección de la tienda y una llave de su API REST de Lectura/Escritura, igual. Mercado Libre, Tiendanube y Amazon: queda pending hasta que el vendedor autorice en authorize_url (Amazon no tiene webhooks: sus pedidos se leen cada hora). Desde entonces cada pedido pagado es un ticket (folio SHOP-1001, WEB-1001, TN-1001, ML-… o AMZ-…), que su comprador factura en el portal o entra en la factura global; un pedido cancelado o reembolsado completo cancela su ticket.
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
	 * Una tienda conectada (Shopify, Mercado Libre o WooCommerce), su estado y lo último que importó.
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
	 * Una factura recurrente: su calendario, la próxima fecha, la última factura que timbró y, si falló, por qué en last_error.
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
	 * Solo lo que mande cambia. Un borrador cambia ahí mismo; una que ya se envió (también si venció, se rechazó o se retiró) se vuelve una versión nueva en borrador (mismo número, version + 1) que el cliente ve al mandarla; mientras, su liga muestra la anterior. Una aceptada o facturada ya no cambia.
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
	 * Borra la cotización con todas sus versiones; si ya se envió, su url deja de funcionar. Una aceptada o facturada no se borra: 400 quote_not_deletable. Para cerrarla sin borrarla, POST /v1/quotes/{id}/withdraw.
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
	 * Retirar una cotización
	 *
	 * Usted ya no la ofrece: su liga dice que se retiró y el cliente ya no la puede aceptar (status withdrawn, decided_by user). Llega quote.withdrawn. Para ofrecerla de nuevo, cámbiela con POST /v1/quotes/{id} (una versión nueva) y mándela. Una que nunca se envió se borra: 400 quote_not_sent.
	 *
	 * POST /v1/quotes/{id}/withdraw
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/withdraw-quote
	 */
	withdraw(id: string, params?: WithdrawQuoteParams, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}/withdraw`, body: params, idempotent: true }, options);
	}

	/**
	 * Marcar rechazada
	 *
	 * El cliente le dijo que no por teléfono, en persona… (status rejected, decided_by user; su nota en customer_comment). Llega quote.rejected. También para una vencida que ya no va a seguir.
	 *
	 * POST /v1/quotes/{id}/reject
	 * @see https://fiscalisto.com/docs/api/referencia/cotizaciones/reject-quote
	 */
	reject(id: string, params?: RejectQuoteParams, options?: RequestOptions): Promise<Quote> {
		return this.#client.request({ method: "POST", path: `/v1/quotes/${encodeURIComponent(id)}/reject`, body: params, idempotent: true }, options);
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

/** Pedidos: fiscalisto.salesOrders. */
export class SalesOrdersResource {
	readonly #client: Client;
	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Crear un pedido
	 *
	 * Lo que su cliente le pidió, con los conceptos y las condiciones de pago de una factura (se revisan con las mismas reglas, así que cada factura que sale de él timbra). customer es un cliente de su catálogo o uno con sus datos fiscales (se agrega a sus clientes). Con quote (quo_…) lo hace de una cotización. Queda en draft, o confirmado con confirm: true (llega sales_order.confirmed y se aparta lo pedido en el almacén).
	 *
	 * POST /v1/sales_orders
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/create-sales-order
	 */
	create(params?: CreateSalesOrderParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: "/v1/sales_orders", body: params, idempotent: true }, options);
	}

	/**
	 * Listar pedidos
	 *
	 * Los más recientes primero.
	 *
	 * GET /v1/sales_orders
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/list-sales-orders
	 */
	list(params?: ListSalesOrdersParams, options?: RequestOptions): List<SalesOrder> {
		return this.#client.list({ path: "/v1/sales_orders", query: params }, options);
	}

	/**
	 * Ver un pedido
	 *
	 * Con sus entregas, sus facturas y lo que se ha pagado de ellas.
	 *
	 * GET /v1/sales_orders/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/get-sales-order
	 */
	get(id: string, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "GET", path: `/v1/sales_orders/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Cambiar un pedido
	 *
	 * Solo lo que mande cambia. Los conceptos cambian mientras no tengan entregas ni facturas; si no, 400 sales_order_invalid.
	 *
	 * POST /v1/sales_orders/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/update-sales-order
	 */
	update(id: string, params?: UpdateSalesOrderParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}`, body: params, idempotent: true }, options);
	}

	/**
	 * Borrar un pedido
	 *
	 * Solo un borrador. Uno confirmado se cancela con POST /v1/sales_orders/{id}/cancel: 400 sales_order_not_deletable.
	 *
	 * DELETE /v1/sales_orders/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/delete-sales-order
	 */
	delete(id: string, options?: RequestOptions): Promise<Deleted> {
		return this.#client.request({ method: "DELETE", path: `/v1/sales_orders/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Confirmar un pedido
	 *
	 * Es un pedido en firme: se aparta lo pedido en el almacén y ya se puede entregar y facturar. Llega sales_order.confirmed.
	 *
	 * POST /v1/sales_orders/{id}/confirm
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/confirm-sales-order
	 */
	confirm(id: string, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/confirm`, idempotent: true }, options);
	}

	/**
	 * Registrar una entrega
	 *
	 * Lo que salió, con su remisión (REM-1, REM-2…): la mercancía sale del almacén con la entrega, no con la factura. Por omisión, todo lo que falta. Si el emisor no vende sin existencias, no sale más de lo que hay (400 sales_order_invalid). Cuando ya salió todo llega sales_order.delivered.
	 *
	 * POST /v1/sales_orders/{id}/deliveries
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/create-sales-order-delivery
	 */
	deliver(id: string, params?: CreateSalesOrderDeliveryParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/deliveries`, body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar una entrega
	 *
	 * La mercancía regresa al almacén y lo entregado vuelve a quedar pendiente.
	 *
	 * POST /v1/sales_orders/{id}/deliveries/{delivery}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/cancel-sales-order-delivery
	 */
	cancelDelivery(id: string, delivery: string, params?: CancelSalesOrderDeliveryParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/deliveries/${encodeURIComponent(delivery)}/cancel`, body: params, idempotent: true }, options);
	}

	/**
	 * Facturar un pedido
	 *
	 * Timbra una factura con lo entregado y no facturado (o lo que diga items; con invoice_policy ordered, lo pedido), con los datos fiscales del cliente de hoy y la nota «Pedido PED-…» con su orden de compra. Se factura en varias partes: cada llamada, con su Idempotency-Key, timbra la que sigue. Si no queda nada, 400 sales_order_invalid. Cuando sus facturas se pagan llega sales_order.paid.
	 *
	 * POST /v1/sales_orders/{id}/invoice
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/invoice-sales-order
	 */
	invoice(id: string, params?: InvoiceSalesOrderParams, options?: RequestOptions): Promise<Invoice> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/invoice`, body: params, idempotent: true }, options);
	}

	/**
	 * Mandar un pedido
	 *
	 * Por correo, con su PDF y la liga donde su cliente lo confirma (llega sales_order.customer_confirmed), firma cada entrega y abre sus facturas. Con send_email: false solo contesta url. En borrador, 400 sales_order_draft.
	 *
	 * POST /v1/sales_orders/{id}/send
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/send-sales-order
	 */
	send(id: string, params?: SendSalesOrderParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/send`, body: params, idempotent: true }, options);
	}

	/**
	 * Ya no entregar lo pendiente
	 *
	 * El pedido se queda con lo ya entregado (lo demás pasa a canceled en cada concepto) y se libera lo apartado.
	 *
	 * POST /v1/sales_orders/{id}/cancel_remaining
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/cancel-sales-order-remaining
	 */
	cancelRemaining(id: string, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/cancel_remaining`, idempotent: true }, options);
	}

	/**
	 * Cerrar un pedido
	 *
	 * Lo da por terminado aunque quede algo pendiente, y libera lo apartado.
	 *
	 * POST /v1/sales_orders/{id}/close
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/close-sales-order
	 */
	close(id: string, params?: CloseSalesOrderParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/close`, body: params, idempotent: true }, options);
	}

	/**
	 * Cancelar un pedido
	 *
	 * Solo sin entregas ni facturas timbradas (cancele primero las entregas, y las facturas con POST /v1/invoices/{id}/cancel). Borra sus facturas en borrador y libera lo apartado. Llega sales_order.canceled.
	 *
	 * POST /v1/sales_orders/{id}/cancel
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/cancel-sales-order
	 */
	cancel(id: string, params?: CancelSalesOrderParams, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/cancel`, body: params, idempotent: true }, options);
	}

	/**
	 * Reabrir un pedido
	 *
	 * Uno cerrado o cancelado vuelve a estar abierto.
	 *
	 * POST /v1/sales_orders/{id}/reopen
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/reopen-sales-order
	 */
	reopen(id: string, options?: RequestOptions): Promise<SalesOrder> {
		return this.#client.request({ method: "POST", path: `/v1/sales_orders/${encodeURIComponent(id)}/reopen`, idempotent: true }, options);
	}

	/**
	 * Descargar el PDF
	 *
	 * El PDF del pedido, con el diseño de PDF del emisor.
	 *
	 * GET /v1/sales_orders/{id}/pdf
	 * @see https://fiscalisto.com/docs/api/referencia/pedidos/get-sales-order-pdf
	 */
	pdf(id: string, options?: RequestOptions): Promise<Uint8Array> {
		return this.#client.request({ method: "GET", path: `/v1/sales_orders/${encodeURIComponent(id)}/pdf`, as: "bytes" }, options);
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
	 * Los webhooks del modo de la llave. Hasta 16 por modo.
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
	 * Un webhook: su dirección, los eventos que recibe y si sus entregas fallan. El secreto solo viene al crearlo.
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
	 * Cambia su dirección, sus eventos, su descripción o su versión de la API; con disabled: false vuelve a encender uno que se apagó.
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
	 * Deja de mandar eventos a esa dirección. Los eventos siguen en GET /v1/events.
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

	/**
	 * Listar entregas
	 *
	 * Qué pasó con cada evento en este webhook, el más reciente primero: una fila por evento con su último intento, cuántos lleva y cuándo va el siguiente reintento. Con succeeded=false ve los que su servidor no recibió, para reenviarlos con POST /v1/events/{id}/resend.
	 *
	 * GET /v1/webhook_endpoints/{id}/deliveries
	 * @see https://fiscalisto.com/docs/api/referencia/webhooks/list-webhook-deliveries
	 */
	listDeliveries(id: string, params?: ListWebhookDeliveriesParams, options?: RequestOptions): List<WebhookDelivery> {
		return this.#client.list({ path: `/v1/webhook_endpoints/${encodeURIComponent(id)}/deliveries`, query: params }, options);
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
	 * Un evento de los últimos 30 días, con el objeto como estaba cuando pasó.
	 *
	 * GET /v1/events/{id}
	 * @see https://fiscalisto.com/docs/api/referencia/eventos/get-event
	 */
	get(id: string, options?: RequestOptions): Promise<Event> {
		return this.#client.request({ method: "GET", path: `/v1/events/${encodeURIComponent(id)}` }, options);
	}

	/**
	 * Reenviar un evento
	 *
	 * Manda otra vez, ahora, un evento de los últimos 30 días: a un webhook (endpoint) o a todos los encendidos que escuchan ese tipo. Es un intento aparte, firmado con el mismo webhook-id: no cambia los reintentos automáticos, y si llega, ya no se reintenta. Úselo después de arreglar su servidor, con GET /v1/events?delivery_success=false.
	 *
	 * POST /v1/events/{id}/resend
	 * @see https://fiscalisto.com/docs/api/referencia/eventos/resend-event
	 */
	resend(id: string, params?: ResendEventParams, options?: RequestOptions): Promise<EventResend> {
		return this.#client.request({ method: "POST", path: `/v1/events/${encodeURIComponent(id)}/resend`, body: params, idempotent: true }, options);
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
	readonly customers = new CustomersResource(this);
	readonly cashForecast = new CashForecastResource(this);
	readonly bankTransactions = new BankTransactionsResource(this);
	readonly purchaseReceipts = new PurchaseReceiptsResource(this);
	readonly payments = new PaymentsResource(this);
	readonly creditNotes = new CreditNotesResource(this);
	readonly advances = new AdvancesResource(this);
	readonly retentions = new RetentionsResource(this);
	readonly employees = new EmployeesResource(this);
	readonly payrollReceipts = new PayrollReceiptsResource(this);
	readonly payrollBatches = new PayrollBatchesResource(this);
	readonly payrollBankFiles = new PayrollBankFilesResource(this);
	readonly imssMovements = new ImssMovementsResource(this);
	readonly imssFiles = new ImssFilesResource(this);
	readonly employeeDeductions = new EmployeeDeductionsResource(this);
	readonly variableSalaries = new VariableSalariesResource(this);
	readonly annualAdjustments = new AnnualAdjustmentsResource(this);
	readonly payrollTaxes = new PayrollTaxesResource(this);
	readonly invoiceBatches = new InvoiceBatchesResource(this);
	readonly taxIds = new TaxIdsResource(this);
	readonly branches = new BranchesResource(this);
	readonly costCenters = new CostCentersResource(this);
	readonly priceLists = new PriceListsResource(this);
	readonly customerGroups = new CustomerGroupsResource(this);
	readonly prices = new PricesResource(this);
	readonly attendance = new AttendanceResource(this);
	readonly expensePeople = new ExpensePeopleResource(this);
	readonly expenseReports = new ExpenseReportsResource(this);
	readonly expensePolicy = new ExpensePolicyResource(this);
	readonly customerDataRequests = new CustomerDataRequestsResource(this);
	readonly products = new ProductsResource(this);
	readonly satMailboxMessages = new SatMailboxMessagesResource(this);
	readonly satFindings = new SatFindingsResource(this);
	readonly satFindingCounterparties = new SatFindingCounterpartiesResource(this);
	readonly companyReport = new CompanyReportResource(this);
	readonly materialitySuppliers = new MaterialitySuppliersResource(this);
	readonly materialityInvoices = new MaterialityInvoicesResource(this);
	readonly warehouses = new WarehousesResource(this);
	readonly stockMovements = new StockMovementsResource(this);
	readonly stockAdjustments = new StockAdjustmentsResource(this);
	readonly productionOrders = new ProductionOrdersResource(this);
	readonly satCatalogs = new SatCatalogsResource(this);
	readonly satLists = new SatListsResource(this);
	readonly cfdiVerifications = new CfdiVerificationsResource(this);
	readonly members = new MembersResource(this);
	readonly invitations = new InvitationsResource(this);
	readonly roles = new RolesResource(this);
	readonly permissions = new PermissionsResource(this);
	readonly exports = new ExportsResource(this);
	readonly satDownloads = new SatDownloadsResource(this);
	readonly satInvoices = new SatInvoicesResource(this);
	readonly satRetentions = new SatRetentionsResource(this);
	readonly portalSuppliers = new PortalSuppliersResource(this);
	readonly supplierInvoices = new SupplierInvoicesResource(this);
	readonly satDeclarations = new SatDeclarationsResource(this);
	readonly satRefreshes = new SatRefreshesResource(this);
	readonly tickets = new TicketsResource(this);
	readonly accounting = new AccountingResource(this);
	readonly manualEntries = new ManualEntriesResource(this);
	readonly openingBalances = new OpeningBalancesResource(this);
	readonly fixedAssets = new FixedAssetsResource(this);
	readonly closedPeriod = new ClosedPeriodResource(this);
	readonly fxRevaluations = new FxRevaluationsResource(this);
	readonly costOfSales = new CostOfSalesResource(this);
	readonly budgets = new BudgetsResource(this);
	readonly costCenterResults = new CostCenterResultsResource(this);
	readonly payrollProvisions = new PayrollProvisionsResource(this);
	readonly taxDeterminations = new TaxDeterminationsResource(this);
	readonly ledgerBankAccounts = new LedgerBankAccountsResource(this);
	readonly bankMovements = new BankMovementsResource(this);
	readonly storeConnections = new StoreConnectionsResource(this);
	readonly recurringInvoices = new RecurringInvoicesResource(this);
	readonly quotes = new QuotesResource(this);
	readonly salesOrders = new SalesOrdersResource(this);
	readonly webhookEndpoints = new WebhookEndpointsResource(this);
	readonly events = new EventsResource(this);
}
