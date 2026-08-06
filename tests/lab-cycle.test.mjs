import assert from "node:assert/strict";
import test from "node:test";

import {
  LAB_SCENARIO,
  createInitialLabState,
  getLabSnapshot,
  labCycleReducer,
} from "../src/labCycle.js";

const fullCycleActions = [
  "approve_quote",
  "create_order",
  "record_deposit",
  "start_production",
  "finish_production",
  "approve_quality",
  "register_delivery",
  "settle_balance",
];

test("starts with a deterministic synthetic quote and no financial or stock impact", () => {
  const state = createInitialLabState();
  const snapshot = getLabSnapshot(state);

  assert.equal(state.stage, "quote_draft");
  assert.match(LAB_SCENARIO.quoteReference, /DEMO-/u);
  assert.match(LAB_SCENARIO.customer.email, /\.example$/u);
  assert.equal(snapshot.paidAmount, 0);
  assert.equal(snapshot.balanceAmount, LAB_SCENARIO.totalAmount);
  assert.equal(snapshot.inventoryMovements, 0);
  assert.equal(state.events.length, 1);
});

test("runs the complete operational cycle and updates its derived ledgers", () => {
  const completed = fullCycleActions.reduce(
    (state, type) => labCycleReducer(state, { type }),
    createInitialLabState(),
  );
  const snapshot = getLabSnapshot(completed);

  assert.equal(completed.stage, "completed");
  assert.equal(completed.events.length, fullCycleActions.length + 1);
  assert.equal(snapshot.progressPercent, 100);
  assert.equal(snapshot.paidAmount, LAB_SCENARIO.totalAmount);
  assert.equal(snapshot.balanceAmount, 0);
  assert.equal(snapshot.inventoryMovements, LAB_SCENARIO.materials.length);
  assert.ok(snapshot.materials.every((material) => material.available < material.initial));
});

test("rejects an operation when its prerequisite stage has not been completed", () => {
  const initial = createInitialLabState();
  const unchanged = labCycleReducer(initial, { type: "start_production" });

  assert.strictEqual(unchanged, initial);
});

test("resets the lab without retaining events or simulated balances", () => {
  const advanced = labCycleReducer(createInitialLabState(), { type: "approve_quote" });
  const reset = labCycleReducer(advanced, { type: "reset" });

  assert.deepEqual(reset, createInitialLabState());
});
