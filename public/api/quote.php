<?php
declare(strict_types=1);



const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 5;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	json_response(405, ['ok' => false, 'error' => 'Método no permitido']);
}

$ip = client_ip();

if (!check_rate_limit($ip)) {
	json_response(429, [
		'ok' => false,
		'error' => 'Demasiadas solicitudes. Intenta de nuevo en un minuto.',
	]);
}

$rawBody = file_get_contents('php://input');
$body = json_decode($rawBody ?: '', true);

if (!is_array($body)) {
	json_response(400, ['ok' => false, 'error' => 'Formato de datos inválido']);
}

$data = [
	'name' => sanitize_single_line($body['name'] ?? '', 100),
	'email' => sanitize_single_line($body['email'] ?? '', 254),
	'phone' => sanitize_single_line($body['phone'] ?? '', 30),
	'service' => sanitize_single_line($body['service'] ?? '', 80),
	'message' => sanitize_string($body['message'] ?? '', 2000),
	'business_unit' => sanitize_single_line($body['business_unit'] ?? '', 40),
	'source_page' => sanitize_single_line($body['source_page'] ?? '', 120),
	'source_url' => sanitize_single_line($body['source_url'] ?? '', 500),
	'honeypot' => (string)($body['honeypot'] ?? ''),
];

$validationError = validate_request($data);
if ($validationError !== null) {
	json_response(400, ['ok' => false, 'error' => $validationError]);
}

$config = load_config();
$meta = [
	'ip' => $ip,
	'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
];

try {
	send_email($data, $meta, $config);
} catch (Throwable $error) {
	error_log('Error enviando email AZento: ' . $error->getMessage());
	json_response(500, [
		'ok' => false,
		'error' => 'Error al procesar la solicitud. Inténtalo de nuevo.',
	]);
}

try {
	send_whatsapp($data, $config);
} catch (Throwable $error) {
	error_log('Error enviando WhatsApp AZento: ' . $error->getMessage());
}

json_response(200, ['ok' => true]);

function json_response(int $status, array $payload): never
{
	http_response_code($status);
	echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit;
}

function load_config(): array
{
	$config = [
		'SMTP_HOST' => env_value('SMTP_HOST'),
		'SMTP_PORT' => env_value('SMTP_PORT', '587'),
		'SMTP_SECURE' => env_value('SMTP_SECURE', 'false'),
		'SMTP_USER' => env_value('SMTP_USER', env_value('GMAIL_USER')),
		'SMTP_PASSWORD' => env_value('SMTP_PASSWORD', env_value('GMAIL_APP_PASSWORD')),
		'MAIL_FROM' => env_value('MAIL_FROM'),
		'NOTIFY_EMAIL_TO' => env_value('NOTIFY_EMAIL_TO', 'ines.guillermo.calet@gmail.com'),
		'ENABLE_WHATSAPP' => env_value('ENABLE_WHATSAPP', 'false'),
		'TWILIO_ACCOUNT_SID' => env_value('TWILIO_ACCOUNT_SID'),
		'TWILIO_AUTH_TOKEN' => env_value('TWILIO_AUTH_TOKEN'),
		'TWILIO_WHATSAPP_FROM' => env_value('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886'),
		'WHATSAPP_TO' => env_value('WHATSAPP_TO', 'whatsapp:+34633010691'),
	];

	$configFile = __DIR__ . '/quote-config.php';
	if (is_file($configFile)) {
		$fileConfig = require $configFile;
		if (is_array($fileConfig)) {
			foreach ($fileConfig as $key => $value) {
				$config[$key] = $value;
			}
		}
	}

	$config['SMTP_PORT'] = (int)($config['SMTP_PORT'] ?: 587);
	$config['SMTP_SECURE'] = to_bool($config['SMTP_SECURE']);
	$config['ENABLE_WHATSAPP'] = to_bool($config['ENABLE_WHATSAPP']);
	$config['MAIL_FROM'] = $config['MAIL_FROM'] ?: $config['SMTP_USER'];

	return $config;
}

