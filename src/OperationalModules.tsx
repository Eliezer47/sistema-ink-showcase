import { useState } from "react";
import { DemoPage, DemoTabs, Facts, Metrics, PreviewButton, RecordExplorer, demoMoney, type ExampleRecord } from "./DemoPrimitives";
import { useDemoSession } from "./DemoSession";
import { calculateDemoCost } from "./demoScenario";
import { CashDetail, CustomerDetail, CustomerItemDetail, DeliveryDetail, FinanceDetail, InventoryDetail, ProductionDetail, QualityDetail, QuoteDetail } from "./DesktopDetails";
import { ReferenceActions, ReferenceNote, ReferenceTable } from "./DesktopPrimitives";
import DemoDialog, { DocumentExample } from "./DemoDialog";

export function QuotesExample() {
  const [preview, setPreview] = useState(false);
  return <DemoPage title="Cotizaciones" description="Propuestas comerciales, versiones y fechas prometidas." actions={<PreviewButton>Nueva cotización</PreviewButton>}>
    <RecordExplorer layout="workspace" renderDetail={(record) => <QuoteDetail record={record} />} headers={["Número", "Cliente", "Estado", "Total"]} detailTitle="PROPUESTA COMERCIAL" records={[
      { id: "a", cells: ["COT-DEMO-0201", "Café Lumbre", "Borrador", "C$ 3,000.00"], title: "12 camisetas con estampado", facts: [["Versión", "1"], ["Cliente", "Café Lumbre"], ["Moneda", "NIO"], ["Válida hasta", "18/09/2026"], ["Entrega prometida", "15/09/2026"], ["Conceptos", "Camiseta blanca + estampado frontal"], ["Total", "C$ 3,000.00"]], note: "La propuesta conserva sus conceptos y personalizaciones al convertirse en pedido." },
      { id: "b", cells: ["COT-DEMO-0198", "Norte Creativo", "Aprobada", "C$ 4,350.00"], title: "30 tazas personalizadas", facts: [["Versión", "2"], ["Cliente", "Norte Creativo"], ["Moneda", "NIO"], ["Válida hasta", "17/09/2026"], ["Entrega prometida", "16/09/2026"], ["Total", "C$ 4,350.00"]] },
    ]} />
    <div className="faithful-actions"><PreviewButton onClick={() => setPreview(true)}>Ver cotización de ejemplo</PreviewButton></div>
    {preview && <DemoDialog title="Vista previa de cotización · COT-DEMO-0201" onClose={() => setPreview(false)}><DocumentExample kind="quote" /></DemoDialog>}
  <ReferenceNote /></DemoPage>;
}

export function DeliveriesExample() {
  const [tab, setTab] = useState("Entregas");
  const [preview, setPreview] = useState(false);
  const shipping = tab === "Despachos";
  return <DemoPage title="Entregas" description="Cantidades pendientes, entregas parciales, envíos agrupados y comprobantes.">
    <DemoTabs labels={["Entregas", "Despachos"]} active={tab} onChange={setTab} />
    <RecordExplorer layout="workspace" renderDetail={(record) => <DeliveryDetail record={record} />} filters={shipping ? undefined : { labels: ["Activos", "Pendientes", "Parciales", "Atrasados", "Entregados", "Todos"], matches: (record, filter) => filter === "Todos" || filter === "Activos" || (filter === "Parciales" ? record.id === "d1" : filter === "Pendientes" ? record.id === "d2" : false) }} key={tab} headers={shipping ? ["Despacho", "Transportista", "Destino", "Costo real"] : ["Pedido", "Cliente", "Producción", "Pendiente"]} detailTitle={shipping ? "DESPACHO SELECCIONADO" : "CANTIDADES DEL PEDIDO"} records={shipping ? [
      { id: "s1", cells: ["DES-DEMO-0031", "Mensajería Demo", "Distrito Creativo", "C$ 180.00"], title: "Envío local agrupado", facts: [["Pedidos incluidos", "PED-DEMO-0201 / PED-DEMO-0199"], ["Transportista", "Mensajería Demo"], ["Costo real", "C$ 180.00"], ["Proveedor", "Logística de Muestra"], ["Obligación asociada", "CxP · Pendiente"]], note: "El costo del transportista se registra por separado del cargo de envío cobrado al cliente. El despacho no duplica la salida física de inventario." },
    ] : [
      { id: "d1", cells: ["PED-DEMO-0199", "Estudio Prisma", "Finalizada", "8 de 20"], title: "Entrega parcial de agendas", facts: [["Cantidad del pedido", "20 unidades"], ["Entregado", "12 unidades"], ["Pendiente", "8 unidades"], ["Recibe", "Contacto Demo"], ["Fecha efectiva", "11/09/2026"], ["Último comprobante", "ENT-DEMO-0086"]], note: "El historial conserva cada entrega. Completar pendientes propone únicamente las cantidades que faltan." },
      { id: "d2", cells: ["PED-DEMO-0201", "Café Lumbre", "En proceso", "12 de 12"], title: "Camisetas pendientes de entrega", facts: [["Cantidad del pedido", "12 unidades"], ["Entregado", "0 unidades"], ["Pendiente", "12 unidades"], ["Modalidad", "Entrega local"], ["Entrega prometida", "15/09/2026"]] },
    ]} />
    <div className="faithful-actions"><PreviewButton onClick={() => setPreview(true)}>Ver etiqueta de ejemplo</PreviewButton></div>
    {preview && <DemoDialog title="Etiqueta de envío · PED-DEMO-0201" onClose={() => setPreview(false)}><DocumentExample kind="label" /></DemoDialog>}
  <ReferenceNote /></DemoPage>;
}

