<?php
/**
 * Copia este archivo como quote-config.php en la misma carpeta
 * y rellena los valores reales en Arsys.
 */

return [
	// Email SMTP
	'SMTP_HOST' => 'smtp.tu-proveedor.com',
	'SMTP_PORT' => 587,
	'SMTP_SECURE' => false,
	'SMTP_USER' => 'info@azentohome.com',
	'SMTP_PASSWORD' => 'password-smtp',
	'MAIL_FROM' => 'info@azentohome.com',
	'NOTIFY_EMAIL_TO' => 'ines.guillermo.calet@gmail.com',

	// WhatsApp por Twilio, opcional
	'ENABLE_WHATSAPP' => false,
	'TWILIO_ACCOUNT_SID' => '',
	'TWILIO_AUTH_TOKEN' => '',
	'TWILIO_WHATSAPP_FROM' => 'whatsapp:+14155238886',
	'WHATSAPP_TO' => 'whatsapp:+34633010691',
];
