export type BusinessUnitId = "madera_tecnologica" | "reformas";
export type BusinessTone = "wood" | "reform";

export interface ManagedImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface SeoFields {
  title: string;
  description: string;
}

export interface BusinessService {
  slug: string;
  title: string;
  description: string;
  href?: string;
  visible: boolean;
}

export interface BusinessProject {
  slug: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
  visible: boolean;
  featured: boolean;
}

export interface FormService {
  value: string;
  label: string;
}

export interface BusinessUnitConfig {
  id: BusinessUnitId;
  name: string;
  shortName: string;
  slug: string;
  tone: BusinessTone;
  published: boolean;
  selectorDescription: string;
  selectorImage: string;
  selectorAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  services: BusinessService[];
  projectsTitle: string;
  projectsDescription: string;
  projects: BusinessProject[];
  processTitle: string;
  processDescription: string;
  process: Array<{ title: string; description: string }>;
  trustTitle: string;
  trust: Array<{ title: string; description: string }>;
  formTitle: string;
  formDescription: string;
  formServices: FormService[];
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  visible: boolean;
}

export interface ServiceCTA {
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
}

export interface DetailedService {
  slug: string;
  divisionId: BusinessUnitId;
  published: boolean;
  icon: "garden" | "pergola" | "facade" | "interior";
  title: string;
  shortDescription: string;
  longDescription: string[];
  features: string[];
  bullets: string[];
  gallery: ManagedImage[];
  cta: ServiceCTA;
  faq: ServiceFAQ[];
  seo: SeoFields;
}

export interface SiteSettings {
  companyName: string;
  legalName: string;
  siteUrl: string;
  logo: ManagedImage;
  lightLogo: ManagedImage;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  location: string;
  address: string;
  whatsapp?: string;
  instagram: { label: string; url: string };
  hours?: string;
  footerTagline: string;
  legal: { cif: string; registry: string };
  defaultSeo: SeoFields & { image: string; imageAlt: string };
}

export interface HomePage {
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  eyebrow: string;
  title: string;
  intro: string;
  cardEyebrow: string;
  cardCtaPrefix: string;
  contactEyebrow: string;
  contactTitle: string;
}
