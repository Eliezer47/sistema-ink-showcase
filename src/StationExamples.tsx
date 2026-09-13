import { useState } from "react";
import DemoDialog, { DocumentExample } from "./DemoDialog";
import { Facts, PreviewButton } from "./DemoPrimitives";

export function StationExamples() {
  const [preview, setPreview] = useState<"label" | "receipt" | null>(null);
  const [labelType, setLabelType] = useState("Envío");
  return <section className="internal-card current-printing">
    <h3>Etiquetas y comprobantes de esta estación</h3>
    <div className="printer-format-grid"><section className="printer-format-panel"><small>FORMATO ETIQUETA · PERFIL DE ESTA ESTACIÓN</small>
      <label>Perfil de etiqueta<select value={labelType} onChange={(e) => setLabelType(e.target.value)}><option>Envío</option><option>Retiro local</option></select></label>
      <Facts items={[["Impresora", labelType === "Envío" ? "Etiquetas Envío DEMO" : "Etiquetas Mostrador DEMO"], ["Papel", labelType === "Envío" ? "4 × 6 pulgadas · Horizontal" : "40 × 30 mm · Compacta"], ["Diseño", "Una etiqueta por hoja"], ["Editor", "Texto directo · Tamaño · Posición · Proporciones"]]} />
      <PreviewButton onClick={() => setPreview("label")}>Ver etiqueta de ejemplo</PreviewButton>
    </section><section className="printer-format-panel"><small>COMPROBANTES · VISTA PREVIA INTEGRADA</small><Facts items={[["Recibo", "80 mm · 58 mm disponible"], ["Impresión automática", "Preferencia local configurable"], ["Transferencias", "Solo cuando se hayan aplicado"], ["Comprobante", "El pago inicial puede generar recibo aunque sea parcial"]]} /><PreviewButton onClick={() => setPreview("receipt")}>Ver recibo de ejemplo</PreviewButton><p>El producto mantiene perfiles independientes para envío y retiro. Esta demo permite revisar el contenido, sin reproducir el controlador de impresión.</p></section></div>
    {preview && <DemoDialog title={preview === "label" ? `Vista de contenido · Etiqueta de ${labelType.toLowerCase()}` : "Vista previa de recibo de ejemplo"} onClose={() => setPreview(null)}><DocumentExample kind={preview} labelKind={labelType === "Envío" ? "shipping" : "pickup"} /></DemoDialog>}
  </section>;
}

export function CatalogProductExtras() {
  const [preview, setPreview] = useState(false);
  return <section className="internal-card current-catalog-extras"><h3>Identificadores y condiciones comerciales</h3><Facts items={[["Familia", "Tazas promocionales"], ["Marca", "Cerámica DEMO"], ["Atributos", "Color blanco · Capacidad 11 oz"], ["Identificadores", "Interno DEMO · Referencia de proveedor"], ["Costeo", "Receta por lote"], ["Venta directa", "Permitida"], ["Personalización", "Sublimado · Varias ubicaciones"]]} /><PreviewButton onClick={() => setPreview(true)}>Promociones y precios por cliente</PreviewButton>
    {preview && <DemoDialog title="Promociones y precios por cliente · Ejemplo" onClose={() => setPreview(false)}><Facts items={[["Concepto", "PRO-DEMO-032 · Taza personalizada"], ["Precio público", "C$ 145.00"], ["Vigencia de muestra", "11/09 al 18/09/2026"], ["Promoción", "Precio de ejemplo C$ 130.00"], ["Cliente", "Norte Creativo"], ["Condición específica", "C$ 125.00 · 30 unidades"]]} /><p>El producto evalúa condiciones y vigencias al calcular el precio. Estos importes solo ilustran la pantalla y no se aplican al pedido del recorrido.</p></DemoDialog>}
  </section>;
}