function env_value(string $key, string $default = ''): string
{
	$value = getenv($key);
	if ($value !== false) {
		return (string)$value;
	}

	return isset($_ENV[$key]) ? (string)$_ENV[$key] : $default;
}

function to_bool(mixed $value): bool
{
	return filter_var($value, FILTER_VALIDATE_BOOLEAN);
}

function client_ip(): string
{
	$forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
	if ($forwardedFor !== '') {
		$parts = explode(',', $forwardedFor);
		return trim($parts[0]) ?: 'unknown';
	}

	return $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function check_rate_limit(string $ip): bool
{
	$file = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'azento_quote_rate_limit.json';
	$handle = @fopen($file, 'c+');

	if (!$handle) {
		return true;
	}

	try {
		if (!flock($handle, LOCK_EX)) {
			return true;
		}

		$contents = stream_get_contents($handle);
		$records = json_decode($contents ?: '{}', true);
		if (!is_array($records)) {
			$records = [];
		}

		$now = time();
		foreach ($records as $recordIp => $record) {
			if (!is_array($record) || $now - (int)($record['lastReset'] ?? 0) > RATE_LIMIT_WINDOW * 5) {
				unset($records[$recordIp]);
			}
		}

		$record = $records[$ip] ?? null;
		if (!is_array($record) || $now - (int)($record['lastReset'] ?? 0) > RATE_LIMIT_WINDOW) {
			$records[$ip] = ['count' => 1, 'lastReset' => $now];
			write_rate_limit_records($handle, $records);
			return true;
		}

		if ((int)$record['count'] >= RATE_LIMIT_MAX) {
			write_rate_limit_records($handle, $records);
			return false;
		}

		$records[$ip]['count'] = (int)$record['count'] + 1;
		write_rate_limit_records($handle, $records);
		return true;
	} finally {
		flock($handle, LOCK_UN);
		fclose($handle);
	}
}

function write_rate_limit_records($handle, array $records): void
{
	ftruncate($handle, 0);
	rewind($handle);
	fwrite($handle, json_encode($records));
	fflush($handle);
}

function sanitize_string(mixed $value, int $maxLength = 500): string
{
	$text = trim(strip_tags((string)$value));
	$text = str_replace(['<', '>', '"', "'"], '', $text);
	$text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';

	if (function_exists('mb_substr')) {
		return mb_substr($text, 0, $maxLength, 'UTF-8');
	}

	return substr($text, 0, $maxLength);
}

function sanitize_single_line(mixed $value, int $maxLength = 500): string
{
	$text = sanitize_string($value, $maxLength);
	return trim(preg_replace('/[\r\n]+/', ' ', $text) ?? '');
}

function validate_request(array $data): ?string
{
	if ($data['honeypot'] !== '') {
		return 'Solicitud rechazada';
	}

	if ($data['name'] === '' || string_length($data['name']) < 2) {
		return 'El nombre es obligatorio (mínimo 2 caracteres)';
	}

	if ($data['email'] === '') {
		return 'El email es obligatorio';
	}

	if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || string_length($data['email']) > 254) {
		return 'El email no es válido';
	}

	if (!validate_phone($data['phone'])) {
		return 'El teléfono no es válido';
	}

	if (string_length($data['name']) > 100) {
		return 'El nombre es demasiado largo';
	}

	if ($data['message'] !== '' && string_length($data['message']) > 2000) {
		return 'El mensaje es demasiado largo (máx. 2000 caracteres)';
	}

	$unit = business_unit_config($data['business_unit']);
	if ($unit === null) {
		return 'El área de negocio no es válida';
	}

	if ($data['source_page'] !== $unit['source_page']) {
		return 'La página de origen no es válida';
	}

	if (!array_key_exists($data['service'], $unit['services'])) {
		return 'El servicio solicitado no es válido para esta área';
	}

	if (!validate_source_url($data['source_url'])) {
		return 'La URL de origen no es válida';
	}

	return null;
}

