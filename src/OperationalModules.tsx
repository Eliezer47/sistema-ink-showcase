import { useState } from "react";
import { DemoPage, DemoTabs, Facts, Metrics, PreviewButton, RecordExplorer, demoMoney, type ExampleRecord } from "./DemoPrimitives";
import { useDemoSession } from "./DemoSession";
import { calculateDemoCost } from "./demoScenario";
import DemoDialog, { DocumentExample } from "./DemoDialog";

export function QuotesExample() {
  const [preview, setPreview] = useState(false);
  return <DemoPage title="Cotizaciones" description="Propuestas comerciales, versiones y fechas prometidas." actions={<PreviewButton>Nueva cotización</PreviewButton>}>
    <RecordExplorer headers={["Número", "Cliente", "Estado", "Total"]} detailTitle="PROPUESTA COMERCIAL" records={[
      { id: "a", cells: ["COT-DEMO-0201", "Café Lumbre", "Borrador", "C$ 3,000.00"], title: "12 camisetas con estampado", facts: [["Versión", "1"], ["Cliente", "Café Lumbre"], ["Moneda", "NIO"], ["Válida hasta", "18/09/2026"], ["Entrega prometida", "15/09/2026"], ["Conceptos", "Camiseta blanca + estampado frontal"], ["Total", "C$ 3,000.00"]], note: "La propuesta conserva sus conceptos y personalizaciones al convertirse en pedido." },
      { id: "b", cells: ["COT-DEMO-0198", "Norte Creativo", "Aprobada", "C$ 4,350.00"], title: "30 tazas personalizadas", facts: [["Versión", "2"], ["Cliente", "Norte Creativo"], ["Moneda", "NIO"], ["Válida hasta", "17/09/2026"], ["Entrega prometida", "16/09/2026"], ["Total", "C$ 4,350.00"]] },
    ]} actions={<><PreviewButton>Aprobar</PreviewButton><PreviewButton>Guardar borrador</PreviewButton></>} />
    <div className="faithful-actions"><PreviewButton onClick={() => setPreview(true)}>Ver cotización de ejemplo</PreviewButton></div>
    {preview && <DemoDialog title="Vista previa de cotización · COT-DEMO-0201" onClose={() => setPreview(false)}><DocumentExample kind="quote" /></DemoDialog>}
  </DemoPage>;
}

export function DeliveriesExample() {
  const [tab, setTab] = useState("Entregas");
  const [preview, setPreview] = useState(false);
  const shipping = tab === "Despachos";
  return <DemoPage title="Entregas" description="Cantidades pendientes, entregas parciales, envíos agrupados y comprobantes.">
    <DemoTabs labels={["Entregas", "Despachos"]} active={tab} onChange={setTab} />
    <RecordExplorer key={tab} headers={shipping ? ["Despacho", "Transportista", "Destino", "Costo real"] : ["Pedido", "Cliente", "Producción", "Pendiente"]} detailTitle={shipping ? "DESPACHO SELECCIONADO" : "CANTIDADES DEL PEDIDO"} records={shipping ? [
      { id: "s1", cells: ["DES-DEMO-0031", "Mensajería Demo", "Distrito Creativo", "C$ 180.00"], title: "Envío local agrupado", facts: [["Pedidos incluidos", "PED-DEMO-0201 / PED-DEMO-0199"], ["Transportista", "Mensajería Demo"], ["Costo real", "C$ 180.00"], ["Proveedor", "Logística de Muestra"], ["Obligación asociada", "CxP · Pendiente"]], note: "El costo del transportista se registra por separado del cargo de envío cobrado al cliente. El despacho no duplica la salida física de inventario." },
    ] : [
      { id: "d1", cells: ["PED-DEMO-0199", "Estudio Prisma", "Finalizada", "8 de 20"], title: "Entrega parcial de agendas", facts: [["Cantidad del pedido", "20 unidades"], ["Entregado", "12 unidades"], ["Pendiente", "8 unidades"], ["Recibe", "Contacto Demo"], ["Fecha efectiva", "11/09/2026"], ["Último comprobante", "ENT-DEMO-0086"]], note: "El historial conserva cada entrega. Completar pendientes propone únicamente las cantidades que faltan." },
      { id: "d2", cells: ["PED-DEMO-0201", "Café Lumbre", "En proceso", "12 de 12"], title: "Camisetas pendientes de entrega", facts: [["Cantidad del pedido", "12 unidades"], ["Entregado", "0 unidades"], ["Pendiente", "12 unidades"], ["Modalidad", "Entrega local"], ["Entrega prometida", "15/09/2026"]] },
    ]} actions={<><PreviewButton>{shipping ? "Registrar despacho" : "Completar pendientes"}</PreviewButton><PreviewButton>{shipping ? "Abrir obligación en CxP" : "Registrar entrega"}</PreviewButton></>} />
    <div className="faithful-actions"><PreviewButton onClick={() => setPreview(true)}>Ver etiqueta de ejemplo</PreviewButton></div>
    {preview && <DemoDialog title="Etiqueta de envío · PED-DEMO-0201" onClose={() => setPreview(false)}><DocumentExample kind="label" /></DemoDialog>}
  </DemoPage>;
}

