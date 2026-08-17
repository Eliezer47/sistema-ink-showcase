import type { Dispatch, ReactNode } from "react";
import {
  LAB_SCENARIO,
  LAB_STAGES,
  getLabSnapshot,
  type LabActionType,
  type LabCycleState,
  type LabModuleId,
} from "./labCycle.js";

type LabAction = { type: LabActionType };

type LabModuleSurfaceProps = {
  active: LabModuleId;
  state: LabCycleState;
  dispatch: Dispatch<LabAction>;
  onNavigate: (module: LabModuleId) => void;
};

const currency = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
  maximumFractionDigits: 0,
});

function LabButton({ children, onClick, secondary = false }: { children: ReactNode; onClick: () => void; secondary?: boolean }) {
  return <button className={secondary ? "lab-secondary-button" : "lab-primary-button"} type="button" onClick={onClick}>{children}</button>;
}

function LabCycleHeader({ active, state, onNavigate }: Pick<LabModuleSurfaceProps, "active" | "state" | "onNavigate">) {
  const snapshot = getLabSnapshot(state);
  const expectedModule = snapshot.currentStage.module;
  const completed = state.stage === "completed";

  return (
    <section className={`lab-cycle-header${completed ? " is-complete" : ""}`} aria-labelledby="lab-cycle-title">
      <div className="lab-cycle-copy">
        <span className="lab-mode-badge">MODO LAB OPERATIVO</span>
        <div>
          <strong id="lab-cycle-title">{completed ? "Ciclo completado" : `Paso actual · ${snapshot.currentStage.label}`}</strong>
          <p>{snapshot.currentStage.instruction}</p>
        </div>
      </div>
      <div className="lab-cycle-progress">
        <div><span>Avance del escenario</span><strong>{snapshot.progressPercent}%</strong></div>
        <div className="lab-progress-track" role="progressbar" aria-label="Avance del ciclo operativo LAB" aria-valuemin={0} aria-valuemax={100} aria-valuenow={snapshot.progressPercent}>
          <span style={{ width: `${snapshot.progressPercent}%` }} />
        </div>
      </div>
      {!completed && active !== expectedModule ? (
        <LabButton onClick={() => onNavigate(expectedModule)}>Ir a {snapshot.currentStage.label}</LabButton>
      ) : completed && active !== "panel" ? (
        <LabButton onClick={() => onNavigate("panel")}>Ver resumen</LabButton>
      ) : null}
    </section>
  );
}

function LabStepRail({ state }: { state: LabCycleState }) {
  const currentIndex = LAB_STAGES.findIndex((stage) => stage.id === state.stage);
  return (
    <ol className="lab-step-rail" aria-label="Etapas del ciclo LAB">
      {LAB_STAGES.map((stage, index) => (
        <li className={index < currentIndex ? "is-done" : index === currentIndex ? "is-current" : ""} key={stage.id}>
          <span>{index < currentIndex ? "✓" : index + 1}</span>
          <small>{stage.label}</small>
        </li>
      ))}
    </ol>
  );
}

function LabActivity({ state }: { state: LabCycleState }) {
  return (
    <section className="lab-activity-card" aria-labelledby="lab-activity-title">
      <header><h3 id="lab-activity-title">Bitácora del escenario</h3><span>{state.events.length} eventos</span></header>
      <div className="lab-activity-list">
        {[...state.events].reverse().map((event) => (
          <article key={event.id}><time>{event.time}</time><div><strong>{event.label}</strong><p>{event.detail}</p></div></article>
        ))}
      </div>
    </section>
  );
}

function CurrentAction({ active, state, dispatch }: Pick<LabModuleSurfaceProps, "active" | "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  if (state.stage === "completed") return <span className="lab-complete-stamp">Ciclo completado</span>;
  if (snapshot.currentStage.module !== active || !snapshot.currentStage.action) {
    return <span className="lab-waiting-stamp">Continúa en {snapshot.currentStage.label}</span>;
  }
  return <LabButton onClick={() => dispatch({ type: snapshot.currentStage.action! })}>{snapshot.currentStage.actionLabel}</LabButton>;
}