function validate_source_url(string $url): bool
{
	if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
		return false;
	}

	$scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
	return in_array($scheme, ['http', 'https'], true);
}

function string_length(string $value): int
{
	if (function_exists('mb_strlen')) {
		return mb_strlen($value, 'UTF-8');
	}

	return strlen($value);
}

function validate_phone(string $phone): bool
{
	if ($phone === '') {
		return true;
	}

	$digitsOnly = preg_replace('/[\s\-\+\(\)]/', '', $phone);
	return $digitsOnly !== null
		&& strlen($digitsOnly) >= 6
		&& strlen($digitsOnly) <= 20
		&& ctype_digit($digitsOnly);
}

function business_unit_config(string $businessUnit): ?array
{
	$generatedPath = __DIR__ . '/quote-services.json';
	if (is_readable($generatedPath)) {
		$decoded = json_decode((string)file_get_contents($generatedPath), true);
		$generatedUnit = is_array($decoded) ? ($decoded[$businessUnit] ?? null) : null;
		$normalized = normalize_generated_business_unit($generatedUnit);
		if ($normalized !== null) {
			return $normalized;
		}
	}

	$units = [
		'madera_tecnologica' => [
			'label' => 'Madera Tecnológica',
			'subject' => '[AZENTO | MADERA TECNOLÓGICA] Nueva solicitud de presupuesto',
			'source_page' => '/madera-tecnologica',
			'services' => [
				'tarima-madera-tecnologica' => 'Tarima de madera tecnológica',
				'pergolas-celosias' => 'Pérgolas y celosías',
				'fachadas-revestimientos' => 'Fachadas y revestimientos',
				'cerramientos-separadores' => 'Cerramientos y separadores',
				'jardines-terrazas' => 'Jardines y terrazas',
				'otro-madera-tecnologica' => 'Otro proyecto de madera tecnológica',
			],
		],
		'reformas' => [
			'label' => 'Reformas',
			'subject' => '[AZENTO | REFORMAS] Nueva solicitud de presupuesto',
			'source_page' => '/reformas',
			'services' => [
				'reforma-integral' => 'Reforma integral',
				'cocina' => 'Cocina',
				'bano' => 'Baño',
				'reforma-interior' => 'Reforma interior',
				'iluminacion' => 'Iluminación',
				'mobiliario-medida' => 'Mobiliario a medida',
				'reforma-exterior' => 'Reforma exterior',
				'otro-reforma' => 'Otro proyecto de reforma',
			],
		],
	];

	return $units[$businessUnit] ?? null;
}

function normalize_generated_business_unit($unit): ?array
{
	if (!is_array($unit)) {
		return null;
	}

	$label = sanitize_single_line($unit['label'] ?? '', 80);
	$subject = sanitize_single_line($unit['subject'] ?? '', 160);
	$sourcePage = sanitize_single_line($unit['source_page'] ?? '', 120);
	$rawServices = $unit['services'] ?? null;

	if ($label === '' || $subject === '' || !preg_match('#^/[a-z0-9-]+$#', $sourcePage) || !is_array($rawServices)) {
		return null;
	}

	$services = [];
	foreach ($rawServices as $value => $serviceLabel) {
		if (!is_string($value) || !preg_match('/^[a-z0-9-]+$/', $value)) {
			continue;
		}
		$cleanLabel = sanitize_single_line($serviceLabel, 100);
		if ($cleanLabel !== '') {
			$services[$value] = $cleanLabel;
		}
	}

	if ($services === []) {
		return null;
	}

	return [
		'label' => $label,
		'subject' => $subject,
		'source_page' => $sourcePage,
		'services' => $services,
	];
}

