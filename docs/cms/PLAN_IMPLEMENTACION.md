# Plan de implementacion del CMS

## Alcance

La integracion conservara rutas, textos, imagenes, SEO, estilos y responsive actuales. No se convertira la web en un page builder generico.

## Fase A. Base de contenido

1. Crear la rama `feature/cms-integration` desde `reestructuracion-web`.
2. Anadir tipos TypeScript, esquemas Zod, cliente Sanity y consultas centralizadas.
3. Extraer el contenido actual a fallbacks JSON validados.
4. Adaptar paginas y componentes para recibir datos por props.
5. Mantener la web operativa sin variables de Sanity mediante los fallbacks.

## Fase B. Sanity Studio

1. Crear un Studio independiente en `studio/` con interfaz espanola.
2. Definir los documentos `configuracionGeneral`, `paginaInicio`, `division`, `servicio`, `proyecto` y `paginaLegal`.
3. Configurar campos comprensibles, ayudas, slugs automaticos, validaciones y listas reordenables.
4. Limitar imagenes a JPEG, PNG y WebP, 8 MB por archivo, dimensiones minimas y un maximo de 20 imagenes por galeria.
5. Anadir estados editoriales y acciones de envio a revision/devolucion.
6. Mantener iconos, tonos, rutas y opciones tecnicas como listas controladas.

## Fase C. Migracion

1. Crear documentos fallback con todo el contenido actual.
2. Crear un script idempotente de importacion que suba solo imagenes utilizadas.
3. Mantener IDs estables para los singletons y slugs actuales para servicios.
4. No crear testimonios ni paginas de proyecto porque no existen en la web actual.
5. Marcar los datos societarios provisionales para revision, sin sustituirlos.

## Fase D. Integracion y publicacion

1. Produccion consultara la perspectiva `published` sin token privado en el navegador.
2. Preview consultara `drafts` durante el build con `SANITY_API_READ_TOKEN` solo en servidor/CI.
3. Anadir un workflow de GitHub Actions para build y despliegue a Arsys.
4. Generar desde contenido aprobado la lista blanca de servicios aceptados por `quote.php`.
5. Documentar webhooks de Sanity para preview y publicacion.
6. Configurar `X-Robots-Tag: noindex, nofollow` en el preview.

## Fase E. Seguridad y validacion

1. Separar variables `PUBLIC_SANITY_*`, token de lectura de preview, token de escritura de migracion y secretos de despliegue.
2. No incluir tokens en bundles ni repositorio.
3. Renderizar texto enriquecido mediante componentes permitidos, sin `set:html` procedente del CMS.
4. Validar todos los resultados del CMS con Zod y registrar fallos con fallback seguro.
5. Comprobar estados vacios, referencias rotas, imagenes ausentes y contenido oculto.

## Fase F. Documentacion y entrega

1. Guia tecnica: arquitectura, modelos, consultas, preview, webhooks, despliegue, seguridad, backups y migracion.
2. Guia de clientas: acceso, textos, imagenes, proyectos, galerias, borradores, revision y publicacion.
3. Lista de configuracion manual en Sanity, Netlify, GitHub y Arsys.
4. Commits pequenos por capa: documentacion, base CMS, Studio/modelos, migracion, integracion, CI y guias.

## Criterios de aceptacion

- `npm run build` y build del Studio correctos.
- Typecheck Astro correcto.
- Las 10 rutas actuales siguen generandose.
- El contenido visible coincide con el actual cuando se usan fallbacks.
- Un Contributor no puede publicar.
- Produccion nunca consulta borradores.
- Ningun token privado aparece en HTML o JavaScript cliente.
- Galerias vacias, servicios ocultos e imagenes ausentes no rompen el build.
- La subida de imagenes aplica tipos, peso, dimensiones, alt y limite de galeria.

## Pasos externos que no pueden automatizarse desde el repositorio

- Crear o seleccionar el proyecto Sanity y contratar Growth.
- Invitar usuarios y asignar roles Administrator/Contributor.
- Crear tokens y webhooks en Sanity.
- Crear el sitio de preview en Netlify y su build hook.
- Guardar secretos de Arsys y Sanity en GitHub Actions.
- Activar protecciones de rama y autorizar el despliegue final.

