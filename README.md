# AZento Home

Web corporativa estática construida con Astro 5, TypeScript, React y Tailwind CSS. El contenido se gestiona con Decap CMS mediante un flujo gratuito de borrador, revisión por pull request y publicación aprobada.

## Requisitos

- Node.js 22 recomendado.
- npm.

## Desarrollo

```bash
npm install
npm run dev
```

Para editar con Decap en local, inicia en otro terminal:

```bash
npm run cms:dev
```

Después abre `http://localhost:4321/admin/index.html`.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor Astro local |
| `npm run cms:dev` | Backend local de Decap |
| `npm run cms:validate` | Valida JSON, relaciones e imágenes |
| `npm run check` | Comprueba Astro y TypeScript |
| `npm run build` | Genera la web estática en `dist/` |
| `npm run validate` | Ejecuta validación, check y build |
| `npm run preview` | Sirve el build local |

## Estructura principal

```text
public/
  admin/                 Panel y configuración de Decap
  api/quote.php          Formulario para Arsys
  images/                Medios existentes y subidas del CMS
src/
  components/            Componentes visuales
  content/cms/           Contenido JSON publicado
  lib/cms/               Tipos, esquemas y repositorio
  layouts/               Layout base
  pages/                 Rutas Astro
scripts/cms/             Validación de contenido
.github/workflows/       Revisión y despliegue
```

## Configuración

- Copia `.env.example` a `.env` solo para variables locales.
- La configuración privada del formulario de producción permanece en `public/api/quote-config.php` dentro de Arsys y no se versiona.
- Los secretos OAuth se guardan en Cloudflare Workers.
- Las credenciales de despliegue se guardan en GitHub Actions Secrets.

## Documentación

- [Auditoría y decisión](docs/cms/AUDITORIA_Y_DECISION.md)
- [Plan de implementación](docs/cms/PLAN_IMPLEMENTACION.md)
- [Guía técnica](docs/cms/GUIA_TECNICA.md)
- [Configuración manual](docs/cms/CONFIGURACION_MANUAL.md)
- [Guía para clientas](docs/cms/GUIA_CLIENTAS.md)
- [Despliegue en Arsys](ARSYS_DEPLOY.md)
- [Formulario y notificaciones](SETUP.md)
