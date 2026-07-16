# Guía técnica del CMS

## Resumen

La web sigue siendo Astro estático. Decap CMS edita archivos JSON del repositorio; producción nunca consulta un SaaS ni necesita un token de lectura. La validación Zod ocurre al cargar la capa CMS y un script adicional comprueba imágenes y relaciones.

## Componentes

- `public/admin/config.yml`: modelo y UX del panel en español.
- `src/content/cms/*.json`: fuente de verdad publicada.
- `src/lib/cms/repository.ts`: única puerta de acceso de páginas y componentes.
- `src/lib/cms/schemas.ts`: límites de texto, slugs, rutas, estados, listas e imágenes.
- `scripts/cms/validate-content.mjs`: firma real, peso, dimensiones, alt, duplicados y referencias.
- `src/pages/api/quote-services.json.ts`: allowlist generada para PHP.
- `public/api/quote.php`: consume la allowlist tras validarla y conserva un fallback.

## Modelos

### Configuración general

Marca y razón social, URL, dos logos, teléfono, email, ubicación, dirección, WhatsApp/horario opcionales, Instagram, texto del footer, CIF, registro y SEO general.

### Inicio

Estado, SEO, etiqueta, H1, introducción, textos de tarjetas y contacto. La página es estructurada; no admite bloques libres.

### Divisiones

Existen exactamente `madera_tecnologica` y `reformas`. Cada una incluye hero, SEO, servicios, proyectos, proceso, confianza y opciones de formulario. Las listas se filtran por `visible` y mantienen el orden del JSON.

### Servicios detallados

Slug, división, publicado, icono permitido, textos, características, bullets, galería con alt/pie, CTA, FAQ visibles y SEO. Solo los documentos publicados generan una ruta estática.

### Entidades no creadas

No hay testimonios ni páginas individuales de proyecto en el diseño actual. Añadirlas requiere primero diseño, ruta y modelo, no una colección vacía.

## Desarrollo local

```bash
npm install
npm run dev
```

En otro terminal:

```bash
npm run cms:dev
```

Abre `http://localhost:4321/admin/index.html`. `local_backend: true` permite que Decap escriba en el repositorio local a través de `decap-server`; no usa OAuth.

Controles completos:

```bash
npm run cms:validate
npm run check
npm run build
# o todos:
npm run validate
```

No hay script de lint ni suite de tests en el proyecto original.

## Preview

Decap encuentra automáticamente una URL de preview cuando el commit tiene un estado cuyo nombre contiene «deploy». Se recomienda conectar el repositorio a Netlify Free solo para previews:

- Build command: `npm run validate`.
- Publish directory: `dist`.
- Production branch: `main`.
- Deploy previews para pull requests: activados.
- Recargas/uso de pago y add-ons: desactivados.

La producción y el DNS continúan en Arsys. Si Netlify no se configura, `cms-review.yml` guarda `dist` como artefacto durante siete días.

## Despliegue

`deploy-arsys.yml` se ejecuta al cambiar `main`:

1. `npm ci`.
2. validación CMS, Astro check y build.
3. artefacto de producción durante 30 días.
4. mirror sin borrado por SFTP/FTPS si existen secretos `ARSYS_*`.

La subida no usa `--delete`, para no borrar `api/quote-config.php` ni archivos del hosting ajenos al build. Los recursos Astro con hash antiguos pueden limpiarse manualmente de forma periódica.

## Seguridad

- No hay tokens en Astro ni en el bundle.
- `GITHUB_OAUTH_SECRET` vive solo en Cloudflare Workers.
- Credenciales Arsys viven solo en GitHub Actions Secrets.
- SMTP/Twilio viven en `api/quote-config.php` del servidor o variables del hosting.
- Los PR de forks reciben permisos de GitHub Actions de solo lectura y no reciben secretos.
- Las clientas no deben tener permiso `write`; Open Authoring les impide publicar.
- Proteger `main` con PR, una aprobación y el check «Contenido, tipos y compilación».
- Las imágenes se validan por firma, no solo por extensión.
- Los textos se renderizan como texto de Astro; no se ofrece HTML enriquecido, evitando inyección.
- `quote.php` vuelve a validar las opciones generadas antes de usarlas.

### CORS

La web pública no consulta el OAuth Worker. El proxy solo redirige entre `/admin/` y GitHub; no debe implementar un CORS abierto para tokens. Use el template recomendado por Decap y manténgalo actualizado.

## Backups y reversión

Git es la copia histórica primaria:

- Revertir una publicación: crear un PR que revierta el commit/merge afectado; no reescribir `main`.
- Recuperar un borrado: restaurar el JSON o imagen desde el historial.
- Backup mensual: exportar/clonar el repositorio y conservar un artefacto reciente de producción.
- Backup del hosting: conservar `api/quote-config.php` fuera de Git y usar las copias de Arsys.
- Backup de OAuth/CI: inventariar nombres de secretos y configuración, nunca sus valores en documentación.

Las imágenes viven en Git. GitHub no es adecuado para crecimiento masivo: si el repositorio se acerca a límites operativos, migrar medios a un DAM/CDN antes de usar Git LFS, ya que Decap/GitHub y previews deben probarse con cualquier cambio.

## Mantenimiento

- Mensual: revisar PR fallidos y dependencias.
- Trimestral: `npm audit`, actualización de Astro/Decap en una rama y prueba completa.
- Anual: revisar usuarios con acceso, OAuth App, secretos, datos legales y políticas.
- Tras cada alta/baja: revocar acceso GitHub inmediatamente y cerrar borradores pendientes.

## Migración futura

Los datos son JSON tipado sin campos propietarios. Para migrar:

1. Exportar `src/content/cms` e imágenes.
2. Mapear los tipos de `src/lib/cms/types.ts` al nuevo CMS.
3. Crear un adaptador en `repository.ts` que devuelva los mismos tipos.
4. Importar medios manteniendo alt y orden.
5. Comparar rutas/slugs y generar redirecciones si cambian.
6. Ejecutar build y revisión visual antes de retirar Decap.

Los componentes no conocen GitHub ni Decap; por eso una migración no exige rediseñarlos.

## Dependencias

Decap se carga en `/admin/` desde un CDN con versión fijada. `decap-server` es la única dependencia nueva de desarrollo. Zod ya estaba presente y se usa para validar los JSON.

Tras `npm audit fix` quedan tres avisos transitivos (dos bajos y uno alto) cuya corrección exige Astro 7, un salto mayor fuera del alcance del CMS. Esta web se publica como HTML estático y no ejecuta Astro/Vite en Arsys; además no usa server islands, atributos dinámicos de nombres ni contenido HTML del CMS. Aun así, debe planificarse la migración a Astro 7 en una rama separada y no ejecutar el servidor de desarrollo en redes no confiables.
