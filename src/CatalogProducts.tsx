import { useState } from "react";
import { DemoTabs, PreviewButton } from "./DemoPrimitives";
import { ReferenceActions, ReferenceField, ReferenceHeading, ReferenceTable } from "./DesktopPrimitives";
import { CatalogProductExtras } from "./StationExamples";

const products = [
  { code: "PRO-DEMO-032", name: "Taza personalizada 11 oz", type: "Producto", unit: "Unidad", category: "Promocionales", cost: "78.00", price: "145.00", stock: true },
  { code: "SER-DEMO-014", name: "Diseño para impresión", type: "Servicio", unit: "Servicio", category: "Diseño y preparación", cost: "120.00", price: "240.00", stock: false },
  { code: "PRO-DEMO-027", name: "Camiseta promocional", type: "Producto", unit: "Unidad", category: "Textiles", cost: "110.00", price: "250.00", stock: true },
];

export default function CatalogProducts() {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Activos");
  const [type, setType] = useState("Todos");
  const product = products.find(item => item.code === selected);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  const visible = products.filter(item => status !== "Inactivos" && (type === "Todos" || type === item.type) && normalize(`${item.code} ${item.name}`).includes(normalize(query)));
  if (product) return <section className="desktop-catalog-detail" data-guide-target="record-detail">
    <PreviewButton onClick={() => setSelected(null)}>← Volver a productos</PreviewButton>
    <ReferenceHeading title="Ficha del concepto" subtitle={`${product.code} · ${product.name}`}><ReferenceActions labels={["Historial", "Retirar", "Editar"]} primary="Editar" /></ReferenceHeading>
    <div className="desktop-catalog-columns"><section><h3>Descripción</h3><div className="desktop-field-grid"><ReferenceField label="Nombre" value={product.name} /><ReferenceField label="Tipo" value={product.type} /><ReferenceField label="Clasificación" value={product.category} /><ReferenceField label="Unidad" value={product.unit} /><ReferenceField label="Marca" value={product.stock ? "Marca de muestra" : "—"} /><ReferenceField label="Proveedor preferido" value={product.stock ? "Suministros Demo" : "—"} /></div>
      <h3>Características</h3><div className="desktop-catalog-flags">{[["Disponible para venta directa", true], ["Controla inventario", product.stock], ["Admite personalización", product.stock], ["Requiere producción", true], ["Artículo del cliente", false]].map(([label, enabled]) => <label key={String(label)} className="desktop-check"><input type="checkbox" disabled checked={Boolean(enabled)} />{label}</label>)}</div>
    </section><section><h3>Precios</h3><div className="desktop-field-grid"><ReferenceField label="Costo estimado NIO" value={product.cost} /><ReferenceField label="Público NIO" value={product.price} /></div>
      <ReferenceActions labels={product.code === "PRO-DEMO-032" ? ["Códigos de barras"] : ["Códigos de barras", "Promociones y precios por cliente"]} />
      <ReferenceTable title="Presentaciones de compra" headers={["Presentación", "Factor", "Pred."]} rows={product.stock ? [["Caja de muestra", "12", "Sí"], ["Unidad", "1", "No"]] : []} />
      <ReferenceActions labels={["Editar seleccionada", "Nueva presentación"]} />
    </section></div>{product.code === "PRO-DEMO-032" && <CatalogProductExtras />}
  </section>;
  return <section className="desktop-catalog-list">
    <div className="desktop-subheading"><span>Precios expresados en NIO</span><ReferenceActions labels={["Descargar plantilla ▾", "Importar archivo", "Exportar selección", "Nuevo producto o servicio"]} primary="Nuevo producto o servicio" /></div>
    <label className="faithful-search" data-guide-target="module-filter"><span>Buscar código o nombre</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="desktop-catalog-filters"><DemoTabs labels={["Activos", "Inactivos", "Todos"]} active={status} onChange={setStatus} /><label>Tipo<select value={type} onChange={event => setType(event.target.value)}><option>Todos</option><option>Producto</option><option>Servicio</option><option>Cargo</option></select></label></div>
    <div data-guide-target="record-list"><ReferenceTable headers={["Código", "Nombre", "Marca", "Tipo", "Vendible", "Unidad", "Activo", "Abrir"]} rows={visible.map(item => [item.code, item.name, item.stock ? "Marca Demo" : "—", item.type, "Sí", item.unit, "Sí", <PreviewButton onClick={() => setSelected(item.code)}>Abrir {item.code}</PreviewButton>])} /></div>
    <div className="explorer-pagination"><span>{visible.length} conceptos ficticios</span><span>Página {visible.length ? "1 de 1" : "0 de 0"}</span></div>
  </section>;
}
