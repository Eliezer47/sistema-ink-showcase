export const LAB_SCENARIO = Object.freeze({
  id: "LAB-DEMO-0201",
  quoteReference: "COT-DEMO-0201",
  orderReference: "PED-DEMO-0201",
  customer: Object.freeze({
    code: "CLI-DEMO-031",
    name: "Café Nube Demo",
    contact: "Sofía Ejemplo",
    email: "compras@cafenube.example",
  }),
  items: Object.freeze([
    Object.freeze({ code: "PRO-DEMO-101", description: "Camiseta promocional estampada", quantity: 24, unitPrice: 400 }),
    Object.freeze({ code: "SER-DEMO-018", description: "Preparación de diseño", quantity: 1, unitPrice: 3200 }),
  ]),
  materials: Object.freeze([
    Object.freeze({ code: "INS-DEMO-014", name: "Tinta textil negra", initial: 18.5, consumed: 1.2, unit: "kg" }),
    Object.freeze({ code: "PRO-DEMO-044", name: "Camiseta blanca", initial: 40, consumed: 24, unit: "u" }),
    Object.freeze({ code: "INS-DEMO-008", name: "Papel transfer A3", initial: 32, consumed: 6, unit: "hojas" }),
  ]),
  totalAmount: 12800,
  depositAmount: 4000,
  customerCreditAmount: 1000,
  deliveryDate: "24/07/2026",
});

export const LAB_STAGES = Object.freeze([
  Object.freeze({ id: "quote_draft", label: "Cotización", module: "cotizaciones", action: "approve_quote", actionLabel: "Aprobar cotización", instruction: "Revisa el alcance ficticio y aprueba la propuesta comercial." }),
  Object.freeze({ id: "quote_approved", label: "Venta", module: "ventas", action: "create_order", actionLabel: "Convertir en pedido", instruction: "Convierte la cotización aprobada en un pedido de trabajo." }),
  Object.freeze({ id: "order_created", label: "Anticipo", module: "caja", action: "record_deposit", actionLabel: "Registrar anticipo", instruction: "Registra un anticipo ficticio para autorizar la producción." }),
  Object.freeze({ id: "deposit_paid", label: "Producción", module: "produccion", action: "start_production", actionLabel: "Iniciar producción", instruction: "Reserva los insumos sintéticos e inicia el trabajo." }),
  Object.freeze({ id: "production_active", label: "Producción", module: "produccion", action: "finish_production", actionLabel: "Finalizar producción", instruction: "Completa el trabajo y envíalo a revisión de calidad." }),
  Object.freeze({ id: "quality_pending", label: "Calidad", module: "calidad", action: "approve_quality", actionLabel: "Aprobar calidad", instruction: "Confirma visualmente cantidades, acabado y empaque." }),
  Object.freeze({ id: "delivery_ready", label: "Despacho", module: "entregas", action: "prepare_dispatch", actionLabel: "Preparar despacho", instruction: "Prepara la etiqueta ficticia con el perfil de esta estación." }),
  Object.freeze({ id: "dispatch_prepared", label: "Entrega", module: "entregas", action: "register_delivery", actionLabel: "Registrar entrega", instruction: "Entrega el pedido ficticio y conserva su referencia visual." }),
  Object.freeze({ id: "balance_due", label: "Cobro final", module: "caja", action: "settle_balance", actionLabel: "Cobrar saldo", instruction: "Registra el pago ficticio restante y cierra el ciclo." }),
  Object.freeze({ id: "receipt_ready", label: "Comprobante", module: "caja", action: "review_receipt", actionLabel: "Revisar comprobante", instruction: "Revisa la vista previa integrada con la impresión preseleccionada." }),
  Object.freeze({ id: "completed", label: "Completado", module: "panel", action: null, actionLabel: "Ciclo completado", instruction: "El pedido fue producido, entregado y cobrado dentro del laboratorio." }),
]);

