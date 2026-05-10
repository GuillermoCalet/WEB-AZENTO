# Despliegue en Arsys

Esta web está preparada para subirse como sitio estático a Hosting Avanzado Linux de Arsys. No subas el repositorio completo: sube solo el contenido de `dist/`.

## 1. Configura el formulario

El formulario usa `public/api/quote.php`. Antes de compilar, crea el archivo privado de configuración:

```bash
cp public/api/quote-config.example.php public/api/quote-config.php
```

Edita `public/api/quote-config.php` con los datos SMTP reales del correo de AZento Home. Este archivo está en `.gitignore` para no guardar contraseñas en el repo.

## 2. Compila la web

```bash
npm run build
```

Astro generará la web final en `dist/`. Ahí estarán los HTML, imágenes, CSS/JS y el endpoint PHP:

```text
dist/
├── index.html
├── _astro/
├── images/
├── api/
│   ├── quote.php
│   └── quote-config.php
└── servicios/
```

## 3. Sube a Arsys

En el panel de Arsys puedes usar `Subir/Bajar .ZIP` o FTP/SFTP.

Sube el contenido de `dist/` a la raíz pública del dominio. No subas estas carpetas/archivos:

```text
src/
node_modules/
.git/
.env
package.json
astro.config.mjs
```

Si haces un ZIP, comprime el contenido de `dist/`, no la carpeta `dist` como carpeta superior.

## 4. Prueba

1. Abre `https://azentohome.com`.
2. Comprueba que las páginas de servicios cargan.
3. Abre `https://azentohome.com/api/quote.php`. Debe responder algo parecido a `{"ok":false,"error":"Método no permitido"}`. Si ves una página 404, 500 o código PHP, el endpoint no está subido en el sitio correcto o PHP no se está ejecutando.
4. Envía una prueba desde el formulario.
5. Si falla el formulario, revisa `api/quote-config.php`: host, puerto, usuario, contraseña SMTP y `MAIL_FROM`.

Para puerto `587`, normalmente usa:

```php
'SMTP_SECURE' => false,
```

Para puerto `465`, normalmente usa:

```php
'SMTP_SECURE' => true,
```