export function CustomerItemsExample() {
  return <DemoPage title="Artículos del cliente" description="Recepción, ubicación, producción y devolución con trazabilidad por pedido." actions={<PreviewButton>Nueva recepción</PreviewButton>}>
    <Metrics items={[["Recepciones en custodia", "2"], ["Pendiente devolver", "18 unidades"], ["Control", "Recepción · Producción · Cliente"]]} />
    <RecordExplorer headers={["Constancia", "Pedido", "Cliente", "Pendiente", "Estado"]} detailTitle="CUSTODIA DEL CLIENTE" records={[
      { id: "c1", cells: ["REC-DEMO-0084", "PED-DEMO-0188", "Casa Nativa", "12", "En custodia"], title: "12 delantales del cliente", facts: [["Recibido", "12 unidades"], ["En recepción", "4 unidades"], ["En producción", "8 unidades"], ["Devuelto", "0 unidades"], ["Condición general", "Buen estado · tela de algodón"], ["Entregado por", "Contacto Demo"]], note: "Los artículos pertenecen al cliente. Su custodia se sigue por separado del inventario del negocio." },
      { id: "c2", cells: ["REC-DEMO-0085", "PED-DEMO-0192", "Taller Horizonte", "6", "En custodia"], title: "6 uniformes para bordado", facts: [["Recibido", "10 unidades"], ["En recepción", "0 unidades"], ["En producción", "6 unidades"], ["Devuelto", "4 unidades"], ["Condición general", "Prendas nuevas"], ["Movimiento reciente", "Devolución parcial al cliente"]] },
    ]} actions={<><PreviewButton>Enviar a producción</PreviewButton><PreviewButton>Regresar de producción</PreviewButton><PreviewButton>Devolver al cliente</PreviewButton><PreviewButton>Registrar daño</PreviewButton></>} />
  </DemoPage>;
}

export function QualityExample() {
  return <DemoPage title="Calidad e incidencias" description="Defectos, devoluciones, costos y reposiciones vinculadas al pedido." actions={<PreviewButton>Nueva incidencia</PreviewButton>}>
    <Metrics items={[["Abiertas", "2"], ["Costo en revisión", "C$ 290.00"], ["Control", "Pedido · Línea · Responsable"]]} />
    <RecordExplorer headers={["Incidencia", "Pedido", "Concepto", "Cant.", "Estado"]} detailTitle="INCIDENCIA SELECCIONADA" records={[
      { id: "q1", cells: ["INC-DEMO-0017", "PED-DEMO-0188", "Estampado descentrado", "2", "Abierta"], title: "Especificación incorrecta", facts: [["Etapa", "Antes de entregar"], ["Responsabilidad", "Absorbe negocio"], ["Resolución", "Reprocesar"], ["Cantidad afectada", "2 unidades"], ["Impacto estimado", "C$ 180.00"], ["Trabajo de reposición", "PROD-DEMO-0097"]], note: "Una incidencia documenta un problema concreto; no es un paso obligatorio de aprobación para todos los pedidos." },
      { id: "q2", cells: ["INC-DEMO-0018", "PED-DEMO-0192", "Prenda dañada", "1", "En revisión"], title: "Daño en artículo del cliente", facts: [["Etapa", "Producción"], ["Responsabilidad", "Por determinar"], ["Resolución", "Reponer"], ["Cantidad afectada", "1 unidad"], ["Impacto estimado", "C$ 110.00"], ["Evidencia", "Referencia ficticia · Sin adjuntos reales"]] },
    ]} actions={<><PreviewButton>Adjuntar evidencia</PreviewButton><PreviewButton>Marcar como resuelta</PreviewButton><PreviewButton>Anular</PreviewButton></>} />
  </DemoPage>;
}

