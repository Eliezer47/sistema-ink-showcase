import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("build contains the isolated Sistema Ink visual showcase", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Sistema Ink \| Recorrido visual<\/title>/i);
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
  assert.match(javascript, /Pantallas complementarias/i);
  assert.match(javascript, /Inicio de sesión/i);
  assert.match(javascript, /Buscar servidor/i);
  assert.match(javascript, /Configurar PIN/i);
  assert.match(javascript, /Sin comunicación con el servidor/i);
  assert.match(javascript, /Sin tráfico de red/i);
  assert.match(javascript, /Una operación más clara, conectada y fácil de seguir/i);
  assert.match(javascript, /Compras e inventario trazables/i);
  assert.match(javascript, /Control por roles y respaldos/i);
  assert.match(javascript, /La demostración utiliza datos ficticios y presenta únicamente el alcance visual del producto/i);
  assert.doesNotMatch(javascript, /Entiende el flujo, módulo por módulo|aria-roledescription.{0,20}carrusel/i);
  // Timer helpers are part of the bundled React scheduler. The source-level
  // safety suite verifies that the showcase itself has no autoplay or timers.
  assert.doesNotMatch(javascript, /localhost:5114|Bearer\s|SistemaInk\.Contracts/i);
});
