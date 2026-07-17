# Evaluación de ApostropheCMS y decisión de arquitectura

Fecha de revisión: 17 de julio de 2026.

## Decisión

No se migra la web a ApostropheCMS. Se conserva Decap CMS con el flujo Git y pull requests existente, y se mejora su interfaz y organización editorial.

La razón no es la capacidad general de ApostropheCMS, sino la combinación concreta de requisitos de AZento Home: coste obligatorio cero, clientas capaces de subir imágenes, publicación siempre aprobada por un administrador, web Astro estática y hosting actual en Arsys.

## Auditoría del repositorio

| Área | Estado actual |
| --- | --- |
| Framework | Astro declarado como `^5.17.3` y resuelto a 5.18.2 por el lockfile, TypeScript estricto, React 19 y Tailwind CSS 3 |
| Renderizado | Generación estática; no hay adaptador SSR |
| Rutas | Inicio, dos divisiones, cuatro servicios detallados, tres páginas legales y una salida JSON generada para el formulario |
| Componentes | Layout, navegación, hero, servicios, galería, proceso/confianza, contacto, footer, cookies y analítica |
| Contenido | JSON en `src/content/cms`, validado con Zod y consumido únicamente mediante `src/lib/cms` |
| CMS actual | Decap CMS 3.14.1 con configuración en español, Editorial Workflow y GitHub Open Authoring |
| Medios | Imágenes dentro del repositorio, subida a `public/images/uploads`, límite de 3 MB validado en CI |
| Formulario | Componente Astro que envía JSON a `public/api/quote.php`; SMTP y WhatsApp son opcionales |
| Hosting | Sitio estático en Arsys Hosting Avanzado Linux; el endpoint de formulario se ejecuta con PHP |
| CI/CD | Validación y preview por pull request; despliegue aprobado de `main` a Arsys por SFTP/FTPS |
| Entorno | Analítica pública en Astro; SMTP/Twilio fuera del repositorio; OAuth y Arsys en secretos externos |
| Estado Git al auditar | Rama `feature/cms-integration` con una corrección local ya preparada en `public/admin/config.yml`; se preserva |

Las diez rutas públicas actuales se mantienen sin cambios:

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

## Contenido editable

- Datos generales, contacto, logotipos y SEO.
- Textos de la portada.
- Contenido de las dos divisiones.
- Servicios, su orden y visibilidad.
- Proyectos, imágenes, texto alternativo, encuadre, orden y visibilidad.
- Páginas detalladas de servicios, galerías, CTA y preguntas frecuentes.
- Datos identificativos interpolados en las páginas legales.

No se crean colecciones vacías para testimonios ni páginas individuales de proyecto porque no existen en el diseño actual. Se añadirán cuando exista una sección pública que las consuma.

## Contenido que permanece en código

- HTML, componentes, CSS, Tailwind, paleta, tamaños y comportamiento responsive.
- Rutas principales, iconos disponibles y estructura interna de cada sección.
- JavaScript del lightbox, formulario, cookies y analítica.
- PHP, SMTP, anti-spam y seguridad del formulario.
- Cuerpo de las políticas legales, que debe modificarse con revisión jurídica.

Mantener estos elementos en código evita convertir la web en un page builder y reduce el riesgo de romper el diseño.

## Encaje de ApostropheCMS

### Ventajas

- Community Edition gratuita y open source.
- Interfaz visual e in-context editing más moderna que Decap.
- Contenido estructurado, media library, recorte, focal point y API REST.
- Integración headless oficial con Astro.
- Borradores y envío a revisión incluidos en el núcleo.

### Bloqueadores

