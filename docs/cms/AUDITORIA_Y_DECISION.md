# Auditoria CMS y decision tecnica

Fecha de revision: 2026-07-16

## 1. Estado actual

- Framework: Astro `^5.17.3`, React `^19.2.3` y Tailwind CSS `^3.4.19`.
- Renderizado: salida estatica de Astro. No hay adaptador SSR ni modo hibrido.
- Build verificado: 10 paginas estaticas, sin errores, en aproximadamente 2 segundos.
- Hosting: Arsys Hosting Avanzado Linux. Se sube manualmente el contenido de `dist/`.
- Backend existente: `public/api/quote.php` procesa presupuestos mediante PHP, SMTP y Twilio opcional.
- Repositorio: GitHub (`GuillermoCalet/WEB-AZENTO`). No hay workflows de GitHub Actions ni otra CI/CD versionada.
- Rama de partida: `reestructuracion-web`; la rama por defecto remota es `main`.
- Gestor efectivo: existe `package-lock.json`; la documentacion menciona pnpm y `.gitignore` ignora `pnpm-lock.yaml`. Se normalizara la documentacion en npm sin cambiar de gestor durante esta integracion.
- Variables actuales: SMTP, Twilio y `PUBLIC_GA_MEASUREMENT_ID`. Los secretos PHP pueden vivir en `public/api/quote-config.php`, que esta ignorado por Git.

## 2. Rutas y componentes

Rutas existentes:

- `/`
- `/madera-tecnologica`
- `/reformas`
- `/servicios/jardines-terrazas`
- `/servicios/pergolas-celosias`
- `/servicios/fachadas-revestimientos`
- `/servicios/reformas-interiores`
- `/aviso-legal`
- `/politica-privacidad`
- `/politica-cookies`

La presentacion esta bien dividida en componentes: `BusinessPage`, `Navbar`, `Hero`, `Services`, `Gallery`, `ProcessTrust`, `Contact`, `Footer`, `CookieBanner` y `GoogleAnalytics`. `Welcome.astro` y los SVG de ejemplo de Astro no se usan.

## 3. Contenido actual

Fuentes principales:

- `src/data/businessUnits.ts`: dos divisiones, 14 tarjetas de servicio, 12 proyectos, heroes, proceso, confianza, formularios y SEO.
- `src/data/services.ts`: cuatro servicios con detalle, galerias, listas, CTA y 12 preguntas frecuentes.
- `src/pages/index.astro`: textos de inicio, SEO y contacto.
- `src/components/Contact.astro`, `Footer.astro`, `Navbar.astro` y `ProcessTrust.astro`: contacto y rotulos repetidos.
- Paginas legales: texto completo y datos societarios escritos en cada pagina.

No existen testimonios ni una seccion de testimonios. Tampoco existen paginas individuales de proyecto. No se crearan colecciones o rutas que la web no utiliza.

## 4. Contenido que pasara al CMS

- Configuracion general: marca, logos, telefono, email, direccion/zona, Instagram, datos societarios y SEO general.
- Inicio: antetitulo, titulo, subtitulo, textos de contacto y SEO.
- Divisiones: hero, textos de seccion, proceso, confianza, CTA, opciones de formulario y SEO.
- Servicios: nombre, slug, division, resumen, contenido largo, caracteristicas, incluidos, icono controlado, imagen, galeria, CTA, FAQ, visibilidad y SEO.
- Proyectos: division, titulo, slug, categoria, imagen principal, galeria, textos alternativos, pies, orden, destacado y visibilidad.
- Paginas legales: titulo, fecha, SEO y cuerpo estructurado, manteniendo exactamente el contenido actual.

## 5. Contenido que permanecera en codigo

- Componentes, layouts, Tailwind, colores, tipografias, espaciado y responsive.
- Rutas base, secciones permitidas y componentes de bloque disponibles.
- Iconos y el mapa controlado de iconos de servicio.
- Estructura y validacion del formulario, anti-spam, rate limit, SMTP y Twilio.
- Consentimiento de cookies y carga condicional de Analytics.
- Generacion de canonical, Open Graph y metadatos tecnicos.
- Consultas GROQ, validaciones Zod, fallbacks y transformacion de imagenes.

Esto impide que una editora pueda introducir CSS, pixeles, scripts o una estructura arbitraria.

## 6. Riesgos detectados

- Los datos de contacto estan duplicados en varias paginas y componentes.
- Las opciones del formulario estan duplicadas en TypeScript y PHP; pueden desincronizarse.
- El CIF `B12345678` y los datos registrales son valores provisionales. Deben revisarse legalmente antes de publicar.
- Cinco archivos con extension `.png` son realmente HEIF. No todos los navegadores los interpretan y Sanity debe rechazarlos o convertirlos antes de migrarlos.
- Varias imagenes PNG pesan entre 1 y 2.9 MB. El CMS debe aplicar limites y servir variantes optimizadas.
- No hay lint, typecheck dedicado ni pruebas automatizadas configuradas.
- Los ZIP de despliegue estan versionados y pueden quedar obsoletos.
- El despliegue es manual y no existe reconstruccion automatica al cambiar contenido.
- El endpoint PHP confia en `X-Forwarded-For` sin comprobar un proxy de confianza. No afecta a la integracion CMS, pero limita la robustez del rate limit.

## 7. Comparativa de CMS

Precios y limites consultados el 2026-07-16; pueden cambiar.

