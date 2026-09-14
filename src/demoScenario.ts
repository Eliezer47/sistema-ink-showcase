// This example models only the public demonstration, never commercial operations.
export type OperationMode = "areas" | "simple";
export type DemoReceipt = Readonly<{
  reference: string;
  amount: number;
  method: "cash" | "transfer";
  received: number;
  change: number;
  paid: number;
  balance: number;
}>;
export type DemoPayment = { id: number; amount: number; method: "cash" | "transfer" } & (
  | { status: "pending" | "rejected"; receipt?: never; reason?: string }
  | { status: "applied"; receipt: DemoReceipt }
);
export type DemoScenario = {
  mode: OperationMode;
  autoPrepare: boolean;
  transferPolicy: "verify" | "immediate";
  quote: "draft" | "approved" | "converted";
  paid: number;
  pendingTransfer: number;
  payments: DemoPayment[];
  production: "pending" | "active" | "finished";
  delivered: number;
  events: string[];
};

export const DEMO_ORDER = {
  quote: "COT-DEMO-0201", reference: "PED-DEMO-0201", customer: "Café Lumbre",
  product: "Camiseta blanca · estampado frontal", quantity: 12, unitPrice: 250,
  total: 3000, initialStock: 36, date: "11/09/2026",
} as const;

export type DemoAction =
  | { type: "reset" }
  | { type: "mode"; mode: OperationMode }
  | { type: "autoPrepare"; enabled: boolean }
  | { type: "transferPolicy"; policy: DemoScenario["transferPolicy"] }
  | { type: "approve" | "convert" | "start" | "finish" }
  | { type: "pay"; amount: number; method: "cash" | "transfer"; received?: number }
  | { type: "verify"; paymentId: number }
  | { type: "reject"; paymentId: number; reason: string }
  | { type: "deliver"; quantity: number; productionConfirmed?: boolean };

export function createDemoScenario(): DemoScenario {
  return { mode: "areas", autoPrepare: true, transferPolicy: "verify", quote: "draft", paid: 0,
    pendingTransfer: 0, payments: [], production: "pending", delivered: 0, events: ["Cotización de ejemplo preparada"] };
}

function record(state: DemoScenario, changes: Partial<DemoScenario>, event: string): DemoScenario {
  return { ...state, ...changes, events: [...state.events, event] };
}

function credited(state: DemoScenario, payment: DemoPayment, received: number, event: string): DemoScenario {
  const paid = Math.round((state.paid + payment.amount) * 100) / 100;
  const production = state.mode === "simple" && state.autoPrepare && paid === DEMO_ORDER.total
    ? "finished" : state.production;
  // A receipt belongs to this fictional movement; later payments never rewrite it.
  const applied: DemoPayment = { ...payment, status: "applied", receipt: {
    reference: `REC-DEMO-${String(payment.id).padStart(4, "0")}`, amount: payment.amount,
    method: payment.method, received, change: Math.round((received - payment.amount) * 100) / 100,
    paid, balance: Math.round((DEMO_ORDER.total - paid) * 100) / 100,
  } };
  const payments = state.payments.some((item) => item.id === payment.id)
    ? state.payments.map((item) => item.id === payment.id ? applied : item)
    : [...state.payments, applied];
  return record(state, { paid, production, payments }, event);
}