export function SalesExample() {
  const { state } = useDemoSession();
  const [tab, setTab] = useState("Ventas y pedidos");
  const [filter, setFilter] = useState("Pendientes");
  const [preview, setPreview] = useState<"card" | "receipt" | null>(null);
  const orders: ExampleRecord[] = [
    { id: "a", cells: ["PED-DEMO-0201", "Café Lumbre", "15/09/2026", "Por cobrar", "C$ 3,000.00"], title: "Café Lumbre · 12 camisetas", facts: [["Total", "C$ 3,000.00"], ["Pagado", "C$ 600.00"], ["Saldo", "C$ 2,400.00"], ["Producción", "Estampado frontal · En proceso"], ["Entrega", "Pendiente · Entrega local"], ["Personalización", "Frontal · 20 × 25 cm · 1 técnica"]], note: "Venta, personalización, cobros y entrega conservan la misma referencia del pedido." },
    { id: "b", cells: ["PED-DEMO-0199", "Estudio Prisma", "11/09/2026", "Pagado", "C$ 4,600.00"], title: "Estudio Prisma · 20 agendas", facts: [["Total", "C$ 4,600.00"], ["Pagado", "C$ 4,600.00"], ["Saldo", "C$ 0.00"], ["Entregado", "12 de 20 unidades"], ["Pendiente", "8 unidades"]], note: "Un pedido pagado continúa en Pendientes mientras falte la entrega física." },
    { id: "c", cells: ["PED-DEMO-0186", "Norte Creativo", "09/09/2026", "Entregado", "C$ 1,450.00"], title: "Norte Creativo · 10 tazas", facts: [["Total", "C$ 1,450.00"], ["Pagado", "C$ 1,450.00"], ["Saldo", "C$ 0.00"], ["Entrega", "10 de 10 unidades"], ["Recibo", "REC-DEMO-0178"]] },
  ];
  const filtered = filter === "Histórico" ? orders : filter === "Pagados" ? orders.slice(1) : filter === "Por cobrar" ? orders.slice(0, 1) : orders.slice(0, 2);
  return <DemoPage title={state.mode === "simple" ? "Ventas rápidas" : "Ventas y pedidos"} description="Captura una vez y continúa con producción, cobro y documentos." actions={<PreviewButton>Nueva venta</PreviewButton>}>
    {state.mode === "simple" && <p className="simple-mode-badge">SIMPLE · Siguiente acción visible, sin cambiar los registros del sistema</p>}
    <DemoTabs labels={["Ventas y pedidos", "Documentos emitidos"]} active={tab} onChange={setTab} />
    {tab === "Ventas y pedidos" ? <><DemoTabs labels={["Pendientes", "Por cobrar", "Pagados", "Histórico"]} active={filter} onChange={setFilter} />
      <RecordExplorer headers={["Pedido", "Cliente", "Entrega", "Estado", "Total"]} records={filtered} detailTitle="PEDIDO SELECCIONADO" actions={<><PreviewButton>Cobrar y preparar entrega</PreviewButton><PreviewButton>Entregar ahora</PreviewButton></>} />
      <details className="faithful-disclosure"><summary>Más acciones del pedido</summary><p>Editar, ampliar conceptos, compartir resumen, etiquetas, cancelar y duplicar conservan trazabilidad. En la entrega 1.10.3, una devolución de un cierre anterior sale de la caja abierta actual y mantiene el cierre histórico.</p><PreviewButton>Vista previa de cancelación</PreviewButton></details>
    </> : <RecordExplorer headers={["Documento", "Pedido", "Tipo", "Estado"]} detailTitle="DOCUMENTO EMITIDO" records={[{ id: "doc", cells: ["DOC-DEMO-0086", "PED-DEMO-0199", "Documento de venta", "Emitido"], title: "Documento de venta", facts: [["Pedido", "PED-DEMO-0199"], ["Cliente", "Estudio Prisma"], ["Total", "C$ 4,600.00"], ["Fecha", "11/09/2026"]], note: "Esta presentación no ofrece facturación electrónica ni validación fiscal." }]} />}
    <div className="faithful-actions"><PreviewButton onClick={() => setPreview("card")}>Ver resumen de ejemplo · PED-DEMO-0201</PreviewButton><PreviewButton onClick={() => setPreview("receipt")}>Ver recibo de ejemplo · PED-DEMO-0201</PreviewButton></div>
    {preview && <DemoDialog title="Vista previa · PED-DEMO-0201" onClose={() => setPreview(null)}><DocumentExample kind={preview} /></DemoDialog>}
  </DemoPage>;
}