function LabPanel({ state, onNavigate }: Pick<LabModuleSurfaceProps, "state" | "onNavigate">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module lab-panel-module">
      <header className="lab-module-heading"><div><span>PANEL DE OPERACIÓN FICTICIA</span><h2>{LAB_SCENARIO.orderReference}</h2><p>{LAB_SCENARIO.customer.name} · {snapshot.orderStatus}</p></div>{state.stage === "completed" ? <span className="lab-complete-stamp">Operación cerrada</span> : <LabButton onClick={() => onNavigate(snapshot.currentStage.module)}>Continuar ciclo</LabButton>}</header>
      <div className="lab-summary-grid">
        <article><span>ESTADO DEL PEDIDO</span><strong>{snapshot.orderStatus}</strong><small>{snapshot.currentStage.label}</small></article>
        <article><span>TOTAL FICTICIO</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong><small>{LAB_SCENARIO.items.length} conceptos</small></article>
        <article className="positive"><span>COBRADO</span><strong>{currency.format(snapshot.paidAmount)}</strong><small>Sin transacción real</small></article>
        <article className={snapshot.balanceAmount ? "warning" : "positive"}><span>SALDO</span><strong>{currency.format(snapshot.balanceAmount)}</strong><small>{snapshot.balanceAmount ? "Pendiente en LAB" : "Liquidado"}</small></article>
        <article><span>INVENTARIO</span><strong>{snapshot.inventoryMovements}</strong><small>Movimientos simulados</small></article>
      </div>
      <LabStepRail state={state} />
      <div className="lab-panel-grid">
        <section className="lab-order-card">
          <header><div><small>ORDEN DE TRABAJO LAB</small><h3>24 camisetas promocionales</h3></div><span>{snapshot.productionStatus}</span></header>
          <dl><div><dt>Cliente</dt><dd>{LAB_SCENARIO.customer.name}</dd></div><div><dt>Entrega prometida</dt><dd>{LAB_SCENARIO.deliveryDate}</dd></div><div><dt>Calidad</dt><dd>{snapshot.qualityStatus}</dd></div><div><dt>Etiqueta</dt><dd>{snapshot.shippingLabelStatus}</dd></div><div><dt>Entrega</dt><dd>{snapshot.deliveryStatus}</dd></div><div><dt>Comprobante</dt><dd>{snapshot.receiptStatus}</dd></div></dl>
          <p>Todos los importes, personas, documentos y movimientos pertenecen exclusivamente al escenario LAB.</p>
        </section>
        <LabActivity state={state} />
      </div>
    </div>
  );
}

function LabQuote({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>COTIZACIÓN DE PRUEBA</span><h2>{LAB_SCENARIO.quoteReference}</h2><p>Propuesta comercial generada con datos ficticios.</p></div><CurrentAction active="cotizaciones" state={state} dispatch={dispatch} /></header>
      <div className="lab-document-layout">
        <section className="lab-document-card">
          <div className="lab-document-meta"><div><span>Cliente</span><strong>{LAB_SCENARIO.customer.name}</strong><small>{LAB_SCENARIO.customer.code}</small></div><div><span>Contacto</span><strong>{LAB_SCENARIO.customer.contact}</strong><small>{LAB_SCENARIO.customer.email}</small></div><div><span>Entrega propuesta</span><strong>{LAB_SCENARIO.deliveryDate}</strong><small>Fecha ficticia</small></div></div>
          <div className="lab-line-table"><div className="head"><span>Concepto</span><span>Cant.</span><span>Precio</span><span>Total</span></div>{LAB_SCENARIO.items.map((item) => <div key={item.code}><span><strong>{item.description}</strong><small>{item.code}</small></span><span>{item.quantity}</span><span>{currency.format(item.unitPrice)}</span><strong>{currency.format(item.quantity * item.unitPrice)}</strong></div>)}</div>
          <div className="lab-document-total"><span>Total cotizado</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong></div>
        </section>
        <aside className="lab-side-card"><span>CONDICIONES LAB</span><h3>Alcance del escenario</h3><ul><li>Anticipo simulado de {currency.format(LAB_SCENARIO.depositAmount)}</li><li>Producción de 24 unidades</li><li>Revisión de calidad y entrega</li><li>Cobro final sin pasarela ni comprobante fiscal</li></ul></aside>
      </div>
    </div>
  );
}

