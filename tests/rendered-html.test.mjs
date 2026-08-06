import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("build contains the isolated InkGestión visual laboratory", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>InkGestión \| Laboratorio visual<\/title>/i);
  assert.match(html, /connect-src 'none'/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

  const assetNames = await readdir(new URL("../dist/client/assets/", import.meta.url));
  const javascript = (
    await Promise.all(
      assetNames.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../dist/client/assets/${name}`, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.match(javascript, /Demo visual aislada/i);
  assert.match(javascript, /MODO LAB OPERATIVO/i);
  assert.match(javascript, /Aprobar cotización/i);
  assert.match(javascript, /Convertir en pedido/i);
  assert.match(javascript, /Registrar anticipo/i);
  assert.match(javascript, /Iniciar producción/i);
  assert.match(javascript, /Aprobar calidad/i);
  assert.match(javascript, /Registrar entrega/i);
  assert.match(javascript, /Cobrar saldo/i);
  assert.match(javascript, /Reiniciar LAB/i);
  assert.match(javascript, /Ciclo completado/i);
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
  assert.match(javascript, /Detalles que hacen más simple el trabajo diario/i);
  assert.match(javascript, /Iniciar sesión/i);
  assert.match(javascript, /Conectar con el servidor/i);
  assert.match(javascript, /Configurar PIN/i);
  assert.match(javascript, /FORMATO NORMAL · CARTA \/ A4/i);
  assert.match(javascript, /FORMATO BAUCHER · RECIBO TÉRMICO/i);
  assert.match(javascript, /80 mm/i);
  assert.match(javascript, /58 mm/i);
  assert.match(javascript, /No válido como comprobante fiscal/i);
  assert.match(javascript, /Pausar recorrido automático/i);
  assert.match(javascript, /Reanudar recorrido automático/i);
  assert.match(javascript, /Sin comunicación con el servidor/i);
  assert.match(javascript, /Sin tráfico de red/i);
  assert.match(javascript, /Una herramienta pensada alrededor del trabajo real/i);
  assert.match(javascript, /Todo el flujo conserva su contexto/i);
  assert.match(javascript, /Impresión lista para cada estación/i);
  assert.match(javascript, /Control sin perder continuidad/i);
  assert.match(javascript, /Alcance visual con datos ficticios/i);
  assert.match(javascript, /carrusel/i);
  assert.doesNotMatch(javascript, /Entiende el flujo, módulo por módulo/i);
  assert.doesNotMatch(javascript, /localhost:5114|Bearer\s|SistemaInk\.Contracts/i);
});

test("build exposes a static Sites worker without application connectivity", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("https://lab.example/ruta-interna"),
    {
      ASSETS: {
        fetch: async (request) => new Response(new URL(request.url).pathname === "/index.html" ? "LAB SHELL" : "Not found", { status: new URL(request.url).pathname === "/index.html" ? 200 : 404 }),
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "LAB SHELL");
});
