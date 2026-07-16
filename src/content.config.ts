import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const cms = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/cms" }),
  schema: z.record(z.string(), z.unknown()),
});

export const collections = { cms };