function LabSales({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>VENTAS Y PEDIDOS</span><h2>Conversión comercial</h2><p>La cotización aprobada alimenta el pedido sin recapturar datos.</p></div><CurrentAction active="ventas" state={state} dispatch={dispatch} /></header>
      <section className="lab-customer-context" aria-label="Situación comercial del cliente">
        <div><small>SITUACIÓN COMERCIAL DEL CLIENTE</small><strong>Sin deuda vencida</strong><span>1 pedido ficticio abierto</span></div>
        <div><small>SALDO A FAVOR</small><strong>{currency.format(LAB_SCENARIO.customerCreditAmount)}</strong><span>Disponible para el anticipo LAB</span></div>
        <div className="lab-order-actions"><button type="button" disabled>Cambiar fecha</button><button type="button" disabled>Agregar conceptos</button><button type="button" disabled>Cancelar conceptos</button></div>
      </section>
      <div className="lab-record-layout"><section className="lab-record-list"><header><span>Documento</span><span>Cliente</span><span>Entrega</span><span>Estado</span><span>Total</span></header><div className="is-selected"><strong>{state.stage === "quote_draft" ? LAB_SCENARIO.quoteReference : LAB_SCENARIO.orderReference}</strong><span>{LAB_SCENARIO.customer.name}</span><span>{LAB_SCENARIO.deliveryDate}</span><span>{snapshot.orderStatus}</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong></div></section><aside className="lab-side-card"><span>REGISTRO SELECCIONADO</span><h3>{LAB_SCENARIO.customer.name}</h3><dl><div><dt>Origen</dt><dd>{LAB_SCENARIO.quoteReference}</dd></div><div><dt>Lista</dt><dd>LAB · precio ficticio</dd></div><div><dt>Anticipo requerido</dt><dd>{currency.format(LAB_SCENARIO.depositAmount)}</dd></div><div><dt>Saldo a favor aplicado</dt><dd>{currency.format(snapshot.customerCreditApplied)}</dd></div><div><dt>Estado</dt><dd>{snapshot.orderStatus}</dd></div></dl></aside></div>
    </div>
  );
}

