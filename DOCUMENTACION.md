# 🏡 AZento Home Solutions - Documentación Técnica

## 📋 Índice

1. [Descripción General](#-descripción-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Arquitectura de la Aplicación](#-arquitectura-de-la-aplicación)
5. [Guía de Componentes](#-guía-de-componentes)
6. [Sistema de Diseño](#-sistema-de-diseño)
7. [Pipeline de Cambios](#-pipeline-de-cambios)
8. [Comandos de Desarrollo](#-comandos-de-desarrollo)
9. [Despliegue](#-despliegue)

---

## 🎯 Descripción General

**AZento Home Solutions** es una landing page profesional para una empresa de diseño y reforma de jardines, terrazas, pérgolas, fachadas y reformas interiores ubicada en Madrid.

### Características principales:
- ✅ Landing page de una sola página (Single Page Application)
- ✅ Diseño responsive (móvil, tablet, escritorio)
- ✅ Navegación sticky con efecto glassmorphism
- ✅ Hero section con slideshow de imágenes
- ✅ Galería de proyectos con diseño Bento Grid
- ✅ Formulario de contacto
- ✅ Optimizado para SEO

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro** | 5.0.0-beta.12 | Framework web estático |
| **React** | 19.2.3 | Componentes interactivos (disponible) |
| **Tailwind CSS** | 3.4.19 | Framework de estilos utility-first |
| **TypeScript** | - | Tipado estático |
| **Lucide React** | 0.562.0 | Librería de iconos |

### Archivos de configuración:

```
📄 astro.config.mjs    → Configuración de Astro + integraciones
📄 tailwind.config.mjs → Configuración de Tailwind + colores de marca
📄 tsconfig.json       → Configuración de TypeScript
📄 package.json        → Dependencias y scripts
```

---

## 📁 Estructura del Proyecto

```
WEB-AZENTO/
├── 📄 astro.config.mjs          # Config de Astro
├── 📄 tailwind.config.mjs       # Config de Tailwind + tema de marca
├── 📄 package.json              # Dependencias
├── 📄 tsconfig.json             # Config TypeScript
│
├── 📂 public/                   # Archivos estáticos (no procesados)
│   └── 📂 images/               # Imágenes del sitio
│       ├── 🖼 logo_azento.jpg   # Logo de la empresa
│       ├── 🖼 jardin_1.png      # Foto proyecto jardín 1
│       ├── 🖼 jardin_2.png      # Foto proyecto jardín 2  
│       ├── 🖼 jardin_3.png      # Foto proyecto jardín 3
│       ├── 🖼 madera1_azento.png # Foto revestimiento madera 1
│       ├── 🖼 madera2_azento.png # Foto revestimiento madera 2
│       ├── 🖼 cocina_1.png      # Foto cocina 1
│       └── 🖼 cocina_2.png      # Foto cocina 2
│
└── 📂 src/                      # Código fuente
    ├── 📂 assets/               # Assets procesados por Astro
    │
    ├── 📂 components/           # Componentes reutilizables
    │   ├── 📄 Navbar.astro      # Barra de navegación
    │   ├── 📄 Hero.astro        # Sección principal
    │   ├── 📄 Services.astro    # Sección de servicios
    │   ├── 📄 Gallery.astro     # Galería de proyectos
    │   ├── 📄 Contact.astro     # Sección de contacto
    │   ├── 📄 Footer.astro      # Pie de página
    │   └── 📄 Welcome.astro     # (No usado actualmente)
    │
    ├── 📂 layouts/              # Layouts (plantillas base)
    │   └── 📄 Layout.astro      # Layout principal con SEO
    │
    └── 📂 pages/                # Páginas (rutas)
        └── 📄 index.astro       # Página principal (/)
```

---

## 🏗 Arquitectura de la Aplicación

### Flujo de Renderizado

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.astro                              │
│                    (Página Principal)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Layout.astro                              │
│        (HTML base, SEO, Meta tags, Fuentes, Estilos)           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Navbar     │    │    <main>    │    │    Footer    │
│  (sticky)    │    │              │    │              │
└──────────────┘    └──────┬───────┘    └──────────────┘
                           │
        ┌─────────┬────────┼────────┬─────────┐
        ▼         ▼        ▼        ▼         ▼
    ┌──────┐ ┌────────┐ ┌───────┐ ┌───────┐
    │ Hero │ │Services│ │Gallery│ │Contact│
    └──────┘ └────────┘ └───────┘ └───────┘
```

### Secciones de la Página (por orden)

| Sección | ID HTML | Componente | Descripción |
|---------|---------|------------|-------------|
| 1. Navegación | `#navbar` | `Navbar.astro` | Menú fijo superior |
| 2. Hero | `#inicio` | `Hero.astro` | Sección principal con CTA |
| 3. Servicios | `#servicios` | `Services.astro` | Grid de 4 servicios |
| 4. Proyectos | `#proyectos` | `Gallery.astro` | Galería Bento Grid |
| 5. Contacto | `#contacto` | `Contact.astro` | Formulario + datos |
| 6. Footer | - | `Footer.astro` | Pie de página |

---

## 📦 Guía de Componentes

### 1. Layout.astro
📍 **Ubicación:** `src/layouts/Layout.astro`

**Propósito:** Template base HTML con configuración de SEO, meta tags, y estilos globales.

**Props aceptadas:**
```typescript
interface Props {
  title?: string;       // Título de la página (SEO)
  description?: string; // Descripción meta (SEO)
}
```

**Qué contiene:**
- Meta tags básicos y Open Graph
- Twitter Cards
- Carga de fuentes Google (Playfair Display + Inter)
- Estilos globales (scroll suave, scrollbar, selección)
- Theme color para móviles

**🔧 PARA CAMBIAR:**
| Cambio | Ubicación en el archivo | Líneas aprox. |
|--------|------------------------|---------------|
| Título por defecto | Variable `title` en frontmatter | 12-13 |
| Descripción SEO | Variable `description` en frontmatter | 14-15 |
| URL del sitio | `siteData.siteUrl` | 20 |
| Imagen compartir social | `siteData.image` | 21 |
| Handle Twitter | `siteData.twitterHandle` | 22 |
| Fuentes tipográficas | `<link>` Google Fonts | 60-63 |
| Color del tema | `<meta name="theme-color">` | 66 |

---

### 2. Navbar.astro
📍 **Ubicación:** `src/components/Navbar.astro`

**Propósito:** Barra de navegación sticky con efecto glassmorphism y menú móvil.

**Características:**
- Transparente al inicio, blur al hacer scroll
- Menú hamburguesa en móvil
- Links de navegación internos

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Enlaces de navegación | Array `navLinks` | 8-13 |
| Texto botón CTA | Objeto `ctaButton` | 15-18 |
| Logo | `<img src="/images/logo_azento.jpg">` | 37-39 |
| Tamaño del logo | Clase `h-14` en img | 39 |

**Estructura de `navLinks`:**
```javascript
const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  // ... añadir más aquí
];
```

---

### 3. Hero.astro
📍 **Ubicación:** `src/components/Hero.astro`

**Propósito:** Sección principal a pantalla completa con slideshow e información de impacto.

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Título principal | `heroContent.headline` | 9 |
| Subtítulo/descripción | `heroContent.subheadline` | 10 |
| Texto botón principal | `heroContent.ctaPrimary.label` | 11-14 |
| Texto botón secundario | `heroContent.ctaSecondary.label` | 15-18 |
| Imágenes del slideshow | Array `heroContent.backgroundImages` | 20-23 |
| Estadísticas | Array `heroContent.stats` | 25-29 |
| Badge superior | Línea con "Jardines · Terrazas..." | 62-65 |
| Velocidad slideshow | `intervalTime` (milisegundos) | 159 |

**Estructura de estadísticas:**
```javascript
stats: [
  { value: "Desde", label: "2022" },
  { value: "100%", label: "Proyectos personalizados" },
  { value: "Madrid", label: "y alrededores" },
],
```

**Para añadir más imágenes al slideshow:**
1. Añadir imagen a `/public/images/`
2. Agregar ruta al array `backgroundImages`

---

### 4. Services.astro
📍 **Ubicación:** `src/components/Services.astro`

**Propósito:** Grid de tarjetas con los servicios ofrecidos.

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Tagline de sección | `sectionData.tagline` | 10 |
| Título de sección | `sectionData.headline` | 11 |
| Descripción | `sectionData.description` | 12 |
| Lista de servicios | Array `services` | 15-42 |

**Estructura de cada servicio:**
```javascript
{
  id: 1,
  icon: "garden",      // Clave del icono (ver iconos disponibles)
  title: "Jardines y Terrazas",
  description: "Diseñamos y ejecutamos jardines...",
  features: ["Jardines verticales", "Césped artificial", "Zonas de relax"],
}
```

**Iconos disponibles:** `garden`, `pergola`, `facade`, `interior`

Para **añadir un nuevo servicio**, agregar objeto al array `services` con la estructura anterior.

---

### 5. Gallery.astro
📍 **Ubicación:** `src/components/Gallery.astro`

**Propósito:** Galería de proyectos con diseño Bento Grid asimétrico.

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Tagline | `sectionData.tagline` | 10 |
| Título | `sectionData.headline` | 11 |
| Descripción | `sectionData.description` | 12 |
| Lista de proyectos | Array `projects` | 16-48 |

**Estructura de cada proyecto:**
```javascript
{
  id: 1,
  title: "Jardín con Piscina",
  category: "Jardín Vertical",
  location: "Madrid",
  image: "/images/jardin_1.png",
  size: "large",  // "large" | "medium" | "small"
}
```

**Tamaños del Bento Grid:**
- `large`: Ocupa 2 columnas × 2 filas (destacado)
- `medium`: Ocupa 2 columnas × 1 fila
- `small`: Ocupa 1 columna × 1 fila

**Para añadir un proyecto:**
1. Subir imagen a `/public/images/`
2. Añadir objeto al array `projects`

---

### 6. Contact.astro
📍 **Ubicación:** `src/components/Contact.astro`

**Propósito:** Sección de contacto con información y formulario.

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Tagline | `sectionData.tagline` | 10 |
| Título | `sectionData.headline` | 11 |
| Descripción | `sectionData.description` | 12 |
| Datos de contacto | Array `contactInfo` | 15-38 |
| Opciones del select | `<select id="service">` | 170-177 |
| Campos del formulario | Elementos `<input>` y `<textarea>` | 124-196 |

**Estructura de datos de contacto:**
```javascript
{
  icon: "phone",              // "phone" | "email" | "instagram" | "location"
  label: "Teléfonos",
  value: "682 412 236 · 659 136 093",
  href: "tel:+34682412236",   // Enlace al hacer clic
}
```

**⚠️ IMPORTANTE:** El formulario actualmente **no tiene backend**. Para hacerlo funcional necesitas:
1. Añadir un servicio como Formspree, Netlify Forms, o API propia
2. Agregar el `action` al `<form>`

---

### 7. Footer.astro
📍 **Ubicación:** `src/components/Footer.astro`

**Propósito:** Pie de página con navegación, redes sociales y legal.

**🔧 PARA CAMBIAR:**

| Cambio | Variable/Ubicación | Líneas aprox. |
|--------|-------------------|---------------|
| Tagline/descripción | `footerData.tagline` | 9 |
| Columnas de navegación | Array `footerData.navigation` | 12-34 |
| Redes sociales | Array `footerData.social` | 37-39 |
| Copyright | `footerData.copyright` | 41 |

**Estructura de columna de navegación:**
```javascript
{
  title: "Servicios",
  links: [
    { label: "Jardines y Terrazas", href: "#servicios" },
    // ...
  ],
}
```

**Para añadir red social:**
1. Añadir SVG path al objeto `socialIcons`
2. Añadir objeto al array `footerData.social`

---

## 🎨 Sistema de Diseño

### Paleta de Colores (tailwind.config.mjs)

```
┌─────────────────────────────────────────────────────────────────┐
│                    COLORES DE MARCA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AZENTO (Azul/Gris Principal)                                  │
│  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐     │
│  │ 50  ││ 100 ││ 200 ││ 300 ││ 400 ││ 500 ││ 600 ││ 700 │...  │
│  │#f4f6││#e3e8││#c9d3││#a3b3││#768d││#5b72││#435f││#3a51│     │
│  └─────┘└─────┘└─────┘└─────┘└─────┘└─────┘└─────┘└─────┘     │
│                                           ▲                     │
│                                    Color principal              │
│                                                                 │
│  ACCENT (Beige/Bronce Cálido)                                  │
│  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐                           │
│  │ 300 ││ 400 ││ 500 ││ 600 ││ 700 │...                        │
│  │#d4c4││#c4a8││#b895││#a881││#8c6a│                           │
│  └─────┘└─────┘└─────┘└─────┘└─────┘                           │
│              ▲                                                  │
│       Color de acento                                           │
│                                                                 │
│  NEUTRAL (Grises)                                               │
│  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐                           │
│  │ 50  ││ 100 ││ 200 ││ 400 ││ 950 │...                        │
│  │#fafa││#f5f5││#e5e5││#a6a6││#0000│                           │
│  └─────┘└─────┘└─────┘└─────┘└─────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Uso de Colores en Clases Tailwind

```css
/* Ejemplos de uso */
bg-azento-600      /* Fondo color principal */
text-accent-400    /* Texto color acento */
border-neutral-200 /* Bordes grises suaves */
```

### Tipografías

| Fuente | Uso | Clase Tailwind |
|--------|-----|----------------|
| **Playfair Display** | Títulos, headlines | `font-display` |
| **Inter** | Cuerpo de texto | `font-body` |

### Animaciones Disponibles

| Nombre | Efecto | Clase Tailwind |
|--------|--------|----------------|
| `fade-in` | Aparece suavemente | `animate-fade-in` |
| `slide-up` | Sube desde abajo | `animate-slide-up` |
| `float` | Flota arriba/abajo | `animate-float` |

---

## 🔄 Pipeline de Cambios

### Diagrama de Decisión: ¿Dónde cambiar qué?

```
                    ┌─────────────────┐
                    │ ¿QUÉ NECESITO   │
                    │    CAMBIAR?     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   CONTENIDO   │   │    DISEÑO     │   │   ESTRUCTURA  │
│   (Textos,    │   │   (Colores,   │   │   (Añadir     │
│   Imágenes)   │   │   Fuentes)    │   │   secciones)  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Componente    │   │ tailwind.     │   │ index.astro   │
│ específico    │   │ config.mjs    │   │ + nuevo       │
│ .astro        │   │               │   │ componente    │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Tabla de Referencia Rápida

| Si el cliente pide... | Archivo a modificar | Sección/Variable |
|----------------------|---------------------|------------------|
| Cambiar logo | `Navbar.astro`, `Footer.astro` | `<img src=...>` |
| Cambiar teléfonos | `Contact.astro`, `Footer.astro` | `contactInfo`, `navigation` |
| Cambiar email | `Contact.astro`, `Footer.astro` | `contactInfo`, `navigation` |
| Cambiar Instagram | `Contact.astro`, `Footer.astro` | `contactInfo`, `social` |
| Cambiar título principal | `Hero.astro` | `heroContent.headline` |
| Añadir/cambiar servicios | `Services.astro` | Array `services` |
| Añadir proyectos galería | `Gallery.astro` + `/public/images/` | Array `projects` |
| Cambiar colores de marca | `tailwind.config.mjs` | Objeto `colors` |
| Cambiar fuentes | `Layout.astro` + `tailwind.config.mjs` | Google Fonts + `fontFamily` |
| Cambiar SEO/meta tags | `Layout.astro` | `siteData` + meta tags |
| Añadir nueva sección | Crear componente + `index.astro` | Importar y añadir |
| Cambiar opciones formulario | `Contact.astro` | `<select>` options |
| Cambiar imágenes hero | `Hero.astro` + `/public/images/` | `backgroundImages` |
| Cambiar estadísticas | `Hero.astro` | `heroContent.stats` |
| Cambiar links navegación | `Navbar.astro` | `navLinks` |
| Cambiar copyright | `Footer.astro` | `footerData.copyright` |

---

## 🔧 Flujo de Trabajo para Cambios Comunes

### 1. Cambiar el Logo

```
1. Reemplazar /public/images/logo_azento.jpg con el nuevo logo
2. (Opcional) Ajustar tamaño en Navbar.astro (clase h-14)
3. (Opcional) Ajustar tamaño en Footer.astro (clase h-12)
```

### 2. Añadir un Nuevo Servicio

```
1. Abrir src/components/Services.astro
2. Localizar el array `services` (línea ~15)
3. Añadir nuevo objeto con: id, icon, title, description, features
4. Si necesitas nuevo icono, añadirlo al objeto `icons`
```

### 3. Añadir un Nuevo Proyecto a la Galería

```
1. Subir imagen a /public/images/
2. Abrir src/components/Gallery.astro
3. Añadir objeto al array `projects` con:
   - id, title, category, location
   - image: ruta a la imagen
   - size: "large", "medium" o "small"
```

### 4. Cambiar Datos de Contacto

```
1. Abrir src/components/Contact.astro
2. Modificar array `contactInfo` con nuevos datos
3. Abrir src/components/Footer.astro
4. Actualizar `footerData.navigation` (columna "Contacto")
```

### 5. Cambiar Colores de Marca

```
1. Abrir tailwind.config.mjs
2. Modificar objeto `colors` -> `azento` o `accent`
3. Usar generador como: https://uicolors.app/create
4. Los cambios se aplican automáticamente a toda la web
```

### 6. Hacer el Formulario Funcional

```
Opción A - Formspree (fácil):
1. Crear cuenta en formspree.io
2. Crear nuevo form y copiar endpoint
3. En Contact.astro, cambiar <form> a:
   <form action="https://formspree.io/f/XXXXX" method="POST">

Opción B - Netlify Forms:
1. Añadir netlify a <form>:
   <form name="contacto" method="POST" data-netlify="true">
2. Deploy en Netlify

Opción C - API propia:
1. Crear endpoint API (Node, Astro API routes, etc.)
2. Manejar envío con JavaScript fetch
```

---

## 🧞 Comandos de Desarrollo

Ejecutar desde la raíz del proyecto:

| Comando | Acción |
|---------|--------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Compila el sitio para producción en `./dist/` |
| `pnpm preview` | Previsualiza la build localmente |

---

## 🚀 Despliegue

### Build de Producción

```bash
pnpm build
```

Genera archivos estáticos en la carpeta `./dist/`

### Plataformas Recomendadas

| Plataforma | Configuración |
|------------|---------------|
| **Vercel** | Detecta Astro automáticamente |
| **Netlify** | Build command: `pnpm build`, Publish: `dist` |
| **GitHub Pages** | Requiere adaptador `@astrojs/static` |
| **Cloudflare Pages** | Build command: `pnpm build`, Output: `dist` |

---

## 📝 Notas Adicionales

### Imágenes Actuales en /public/images/

| Archivo | Uso actual |
|---------|------------|
| `logo_azento.jpg` | Logo en Navbar y Footer |
| `jardin_1.png` | Galería - Proyecto destacado |
| `jardin_2.png` | Hero slideshow |
| `jardin_3.png` | Galería |
| `madera1_azento.png` | Galería |
| `madera2_azento.png` | Galería |
| `cocina_1.png` | No usado actualmente |
| `cocina_2.png` | Galería |

### Pendientes / Mejoras Futuras

- [ ] Conectar formulario a backend (Formspree, Netlify, etc.)
- [ ] Añadir páginas legales (Privacidad, Cookies, Aviso Legal)
- [ ] Implementar analíticas (Google Analytics, Plausible)
- [ ] Añadir más proyectos a la galería
- [ ] Crear página individual para cada proyecto
- [ ] Añadir favicon.svg personalizado

---

## 🆘 Soporte

Para cualquier cambio que no esté documentado aquí, la estructura de los componentes Astro es:

```astro
---
// Frontmatter: JavaScript/TypeScript
// Aquí van los datos, imports, y lógica
const datos = { ... };
---

<!-- Template HTML con interpolación -->
<section>
  <h1>{datos.titulo}</h1>
</section>

<style>
  /* CSS específico del componente */
</style>

<script>
  // JavaScript del lado del cliente
</script>
```

---

**Documentación generada: Enero 2026**  
**Última actualización: 18/01/2026**
