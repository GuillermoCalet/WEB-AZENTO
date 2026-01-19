/**
 * API Route: /api/quote
 * Endpoint para procesar solicitudes de presupuesto
 * - Valida y sanitiza datos
 * - Envía email vía Gmail SMTP (Nodemailer)
 * - Envía WhatsApp vía Twilio (opcional)
 */

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';

// ============================================================================
// TIPOS
// ============================================================================

interface QuoteRequest {
	name: string;
	email: string;
	phone: string;
	service: string;
	message: string;
	honeypot?: string; // Campo trampa anti-spam
}

interface ApiResponse {
	ok: boolean;
	error?: string;
	details?: string;
}

// ============================================================================
// RATE LIMITING (en memoria - funciona en Node, limitado en serverless)
// ============================================================================

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 5; // Máximo 5 requests por minuto por IP

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const record = rateLimitMap.get(ip);

	if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
		rateLimitMap.set(ip, { count: 1, lastReset: now });
		return true;
	}

	if (record.count >= RATE_LIMIT_MAX) {
		return false;
	}

	record.count++;
	return true;
}

// Limpiar entradas antiguas cada 5 minutos
setInterval(() => {
	const now = Date.now();
	for (const [ip, record] of rateLimitMap.entries()) {
		if (now - record.lastReset > RATE_LIMIT_WINDOW * 5) {
			rateLimitMap.delete(ip);
		}
	}
}, 5 * 60 * 1000);

// ============================================================================
// VALIDACIÓN Y SANITIZACIÓN
// ============================================================================