function LabCash({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  const receiptGenerated = snapshot.receiptStatus !== "Sin generar";
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>CAJA LAB</span><h2>Cobros del pedido</h2><p>Los movimientos actualizan únicamente el estado temporal del escenario.</p></div><CurrentAction active="caja" state={state} dispatch={dispatch} /></header>
      <section className="lab-cash-context"><div><small>CAJA FÍSICA · ACTIVA</small><strong>Caja Taller DEMO</strong><span>Abierta por Marina Soto · LAB</span></div><div><small>CUENTA RECEPTORA</small><strong>Banco Operativo DEMO</strong><span>Transferencias ficticias</span></div><button type="button" disabled>Historial y conciliación</button></section>
      <div className="lab-cash-grid"><article><span>TOTAL</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong></article><article className="positive"><span>APLICADO</span><strong>{currency.format(snapshot.paidAmount)}</strong></article><article className={snapshot.balanceAmount ? "warning" : "positive"}><span>SALDO</span><strong>{currency.format(snapshot.balanceAmount)}</strong></article><article><span>COMPOSICIÓN SIMULADA</span><strong>{snapshot.balanceAmount === 0 ? "Transferencia LAB" : snapshot.paidAmount ? "Efectivo + saldo a favor" : "Sin movimientos"}</strong></article></div>
      <div className="lab-record-layout"><section className="lab-payment-card"><header><div><small>PEDIDO</small><strong>{LAB_SCENARIO.orderReference}</strong></div><span>{snapshot.balanceAmount ? "Saldo abierto" : "Liquidado"}</span></header><div className="lab-payment-breakdown"><div><span>Total</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong></div><div><span>Efectivo del anticipo</span><strong>{currency.format(Math.max(0, snapshot.paidAmount ? LAB_SCENARIO.depositAmount - LAB_SCENARIO.customerCreditAmount : 0))}</strong></div><div><span>Saldo a favor aplicado</span><strong>{currency.format(snapshot.customerCreditApplied)}</strong></div><div><span>Pagos aplicados</span><strong>{currency.format(snapshot.paidAmount)}</strong></div><div><span>Saldo actual</span><strong>{currency.format(snapshot.balanceAmount)}</strong></div></div><p>No se genera transacción bancaria ni movimiento fuera de esta página.</p></section><LabActivity state={state} /></div>
      <section className={`lab-receipt-preview${receiptGenerated ? " is-ready" : ""}`} aria-label="Vista previa integrada del comprobante">
        <div><small>VISTA PREVIA INTEGRADA</small><h3>REC-DEMO-0201</h3><p>{receiptGenerated ? `${LAB_SCENARIO.customer.name} · ${currency.format(snapshot.paidAmount)}` : "Se habilita después del cobro final ficticio."}</p></div>
        <div><span>Impresión preseleccionada</span><strong>Térmica Caja DEMO · 80 mm</strong><small>{snapshot.receiptStatus} · No válido como comprobante fiscal</small></div>
        <button type="button" disabled>Imprimir</button>
      </section>
    </div>
  );
}

function LabProduction({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>ORDEN DE PRODUCCIÓN</span><h2>Estampado · 24 unidades</h2><p>{LAB_SCENARIO.orderReference} · {LAB_SCENARIO.customer.name}</p></div><CurrentAction active="produccion" state={state} dispatch={dispatch} /></header>
      <div className="lab-production-layout"><section className="lab-production-card"><div className="lab-production-state"><div><span>ESTADO</span><strong>{snapshot.productionStatus}</strong></div><div><span>ENTREGA</span><strong>{LAB_SCENARIO.deliveryDate}</strong></div><div><span>CALIDAD</span><strong>{snapshot.qualityStatus}</strong></div></div><div className="lab-checklist"><h3>Secuencia de trabajo</h3><p className={snapshot.inventoryMovements ? "is-done" : "is-current"}><span>{snapshot.inventoryMovements ? "✓" : "1"}</span> Reservar materiales ficticios</p><p className={state.stage === "production_active" ? "is-current" : snapshot.productionStatus === "Finalizada" ? "is-done" : ""}><span>{snapshot.productionStatus === "Finalizada" ? "✓" : "2"}</span> Preparar y estampar 24 camisetas</p><p className={state.stage === "quality_pending" ? "is-current" : ""}><span>3</span> Enviar a control de calidad</p></div></section><section className="lab-material-card"><header><h3>Materiales de receta LAB</h3><span>{snapshot.inventoryMovements ? "Reservados" : "Disponibles"}</span></header>{snapshot.materials.map((material) => <div key={material.code}><span><strong>{material.name}</strong><small>{material.code}</small></span><span>Requiere {material.consumed} {material.unit}</span><strong>{material.available} {material.unit}</strong></div>)}</section></div>
    </div>
  );
}

function LabQuality({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>CONTROL DE CALIDAD</span><h2>Inspección final</h2><p>Lista de verificación visual para {LAB_SCENARIO.orderReference}.</p></div><CurrentAction active="calidad" state={state} dispatch={dispatch} /></header>
      <div className="lab-quality-layout"><section className="lab-quality-card"><header><div><small>LOTE FICTICIO</small><h3>24 camisetas promocionales</h3></div><span>{snapshot.qualityStatus}</span></header>{["Cantidad completa · 24 de 24", "Estampado centrado y legible", "Colores acordes a la muestra LAB", "Empaque preparado para entrega"].map((item) => <label key={item}><input type="checkbox" checked={state.stage === "quality_pending" || snapshot.qualityStatus === "Aprobada"} readOnly /><span>{item}</span></label>)}</section><aside className="lab-side-card"><span>RESULTADO</span><h3>{snapshot.qualityStatus}</h3><p>No se adjuntan fotografías ni archivos de clientes. La aprobación solo cambia el estado ficticio del pedido.</p><dl><div><dt>Revisado por</dt><dd>Marina Soto · LAB</dd></div><div><dt>Incidencias</dt><dd>0 ficticias</dd></div></dl></aside></div>
    </div>
  );
}