| CMS | Encaje | Flujo editorial | Coste orientativo | Decision |
| --- | --- | --- | --- | --- |
| Sanity | Integracion directa con Astro, contenido estructurado, excelente gestion/optimizacion de imagenes y Studio personalizable en espanol | El rol Contributor de Growth edita borradores y no puede publicar; comentarios, tareas y borradores programados | Free: 0 USD, pero solo Administrador/Lector. Growth: 15 USD por asiento/mes | Elegido |
| Decap CMS | Muy simple para sitio estatico y contenido en Git | Editorial Workflow crea ramas y PR, pero Git Gateway no separa de forma segura editor y publicador dentro del CMS | Software gratuito; requiere Netlify/Git y configuracion de identidad | Descartado por permisos y crecimiento del repositorio con imagenes |
| Storyblok | Mejor editor visual de la comparativa y buen CDN de imagenes | Flujos/roles personalizados quedan en planes altos | Starter 0 USD con 1 asiento; Growth 99 USD/mes; Growth Plus 349 USD/mes | Excesivo para este sitio y equipo |
| DatoCMS | Muy buena experiencia, imagenes y Astro | Workflow editorial no esta en Free | Free: 2 editores/300 registros/200 MB; Professional desde 149 EUR/mes anual | Coste alto |
| Contentful | Solido, escalable y buen ecosistema | Free limita los roles a Admin/Editor y no resuelve la aprobacion estricta | Free hasta 10 usuarios, 100k API/mes y 50 GB de CDN | Modelo y UI mas complejos de lo necesario |
| Directus | Permisos granulares, archivos y API excelentes | Se puede modelar el flujo, pero necesita instancia, base de datos y almacenamiento | Cloud desde 15 USD/mes con 1 usuario; Professional 99 USD/mes con 5 | Servidor adicional y mas mantenimiento |
| Strapi | Open source, buen modelado y media library | Draft/Publish es comun; Review Workflows es Enterprise | Hosting Cloud desde 0/15 USD; licencia CMS Growth 45 USD/mes para 3 asientos; workflow avanzado Enterprise | Dos capas de coste y servidor Node |
| Payload CMS | Permisos y borradores muy flexibles en codigo | Se puede impedir publicar a editores de forma robusta | Software open source; requiere servidor Node, base de datos y almacenamiento | Excelente tecnicamente, innecesario para Arsys estatico |
| WordPress Headless | Familiar para muchas editoras, roles y revisiones maduros | Posible con roles/plugins | Software gratuito, pero requiere hosting, plugins, seguridad y mantenimiento | Demasiada superficie operativa y mayor riesgo de plugins |

Fuentes principales:

- Sanity: https://www.sanity.io/pricing y https://www.sanity.io/docs/user-guides/roles
- Decap: https://decapcms.org/docs/editorial-workflows/
- Storyblok: https://www.storyblok.com/pricing
- DatoCMS: https://www.datocms.com/pricing
- Contentful: https://www.contentful.com/pricing/
- Directus: https://directus.io/pricing/
- Strapi: https://strapi.io/pricing-cms
- Payload: https://payloadcms.com/docs/versions/drafts

## 8. Decision

Se utilizara Sanity Studio con el plan Growth.

Motivos determinantes:

1. El rol Contributor impide publicar a las clientas a nivel de permisos, no solo ocultando un boton.
2. No requiere desplegar ni mantener un servidor o base de datos propios.
3. Las imagenes se suben, recortan, reordenan y sirven desde CDN con formatos y tamanos optimizados.
4. El esquema puede limitar campos, longitudes, formatos, cantidad de imagenes y bloques disponibles.
5. Astro seguira generando HTML estatico publicado, por lo que SEO y rendimiento no dependen de una consulta CMS en cada visita.
6. El coste es menor que las alternativas con workflow equivalente y la migracion futura queda cubierta por exportaciones JSON/NDJSON y una capa de acceso aislada.

## 9. Flujo editorial

1. La clienta entra en Sanity Studio con rol Contributor.
2. Crea o edita contenido; Sanity guarda un borrador y conserva la version publicada.
3. Marca el documento como `Pendiente de revision`.
4. Un webhook genera una reconstruccion del sitio de preview con la perspectiva de borradores.
5. El administrador revisa el documento, la previsualizacion y los comentarios.
6. El administrador devuelve cambios con comentarios/tareas o aprueba y publica.
7. Solo el rol Administrador puede ejecutar la publicacion.
8. Un webhook de contenido publicado dispara GitHub Actions, compila Astro y despliega `dist/` en Arsys.

El estado editorial complementa el borrador nativo con `borrador`, `pendiente_revision` y `cambios_solicitados`. La publicacion real sigue siendo la operacion protegida de Sanity.

## 10. Arquitectura resultante

- Produccion: Astro estatico en Arsys, leyendo solo contenido publicado durante el build.
- CMS: Sanity Content Lake y Sanity Studio alojado.
- Preview: build estatico separado en Netlify, sin indexacion, con token de solo lectura de borradores.
- Publicacion: webhook de Sanity a GitHub Actions y despliegue FTP/SFTP a Arsys.
- Codigo: `src/lib/cms/` concentra cliente, consultas, validacion, fallbacks e imagenes.
- Migracion: JSON local versionado y script idempotente que sube las imagenes actuales y crea los documentos.
- Backups: exportacion periodica NDJSON de Sanity mas historial de Assets y copia del repositorio.

