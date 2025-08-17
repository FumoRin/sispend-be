import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sispend AD API Dokumentasi",
        version: "0.0.1",
      },
      components: {
        schemas: {
          Users: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string", example: "Dimas Faiz" },
              email: {
                type: "string",
                format: "email",
                example: "dimasfaiz@gmail.com",
              },
              password: { type: "string", example: "passwordrahasia" },
              role: {
                type: "string",
                enum: ["admin", "user"],
                example: "user",
              },
            },
            required: ["id", "name", "email", "role"],
          },
        },
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
      tags: [
        {
          name: "Users",
          description: "User management",
        },
        {
          name: "OTP",
          description: "OTP Akun",
        },
      ],
    },
  });
  return spec;
};