export function demoScenarioReducer(state: DemoScenario, action: DemoAction): DemoScenario {
  if (action.type === "reset") return { ...createDemoScenario(), mode: state.mode,
    autoPrepare: state.autoPrepare, transferPolicy: state.transferPolicy };
  if (action.type === "mode") return { ...state, mode: action.mode };
  if (action.type === "autoPrepare") return { ...state, autoPrepare: action.enabled };
  if (action.type === "transferPolicy") return { ...state, transferPolicy: action.policy };
  if (action.type === "approve") return state.quote === "draft" ? record(state, { quote: "approved" }, "Cotización aprobada") : state;
  if (action.type === "convert") return state.quote === "approved" ? record(state, { quote: "converted" }, "Pedido creado desde la cotización") : state;
  if (state.quote !== "converted") return state;
  if (action.type === "pay") {
    const amount = Math.round(action.amount * 100) / 100;
    const availableToPay = Math.round((DEMO_ORDER.total - state.paid - state.pendingTransfer) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0 || amount > availableToPay) return state;
    const received = action.method === "cash" ? Math.round((action.received ?? amount) * 100) / 100 : amount;
    if (!Number.isFinite(received) || received < amount) return state;
    const payment: DemoPayment = { id: state.payments.length + 1, amount, method: action.method, status: "pending" };
    if (action.method === "transfer" && state.transferPolicy === "verify") {
      return record(state, { pendingTransfer: Math.round((state.pendingTransfer + amount) * 100) / 100, payments: [...state.payments, payment] }, "Transferencia pendiente de verificar; todavía no reduce el saldo");
    }
    return credited(state, payment, received, action.method === "cash" ? "Cobro en efectivo aplicado" : "Transferencia aplicada inmediatamente");
  }
  if (action.type === "verify" || action.type === "reject") {
    const payment = state.payments.find((item) => item.id === action.paymentId);
    if (!payment || payment.status !== "pending") return state;
    const pendingTransfer = Math.round((state.pendingTransfer - payment.amount) * 100) / 100;
    if (action.type === "verify") return credited({ ...state, pendingTransfer }, payment, payment.amount, "Transferencia verificada y aplicada");
    const reason = action.reason.trim();
    if (!reason) return state;
    return record(state, { pendingTransfer, payments: state.payments.map((item) => item.id === payment.id ? { ...payment, status: "rejected", reason } : item) }, "Transferencia rechazada; el saldo sigue pendiente y puede cobrarse de nuevo");
  }
  if (action.type === "start") return state.production === "pending" ? record(state, { production: "active" }, "Trabajo iniciado en Producción") : state;
  if (action.type === "finish") return state.production === "active" ? record(state, { production: "finished" }, "Producción finalizada; entrega física pendiente") : state;
  if (action.type === "deliver") {
    if ((state.production !== "finished" && !action.productionConfirmed) || !Number.isInteger(action.quantity) || action.quantity <= 0 || action.quantity > DEMO_ORDER.quantity - state.delivered) return state;
    return record(state, { production: "finished", delivered: state.delivered + action.quantity }, `${state.production !== "finished" ? "Preparación de las 12 unidades confirmada. " : ""}Entrega de ${action.quantity} unidades registrada; salida física de inventario`);
  }
  return state;
}

export function scenarioSummary(state: DemoScenario) {
  const ordered = state.quote === "converted";
  const pendingDelivery = ordered ? DEMO_ORDER.quantity - state.delivered : 0;
  return {
    ordered, balance: ordered ? Math.round((DEMO_ORDER.total - state.paid) * 100) / 100 : 0, pendingDelivery,
    physical: DEMO_ORDER.initialStock - state.delivered,
    reserved: pendingDelivery,
    available: DEMO_ORDER.initialStock - state.delivered - pendingDelivery,
    complete: ordered && state.paid === DEMO_ORDER.total && pendingDelivery === 0,
    paymentLabel: !ordered ? "Sin cuenta por cobrar" : state.paid === DEMO_ORDER.total ? "Pagado" : state.paid > 0 ? "Abono parcial" : "Por cobrar",
    deliveryLabel: !ordered ? "Sin pedido" : pendingDelivery === 0 ? "Entregado" : state.delivered > 0 ? "Entrega parcial" : "Pendiente de entrega",
  };
}

export function calculateDemoCost(quantity: number, additional: number, margin: number, manualPrice?: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000 || !Number.isFinite(additional) || additional < 0 ||
    !Number.isFinite(margin) || margin < 0 || margin >= 100 || (manualPrice !== undefined && (!Number.isFinite(manualPrice) || manualPrice <= 0))) return null;
  const materials = quantity * 110;
  const labor = quantity * 20;
  const machine = quantity * 5;
  const overhead = 60;
  const totalCost = materials + labor + machine + overhead + additional;
  const unitCost = totalCost / quantity;
  const suggested = Math.ceil(unitCost / (1 - margin / 100));
  const unitPrice = manualPrice ?? suggested;
  const revenue = unitPrice * quantity;
  return { materials, labor, machine, overhead, totalCost, unitCost, suggested, unitPrice,
    revenue, profit: revenue - totalCost, margin: (revenue - totalCost) / revenue * 100 };
}
