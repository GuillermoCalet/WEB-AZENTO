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

const shortCopy = nonEmpty.max(120);
const mediumCopy = nonEmpty.max(500);
const longCopy = nonEmpty.max(3000);

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

export const businessUnitContentSchema = businessUnitSchema.omit({
  id: true,
  slug: true,
  tone: true,
  published: true,
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

export const detailedServicesContentSchema = z.object({
  services: z.array(detailedServiceSchema.omit({ divisionId: true })).max(30),
});

export const siteSettingsSchema = z.object({
  companyName: nonEmpty,
  legalName: nonEmpty,
  siteUrl: z.string().url().refine((url) => url.startsWith("https://"), "La URL debe usar HTTPS"),
  logo: managedImageSchema.extend({ alt: nonEmpty }),
  lightLogo: managedImageSchema,
  phoneDisplay: nonEmpty,
  phoneHref: z.string().regex(/^tel:\+[0-9]+$/),
  email: z.string().email(),
  location: nonEmpty,
  address: nonEmpty,
  whatsapp: z.string().optional().default(""),
  instagram: z.object({ label: nonEmpty, url: z.string().url().refine((url) => url.startsWith("https://"), "Instagram debe usar HTTPS") }),
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

const navigationCopySchema = z.object({
  servicesLabel: shortCopy,
  projectsLabel: shortCopy,
  processLabel: shortCopy,
  contactLabel: shortCopy,
  backHomeLabel: shortCopy,
  quoteLabel: shortCopy,
  openMenuLabel: shortCopy,
  closeMenuLabel: shortCopy,
});

export const siteCopySchema = z.object({
  navigation: navigationCopySchema,
  home: z.object({
    logoAriaSuffix: shortCopy,
    discoverAriaPrefix: shortCopy,
    contactPhoneLabel: shortCopy,
    contactEmailLabel: shortCopy,
    contactInstagramLabel: shortCopy,
    contactLocationLabel: shortCopy,
    legalNavLabel: shortCopy,
  }),
  businessPage: z.object({
    heroQuoteLabel: shortCopy,
    heroProjectsLabel: shortCopy,
    servicesEmptyText: mediumCopy,
    projectsEmptyText: mediumCopy,
    serviceMoreInfoAriaPrefix: shortCopy,
    galleryOpenImageAriaPrefix: shortCopy,
    galleryCloseImageAriaLabel: shortCopy,
    galleryPreviousImageAriaLabel: shortCopy,
    galleryNextImageAriaLabel: shortCopy,
    processEyebrow: shortCopy,
    ctaEyebrow: shortCopy,
    ctaTitle: mediumCopy,
  }),
  contact: z.object({
    phoneLabel: shortCopy,
    emailLabel: shortCopy,
    instagramLabel: shortCopy,
    locationLabel: shortCopy,
    formTitle: shortCopy,
    requiredHint: mediumCopy,
    honeypotLabel: shortCopy,
    nameLabel: shortCopy,
    namePlaceholder: shortCopy,
    emailLabelField: shortCopy,
    emailPlaceholder: shortCopy,
    phoneLabelField: shortCopy,
    phonePlaceholder: shortCopy,
    serviceLabel: shortCopy,
    servicePlaceholder: shortCopy,
    messageLabel: shortCopy,
    messagePlaceholder: mediumCopy,
    privacyPrefix: shortCopy,
    privacyLinkLabel: shortCopy,
    privacySuffix: mediumCopy,
    submitLabel: shortCopy,
    submittingLabel: shortCopy,
    successTitle: shortCopy,
    successMessage: mediumCopy,
    errorTitle: shortCopy,
    fallbackError: mediumCopy,
    localPhpError: mediumCopy,
    unavailableError: mediumCopy,
  }),
  footer: z.object({
    divisionHeading: shortCopy,
    areasHeading: shortCopy,
    legalHeading: shortCopy,
    chooseAreaLabel: shortCopy,
    privacyLabel: shortCopy,
    legalNoticeLabel: shortCopy,
    cookiesLabel: shortCopy,
    cookieSettingsLabel: shortCopy,
    rightsLabel: shortCopy,
    backToTopLabel: shortCopy,
    instagramAriaSuffix: shortCopy,
    areaSelectionAriaSuffix: shortCopy,
  }),
  cookies: z.object({
    bannerTitle: shortCopy,
    bannerDescription: mediumCopy,
    moreInfoLabel: shortCopy,
    settingsLabel: shortCopy,
    rejectLabel: shortCopy,
    acceptAllLabel: shortCopy,
    modalTitle: shortCopy,
    modalCloseLabel: shortCopy,
    necessaryTitle: shortCopy,
    necessaryDescription: mediumCopy,
    necessaryBadge: shortCopy,
    analyticsTitle: shortCopy,
    analyticsDescription: mediumCopy,
    savePreferencesLabel: shortCopy,
  }),
  serviceDetail: z.object({
    homeBreadcrumbLabel: shortCopy,
    servicesBreadcrumbLabel: shortCopy,
    heroEyebrow: shortCopy,
    includedTitle: shortCopy,
    interestTitle: shortCopy,
    interestDescription: mediumCopy,
    directContactTitle: shortCopy,
    galleryEyebrow: shortCopy,
    galleryTitle: shortCopy,
    faqEyebrow: shortCopy,
    faqTitle: shortCopy,
    backToServicesLabel: shortCopy,
    quoteLabel: shortCopy,
  }),
  legal: z.object({
    updatedPrefix: shortCopy,
    backHomeLabel: shortCopy,
    contactEmailLabel: shortCopy,
    contactPhoneLabel: shortCopy,
    cookieConfigButtonLabel: shortCopy,
  }),
});

const legalListItemSchema = z.object({
  label: z.string().max(120).optional().default(""),
  text: nonEmpty.max(2000),
  href: z.string().max(500).optional().default(""),
});

const legalSectionSchema = z.object({
  heading: shortCopy,
  level: z.enum(["h2", "h3"]).optional().default("h2"),
  paragraphs: z.array(longCopy).optional().default([]),
  list: z.array(legalListItemSchema).optional().default([]),
});

const legalPageSchema = z.object({
  seoTitle: nonEmpty.max(70),
  seoDescription: nonEmpty.max(320),
  title: shortCopy,
  updatedDate: shortCopy,
  actionButtonLabel: z.string().max(120).optional().default(""),
  sections: z.array(legalSectionSchema).min(1).max(40),
});

export const legalPagesSchema = z.object({
  legalNotice: legalPageSchema,
  privacyPolicy: legalPageSchema,
  cookiePolicy: legalPageSchema,
});