export function CustomerItemsExample() {
  return <DemoPage title="Artículos del cliente" description="Recepción, ubicación, producción y devolución con trazabilidad por pedido." actions={<PreviewButton>Nueva recepción</PreviewButton>}>
    <Metrics items={[["Recepciones en custodia", "2"], ["Recepciones listadas", "2"], ["Control", "Recepción · Producción · Cliente"]]} />
    <RecordExplorer layout="workspace" renderDetail={(record) => <CustomerItemDetail record={record} />} filters={{ labels: ["En custodia", "Devueltas", "Anuladas", "Todas"], matches: (_, filter) => filter === "En custodia" || filter === "Todas" }} headers={["Constancia", "Pedido", "Cliente", "Pendiente", "Estado"]} detailTitle="CUSTODIA DEL CLIENTE" records={[
      { id: "c1", cells: ["REC-DEMO-0084", "PED-DEMO-0188", "Casa Nativa", "12", "En custodia"], title: "12 delantales del cliente", facts: [["Recibido", "12 unidades"], ["En recepción", "4 unidades"], ["En producción", "8 unidades"], ["Devuelto", "0 unidades"], ["Condición general", "Buen estado · tela de algodón"], ["Entregado por", "Contacto Demo"]], note: "Los artículos pertenecen al cliente. Su custodia se sigue por separado del inventario del negocio." },
      { id: "c2", cells: ["REC-DEMO-0085", "PED-DEMO-0192", "Taller Horizonte", "6", "En custodia"], title: "6 uniformes para bordado", facts: [["Recibido", "10 unidades"], ["En recepción", "0 unidades"], ["En producción", "6 unidades"], ["Devuelto", "4 unidades"], ["Condición general", "Prendas nuevas"], ["Movimiento reciente", "Devolución parcial al cliente"]] },
    ]} />
  <ReferenceNote /></DemoPage>;
}

export function QualityExample() {
  return <DemoPage title="Calidad e incidencias" description="Defectos, devoluciones, costos y reposiciones vinculadas al pedido." actions={<PreviewButton>Nueva incidencia</PreviewButton>}>
    <Metrics items={[["Abiertas", "2"], ["Costo en revisión", "C$ 290.00"], ["Control", "Pedido · Línea · Responsable"]]} />
    <RecordExplorer layout="workspace" renderDetail={(record) => <QualityDetail record={record} />} filters={{ labels: ["Abiertas", "Resueltas", "Anuladas", "Todas"], matches: (_, filter) => filter === "Abiertas" || filter === "Todas" }} headers={["Incidencia", "Pedido", "Concepto", "Cant.", "Estado"]} detailTitle="INCIDENCIA SELECCIONADA" records={[
      { id: "q1", cells: ["INC-DEMO-0017", "PED-DEMO-0188", "Estampado descentrado", "2", "Abierta"], title: "Especificación incorrecta", facts: [["Etapa", "Antes de entregar"], ["Responsabilidad", "Absorbe negocio"], ["Resolución", "Reprocesar"], ["Cantidad afectada", "2 unidades"], ["Impacto estimado", "C$ 180.00"], ["Trabajo de reposición", "PROD-DEMO-0097"]], note: "Una incidencia documenta un problema concreto; no es un paso obligatorio de aprobación para todos los pedidos." },
      { id: "q2", cells: ["INC-DEMO-0018", "PED-DEMO-0192", "Prenda dañada", "1", "En revisión"], title: "Daño en artículo del cliente", facts: [["Etapa", "Producción"], ["Responsabilidad", "Por determinar"], ["Resolución", "Reponer"], ["Cantidad afectada", "1 unidad"], ["Impacto estimado", "C$ 110.00"], ["Evidencia", "Referencia ficticia · Sin adjuntos reales"]] },
    ]} />
  <ReferenceNote /></DemoPage>;
}

