import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { extname } from "node:path";
import test from "node:test";

test("deployment contains only public runtime assets without source maps", async () => {
  const publicExtensions = new Set([".html", ".css", ".js", ".png", ".svg", ".jpg", ".jpeg", ".webp", ".ico", ".woff2"]);
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      assert.ok(!entry.name.startsWith("."), `Unexpected hidden deployment entry: ${entry.name}`);
      assert.ok(!entry.isSymbolicLink(), `Deployment must not link external files: ${entry.name}`);
      const resource = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      if (entry.isDirectory()) {
        await inspect(resource);
        continue;
      }
      const extension = extname(entry.name).toLowerCase();
      assert.ok(entry.isFile() && publicExtensions.has(extension), `Unexpected deployment asset: ${entry.name}`);
      if ([".html", ".css", ".js"].includes(extension)) {
        const content = await readFile(resource, "utf8");
        assert.doesNotMatch(content, /[#@]\s*sourceMappingURL\s*=/i, `Source map reference in ${entry.name}`);
      }
    }
  }
  await inspect(new URL("../dist/", import.meta.url));
});

test("build contains the isolated InkGestión visual showcase", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>InkGestión \| Recorrido visual<\/title>/i);
  assert.match(html, /connect-src 'none'/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

  const assetNames = await readdir(new URL("../dist/assets/", import.meta.url));
  const javascript = (
    await Promise.all(
      assetNames.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../dist/assets/${name}`, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.match(javascript, /Demo visual aislada/i);
  assert.match(javascript, /Datos ficticios/i);
  assert.match(javascript, /Panel principal/i);
  assert.match(javascript, /Métricas/i);
  assert.match(javascript, /MÁS OPCIONES/i);
  assert.match(javascript, /Caja/i);
  assert.match(javascript, /POR ENTREGAR/i);
  assert.match(javascript, /DEMO-1048/i);
  assert.match(javascript, /GUÍA CONTEXTUAL/i);
  assert.match(javascript, /La navegación sigue disponible/i);
  assert.match(javascript, /Entorno de demostración/i);
  assert.match(javascript, /Recetas y costos/i);
  assert.match(javascript, /Proveedores/i);
  assert.match(javascript, /Métricas de ventas/i);
  assert.match(javascript, /Respaldos y diagnóstico/i);
  assert.match(javascript, /Compras abiertas/i);
  assert.match(javascript, /Valor por recibir/i);
  assert.match(javascript, /Inspeccionar y recibir/i);
  assert.match(javascript, /Datos ficticios · Operaciones simuladas/i);
  assert.match(javascript, /Más vistas del sistema/i);
  assert.match(javascript, /Acerca de esta demo/i);
  assert.match(javascript, /Iniciar sesión/i);
  assert.match(javascript, /Conectar con el servidor/i);
  assert.match(javascript, /Configurar PIN/i);
  assert.match(javascript, /FORMATO NORMAL · CARTA \/ A4/i);
  assert.match(javascript, /FORMATO BAUCHER · RECIBO TÉRMICO/i);
  assert.match(javascript, /80 mm/i);
  assert.match(javascript, /58 mm/i);
  assert.match(javascript, /No válido como comprobante fiscal/i);
  assert.match(javascript, /Sin comunicación con el servidor/i);
  assert.match(javascript, /Sin tráfico de red/i);
  assert.match(javascript, /Sin conexión al producto comercial/i);
  assert.doesNotMatch(javascript, /Una herramienta pensada alrededor del trabajo real|Pausar recorrido automático|Reanudar recorrido automático/i);
  for (const label of ["Seguir un pedido", "Ventas rápidas", "Cobro rápido", "Calculadora de costos", "Disponibilidad rápida", "Familias y variantes", "Auditoría", "Registrar para verificar"]) {
    assert.ok(javascript.includes(label), `Missing new capability: ${label}`);
  }
  assert.doesNotMatch(javascript, /Entiende el flujo, módulo por módulo/i);
  assert.doesNotMatch(javascript, /localhost:5114|Bearer\s|SistemaInk\.Contracts/i);
});
