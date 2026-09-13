import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import { createServer } from "vite";

test("initial presentation shows the system and keeps supplementary content closed", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { default: App } = await server.ssrLoadModule("/src/App.tsx");
    const html = renderToStaticMarkup(createElement(App));
    assert.match(html, /class="demo-site-header"/);
    assert.match(html, /<h1[^>]*>InkGestión<\/h1>/);
    assert.match(html, /<main id="demo-main"/);
    for (const text of ["Explorar pantallas", "Seguir un pedido", "Modo de operación", "Más vistas", "Acerca de esta demo", "Panel principal", "Guía", "DEMO-1048"]) {
      assert.ok(html.includes(text), `Missing first-visit control or system content: ${text}`);
    }
    assert.equal(html.match(/Datos ficticios · Operaciones simuladas/g)?.length, 1);
    assert.doesNotMatch(html, /class="(?:hero|trust-section|benefits-section|feature-carousel)"/);
    assert.doesNotMatch(html, /<dialog\b|role="tabpanel"/);
    assert.doesNotMatch(html, /La operación completa,|Una herramienta pensada alrededor/);
    const controls = html.slice(html.indexOf('class="demo-experience-toolbar"'), html.indexOf('class="demo-workspace-scroll"'));
    for (const label of ["Explorar pantallas", "Seguir un pedido", "Modo de operación", "Guía", "Más vistas", "Ampliar vista"]) {
      assert.ok(controls.includes(label), `Control must stay outside the horizontally scrolling system: ${label}`);
    }
  } finally {
    await server.close();
  }
});