function sanitizeString(str: string, maxLength: number = 500): string {
	return String(str || '')
		.trim()
		.slice(0, maxLength)
		.replace(/<[^>]*>/g, '') // Eliminar HTML tags
		.replace(/[<>\"\']/g, ''); // Eliminar caracteres peligrosos
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && email.length <= 254;
}

function validatePhone(phone: string): boolean {
	// Permitir vacío, o un teléfono con 6-20 dígitos (con espacios, guiones, +)
	if (!phone) return true;
	const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
	return digitsOnly.length >= 6 && digitsOnly.length <= 20 && /^\d+$/.test(digitsOnly);
}

function validateRequest(data: QuoteRequest): { valid: boolean; error?: string } {
	// Honeypot check - si tiene valor, es spam
	if (data.honeypot) {
		return { valid: false, error: 'Solicitud rechazada' };
	}

	// Campos requeridos
	if (!data.name || data.name.length < 2) {
		return { valid: false, error: 'El nombre es obligatorio (mínimo 2 caracteres)' };
	}

	if (!data.email) {
		return { valid: false, error: 'El email es obligatorio' };
	}

	if (!validateEmail(data.email)) {
		return { valid: false, error: 'El email no es válido' };
	}

	if (!validatePhone(data.phone)) {
		return { valid: false, error: 'El teléfono no es válido' };
	}

	// Longitud máxima
	if (data.name.length > 100) {
		return { valid: false, error: 'El nombre es demasiado largo' };
	}

	if (data.message && data.message.length > 2000) {
		return { valid: false, error: 'El mensaje es demasiado largo (máx. 2000 caracteres)' };
	}

	return { valid: true };
}

// ============================================================================
// SERVICIOS DE NOTIFICACIÓN
// ============================================================================

const SERVICES_MAP: Record<string, string> = {
	'paisajismo': 'Paisajismo Exclusivo',
	'reformas': 'Reformas Integrales',
	'mantenimiento': 'Mantenimiento Premium',
	'jardines-terrazas': 'Jardines y Terrazas',
	'pergolas-celosias': 'Pérgolas y Celosías',
	'fachadas-revestimientos': 'Fachadas y Revestimientos',
	'reformas-interiores': 'Reformas Interiores',
	'otro': 'Otro proyecto',
	'': 'No especificado'
};

async function sendEmail(data: QuoteRequest, meta: { ip: string; userAgent: string }): Promise<void> {
	const gmailUser = import.meta.env.GMAIL_USER;
	const gmailPassword = import.meta.env.GMAIL_APP_PASSWORD;
	const notifyTo = import.meta.env.NOTIFY_EMAIL_TO || 'ines.guillermo.calet@gmail.com';

	if (!gmailUser || !gmailPassword) {
		console.warn('⚠️ Gmail no configurado. Variables GMAIL_USER y GMAIL_APP_PASSWORD requeridas.');
		throw new Error('Servicio de email no configurado');
	}

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: gmailUser,
			pass: gmailPassword,
		},
	});

	const serviceName = SERVICES_MAP[data.service] || data.service || 'No especificado';
	const timestamp = new Date().toLocaleString('es-ES', { 
		timeZone: 'Europe/Madrid',
		dateStyle: 'full',
		timeStyle: 'medium'
	});

	const subject = `Nuevo presupuesto — ${serviceName} — ${data.name}`;
	
	const htmlBody = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<style>
				body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background: linear-gradient(135deg, #435f69 0%, #5b727b 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
				.header h1 { margin: 0; font-size: 24px; }
				.content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
				.field { margin-bottom: 20px; }
				.field-label { font-weight: 600; color: #435f69; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
				.field-value { font-size: 16px; margin-top: 5px; padding: 12px; background: white; border-radius: 8px; border-left: 3px solid #c4a882; }
				.message-box { background: white; padding: 20px; border-radius: 8px; border-left: 3px solid #435f69; white-space: pre-wrap; }
				.meta { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
				.badge { display: inline-block; background: #c4a882; color: #1a2528; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>🏡 Nuevo Presupuesto</h1>
					<p style="margin: 10px 0 0 0; opacity: 0.9;">AZento Home Solutions</p>
				</div>
				<div class="content">
					<div class="field">
						<div class="field-label">Servicio de interés</div>
						<div class="field-value"><span class="badge">${serviceName}</span></div>
					</div>
					
					<div class="field">
						<div class="field-label">Nombre completo</div>
						<div class="field-value">${data.name}</div>
					</div>
					
					<div class="field">
						<div class="field-label">Email</div>
						<div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
					</div>
					
					<div class="field">
						<div class="field-label">Teléfono</div>
						<div class="field-value">${data.phone || 'No proporcionado'}</div>
					</div>
					
					<div class="field">
						<div class="field-label">Mensaje del cliente</div>
						<div class="message-box">${data.message || 'Sin mensaje adicional'}</div>
					</div>
					
					<div class="meta">
						<strong>📅 Fecha:</strong> ${timestamp}<br>
						<strong>🌐 IP:</strong> ${meta.ip}<br>
						<strong>📱 User-Agent:</strong> ${meta.userAgent}
					</div>
				</div>
			</div>
		</body>
		</html>
	`;

	const textBody = `
NUEVO PRESUPUESTO - AZento Home Solutions
==========================================

Servicio: ${serviceName}
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone || 'No proporcionado'}

Mensaje:
${data.message || 'Sin mensaje adicional'}

------------------------------------------
Fecha: ${timestamp}
IP: ${meta.ip}
User-Agent: ${meta.userAgent}
	`;

	await transporter.sendMail({
		from: `"AZento Home Solutions" <${gmailUser}>`,
		to: notifyTo,
		subject,
		text: textBody,
		html: htmlBody,
	});

	console.log(`✅ Email enviado a ${notifyTo}`);
}

async function sendWhatsApp(data: QuoteRequest): Promise<void> {
	const enableWhatsApp = import.meta.env.ENABLE_WHATSAPP === 'true';
	const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
	const authToken = import.meta.env.TWILIO_AUTH_TOKEN;
	const whatsappFrom = import.meta.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
	const whatsappTo = import.meta.env.WHATSAPP_TO || 'whatsapp:+34633010691';

	if (!enableWhatsApp) {
		console.log('ℹ️ WhatsApp deshabilitado (ENABLE_WHATSAPP != true)');
		return;
	}

	if (!accountSid || !authToken) {
		console.warn('⚠️ Twilio no configurado. Variables TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN requeridas.');
		console.warn('⚠️ Continuando sin envío de WhatsApp (modo degradado)');
		return;
	}

	try {
		const client = Twilio(accountSid, authToken);
		const serviceName = SERVICES_MAP[data.service] || data.service || 'No especificado';

		const message = `🏡 *Nuevo presupuesto AZento*

👤 *${data.name}*
📋 ${serviceName}
📞 ${data.phone || 'Sin teléfono'}
✉️ ${data.email}

_Revisa tu email para más detalles_`;

		await client.messages.create({
			body: message,
			from: whatsappFrom,
			to: whatsappTo,
		});

		console.log(`✅ WhatsApp enviado a ${whatsappTo}`);
	} catch (error) {
		console.error('❌ Error enviando WhatsApp:', error);
		// No lanzamos el error - modo degradado
	}
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export const POST: APIRoute = async ({ request, clientAddress }) => {
	const headers = {
		'Content-Type': 'application/json',
	};

	try {
		// Obtener IP del cliente
		const ip = clientAddress || 
			request.headers.get('x-forwarded-for')?.split(',')[0] || 
			request.headers.get('x-real-ip') || 
			'unknown';

		// Rate limiting
		if (!checkRateLimit(ip)) {
			return new Response(
				JSON.stringify({ 
					ok: false, 
					error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' 
				} as ApiResponse),
				{ status: 429, headers }
			);
		}

		// Parsear body
		let body: QuoteRequest;
		try {
			body = await request.json();
		} catch {
			return new Response(
				JSON.stringify({ 
					ok: false, 
					error: 'Formato de datos inválido' 
				} as ApiResponse),
				{ status: 400, headers }
			);
		}

		// Sanitizar
		const sanitizedData: QuoteRequest = {
			name: sanitizeString(body.name, 100),
			email: sanitizeString(body.email, 254),
			phone: sanitizeString(body.phone, 30),
			service: sanitizeString(body.service, 50),
			message: sanitizeString(body.message, 2000),
			honeypot: body.honeypot,
		};

		// Validar
		const validation = validateRequest(sanitizedData);
		if (!validation.valid) {
			return new Response(
				JSON.stringify({ 
					ok: false, 
					error: validation.error 
				} as ApiResponse),
				{ status: 400, headers }
			);
		}

		// Metadatos
		const userAgent = request.headers.get('user-agent') || 'unknown';
		const meta = { ip, userAgent };

		// Enviar notificaciones
		try {
			await sendEmail(sanitizedData, meta);
		} catch (emailError) {
			console.error('❌ Error enviando email:', emailError);
			return new Response(
				JSON.stringify({ 
					ok: false, 
					error: 'Error al procesar la solicitud. Inténtalo de nuevo.' 
				} as ApiResponse),
				{ status: 500, headers }
			);
		}

		// WhatsApp (no bloqueante)
		sendWhatsApp(sanitizedData).catch(err => {
			console.error('❌ Error en WhatsApp (no crítico):', err);
		});

		// Éxito
		return new Response(
			JSON.stringify({ ok: true } as ApiResponse),
			{ status: 200, headers }
		);

	} catch (error) {
		console.error('❌ Error inesperado en /api/quote:', error);
		return new Response(
			JSON.stringify({ 
				ok: false, 
				error: 'Error interno del servidor' 
			} as ApiResponse),
			{ status: 500, headers }
		);
	}
};

// Rechazar otros métodos
export const ALL: APIRoute = () => {
	return new Response(
		JSON.stringify({ ok: false, error: 'Método no permitido' }),
		{ status: 405, headers: { 'Content-Type': 'application/json' } }
	);
};