function LabDelivery({ state, dispatch }: Pick<LabModuleSurfaceProps, "state" | "dispatch">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>CONTROL DE ENTREGAS</span><h2>{LAB_SCENARIO.orderReference}</h2><p>Seguimiento de cantidades y saldo del escenario.</p></div><CurrentAction active="entregas" state={state} dispatch={dispatch} /></header>
      <div className="lab-delivery-layout"><section className="lab-delivery-card"><div><span>CANTIDAD PEDIDA</span><strong>24</strong><small>unidades ficticias</small></div><div><span>LISTA PARA ENTREGAR</span><strong>{snapshot.qualityStatus === "Aprobada" ? "24" : "0"}</strong><small>control de calidad</small></div><div><span>ENTREGADA</span><strong>{snapshot.deliveryStatus === "Entregada" ? "24" : "0"}</strong><small>registro LAB</small></div><div><span>SALDO</span><strong>{currency.format(snapshot.balanceAmount)}</strong><small>sin cobro real</small></div></section><section className="lab-handoff-card"><header><h3>Comprobante visual de entrega</h3><span>{snapshot.deliveryStatus}</span></header><dl><div><dt>Cliente</dt><dd>{LAB_SCENARIO.customer.name}</dd></div><div><dt>Contacto</dt><dd>{LAB_SCENARIO.customer.contact}</dd></div><div><dt>Fecha prevista</dt><dd>{LAB_SCENARIO.deliveryDate}</dd></div><div><dt>Referencia</dt><dd>ENT-DEMO-0201</dd></div></dl><p>No válido como comprobante fiscal ni constancia comercial.</p></section></div>
      <section className={`lab-label-preview${snapshot.shippingLabelStatus === "Preparada" ? " is-ready" : ""}`}>
        <div><small>PERFIL DE ESTA ESTACIÓN</small><strong>Etiqueta compacta 40 × 30 mm</strong><span>Datos esenciales · horizontal</span></div>
        <div><small>EDITOR SIMPLE DE ETIQUETA</small><strong>Cliente · teléfono · ubicación · pedido</strong><span>Tamaños visuales ficticios</span></div>
        <div className="lab-label-paper"><b>{LAB_SCENARIO.customer.name}</b><span>Managua DEMO</span><strong>{LAB_SCENARIO.orderReference}</strong></div>
      </section>
    </div>
  );
}

function LabInventory({ state }: Pick<LabModuleSurfaceProps, "state">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>INVENTARIO SIMULADO</span><h2>Movimientos del escenario</h2><p>Las existencias se recalculan en memoria al iniciar producción.</p></div><span className="lab-waiting-stamp">{snapshot.inventoryMovements} movimientos</span></header>
      <section className="lab-inventory-table"><header><span>Código</span><span>Insumo</span><span>Inicial</span><span>Comprometido</span><span>Disponible</span><span>Estado</span></header>{snapshot.materials.map((material) => <div key={material.code}><strong>{material.code}</strong><span>{material.name}</span><span>{material.initial} {material.unit}</span><span>{material.committed} {material.unit}</span><strong>{material.available} {material.unit}</strong><span>{material.committed ? "Aplicado al LAB" : "Sin movimiento"}</span></div>)}</section>
      <p className="lab-boundary-note">Reiniciar el laboratorio restaura inmediatamente estas existencias ficticias.</p>
    </div>
  );
}

