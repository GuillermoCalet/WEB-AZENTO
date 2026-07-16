# Auditoría y decisión del CMS

Fecha de revisión: 16 de julio de 2026.

## Resultado

Se ha elegido **Decap CMS 3.14.1 con GitHub Open Authoring**. Es software libre, no cobra por usuaria ni por contenido y encaja con el Astro estático y el hosting Arsys actuales. La autenticación se resuelve con un proxy OAuth en Cloudflare Workers Free y la revisión con ramas y pull requests de GitHub. El coste obligatorio de esta arquitectura es **0 €**.

La integración incompleta de Sanity encontrada en la rama se ha retirado porque el flujo requerido necesita roles de pago. No se ha conectado ninguna cuenta ni migrado contenido a un proveedor externo.

## Arquitectura auditada

| Área | Estado encontrado |
| --- | --- |
| Framework | Astro 5.17.3, TypeScript, React 19 y Tailwind CSS 3 |
| Renderizado | Estático; no existe adaptador SSR instalado |
| Páginas | Inicio, dos divisiones, cuatro servicios detallados y tres páginas legales |
| Rutas | 10 rutas públicas conservadas sin cambios |
| Componentes | Layout, Navbar, Hero, Services, Gallery, ProcessTrust, Contact, Footer, cookies y analítica |
| Contenido | Dos grandes archivos TypeScript y textos repetidos dentro de páginas/componentes |
| Proyectos | 12 proyectos dentro de las dos divisiones; no hay páginas de proyecto individuales |
| Servicios | 14 tarjetas, de las que cuatro tienen página detallada |
| FAQ | 12 preguntas dentro de las cuatro páginas de servicio |
| Testimonios | No existen; no se ha creado una colección vacía ni contenido ficticio |
| Imágenes | Recursos locales en `public/images`; varias imágenes grandes y cinco archivos HEIF con extensión PNG que no están usados por el contenido migrado |
| Formularios | Formulario Astro que envía JSON a `public/api/quote.php`; SMTP y WhatsApp opcional |
| Entorno | Variables SMTP/Twilio; analítica usa `PUBLIC_GA_MEASUREMENT_ID` |
| Hosting | Arsys Hosting Avanzado Linux; contenido de `dist/` subido manualmente por FTP/SFTP |
| CI/CD | No había workflows de GitHub ni despliegue automático |
| Repositorio | GitHub, remoto `GuillermoCalet/WEB-AZENTO` |

### Rutas preservadas

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

## Contenido editable detectado

- Datos de marca, logotipos, teléfono, email, zona, dirección, Instagram, horario, textos del footer y SEO general.
- Textos y SEO de la portada.
- Hero, introducciones, procesos, bloques de confianza y formulario de las dos divisiones.
- Tarjetas de servicios: alta, edición, ocultación, borrado y orden.
- Proyectos: alta, edición, ocultación, borrado, orden, imagen, encuadre, categoría, texto alternativo y pie opcional.
- Las cuatro páginas detalladas: textos, características, elementos incluidos, galería, CTA, FAQ, visibilidad y SEO.
- CIF, razón social, dirección y registro mercantil que se interpolan en las páginas legales.

## Contenido protegido en código

- CSS, Tailwind, paleta, tamaños, posiciones generales, responsive y estructura HTML.
- Componentes, iconos disponibles y comportamiento del lightbox/formulario/cookies.
- Rutas principales de las dos divisiones.
- Cuerpo de las políticas legales. Puede cambiar por requisitos normativos y debe revisarlo asesoría legal; las clientas solo gestionan los datos identificativos.
- Implementación PHP, SMTP, validación anti-spam y permisos.
- Opciones de cookies y Google Analytics.

No se ha creado un page builder genérico. Las listas reordenables cubren el contenido real sin permitir romper el diseño.

## Riesgos y correcciones

1. **Contenido duplicado:** teléfono, email y datos legales estaban repetidos. Ahora salen de una configuración validada.
2. **Formulario desincronizado:** PHP tenía otra lista fija de servicios. El build genera `/api/quote-services.json`; PHP la valida y mantiene una lista interna de respaldo.
3. **Imágenes inválidas:** se detectaron archivos HEIF con extensión `.png`. La validación comprueba extensión, firma real, existencia, peso y dimensiones antes de aprobar.
4. **Galería vacía:** antes accedía siempre al primer proyecto. Ahora tiene fallback seguro y mensaje de estado vacío.
5. **Publicación accidental:** las clientas no reciben escritura en el repositorio; Open Authoring solo les permite crear un PR.
6. **Datos legales provisionales:** `B12345678` y los datos registrales siguen siendo los valores existentes. Deben sustituirse por los reales tras revisión legal.
7. **Hosting manual:** se añade CI y despliegue condicional. Hasta configurar secretos de Arsys, GitHub genera un artefacto y omite la subida.
8. **Dependencias:** el proyecto no tenía lint ni tests. Se han añadido validación CMS, typecheck y build como controles obligatorios.

