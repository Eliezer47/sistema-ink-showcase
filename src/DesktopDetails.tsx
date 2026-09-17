import { useState } from "react";
import { DemoTabs, Facts, Metrics, PreviewButton, type ExampleRecord } from "./DemoPrimitives";
import { ReferenceActions, ReferenceField, ReferenceHeading, ReferenceTable } from "./DesktopPrimitives";

const fact = (record: ExampleRecord, label: string, fallback = "—") => record.facts.find(([key]) => key === label)?.[1] ?? fallback;

export function ProductionDetail({ record }: { record: ExampleRecord }) {
  const finished = record.id === "p2";
  const embroidery = record.id === "p3";
  return <>
    <ReferenceHeading title={record.cells[0]} subtitle={`${record.cells[1]} · ${record.title}`} />
    <ReferenceActions labels={["Cancelar concepto", "Retirar de producción", "Iniciar", "Pausar", "Finalizar"]} primary="Finalizar" />
    <div className="desktop-context"><small>ACCIÓN DE PRODUCCIÓN</small><strong>{record.cells[2]} · {fact(record, "Estado")}</strong></div>
    <Metrics items={[["Cantidad", fact(record, "Cantidad")], ["Tiempo efectivo", fact(record, "Tiempo efectivo")], ["Entrega prometida", record.cells[3] + "/2026"]]} />
    <ReferenceTable title="Materiales de la receta" headers={["Material", "Previsto", "Real", "Dif.", "Disponible", "Costo real"]} rows={finished ? [["Cartón para cubierta", "20 un", "20 un", "0", "80 un", "NIO 440.00"], ["Lámina de acabado", "20 un", "22 un", "+2", "46 un", "NIO 264.00"]] : embroidery ? [["Hilo de muestra", "0.2 kg", "0.1 kg", "−0.1", "2 kg", "NIO 40.00"]] : [["Transfer textil", "1.2 m", "1.2 m", "0", "24 m", "NIO 336.00"], ["Tinta de muestra", "0.12 kg", "0.10 kg", "−0.02", "17.3 kg", "NIO 18.00"]]} />
    <ReferenceActions labels={["Consumir más", "Devolver", "Registrar ajuste"]} />
    <ReferenceTable title="Sesiones registradas" headers={["Usuario", "Inicio", "Fin", "Tiempo"]} rows={[["Ana Demo", "11/09 · 09:00", finished ? "11/09 · 10:10" : embroidery ? "11/09 · 09:25" : "En curso", fact(record, "Tiempo efectivo")]]} />
  </>;
}

export function DeliveryDetail({ record }: { record: ExampleRecord }) {
  if (record.id === "s1") return <>
    <ReferenceHeading title="DES-DEMO-0031" subtitle="Envío local agrupado" />
    <div className="desktop-field-grid"><ReferenceField label="Transportista" value="Mensajería Demo" /><ReferenceField label="Proveedor para CxP" value="Logística de Muestra" /><ReferenceField label="Destino o terminal" value="Distrito Creativo" /><ReferenceField label="Costo real" value="NIO 180.00" /></div>
    <ReferenceTable title="Pedidos incluidos" headers={["Pedido", "Cliente", "Destino", "Cobrado"]} rows={[["PED-DEMO-0201", "Café Lumbre", "Distrito Creativo", "NIO 120.00"], ["PED-DEMO-0199", "Estudio Prisma", "Distrito Creativo", "NIO 120.00"]]} />
    <ReferenceActions labels={["Registrar despacho", "Abrir obligación en CxP"]} />
    <ReferenceTable title="Despachos recientes" headers={["Número", "Transportista", "Resultado", "Pago"]} rows={[[record.cells[0], record.cells[1], "Registrado", "Pendiente"]]} />
  </>;
  const partial = record.id === "d1";
  return <>
    <ReferenceHeading title={record.cells[0]} subtitle={`${record.cells[1]} · ${record.cells[2]}`} />
    <ReferenceTable title="Cantidades del pedido" headers={["Descripción", "Acción", "Entregado", "Pendiente", "Entregar"]} rows={[[partial ? "Agenda personalizada" : "Camiseta con estampado", partial ? "Finalizada" : "En proceso", partial ? "12" : "0", partial ? "8" : "12", "0"]]} />
    <div className="desktop-field-grid"><ReferenceField label="Recibe *" value="Contacto Demo" /><ReferenceField label="Fecha efectiva *" value="11/09/2026" /><ReferenceField label="Observaciones" value={partial ? "Retiro parcial en mostrador" : "Pendiente de terminar producción"} /><ReferenceField label="Motivo si fecha anterior" value="—" /></div>
    <ReferenceActions labels={["Completar pendientes", "Registrar entrega", "Revertir seleccionada"]} primary="Registrar entrega" />
    <ReferenceTable title="Historial de entregas" headers={["Comprobante", "Fecha", "Recibió", "Estado"]} rows={partial ? [["ENT-DEMO-0086", "11/09/2026", "Contacto Demo", "Vigente · 12 unidades"]] : []} />
  </>;
}

