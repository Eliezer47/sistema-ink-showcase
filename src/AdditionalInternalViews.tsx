import { useState } from "react";
import { DemoPage, DemoTabs, Facts, PreviewButton, RecordExplorer, type ExampleRecord } from "./DemoPrimitives";

export type ExtraCatalogId = "atributos" | "familias" | "acciones" | "personalizacion";
export type ExtraAdministrationId = "cajas" | "auditoria" | "diseno" | "inicio";
type Definition = { title: string; description: string; headers: string[]; records: ExampleRecord[]; action: string };

const screens: Record<ExtraCatalogId | "cajas" | "auditoria", Definition> = {
  atributos: { title: "Atributos del catálogo", description: "Definiciones reutilizables para productos y varias categorías.", headers: ["Código", "Nombre", "Tipo", "Filtro"], action: "Guardar atributo", records: [
    { id: "attr1", cells: ["ATR-DEMO-01", "Talla", "Opciones", "Sí"], title: "Talla", facts: [["Tipo", "Opciones"], ["Valores", "S · M · L · XL"], ["Categorías relacionadas", "Textiles · Uniformes"], ["Obligatorio", "Sí"], ["Disponible como filtro", "Sí"], ["Permite varias opciones", "No"]] },
    { id: "attr2", cells: ["ATR-DEMO-02", "Color", "Opciones", "Sí"], title: "Color", facts: [["Tipo", "Opciones"], ["Valores", "Blanco · Negro · Azul"], ["Categorías", "Textiles · Promocionales"], ["Disponible como filtro", "Sí"]] },
  ] },
  familias: { title: "Familias y variantes", description: "Agrupa artículos que comparten producto, marca y atributos; cada variante conserva su código y existencia.", headers: ["Familia", "Producto", "Marca", "Variantes"], action: "Generar variantes", records: [
    { id: "fam", cells: ["FAM-DEMO-04", "Camiseta de algodón", "Textil Demo", "8"], title: "Camiseta de algodón", facts: [["Tallas", "S · M · L · XL"], ["Colores", "Blanco · Negro"], ["Combinaciones", "4 tallas × 2 colores = 8 variantes"], ["Ejemplo", "PRO-DEMO-027-S · Blanco / S"], ["Inventario", "Independiente por variante"], ["Precio público de ejemplo", "C$ 140.00"]] },
  ] },
  acciones: { title: "Acciones operativas", description: "Verbos que describen el trabajo a realizar en producción.", headers: ["Código", "Nombre", "Orden", "Estado"], action: "Guardar acción", records: [
    { id: "act1", cells: ["ACC-DEMO-01", "Estampar", "1", "Activa"], title: "Estampar", facts: [["Nombre", "Estampar"], ["Descripción", "Aplicación del diseño sobre la prenda"], ["Orden", "1"], ["Uso", "Trabajo de producción vinculado al concepto"]] },
    { id: "act2", cells: ["ACC-DEMO-02", "Sublimar", "2", "Activa"], title: "Sublimar", facts: [["Nombre", "Sublimar"], ["Descripción", "Transferencia del diseño por calor"], ["Orden", "2"], ["Uso", "Tazas y artículos compatibles"]] },
  ] },
  personalizacion: { title: "Perfiles de personalización", description: "Técnicas, dimensiones y opciones que acompañan al concepto vendido.", headers: ["Perfil", "Nombre", "Acción", "Estado"], action: "Guardar perfil", records: [
    { id: "custom1", cells: ["PER-DEMO-01", "Estampado textil", "Estampar", "Activo"], title: "Estampado textil", facts: [["Ubicación", "Frente · Espalda · Manga"], ["Datos", "Ancho · Alto · Cantidad"], ["Técnica", "DTF de ejemplo"], ["Referencia", "Diseño del cliente · Sin archivo real"], ["Combinación", "Más de una técnica por concepto"]], note: "Las especificaciones viajan con la línea del pedido hacia producción. El costo depende del perfil y su receta." },
  ] },
  cajas: { title: "Cajas físicas", description: "Cada punto de cobro mantiene su apertura, movimientos y cierre.", headers: ["Caja", "Nombre", "Estado", "Asignación"], action: "Guardar caja", records: [
    { id: "register1", cells: ["CAJA-DEMO-01", "Mostrador", "Activa", "Estación principal"], title: "Mostrador DEMO", facts: [["Código", "CAJA-DEMO-01"], ["Nombre", "Mostrador"], ["Responsable", "Usuario de demostración"], ["Estado", "Abierta · 11/09/2026"], ["Fondo", "C$ 2,000.00"]], note: "El selector de caja de la barra superior define el punto donde se registran las operaciones autorizadas." },
    { id: "register2", cells: ["CAJA-DEMO-02", "Taller", "Activa", "Segunda estación"], title: "Taller DEMO", facts: [["Código", "CAJA-DEMO-02"], ["Nombre", "Taller"], ["Estado", "Cerrada"], ["Último cierre", "10/09/2026"]] },
  ] },
  auditoria: { title: "Auditoría", description: "Consulta quién cambió un registro, cuándo y desde qué estación.", headers: ["Evento", "Fecha", "Área", "Acción"], action: "Exportar consulta", records: [
    { id: "audit1", cells: ["AUD-DEMO-0140", "11/09 · 09:15", "Clientes", "Actualización"], title: "Actualización de ficha", facts: [["Registro", "CLI-DEMO-021"], ["Usuario", "operador.demo"], ["Equipo", "ESTACION-DEMO-01"], ["Campo", "Lista de precios"], ["Antes", "Público"], ["Después", "Mayoreo"]] },
    { id: "audit2", cells: ["AUD-DEMO-0141", "11/09 · 09:22", "Caja", "Cobro"], title: "Abono registrado", facts: [["Pedido", "PED-DEMO-0201"], ["Usuario", "caja.demo"], ["Equipo", "ESTACION-DEMO-01"], ["Importe", "C$ 600.00"], ["Recibo", "REC-DEMO-0201"]] },
  ] },
};