export function CashExample() {
  const { state } = useDemoSession();
  const [tab, setTab] = useState("Por cobrar");
  const history = tab === "Historial de hoy";
  const paidOrder: ExampleRecord = { id: "paid", cells: ["PED-DEMO-0199", "Estudio Prisma", "C$ 4,600.00", "C$ 0.00"], title: "Pagado · Pendiente de entrega", facts: [["Cliente", "Estudio Prisma"], ["Pagado", "C$ 4,600.00"], ["Saldo", "C$ 0.00"], ["Entregado", "12 de 20 unidades"], ["Pendiente de entregar", "8 unidades"]], note: "Sigue en Pendientes hasta completar la entrega física, aunque ya no tenga saldo por cobrar." };
  return <DemoPage title={state.mode === "simple" ? "Cobro rápido" : "Caja"} description="Cobros, transferencias pendientes y saldos de pedidos." actions={<ReferenceActions labels={["Ver resumen de caja", "Caja abierta"]} />}>
    <Metrics items={[["CAJA ABIERTA", "Mostrador DEMO"], ["Fecha empresarial", "11/09/2026"], ["Efectivo esperado", "C$ 7,600.00"], ["Por verificar", "C$ 1,200.00"]]} />
    <DemoTabs labels={["Por cobrar", "Pendientes", "Pagados", "Historial de hoy"]} active={tab} onChange={setTab} />
    <RecordExplorer layout="workspace" renderDetail={(record) => <CashDetail record={record} />} key={tab} headers={!history ? ["Pedido", "Cliente", "Total", "Saldo"] : ["Movimiento", "Concepto", "Método / estado", "Importe"]} detailTitle={!history ? "COBRO DEL PEDIDO" : "HISTORIAL DEL RECIBO"} records={tab === "Pagados" ? [paidOrder] : !history ? [
      { id: "cash1", cells: ["PED-DEMO-0201", "Café Lumbre", "C$ 3,000.00", "C$ 2,400.00"], title: "Café Lumbre", facts: [["Total del pedido", "C$ 3,000.00"], ["Pagado", "C$ 600.00"], ["Saldo propuesto", "C$ 2,400.00"], ["Por verificar", "C$ 0.00"]], note: "Efectivo, transferencia y saldo a favor pueden combinarse. Una transferencia pendiente no se considera dinero aplicado." },
      { id: "cash2", cells: ["PED-DEMO-0190", "Casa Nativa", "C$ 2,500.00", "C$ 1,200.00"], title: "Casa Nativa", facts: [["Total", "C$ 2,500.00"], ["Pagado", "C$ 1,300.00"], ["Saldo", "C$ 1,200.00"], ["Transferencia pendiente", "C$ 1,200.00"]] },
      ...(tab === "Pendientes" ? [paidOrder] : []),
    ] : [
      { id: "pending", cells: ["MOV-DEMO-0202", "Casa Nativa", "Transferencia · Sin verificar", "C$ 1,200.00"], title: "Transferencia pendiente", facts: [["Pedido", "PED-DEMO-0190"], ["Importe", "C$ 1,200.00"], ["Aplicado", "C$ 0.00"], ["Estado", "Sin verificar"]], note: "Las transferencias sin verificar aparecen primero. Permiten Verificar o Rechazar; todavía no permiten emitir un recibo de pago." },
      { id: "mov", cells: ["REC-DEMO-0201", "Abono · Café Lumbre", "Efectivo · Aplicado", "C$ 600.00"], title: "Recibo de abono", facts: [["Pedido", "PED-DEMO-0201"], ["Importe aplicado", "C$ 600.00"], ["Fecha", "11/09/2026"], ["Caja", "Mostrador DEMO"]], note: "El comprobante conserva los importes del momento en que fue emitido." },
    ]} />
    <details className="faithful-disclosure"><summary>Más operaciones</summary><div className="faithful-actions">{["Retiro", "Cierre diario", "Movimiento atrasado", "Ajuste físico", "Cerrar caja 11/09"].map((label) => <PreviewButton key={label}>{label}</PreviewButton>)}</div><p>La fecha empresarial y la caja física identifican dónde queda cada movimiento.</p></details>
  <ReferenceNote /></DemoPage>;
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
    <div className="desktop-subheading"><div><h3>{view.title}</h3><p>{view.description}</p></div><ReferenceActions labels={tab === "Por cobrar" ? ["Registrar antecedente", "Estado de cartera"] : tab === "Por pagar" ? ["Reporte", "Nueva obligación"] : ["Actualizar"]} /></div>
    {tab === "Por cobrar" && <Metrics items={[["Cartera abierta", "C$ 4,200.00"], ["Cartera vencida", "C$ 1,800.00"], ["Por vencer (7 días)", "C$ 2,400.00"]]} />}
    {tab === "Por pagar" && <Metrics items={[["Saldo vigente", "C$ 8,000.00"], ["Vencido", "C$ 0.00"], ["Por vencer en 7 días", "C$ 0.00"]]} />}
    <RecordExplorer layout="workspace" renderDetail={(record) => <FinanceDetail record={record} tab={tab} />} key={tab} headers={view.headers} records={view.records} detailTitle={view.title.toUpperCase()} />
  <ReferenceNote /></DemoPage>;
}