export function CashDetail({ record }: { record: ExampleRecord }) {
  const [method, setMethod] = useState("Efectivo");
  const history = record.id === "pending" || record.id === "mov";
  const pending = record.id === "pending" || record.id === "cash2";
  const paid = record.id === "paid";
  const balance = paid ? "C$ 0.00" : fact(record, "Saldo propuesto", fact(record, "Saldo", "C$ 0.00"));
  return <>
    <ReferenceHeading title={history ? record.cells[0] : `${record.cells[0]} · ${record.cells[1]}`} subtitle={history || paid ? record.title : "Cobro del pedido"} />
    {history ? <><ReferenceActions labels={["Ver detalle", "Imprimir recibo", "Revertir recibo", "Adjuntar comprobante", "Rechazar", "Verificar"]} /><div className={`desktop-context ${pending ? "warning" : ""}`}><strong>{pending ? "Transferencia pendiente de verificación" : "Recibo aplicado"}</strong><span>{pending ? "Aún no reduce el saldo del pedido." : "Efectivo · Abono de Café Lumbre"}</span></div><Facts items={record.facts} /></> : <>
      <Metrics items={[["Total del pedido", record.cells[2]], ["Pagado", fact(record, "Pagado")], ["Saldo", balance]]} />
      {paid && <div className="desktop-context"><strong>Entrega física pendiente</strong><span>Entregado: {fact(record, "Entregado")} · Pendiente: {fact(record, "Pendiente de entregar")}.</span></div>}
      {pending && <div className="desktop-context warning"><strong>Por verificar · C$ 1,200.00</strong><span>La transferencia pendiente todavía no se considera dinero aplicado.</span></div>}
      <h4>Agregar forma de pago</h4><DemoTabs labels={["Efectivo", "Transferencia", "Saldo a favor"]} active={method} onChange={setMethod} />
      <div className="desktop-field-grid"><ReferenceField label="Importe" value={balance} /><ReferenceField label={method === "Efectivo" ? "Moneda" : method === "Transferencia" ? "Cuenta de destino" : "Saldo disponible"} value={method === "Efectivo" ? "NIO · Córdoba" : method === "Transferencia" ? "Banco de muestra · NIO" : "C$ 0.00"} />{method === "Transferencia" && <ReferenceField label="Referencia o comprobante" value="Transferencia de ejemplo" />}</div>
      <ReferenceActions labels={["Agregar forma de pago", "Cobrar saldo completo"]} />
      <ReferenceTable title="Formas de pago del recibo" headers={["Método", "Moneda", "Importe", "Estado"]} rows={[]} />
      <div className="desktop-total"><span>Total a aplicar</span><strong>C$ 0.00</strong><PreviewButton>Registrar cobro</PreviewButton></div>
      <ReferenceTable title="Pagos y verificaciones" headers={["Recibo", "Método", "Importe", "Estado"]} rows={paid ? [["REC-DEMO-0199", "Efectivo", "C$ 4,600.00", "Aplicado"]] : pending ? [["MOV-DEMO-0202", "Transferencia", "C$ 1,200.00", "Sin verificar"]] : [["REC-DEMO-0201", "Efectivo", "C$ 600.00", "Aplicado"]]} />
    </>}
  </>;
}

export function QuoteDetail({ record }: { record: ExampleRecord }) {
  const first = record.id === "a";
  return <>
    <ReferenceHeading title={record.cells[0]} subtitle={`Versión ${first ? "1" : "2"} · ${record.cells[2]}`}><ReferenceActions labels={["Aprobar", "Guardar borrador"]} /></ReferenceHeading>
    <div className="desktop-field-grid"><ReferenceField label="Cliente *" value={record.cells[1]} /><ReferenceField label="Moneda" value="NIO" /><ReferenceField label="Válida hasta" value={fact(record, "Válida hasta")} /><ReferenceField label="Entrega prometida" value={fact(record, "Entrega prometida")} /></div>
    <label className="desktop-check"><input type="checkbox" disabled /> Cliente aplicará retención de IR</label>
    <ReferenceActions labels={["Nuevo producto", "Agregar concepto"]} />
    <ReferenceTable title="Conceptos de la cotización" headers={["Descripción", "Personalización", "Cant.", "Unidad", "Precio", "Desc.%"]} rows={[[first ? "Camiseta blanca" : "Taza blanca", first ? "Estampado frontal" : "Diseño a color", first ? "12" : "30", "un", first ? "250.00" : "145.00", "0"]]} />
    <ReferenceActions labels={["Quitar línea seleccionada"]} /><ReferenceField label="Notas" value="Preparar muestra de diseño antes de producir." />
    <div className="desktop-total"><span>Total</span><strong>{record.cells[3]}</strong></div>
  </>;
}

