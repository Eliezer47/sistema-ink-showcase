export type LabStageId =
  | "quote_draft"
  | "quote_approved"
  | "order_created"
  | "deposit_paid"
  | "production_active"
  | "quality_pending"
  | "delivery_ready"
  | "dispatch_prepared"
  | "balance_due"
  | "receipt_ready"
  | "completed";

export type LabActionType =
  | "approve_quote"
  | "create_order"
  | "record_deposit"
  | "start_production"
  | "finish_production"
  | "approve_quality"
  | "prepare_dispatch"
  | "register_delivery"
  | "settle_balance"
  | "review_receipt"
  | "reset";

export type LabModuleId =
  | "panel"
  | "cotizaciones"
  | "ventas"
  | "caja"
  | "produccion"
  | "calidad"
  | "entregas"
  | "inventario"
  | "finanzas";

export interface LabEvent {
  id: string;
  time: string;
  label: string;
  detail: string;
}

export interface LabCycleState {
  stage: LabStageId;
  events: LabEvent[];
}

export interface LabStageDefinition {
  id: LabStageId;
  label: string;
  module: LabModuleId;
  action: Exclude<LabActionType, "reset"> | null;
  actionLabel: string;
  instruction: string;
}

export interface LabMaterial {
  code: string;
  name: string;
  initial: number;
  consumed: number;
  unit: string;
}

export interface LabScenario {
  id: string;
  quoteReference: string;
  orderReference: string;
  customer: { code: string; name: string; contact: string; email: string };
  items: ReadonlyArray<{ code: string; description: string; quantity: number; unitPrice: number }>;
  materials: ReadonlyArray<LabMaterial>;
  totalAmount: number;
  depositAmount: number;
  customerCreditAmount: number;
  deliveryDate: string;
}

export interface LabSnapshot {
  currentStage: LabStageDefinition;
  nextStage: LabStageDefinition;
  progressPercent: number;
  paidAmount: number;
  balanceAmount: number;
  customerCreditApplied: number;
  receiptStatus: string;
  shippingLabelStatus: string;
  inventoryMovements: number;
  materials: Array<LabMaterial & { available: number; committed: number }>;
  orderStatus: string;
  productionStatus: string;
  qualityStatus: string;
  deliveryStatus: string;
}

export const LAB_SCENARIO: LabScenario;
export const LAB_STAGES: ReadonlyArray<LabStageDefinition>;
export function createInitialLabState(): LabCycleState;
export function labCycleReducer(state: LabCycleState, action: { type: LabActionType }): LabCycleState;
export function getLabSnapshot(state: LabCycleState): LabSnapshot;
