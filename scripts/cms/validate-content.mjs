import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import yaml from "js-yaml";

const root = new URL("../../", import.meta.url);
const errors = [];

try {
  const config = yaml.load(await readFile(new URL("public/admin/config.yml", root), "utf8"));
  if (!config || typeof config !== "object") {
    errors.push("admin/config.yml: configuración vacía");
  } else {
    if (config.backend?.name !== "github") errors.push("admin/config.yml: backend debe ser github");
    if (config.backend?.open_authoring !== true) errors.push("admin/config.yml: Open Authoring debe estar dentro de backend");
    if (config.publish_mode !== "editorial_workflow") errors.push("admin/config.yml: falta Editorial Workflow");
    if (!Array.isArray(config.collections) || config.collections.length === 0) {
      errors.push("admin/config.yml: no hay colecciones");
    }
  }
} catch (error) {
  errors.push(`admin/config.yml: YAML no válido (${error.message})`);
}

async function loadJson(relativePath) {
  try {
    return JSON.parse(await readFile(new URL(relativePath, root), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: JSON no válido (${error.message})`);
    return {};
  }
}

const settings = await loadJson("src/content/cms/site-settings.json");
const home = await loadJson("src/content/cms/home.json");
const businessContent = await loadJson("src/content/cms/business-units.json");
const serviceContent = await loadJson("src/content/cms/detailed-services.json");

const units = Array.isArray(businessContent.units) ? businessContent.units : [];
const services = Array.isArray(serviceContent.services) ? serviceContent.services : [];

function requireValue(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label}: campo obligatorio vacío`);
  }
}

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`${label}: valor duplicado "${value}"`);
    seen.add(value);
  }
}

function imageReference(src, alt, label, optionalAlt = false, minDimension = 300) {
  requireValue(src, `${label}.imagen`);
  if (!optionalAlt) requireValue(alt, `${label}.texto alternativo`);
  return { src, label, minDimension };
}

if (home.published !== true) errors.push("home.json: la portada debe permanecer publicada");
if (units.length !== 2) errors.push("business-units.json: deben existir exactamente dos divisiones");

unique(units.map((unit) => unit.id), "Identificadores de división");
unique(services.map((service) => service.slug), "Slugs de páginas de servicio");

const images = [
  imageReference(settings.logo?.src, settings.logo?.alt, "Logo", false, 64),
  imageReference(settings.lightLogo?.src, settings.lightLogo?.alt, "Logo claro", true),
  imageReference(settings.defaultSeo?.image, settings.defaultSeo?.imageAlt, "SEO general"),
  imageReference(home.seoImage, "Imagen social de la portada", "SEO de inicio"),
];

for (const unit of units) {
  requireValue(unit.name, `División ${unit.id}.nombre`);
  requireValue(unit.heroAlt, `División ${unit.id}.texto alternativo principal`);
  images.push(
    imageReference(unit.selectorImage, unit.selectorAlt, `División ${unit.id}.tarjeta`),
    imageReference(unit.heroImage, unit.heroAlt, `División ${unit.id}.hero`),
  );

  if ((unit.projects || []).filter((project) => project.visible && project.featured).length > 1) {
    errors.push(`División ${unit.id}: solo puede haber un proyecto visible destacado`);
  }

  if ((unit.projects || []).length > 20) {
    errors.push(`División ${unit.id}: máximo 20 proyectos`);
  }

  unique((unit.projects || []).map((project) => project.slug), `Proyectos de ${unit.id}`);
  unique((unit.services || []).map((service) => service.slug), `Servicios de ${unit.id}`);
  unique((unit.formServices || []).map((service) => service.value), `Formulario de ${unit.id}`);

  for (const project of unit.projects || []) {
    images.push(imageReference(project.image, project.alt, `Proyecto ${project.slug}`));
  }
}

const unitIds = new Set(units.map((unit) => unit.id));
const detailSlugs = new Set(services.map((service) => service.slug));
for (const service of services) {
  if (!unitIds.has(service.divisionId)) {
    errors.push(`Servicio ${service.slug}: división inexistente`);
  }
  if ((service.gallery || []).length > 20) {
    errors.push(`Servicio ${service.slug}: máximo 20 imágenes en la galería`);
  }
  if ((service.faq || []).length > 20) {
    errors.push(`Servicio ${service.slug}: máximo 20 preguntas frecuentes`);
  }
  for (const [index, image] of (service.gallery || []).entries()) {
    images.push(imageReference(image.src, image.alt, `Servicio ${service.slug}.galería ${index + 1}`));
  }
}

for (const unit of units) {
  for (const card of unit.services || []) {
    if (!card.href) continue;
    const slug = card.href.replace(/^\/servicios\//, "");
    if (!detailSlugs.has(slug)) {
      errors.push(`Servicio ${card.slug}: el enlace ${card.href} no tiene página detallada`);
    }
  }
}

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_DIMENSION = 8000;

function readPngSize(buffer) {
  if (buffer.length < 24 || buffer.toString("hex", 0, 8) !== "89504e470d0a1a0a") return null;
  return { type: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { type: "jpeg", width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    if (length < 2) break;
    offset += length + 2;
  }
  return null;
}

function readWebpSize(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  const kind = buffer.toString("ascii", 12, 16);
  if (kind === "VP8X") {
    return {
      type: "webp",
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }
  if (kind === "VP8 " && buffer.length >= 30) {
    return {
      type: "webp",
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (kind === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      type: "webp",
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  return null;
}

for (const { src, label, minDimension } of images) {
  if (typeof src !== "string" || !src.startsWith("/images/")) continue;
  const extension = extname(src).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    errors.push(`${label}: solo se permiten JPG, PNG y WebP (${src})`);
    continue;
  }

  const relativePath = src.replace(/^\//, "");
  const fileUrl = new URL(`public/${relativePath}`, root);
  try {
    const fileStat = await stat(fileUrl);
    if (fileStat.size > MAX_FILE_SIZE) {
      errors.push(`${label}: ${src} supera el máximo de 3 MB`);
    }
    const buffer = await readFile(fileUrl);
    const metadata = readPngSize(buffer) || readJpegSize(buffer) || readWebpSize(buffer);
    if (!metadata) {
      errors.push(`${label}: el contenido real de ${src} no es JPG, PNG ni WebP`);
      continue;
    }
    const expectedType = extension === ".png" ? "png" : extension === ".webp" ? "webp" : "jpeg";
    if (metadata.type !== expectedType) {
      errors.push(`${label}: la extensión de ${src} no coincide con su formato real ${metadata.type.toUpperCase()}`);
      continue;
    }
    if (metadata.width < minDimension || metadata.height < minDimension) {
      errors.push(`${label}: ${src} debe medir al menos ${minDimension} × ${minDimension} px`);
    }
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      errors.push(`${label}: ${src} supera la dimensión máxima de 8000 px`);
    }
  } catch {
    errors.push(`${label}: no existe ${join("public", relativePath)}`);
  }
}

if (errors.length > 0) {
  console.error("Validación del CMS fallida:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`CMS válido: ${units.length} divisiones, ${services.length} páginas de servicio y ${images.length} referencias de imagen.`);
}
