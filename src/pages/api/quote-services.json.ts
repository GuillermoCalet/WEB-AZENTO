import type { APIRoute } from "astro";
import { businessUnits } from "../../lib/cms";

export const prerender = true;

export const GET: APIRoute = () => {
  const payload = Object.fromEntries(
    businessUnits.map((unit) => [
      unit.id,
      {
        label: unit.name,
        subject: unit.id === "madera_tecnologica"
          ? "[AZENTO | MADERA TECNOLÓGICA] Nueva solicitud de presupuesto"
          : "[AZENTO | REFORMAS] Nueva solicitud de presupuesto",
        source_page: unit.slug,
        services: Object.fromEntries(
          unit.formServices.map((service) => [service.value, service.label]),
        ),
      },
    ]),
  );

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