export function AvailabilityExample({ stock = { physical: 36, reserved: 12, available: 24 } }: { stock?: { physical: number; reserved: number; available: number } }) {
  const [warehouse, setWarehouse] = useState("Todos");
  const [query, setQuery] = useState("");
  const records = [
    ["PRO-DEMO-027-S", "Camiseta blanca", "Talla S · Blanco", "C$ 140.00", String(stock.physical), String(stock.reserved), String(stock.available), "Principal · A-02"],
    ["PRO-DEMO-027-M", "Camiseta negra", "Talla M · Negro", "C$ 140.00", "20", "4", "16", "Mostrador · B-01"],
  ];
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  const visible = records.filter(row => (warehouse === "Todos" || row[7].startsWith(warehouse)) && normalize(row.join(" ")).includes(normalize(query)));
  return <div className="desktop-availability"><DemoPage title="Disponibilidad rápida" description="Consulta artículos vendibles con existencia libre después de reservas. Prueba: talla S.">
    <div className="faithful-filter" data-guide-target="module-filter"><label>Buscar<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Código, nombre o características…" /></label><label>Almacén<select aria-label="Almacén" value={warehouse} onChange={event => setWarehouse(event.target.value)}><option>Todos</option><option>Principal</option><option>Mostrador</option></select></label><label>Categoría<select disabled><option>Textiles</option></select></label><label>Marca<select disabled><option>Textil Demo</option></select></label></div>
    <div data-guide-target="record-list"><ReferenceTable headers={["Código", "Producto", "Características", "Precio público", "Físico", "Reservado", "Disponible", "Ubicación"]} rows={visible} /></div>
    <div className="desktop-total"><span>{visible.length} artículos ficticios · Actualizado: sesión de ejemplo</span><PreviewButton>Compartir resultados</PreviewButton><PreviewButton onClick={() => { setQuery(""); setWarehouse("Todos"); }}>Limpiar</PreviewButton></div><ReferenceNote />
  </DemoPage></div>;
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
      <p>El costo adicional se aplica al lote completo. El precio sugerido usa margen sobre venta y se redondea al entero superior.</p>
      <button className="real-primary-button" type="submit">Calcular ejemplo</button>{error && <p role="alert">{error}</p>}
    </form><section className="detail-pane" data-guide-target="record-detail">{result ? <><h3>Resultado del escenario</h3><Metrics items={[["Costo unitario", demoMoney(result.unitCost)], ["Precio sugerido", demoMoney(result.suggested)], ["Venta del lote", demoMoney(result.revenue)], ["Utilidad", demoMoney(result.profit)]]} /><h4>Desglose del costo</h4><Facts items={[["Materiales", demoMoney(result.materials)], ["Mano de obra", demoMoney(result.labor)], ["Máquina", demoMoney(result.machine)], ["Gastos indirectos", demoMoney(result.overhead)], ["Adicional", demoMoney(Number(additional))], ["Costo total", demoMoney(result.totalCost)], ["Margen sobre venta", `${result.margin.toFixed(1)} %`]]} /></> : <><h3>Prepara un escenario</h3><p>Indica cantidad, margen o precio manual y pulsa Calcular ejemplo.</p></>}
      <p className="faithful-list-note">Tarifas sintéticas: material C$ 110, mano de obra C$ 20 y máquina C$ 5 por unidad; indirectos C$ 60 por lote. Esta aritmética ilustrativa no reproduce el motor de costos comercial.</p>
    </section></div><ReferenceNote /></DemoPage>;
}

