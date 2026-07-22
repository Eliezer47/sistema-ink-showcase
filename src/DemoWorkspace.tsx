"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import InteractiveGuide, { type GuideModuleId } from "./InteractiveGuide";
import InternalViewContent, { type AdministrationViewId, type CatalogViewId } from "./InternalViews";

type ModuleId = GuideModuleId;

type ModuleDefinition = { id: ModuleId; label: string };
type InternalViewId = AdministrationViewId | CatalogViewId;
type InternalNavItem = { id: InternalViewId; label: string };

const primaryModules: ModuleDefinition[] = [
  { id: "panel", label: "Panel principal" },
  { id: "metricas", label: "Métricas" },
  { id: "ventas", label: "Ventas" },
  { id: "caja", label: "Caja" },
  { id: "produccion", label: "Producción" },
];

const secondaryModules: ModuleDefinition[] = [
  { id: "clientes", label: "Clientes" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "entregas", label: "Control de entregas" },
  { id: "articulos", label: "Artículos del cliente" },
  { id: "calidad", label: "Calidad" },
  { id: "finanzas", label: "Finanzas" },
  { id: "compras", label: "Compras" },
  { id: "inventario", label: "Inventario" },
  { id: "catalogo", label: "Catálogo" },
  { id: "administracion", label: "Administración" },
];

const moduleCopy: Record<ModuleId, { title: string; subtitle: string }> = {
  panel: { title: "Panel principal", subtitle: "Pedidos pendientes y prioridades de la operación" },
  metricas: { title: "Métricas", subtitle: "Indicadores comerciales y financieros para la toma de decisiones." },
  ventas: { title: "Ventas y pedidos", subtitle: "Captura comercial, fechas y seguimiento operativo en un solo registro." },
  caja: { title: "Caja", subtitle: "Cobros, transferencias pendientes y saldos de pedidos." },
  produccion: { title: "Producción", subtitle: "Cola de trabajos, tiempos efectivos y fechas comprometidas." },
  clientes: { title: "Clientes", subtitle: "Directorio comercial y condiciones de venta." },
  cotizaciones: { title: "Cotizaciones", subtitle: "Propuestas comerciales, versiones y fechas prometidas." },
  entregas: { title: "Entregas", subtitle: "Cantidades pendientes, entregas parciales y comprobantes." },
  articulos: { title: "Artículos del cliente", subtitle: "Recepción, producción y devolución de artículos recibidos." },
  calidad: { title: "Calidad", subtitle: "Incidencias, revisiones y seguimiento de no conformidades." },
  finanzas: { title: "Finanzas", subtitle: "Cartera, obligaciones, presupuesto y rentabilidad." },
  compras: { title: "Compras", subtitle: "Facturas, abastecimiento y recepciones de mercancía." },
  inventario: { title: "Inventario", subtitle: "Existencias, movimientos, almacenes y alertas." },
  catalogo: { title: "Catálogo", subtitle: "Productos, servicios, categorías, unidades y recetas." },
  administracion: { title: "Administración", subtitle: "Configuración general de la empresa y sus usuarios." },
};

const administrationViews: readonly InternalNavItem[] = [
  { id: "empresa", label: "Empresa" },
  { id: "usuarios", label: "Usuarios" },
  { id: "roles", label: "Roles y permisos" },
  { id: "equipos", label: "Equipos conectados" },
  { id: "metricas-ventas", label: "Métricas de ventas" },
  { id: "estacion", label: "Estación e impresión" },
  { id: "respaldos", label: "Respaldos" },
];

const catalogViews: readonly InternalNavItem[] = [
  { id: "productos", label: "Productos y servicios" },
  { id: "categorias", label: "Categorías" },
  { id: "unidades", label: "Unidades" },
  { id: "recetas", label: "Recetas y costos" },
  { id: "proveedores", label: "Proveedores" },
];

const money = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
  maximumFractionDigits: 0,
});