1. Los roles Community no cubren el caso de AZento. `Contributor` puede editar y enviar a revisión, pero no puede subir imágenes. `Editor` puede subir imágenes, pero también publicar sin aprobación. Los permisos que separan capacidades por grupo, tipo o documento pertenecen a Advanced Permissions de Apostrophe Pro.
2. Apostrophe Pro se anuncia desde 199 USD/mes. Incumple el requisito de coste obligatorio cero.
3. Apostrophe necesita un proceso Node.js permanente, MongoDB 7 o superior, almacenamiento persistente y, como recomendación oficial, 2 GB de RAM y 20 GB de disco. La producción actual solo sirve el build estático y PHP.
4. Separar Astro y Apostrophe obligaría a contratar o mantener infraestructura adicional, backups de base de datos y medios, actualizaciones, monitorización y secretos de API.
5. El preview visual in-context de Apostrophe funciona mejor cuando el frontend se adapta a su integración. Migrar la web actual aumentaría mucho el alcance sin mejorar SEO o rendimiento públicos.

Fuentes oficiales consultadas:

- [Planes y precios de ApostropheCMS](https://apostrophecms.com/pricing)
- [Permisos y flujo editorial](https://apostrophecms.com/docs/guide/permissions-and-workflow.html)
- [Requisitos de hosting](https://apostrophecms.com/docs/guide/hosting.html)
- [Uso headless](https://apostrophecms.com/docs/guide/headless-cms.html)
- [Gestión de imágenes](https://apostrophecms.com/docs/guide/media.html)

## Alternativas visuales revisadas

| Opción | Resultado para este proyecto |
| --- | --- |
| Sveltia CMS | UI más moderna y migración casi directa, pero su documentación específica todavía marca Editorial Workflow y Open Authoring como no implementados antes de 1.0. No puede sustituir hoy el control de publicación. |
| Keystatic | Buena integración con Astro y UI agradable. En modo GitHub exige acceso `write` y un runtime Node para sus rutas; no aporta el flujo obligatorio de aprobación sin desarrollo adicional. |
| Directus/Strapi/Payload | Paneles mejores, pero requieren aplicación persistente, base de datos, almacenamiento, backups y mantenimiento. Algunas capacidades editoriales avanzadas son de pago. |
| WordPress headless | Podría ejecutarse con PHP/MySQL, pero añade plugins, superficie de ataque, mantenimiento y una integración de preview/deploy más compleja. Los permisos básicos tampoco separan subida de medios y publicación sin personalización. |
| Decap CMS | Es menos atractivo visualmente, pero es el único ya integrado que cumple sin coste el flujo mediante fork, rama, pull request, validación y aprobación de `main`, sin servidor de contenido. |

Fuentes de las dos alternativas más próximas:

- [Limitaciones de migración de Sveltia CMS](https://sveltiacms.app/en/docs/migration/netlify-decap-cms)
- [Editorial Workflow de Sveltia CMS](https://sveltiacms.app/en/docs/workflows/editorial)
- [Open Authoring de Sveltia CMS](https://sveltiacms.app/en/docs/workflows/open)
- [Modo GitHub de Keystatic](https://keystatic.com/docs/github-mode)

## Arquitectura conservada

```text
Clienta -> Decap CMS -> fork/rama -> borrador -> pull request
                                      |
                                      v
                         validación + Astro check + build
                                      |
                                      v
Administrador -> revisión/preview -> solicita cambios o aprueba
                                      |
                                      v
                                merge a main
                                      |
                                      v
                         build estático -> Arsys
```

No se expone ningún token en el frontend y la web pública no depende de que el CMS, GitHub o una base de datos estén disponibles para responder.

## Mejoras aprobadas para esta rama

- Aplicar identidad visual de AZento al panel sin modificar el frontend público.
- Añadir una pantalla de ayuda y mensajes editoriales más claros.
- Simplificar la navegación y los nombres visibles de las secciones.
- Mantener los modelos estructurados; no añadir CSS libre ni un page builder.
- Conservar la validación de formatos, peso, dimensiones, alt, relaciones y estados vacíos.
- Actualizar las guías para explicar la decisión, las pruebas y el flujo real.

No se sustituye el proveedor de contenido ni se migra ningún dato externo, por lo que esta decisión es reversible con un cambio pequeño y no introduce dependencia adicional.