export function CashExample() {
  const { state } = useDemoSession();
  const [tab, setTab] = useState("Pendientes de cobro");
  return <DemoPage title={state.mode === "simple" ? "Cobro rápido" : "Caja"} description="Cobros, transferencias pendientes y saldos de pedidos.">
    <Metrics items={[["CAJA ABIERTA", "Mostrador DEMO"], ["Fecha empresarial", "11/09/2026"], ["Efectivo esperado", "C$ 7,600.00"], ["Por verificar", "C$ 1,200.00"]]} />
    <DemoTabs labels={["Pendientes de cobro", "Movimientos de hoy"]} active={tab} onChange={setTab} />
    <RecordExplorer key={tab} headers={tab === "Pendientes de cobro" ? ["Pedido", "Cliente", "Total", "Saldo"] : ["Recibo", "Concepto", "Método", "Importe"]} detailTitle={tab === "Pendientes de cobro" ? "COBRO DEL PEDIDO" : "HISTORIAL DEL RECIBO"} records={tab === "Pendientes de cobro" ? [
      { id: "cash1", cells: ["PED-DEMO-0201", "Café Lumbre", "C$ 3,000.00", "C$ 2,400.00"], title: "Café Lumbre", facts: [["Total del pedido", "C$ 3,000.00"], ["Pagado", "C$ 600.00"], ["Saldo propuesto", "C$ 2,400.00"], ["Por verificar", "C$ 0.00"]], note: "Efectivo, transferencia y saldo a favor pueden combinarse. Una transferencia pendiente no se considera dinero aplicado." },
      { id: "cash2", cells: ["PED-DEMO-0190", "Casa Nativa", "C$ 2,500.00", "C$ 1,200.00"], title: "Casa Nativa", facts: [["Total", "C$ 2,500.00"], ["Pagado", "C$ 1,300.00"], ["Saldo", "C$ 1,200.00"], ["Transferencia pendiente", "C$ 1,200.00"]] },
    ] : [{ id: "mov", cells: ["REC-DEMO-0201", "Abono · Café Lumbre", "Efectivo", "C$ 600.00"], title: "Recibo de abono", facts: [["Pedido", "PED-DEMO-0201"], ["Importe aplicado", "C$ 600.00"], ["Fecha", "11/09/2026"], ["Caja", "Mostrador DEMO"]], note: "El comprobante conserva los importes del momento en que fue emitido." }]} actions={<><PreviewButton>Efectivo</PreviewButton><PreviewButton>Transferencia</PreviewButton><PreviewButton>Saldo a favor</PreviewButton><PreviewButton>Cobrar saldo completo</PreviewButton></>} />
    <details className="faithful-disclosure"><summary>Más operaciones</summary><div className="faithful-actions">{["Retiro", "Cierre diario", "Movimiento atrasado", "Ajuste físico", "Cerrar caja 11/09"].map((label) => <PreviewButton key={label}>{label}</PreviewButton>)}</div><p>La fecha empresarial y la caja física identifican dónde queda cada movimiento.</p></details>
  </DemoPage>;
}

