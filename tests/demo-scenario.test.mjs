import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Exercise the actual TypeScript model without adding a test runtime dependency.
const source = readFileSync(new URL("../src/demoScenario.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const { createDemoScenario, demoScenarioReducer: reduce, scenarioSummary: summary, calculateDemoCost, DEMO_ORDER } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const ordered = (mode = "areas", autoPrepare = true) => {
  let state = { ...createDemoScenario(), mode, autoPrepare };
  state = reduce(state, { type: "approve" });
  return reduce(state, { type: "convert" });
};

test("a draft does not create an order, reserve inventory, or accept a payment", () => {
  const state = createDemoScenario();
  assert.equal(summary(state).ordered, false);
  assert.equal(summary(state).reserved, 0);
  assert.equal(summary(state).balance, 0);
  assert.equal(summary(state).paymentLabel, "Sin cuenta por cobrar");
  for (const action of [{ type: "convert" }, { type: "pay", amount: 100, method: "cash" }, { type: "start" }, { type: "deliver", quantity: 1 }]) assert.equal(reduce(state, action), state);
});

test("approved quotation converts exactly once and reserves the demonstration quantity", () => {
  const state = ordered();
  assert.equal(summary(state).reserved, 12);
  assert.equal(summary(state).available, 24);
  assert.equal(reduce(state, { type: "convert" }), state);
});

test("partial payment preserves the balance and does not complete production or delivery", () => {
  const state = reduce(ordered("simple"), { type: "pay", amount: 600, method: "cash" });
  assert.equal(state.paid, 600);
  assert.equal(summary(state).balance, 2400);
  assert.equal(state.production, "pending");
  assert.equal(summary(state).physical, 36);
  assert.equal(state.delivered, 0);
});

test("Simple full payment prepares production only when configured, never physical delivery", () => {
  const state = reduce(ordered("simple"), { type: "pay", amount: 3000, method: "cash" });
  assert.equal(state.production, "finished");
  assert.equal(state.delivered, 0);
  assert.equal(summary(state).deliveryLabel, "Pendiente de entrega");
  assert.equal(summary(state).physical, 36);
  assert.equal(summary(state).complete, false);
  for (const initial of [ordered("areas"), ordered("simple", false)]) {
    assert.equal(reduce(initial, { type: "pay", amount: 3000, method: "cash" }).production, "pending");
  }
});

test("pending transfers do not reduce receivables or prepare the order until verified", () => {
  let state = reduce(ordered("simple"), { type: "pay", amount: 3000, method: "transfer" });
  assert.equal(state.paid, 0);
  assert.equal(state.pendingTransfer, 3000);
  assert.equal(summary(state).balance, 3000);
  assert.equal(state.production, "pending");
  assert.equal(reduce(state, { type: "pay", amount: 1, method: "cash" }), state);
  state = reduce(state, { type: "verify", paymentId: 1 });
  assert.equal(state.paid, 3000);
  assert.equal(state.pendingTransfer, 0);
  assert.equal(state.production, "finished");
  assert.equal(state.delivered, 0);
  assert.equal(reduce(state, { type: "verify", paymentId: 1 }), state);
});

test("immediate transfer policy applies payment; changing policy never credits an existing pending transfer", () => {
  let state = reduce(ordered(), { type: "pay", amount: 600, method: "transfer" });
  state = reduce(state, { type: "transferPolicy", policy: "immediate" });
  assert.equal(state.paid, 0);
  assert.equal(state.pendingTransfer, 600);
  state = reduce(state, { type: "pay", amount: 2400, method: "transfer" });
  assert.equal(state.paid, 2400);
  state = reduce(state, { type: "verify", paymentId: 1 });
  assert.equal(state.paid, DEMO_ORDER.total);
});

test("invalid and excessive payments are rejected without mutating the example", () => {
  const state = ordered();
  for (const amount of [-1, 0, NaN, Infinity, 3000.01]) assert.equal(reduce(state, { type: "pay", amount, method: "cash" }), state);
  let cents = reduce(state, { type: "pay", amount: 0.1, method: "transfer" });
  cents = reduce(cents, { type: "pay", amount: 0.2, method: "transfer" });
  assert.equal(cents.pendingTransfer, 0.3);
  cents = reduce(cents, { type: "pay", amount: 2999.69, method: "cash" });
  cents = reduce(cents, { type: "pay", amount: 0.01, method: "cash" });
  cents = reduce(cents, { type: "verify", paymentId: 1 });
  cents = reduce(cents, { type: "verify", paymentId: 2 });
  assert.equal(cents.paid, 3000);
  assert.equal(summary(cents).balance, 0);
});

test("partial deliveries change physical stock and reservations once, independently of the balance", () => {
  let state = ordered();
  assert.equal(reduce(state, { type: "deliver", quantity: 1 }), state);
  state = reduce(reduce(state, { type: "start" }), { type: "finish" });
  state = reduce(state, { type: "deliver", quantity: 5 });
  assert.deepEqual([summary(state).physical, summary(state).reserved, summary(state).available], [31, 7, 24]);
  assert.equal(summary(state).balance, 3000);
  for (const quantity of [-1, 0, 1.5, 8, NaN]) assert.equal(reduce(state, { type: "deliver", quantity }), state);
  state = reduce(state, { type: "deliver", quantity: 7 });
  assert.deepEqual([summary(state).physical, summary(state).reserved, state.delivered], [24, 0, 12]);
  assert.equal(reduce(state, { type: "deliver", quantity: 1 }), state);
  assert.equal(summary(state).complete, false);
  state = reduce(state, { type: "pay", amount: 3000, method: "cash" });
  assert.equal(summary(state).complete, true);
});

test("switching mode preserves operational state; reset restores fictional records and stock", () => {
  let state = reduce(ordered(), { type: "pay", amount: 600, method: "cash" });
  state = reduce(state, { type: "mode", mode: "simple" });
  assert.equal(state.paid, 600);
  assert.equal(state.quote, "converted");
  const reset = reduce(state, { type: "reset" });
  assert.equal(reset.mode, "simple");
  assert.equal(reset.paid, 0);
  assert.equal(reset.quote, "draft");
  assert.equal(summary(reset).physical, 36);
  assert.equal(reset.events.length, 1);
});

test("illustrative calculator distinguishes margin on revenue from markup and honors manual price", () => {
  const result = calculateDemoCost(12, 0, 30);
  assert.equal(result.totalCost, 1680);
  assert.equal(result.unitCost, 140);
  assert.equal(result.suggested, 200);
  assert.equal(result.revenue, 2400);
  assert.equal(result.profit, 720);
  assert.equal(result.margin, 30);
  const manual = calculateDemoCost(12, 120, 30, 250);
  assert.equal(manual.totalCost, 1800);
  assert.equal(manual.revenue, 3000);
  assert.equal(manual.profit, 1200);
  assert.equal(manual.margin, 40);
  for (const args of [[0, 0, 30], [1.5, 0, 30], [10001, 0, 30], [1, -1, 30], [1, 0, 100], [1, 0, NaN], [1, 0, 30, 0]]) assert.equal(calculateDemoCost(...args), null);
});

test("suggested price rounds up to a whole unit while a manual price keeps its cents", () => {
  const suggested = calculateDemoCost(1, 0, 30);
  assert.equal(suggested.suggested, 279);
  assert.equal(suggested.revenue, 279);
  const manual = calculateDemoCost(1, 0, 30, 275.50);
  assert.equal(manual.suggested, 279);
  assert.equal(manual.unitPrice, 275.50);
});

test("each applied payment keeps its own receipt after further payments and delivery", () => {
  let state = reduce(ordered(), { type: "pay", amount: 600, method: "cash", received: 1000 });
  const firstReceipt = state.payments[0].receipt;
  assert.deepEqual([firstReceipt.amount, firstReceipt.received, firstReceipt.change, firstReceipt.paid, firstReceipt.balance], [600, 1000, 400, 600, 2400]);
  state = reduce(state, { type: "pay", amount: 2400, method: "transfer" });
  assert.equal(state.payments[1].receipt, undefined);
  state = reduce(state, { type: "verify", paymentId: 2 });
  state = reduce(state, { type: "deliver", quantity: 12, productionConfirmed: true });
  assert.equal(state.payments[0].receipt, firstReceipt);
  assert.deepEqual([state.payments[1].receipt.amount, state.payments[1].receipt.paid, state.payments[1].receipt.balance], [2400, 3000, 0]);
  assert.notEqual(firstReceipt.reference, state.payments[1].receipt.reference);
});

test("verifying or rejecting a transfer affects only the chosen movement", () => {
  let state = reduce(ordered(), { type: "pay", amount: 600, method: "transfer" });
  state = reduce(state, { type: "pay", amount: 900, method: "transfer" });
  assert.equal(reduce(state, { type: "verify", paymentId: 999 }), state);
  assert.equal(reduce(state, { type: "reject", paymentId: 1, reason: " " }), state);
  state = reduce(state, { type: "verify", paymentId: 2 });
  assert.equal(state.paid, 900);
  assert.equal(state.pendingTransfer, 600);
  state = reduce(state, { type: "reject", paymentId: 1, reason: "Transferencia no recibida" });
  assert.equal(state.paid, 900);
  assert.equal(state.pendingTransfer, 0);
  assert.equal(state.payments[0].status, "rejected");
  assert.equal(state.payments[0].receipt, undefined);
  assert.equal(reduce(state, { type: "verify", paymentId: 1 }), state);
  assert.equal(reduce(state, { type: "verify", paymentId: 2 }), state);
  assert.equal(reduce(state, { type: "reject", paymentId: 2, reason: "No recibida" }), state);
  state = reduce(state, { type: "pay", amount: 2100, method: "cash" });
  assert.equal(summary(state).balance, 0);
});

test("cash receipt rejects invalid received amounts and reset clears movement history", () => {
  const state = ordered();
  for (const received of [NaN, Infinity, -1, 599.99]) {
    assert.equal(reduce(state, { type: "pay", amount: 600, method: "cash", received }), state);
  }
  const paid = reduce(state, { type: "pay", amount: 600, method: "cash", received: 600 });
  assert.deepEqual(reduce(paid, { type: "reset" }).payments, []);
});

test("first delivery can finish the whole prepared line explicitly without requiring payment", () => {
  for (const mode of ["simple", "areas"]) {
    let state = ordered(mode, false);
    assert.equal(reduce(state, { type: "deliver", quantity: 5 }), state);
    state = reduce(state, { type: "deliver", quantity: 5, productionConfirmed: true });
    assert.equal(state.production, "finished");
    assert.equal(state.delivered, 5);
    assert.equal(state.paid, 0);
    assert.equal(summary(state).balance, 3000);
    state = reduce(state, { type: "deliver", quantity: 7 });
    assert.equal(state.delivered, 12);
    assert.equal(summary(state).complete, false);
  }
});