export function ProductionExample() {
  return <DemoPage title="Producción" description="Cola de trabajos, sesiones, materiales y costos reales." actions={<PreviewButton>Costos reales del período</PreviewButton>}>
    <RecordExplorer layout="workspace" renderDetail={(record) => <ProductionDetail record={record} />} filters={{ labels: ["Activos", "Por hacer", "En proceso", "Pausados", "Atrasados", "Terminados", "Todos"], matches: (record, filter) => filter === "Todos" || (filter === "Activos" ? record.id !== "p2" : filter === "Terminados" ? record.id === "p2" : filter === "En proceso" ? record.id === "p1" : filter === "Pausados" ? record.id === "p3" : false) }} headers={["Pedido", "Cliente", "Acción", "Entrega", "Estado"]} detailTitle="ACCIÓN DE PRODUCCIÓN" records={[
      { id: "p1", cells: ["PED-DEMO-0201", "Café Lumbre", "Estampar", "15/09", "En proceso"], title: "Estampado frontal · 12 camisetas", facts: [["Estado", "En proceso"], ["Cantidad", "12 unidades"], ["Tiempo efectivo", "00:42"], ["Sesiones", "1 activa"], ["Materiales de la receta", "Transfer textil · Tinta de muestra"], ["Costo estimado del lote", "C$ 1,680.00"]], note: "Las sesiones y el consumo real permiten comparar costo estimado y real sin cambiar el precio pactado con el cliente." },
      { id: "p2", cells: ["PED-DEMO-0199", "Estudio Prisma", "Acabado", "11/09", "Finalizada"], title: "Acabado · 20 agendas", facts: [["Estado", "Finalizada"], ["Cantidad", "20 unidades"], ["Tiempo efectivo", "01:10"], ["Costo estimado", "C$ 1,420.00"], ["Costo real ilustrativo", "C$ 1,480.00"], ["Variación", "C$ 60.00 desfavorable"]] },
      { id: "p3", cells: ["PED-DEMO-0192", "Taller Horizonte", "Bordar", "16/09", "Pausada"], title: "Bordado · 10 uniformes", facts: [["Estado", "Pausada"], ["Cantidad", "10 unidades"], ["Tiempo efectivo", "00:25"], ["Artículo del cliente", "Sí · REC-DEMO-0085"], ["Incidencia relacionada", "INC-DEMO-0018"]] },
    ]} />
    <details className="faithful-disclosure"><summary>Costos reales del período</summary><p>Consulta el costo estimado, el costo registrado y su variación para revisar el resultado del trabajo. Esta vista utiliza importes ficticios.</p></details>
  <ReferenceNote /></DemoPage>;
}