export function CustomerItemDetail({ record }: { record: ExampleRecord }) {
  const first = record.id === "c1";
  return <>
    <ReferenceHeading title={record.cells[0]} subtitle={`${record.cells[1]} · ${record.cells[2]}`} />
    <ReferenceActions labels={["Adjuntar evidencia", "Ver evidencia", "Anular"]} />
    <Metrics items={[["Recepción", fact(record, "En recepción")], ["Producción", fact(record, "En producción")], ["Pendiente devolver", `${record.cells[3]} unidades`]]} />
    <ReferenceTable title="Conceptos recibidos" headers={["Concepto", "Recibido", "Recepción", "Producción", "Devuelto"]} rows={[[first ? "Delantal de algodón" : "Uniforme para bordado", first ? "12" : "10", first ? "4" : "0", first ? "8" : "6", first ? "0" : "4"]]} />
    <h4>Registrar movimiento</h4><ReferenceActions labels={["Enviar a producción", "Regresar de producción", "Devolver al cliente", "Registrar daño", "Registrar pérdida"]} />
    <ReferenceTable title="Historial de movimientos" headers={["Fecha", "Movimiento", "Cantidad", "Responsable"]} rows={[["10/09/2026", "Recepción", first ? "12" : "10", "Marina Demo"], ["11/09/2026", first ? "A producción" : "Devolución al cliente", first ? "8" : "4", "Ana Demo"]]} />
  </>;
}

export function QualityDetail({ record }: { record: ExampleRecord }) {
  return <>
    <ReferenceHeading title={record.cells[0]} subtitle={`${record.cells[1]} · ${record.cells[4]}`} />
    <ReferenceActions labels={["Adjuntar evidencia", "Ver evidencia", "Anular"]} />
    <Metrics items={[["Etapa", fact(record, "Etapa")], ["Responsable", fact(record, "Responsabilidad")], ["Resolución", fact(record, "Resolución")]]} />
    <div className="desktop-field-grid"><ReferenceField label="Cantidad afectada" value={fact(record, "Cantidad afectada")} /><ReferenceField label="Impacto estimado" value={fact(record, "Impacto estimado")} /></div>
    <h4>Descripción</h4><div className="desktop-description">{record.title} · {record.cells[2]}. Incidencia ficticia de demostración.</div>
    {record.id === "q1" && <div className="desktop-context"><small>TRABAJO DE REPOSICIÓN</small><strong>PROD-DEMO-0097 · Estampado de 2 unidades</strong><span>Por hacer</span></div>}
    <h4>Cerrar incidencia</h4><ReferenceActions labels={["Marcar como resuelta"]} />
  </>;
}

export function InventoryDetail({ record }: { record: ExampleRecord }) {
  const stock = record.id.startsWith("s");
  if (!stock) return <><ReferenceHeading title={record.cells[0]} subtitle={record.title} /><Facts items={record.facts} /></>;
  const shirt = record.id === "s1";
  return <>
    <ReferenceHeading title={record.title} subtitle={fact(record, "Almacén")} /><ReferenceActions labels={["Registrar entrada", "Contar / corregir existencias"]} />
    <Metrics items={[["Existencia", fact(record, "Físico")], ["Reservado", fact(record, "Reservado")], ["Disponible", fact(record, "Disponible")]]} />
    <div className="desktop-field-grid"><ReferenceField label="Costo prom." value={shirt ? "NIO 110.00" : "NIO 180.00 / kg"} /><ReferenceField label="Valor" value={shirt ? "NIO 3,960.00" : "NIO 3,330.00"} /></div>
    <ReferenceTable title="Historial de conteos" headers={["Fecha", "Conteo", "Diferencia", "Estado"]} rows={[["10/09/2026", shirt ? "36" : "18.5 kg", "0", "Confirmado"]]} />
    <ReferenceTable title="Kardex" headers={["Movimiento", "Referencia", "Entrada", "Salida", "Motivo"]} rows={shirt ? [["Recepción", "COM-DEMO-0028", "24", "0", "Compra"], ["Entrega", "ENT-DEMO-0084", "0", "12", "Entrega al cliente"]] : [["Consumo interno", "CON-DEMO-0015", "0", "0.1 kg", "Limpieza de equipo"]]} />
    <details className="faithful-disclosure"><summary>Más movimientos: consumo, traslado y ajuste excepcional</summary><ReferenceActions labels={["Transferir entre almacenes", "Consumir internamente", "Ajuste excepcional"]} /></details>
  </>;
}

