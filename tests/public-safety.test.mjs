import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import test from "node:test";

const candidates = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
).split("\0").filter(Boolean).map((path) => path.replaceAll("\\", "/"));

const forbiddenExtensions = new Set([
  ".bak", ".backup", ".cer", ".cs", ".csproj", ".db", ".der", ".dll", ".exe",
  ".inkbackup", ".key", ".ldf", ".map", ".mdf", ".msi", ".nupkg", ".p12", ".pdb",
  ".pem", ".pfx", ".ps1", ".rar", ".resx", ".sln", ".sql", ".sqlite", ".sqlite3",
  ".xaml", ".zip", ".7z",
]);

const forbiddenPaths = [
  /(^|\/)app\/api(\/|$)/i,
  /(^|\/)(auth|backups?|database|db|drizzle|examples|migrations|prisma|server)(\/|$)/i,
  /(^|\/)chatgpt-auth\.[cm]?[jt]sx?$/i,
];

test("contains no product source, database artifacts, backups or binaries", () => {
  for (const path of candidates) {
    assert.ok(!forbiddenExtensions.has(extname(path).toLowerCase()), `Forbidden extension: ${path}`);
    assert.ok(!forbiddenPaths.some((pattern) => pattern.test(path)), `Forbidden path: ${path}`);
    assert.ok(!path.endsWith(".gitmodules"), `Submodules are not allowed: ${path}`);
  }
});

