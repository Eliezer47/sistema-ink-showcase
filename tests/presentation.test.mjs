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
    assert.equal(html.match(/Demo del sistema de escritorio · Datos ficticios/g)?.length, 1);
    assert.ok(html.includes("Funciones según edición y permisos"));
    assert.ok(html.includes("Pantallas de referencia · Registros de muestra"));
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

test("cash reference keeps paid orders visibly pending physical delivery", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const { CashDetail } = await server.ssrLoadModule("/src/DesktopDetails.tsx");
    const html = renderToStaticMarkup(createElement(CashDetail, { record: {
      id: "paid", cells: ["PED-DEMO-0199", "Estudio Prisma", "C$ 4,600.00", "C$ 0.00"],
      title: "Pagado · Pendiente de entrega",
      facts: [["Pagado", "C$ 4,600.00"], ["Saldo", "C$ 0.00"], ["Entregado", "12 de 20 unidades"], ["Pendiente de entregar", "8 unidades"]],
    } }));
    assert.match(html, /Pagado · Pendiente de entrega/);
    assert.match(html, /Entrega física pendiente/);
    assert.match(html, /12 de 20 unidades/);
    assert.match(html, /Pendiente: 8 unidades/);
    assert.match(html, /Saldo<\/span><strong>C\$ 0.00/);
  } finally {
    await server.close();
  }
});
