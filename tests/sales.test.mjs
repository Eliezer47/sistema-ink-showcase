import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/demoSales.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const { createSalesSamples, visibleSalesSamples: visible, salesOperation } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("sales filters keep paid but undelivered orders pending and include delivered debt", () => {
  const samples = createSalesSamples();
  const partlyDelivered = samples.find((sample) => sample.reference === "PED-DEMO-0199");
  const historical = samples.find((sample) => sample.reference === "PED-DEMO-0186");
  const deliveredDebt = { ...samples[0], delivered: samples[0].quantity };
  assert.ok(visible(samples, "Pendientes", "").includes(partlyDelivered));
  assert.ok(!visible(samples, "Pendientes", "").includes(historical));
  assert.ok(visible(samples, "Pagados", "").includes(historical));
  assert.deepEqual(visible([deliveredDebt], "Por cobrar", ""), [deliveredDebt]);
  assert.deepEqual(visible([deliveredDebt], "Pendientes", ""), [deliveredDebt]);
  assert.equal(salesOperation(deliveredDebt), "Entregado · Saldo pendiente");
});

test("sales search combines reference, accent-insensitive customer name and inclusive dates", () => {
  const samples = createSalesSamples();
  assert.deepEqual(visible(samples, "Histórico", "  CAFE  ").map((sample) => sample.reference), ["PED-DEMO-0201"]);
  assert.equal(visible(samples, "Histórico", "0203", "2026-09-15", "2026-09-15").length, 1);
  assert.equal(visible(samples, "Histórico", "0203", "2026-09-16").length, 0);
  assert.equal(visible(samples, "Histórico", "sin coincidencias").length, 0);
  assert.equal(visible(samples, "Pagados", "Café").length, 0);
});

test("sales fixtures are independent, coherent and distinguish payment from production", () => {
  const samples = createSalesSamples();
  for (const sample of samples) {
    assert.match(sample.reference, /^PED-DEMO-/);
    assert.equal(Math.round(sample.quantity * sample.price * 100), sample.total * 100);
    assert.ok(sample.paid <= sample.total && sample.delivered <= sample.quantity);
  }
  samples[0].paid = samples[0].total;
  assert.equal(createSalesSamples()[0].paid, 0);
  assert.equal(salesOperation(samples[0]), "Pendiente de producción");
  assert.equal(salesOperation({ ...samples[0], ready: true }), "Lista para entregar");
});