function LabFinance({ state }: Pick<LabModuleSurfaceProps, "state">) {
  const snapshot = getLabSnapshot(state);
  return (
    <div className="lab-module">
      <header className="lab-module-heading"><div><span>FINANZAS DEL ESCENARIO</span><h2>Cuenta por cobrar ficticia</h2><p>Resumen derivado de Caja y Entregas, sin fórmula ni libro real.</p></div><span className={snapshot.balanceAmount ? "lab-waiting-stamp" : "lab-complete-stamp"}>{snapshot.balanceAmount ? "Documento abierto" : "Documento cerrado"}</span></header>
      <div className="lab-finance-tabs"><button type="button" disabled>Resultado operativo</button><button type="button" disabled>Conciliación bancaria</button><button type="button" disabled>Cuentas por pagar</button></div>
      <div className="lab-finance-grid"><article><span>VALOR DEL PEDIDO</span><strong>{currency.format(LAB_SCENARIO.totalAmount)}</strong><small>{LAB_SCENARIO.orderReference}</small></article><article className="positive"><span>RECUPERADO</span><strong>{currency.format(snapshot.paidAmount)}</strong><small>Movimientos LAB</small></article><article className={snapshot.balanceAmount ? "warning" : "positive"}><span>POR COBRAR</span><strong>{currency.format(snapshot.balanceAmount)}</strong><small>{snapshot.balanceAmount ? "Saldo ficticio" : "Ciclo liquidado"}</small></article><article><span>RESULTADO OPERATIVO</span><strong>{snapshot.paidAmount ? "En seguimiento" : "Sin movimiento"}</strong><small>Vista ilustrativa</small></article></div>
      <div className="lab-record-layout"><section className="lab-record-list"><header><span>Documento</span><span>Cliente</span><span>Origen</span><span>Estado</span><span>Saldo</span></header><div className="is-selected"><strong>{LAB_SCENARIO.orderReference}</strong><span>{LAB_SCENARIO.customer.name}</span><span>Modo LAB</span><span>{snapshot.balanceAmount ? "Pendiente" : "Pagado"}</span><strong>{currency.format(snapshot.balanceAmount)}</strong></div></section><aside className="lab-side-card"><span>FUENTES SIMULADAS</span><h3>Efectivo, banco y Cuenta / reserva</h3><p>La composición ficticia distingue cada origen sin crear movimientos financieros ni revelar reglas internas.</p><dl><div><dt>Saldo a favor</dt><dd>{currency.format(snapshot.customerCreditApplied)}</dd></div><div><dt>Banco</dt><dd>{snapshot.balanceAmount === 0 ? "Transferencia LAB aplicada" : "Sin aplicar"}</dd></div></dl></aside></div>
    </div>
  );
}

export default function LabModuleSurface({ active, state, dispatch, onNavigate }: LabModuleSurfaceProps) {
  let content: ReactNode;
  if (active === "panel") content = <LabPanel state={state} onNavigate={onNavigate} />;
  else if (active === "cotizaciones") content = <LabQuote state={state} dispatch={dispatch} />;
  else if (active === "ventas") content = <LabSales state={state} dispatch={dispatch} />;
  else if (active === "caja") content = <LabCash state={state} dispatch={dispatch} />;
  else if (active === "produccion") content = <LabProduction state={state} dispatch={dispatch} />;
  else if (active === "calidad") content = <LabQuality state={state} dispatch={dispatch} />;
  else if (active === "entregas") content = <LabDelivery state={state} dispatch={dispatch} />;
  else if (active === "inventario") content = <LabInventory state={state} />;
  else if (active === "finanzas") content = <LabFinance state={state} />;
  else content = <LabPanel state={state} onNavigate={onNavigate} />;

  return (
    <div className="lab-surface">
      <LabCycleHeader active={active} state={state} onNavigate={onNavigate} />
      {content}
      <p className="sr-only" role="status" aria-live="polite">Etapa LAB actual: {getLabSnapshot(state).currentStage.label}.</p>
    </div>
  );
}
