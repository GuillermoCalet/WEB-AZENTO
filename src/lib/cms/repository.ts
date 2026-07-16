import businessUnitsSource from "../../content/cms/business-units.json";
import detailedServicesSource from "../../content/cms/detailed-services.json";
import homeSource from "../../content/cms/home.json";
import siteSettingsSource from "../../content/cms/site-settings.json";
import {
  businessUnitsSchema,
  detailedServicesSchema,
  homePageSchema,
  siteSettingsSchema,
} from "./schemas";
import type {
  BusinessUnitConfig,
  BusinessUnitId,
  DetailedService,
  HomePage,
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

const parsedUnits = parseContent(
  "business-units.json",
  businessUnitsSchema,
  businessUnitsSource,
).units;

export const businessUnits: BusinessUnitConfig[] = parsedUnits
  .filter((unit) => unit.published)
  .map((unit) => ({
    ...unit,
    services: unit.services.filter((service) => service.visible),
    projects: unit.projects
      .filter((project) => project.visible)
      .sort((left, right) => Number(right.featured) - Number(left.featured)),
  }));

const parsedServices = parseContent(
  "detailed-services.json",
  detailedServicesSchema,
  detailedServicesSource,
).services;

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