const transitions = Object.freeze({
  quote_draft: Object.freeze({ action: "approve_quote", nextStage: "quote_approved", time: "09:08", label: "Cotización aprobada", detail: "La propuesta ficticia quedó lista para convertirse en pedido." }),
  quote_approved: Object.freeze({ action: "create_order", nextStage: "order_created", time: "09:12", label: "Pedido creado", detail: "Ventas generó PED-DEMO-0201 sin emitir un documento real." }),
  order_created: Object.freeze({ action: "record_deposit", nextStage: "deposit_paid", time: "09:18", label: "Anticipo registrado", detail: "Caja aplicó C$ 3,000 ficticios y C$ 1,000 de saldo a favor LAB." }),
  deposit_paid: Object.freeze({ action: "start_production", nextStage: "production_active", time: "09:26", label: "Producción iniciada", detail: "Los materiales sintéticos fueron reservados para el trabajo." }),
  production_active: Object.freeze({ action: "finish_production", nextStage: "quality_pending", time: "11:05", label: "Producción finalizada", detail: "Las 24 unidades pasaron a revisión de calidad." }),
  quality_pending: Object.freeze({ action: "approve_quality", nextStage: "delivery_ready", time: "11:18", label: "Calidad aprobada", detail: "Cantidad, acabado y empaque fueron aprobados en modo LAB." }),
  delivery_ready: Object.freeze({ action: "prepare_dispatch", nextStage: "dispatch_prepared", time: "11:24", label: "Despacho preparado", detail: "La etiqueta DEMO se generó con el perfil 40 × 30 mm de la estación." }),
  dispatch_prepared: Object.freeze({ action: "register_delivery", nextStage: "balance_due", time: "14:10", label: "Entrega registrada", detail: "El pedido ficticio fue entregado y quedó con saldo pendiente." }),
  balance_due: Object.freeze({ action: "settle_balance", nextStage: "receipt_ready", time: "14:18", label: "Saldo cobrado", detail: "Caja aplicó la transferencia LAB restante y preparó REC-DEMO-0201." }),
  receipt_ready: Object.freeze({ action: "review_receipt", nextStage: "completed", time: "14:20", label: "Comprobante revisado", detail: "La vista previa integrada quedó revisada sin imprimir ni guardar archivos." }),
});

export function createInitialLabState() {
  return {
    stage: "quote_draft",
    events: [
      {
        id: "lab-created",
        time: "09:00",
        label: "Escenario preparado",
        detail: "Cotización y datos sintéticos cargados únicamente en memoria.",
      },
    ],
  };
}

export function labCycleReducer(state, action) {
  if (action.type === "reset") return createInitialLabState();

  const transition = transitions[state.stage];
  if (!transition || transition.action !== action.type) return state;

  return {
    stage: transition.nextStage,
    events: [
      ...state.events,
      {
        id: `${transition.nextStage}-${state.events.length}`,
        time: transition.time,
        label: transition.label,
        detail: transition.detail,
      },
    ],
  };
}

export function getLabSnapshot(state) {
  const stageIndex = Math.max(0, LAB_STAGES.findIndex((stage) => stage.id === state.stage));
  const currentStage = LAB_STAGES[stageIndex];
  const inventoryCommitted = stageIndex >= 4;
  const depositRecorded = stageIndex >= 3;
  const finalPaymentRecorded = stageIndex >= 9;
  const paidAmount = finalPaymentRecorded ? LAB_SCENARIO.totalAmount : depositRecorded ? LAB_SCENARIO.depositAmount : 0;

  return {
    currentStage,
    nextStage: LAB_STAGES[Math.min(stageIndex + 1, LAB_STAGES.length - 1)],
    progressPercent: Math.round((stageIndex / (LAB_STAGES.length - 1)) * 100),
    paidAmount,
    balanceAmount: LAB_SCENARIO.totalAmount - paidAmount,
    customerCreditApplied: depositRecorded ? LAB_SCENARIO.customerCreditAmount : 0,
    receiptStatus: state.stage === "completed" ? "Revisado" : state.stage === "receipt_ready" ? "Pendiente de revisión" : "Sin generar",
    shippingLabelStatus: stageIndex >= 7 ? "Preparada" : "Pendiente",
    inventoryMovements: inventoryCommitted ? LAB_SCENARIO.materials.length : 0,
    materials: LAB_SCENARIO.materials.map((material) => ({
      ...material,
      available: inventoryCommitted ? material.initial - material.consumed : material.initial,
      committed: inventoryCommitted ? material.consumed : 0,
    })),
    orderStatus: state.stage === "completed" ? "Cerrado" : finalPaymentRecorded ? "Cobrado" : stageIndex >= 8 ? "Entregado" : stageIndex >= 4 ? "En producción" : stageIndex >= 2 ? "Confirmado" : "Cotización",
    productionStatus: stageIndex >= 5 ? "Finalizada" : stageIndex >= 4 ? "En proceso" : "Pendiente",
    qualityStatus: stageIndex >= 6 ? "Aprobada" : stageIndex >= 5 ? "Pendiente" : "Sin iniciar",
    deliveryStatus: stageIndex >= 8 ? "Entregada" : stageIndex >= 7 ? "Despacho preparado" : stageIndex >= 6 ? "Lista" : "Pendiente",
  };
}