const financeViews: Record<string, { title: string; description: string; headers: string[]; records: ExampleRecord[] }> = {
  "Por cobrar": { title: "Cuentas por cobrar", description: "Saldos actuales e históricos, vencimientos y cobro agrupado.", headers: ["Documento", "Cliente", "Vence", "Saldo"], records: [
    { id: "ar1", cells: ["PED-DEMO-0201", "Café Lumbre", "15/09/2026", "C$ 2,400.00"], title: "Saldo de pedido", facts: [["Total", "C$ 3,000.00"], ["Abonos", "C$ 600.00"], ["Pendiente", "C$ 2,400.00"], ["Origen", "Pedido actual"]] },
    { id: "ar2", cells: ["CXC-DEMO-0012", "Casa Nativa", "08/09/2026", "C$ 1,800.00"], title: "Saldo histórico", facts: [["Origen", "Anterior al sistema"], ["Saldo inicial", "C$ 2,300.00"], ["Abonado", "C$ 500.00"], ["Pendiente", "C$ 1,800.00"]] },
  ] },
  "Por pagar": { title: "Cuentas por pagar", description: "Obligaciones, anticipos, saldos a favor y pagos con varias fuentes.", headers: ["Obligación", "Proveedor", "Vence", "Saldo"], records: [
    { id: "ap", cells: ["CXP-DEMO-0028", "Textiles Centro", "25/09/2026", "C$ 8,000.00"], title: "Compra de textiles", facts: [["Total obligación", "C$ 12,000.00"], ["Abonado", "C$ 4,000.00"], ["Pendiente", "C$ 8,000.00"], ["Fuentes de pago", "Caja · Cuenta bancaria · Reserva"], ["Origen", "Compra inventariable"]], note: "Cada fuente conserva su identidad. Un anticipo del proveedor puede aplicarse sin confundirlo con una nueva salida." },
  ] },
  "Planes": { title: "Préstamos y gastos recurrentes", description: "Calendario de cuotas y compromisos periódicos.", headers: ["Plan", "Concepto", "Frecuencia", "Próxima cuota"], records: [
    { id: "plan", cells: ["PLAN-DEMO-0003", "Renta del taller", "Mensual", "C$ 5,000.00"], title: "Renta del taller", facts: [["Tipo", "Gasto recurrente"], ["Frecuencia", "Mensual"], ["Próximo vencimiento", "01/10/2026"], ["Cuotas pendientes", "3"], ["Estado", "Activo"]] },
  ] },
  "Cuentas": { title: "Cuentas financieras", description: "Saldos derivados, fondos reservados, movimientos y conciliación.", headers: ["Cuenta", "Tipo", "Saldo", "Disponible"], records: [
    { id: "account", cells: ["CTA-DEMO-0001", "Banco · NIO", "C$ 28,000.00", "C$ 20,000.00"], title: "Cuenta operativa DEMO", facts: [["Saldo", "C$ 28,000.00"], ["Reservado", "C$ 8,000.00"], ["Disponible", "C$ 20,000.00"], ["Última conciliación", "Agosto · Cerrada"], ["Estado de cuenta", "Septiembre · En revisión"]], note: "La conciliación asistida propone coincidencias para que una persona las revise; no confirma movimientos bancarios por sí sola." },
  ] },
  "Informes": { title: "Ingresos y egresos operativos", description: "Lectura de cobros, salidas y resultado operativo por período.", headers: ["Concepto", "Ingresos", "Egresos", "Resultado"], records: [
    { id: "report", cells: ["Septiembre DEMO", "C$ 42,000.00", "C$ 27,000.00", "C$ 15,000.00"], title: "Resultado del período", facts: [["Cobros efectivos", "C$ 42,000.00"], ["Salidas operativas", "C$ 27,000.00"], ["Resultado", "C$ 15,000.00"], ["Devoluciones a clientes", "Separadas de gastos operativos"]], note: "Los indicadores operativos no sustituyen la contabilidad formal ni una declaración fiscal." },
  ] },
  "Activos fijos": { title: "Activos fijos", description: "Equipos, inversión, depreciación y bajas.", headers: ["Activo", "Equipo", "Adquisición", "Valor en libros"], records: [
    { id: "asset", cells: ["ACT-DEMO-0008", "Prensa térmica", "C$ 18,000.00", "C$ 15,600.00"], title: "Prensa térmica DEMO", facts: [["Costo de adquisición", "C$ 18,000.00"], ["Depreciación acumulada", "C$ 2,400.00"], ["Valor en libros", "C$ 15,600.00"], ["Estado", "En uso"]] },
  ] },
  "Planificación": { title: "Planificación y rentabilidad", description: "Presupuesto, costos indirectos y seguimiento de márgenes.", headers: ["Concepto", "Presupuesto", "Real", "Variación"], records: [
    { id: "budget", cells: ["Servicios del taller", "C$ 3,000.00", "C$ 2,750.00", "C$ −250.00"], title: "Presupuesto mensual", facts: [["Período", "Septiembre DEMO"], ["Presupuesto", "C$ 3,000.00"], ["Registrado", "C$ 2,750.00"], ["Diferencia", "C$ 250.00 disponible"]] },
  ] },
};

