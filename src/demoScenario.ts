// This example models only the public demonstration, never commercial operations.
export type OperationMode = "areas" | "simple";
export type DemoScenario = {
  mode: OperationMode;
  autoPrepare: boolean;
  transferPolicy: "verify" | "immediate";
  quote: "draft" | "approved" | "converted";
  paid: number;
  pendingTransfer: number;
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
  | { type: "approve" | "convert" | "verify" | "start" | "finish" }
  | { type: "pay"; amount: number; method: "cash" | "transfer" }
  | { type: "deliver"; quantity: number };

export function createDemoScenario(): DemoScenario {
  return { mode: "areas", autoPrepare: true, transferPolicy: "verify", quote: "draft", paid: 0,
    pendingTransfer: 0, production: "pending", delivered: 0, events: ["Cotización de ejemplo preparada"] };
}

function record(state: DemoScenario, changes: Partial<DemoScenario>, event: string): DemoScenario {
  return { ...state, ...changes, events: [...state.events, event] };
}

function credited(state: DemoScenario, amount: number, event: string): DemoScenario {
  const paid = Math.round((state.paid + amount) * 100) / 100;
  const production = state.mode === "simple" && state.autoPrepare && paid === DEMO_ORDER.total
    ? "finished" : state.production;
  return record(state, { paid, production }, event);
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
    if (action.method === "transfer" && state.transferPolicy === "verify") {
      return record(state, { pendingTransfer: Math.round((state.pendingTransfer + amount) * 100) / 100 }, "Transferencia pendiente de verificar; todavía no reduce el saldo");
    }
    return credited(state, amount, action.method === "cash" ? "Cobro en efectivo aplicado" : "Transferencia aplicada inmediatamente");
  }
  if (action.type === "verify") return state.pendingTransfer > 0
    ? credited({ ...state, pendingTransfer: 0 }, state.pendingTransfer, "Transferencia verificada y aplicada") : state;
  if (action.type === "start") return state.production === "pending" ? record(state, { production: "active" }, "Trabajo iniciado en Producción") : state;
  if (action.type === "finish") return state.production === "active" ? record(state, { production: "finished" }, "Producción finalizada; entrega física pendiente") : state;
  if (action.type === "deliver") {
    if (state.production !== "finished" || !Number.isInteger(action.quantity) || action.quantity <= 0 || action.quantity > DEMO_ORDER.quantity - state.delivered) return state;
    return record(state, { delivered: state.delivered + action.quantity }, `Entrega de ${action.quantity} unidades registrada; salida física de inventario`);
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
  const suggested = unitCost / (1 - margin / 100);
  const unitPrice = manualPrice ?? suggested;
  const revenue = unitPrice * quantity;
  return { materials, labor, machine, overhead, totalCost, unitCost, suggested, unitPrice,
    revenue, profit: revenue - totalCost, margin: (revenue - totalCost) / revenue * 100 };
}
