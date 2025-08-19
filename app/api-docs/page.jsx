'use client';
import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    // Load Swagger UI script dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js";
    script.onload = () => {
      window.SwaggerUIBundle({
        url: "/api/docs", // points to your API spec
        dom_id: "#swagger-ui",
        presets: [window.SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
      />
      <div id="swagger-ui" style={{ width: "100%", height: "100vh" }} />
    </>
  );
}