export function FinanceExample() {
  const [tab, setTab] = useState("Por cobrar");
  const view = financeViews[tab];
  return <DemoPage title="Finanzas" description="Cartera, obligaciones, presupuesto y rentabilidad."><DemoTabs labels={Object.keys(financeViews)} active={tab} onChange={setTab} />
    <h3 className="faithful-section-title">{view.title}</h3><p>{view.description}</p>
    <RecordExplorer key={tab} headers={view.headers} records={view.records} detailTitle={view.title.toUpperCase()} actions={<PreviewButton>{tab === "Cuentas" ? "Conciliación bancaria" : "Vista previa del reporte"}</PreviewButton>} />
  </DemoPage>;
}

export function AvailabilityExample({ stock = { physical: 36, reserved: 12, available: 24 } }: { stock?: { physical: number; reserved: number; available: number } }) {
  const [warehouse, setWarehouse] = useState("Todos");
  const records: ExampleRecord[] = [
    { id: "stock1", cells: ["PRO-DEMO-027-S", "Camiseta blanca · S", "C$ 140.00", String(stock.physical), String(stock.reserved), String(stock.available)], title: "Camiseta blanca · Talla S", facts: [["Marca", "Textil Demo"], ["Color", "Blanco"], ["Físico", `${stock.physical} unidades`], ["Reservado", `${stock.reserved} unidades`], ["Disponible", `${stock.available} unidades`], ["Ubicación", "Principal · A-02"]] },
    { id: "stock2", cells: ["PRO-DEMO-027-M", "Camiseta negra · M", "C$ 140.00", "20", "4", "16"], title: "Camiseta negra · Talla M", facts: [["Marca", "Textil Demo"], ["Color", "Negro"], ["Físico", "20 unidades"], ["Reservado", "4 unidades"], ["Disponible", "16 unidades"], ["Ubicación", "Mostrador · B-01"]] },
  ];
  return <DemoPage title="Disponibilidad rápida" description="Artículos vendibles con existencia libre después de reservas."><div className="faithful-filter"><label>Almacén<select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}><option>Todos</option><option>Principal</option><option>Mostrador</option></select></label><p>Busca talla, color o nombre. La existencia física y la disponible se muestran por separado.</p></div>
    <RecordExplorer headers={["Código", "Producto", "Precio público", "Físico", "Reservado", "Disponible"]} records={warehouse === "Todos" ? records : warehouse === "Principal" ? records.slice(0, 1) : records.slice(1)} detailTitle="DISPONIBILIDAD DEL ARTÍCULO" />
  </DemoPage>;
}