## Comparativa

La comparación usa los planes publicados en julio de 2026. Conviene revisar precios si se reconsidera la decisión.

| CMS | Coste gratuito útil | Revisión/aprobación gratuita | Experiencia y medios | Infraestructura/mantenimiento | Decisión |
| --- | --- | --- | --- | --- | --- |
| **Decap CMS** | Software libre, sin límite propio de usuarias o registros | Sí mediante Editorial Workflow + Open Authoring + PR | Formularios controlados, listas y carga/reordenación de imágenes; preview por deploy | Sin base de datos ni servidor CMS; OAuth Worker gratuito | **Elegido** |
| Sanity | Free útil para administración/lectura | El rol colaborador que no publica pertenece a Growth, desde 15 USD por asiento/mes | Studio muy bueno y contenido estructurado | SaaS externo y dataset propietario | Descartado por coste por clienta |
| Storyblok | Starter gratuito limitado a una plaza | Workflows/roles avanzados no cubren gratis este equipo | Editor visual excelente | SaaS y límites de plan | Descartado por plazas/coste |
| DatoCMS | Free: pocas editoras, registros y medios | Workflow editorial completo en planes de pago | Muy buena UX e imágenes | SaaS; límites reducidos y plan profesional caro | Descartado por workflow/coste |
| Contentful | Plan Free disponible | Roles gratuitos insuficientes para impedir publicación con aprobación separada | Editor estructurado y CDN | SaaS, límites y complejidad de modelo | Descartado |
| Directus | Core gratuito al autoalojar | Flujos y permisos potentes | Buen panel y ficheros | Requiere servidor, base de datos, actualizaciones y backups | Descartado por mantenimiento adicional |
| Strapi | Community autoalojada | Review Workflows es una función Enterprise | Buen panel estructurado | Servidor Node, BD, medios y parches | Descartado |
| Payload CMS | Código abierto autoalojado | Puede programarse, pero no ofrece este flujo sin trabajo adicional | Flexible para desarrolladores | Servidor Node/BD y mantenimiento | Descartado |
| WordPress Headless | Software gratuito | Roles básicos; aprobación sólida suele requerir plugins/proceso | Familiar, biblioteca multimedia madura | PHP/BD, plugins, superficie de ataque y actualizaciones | Descartado |

Fuentes principales:

- [Decap Open Authoring](https://decapcms.org/docs/open-authoring/)
- [Decap Editorial Workflow](https://decapcms.org/docs/editorial-workflows/)
- [Decap OAuth proxy](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy)
- [Sanity pricing](https://www.sanity.io/pricing)
- [Storyblok pricing](https://www.storyblok.com/pricing)
- [DatoCMS pricing](https://www.datocms.com/pricing)
- [Directus pricing](https://directus.io/pricing)
- [Strapi pricing](https://strapi.io/pricing)
- [Contentful pricing](https://www.contentful.com/pricing/)

## Arquitectura final

```text
Clienta → /admin/ → OAuth GitHub → fork/branch de la clienta
        → Borrador → Lista para revisión → Pull request
        → validación de JSON/imágenes + Astro check + build
        → deploy preview gratuito
Administrador → revisa preview y PR → solicita cambios, rechaza o aprueba
        → merge a main → build → artefacto → SFTP/FTPS a Arsys
```

La producción sigue siendo estática. No hay consultas al CMS en el navegador, tokens en el frontend ni dependencia de una API externa para servir la web. SEO y rendimiento se mantienen.

## Coste y límites

- Decap CMS: 0 €.
- GitHub Free: 0 € dentro de sus límites.
- Cloudflare Workers Free para OAuth: 0 € dentro de su cuota.
- Netlify Free para deploy previews: 0 € dentro de su cuota, sin activar recargas ni complementos.
- Arsys: es el hosting existente; la integración no añade una tarifa.

Si se supera una cuota gratuita, el servicio debe detenerse, no cambiarse automáticamente a un plan de pago. La arquitectura puede funcionar sin Netlify: se conserva el artefacto de preview de GitHub Actions y el despliegue de producción.
