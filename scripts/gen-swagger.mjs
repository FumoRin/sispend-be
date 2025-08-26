import { createSwaggerSpec } from "next-swagger-doc";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sispend AD API Dokumentasi",
        version: "0.0.1",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });

  const outPath = join(process.cwd(), "public", "swagger.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(spec, null, 2));
  console.log(`Generated swagger.json at ${outPath}`);
} catch (error) {
  console.error("Failed to generate swagger.json", error);
  process.exit(1);
}