test("application code performs no network calls or browser persistence", () => {
  const appFiles = candidates.filter((path) => /^src\/.*\.[cm]?[jt]sx?$/i.test(path));
  const source = appFiles.map((path) => readFileSync(path, "utf8")).join("\n");

  for (const pattern of [
    /\bfetch\s*\(/i,
    /\baxios\b/i,
    /\bXMLHttpRequest\b/i,
    /\bWebSocket\b/i,
    /\bEventSource\b/i,
    /\bsendBeacon\b/i,
    /\blocalStorage\b/i,
    /\bsessionStorage\b/i,
    /["']use server["']/i,
    /\/api(?:\/|["'])/i,
  ]) {
    assert.doesNotMatch(source, pattern);
  }
});

test("uses explicit synthetic-data conventions and no private product markers", () => {
  const textFiles = candidates.filter(
    (path) => !path.startsWith("tests/") && /\.(css|html|json|md|mjs|ts|tsx|yml)$/i.test(path),
  );
  const source = textFiles.map((path) => readFileSync(path, "utf8")).join("\n");

  assert.match(source, /DEMO-/);
  assert.match(source, /\.example\b/);
  assert.match(source, /Datos ficticios/i);
  assert.doesNotMatch(source, /localhost:5114|SistemaInk\.Contracts|Authorization:\s*Bearer|C:\\Users\\/i);

  const emails = source.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) ?? [];
  const allowedPublicEmails = new Set(["eliezerponcexd@gmail.com"]);
  for (const email of emails) {
    assert.ok(email.endsWith(".example") || allowedPublicEmails.has(email), `Unexpected email: ${email}`);
  }
});

test("keeps product-facing dependencies out of the direct dependency list", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const direct = new Set([...Object.keys(packageJson.dependencies ?? {}), ...Object.keys(packageJson.devDependencies ?? {})]);
  for (const dependency of ["axios", "drizzle-kit", "drizzle-orm", "mongodb", "mysql", "pg", "prisma", "sqlite"]) {
    assert.ok(!direct.has(dependency), `Forbidden direct dependency: ${dependency}`);
  }
});

test("mirrors the current public menu hierarchy without hidden direct entries", () => {
  const source = readFileSync("src/DemoWorkspace.tsx", "utf8");
  const css = readFileSync("src/globals.css", "utf8");

  for (const label of [
    "Panel principal", "Métricas", "Ventas", "Caja", "Producción", "Clientes", "Cotizaciones",
    "Control de entregas", "Artículos del cliente", "Calidad", "Finanzas", "Compras",
    "Inventario", "Catálogo", "Administración", "MÁS OPCIONES",
  ]) {
    assert.match(source, new RegExp(label, "u"), `Missing current menu label: ${label}`);
  }

  for (const hiddenId of ["pedidos", "cuentas-por-cobrar", "cuentas-por-pagar"]) {
    assert.doesNotMatch(source, new RegExp(`id:\\s*["']${hiddenId}["']`, "iu"));
  }

  assert.doesNotMatch(source, /nav-glyph|caption:\s*["']/i);
  assert.match(css, /grid-template-columns:\s*190px\s+minmax\(0,\s*1fr\)/i);
  assert.match(css, /grid-template-rows:\s*38px\s+654px\s+28px/i);
  assert.match(css, /\.real-sidebar nav \.sidebar-nav-button[\s\S]*?display:\s*block[\s\S]*?min-height:\s*36px/i);
  assert.match(css, /\.generic-administracion\.with-internal-nav[\s\S]*?grid-template-columns:\s*220px/i);
  assert.match(css, /\.generic-catalogo\.with-internal-nav[\s\S]*?grid-template-columns:\s*195px/i);
  assert.match(source, /scrollTo\(\{ left: 0, top: 0 \}\)/i);
  assert.match(source, /setAdministrationView/i);
  assert.match(source, /setCatalogView/i);
});

test("provides distinct internal screens and an accessible contextual guide", () => {
  const workspace = readFileSync("src/DemoWorkspace.tsx", "utf8");
  const internalViews = readFileSync("src/InternalViews.tsx", "utf8");
  const guide = readFileSync("src/InteractiveGuide.tsx", "utf8");
  const css = readFileSync("src/globals.css", "utf8");

  for (const view of [
    "Empresa", "Usuarios", "Roles y permisos", "Equipos conectados",
    "Métricas de ventas", "Estación e impresión", "Respaldos y diagnóstico",
    "Productos y servicios", "Categorías", "Unidades", "Recetas y costos", "Proveedores",
  ]) {
    assert.match(internalViews, new RegExp(view, "u"), `Missing internal demo screen: ${view}`);
  }

  for (const id of [
    "panel", "metricas", "ventas", "caja", "produccion", "clientes", "cotizaciones", "entregas",
    "articulos", "calidad", "finanzas", "compras", "inventario", "catalogo", "administracion",
  ]) {
    assert.match(guide, new RegExp(`\\b${id}:\\s*\\{`, "u"), `Missing contextual guide module: ${id}`);
  }

  assert.match(workspace, /useState<AdministrationViewId>\("empresa"\)/u);
  assert.match(workspace, /data-submenu-id=\{item\.id\}/u);
  assert.match(workspace, /aria-current=\{activeInternal === item\.id \? "page"/u);
  assert.match(workspace, /resetInternalScroll/u);
  assert.match(workspace, /internal-view-host/u);
  for (const viewId of ["empresa", "usuarios", "roles", "equipos", "metricas-ventas", "estacion", "respaldos"]) {
    assert.match(internalViews, new RegExp(`case ["']${viewId}["']`, "u"), `Missing explicit Administration dispatch: ${viewId}`);
  }
  for (const viewId of ["productos", "categorias", "unidades", "recetas", "proveedores"]) {
    assert.match(internalViews, new RegExp(`case ["']${viewId}["']`, "u"), `Missing explicit Catalog dispatch: ${viewId}`);
  }
  assert.match(workspace, /import InteractiveGuide/u);
  assert.match(workspace, /<InteractiveGuide\s+active=\{active\}/u);
  assert.doesNotMatch(workspace, /GuidedTour/u);

  for (const target of ["more-options", "active-module", "sub-navigation", "module-surface", "status-bar"]) {
    assert.match(guide, new RegExp(`["']${target}["']`, "u"), `Missing contextual guide target: ${target}`);
    assert.match(workspace, new RegExp(`data-guide-target[^\\n]{0,120}["']${target}["']`, "u"), `Missing guide anchor: ${target}`);
  }

  const interactiveSource = `${workspace}\n${internalViews}`;
  for (const target of [
    "module-header", "module-metrics", "flow-toolbar", "workflow-columns", "workspace-tabs",
    "module-filter", "record-list", "selected-record", "record-detail",
  ]) {
    assert.match(guide, new RegExp(`["']${target}["']`, "u"), `Missing precise guide step: ${target}`);
    assert.match(interactiveSource, new RegExp(`data-guide-target[^\n]{0,160}["']${target}["']`, "u"), `Missing precise guide anchor: ${target}`);
  }

  assert.match(guide, /aria-label=\{`Guía de/u);
  assert.match(guide, /aria-label="Cerrar guía"/u);
  assert.match(guide, /role="region"/u);
  assert.match(guide, /role="status"/u);
  assert.match(guide, /aria-live="polite"/u);
  assert.match(guide, /event\.key === "Escape"/u);
  assert.match(guide, /La navegación sigue disponible/u);
  assert.match(guide, /Anterior/u);
  assert.match(guide, /Siguiente/u);
  assert.match(guide, /Terminar/u);
  assert.match(guide, /ResizeObserver/u);
  assert.match(guide, /MutationObserver/u);
  assert.match(guide, /aria-describedby/u);
  assert.match(css, /\.context-guide-layer\s*\{[^}]*pointer-events:\s*none/is);
  assert.match(css, /\.context-guide-card\s*\{[^}]*pointer-events:\s*auto/is);
  assert.doesNotMatch(guide, /aria-roledescription="carrusel"|setInterval|setTimeout/u);
});

test("includes the current metrics and purchases presentation as read-only synthetic views", () => {
  const workspace = readFileSync("src/DemoWorkspace.tsx", "utf8");
  const internalViews = readFileSync("src/InternalViews.tsx", "utf8");

  for (const label of [
    "Ventas del mes", "Cobrado", "Gastos registrados", "Utilidad bruta est.", "Por cobrar",
    "Ventas por semana", "Productos y servicios líderes", "Gastos por categoría",
  ]) {
    assert.match(workspace, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "iu"), `Missing executive metric: ${label}`);
  }

  for (const label of [
    "Reporte de compras", "Plantilla", "Importar líneas", "Nueva compra",
    "Compras abiertas", "Atrasadas", "Valor por recibir", "Pendientes de recepción",
    "COMPRA SELECCIONADA", "Inspeccionar y recibir",
  ]) {
    assert.match(workspace, new RegExp(label, "u"), `Missing redesigned purchases detail: ${label}`);
  }

  assert.match(workspace, /className="purchase-workspace"/u);
  assert.match(workspace, /data-guide-target="record-list"/u);
  assert.match(workspace, /data-guide-target="record-detail"/u);
  assert.match(internalViews, /title="Métricas de ventas"/u);
  assert.match(internalViews, /title="Proveedores"/u);

  for (const source of [workspace, internalViews]) {
    assert.match(source, /DEMO-/u);
    assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/u);
  }
});

test("provides manual accessible auxiliary views without exposing product connectivity", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const auxiliary = readFileSync("src/AuxiliaryViews.tsx", "utf8");

  for (const label of [
    "Inicio de sesión", "Buscar servidor", "Configurar PIN", "Sin conexión",
    "Acceso por contraseña o PIN", "Sin comunicación con el servidor",
  ]) {
    assert.match(auxiliary, new RegExp(label, "u"), `Missing auxiliary view: ${label}`);
  }

  assert.match(app, /import AuxiliaryViews from ["']\.\/AuxiliaryViews["']/u);
  assert.match(app, /<AuxiliaryViews\s*\/\s*>/u);
  assert.match(auxiliary, /role="tablist"/u);
  assert.match(auxiliary, /role="tab"/u);
  assert.match(auxiliary, /role="tabpanel"/u);
  assert.match(auxiliary, /aria-selected=\{view\.id === activeId\}/u);
  assert.match(auxiliary, /tabIndex=\{view\.id === activeId \? 0 : -1\}/u);
  assert.match(auxiliary, /ArrowRight/u);
  assert.match(auxiliary, /ArrowLeft/u);
  assert.match(auxiliary, /event\.key === "Home"/u);
  assert.match(auxiliary, /event\.key === "End"/u);
  assert.match(auxiliary, /aria-live="polite"/u);
  assert.match(auxiliary, /Datos ficticios · Controles sin conexión/u);
  assert.match(auxiliary, /192\.0\.2\.(?:10|20|30)/u);
  assert.match(auxiliary, /Sin tráfico de red/u);
  assert.match(auxiliary, /No se muestran puertos, certificados, servicios ni direcciones reales/u);
  assert.match(auxiliary, /La demostración no registra, valida ni conserva ningún PIN/u);
  assert.doesNotMatch(auxiliary, /setInterval|setTimeout|requestAnimationFrame|autoplay|autoPlay|aria-roledescription=["']carousel["']/u);
  assert.doesNotMatch(auxiliary, /fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage/u);

  const operationalButtons = auxiliary.match(/<button\b[^>]*\bdisabled\b[^>]*>/gu) ?? [];
  assert.ok(operationalButtons.length >= 10, "Expected auxiliary operational controls to remain disabled");
});

test("explains product benefits while preserving the public-demo boundary", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const benefits = readFileSync("src/BenefitsSection.tsx", "utf8");

  assert.match(app, /import BenefitsSection from ["']\.\/BenefitsSection["']/u);
  assert.match(app, /<BenefitsSection\s*\/\s*>/u);
  for (const benefit of [
    "Operación integrada", "Métricas para decidir", "Compras e inventario trazables",
    "Acceso y continuidad visibles", "Adaptado a cada puesto", "Control por roles y respaldos",
  ]) {
    assert.match(benefits, new RegExp(benefit, "u"), `Missing benefit explanation: ${benefit}`);
  }
  assert.match(benefits, /La demostración utiliza datos ficticios y presenta únicamente el alcance\s+visual del producto/u);
  assert.match(benefits, /aria-labelledby="benefits-title"/u);
  assert.match(benefits, /aria-describedby="benefits-description"/u);
});
