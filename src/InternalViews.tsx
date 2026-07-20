import type { ReactNode } from "react";

export type AdministrationViewId = "empresa" | "usuarios" | "roles" | "equipos" | "metricas-ventas" | "estacion" | "respaldos";
export type CatalogViewId = "productos" | "categorias" | "unidades" | "recetas" | "proveedores";

type Metric = {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

function DemoButton({ children, primary = false }: { children: ReactNode; primary?: boolean }) {
  return <button className={primary ? "real-primary-button" : "real-secondary-button"} type="button" disabled>{children}</button>;
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" }) {
  return <span className={`internal-badge badge-${tone}`}>{children}</span>;
}

function Metrics({ items }: { items: Metric[] }) {
  return (
    <div className="internal-metrics">
      {items.map((item) => (
        <article className={`internal-metric metric-${item.tone ?? "neutral"}`} key={item.label}>
          <span>{item.label}</span><strong>{item.value}</strong>
        </article>
      ))}
    </div>
  );
}

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={`internal-field${wide ? " field-wide" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function Table({ headers, rows, selected }: { headers: string[]; rows: ReactNode[][]; selected?: number }) {
  return (
    <div className="internal-table-wrap" data-guide-target="record-list">
      <table className="internal-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr className={selected !== undefined && rowIndex === selected ? "selected" : ""} key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Screen({ section, title, description, action, actions, metrics, children }: { section: string; title: string; description: string; action?: string; actions?: ReactNode; metrics?: Metric[]; children: ReactNode }) {
  return (
    <div className="generic-content internal-screen" data-screen={title}>
      <header className="internal-screen-header" data-section={section} data-guide-target="module-header">
        <div><h2>{title}</h2><p>{description}</p></div>
        {actions ?? (action ? <DemoButton primary>{action}</DemoButton> : null)}
      </header>
      {metrics ? <Metrics items={metrics} /> : null}
      {children}
      <div className="internal-demo-note"><span>●</span> Vista explicativa · Controles sin conexión · Datos DEMO</div>
    </div>
  );
}

function CompanyView() {
  return (
    <Screen section="ADMINISTRACIÓN" title="Empresa" description="Identidad del negocio y configuración fiscal vigente para documentos y operaciones.">
      <div className="internal-screen-grid company-screen-grid">
        <section className="company-identity-column" data-guide-target="record-list">
          <h3>Identidad visual</h3>
          <div className="company-logo-preview"><img src="./sistema-ink-icon.png" alt="Logotipo ficticio de Atelier Demo" /></div>
          <DemoButton primary>Cambiar logo…</DemoButton>
          <div className="internal-field-grid one-column company-currency"><Field label="Moneda base" value="NIO - Córdoba" /></div>
          <section className="internal-card exchange-card"><h3>Tipo de cambio USD</h3><p>Valor de 1 USD expresado en córdobas.</p><div className="internal-field-grid one-column"><Field label="Actualización" value="Tasa fija · DEMO" /><Field label="Tasa vigente" value="C$ 36.6243" /></div><Table headers={["Fecha", "Tasa"]} rows={[["19/07/2026", "36.6243"], ["01/07/2026", "36.5800"]]} /></section>
        </section>
        <section className="company-data-column" data-guide-target="record-detail">
          <h3>Datos del negocio</h3><div className="internal-field-grid"><Field label="Razón social" value="Atelier Demostración S.A." /><Field label="Nombre comercial" value="Atelier Demo" /><Field label="RUC" value="DEMO-J031000042" /><Field label="Teléfono" value="+505 2222 0101" /><Field label="Correo" value="hola@atelier.example" /><Field label="Sitio web" value="atelier.example" /><Field label="Contacto principal" value="Marina Soto" wide /><Field label="Dirección" value="Distrito Creativo · Ubicación ficticia" wide /></div>
          <section className="internal-card company-settings-card"><h3>Entregas y totales</h3><div className="internal-field-grid"><Field label="Departamento" value="Managua DEMO" /><Field label="Ciudad" value="Ciudad ficticia" /><Field label="Envío fuera de la ciudad" value="C$ 120.00" /><Field label="Redondeo" value="Siguiente C$ 1" /><Field label="Mensaje de pedido listo" value="Plantilla ilustrativa para aviso al cliente" wide /></div></section>
          <section className="internal-card company-settings-card fiscal-card"><h3>Configuración fiscal</h3><div className="internal-field-grid"><Field label="Régimen tributario" value="Configuración de muestra" /><Field label="IVA" value="Tasa ficticia · No calculada" /><Field label="Retenciones" value="Solo referencia visual" wide /></div></section>
        </section>
      </div>
      <div className="internal-action-row company-actions"><DemoButton>Descartar cambios</DemoButton><DemoButton primary>Guardar empresa</DemoButton></div>
    </Screen>
  );
}

function UsersView() {
  const rows: ReactNode[][] = [
    [<strong>marina.demo</strong>, "Marina Soto", "Administración", <Badge tone="success">Activo</Badge>],
    [<strong>leo.demo</strong>, "Leo Castillo", "Ventas", <Badge tone="success">Activo</Badge>],
    [<strong>ana.demo</strong>, "Ana Vega", "Producción", <Badge tone="warning">Pausado</Badge>],
  ];
  return (
    <Screen section="ADMINISTRACIÓN" title="Usuarios" description="Cuentas personales, estado de acceso y rol asignado.">
      <div className="internal-screen-grid">
        <section><div className="internal-list-actions"><DemoButton primary>Nuevo usuario</DemoButton><DemoButton>Cambiar estado</DemoButton><DemoButton>Restablecer clave</DemoButton></div><Table headers={["Usuario", "Nombre", "Rol", "Activo"]} rows={rows} selected={0} /></section>
        <aside className="internal-card internal-editor" data-guide-target="record-detail"><h3>Datos del usuario</h3><p>Perfil demostrativo. No representa una cuenta real.</p><div className="internal-field-grid one-column"><Field label="Usuario" value="marina.demo" /><Field label="Nombre para mostrar" value="Marina Soto" /><Field label="Rol" value="Administración" /><Field label="Descripción del rol" value="Configuración general del entorno DEMO" /><Field label="Clave temporal" value="No disponible en la demostración" /></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton>Asignar rol</DemoButton><DemoButton primary>Crear</DemoButton></div></aside>
      </div>
    </Screen>
  );
}

function RolesView() {
  const rows: ReactNode[][] = [
    [<strong>Administración</strong>, "1", <Badge tone="success">Activo</Badge>],
    [<strong>Ventas</strong>, "1", <Badge tone="success">Activo</Badge>],
    [<strong>Producción</strong>, "1", <Badge tone="success">Activo</Badge>],
  ];
  return (
    <Screen section="ADMINISTRACIÓN" title="Roles y permisos" description="Define qué puede hacer cada grupo de usuarios por módulo y acción." action="Nuevo rol">
      <div className="internal-screen-grid role-screen-grid">
        <section><Table headers={["Rol", "Usuarios", "Activo"]} rows={rows} selected={0} /></section>
        <aside className="internal-card internal-editor" data-guide-target="record-detail"><h3>Datos del rol</h3><p>Los permisos siguientes son únicamente una representación visual.</p><div className="internal-field-grid"><Field label="Nombre" value="Administración" /><Field label="Estado" value="Activo" /><Field label="Descripción" value="Configuración general del entorno" wide /></div><h4 className="permission-heading">Permisos</h4><div className="permission-list"><div><span><b>✓</b> Consultar panel<small>Panel principal · Consulta</small></span></div><div><span><b>✓</b> Consultar ventas<small>Ventas · Consulta</small></span></div><div><span><b>✓</b> Administrar usuarios<small>Administración · Gestión</small></span></div><div><span><b>—</b> Restaurar respaldos<small>Administración · Restringido</small></span></div></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar rol</DemoButton></div></aside>
      </div>
    </Screen>
  );
}

function DevicesView() {
  const rows: ReactNode[][] = [
    [<Badge tone="success">En línea</Badge>, <strong>ESTACIÓN-DEMO-01</strong>, "Marina Soto", "DEMO", "192.0.2.10", "08:42", "Hace unos segundos", "Windows"],
    [<Badge tone="success">En línea</Badge>, <strong>VENTAS-DEMO-02</strong>, "Leo Castillo", "DEMO", "192.0.2.11", "08:55", "Actividad reciente", "Windows"],
    [<Badge>Inactivo</Badge>, <strong>TALLER-DEMO-03</strong>, "Ana Vega", "DEMO", "192.0.2.12", "07:10", "Sin actividad reciente", "Windows"],
  ];
  return (
    <Screen section="ADMINISTRACIÓN" title="Equipos conectados" description="Sesiones activas y actividad reciente de las estaciones." action="Actualizar" metrics={[{ label: "Conectados ahora", value: "2", tone: "success" }, { label: "Criterio de actividad", value: "Periodo ilustrativo" }]}>
      <section className="full-card" data-guide-target="record-detail"><Table headers={["Estado", "Equipo", "Usuario", "Versión", "Dirección", "Conectado desde", "Última actividad", "Sistema"]} rows={rows} /></section>
    </Screen>
  );
}

function SalesMetricsView() {
  return (
    <Screen
      section="ADMINISTRACIÓN"
      title="Métricas de ventas"
      description="Documentos emitidos, cobros y saldos del período seleccionado."
      metrics={[
        { label: "Ventas emitidas", value: "C$ 251,270" },
        { label: "Cobrado en el período", value: "C$ 186,420", tone: "success" },
        { label: "Saldo de estas ventas", value: "C$ 64,850", tone: "danger" },
        { label: "Ticket promedio", value: "C$ 7,390", tone: "warning" },
        { label: "Clientes", value: "19" },
      ]}
    >
      <div className="sales-metrics-toolbar" data-guide-target="module-filter"><strong>Período</strong><button type="button" disabled>Mes actual</button><button type="button" disabled>Últimos 30 días</button><label>Desde <span>01/07/2026</span></label><i>a</i><label>Hasta <span>20/07/2026</span></label><DemoButton primary>Actualizar</DemoButton></div>
      <div className="sales-comparison-strip"><div><span>Comparación</span><strong>+ 12.4 % frente al período anterior</strong></div><div><span>Ventas por moneda</span><strong>NIO 92 % · USD 8 %</strong></div><div><span>Descuentos</span><strong>C$ 8,460</strong></div><div><span>Cargos de envío</span><strong>C$ 3,280</strong></div></div>
      <div className="sales-metrics-panels">
        <section className="internal-card"><h3>Evolución del período</h3><Table headers={["Fecha", "Docs.", "Venta base"]} rows={[["05/07/2026", "8", "C$ 48,900"], ["12/07/2026", "11", "C$ 82,150"], ["19/07/2026", "15", "C$ 120,220"]]} /></section>
        <section className="internal-card"><h3>Principales clientes</h3><Table headers={["Cliente", "Docs.", "Venta"]} rows={[["Norte Creativo", "6", "C$ 54,800"], ["Café Lumbre", "4", "C$ 36,420"], ["Casa Nativa", "3", "C$ 31,600"]]} /></section>
        <section className="internal-card" data-guide-target="record-detail"><h3>Productos y servicios</h3><Table headers={["Código", "Concepto", "Cant.", "Venta"]} rows={[["PRO-DEMO-027", "Camiseta promocional", "42", "C$ 58,300"], ["PRO-DEMO-032", "Taza personalizada", "67", "C$ 41,950"], ["SER-DEMO-014", "Diseño e impresión", "18", "C$ 33,680"]]} /></section>
      </div>
    </Screen>
  );
}

function StationView() {
  return (
    <Screen section="ADMINISTRACIÓN" title="Estación e impresión" description="Preferencias locales de actualización y salidas impresas de esta estación.">
      <div className="settings-card-grid">
        <section className="internal-card" data-guide-target="record-list"><div className="setting-title"><div><h3>Actualización entre equipos</h3><p className="internal-copy">Consulta periódica ilustrativa para mantener visible la operación compartida.</p></div><span className="fake-switch is-on" aria-hidden="true" /></div><div className="internal-field-grid one-column"><Field label="Intervalo" value="Configuración de demostración" /></div></section>
        <section className="internal-card" data-guide-target="record-detail"><div className="setting-title"><div><h3>Impresoras predeterminadas</h3><p className="internal-copy">El diálogo de Windows seguirá disponible antes de imprimir.</p></div><DemoButton>Detectar impresoras</DemoButton></div><div className="printer-format-grid"><div><small>FORMATO NORMAL · CARTA / A4</small><p>Reportes, facturas y documentos administrativos.</p><Field label="Impresora para documentos normales" value="Impresora Oficina DEMO" /></div><div><small>FORMATO BAUCHER · RECIBO TÉRMICO</small><p>Recibos de caja y comprobantes compactos.</p><Field label="Impresora para recibos de caja" value="Térmica Caja DEMO" /></div></div><div className="printer-routing-note">El sistema preselecciona la impresora según el tipo de documento. Podrás cambiarla antes de confirmar la impresión.</div></section>
      </div>
      <div className="internal-action-row station-actions"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar estación</DemoButton></div>
    </Screen>
  );
}

function BackupsView() {
  const rows: ReactNode[][] = [
    ["19/07/2026 02:00", "Programado", <Badge tone="success">Completado</Badge>, "18.4 MB", "Copia DEMO"],
    ["18/07/2026 17:42", "Manual", <Badge tone="success">Completado</Badge>, "18.1 MB", "Prueba visual"],
    ["17/07/2026 02:00", "Programado", <Badge>Conservado</Badge>, "17.9 MB", "Historial ficticio"],
  ];
  return (
    <Screen section="ADMINISTRACIÓN" title="Respaldos y diagnóstico" description="Protección automática, estado del servidor e historial verificable." action="Actualizar" metrics={[{ label: "Servidor", value: "Disponible", tone: "success" }, { label: "Base de datos", value: "Demo", tone: "success" }, { label: "Almacenamiento", value: "Local" }, { label: "Último respaldo", value: "Ejecución demo" }]}>
      <section className="internal-card backup-schedule" data-guide-target="record-detail"><div className="setting-title"><div><h3>Programación automática</h3><p className="internal-copy">Próxima ejecución: horario sintético de demostración.</p></div><span className="fake-switch is-on" aria-hidden="true" /></div><div className="internal-field-grid"><Field label="Frecuencia" value="Programada" /><Field label="Hora" value="Configuración demo" /><Field label="Día" value="Periodo ilustrativo" /><Field label="Retención" value="Historial ficticio" /></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar programación</DemoButton></div></section>
      <div className="backup-action-grid"><section className="internal-card"><h3>Respaldo manual</h3><p className="internal-copy">Crea una copia de muestra en el almacenamiento configurado.</p><DemoButton primary>Crear respaldo</DemoButton></section><section className="internal-card"><h3>Restaurar respaldo</h3><p className="internal-copy">Esta acción permanece deshabilitada en la presentación pública.</p><DemoButton>Seleccionar archivo…</DemoButton></section></div>
      <section className="internal-card backup-history"><div className="internal-card-heading"><div><h3>Historial</h3><p className="internal-copy">La tabla usa únicamente archivos y estados ficticios.</p></div></div><Table headers={["Inicio", "Origen", "Estado", "Tamaño", "Detalle"]} rows={rows} /></section>
    </Screen>
  );
}

function ProductsView() {
  const rows: ReactNode[][] = [
    [<strong>PRO-DEMO-032</strong>, "Taza personalizada 11 oz", "Producto", "Unidad", <Badge tone="success">Activo</Badge>],
    [<strong>SER-DEMO-014</strong>, "Diseño para impresión", "Servicio", "Servicio", <Badge tone="success">Activo</Badge>],
    [<strong>PRO-DEMO-027</strong>, "Camiseta promocional", "Producto", "Unidad", <Badge tone="success">Activo</Badge>],
  ];
  return (
    <Screen section="CATÁLOGO" title="Productos y servicios" description="Conceptos comerciales, costos y precios vigentes." actions={<div className="internal-screen-actions"><DemoButton>Plantilla</DemoButton><DemoButton>Importar</DemoButton><DemoButton primary>Nuevo concepto</DemoButton></div>}>
      <div className="internal-screen-grid product-grid"><section><div className="fake-input internal-search">Buscar código o nombre…</div><div className="catalog-filter-row"><Badge tone="success">Activos</Badge><Badge>Inactivos</Badge><Badge>Todos</Badge><span /><Badge>Producto</Badge><Badge>Servicio</Badge><Badge>Cargo</Badge></div><Table headers={["Código", "Nombre", "Tipo", "Unidad", "Activo"]} rows={rows} /></section><aside className="internal-card internal-editor" data-guide-target="record-detail"><div className="internal-card-heading"><div><h3>Taza personalizada 11 oz</h3><p className="internal-copy">PRO-DEMO-032 · Producto ficticio seleccionado</p></div><DemoButton>Editar</DemoButton></div><div className="internal-field-grid"><Field label="Categoría" value="Promocionales" /><Field label="Unidad" value="Unidad" /><Field label="Costo estimado" value="C$ 78.00" /><Field label="Precio público" value="C$ 145.00" /><Field label="Características" value="Inventario · Personalizable" wide /></div><h4 className="permission-heading">Presentaciones</h4><Table headers={["Presentación", "Unidad", "Factor", "Pred."]} rows={[["Caja DEMO", "UND", "12.0000", "Sí"], ["Unidad", "UND", "1.0000", "No"]]} /></aside></div>
    </Screen>
  );
}

function CategoriesView() {
  const rows: ReactNode[][] = [
    [<strong>CAT-DEMO-01</strong>, "Promocionales", <Badge tone="success">Activa</Badge>],
    [<strong>CAT-DEMO-02</strong>, "Textiles", <Badge tone="success">Activa</Badge>],
    [<strong>CAT-DEMO-03</strong>, "Diseño y preparación", <Badge tone="success">Activa</Badge>],
  ];
  return <Screen section="CATÁLOGO" title="Categorías" description="Organización comercial del catálogo." action="Nueva categoría"><div className="internal-screen-grid"><section><Table headers={["Código", "Nombre", "Activo"]} rows={rows} /></section><aside className="internal-card internal-editor" data-guide-target="record-detail"><h3>Datos de la categoría</h3><div className="internal-field-grid one-column"><Field label="Código" value="CAT-DEMO-01" /><Field label="Nombre" value="Promocionales" /><Field label="Descripción" value="Artículos de muestra para campañas" /><Field label="Categoría activa" value="Sí" /></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar</DemoButton></div></aside></div></Screen>;
}

function UnitsView() {
  const rows: ReactNode[][] = [
    [<strong>UND</strong>, "Unidad", "u", "0", <Badge tone="success">Activa</Badge>],
    [<strong>MT</strong>, "Metro", "m", "2", <Badge tone="success">Activa</Badge>],
    [<strong>KG</strong>, "Kilogramo", "kg", "3", <Badge tone="success">Activa</Badge>],
  ];
  return <Screen section="CATÁLOGO" title="Unidades de medida" description="Precisión para cantidades de venta y producción." action="Nueva unidad"><div className="internal-screen-grid"><section><Table headers={["Código", "Nombre", "Símbolo", "Decimales", "Activo"]} rows={rows} /></section><aside className="internal-card internal-editor" data-guide-target="record-detail"><h3>Datos de la unidad</h3><div className="internal-field-grid one-column"><Field label="Código" value="UND" /><Field label="Nombre" value="Unidad" /><Field label="Símbolo" value="u" /><Field label="Decimales" value="0" /><Field label="Unidad activa" value="Sí" /></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar</DemoButton></div></aside></div></Screen>;
}

function RecipesView() {
  const rows: ReactNode[][] = [
    [<strong>REC-DEMO-08</strong>, "Taza personalizada 11 oz", "C$ 96.50", "Sí"],
    [<strong>REC-DEMO-12</strong>, "Camiseta promocional", "C$ 184.20", "Sí"],
    [<strong>REC-DEMO-17</strong>, "Rótulo PVC mediano", "C$ 312.00", "Sí"],
  ];
  return (
    <Screen section="CATÁLOGO" title="Recetas y costos" description="Materiales, proceso y costo de referencia por producto o servicio." action="Actualizar">
      <div className="internal-screen-grid recipe-grid"><section><div className="fake-input internal-search">Buscar producto o servicio…</div><Table headers={["Código", "Producto o servicio", "Costo", "Receta"]} rows={rows} /></section><aside className="internal-card internal-editor recipe-detail" data-guide-target="record-detail"><div className="internal-card-heading"><div><h3>Taza personalizada 11 oz</h3><p className="internal-copy">Receta activa · Cantidad resultante: 1 unidad</p></div><Badge tone="success">Activa</Badge></div><div className="recipe-summary"><div><span>Materiales</span><strong>C$ 78.00</strong></div><div><span>Proceso</span><strong>C$ 18.50</strong></div><div><span>Costo lote</span><strong>C$ 96.50</strong></div><div className="total"><span>Costo unitario ilustrativo</span><strong>C$ 96.50</strong></div></div><h4 className="permission-heading">Materiales</h4><div className="material-list"><div><span>Taza blanca DEMO</span><strong>1 u</strong></div><div><span>Papel transfer DEMO</span><strong>0.1 m</strong></div><div><span>Proceso sublimado</span><strong>8 min</strong></div></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar</DemoButton></div><p className="formula-warning">La demostración no incluye fórmulas, cálculos ni reglas reales del producto.</p></aside></div>
    </Screen>
  );
}

function SuppliersView() {
  const rows: ReactNode[][] = [
    [<strong>PRV-DEMO-018</strong>, "Suministros Pacífico", "María Demo", "30 días", <Badge tone="success">Activo</Badge>],
    [<strong>PRV-DEMO-012</strong>, "Textiles Centro", "Carlos Muestra", "Contado", <Badge tone="success">Activo</Badge>],
    [<strong>PRV-DEMO-006</strong>, "Importadora Horizonte", "Equipo DEMO", "15 días", <Badge>Revisión</Badge>],
  ];
  return (
    <Screen section="CATÁLOGO" title="Proveedores" description="Datos comerciales, contacto, crédito e importación masiva." actions={<div className="internal-screen-actions"><DemoButton>Plantilla</DemoButton><DemoButton>Importar</DemoButton><DemoButton primary>Nuevo proveedor</DemoButton></div>}>
      <div className="internal-screen-grid supplier-grid"><section><div className="fake-input internal-search">Buscar código, nombre o contacto…</div><Table headers={["Código", "Proveedor", "Contacto", "Crédito", "Estado"]} rows={rows} selected={0} /></section><aside className="internal-card internal-editor" data-guide-target="record-detail"><h3>Suministros Pacífico</h3><p>Proveedor ficticio seleccionado para explicar la ficha comercial.</p><div className="internal-field-grid"><Field label="Código" value="PRV-DEMO-018" /><Field label="Estado" value="Activo" /><Field label="Contacto" value="María Demo" /><Field label="Teléfono" value="+505 2222 0180" /><Field label="Correo" value="compras@suministros.example" /><Field label="Condición" value="Crédito · 30 días" /><Field label="Dirección" value="Zona comercial ficticia" wide /></div><div className="internal-action-row"><DemoButton>Descartar</DemoButton><DemoButton primary>Guardar proveedor</DemoButton></div></aside></div>
    </Screen>
  );
}

type InternalViewContentProps =
  | { section: "administracion"; activeView: AdministrationViewId }
  | { section: "catalogo"; activeView: CatalogViewId };

export default function InternalViewContent(props: InternalViewContentProps) {
  if (props.section === "administracion") {
    switch (props.activeView) {
      case "empresa": return <CompanyView />;
      case "usuarios": return <UsersView />;
      case "roles": return <RolesView />;
      case "equipos": return <DevicesView />;
      case "metricas-ventas": return <SalesMetricsView />;
      case "estacion": return <StationView />;
      case "respaldos": return <BackupsView />;
    }
  }

  switch (props.activeView) {
    case "productos": return <ProductsView />;
    case "categorias": return <CategoriesView />;
    case "unidades": return <UnitsView />;
    case "recetas": return <RecipesView />;
    case "proveedores": return <SuppliersView />;
  }
}