export default function AdditionalInternalViews({ view }: { view: ExtraCatalogId | ExtraAdministrationId }) {
  if (view === "diseno") return <DesignExample />;
  if (view === "inicio") return <SetupExample />;
  const definition = screens[view];
  return <DemoPage title={definition.title} description={definition.description}><RecordExplorer key={view} headers={definition.headers} records={definition.records} detailTitle="DETALLE SELECCIONADO" actions={<PreviewButton>{definition.action}</PreviewButton>} /></DemoPage>;
}

function DesignExample() {
  return <DemoPage title="Diseño y navegación" description="Escala de la interfaz, pantalla inicial y orden de los accesos por estación."><div className="settings-card-grid">
    <section className="internal-card"><h3>Escala de interfaz</h3><Facts items={[["Escala", "Normal · 100 %"], ["Alternativas", "Compacto · Grande · Muy grande"], ["Preferencia", "Local a esta estación"]]} /><PreviewButton>Vista previa de escala</PreviewButton></section>
    <section className="internal-card" data-guide-target="record-detail"><h3>Organizar navegación</h3><Facts items={[["Pantalla de inicio", "Panel principal"], ["Menú principal", "Panel · Clientes · Disponibilidad · Métricas · Ventas · Caja · Producción · Entregas"], ["Más opciones", "Cotizaciones · Finanzas · Compras · Inventario · Catálogo · Administración"], ["Accesos opcionales mostrados en esta demo", "Calculadora de costos · Artículos del cliente · Calidad"]]} /><PreviewButton>Restablecer distribución</PreviewButton></section>
  </div><p>La navegación del producto se adapta a preferencias, permisos y capacidades habilitadas. Esta demo muestra un perfil amplio para explorar las funciones.</p></DemoPage>;
}

function SetupExample() {
  const [step, setStep] = useState("Datos iniciales");
  return <DemoPage title="Puesta en marcha" description="Carga inicial guiada con revisión antes de confirmar."><DemoTabs labels={["Datos iniciales", "Revisión", "Confirmación"]} active={step} onChange={setStep} />
    {step === "Datos iniciales" ? <section className="internal-card" data-guide-target="record-list"><h3>Preparar el negocio</h3><ol className="setup-checklist"><li>Empresa, moneda y usuarios.</li><li>Catálogo, variantes, precios y clientes.</li><li>Almacenes e inventario inicial.</li><li>Saldos históricos de clientes y proveedores.</li></ol><p>El producto admite plantillas y revisión de importación. Aquí se muestra un lote sintético sin cargar archivos.</p><PreviewButton onClick={() => setStep("Revisión")}>Revisar lote de ejemplo</PreviewButton></section> : step === "Revisión" ? <section className="internal-card" data-guide-target="record-list"><h3>Revisión del lote DEMO</h3><Facts items={[["Filas recibidas", "8"], ["Listas para importar", "7"], ["Por corregir", "1 · Falta unidad de medida"], ["Acción", "Corregir la fila antes de confirmar"]]} /><p role="status">La fila incompleta impide presentar el lote como listo.</p></section> : <section className="internal-card" data-guide-target="record-detail"><h3>Confirmar después de revisar</h3><p>El sistema presenta el resultado de la revisión antes de registrar. No se importan archivos ni se crean registros desde esta demo.</p><PreviewButton>Confirmar importación</PreviewButton></section>}
  </DemoPage>;
}