export function CostCalculatorExample() {
  const [quantity, setQuantity] = useState("12");
  const [additional, setAdditional] = useState("0");
  const [margin, setMargin] = useState("30");
  const [manual, setManual] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateDemoCost>>(null);
  const [error, setError] = useState("");
  return <DemoPage title="Calculadora de costos" description="Simula cantidades y precios sin modificar recetas, cotizaciones ni pedidos."><div className="faithful-split calculator-layout">
    <form className="faithful-form" data-guide-target="module-filter" onSubmit={(event) => { event.preventDefault(); const value = calculateDemoCost(Number(quantity), Number(additional), Number(margin), manual === "" ? undefined : Number(manual)); setResult(value); setError(value ? "" : "Usa una cantidad entera de 1 a 10,000, costo adicional positivo o cero y margen menor que 100%."); }}>
      <h3>Escenario</h3><label>Producto o servicio<select><option>Camiseta con estampado · PRO-DEMO-027</option></select></label>
      <label>Cantidad<input required type="number" min="1" max="10000" step="1" value={quantity} onChange={(e) => { setQuantity(e.target.value); setResult(null); }} /></label>
      <label>Costo adicional del lote (NIO)<input required type="number" min="0" step="0.01" value={additional} onChange={(e) => { setAdditional(e.target.value); setResult(null); }} /></label>
      <label>Margen objetivo %<input required type="number" min="0" max="99.99" step="0.01" value={margin} onChange={(e) => { setMargin(e.target.value); setResult(null); }} /></label>
      <label>Precio manual por unidad (opcional)<input type="number" min="0.01" step="0.01" value={manual} onChange={(e) => { setManual(e.target.value); setResult(null); }} placeholder="Usar sugerido" /></label>
      <button className="real-primary-button" type="submit">Calcular ejemplo</button>{error && <p role="alert">{error}</p>}
    </form><section className="detail-pane" data-guide-target="record-detail">{result ? <><h3>Resultado del escenario</h3><Metrics items={[["Costo unitario", demoMoney(result.unitCost)], ["Precio sugerido", demoMoney(result.suggested)], ["Venta del lote", demoMoney(result.revenue)], ["Utilidad", demoMoney(result.profit)]]} /><Facts items={[["Materiales", demoMoney(result.materials)], ["Mano de obra", demoMoney(result.labor)], ["Máquina", demoMoney(result.machine)], ["Gastos indirectos", demoMoney(result.overhead)], ["Adicional", demoMoney(Number(additional))], ["Costo total", demoMoney(result.totalCost)], ["Margen sobre venta", `${result.margin.toFixed(1)} %`]]} /></> : <><h3>Prepara un escenario</h3><p>Indica cantidad, margen o precio manual y pulsa Calcular ejemplo.</p></>}
      <p className="faithful-list-note">Tarifas sintéticas: material C$ 110, mano de obra C$ 20 y máquina C$ 5 por unidad; indirectos C$ 60 por lote. Esta aritmética ilustrativa no reproduce el motor de costos comercial.</p>
    </section></div></DemoPage>;
}

export function ProductionExample() {
  return <DemoPage title="Producción" description="Cola de trabajos, sesiones, materiales y costos reales." actions={<PreviewButton>Costos reales del período</PreviewButton>}>
    <RecordExplorer headers={["Pedido", "Cliente", "Acción", "Entrega", "Estado"]} detailTitle="ACCIÓN DE PRODUCCIÓN" records={[
      { id: "p1", cells: ["PED-DEMO-0201", "Café Lumbre", "Estampar", "15/09", "En proceso"], title: "Estampado frontal · 12 camisetas", facts: [["Estado", "En proceso"], ["Cantidad", "12 unidades"], ["Tiempo efectivo", "00:42"], ["Sesiones", "1 activa"], ["Materiales de la receta", "Transfer textil · Tinta de muestra"], ["Costo estimado del lote", "C$ 1,680.00"]], note: "Las sesiones y el consumo real permiten comparar costo estimado y real sin cambiar el precio pactado con el cliente." },
      { id: "p2", cells: ["PED-DEMO-0199", "Estudio Prisma", "Acabado", "11/09", "Finalizada"], title: "Acabado · 20 agendas", facts: [["Estado", "Finalizada"], ["Cantidad", "20 unidades"], ["Tiempo efectivo", "01:10"], ["Costo estimado", "C$ 1,420.00"], ["Costo real ilustrativo", "C$ 1,480.00"], ["Variación", "C$ 60.00 desfavorable"]] },
      { id: "p3", cells: ["PED-DEMO-0192", "Taller Horizonte", "Bordar", "16/09", "Pausada"], title: "Bordado · 10 uniformes", facts: [["Estado", "Pausada"], ["Cantidad", "10 unidades"], ["Tiempo efectivo", "00:25"], ["Artículo del cliente", "Sí · REC-DEMO-0085"], ["Incidencia relacionada", "INC-DEMO-0018"]] },
    ]} actions={<><PreviewButton>Iniciar</PreviewButton><PreviewButton>Pausar</PreviewButton><PreviewButton>Finalizar</PreviewButton><PreviewButton>Registrar consumo</PreviewButton></>} />
    <details className="faithful-disclosure"><summary>Costos reales del período</summary><p>Consulta el costo estimado, el costo registrado y su variación para revisar el resultado del trabajo. Esta vista utiliza importes ficticios.</p></details>
  </DemoPage>;
}