export function InventoryExample() {
  const [tab, setTab] = useState("Existencias");
  const stock = tab === "Existencias";
  return <DemoPage title="Inventario" description="Existencias por almacén, reservas, kardex y consumo interno."><DemoTabs labels={["Existencias", "Kardex"]} active={tab} onChange={setTab} />
    <RecordExplorer layout="directory" renderDetail={(record) => <InventoryDetail record={record} />} filters={stock ? { labels: ["Todos", "Pendientes de conteo", "Inicializados", "Con existencia", "Sin existencia", "Existencia negativa"], matches: (_, filter) => ["Todos", "Inicializados", "Con existencia"].includes(filter) } : undefined} listControls={stock ? <ReferenceActions labels={["Recibir mercancía", "Contar / corregir existencias"]} /> : undefined} key={tab} headers={stock ? ["Código", "Artículo", "Almacén", "Existencia", "Reservado", "Disponible", "Conteo", "Costo prom."] : ["Movimiento", "Concepto", "Entrada", "Salida", "Saldo"]} detailTitle={stock ? "ARTÍCULO Y ALMACÉN" : "MOVIMIENTO SELECCIONADO"} records={stock ? [
      { id: "s1", cells: ["PRO-DEMO-027-S", "Camiseta blanca · S", "Principal", "36", "12", "24", "Inicializado", "C$ 110.00"], title: "Camiseta blanca · Talla S", facts: [["Almacén", "Principal"], ["Físico", "36 unidades"], ["Reservado", "12 unidades"], ["Disponible", "24 unidades"], ["Costo promedio", "C$ 110.00"], ["Punto de reposición", "10 unidades"]] },
      { id: "s2", cells: ["INS-DEMO-014", "Tinta textil negra", "Taller", "18.5", "1.2", "17.3", "Inicializado", "C$ 180.00"], title: "Tinta textil negra", facts: [["Unidad", "kg"], ["Almacén", "Taller"], ["Físico", "18.5 kg"], ["Reservado", "1.2 kg"], ["Disponible", "17.3 kg"], ["Consumo interno", "Permitido · Insumo no vendible"]] },
    ] : [
      { id: "k1", cells: ["MOV-DEMO-0411", "Recepción de compra", "24", "0", "48"], title: "Entrada de camisetas", facts: [["Origen", "COM-DEMO-0028"], ["Tipo", "Recepción de compra"], ["Almacén", "Principal"], ["Cantidad", "24 unidades"], ["Costo unitario", "C$ 110.00"]] },
      { id: "k2", cells: ["MOV-DEMO-0412", "Entrega a cliente", "0", "12", "36"], title: "Salida por entrega", facts: [["Pedido", "PED-DEMO-0184"], ["Comprobante", "ENT-DEMO-0084"], ["Almacén", "Principal"], ["Cantidad", "12 unidades"]] },
      { id: "k3", cells: ["CON-DEMO-0015", "Tinta para limpieza", "0", "0.1 kg", "18.5 kg"], title: "Consumo interno valorizado", facts: [["Concepto", "Tinta textil negra"], ["Motivo", "Limpieza de equipo"], ["Cantidad", "0.1 kg"], ["Valor ilustrativo", "C$ 18.00"]], note: "Este movimiento documenta un uso interno; no se registra como venta ni como ajuste de conteo." },
    ]} />
  <ReferenceNote /></DemoPage>;
}

export function CustomersExample() {
  return <DemoPage title="Clientes" description="Ficha comercial, destinos, listas de precios y crédito." actions={<PreviewButton>Nuevo cliente</PreviewButton>}>
    <RecordExplorer layout="directory" renderDetail={(record) => <CustomerDetail record={record} />} listControls={<ReferenceActions labels={["Exportar", "Reporte"]} />} headers={["Código", "Nombre", "Nombre comercial", "Tipo", "RUC / identificación", "Teléfono", "Correo", "Contacto", "Lista", "Consultas", "Compras", "Activo"]} detailTitle="FICHA DEL CLIENTE" records={[
      { id: "cl1", cells: ["CLI-DEMO-021", "Café Lumbre", "Café Lumbre", "Empresa", "DEMO-021", "—", "hola@cafelumbre.example", "Contacto de muestra", "Público", "3", "C$ 3,000.00", "Sí"], title: "Café Lumbre", facts: [["Contacto", "Contacto de muestra"], ["Correo", "hola@cafelumbre.example"], ["Lista de precios", "Público"], ["Crédito", "No habilitado"], ["Destino predeterminado", "Distrito Creativo · Entrega local"], ["Otros destinos", "Retiro por el cliente"]] },
      { id: "cl2", cells: ["CLI-DEMO-018", "Norte Creativo", "Norte Creativo", "Empresa", "DEMO-018", "—", "compras@norte.example", "Contacto Demo", "Mayoreo", "2", "C$ 4,350.00", "Sí"], title: "Norte Creativo", facts: [["Contacto", "Contacto Demo"], ["Correo", "compras@norte.example"], ["Lista de precios", "Mayoreo"], ["Crédito", "30 días · Límite C$ 10,000.00"], ["Destino", "Zona de Muestra · Envío nacional"], ["Precios por cliente", "Condiciones específicas del catálogo"]] },
    ]} />
  <ReferenceNote /></DemoPage>;
}
