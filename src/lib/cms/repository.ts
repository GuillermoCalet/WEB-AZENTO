import woodUnitSource from "../../content/cms/madera-tecnologica.json";
import reformsUnitSource from "../../content/cms/reformas.json";
import woodServicesSource from "../../content/cms/servicios-madera.json";
import reformsServicesSource from "../../content/cms/servicios-reformas.json";
import homeSource from "../../content/cms/home.json";
import legalPagesSource from "../../content/cms/legal-pages.json";
import siteCopySource from "../../content/cms/site-copy.json";
import siteSettingsSource from "../../content/cms/site-settings.json";
import {
  businessUnitContentSchema,
  detailedServicesContentSchema,
  homePageSchema,
  legalPagesSchema,
  siteCopySchema,
  siteSettingsSchema,
} from "./schemas";
import type {
  BusinessUnitConfig,
  BusinessUnitId,
  BusinessTone,
  DetailedService,
  HomePage,
  LegalPages,
  SiteCopy,
  SiteSettings,
} from "./types";

function parseContent<T>(label: string, schema: { parse: (value: unknown) => T }, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    console.error(`[CMS] Contenido no válido en ${label}`, error);
    throw new Error(`No se pudo validar el contenido de ${label}`, { cause: error });
  }
}

export const siteSettings: SiteSettings = parseContent(
  "site-settings.json",
  siteSettingsSchema,
  siteSettingsSource,
);

export const homePage: HomePage = parseContent("home.json", homePageSchema, homeSource);

export const siteCopy: SiteCopy = parseContent("site-copy.json", siteCopySchema, siteCopySource);

export const legalPages: LegalPages = parseContent(
  "legal-pages.json",
  legalPagesSchema,
  legalPagesSource,
);

function loadBusinessUnit(
  label: string,
  source: unknown,
  structural: {
    id: BusinessUnitId;
    slug: "/madera-tecnologica" | "/reformas";
    tone: BusinessTone;
  },
): BusinessUnitConfig {
  const content = parseContent(label, businessUnitContentSchema, source);
  return {
    ...content,
    ...structural,
    published: true,
  };
}

const parsedUnits: BusinessUnitConfig[] = [
  loadBusinessUnit("madera-tecnologica.json", woodUnitSource, {
    id: "madera_tecnologica",
    slug: "/madera-tecnologica",
    tone: "wood",
  }),
  loadBusinessUnit("reformas.json", reformsUnitSource, {
    id: "reformas",
    slug: "/reformas",
    tone: "reform",
  }),
];

export const businessUnits: BusinessUnitConfig[] = parsedUnits.map((unit) => ({
  ...unit,
  services: unit.services.filter((service) => service.visible),
  projects: unit.projects
    .filter((project) => project.visible)
    .sort((left, right) => Number(right.featured) - Number(left.featured)),
}));

function loadDetailedServices(
  label: string,
  source: unknown,
  divisionId: BusinessUnitId,
): DetailedService[] {
  const content = parseContent(label, detailedServicesContentSchema, source);
  return content.services.map((service) => ({ ...service, divisionId }));
}

const parsedServices: DetailedService[] = [
  ...loadDetailedServices("servicios-madera.json", woodServicesSource, "madera_tecnologica"),
  ...loadDetailedServices("servicios-reformas.json", reformsServicesSource, "reformas"),
];

export const services: DetailedService[] = parsedServices
  .filter((service) => service.published)
  .map((service) => ({
    ...service,
    faq: service.faq.filter((item) => item.visible),
  }));

export const woodUnit = getBusinessUnit("madera_tecnologica");
export const reformsUnit = getBusinessUnit("reformas");

export function getBusinessUnit(id: BusinessUnitId): BusinessUnitConfig {
  const unit = businessUnits.find((item) => item.id === id);
  if (!unit) throw new Error(`[CMS] Falta la división publicada: ${id}`);
  return unit;
}

export function getServiceBySlug(slug: string): DetailedService | undefined {
  return services.find((service) => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

export function getServiceDivision(service: DetailedService): BusinessUnitConfig {
  return getBusinessUnit(service.divisionId);
}