export function InventoryExample() {
  const [tab, setTab] = useState("Existencias");
  const stock = tab === "Existencias";
  return <DemoPage title="Inventario" description="Existencias por almacén, reservas, kardex y consumo interno."><DemoTabs labels={["Existencias", "Kardex"]} active={tab} onChange={setTab} />
    <RecordExplorer key={tab} headers={stock ? ["Código", "Concepto", "Físico", "Reservado", "Disponible"] : ["Movimiento", "Concepto", "Entrada", "Salida", "Saldo"]} detailTitle={stock ? "ARTÍCULO Y ALMACÉN" : "MOVIMIENTO SELECCIONADO"} records={stock ? [
      { id: "s1", cells: ["PRO-DEMO-027-S", "Camiseta blanca · S", "36", "12", "24"], title: "Camiseta blanca · Talla S", facts: [["Almacén", "Principal"], ["Físico", "36 unidades"], ["Reservado", "12 unidades"], ["Disponible", "24 unidades"], ["Costo promedio", "C$ 110.00"], ["Punto de reposición", "10 unidades"]] },
      { id: "s2", cells: ["INS-DEMO-014", "Tinta textil negra", "18.5", "1.2", "17.3"], title: "Tinta textil negra", facts: [["Unidad", "kg"], ["Almacén", "Taller"], ["Físico", "18.5 kg"], ["Reservado", "1.2 kg"], ["Disponible", "17.3 kg"], ["Consumo interno", "Permitido · Insumo no vendible"]] },
    ] : [
      { id: "k1", cells: ["MOV-DEMO-0411", "Recepción de compra", "24", "0", "48"], title: "Entrada de camisetas", facts: [["Origen", "COM-DEMO-0028"], ["Tipo", "Recepción de compra"], ["Almacén", "Principal"], ["Cantidad", "24 unidades"], ["Costo unitario", "C$ 110.00"]] },
      { id: "k2", cells: ["MOV-DEMO-0412", "Entrega a cliente", "0", "12", "36"], title: "Salida por entrega", facts: [["Pedido", "PED-DEMO-0184"], ["Comprobante", "ENT-DEMO-0084"], ["Almacén", "Principal"], ["Cantidad", "12 unidades"]] },
      { id: "k3", cells: ["CON-DEMO-0015", "Tinta para limpieza", "0", "0.1 kg", "18.5 kg"], title: "Consumo interno valorizado", facts: [["Concepto", "Tinta textil negra"], ["Motivo", "Limpieza de equipo"], ["Cantidad", "0.1 kg"], ["Valor ilustrativo", "C$ 18.00"]], note: "Este movimiento documenta un uso interno; no se registra como venta ni como ajuste de conteo." },
    ]} actions={<><PreviewButton>Conteo inicial</PreviewButton><PreviewButton>Transferir entre almacenes</PreviewButton><PreviewButton>Consumir internamente</PreviewButton></>} />
  </DemoPage>;
}

export function CustomersExample() {
  return <DemoPage title="Clientes" description="Ficha comercial, destinos, listas de precios y crédito." actions={<PreviewButton>Nuevo cliente</PreviewButton>}>
    <RecordExplorer headers={["Código", "Cliente", "Lista", "Estado"]} detailTitle="FICHA DEL CLIENTE" records={[
      { id: "cl1", cells: ["CLI-DEMO-021", "Café Lumbre", "Público", "Activo"], title: "Café Lumbre", facts: [["Contacto", "Contacto de muestra"], ["Correo", "hola@cafelumbre.example"], ["Lista de precios", "Público"], ["Crédito", "No habilitado"], ["Destino predeterminado", "Distrito Creativo · Entrega local"], ["Otros destinos", "Retiro por el cliente"]] },
      { id: "cl2", cells: ["CLI-DEMO-018", "Norte Creativo", "Mayoreo", "Activo"], title: "Norte Creativo", facts: [["Contacto", "Contacto Demo"], ["Correo", "compras@norte.example"], ["Lista de precios", "Mayoreo"], ["Crédito", "30 días · Límite C$ 10,000.00"], ["Destino", "Zona de Muestra · Envío nacional"], ["Precios por cliente", "Condiciones específicas del catálogo"]] },
    ]} actions={<><PreviewButton>Destinos de envío</PreviewButton><PreviewButton>Guardar cambios</PreviewButton></>} />
  </DemoPage>;
}
