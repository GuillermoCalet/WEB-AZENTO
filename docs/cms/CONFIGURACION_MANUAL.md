# Configuración manual para activar el CMS

Estos pasos requieren las cuentas de la empresa y no pueden completarse solo desde el repositorio. Ningún paso exige contratar un plan.

## 1. Comprobar el repositorio

La configuración apunta a `GuillermoCalet/WEB-AZENTO`, rama `main`.

- Repositorio público: las clientas no necesitan acceso al repositorio.
- Repositorio privado: cada clienta necesita acceso **Read**, y `auth_scope: repo` debe mantenerse. Se recomienda una organización GitHub Free para asignar roles de solo lectura.
- No conceder `Write`, `Maintain` ni `Admin` a clientas.
- Si una cuenta privada no permite read-only de forma segura, no activar a esa clienta hasta mover el repo a una organización o revisar la arquitectura.

## 2. Crear OAuth App en GitHub

En la cuenta/organización propietaria:

1. Settings → Developer settings → OAuth Apps → New OAuth App.
2. Application name: `AZento Home CMS`.
3. Homepage URL: `https://cms-auth.azentohome.com`.
4. Callback URL: `https://cms-auth.azentohome.com/callback`.
5. Guardar Client ID y generar Client Secret.

No guardar el secret en Git, `.env`, Astro, Netlify ni Arsys.

## 3. Desplegar OAuth en Cloudflare Workers Free

Use el template que enlaza la documentación oficial de Decap:

- [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy)
- [Guía oficial de OAuth de Decap](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy)

Pasos:

1. Cree una cuenta Cloudflare Free.
2. Use el template `decap-proxy` y despliegue un Worker.
3. Añada como secretos del Worker:
   - `GITHUB_OAUTH_ID`
   - `GITHUB_OAUTH_SECRET`
4. Si el repo es privado, active `GITHUB_REPO_PRIVATE=1` según el template.
5. Asigne `cms-auth.azentohome.com` como dominio personalizado, o cambie `base_url` en `public/admin/config.yml` por la URL `workers.dev`.
6. Pruebe `https://cms-auth.azentohome.com/auth`.

Mantener el Worker en el plan Free y sin servicios de pago. La cuota es muy superior al tráfico normal de un panel editorial pequeño.

## 4. Proteger main

GitHub → Settings → Branches/Rulesets:

- Target: `main`.
- Require a pull request before merging.
- Require at least 1 approval.
- Require status check: `Contenido, tipos y compilación`.
- Require conversation resolution.
- Block force pushes and deletions.
- Permitir merge solo a administradores/mantenedores.

Las clientas de Open Authoring siguen sin poder hacer merge aunque no exista esta regla; la protección también evita errores de otros usuarios con escritura.

## 5. Crear usuarias

1. Pida a cada clienta una cuenta gratuita de GitHub con 2FA.
2. Si el repo es privado, añada solo permiso `Read`. Como el scope OAuth `repo` abarca los repositorios privados accesibles por esa cuenta, es preferible que la cuenta editorial no tenga acceso a ningún otro repositorio. Si el repo pasa a ser público, cambie `auth_scope` a `public_repo`.
3. Envíe únicamente `https://azentohome.com/admin/index.html` y la guía de clientas.
4. Haga una prueba: crear borrador, enviar a revisión y confirmar que no aparece opción de publicar.

No se crean usuarias dentro de Decap: la identidad la gestiona GitHub.

## 6. Preview gratuito

Opción recomendada: Netlify Free sin mover producción.

1. Cree un site desde el repositorio.
2. Use `npm run validate` y directorio `dist`.
3. Active Deploy Previews para PR.
4. No cambie DNS ni el dominio de producción.
5. Desactive recargas automáticas, add-ons y cualquier opción de pago.
6. Confirme que el PR recibe un estado con la palabra `deploy`; Decap mostrará el enlace de preview.

Si no se usa Netlify, descargue el artefacto `vista-previa-cms-*` de GitHub Actions. Esta alternativa sigue costando 0 €, aunque la revisión visual es menos cómoda.

## 7. Despliegue en Arsys

GitHub → Settings → Secrets and variables → Actions:

| Secret | Ejemplo/uso |
| --- | --- |
| `ARSYS_PROTOCOL` | `sftp` o `ftps`; evitar `ftp` |
| `ARSYS_HOST` | Host indicado por Arsys |
| `ARSYS_PORT` | `22` para SFTP o el indicado |
| `ARSYS_USERNAME` | Usuario del hosting |
| `ARSYS_PASSWORD` | Contraseña |
| `ARSYS_REMOTE_DIR` | Raíz pública, por ejemplo `/html/` |
| `ARSYS_KNOWN_HOSTS` | Línea de clave de host suministrada/verificada para SFTP |

Hasta que `ARSYS_HOST` exista, el workflow compila y guarda un artefacto sin intentar subir nada.

Mantenga `api/quote-config.php` únicamente en Arsys. El workflow no borra archivos remotos.

## 8. Validación final

1. Acceder como clienta.
2. Cambiar un texto y una imagen de prueba.
3. Guardar como borrador.
4. Enviar a revisión.
5. Confirmar que aparece PR y pasan todos los checks.
6. Abrir el deploy preview.
7. Solicitar una corrección desde el PR y corregir desde Decap.
8. Aprobar y hacer merge como administrador.
9. Confirmar build, subida a Arsys y formulario.
10. Revertir el cambio de prueba mediante otro PR.

## 9. Datos pendientes

Antes de publicar la activación:

- Sustituir CIF `B12345678`.
- Sustituir datos de Registro Mercantil.
- Confirmar dirección legal.
- Confirmar el protocolo y ruta remota de Arsys.
- Revisar las políticas con asesoría legal.