function service_name(string $businessUnit, string $service): string
{
	$unit = business_unit_config($businessUnit);
	return $unit['services'][$service] ?? 'No especificado';
}

function send_email(array $data, array $meta, array $config): void
{
	if (
		empty($config['SMTP_HOST'])
		|| empty($config['SMTP_USER'])
		|| empty($config['SMTP_PASSWORD'])
		|| empty($config['MAIL_FROM'])
	) {
		throw new RuntimeException('Servicio de email no configurado');
	}

	[$subject, $textBody, $htmlBody] = build_email_bodies($data, $meta);

	send_smtp_mail(
		$config,
		(string)$config['MAIL_FROM'],
		(string)$config['NOTIFY_EMAIL_TO'],
		$data['email'],
		$subject,
		$textBody,
		$htmlBody
	);
}

function build_email_bodies(array $data, array $meta): array
{
	date_default_timezone_set('Europe/Madrid');

	$unit = business_unit_config($data['business_unit']);
	if ($unit === null) {
		throw new RuntimeException('Área de negocio no válida');
	}

	$areaName = $unit['label'];
	$serviceName = service_name($data['business_unit'], $data['service']);
	$timestamp = date('d/m/Y H:i:s');
	$subject = $unit['subject'];
	$message = $data['message'] !== '' ? $data['message'] : 'Sin mensaje adicional';
	$phone = $data['phone'] !== '' ? $data['phone'] : 'No proporcionado';

	$textBody = <<<TEXT
NUEVA SOLICITUD DE PRESUPUESTO - AZento Home
=============================================

Área: {$areaName}
Página de origen: {$data['source_page']}
Nombre: {$data['name']}
Correo: {$data['email']}
Teléfono: {$phone}
Servicio solicitado: {$serviceName}

Mensaje:
{$message}

URL de origen: {$data['source_url']}
Fecha y hora: {$timestamp}

---------------------------------------------
IP: {$meta['ip']}
User-Agent: {$meta['userAgent']}
TEXT;

	$htmlArea = html_escape($areaName);
	$htmlSourcePage = html_escape($data['source_page']);
	$htmlService = html_escape($serviceName);
	$htmlName = html_escape($data['name']);
	$htmlEmail = html_escape($data['email']);
	$htmlPhone = html_escape($phone);
	$htmlMessage = nl2br(html_escape($message));
	$htmlSourceUrl = html_escape($data['source_url']);
	$htmlTimestamp = html_escape($timestamp);

	$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<style>
		body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background: #435f69; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
		.header h1 { margin: 0; font-size: 24px; }
		.content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
		.field { margin-bottom: 20px; }
		.field-label { font-weight: 600; color: #435f69; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
		.field-value { font-size: 16px; margin-top: 5px; padding: 12px; background: white; border-radius: 8px; border-left: 3px solid #c4a882; }
		.message-box { background: white; padding: 20px; border-radius: 8px; border-left: 3px solid #435f69; white-space: pre-wrap; }
		.meta { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
		.badge { display: inline-block; background: #c4a882; color: #1a2528; padding: 4px 10px; border-radius: 6px; font-size: 14px; font-weight: 600; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
				<h1>Nueva solicitud de presupuesto</h1>
				<p style="margin: 10px 0 0 0; opacity: 0.9;">AZento Home</p>
			</div>
			<div class="content">
				<div class="field">
					<div class="field-label">Área</div>
					<div class="field-value"><span class="badge">{$htmlArea}</span></div>
				</div>

				<div class="field">
					<div class="field-label">Página de origen</div>
					<div class="field-value">{$htmlSourcePage}</div>
				</div>

				<div class="field">
					<div class="field-label">Nombre</div>
					<div class="field-value">{$htmlName}</div>
				</div>

				<div class="field">
					<div class="field-label">Correo</div>
					<div class="field-value"><a href="mailto:{$htmlEmail}">{$htmlEmail}</a></div>
				</div>

				<div class="field">
					<div class="field-label">Teléfono</div>
					<div class="field-value">{$htmlPhone}</div>
				</div>

				<div class="field">
					<div class="field-label">Servicio solicitado</div>
					<div class="field-value">{$htmlService}</div>
				</div>

			<div class="field">
				<div class="field-label">Mensaje del cliente</div>
				<div class="message-box">{$htmlMessage}</div>
			</div>

				<div class="meta">
					<strong>URL de origen:</strong> {$htmlSourceUrl}<br>
					<strong>Fecha y hora:</strong> {$htmlTimestamp}<br>
				</div>
		</div>
	</div>
</body>
</html>
HTML;

	return [$subject, $textBody, $htmlBody];
}

function html_escape(string $value): string
{
	return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function send_smtp_mail(
	array $config,
	string $from,
	string $to,
	string $replyTo,
	string $subject,
	string $textBody,
	string $htmlBody
): void {
	$host = (string)$config['SMTP_HOST'];
	$port = (int)$config['SMTP_PORT'];
	$secure = (bool)$config['SMTP_SECURE'];
	$username = (string)$config['SMTP_USER'];
	$password = (string)$config['SMTP_PASSWORD'];
	$fromAddress = extract_email($from);
	$recipients = split_recipients($to);

	if (!filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
		throw new RuntimeException('MAIL_FROM no es un email válido');
	}

	if ($recipients === []) {
		throw new RuntimeException('NOTIFY_EMAIL_TO no contiene destinatarios válidos');
	}

	$transport = $secure ? 'ssl://' . $host : $host;
	$socket = @stream_socket_client($transport . ':' . $port, $errorCode, $errorMessage, 25);
	if (!$socket) {
		throw new RuntimeException('No se pudo conectar al SMTP: ' . $errorMessage . ' (' . $errorCode . ')');
	}

	stream_set_timeout($socket, 30);

	try {
		smtp_expect($socket, [220]);
		$ehloResponse = smtp_command($socket, 'EHLO ' . smtp_domain(), [250]);

		if (!$secure && stripos($ehloResponse, 'STARTTLS') !== false) {
			smtp_command($socket, 'STARTTLS', [220]);
			$cryptoEnabled = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
			if ($cryptoEnabled !== true) {
				throw new RuntimeException('No se pudo activar STARTTLS');
			}
			smtp_command($socket, 'EHLO ' . smtp_domain(), [250]);
		}

		smtp_command($socket, 'AUTH LOGIN', [334]);
		smtp_command($socket, base64_encode($username), [334]);
		smtp_command($socket, base64_encode($password), [235]);

		smtp_command($socket, 'MAIL FROM:<' . $fromAddress . '>', [250]);
		foreach ($recipients as $recipient) {
			smtp_command($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
		}

		smtp_command($socket, 'DATA', [354]);
		fwrite($socket, build_mime_message($fromAddress, $recipients, $replyTo, $subject, $textBody, $htmlBody));
		smtp_expect($socket, [250]);
		smtp_command($socket, 'QUIT', [221]);
	} finally {
		fclose($socket);
	}
}

function build_mime_message(
	string $from,
	array $recipients,
	string $replyTo,
	string $subject,
	string $textBody,
	string $htmlBody
): string {
	$boundary = '=_azento_' . bin2hex(random_bytes(12));
	$headers = [
		'Date: ' . date(DATE_RFC2822),
		'From: "AZento Home Solutions" <' . $from . '>',
		'To: ' . implode(', ', $recipients),
		'Reply-To: ' . $replyTo,
		'Subject: ' . encode_mime_header($subject),
		'MIME-Version: 1.0',
		'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
	];

	$body = implode("\r\n", $headers) . "\r\n\r\n"
		. '--' . $boundary . "\r\n"
		. "Content-Type: text/plain; charset=UTF-8\r\n"
		. "Content-Transfer-Encoding: quoted-printable\r\n\r\n"
		. quoted_printable_encode($textBody) . "\r\n\r\n"
		. '--' . $boundary . "\r\n"
		. "Content-Type: text/html; charset=UTF-8\r\n"
		. "Content-Transfer-Encoding: quoted-printable\r\n\r\n"
		. quoted_printable_encode($htmlBody) . "\r\n\r\n"
		. '--' . $boundary . "--\r\n";

	return dot_stuff($body) . "\r\n.\r\n";
}

function smtp_domain(): string
{
	$serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
	return preg_replace('/[^a-zA-Z0-9.-]/', '', $serverName) ?: 'localhost';
}

function split_recipients(string $value): array
{
	$items = preg_split('/[,;]/', $value) ?: [];
	$emails = [];

	foreach ($items as $item) {
		$email = extract_email(trim($item));
		if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$emails[] = $email;
		}
	}

	return array_values(array_unique($emails));
}

function extract_email(string $value): string
{
	if (preg_match('/<([^>]+)>/', $value, $matches)) {
		return trim($matches[1]);
	}

	return trim($value);
}

function encode_mime_header(string $value): string
{
	return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function dot_stuff(string $message): string
{
	$message = str_replace(["\r\n", "\r"], "\n", $message);
	$message = preg_replace('/^\./m', '..', $message) ?? $message;
	return str_replace("\n", "\r\n", $message);
}

function smtp_command($socket, string $command, array $expectedCodes): string
{
	fwrite($socket, $command . "\r\n");
	return smtp_expect($socket, $expectedCodes);
}

function smtp_expect($socket, array $expectedCodes): string
{
	$response = '';

	while (($line = fgets($socket, 515)) !== false) {
		$response .= $line;

		if (strlen($line) >= 4 && $line[3] === ' ') {
			break;
		}
	}

	$code = (int)substr($response, 0, 3);
	if (!in_array($code, $expectedCodes, true)) {
		throw new RuntimeException('Respuesta SMTP inesperada: ' . trim($response));
	}

	return $response;
}

function send_whatsapp(array $data, array $config): void
{
	if (!$config['ENABLE_WHATSAPP']) {
		return;
	}

	$accountSid = (string)$config['TWILIO_ACCOUNT_SID'];
	$authToken = (string)$config['TWILIO_AUTH_TOKEN'];
	$from = (string)$config['TWILIO_WHATSAPP_FROM'];
	$to = (string)$config['WHATSAPP_TO'];

	if ($accountSid === '' || $authToken === '') {
		error_log('Twilio no configurado. Continuando sin WhatsApp.');
		return;
	}

	if (!function_exists('curl_init')) {
		error_log('La extensión cURL de PHP no está disponible. Continuando sin WhatsApp.');
		return;
	}

	$unit = business_unit_config($data['business_unit']);
	$areaName = $unit['label'] ?? 'No especificada';
	$serviceName = service_name($data['business_unit'], $data['service']);
	$phone = $data['phone'] !== '' ? $data['phone'] : 'Sin teléfono';
	$message = <<<TEXT
Nuevo presupuesto AZento

Área: {$areaName}
Nombre: {$data['name']}
Servicio: {$serviceName}
Teléfono: {$phone}
Email: {$data['email']}

Revisa tu email para más detalles.
TEXT;

	$ch = curl_init('https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($accountSid) . '/Messages.json');
	curl_setopt_array($ch, [
		CURLOPT_POST => true,
		CURLOPT_POSTFIELDS => http_build_query([
			'Body' => $message,
			'From' => $from,
			'To' => $to,
		]),
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_USERPWD => $accountSid . ':' . $authToken,
		CURLOPT_TIMEOUT => 15,
	]);

	$response = curl_exec($ch);
	$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);

	if ($response === false || $status < 200 || $status >= 300) {
		throw new RuntimeException('Twilio respondió con error: ' . ($error ?: (string)$status));
	}
}
