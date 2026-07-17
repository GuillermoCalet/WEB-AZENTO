# Plan de implementación del CMS

## Estado

- [x] Auditoría de Astro, rutas, componentes, contenido, imágenes, formulario, entorno y hosting.
- [x] Comparativa y elección de una solución sin coste obligatorio.
- [x] Modelos de contenido y validación.
- [x] Migración de textos, imágenes, proyectos, servicios y FAQ existentes.
- [x] Capa central `src/lib/cms/`.
- [x] Panel Decap en español y flujo editorial.
- [x] Integración del formulario PHP.
- [x] Workflows de revisión y despliegue.
- [x] Guías técnica y de clientas.
- [x] Build, typecheck y validación de imágenes.
- [ ] Configuración manual de OAuth, permisos de GitHub, preview y secretos de Arsys.
- [ ] Sustitución de CIF/registro provisionales tras validación legal.

## Estructura

```text
public/admin/
  index.html             Panel del CMS
  config.yml             Campos, listas, ayudas y workflow
  azento-cms.js          Slugs automáticos y avisos
src/content/cms/
  site-settings.json     Marca, contacto, legal y SEO general
  home.json              Portada
  madera-tecnologica.json Página, servicios y proyectos de madera
  servicios-madera.json   Páginas detalladas, galerías y FAQ de madera
  reformas.json            Página, servicios y proyectos de reformas
  servicios-reformas.json Páginas detalladas, galerías y FAQ de reformas
src/lib/cms/
  types.ts               Contratos TypeScript
  schemas.ts             Validaciones Zod
  repository.ts          Lectura, filtrado y consultas
  service-icons.ts       Iconos permitidos por diseño
scripts/cms/
  validate-content.mjs   Validación de contenido e imágenes
.github/workflows/
  cms-review.yml         Control de cada PR
  deploy-arsys.yml       Publicación de main aprobada
```

## Decisiones de modelo

- Inicio y configuración son documentos únicos.
- El panel se organiza por negocio: «Madera tecnológica» y «Reformas», no por tipos técnicos globales.
- Las divisiones son exactamente dos porque sus rutas y estilos forman parte del diseño.
- Servicios y proyectos son listas controladas, añadibles y reordenables.
- Las páginas detalladas de servicio son una lista separada para no obligar a que todas las tarjetas tengan ruta propia.
- FAQ pertenece al servicio real donde se muestra.
- No se crea testimonios porque la web no los tiene.
- No se crean páginas de proyecto porque no existen rutas ni diseño para ellas.
- No se permite ordenar secciones completas: su orden forma parte de la composición aprobada.

## Publicación

1. La clienta guarda un borrador en su fork.
2. Lo mueve a «Lista para revisión».
3. Decap crea un pull request.
4. GitHub ejecuta validación CMS, Astro check y build.
5. Netlify puede publicar una vista previa temporal.
6. El administrador solicita cambios, cierra o aprueba.
7. Solo el merge a `main` dispara producción.
8. Si Arsys aún no tiene secretos, se genera un ZIP/artefacto listo para subida manual.

## Validaciones de medios

- JPG/JPEG, PNG o WebP reales; no basta con cambiar la extensión.
- Máximo 3 MB por archivo.
- Entre 300 × 300 y 8000 × 8000 px para contenido; logo existente permitido desde 64 px.
- Texto alternativo obligatorio en imágenes informativas.
- Hasta 20 proyectos, imágenes por galería y FAQ por servicio.
- Archivo local existente y ruta dentro de `/images/`.

Recomendación editorial: 1600–2400 px de lado largo, WebP o JPEG, menos de 1 MB y proporción 4:3 para galerías. Las imágenes principales admiten el encuadre controlado definido en el CMS.
