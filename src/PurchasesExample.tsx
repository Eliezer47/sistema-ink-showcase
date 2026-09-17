import { DemoPage, Metrics, RecordExplorer } from "./DemoPrimitives";
import { ReferenceActions, ReferenceHeading, ReferenceNote, ReferenceTable } from "./DesktopPrimitives";

export function PurchasesExample() {
  return <DemoPage title="Compras" description="Facturas, abastecimiento y recepciones de mercancía." actions={<ReferenceActions labels={["Reporte de compras", "Plantilla", "Importar líneas", "Nueva compra"]} />}>
    <Metrics items={[["Compras abiertas", "2"], ["Atrasadas", "1"], ["Valor por recibir", "NIO 8,400.00"], ["Control documental", "2 facturas registradas"]]} />
    <RecordExplorer layout="workspace" headers={["Compra", "Proveedor", "Esperada", "Progreso", "Total"]} detailTitle="COMPRA SELECCIONADA"
      filters={{ labels: ["Pendientes", "Recibidas", "Canceladas", "Todas"], matches: (_, filter) => filter === "Pendientes" || filter === "Todas" }} records={[
        { id: "purchase1", cells: ["COM-DEMO-0028", "Textiles Centro", "15/09/2026", "60 %", "NIO 12,000.00"], title: "Compra de camisetas", facts: [] },
        { id: "purchase2", cells: ["COM-DEMO-0025", "Suministros Pacífico", "10/09/2026", "50 %", "NIO 7,200.00"], title: "Insumos para impresión", facts: [] },
      ]} renderDetail={record => {
        const first = record.id === "purchase1";
        return <>
          <ReferenceHeading title={record.cells[0]} subtitle={`${record.cells[1]} · Recepción parcial`}><ReferenceActions labels={["Ver factura"]} /></ReferenceHeading>
          <Metrics items={[["Total de compra", record.cells[4]], ["Recepción / por recibir", first ? "60 % / NIO 4,800.00" : "50 % / NIO 3,600.00"], ["Cuenta por pagar", first ? "NIO 8,000.00" : "NIO 7,200.00"]]} />
          <ReferenceActions labels={["Abrir CxP", "Verificar recepción"]} />
          <ReferenceTable title="Conceptos, cantidades y costo puesto" headers={["Concepto", "Present.", "Aceptado", "Rechazado", "Pendiente", "Costo puesto NIO", "Valor pendiente"]} rows={first ? [["Camiseta de muestra", "Unidad", "60", "0", "40", "120.00", "4,800.00"]] : [["Tinta de muestra", "kg", "20", "0", "20", "180.00", "3,600.00"]]} />
          <div className="desktop-context"><small>RECEPCIÓN</small><strong>{first ? "40 unidades pendientes" : "20 kg pendientes"}</strong><span>Inspecciona la mercancía antes de confirmar las cantidades aceptadas.</span></div>
          <ReferenceActions labels={["Inspeccionar y recibir mercancía", "Confirmar recepción"]} />
          <ReferenceTable title="Recepciones" headers={["Recepción", "Fecha", "Almacén", "Estado"]} rows={[[first ? "REC-DEMO-0028" : "REC-DEMO-0025", "10/09/2026", first ? "Principal" : "Taller", "Confirmada"]]} />
          <ReferenceActions labels={["Revertir recepción seleccionada"]} />
        </>;
      }} />
    <ReferenceNote />
  </DemoPage>;
}
