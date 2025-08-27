import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000", // Kalo dev server nya ada 2, mampus aja tuh yang kedua kena reject
  "https://fe-sispensad.vercel.app",
];

export function middleware(request) {
  const origin = request.headers.get("origin");
  const previewRegex = /^https:\/\/fe-sispensad-[a-z0-9-]+\.vercel\.app$/i; // Untuk preview deployment
  !!origin && (allowedOrigins.includes(origin) || previewRegex.test(origin));

  const headers = new Headers();
  if (isAllowedOrigin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  for (const [key, value] of headers) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  // CORS nya kalau mau endpoint khusus bisa ditambahin disini
  matcher: "/:path*",
};