export function CustomerDetail({ record }: { record: ExampleRecord }) {
  return <>
    <ReferenceHeading title="Ficha del cliente" subtitle="Información comercial vigente" />
    <ReferenceActions labels={["Desactivar", "Historial", "Editar"]} />
    <div className="desktop-customer"><div className="desktop-avatar" aria-hidden="true">{record.title.split(" ").map(word => word[0]).join("")}</div><div><h3>{record.title}</h3><p>Empresa · {record.cells[0]}</p><span>✓ Cliente activo</span></div></div>
    <h4>Datos de contacto</h4><div className="desktop-field-grid"><ReferenceField label="Contacto" value={fact(record, "Contacto")} /><ReferenceField label="Correo" value={fact(record, "Correo")} /><ReferenceField label="Lista de precios" value={fact(record, "Lista de precios")} /><ReferenceField label="Crédito" value={fact(record, "Crédito")} /></div>
    <ReferenceTable title="Destinos de envío" headers={["Destino", "Modalidad", "Predeterminado"]} rows={[[fact(record, "Destino predeterminado", fact(record, "Destino")), record.id === "cl1" ? "Entrega local" : "Envío nacional", "Sí"]]} />
    <ReferenceActions labels={["Destinos de envío", "Precios por cliente", "Guardar cambios"]} />
  </>;
}

export function FinanceDetail({ record, tab }: { record: ExampleRecord; tab: string }) {
  return <>
    <ReferenceHeading title={record.title} subtitle={record.cells[0]} />
    <Facts items={record.facts} />
    {tab === "Por cobrar" && <><ReferenceActions labels={["Comprobante previo", "Corregir vencimiento", "Cobrar varios", "Abrir en Caja"]} primary="Abrir en Caja" /><ReferenceTable title="Pagos y verificaciones" headers={["Fecha", "Recibo", "Método", "Estado", "Importe"]} rows={record.id === "ar1" ? [["11/09/2026", "REC-DEMO-0201", "Efectivo", "Aplicado", "C$ 600.00"]] : [["05/09/2026", "ANT-DEMO-0012", "Antecedente", "Aplicado", "C$ 500.00"]]} /></>}
    {tab === "Por pagar" && <><h4>Registrar pago</h4><div className="desktop-field-grid"><ReferenceField label="Tipo de registro" value="Pago actual" /><ReferenceField label="Fuente del pago" value="Banco / transferencia" /><ReferenceField label="Moneda del pago" value="NIO" /><ReferenceField label="Importe" value="0.00" /></div><ReferenceActions labels={["Agregar esta fuente", "Registrar pago"]} /><ReferenceTable title="Historial de pagos" headers={["Fecha efectiva", "Pago", "Método", "Importe"]} rows={[]} /></>}
    {tab === "Planes" && <ReferenceTable title="Cuotas del plan" headers={["Período", "Vence", "Importe", "Estado"]} rows={[["Octubre", "01/10/2026", "C$ 5,000.00", "Pendiente"], ["Noviembre", "01/11/2026", "C$ 5,000.00", "Pendiente"], ["Diciembre", "01/12/2026", "C$ 5,000.00", "Pendiente"]]} />}
    {tab === "Cuentas" && <><ReferenceActions labels={["Registrar movimiento", "Transferir", "Conciliación bancaria"]} /><ReferenceTable title="Movimientos de la cuenta" headers={["Fecha", "Concepto", "Ingreso", "Egreso"]} rows={[["11/09/2026", "Cobro confirmado", "C$ 1,200.00", "—"], ["10/09/2026", "Pago a proveedor", "—", "C$ 2,400.00"]]} /></>}
    {tab === "Activos fijos" && <><ReferenceActions labels={["Registrar inversión", "Registrar depreciación", "Dar de baja"]} /><ReferenceTable title="Historial del activo" headers={["Fecha", "Movimiento", "Importe"]} rows={[["01/01/2026", "Adquisición", "C$ 18,000.00"], ["31/08/2026", "Depreciación acumulada", "C$ 2,400.00"]]} /></>}
    {tab === "Planificación" && <><div className="desktop-field-grid"><ReferenceField label="Período" value="Septiembre 2026" /><ReferenceField label="Presupuesto" value="C$ 3,000.00" /></div><ReferenceActions labels={["Guardar presupuesto"]} /></>}
    {tab === "Informes" && <ReferenceActions labels={["Vista previa del reporte"]} />}
  </>;
}
