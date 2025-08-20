import { createSwaggerSpec } from "next-swagger-doc";
import path from "path";

export const getApiDocs = () => {
  const apiFolder = path.join(process.cwd(), "app", "api");

  return createSwaggerSpec({
    apiFolder,
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
        {
          name: "Soldier",
          description: "Manajemen data personil (import, export, count)",
        },
        {
          name: "History",
          description: "Pencatatan aktivitas pengguna dan perubahan data",
        },
      ],
    },
  });
};
