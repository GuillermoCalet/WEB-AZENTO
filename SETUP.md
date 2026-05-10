# 📧 Configuración del Sistema de Notificaciones

Este documento explica cómo configurar el sistema de notificaciones por Email y WhatsApp para el formulario de contacto.

> Nota: para Arsys, el formulario se procesa con `public/api/quote.php` y la guía de subida está en [ARSYS_DEPLOY.md](ARSYS_DEPLOY.md). Las variables de este documento también se pueden poner en `public/api/quote-config.php` usando el ejemplo `public/api/quote-config.example.php`.

---

## 📋 Índice

1. [Instalación](#instalación)
2. [Configurar SMTP de tu correo](#configurar-smtp-de-tu-correo)
3. [Configurar Twilio WhatsApp](#configurar-twilio-whatsapp)
4. [Variables de Entorno](#variables-de-entorno)
5. [Pruebas](#pruebas)
6. [Despliegue](#despliegue)
7. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# El formulario de producción se procesa con PHP en public/api/quote.php
```

---

## 📧 Configurar SMTP de tu correo

El formulario envia emails usando SMTP generico. Puedes usar el servidor SMTP de tu proveedor de correo: IONOS, Hostinger, Webempresa, OVH, Zoho, Outlook/Microsoft 365, etc.

Necesitas estos datos de tu proveedor:

- Host SMTP, por ejemplo `smtp.tudominio.com`
- Puerto, normalmente `587` con STARTTLS o `465` con SSL
- Usuario SMTP, normalmente tu email completo
- Password SMTP o password de aplicacion
- Email remitente permitido por ese buzon

### Configurar variables de entorno

```bash
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=tu-password-smtp
MAIL_FROM=tu-email@tudominio.com
NOTIFY_EMAIL_TO=ines.guillermo.calet@gmail.com
```

> Nota: usa `SMTP_SECURE=true` solo con puerto `465`. Para puerto `587`, deja `SMTP_SECURE=false`.

---

## 📱 Configurar Twilio WhatsApp

### Opción A: WhatsApp Sandbox (Desarrollo/Pruebas)

1. Crea una cuenta en [twilio.com](https://www.twilio.com/try-twilio) (gratis)
2. Ve a **Messaging > Try it out > Send a WhatsApp message**
3. Twilio te mostrará un número sandbox: `+1 415 523 8886`
4. Desde tu teléfono, envía el código de activación a ese número
   - Ejemplo: envía `join <codigo>` al número de Twilio
5. Una vez conectado, copia tus credenciales desde el Dashboard:
   - Account SID: `ACxxxxxxxxx...`
   - Auth Token: `xxxxxxxxx...`

### Opción B: WhatsApp Business (Producción)

1. Requiere cuenta de Twilio verificada
2. Ve a **Messaging > Senders > WhatsApp senders**
3. Sigue el proceso de verificación de negocio con Meta
4. Una vez aprobado, tendrás un número dedicado

### Configurar variables de entorno

```bash
ENABLE_WHATSAPP=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO=whatsapp:+34633010691
```

> 📝 **Nota**: El formato del número debe incluir `whatsapp:` y el código de país.

---

## 🔐 Configuración en producción

### Archivo `quote-config.php` en Arsys

Copia el ejemplo:

```bash
cp public/api/quote-config.example.php public/api/quote-config.php
```

Edita `public/api/quote-config.php` con tus valores reales:

```php
return [
	// Email
	'SMTP_HOST' => 'smtp.tu-proveedor.com',
	'SMTP_PORT' => 587,
	'SMTP_SECURE' => false,
	'SMTP_USER' => 'tu-email@tudominio.com',
	'SMTP_PASSWORD' => 'tu-password-smtp',
	'MAIL_FROM' => 'tu-email@tudominio.com',
	'NOTIFY_EMAIL_TO' => 'ines.guillermo.calet@gmail.com',

	// WhatsApp
	'ENABLE_WHATSAPP' => true,
	'TWILIO_ACCOUNT_SID' => 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	'TWILIO_AUTH_TOKEN' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	'TWILIO_WHATSAPP_FROM' => 'whatsapp:+14155238886',
	'WHATSAPP_TO' => 'whatsapp:+34633010691',
];
```

---

## 🧪 Pruebas

### Probar en local

```bash
# Compilar y servir con PHP para ejecutar quote.php
npm run build
php -S localhost:8000 -t dist

# La web estará en http://localhost:8000
```

### Probar con curl

```bash
# Solicitud de prueba
curl -X POST http://localhost:8000/api/quote.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "phone": "+34 600 123 456",
    "service": "jardines-terrazas",
    "message": "Hola, me gustaría un presupuesto para mi jardín."
  }'

# Respuesta esperada:
# {"ok":true}
```

### Payload JSON esperado

```json
{
  "name": "string (requerido, 2-100 caracteres)",
  "email": "string (requerido, email válido)",
  "phone": "string (opcional, 6-20 dígitos)",
  "service": "string (opcional)",
  "message": "string (opcional, máx 2000 caracteres)",
  "honeypot": "string (debe estar vacío, anti-spam)"
}
```

### Servicios válidos

```
jardines-terrazas
pergolas-celosias
fachadas-revestimientos
reformas-interiores
otro
```

### Respuestas de la API

```json
// Éxito
{ "ok": true }

// Error de validación
{ "ok": false, "error": "El nombre es obligatorio (mínimo 2 caracteres)" }

// Rate limit
{ "ok": false, "error": "Demasiadas solicitudes. Intenta de nuevo en un minuto." }

// Error de servidor
{ "ok": false, "error": "Error interno del servidor" }
```

---

## 🚀 Despliegue

### Build de producción estático

```bash
# Compilar
pnpm build
```

Para Arsys, sube el contenido de `dist/` al hosting. Consulta [ARSYS_DEPLOY.md](ARSYS_DEPLOY.md) para los pasos exactos.

---

## 🔧 Solución de Problemas

### El email no se envía

1. **Verifica las credenciales SMTP**: Usuario, password, host y puerto deben coincidir con tu proveedor
2. **Verifica el remitente**: `MAIL_FROM` debe ser un email autorizado por ese buzon o dominio
3. **Revisa los logs**: `console.log` muestra errores detallados
4. **Prueba el puerto alternativo**: Si `587` falla, consulta si tu proveedor usa `465` con `SMTP_SECURE=true`

### WhatsApp no funciona

1. **Sandbox no conectado**: Debes enviar el mensaje de join primero
2. **Número incorrecto**: Formato debe ser `whatsapp:+34XXXXXXXXX`
3. **Credenciales inválidas**: Verifica SID y Token en Twilio Dashboard
4. **Modo degradado**: Si `ENABLE_WHATSAPP=false`, no se envía pero no da error

### Error 429 (Too Many Requests)

El rate limit es de 5 solicitudes por minuto por IP. Espera un minuto.

### Honeypot detectado

Si el campo `website` tiene valor, se rechaza como spam.

---

## 📊 Logs esperados

```bash
# Éxito completo
✅ Email enviado a ines.guillermo.calet@gmail.com
✅ WhatsApp enviado a whatsapp:+34633010691

# WhatsApp deshabilitado
ℹ️ WhatsApp deshabilitado (ENABLE_WHATSAPP != true)

# Twilio no configurado (modo degradado)
⚠️ Twilio no configurado. Variables TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN requeridas.
⚠️ Continuando sin envío de WhatsApp (modo degradado)

# SMTP no configurado
⚠️ SMTP no configurado. Variables SMTP_HOST, SMTP_USER, SMTP_PASSWORD y MAIL_FROM requeridas.
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa este documento
2. Revisa los logs del servidor
3. Verifica las variables de entorno
4. Prueba con curl para aislar el problema
