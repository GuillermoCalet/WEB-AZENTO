import { z } from "zod";

const nonEmpty = z.string().trim().min(1);
const slug = z.string().regex(/^\/?[a-z0-9]+(?:-[a-z0-9]+)*(?:#[a-z0-9-]+)?$/, "Slug o ruta no válida");
const imagePath = z.string().regex(/^\/images\/[A-Za-z0-9_./-]+\.(?:jpe?g|png|webp)$/i, "Imagen local no válida");

export const managedImageSchema = z.object({
  src: imagePath,
  alt: z.string(),
  caption: z.string().optional().default(""),
});

const seoSchema = z.object({
  title: nonEmpty.max(70),
  description: nonEmpty.max(320),
});

const serviceCardSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: nonEmpty.max(100),
  description: nonEmpty.max(500),
  href: z.union([z.literal(""), z.string().regex(/^\/servicios\/[a-z0-9]+(?:-[a-z0-9]+)*$/)]).optional().default(""),
  visible: z.boolean().default(true),
});

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: nonEmpty.max(120),
  category: nonEmpty.max(80),
  image: imagePath,
  alt: nonEmpty.max(220),
  caption: z.string().max(220).optional().default(""),
  objectPosition: z.enum(["center", "center 40%", "center 42%", "center top", "center bottom"]).optional().default("center"),
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
});

const titledText = z.object({
  title: nonEmpty.max(120),
  description: nonEmpty.max(500),
});

export const businessUnitSchema = z.object({
  id: z.enum(["madera_tecnologica", "reformas"]),
  name: nonEmpty,
  shortName: nonEmpty,
  slug: z.enum(["/madera-tecnologica", "/reformas"]),
  tone: z.enum(["wood", "reform"]),
  published: z.boolean().default(true),
  selectorDescription: nonEmpty,
  selectorImage: imagePath,
  selectorAlt: nonEmpty,
  heroEyebrow: nonEmpty,
  heroTitle: nonEmpty,
  heroDescription: nonEmpty,
  heroImage: imagePath,
  heroAlt: nonEmpty,
  seoTitle: nonEmpty.max(70),
  seoDescription: nonEmpty.max(320),
  servicesTitle: nonEmpty,
  servicesDescription: nonEmpty,
  services: z.array(serviceCardSchema).max(20),
  projectsTitle: nonEmpty,
  projectsDescription: nonEmpty,
  projects: z.array(projectSchema).max(20),
  processTitle: nonEmpty,
  processDescription: nonEmpty,
  process: z.array(titledText).min(1).max(6),
  trustTitle: nonEmpty,
  trust: z.array(titledText).min(1).max(6),
  formTitle: nonEmpty,
  formDescription: nonEmpty,
  formServices: z.array(z.object({
    value: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: nonEmpty.max(100),
  })).min(1).max(20),
});

export const businessUnitsSchema = z.object({
  units: z.array(businessUnitSchema).length(2),
}).superRefine(({ units }, context) => {
  if (new Set(units.map((unit) => unit.id)).size !== units.length) {
    context.addIssue({ code: "custom", message: "Las divisiones no pueden repetir identificador" });
  }
});

export const detailedServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  divisionId: z.enum(["madera_tecnologica", "reformas"]),
  published: z.boolean().default(true),
  icon: z.enum(["garden", "pergola", "facade", "interior"]),
  title: nonEmpty.max(100),
  shortDescription: nonEmpty.max(500),
  longDescription: z.array(nonEmpty.max(2000)).min(1).max(12),
  features: z.array(nonEmpty.max(120)).max(12),
  bullets: z.array(nonEmpty.max(180)).max(20),
  gallery: z.array(managedImageSchema.extend({ alt: nonEmpty.max(220) })).max(20),
  cta: z.object({
    primaryText: nonEmpty.max(80),
    primaryHref: slug,
    secondaryText: nonEmpty.max(80),
    secondaryHref: slug,
  }),
  faq: z.array(z.object({
    question: nonEmpty.max(240),
    answer: nonEmpty.max(2000),
    visible: z.boolean().default(true),
  })).max(20),
  seo: seoSchema,
});

export const detailedServicesSchema = z.object({
  services: z.array(detailedServiceSchema).max(30),
});

export const siteSettingsSchema = z.object({
  companyName: nonEmpty,
  legalName: nonEmpty,
  siteUrl: z.url().refine((url) => url.startsWith("https://"), "La URL debe usar HTTPS"),
  logo: managedImageSchema.extend({ alt: nonEmpty }),
  lightLogo: managedImageSchema,
  phoneDisplay: nonEmpty,
  phoneHref: z.string().regex(/^tel:\+[0-9]+$/),
  email: z.email(),
  location: nonEmpty,
  address: nonEmpty,
  whatsapp: z.string().optional().default(""),
  instagram: z.object({ label: nonEmpty, url: z.url().refine((url) => url.startsWith("https://"), "Instagram debe usar HTTPS") }),
  hours: z.string().optional().default(""),
  footerTagline: nonEmpty,
  legal: z.object({ cif: nonEmpty, registry: nonEmpty }),
  defaultSeo: seoSchema.extend({
    image: imagePath,
    imageAlt: nonEmpty,
  }),
});

export const homePageSchema = z.object({
  published: z.boolean().default(true),
  seoTitle: nonEmpty.max(70),
  seoDescription: nonEmpty.max(320),
  seoImage: imagePath,
  eyebrow: nonEmpty.max(100),
  title: nonEmpty.max(120),
  intro: nonEmpty.max(500),
  cardEyebrow: nonEmpty.max(80),
  cardCtaPrefix: nonEmpty.max(80),
  contactEyebrow: nonEmpty.max(80),
  contactTitle: nonEmpty.max(120),
});