function Status({ tone, children }: { tone: "teal" | "amber" | "blue" | "red"; children: ReactNode }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

function WindowButton({ children, danger = false, disabled = true, onClick, pressed, buttonRef, controls }: { children: ReactNode; danger?: boolean; disabled?: boolean; onClick?: () => void; pressed?: boolean; buttonRef?: RefObject<HTMLButtonElement | null>; controls?: string }) {
  return <button ref={buttonRef} className={`titlebar-button${danger ? " danger" : ""}${pressed ? " active" : ""}`} type="button" disabled={disabled} onClick={onClick} aria-pressed={pressed} aria-controls={controls}>{children}</button>;
}

function ViewHeader({ title, subtitle, action, actions }: { title: string; subtitle: string; action?: string; actions?: readonly string[] }) {
  const actionLabels = actions ?? (action ? [action] : []);
  return (
    <header className="real-view-header" data-guide-target="module-header">
      <div><h2>{title}</h2><p>{subtitle}</p></div>
      {actionLabels.length ? <div className="real-view-actions">{actionLabels.map((label, index) => <button className={index === 0 && actions ? "real-primary-button" : "real-secondary-button"} key={label} type="button" disabled>{label}</button>)}</div> : null}
    </header>
  );
}

function PanelModule() {
  const metrics = [
    ["Pedidos activos", "18", "neutral"],
    ["Pedidos atrasados", "2", "danger"],
    ["Trabajos pendientes", "11", "neutral"],
    ["Listos para entregar", "5", "success"],
    ["Por cobrar C$", "84,650.00", "neutral"],
    ["Por cobrar US$", "1,240.00", "neutral"],
    ["Transferencias por verificar", "3", "warning"],
    ["Alertas de inventario", "12", "neutral"],
  ] as const;
  const columns = [
    {
      title: "POR HACER", tone: "todo", count: "4",
      rows: [
        ["DEMO-1053", "Norte Creativo", "Producción · Estampado pendiente", "Hoy, 10:30"],
        ["DEMO-1041", "Casa Nativa", "Cobro · Saldo pendiente", "Atrasado 1 día"],
      ],
    },
    {
      title: "POR ENTREGAR", tone: "ready", count: "3",
      rows: [
        ["DEMO-1048", "Café Lumbre", "Entrega · 8 delantales", "Hoy, 15:00"],
        ["DEMO-1056", "Estudio Prisma", "Entrega · 18 agendas", "Mañana"],
      ],
    },
    {
      title: "HECHO HOY", tone: "done", count: "5",
      rows: [
        ["DEMO-1051", "Taller Horizonte", "Producción · 6 tazas", "09:18"],
        ["DEMO-1046", "Punto Norte", "Cobro · Recibo emitido", "08:42"],
      ],
    },
  ];

  return (
    <div className="real-module dashboard-real">
      <ViewHeader title="Panel principal" subtitle="Pedidos pendientes y prioridades de la operación" action="Actualizar" />
      <div className="real-metric-grid" data-guide-target="module-metrics">
        {metrics.map(([label, value, tone]) => (
          <article className={`real-metric metric-${tone}`} key={label}><span>{label}</span><strong>{value}</strong></article>
        ))}
      </div>
      <div className="flow-toolbar" data-guide-target="flow-toolbar">
        <div><h3>Flujo operativo</h3><select aria-label="Área del flujo" defaultValue="todas"><option value="todas">Todas las áreas</option></select></div>
        <button className="real-primary-button" type="button" disabled>Abrir seleccionado</button>
      </div>
      <div className="workflow-columns" data-guide-target="workflow-columns">
        {columns.map((column) => (
          <section className={`workflow-column workflow-${column.tone}`} key={column.title}>
            <header><strong>{column.title}</strong><span>{column.count}</span></header>
            <div className="workflow-body">
              {column.rows.map(([reference, customer, detail, time]) => (
                <article className="workflow-row" key={reference}>
                  <div><strong>{reference}</strong><span> · Operación demo</span></div>
                  <h4>{customer}</h4><p>{detail}</p><small>{time}</small>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="view-footnote"><span>Datos ficticios para demostración</span><span>Actualizado: 19/07/2026 10:45</span></div>
    </div>
  );
}

function MetricsModule() {
  const weeklySales = [
    { label: "Sem. 1", amount: "C$ 46,800", height: 46 },
    { label: "Sem. 2", amount: "C$ 63,420", height: 67 },
    { label: "Sem. 3", amount: "C$ 82,150", height: 88 },
    { label: "Sem. 4", amount: "C$ 58,900", height: 61 },
  ];
  const leaders = [
    ["Camiseta promocional", "C$ 58,300", "28 %"],
    ["Taza personalizada", "C$ 41,950", "20 %"],
    ["Diseño e impresión", "C$ 33,680", "16 %"],
  ];
  const expenses = [
    ["Insumos de producción", "C$ 37,400", "44 %"],
    ["Servicios operativos", "C$ 21,850", "26 %"],
    ["Logística", "C$ 12,600", "15 %"],
  ];

  return (
    <div className="real-module executive-metrics-real">
      <ViewHeader title="Métricas" subtitle="Indicadores comerciales y financieros para la toma de decisiones." action="Actualizar" />
      <div className="executive-kpis" data-guide-target="module-metrics">
        <article><span>VENTAS DEL MES</span><strong>C$ 251,270</strong><small>34 documentos activos</small></article>
        <article className="positive"><span>COBRADO</span><strong>C$ 186,420</strong><small>74 % de lo emitido</small></article>
        <article className="negative"><span>GASTOS REGISTRADOS</span><strong>C$ 84,910</strong><small>Información ilustrativa</small></article>
        <article className="positive"><span>UTILIDAD BRUTA EST.</span><strong>C$ 166,360</strong><small>Sin revelar fórmulas reales</small></article>
        <article className="warning"><span>POR COBRAR</span><strong>C$ 64,850</strong><small>6 documentos abiertos</small></article>
      </div>
      <div className="executive-panels">
        <section className="executive-card weekly-card" data-guide-target="record-list">
          <h3>Ventas por semana</h3>
          <div className="weekly-chart">
            {weeklySales.map((item) => <div className="weekly-column" key={item.label}><small>{item.amount}</small><div><span style={{ height: `${item.height}%` }} /></div><b>{item.label}</b></div>)}
          </div>
        </section>
        <section className="executive-card ranking-card" data-guide-target="record-detail">
          <h3>Productos y servicios líderes</h3>
          {leaders.map(([label, amount, percent]) => <div className="ranking-row" key={label}><div><strong>{label}</strong><span>{amount}</span></div><div className="ranking-track"><span style={{ width: percent }} /></div><small>{percent} de ventas</small></div>)}
        </section>
        <section className="executive-card ranking-card expense-card">
          <h3>Gastos por categoría</h3>
          {expenses.map(([label, amount, percent]) => <div className="ranking-row" key={label}><div><strong>{label}</strong><span>{amount}</span></div><div className="ranking-track"><span style={{ width: percent }} /></div><small>{percent} del gasto</small></div>)}
        </section>
      </div>
      <div className="view-footnote"><span>Valores sintéticos · sin cálculos del producto real</span><span>Actualizado: 20/07/2026 14:40</span></div>
    </div>
  );
}

function SalesModule() {
  const rows = [
    ["DEMO-1056", "Estudio Prisma", "19/07/2026", "Lista", "C$ 12,480", "teal"],
    ["DEMO-1053", "Norte Creativo", "20/07/2026", "Producción", "C$ 8,950", "blue"],
    ["DEMO-1048", "Café Lumbre", "19/07/2026", "Prioritaria", "C$ 5,720", "amber"],
    ["DEMO-1041", "Casa Nativa", "18/07/2026", "Por cobrar", "C$ 16,300", "red"],
  ] as const;
  return (
    <div className="sales-workspace-real">
      <div className="commercial-strip" data-guide-target="module-header">
        <div><strong>FLUJO COMERCIAL</strong><span /> <p>Captura una vez y continúa con producción, cobro y facturación.</p></div>
        <div className="workspace-tabs" data-guide-target="workspace-tabs"><button className="active" type="button" disabled>Ventas y pedidos</button><button type="button" disabled>Documentos emitidos</button></div>
      </div>
      <div className="real-module">
        <ViewHeader title="Ventas y pedidos" subtitle="Captura comercial, fechas y seguimiento operativo en un solo registro." action="Nueva venta" />
        <div className="real-filterbar" data-guide-target="module-filter"><div className="fake-input">Buscar pedido o cliente…</div><select defaultValue="activos" aria-label="Estado"><option value="activos">Activos</option></select></div>
        <section className="real-table-card" data-guide-target="record-list">
          <div className="real-table-row real-table-head"><span>Pedido</span><span>Cliente</span><span>Entrega</span><span>Estado</span><span>Total</span></div>
          {rows.map(([order, customer, delivery, state, total, tone]) => (
            <div className="real-table-row" key={order}><strong>{order}</strong><span>{customer}</span><span>{delivery}</span><span><Status tone={tone}>{state}</Status></span><strong>{total}</strong></div>
          ))}
        </section>
        <div className="view-footnote"><span>4 pedidos ficticios</span><span>Página 1 de 1</span></div>
      </div>
    </div>
  );
}

function CashModule() {
  const orders = [["DEMO-1041", "Casa Nativa", "Pendiente", "16,300.00"], ["DEMO-1048", "Café Lumbre", "Abono", "5,720.00"], ["DEMO-1053", "Norte Creativo", "Pendiente", "8,950.00"]];
  return (
    <div className="real-module">
      <ViewHeader title="Caja" subtitle="Cobros, transferencias pendientes y saldos de pedidos." actions={["Cerrar caja 20/07", "Retiro", "Cierre diario"]} />
      <div className="cash-summary" data-guide-target="module-metrics">
        <div><strong>CAJA ABIERTA</strong><small>Fondo demo C$ 5,000.00</small></div>
        <div><span>EFECTIVO ESPERADO</span><strong>C$ 26,420.00</strong></div>
        <div><span>EFECTIVO RECIBIDO</span><strong>C$ 18,700.00</strong></div>
        <div><span>TRANSFERENCIAS</span><strong>C$ 12,400.00</strong><small>3 por verificar</small></div>
        <div><span>RETIROS</span><strong>C$ 1,200.00</strong></div>
      </div>
      <div className="split-workspace">
        <section><div className="real-filterbar" data-guide-target="module-filter"><div className="fake-input">Buscar pedido o cliente…</div><select defaultValue="activos" aria-label="Estado de cobro"><option value="activos">Activos</option></select></div><div className="subtabs" data-guide-target="workspace-tabs"><button className="active" type="button" disabled>PENDIENTES DE COBRO</button><button type="button" disabled>MOVIMIENTOS DE HOY</button></div><div className="compact-table" data-guide-target="record-list"><div className="compact-row head"><span>Pedido</span><span>Cliente</span><span>Estado</span><span>Saldo</span></div>{orders.map((row) => <div className="compact-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div></section>
        <aside className="detail-pane" data-guide-target="record-detail"><h3>DEMO-1041</h3><p>Casa Nativa</p><div className="detail-metrics"><div><span>Total del pedido</span><strong>C$ 24,800</strong></div><div><span>Por verificar</span><strong>C$ 0</strong></div><div><span>Saldo</span><strong>C$ 16,300</strong></div></div><h4>Agregar forma de pago</h4><p className="empty-copy">Los controles operativos permanecen deshabilitados en esta presentación.</p><button className="real-primary-button" type="button" disabled>Registrar abono</button></aside>
      </div>
    </div>
  );
}

function ProductionModule() {
  const jobs = [["DEMO-1053", "Norte Creativo", "Estampado", "20/07", "En proceso"], ["DEMO-1048", "Café Lumbre", "Costura", "19/07", "Atrasado"], ["DEMO-1056", "Estudio Prisma", "Acabado", "19/07", "Por hacer"], ["DEMO-1051", "Taller Horizonte", "Sublimado", "21/07", "Pausado"]];
  return (
    <div className="real-module">
      <ViewHeader title="Producción" subtitle="Cola de trabajos, tiempos efectivos y fechas comprometidas." />
      <div className="production-split">
        <section><div className="real-filterbar" data-guide-target="module-filter"><div className="fake-input">Buscar pedido, cliente o proceso…</div><select defaultValue="activos" aria-label="Estado de producción"><option value="activos">Activos</option></select></div><div className="production-table" data-guide-target="record-list"><div className="production-row head"><span>Pedido</span><span>Cliente</span><span>Acción</span><span>Entrega</span><span>Estado</span></div>{jobs.map((job, index) => <div className={`production-row${index === 0 ? " selected" : ""}`} data-guide-target={index === 0 ? "selected-record" : undefined} key={job[0]}>{job.map((cell, cellIndex) => <span className={cellIndex === 2 ? "process-pill" : ""} key={cell}>{cell}</span>)}</div>)}</div><div className="view-footnote"><span>4 trabajos ficticios</span><span>Página 1 de 1</span></div></section>
        <aside className="detail-pane production-detail" data-guide-target="record-detail"><div className="detail-actionbar"><div><small>ACCIÓN DE PRODUCCIÓN</small><h3>Estampado</h3><p>DEMO-1053</p></div><div><button type="button" disabled>Iniciar</button><button type="button" disabled>Pausar</button><button type="button" disabled>Finalizar</button></div></div><h3>Norte Creativo</h3><p>24 termos promocionales · Diseño ficticio</p><div className="three-facts"><div><strong>24</strong><span>Cantidad</span></div><div><strong>En proceso</strong><span>Estado</span></div><div><strong>01:42</strong><span>Tiempo efectivo</span></div></div><div className="materials-box"><strong>Materiales de la receta</strong><p>Disponibilidad simulada · Almacén demo</p></div></aside>
      </div>
    </div>
  );
}

function CustomersModule() {
  const customers = [["CLI-DEMO-021", "Café Lumbre", "Público", "Activo"], ["CLI-DEMO-018", "Norte Creativo", "Mayoreo", "Activo"], ["CLI-DEMO-014", "Casa Nativa", "Preferente", "Revisión"], ["CLI-DEMO-009", "Estudio Prisma", "Mayoreo", "Activo"]];
  return (
    <div className="real-module"><ViewHeader title="Clientes" subtitle="Directorio comercial y condiciones de venta." action="Nuevo cliente" /><div className="split-workspace customer-real"><section><div className="fake-input" data-guide-target="module-filter">Buscar por código, nombre o contacto…</div><div className="compact-table" data-guide-target="record-list"><div className="compact-row head"><span>Código</span><span>Cliente</span><span>Lista</span><span>Estado</span></div>{customers.map((row) => <div className="compact-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div></section><aside className="detail-pane" data-guide-target="record-detail"><h3>Café Lumbre</h3><p>Cliente ficticio para demostración</p><div className="detail-list"><div><span>Código</span><strong>CLI-DEMO-021</strong></div><div><span>Contacto</span><strong>Andrea Demo</strong></div><div><span>Correo</span><strong>hola@cafelumbre.example</strong></div><div><span>Lista de precios</span><strong>Público</strong></div></div><button className="real-primary-button" type="button" disabled>Guardar cambios</button></aside></div></div>
  );
}

function FinanceModule() {
  return (
    <div className="finance-real"><div className="finance-strip" data-guide-target="module-header"><div><h2>Finanzas</h2><p>Cartera, obligaciones, presupuesto y rentabilidad</p></div><div className="workspace-tabs" data-guide-target="workspace-tabs"><button className="active" type="button" disabled>Cuentas por cobrar</button><button type="button" disabled>Cuentas por pagar</button><button type="button" disabled>Planificación y rentabilidad</button></div></div><div className="real-module"><div className="real-metric-grid finance-metrics" data-guide-target="module-metrics"><article className="real-metric"><span>Saldo por cobrar</span><strong>{money.format(84650)}</strong></article><article className="real-metric metric-warning"><span>Vencido</span><strong>C$ 16,300</strong></article><article className="real-metric"><span>Documentos abiertos</span><strong>6</strong></article><article className="real-metric metric-success"><span>Recuperado este mes</span><strong>C$ 42,800</strong></article></div><section className="real-table-card" data-guide-target="record-list"><div className="real-table-row real-table-head"><span>Documento</span><span>Cliente</span><span>Vencimiento</span><span>Estado</span><span>Saldo</span></div><div className="real-table-row"><strong>DEMO-1041</strong><span>Casa Nativa</span><span>18/07/2026</span><span><Status tone="red">Vencido</Status></span><strong>C$ 16,300</strong></div><div className="real-table-row"><strong>DEMO-1048</strong><span>Café Lumbre</span><span>22/07/2026</span><span><Status tone="amber">Pendiente</Status></span><strong>C$ 5,720</strong></div></section></div></div>
  );
}

function PurchasesModule() {
  const rows = [
    ["COM-DEMO-028", "Suministros Pacífico", "23/07/2026", "65 %", "C$ 18,460", "NIO"],
    ["COM-DEMO-025", "Textiles Centro", "20/07/2026", "20 %", "C$ 31,800", "NIO"],
    ["COM-DEMO-021", "Importadora Horizonte", "19/07/2026", "80 %", "US$ 640", "USD"],
  ];
  return (
    <div className="real-module purchases-real">
      <header className="purchases-header" data-guide-target="module-header">
        <div><h2>Compras</h2><p>Facturas, abastecimiento y recepciones de mercancía.</p></div>
        <div className="purchases-actions"><button type="button" disabled>Reporte de compras</button><button type="button" disabled>Plantilla</button><button type="button" disabled>Importar líneas</button><span /><button className="primary" type="button" disabled>Nueva compra</button></div>
      </header>
      <div className="purchase-kpis" data-guide-target="module-metrics">
        <article><span>Compras abiertas</span><strong>7</strong><small>Pendientes de recepción</small></article>
        <article className="late"><span>Atrasadas</span><strong>2</strong><small>Superaron fecha esperada</small></article>
        <article className="pending"><span>Valor por recibir</span><strong>C$ 86,740</strong><small>No sustituye el saldo en CxP</small></article>
      </div>
      <div className="purchase-workspace">
        <section>
          <div className="real-filterbar" data-guide-target="module-filter"><div className="fake-input">Buscar compra o proveedor…</div><select defaultValue="abiertas" aria-label="Estado de compra"><option value="abiertas">Abiertas</option></select></div>
          <div className="purchase-table" data-guide-target="record-list"><div className="purchase-row head"><span>Compra</span><span>Proveedor</span><span>Esperada</span><span>Progreso</span><span>Total</span><span>Mon.</span></div>{rows.map((row, index) => <div className={`purchase-row${index === 0 ? " selected" : ""}`} key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div>
          <div className="view-footnote"><span>3 compras ficticias</span><span>Página 1 de 1</span></div>
        </section>
        <aside className="detail-pane purchase-detail" data-guide-target="record-detail"><small>COMPRA SELECCIONADA</small><h3>COM-DEMO-028</h3><p>Suministros Pacífico · Documento ilustrativo</p><div className="detail-list"><div><span>Estado</span><strong>Recepción parcial</strong></div><div><span>Esperada</span><strong>23/07/2026</strong></div><div><span>Total</span><strong>C$ 18,460</strong></div><div><span>Pendiente</span><strong>35 %</strong></div></div><div className="purchase-progress"><span style={{ width: "65%" }} /></div><button className="real-primary-button" type="button" disabled>Inspeccionar y recibir</button></aside>
      </div>
    </div>
  );
}

function InventoryModule() {
  const rows = [["INS-DEMO-014", "Tinta textil negra", "18.5 kg", "Óptimo"], ["INS-DEMO-027", "Vinil blanco mate", "42 m", "Óptimo"], ["PRO-DEMO-032", "Taza blanca 11 oz", "16 u", "Bajo"], ["INS-DEMO-008", "Papel transfer A3", "8 paq", "Reponer"]];
  return <div className="real-module"><ViewHeader title="Inventario" subtitle="Existencias, movimientos, almacenes y alertas." action="Reporte" /><div className="real-metric-grid inventory-summary" data-guide-target="module-metrics"><article className="real-metric"><span>Valor estimado</span><strong>C$ 186,420</strong></article><article className="real-metric metric-warning"><span>Alertas</span><strong>12</strong></article><article className="real-metric"><span>Movimientos hoy</span><strong>27</strong></article><article className="real-metric metric-success"><span>Almacenes activos</span><strong>2</strong></article></div><section className="real-table-card" data-guide-target="record-list"><div className="real-table-row inventory-real-row real-table-head"><span>Código</span><span>Concepto</span><span>Disponible</span><span>Nivel</span></div>{rows.map((row) => <div className="real-table-row inventory-real-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</section></div>;
}

function GenericModule({ id, administrationView, catalogView, onAdministrationViewChange, onCatalogViewChange }: { id: ModuleId; administrationView: AdministrationViewId; catalogView: CatalogViewId; onAdministrationViewChange: (view: AdministrationViewId) => void; onCatalogViewChange: (view: CatalogViewId) => void }) {
  const copy = moduleCopy[id];
  const nav = id === "administracion" ? administrationViews : id === "catalogo" ? catalogViews : undefined;
  const navMeta = id === "administracion"
    ? { subtitle: "Configuración general", footer: "Los cambios de seguridad se auditan" }
    : { subtitle: "Oferta comercial", footer: "Precios expresados en C$" };
  const activeInternal: InternalViewId | undefined = id === "administracion" ? administrationView : id === "catalogo" ? catalogView : undefined;
  const activeInternalLabel = nav?.find((item) => item.id === activeInternal)?.label;

  const selectInternal = (view: InternalViewId) => {
    if (id === "administracion") onAdministrationViewChange(view as AdministrationViewId);
    if (id === "catalogo") onCatalogViewChange(view as CatalogViewId);
  };

  const internalContent = id === "administracion"
    ? <InternalViewContent key={administrationView} section="administracion" activeView={administrationView} />
    : id === "catalogo"
      ? <InternalViewContent key={catalogView} section="catalogo" activeView={catalogView} />
      : null;

  return (
    <div className={`real-module generic-real generic-${id}${nav ? " with-internal-nav" : ""}`}>
      {nav ? <aside className="internal-nav" data-guide-target="sub-navigation"><div className="internal-nav-heading"><strong>{copy.title.toUpperCase()}</strong><span>{navMeta.subtitle}</span></div><div className="internal-nav-sections"><small>SECCIONES</small>{nav.map((item) => <button className={activeInternal === item.id ? "active" : ""} type="button" key={item.id} data-submenu-id={item.id} onClick={() => selectInternal(item.id)} aria-controls="internal-view-host" aria-current={activeInternal === item.id ? "page" : undefined} aria-pressed={activeInternal === item.id}>{item.label}</button>)}</div><p>{navMeta.footer}</p></aside> : null}
      {nav ? <div className="internal-view-host" id="internal-view-host" role="region" aria-label={`Vista de ${activeInternalLabel}`}>{internalContent}</div> : <div className="generic-content">
        <ViewHeader
          title={copy.title}
          subtitle={copy.subtitle}
          action={id === "cotizaciones" ? "Nueva cotización" : id === "compras" ? "Nueva compra" : "Acción no disponible"}
        />
        <div className="split-workspace">
          <section>
            <div className="fake-input" data-guide-target="module-filter">Buscar en datos ficticios…</div>
            <div className="compact-table" data-guide-target="record-list">
              <div className="compact-row head"><span>Referencia</span><span>Descripción</span><span>Fecha</span><span>Estado</span></div>
              <div className="compact-row"><span>DEMO-1001</span><span>Registro ilustrativo</span><span>19/07/2026</span><span>Activo</span></div>
              <div className="compact-row"><span>DEMO-1002</span><span>Muestra sin datos reales</span><span>20/07/2026</span><span>Pendiente</span></div>
            </div>
          </section>
          <aside className="detail-pane empty-detail" data-guide-target="record-detail">
            <h3>Vista visual de {copy.title.toLowerCase()}</h3>
            <p>Esta superficie reproduce la organización del producto y usa únicamente información sintética.</p>
            <strong>Solo lectura · Datos ficticios</strong>
          </aside>
        </div>
      </div>}
    </div>
  );
}

function ModuleContent({ active, administrationView, catalogView, onAdministrationViewChange, onCatalogViewChange }: { active: ModuleId; administrationView: AdministrationViewId; catalogView: CatalogViewId; onAdministrationViewChange: (view: AdministrationViewId) => void; onCatalogViewChange: (view: CatalogViewId) => void }) {
  if (active === "panel") return <PanelModule />;
  if (active === "metricas") return <MetricsModule />;
  if (active === "ventas") return <SalesModule />;
  if (active === "caja") return <CashModule />;
  if (active === "produccion") return <ProductionModule />;
  if (active === "clientes") return <CustomersModule />;
  if (active === "finanzas") return <FinanceModule />;
  if (active === "compras") return <PurchasesModule />;
  if (active === "inventario") return <InventoryModule />;
  return <GenericModule id={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={onAdministrationViewChange} onCatalogViewChange={onCatalogViewChange} />;
}

export default function DemoWorkspace() {
  const [active, setActive] = useState<ModuleId>("panel");
  const [moreOpen, setMoreOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [administrationView, setAdministrationView] = useState<AdministrationViewId>("empresa");
  const [catalogView, setCatalogView] = useState<CatalogViewId>("productos");
  const contentRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const guideButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ left: 0, top: 0 });
  }, [active]);

  const showModule = (id: ModuleId, secondary = false) => {
    setActive(id);
    setMoreOpen(secondary);
  };

  const resetInternalScroll = () => {
    requestAnimationFrame(() => contentRef.current?.querySelector<HTMLElement>(".internal-view-host")?.scrollTo({ left: 0, top: 0 }));
  };

  const showAdministrationView = (view: AdministrationViewId) => {
    setAdministrationView(view);
    resetInternalScroll();
  };

  const showCatalogView = (view: CatalogViewId) => {
    setCatalogView(view);
    resetInternalScroll();
  };

  const closeGuide = () => {
    setGuideOpen(false);
    requestAnimationFrame(() => guideButtonRef.current?.focus());
  };

  const renderNavButton = (module: ModuleDefinition, secondary = false) => (
    <button key={module.id} className={`sidebar-nav-button${active === module.id ? " active" : ""}`} type="button" onClick={() => showModule(module.id, secondary)} aria-pressed={active === module.id} data-guide-target={active === module.id ? "active-module" : undefined}>
      {module.label}
    </button>
  );

  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <div className="demo-section-heading">
        <div><p className="eyebrow">Recorrido fiel al entorno de escritorio</p><h2 id="demo-title">Explora el menú real con información ficticia.</h2></div>
        <div className="read-only-pill"><span aria-hidden="true">●</span> Solo lectura · Datos ficticios</div>
      </div>

      <div ref={workspaceRef} className="workspace real-workspace" tabIndex={-1} aria-label="Demostración visual de Sistema Ink">
        <header className="app-titlebar real-titlebar">
          <span aria-hidden="true" />
          <strong>Atelier Demo</strong>
          <div className="titlebar-tools"><span>Actualización automática</span><WindowButton buttonRef={guideButtonRef} controls="context-guide" disabled={false} onClick={() => setGuideOpen((open) => !open)} pressed={guideOpen}>Guía</WindowButton><WindowButton>Actualizar</WindowButton></div>
          <div className="window-actions"><WindowButton>—</WindowButton><WindowButton>□</WindowButton><WindowButton danger>×</WindowButton></div>
        </header>

        <aside className="app-sidebar real-sidebar">
          <div className="company-identity"><div className="business-logo"><img src="./sistema-ink-icon.png" alt="Sistema Ink" /></div><strong>Atelier Demo</strong><small>Operación local</small></div>
          <div className="sidebar-scroll">
            <p className="nav-label">OPERACIÓN</p>
            <nav aria-label="Menú visual de Sistema Ink" data-guide-target="shell-navigation">
              {primaryModules.map((module) => renderNavButton(module))}
              <div className="more-navigation">
                <button className="more-toggle" type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} data-guide-target="more-options"><span aria-hidden="true">{moreOpen ? "▾" : "▸"}</span>MÁS OPCIONES</button>
                {moreOpen ? <div className="secondary-navigation">{secondaryModules.map((module) => renderNavButton(module, true))}</div> : null}
              </div>
            </nav>
          </div>
          <div className="sidebar-user"><div><strong>Marina Soto</strong><small>Administración demo</small></div><button type="button" disabled>Salir</button></div>
        </aside>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Módulo visible: {moduleCopy[active].title}.</p>
        <section ref={contentRef} className={`app-content real-app-content${active === "administracion" || active === "catalogo" ? " internal-module-content" : ""}`} data-guide-target="module-surface" data-active-submenu={active === "administracion" ? administrationView : active === "catalogo" ? catalogView : undefined}><ModuleContent active={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={showAdministrationView} onCatalogViewChange={showCatalogView} /></section>

        <footer className="app-statusbar real-statusbar" data-guide-target="status-bar"><span><i /> Modo demostración · datos ficticios</span><strong>Sistema Ink · Recorrido visual aislado</strong></footer>
        <InteractiveGuide active={active} open={guideOpen} onClose={closeGuide} workspaceRef={workspaceRef} />
      </div>
      <p className="demo-hint"><span aria-hidden="true">↖</span> El menú conserva la jerarquía visual del producto. Solo la navegación local está habilitada.</p>
    </section>
  );
}
