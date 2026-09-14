import { useState } from "react";
import { useDemoSession } from "./DemoSession";
import { DEMO_ORDER, scenarioSummary, type DemoReceipt } from "./demoScenario";
import { DemoPage, Facts, Metrics, PreviewButton, demoMoney } from "./DemoPrimitives";
import DemoDialog, { DocumentExample } from "./DemoDialog";
import type { GuideModuleId } from "./InteractiveGuide";

export const scenarioModules = new Set<GuideModuleId>(["panel", "cotizaciones", "ventas", "caja", "produccion", "entregas", "inventario", "finanzas"]);

export default function ScenarioModule({ active, onNavigate }: { active: GuideModuleId; onNavigate: (id: GuideModuleId) => void }) {
  const { state, dispatch } = useDemoSession();
  const summary = scenarioSummary(state);
  const [confirmDelivery, setConfirmDelivery] = useState(false);
  const [productionConfirmed, setProductionConfirmed] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<"label" | "quote" | null>(null);
  const [receipt, setReceipt] = useState<DemoReceipt | null>(null);
  const [rejectPaymentId, setRejectPaymentId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const payable = Math.round((summary.balance - state.pendingTransfer) * 100) / 100;
  const enteredAmount = Number(amount ?? payable);
  const appliedAmount = method === "cash" ? Math.min(enteredAmount, payable) : enteredAmount;
  const change = method === "cash" && Number.isFinite(enteredAmount) ? Math.max(0, Math.round((enteredAmount - payable) * 100) / 100) : 0;
  const productionLabel = state.production === "pending" ? "Por hacer" : state.production === "active" ? "En proceso" : "Finalizada";
  const productionReady = state.production === "finished";
  const go = (id: GuideModuleId, label: string) => <button type="button" className="real-primary-button" onClick={() => onNavigate(id)}>{label}</button>;
  const deliver = <button type="button" className="real-primary-button" onClick={() => {
    if (state.mode === "simple") { setProductionConfirmed(false); setConfirmDelivery(true); }
    else onNavigate("entregas");
  }}>{state.mode === "simple" ? "Entregar ahora" : "Registrar entrega"}</button>;
  const productionConfirmation = !productionReady && <label className="scenario-production-confirmation">
    <input type="checkbox" checked={productionConfirmed} onChange={(event) => setProductionConfirmed(event.target.checked)} />
    Confirmo que las 12 unidades están físicamente terminadas. Esta entrega cerrará la producción de toda la línea, incluso si entrego solo una parte.
  </label>;
  const titles: Partial<Record<GuideModuleId, string>> = { panel: "Un pedido, de principio a fin", cotizaciones: "Cotizaciones", ventas: state.mode === "simple" ? "Ventas rápidas" : "Ventas y pedidos", caja: state.mode === "simple" ? "Cobro rápido" : "Caja", produccion: "Producción", entregas: "Entregas", inventario: "Inventario", finanzas: "Cuentas por cobrar" };

  return <DemoPage title={titles[active] ?? "Pedido de ejemplo"} description={`${DEMO_ORDER.reference} · ${DEMO_ORDER.customer} · ${DEMO_ORDER.quantity} camisetas`}>
    <div className="scenario-context"><span>EJEMPLO INTERACTIVO</span><p>Pedido ficticio con pasos abreviados. Los formularios completos y sus opciones se revisan en el sistema instalado.</p></div>
    <Metrics items={[["Total", demoMoney(DEMO_ORDER.total)], ["Pagado", demoMoney(state.paid)], ["Saldo", demoMoney(summary.balance)], ["Entrega física", `${state.delivered} / ${DEMO_ORDER.quantity}`]]} />
    <div className="faithful-split scenario-layout"><section className="internal-card scenario-task" data-guide-target="record-list">
      {active === "panel" && <>
        <h3>{summary.complete ? "Pedido cobrado y entregado" : "Conserva el contexto en cada paso"}</h3>
        <p>Aprueba la cotización, crea la venta desde esa cotización, registra un abono o una transferencia, prepara el trabajo y confirma la entrega.</p>
        <div className="scenario-route">{["Cotización", "Venta", "Cobro", "Producción", "Entrega"].map((name, index) => <span key={name}><b>{index + 1}</b>{name}</span>)}</div>
        {go(state.quote === "draft" ? "cotizaciones" : "ventas", summary.complete ? "Revisar pedido" : "Continuar ejemplo")}
        <p>Este es un recorrido posible: el sistema también admite ventas directas, crédito, entregas parciales e incidencias.</p>
      </>}
      {active === "cotizaciones" && <>
        <h3>{DEMO_ORDER.quote}</h3>
        <Facts items={[["Cliente", DEMO_ORDER.customer], ["Concepto", DEMO_ORDER.product], ["Cantidad", DEMO_ORDER.quantity], ["Precio unitario", demoMoney(DEMO_ORDER.unitPrice)], ["Estado", state.quote === "draft" ? "Borrador" : "Aprobada"], ["Pedido asociado", summary.ordered ? DEMO_ORDER.reference : "Sin pedido todavía"]]} />
        <div className="faithful-actions">
          <button type="button" className="real-primary-button" disabled={state.quote !== "draft"} onClick={() => dispatch({ type: "approve" })}>Aprobar</button>
          <PreviewButton onClick={() => setPreview("quote")}>Vista previa</PreviewButton>
          {state.quote !== "draft" && go("ventas", summary.ordered ? "Ver pedido en Ventas" : "Continuar en Ventas")}
        </div>
        <p>La aprobación conserva la propuesta. Para crear el pedido, continúa en Ventas → Nueva venta → Desde cotización.</p>
      </>}
      {active === "ventas" && <>
        <h3>{summary.ordered ? DEMO_ORDER.reference : "Nueva venta · Desde cotización"}</h3>
        {summary.ordered ? <>
          <Facts items={[["Cliente", DEMO_ORDER.customer], ["Pago", summary.paymentLabel], ["Producción", productionLabel], ["Entrega", summary.deliveryLabel]]} />
          <div className="faithful-actions">
            {state.pendingTransfer > 0 ? go("caja", "Verificar transferencia") : summary.balance > 0 && go("caja", state.mode === "simple" ? "Cobrar y preparar entrega" : "Cobrar pedido")}
            {!productionReady && state.mode === "areas" && go("produccion", "Revisar producción")}
            {summary.pendingDelivery > 0 && deliver}
            <PreviewButton onClick={() => setPreview("label")}>Vista previa de etiqueta</PreviewButton>
          </div>
          <p>Pagado no significa entregado. También puedes confirmar una entrega manteniendo el saldo pendiente de cobro.</p>
        </> : state.quote === "approved" ? <>
          <Facts items={[["Origen", "Desde cotización"], ["Cotización aprobada", DEMO_ORDER.quote], ["Cliente", DEMO_ORDER.customer], ["Concepto", DEMO_ORDER.product], ["Cantidad", DEMO_ORDER.quantity], ["Precio unitario", demoMoney(DEMO_ORDER.unitPrice)], ["Total", demoMoney(DEMO_ORDER.total)], ["Entrega prometida", "15/09/2026"]]} />
          <p>Revisa los valores aceptados antes de confirmar. Este recorrido usa los datos preparados de la cotización.</p>
          <button type="button" className="real-primary-button" onClick={() => dispatch({ type: "convert" })}>Confirmar venta</button>
        </> : <><p>Primero aprueba la cotización de este recorrido. El producto también permite iniciar una venta directa.</p>{go("cotizaciones", "Revisar cotización")}</>}
      </>}
      {active === "caja" && <>
        <h3>Mostrador DEMO · Caja abierta</h3>
        {summary.ordered ? <>
          <div className="faithful-actions" role="group" aria-label="Forma de pago del ejemplo">{(["cash", "transfer"] as const).map((value) => <button key={value} type="button" aria-pressed={method === value} onClick={() => { setMethod(value); setAmount(null); setError(""); }}>{value === "cash" ? "Efectivo" : "Transferencia"}</button>)}</div>
          <form className="faithful-form" onSubmit={(event) => {
            event.preventDefault();
            if (!Number.isFinite(enteredAmount) || enteredAmount <= 0 || payable <= 0 || (method === "transfer" && enteredAmount > payable)) {
              setError("Indica un importe positivo. En este ejemplo la transferencia no puede superar el saldo disponible."); return;
            }
            dispatch({ type: "pay", amount: appliedAmount, method, received: enteredAmount });
            setAmount(null); setError("");
          }}>
            <label>Monto recibido (NIO)<input aria-label="Monto recibido del cobro de ejemplo" type="number" required min="0.01" max={method === "transfer" ? payable || 0.01 : undefined} step="0.01" value={amount ?? (payable > 0 ? payable : "")} onChange={(event) => setAmount(event.target.value)} disabled={payable <= 0} /></label>
            <Facts items={[["Disponible para aplicar", demoMoney(payable)], ["Vuelto en efectivo", demoMoney(change)]]} />
            <p>{method === "transfer" && state.transferPolicy === "verify" ? "Aplicación después de verificar: el saldo no cambia mientras la transferencia esté pendiente." : "El importe se aplica al confirmar este cobro ficticio."}</p>
            <button className="real-primary-button" type="submit" disabled={payable <= 0}>{method === "transfer" && state.transferPolicy === "verify" ? "Registrar para verificar" : appliedAmount >= payable ? "Cobrar saldo completo" : "Registrar abono"}</button>
            {error && <p role="alert">{error}</p>}
          </form>
          {state.payments.length > 0 && <section className="scenario-payments" aria-label="Movimientos del pedido">
            <h3>Historial de pagos</h3>
            {[...state.payments].sort((a, b) => Number(b.status === "pending") - Number(a.status === "pending")).map((payment) => <article key={payment.id} className="scenario-payment">
              <strong>{payment.receipt?.reference ?? `Movimiento DEMO-${payment.id}`} · {demoMoney(payment.amount)}</strong>
              <p>{payment.method === "cash" ? "Efectivo" : "Transferencia"} · {payment.status === "pending" ? "Sin verificar" : payment.status === "rejected" ? "Rechazada" : "Aplicado"}</p>
              {payment.status === "pending" && <div className="faithful-actions">
                <button type="button" className="real-primary-button" aria-label={`Verificar transferencia ${payment.id}`} onClick={() => dispatch({ type: "verify", paymentId: payment.id })}>Verificar</button>
                <PreviewButton onClick={() => { setRejectPaymentId(payment.id); setRejectionReason(""); }}>Rechazar transferencia {payment.id}</PreviewButton>
              </div>}
              {payment.status === "applied" && <PreviewButton onClick={() => setReceipt(payment.receipt)}>Ver recibo {payment.receipt.reference}</PreviewButton>}
              {payment.status === "rejected" && <p>Motivo: {payment.reason}</p>}
            </article>)}
            <p>Cada recibo conserva los importes de su cobro. La transferencia pendiente no permite emitirlo.</p>
          </section>}
          {summary.pendingDelivery > 0 && <div className="scenario-pending"><strong>{summary.paymentLabel} · {summary.deliveryLabel}</strong>{deliver}</div>}
          <p>El sistema admite además cobros combinados, otras monedas y saldo a favor. Este ejemplo practica efectivo y transferencia en NIO.</p>
        </> : go("cotizaciones", "Crear el pedido primero")}
      </>}
      {active === "produccion" && <>
        <h3>Estampado frontal</h3><Facts items={[["Pedido", DEMO_ORDER.reference], ["Cantidad", "12 unidades"], ["Estado", productionLabel], ["Técnica", "Estampado textil"], ["Control", "Pedido · Acción · Materiales · Tiempo"]]} />
        <div className="faithful-actions">
          <button type="button" className="real-primary-button" disabled={!summary.ordered || state.production !== "pending"} onClick={() => dispatch({ type: "start" })}>Iniciar</button>
          <button type="button" className="real-primary-button" disabled={state.production !== "active"} onClick={() => dispatch({ type: "finish" })}>Finalizar</button>
          {summary.ordered && go("entregas", "Revisar cantidades por entregar")}
        </div>
        <p>{state.mode === "simple" && state.autoPrepare ? "En Simple, cancelar el saldo también puede dejar la producción lista cuando la empresa activa esa política." : "Por áreas conserva las acciones de producción separadas del cobro."}</p>
        <p>El ejemplo omite cronometraje y consumo de materiales. La primera entrega también puede cerrar toda la línea, previa confirmación de que está terminada. Calidad se utiliza si existe una incidencia; no exige una aprobación universal.</p>
      </>}
      {active === "entregas" && <>
        <h3>Cantidades del pedido</h3><Facts items={[["Solicitado", DEMO_ORDER.quantity], ["Entregado", state.delivered], ["Pendiente", summary.pendingDelivery], ["Producción", productionLabel], ["Recibe", "Contacto Demo"], ["Fecha del ejemplo", DEMO_ORDER.date]]} />
        <form className="faithful-form" onSubmit={(event) => {
          event.preventDefault();
          const value = state.mode === "simple" ? summary.pendingDelivery : Number(quantity ?? summary.pendingDelivery);
          if (!Number.isInteger(value) || value <= 0 || value > summary.pendingDelivery) { setError("Indica una cantidad entera que no supere lo pendiente."); return; }
          if (!productionReady && !productionConfirmed) { setError("Confirma que toda la línea está físicamente terminada."); return; }
          dispatch({ type: "deliver", quantity: value, productionConfirmed });
          setQuantity(null); setProductionConfirmed(false); setError("");
        }}>
          {state.mode === "areas" && <label>Unidades a entregar<input type="number" required min="1" step="1" max={summary.pendingDelivery || 1} value={quantity ?? (summary.pendingDelivery || "")} onChange={(event) => setQuantity(event.target.value)} disabled={!summary.pendingDelivery} /></label>}
          <p>{state.mode === "simple" ? "Simple propone entregar todo lo pendiente en una sola confirmación." : "Por áreas permite indicar una entrega parcial y conservar el resto pendiente."}</p>
          {summary.ordered && summary.pendingDelivery > 0 && productionConfirmation}
          <button className="real-primary-button" type="submit" disabled={!summary.ordered || (!productionReady && !productionConfirmed) || summary.pendingDelivery === 0}>{state.mode === "simple" ? "Confirmar entrega de ejemplo" : "Registrar entrega de ejemplo"}</button>
          {error && <p role="alert">{error}</p>}
        </form>{go("inventario", "Ver efecto en inventario")}
      </>}
      {active === "inventario" && <>
        <h3>Camiseta blanca · Almacén principal</h3><Metrics items={[["Físico", summary.physical], ["Reservado", summary.reserved], ["Disponible", summary.available]]} />
        <Facts items={[["Existencia inicial del ejemplo", "36 unidades"], ["Cantidad del pedido", summary.ordered ? "12 unidades" : "Sin pedido todavía"], ["Salidas por entrega", `${state.delivered} unidades`]]} />
        <p>Se muestra la salida del artículo entregado y la reserva pendiente. Los consumos de materiales de producción se registran por separado en el producto; este recorrido no los calcula.</p>{go("ventas", "Volver al pedido")}
      </>}
      {active === "finanzas" && (summary.ordered ? <>
        <h3>Saldo de {DEMO_ORDER.customer}</h3><Facts items={[["Referencia", DEMO_ORDER.reference], ["Importe", demoMoney(DEMO_ORDER.total)], ["Aplicado", demoMoney(state.paid)], ["Por verificar", demoMoney(state.pendingTransfer)], ["Saldo pendiente", demoMoney(summary.balance)]]} />
        <p>La transferencia pendiente no reduce el saldo hasta que se aplica. Los mismos importes aparecen en Ventas y Caja.</p>{go("caja", "Revisar cobro")}
      </> : <><h3>Sin cuenta por cobrar</h3><p>La cotización todavía no crea una deuda del cliente. Primero confirma la venta desde esa cotización.</p>{go("cotizaciones", "Revisar cotización")}</>)}
    </section><aside className="detail-pane faithful-detail" data-guide-target="record-detail">
      <small>TRAZABILIDAD DEL EJEMPLO</small><h3>{DEMO_ORDER.customer}</h3><Facts items={[["Cotización", DEMO_ORDER.quote], ["Pedido", summary.ordered ? DEMO_ORDER.reference : "Pendiente de confirmar"], ["Producción", productionLabel], ["Pago", summary.paymentLabel], ["Entrega", summary.deliveryLabel]]} />
      <ol className="scenario-history">{state.events.map((event, index) => <li key={`${index}-${event}`}>{event}</li>)}</ol><p className="scenario-status" role="status">{state.events[state.events.length - 1]}</p>
      {summary.complete && <strong className="scenario-complete">Ciclo completado: cobrado y entregado.</strong>}
    </aside></div>
    {confirmDelivery && <DemoDialog title="Confirmar entrega de ejemplo" onClose={() => setConfirmDelivery(false)}>
      <h3>{DEMO_ORDER.reference} · {DEMO_ORDER.customer}</h3><p>Se entregarán las {summary.pendingDelivery} unidades pendientes. El saldo financiero se conserva.</p>
      <Facts items={[["Recibe", "Contacto Demo"], ["Fecha del ejemplo", DEMO_ORDER.date]]} />{productionConfirmation}
      <div className="faithful-actions"><button type="button" className="real-primary-button" disabled={!productionReady && !productionConfirmed} onClick={() => {
        dispatch({ type: "deliver", quantity: summary.pendingDelivery, productionConfirmed }); setConfirmDelivery(false);
      }}>Confirmar entrega de ejemplo</button><PreviewButton onClick={() => setConfirmDelivery(false)}>Volver sin entregar</PreviewButton></div>
    </DemoDialog>}
    {rejectPaymentId !== null && <DemoDialog title={`Rechazar transferencia ${rejectPaymentId}`} onClose={() => setRejectPaymentId(null)}>
      <form className="faithful-form" onSubmit={(event) => {
        event.preventDefault(); if (!rejectionReason.trim()) return;
        dispatch({ type: "reject", paymentId: rejectPaymentId, reason: rejectionReason }); setRejectPaymentId(null);
      }}><label>Motivo del rechazo<input required value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} /></label>
        <p>El importe seguirá pendiente de cobro. El movimiento rechazado se conserva en el historial del ejemplo.</p>
        <button type="submit" className="real-primary-button" disabled={!rejectionReason.trim()}>Confirmar rechazo</button>
      </form>
    </DemoDialog>}
    {preview && <DemoDialog title={preview === "quote" ? "Vista previa de cotización" : "Vista previa de etiqueta"} onClose={() => setPreview(null)}><DocumentExample kind={preview} /></DemoDialog>}
    {receipt && <DemoDialog title={`Recibo de ejemplo · ${receipt.reference}`} onClose={() => setReceipt(null)}><DocumentExample receipt={receipt} /><p>Importes conservados al aplicar este cobro ficticio. Los cobros posteriores no modifican este recibo.</p></DemoDialog>}
  </DemoPage>;
}
