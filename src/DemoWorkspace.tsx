"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import InteractiveGuide, { type GuideModuleId } from "./InteractiveGuide";
import InternalViewContent, { type AdministrationViewId, type CatalogViewId } from "./InternalViews";
import { useDemoSession } from "./DemoSession";
import DemoControls from "./DemoControls";
import { AvailabilityExample, CashExample, CostCalculatorExample, CustomerItemsExample, CustomersExample, DeliveriesExample, FinanceExample, InventoryExample, ProductionExample, QualityExample, QuotesExample, SalesExample } from "./OperationalModules";
import ScenarioModule, { scenarioModules } from "./ScenarioModule";
import DemoDialog from "./DemoDialog";
import { Facts } from "./DemoPrimitives";
import { scenarioSummary } from "./demoScenario";

type ModuleId = GuideModuleId;

type ModuleDefinition = { id: ModuleId; label: string };
type InternalViewId = AdministrationViewId | CatalogViewId;
type InternalNavItem = { id: InternalViewId; label: string };

const primaryModules: ModuleDefinition[] = [
  { id: "panel", label: "Panel principal" },
  { id: "clientes", label: "Clientes" },
  { id: "disponibilidad", label: "Disponibilidad · F3" },
  { id: "metricas", label: "Métricas" },
  { id: "ventas", label: "Ventas" },
  { id: "caja", label: "Caja" },
  { id: "produccion", label: "Producción" },
  { id: "entregas", label: "Entregas" },
];

const secondaryModules: ModuleDefinition[] = [
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "finanzas", label: "Finanzas" },
  { id: "compras", label: "Compras" },
  { id: "inventario", label: "Inventario" },
  { id: "catalogo", label: "Catálogo" },
  { id: "administracion", label: "Administración" },
  { id: "calculadora", label: "Calculadora de costos" },
  { id: "articulos", label: "Artículos del cliente" },
  { id: "calidad", label: "Calidad" },
];

const moduleCopy: Record<ModuleId, { title: string; subtitle: string }> = {
  disponibilidad: { title: "Disponibilidad rápida", subtitle: "Existencias físicas, reservadas y libres por variante y almacén." },
  calculadora: { title: "Calculadora de costos", subtitle: "Simulación de costos y precios con tarifas ficticias." },
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
  { id: "cajas", label: "Cajas físicas" },
  { id: "auditoria", label: "Auditoría" },
  { id: "equipos", label: "Equipos conectados" },
  { id: "metricas-ventas", label: "Métricas de ventas" },
  { id: "estacion", label: "Estación e impresión" },
  { id: "diseno", label: "Diseño y navegación" },
  { id: "respaldos", label: "Respaldos" },
  { id: "inicio", label: "Puesta en marcha" },
];

const catalogViews: readonly InternalNavItem[] = [
  { id: "productos", label: "Productos y servicios" },
  { id: "categorias", label: "Categorías" },
  { id: "unidades", label: "Unidades" },
  { id: "atributos", label: "Atributos" },
  { id: "familias", label: "Familias y variantes" },
  { id: "acciones", label: "Acciones operativas" },
  { id: "personalizacion", label: "Perfiles de personalización" },
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

function InternalModule({ id, administrationView, catalogView, onAdministrationViewChange, onCatalogViewChange }: { id: "administracion" | "catalogo"; administrationView: AdministrationViewId; catalogView: CatalogViewId; onAdministrationViewChange: (view: AdministrationViewId) => void; onCatalogViewChange: (view: CatalogViewId) => void }) {
  const nav = id === "administracion" ? administrationViews : catalogViews;
  const activeInternal = id === "administracion" ? administrationView : catalogView;
  const activeLabel = nav.find((item) => item.id === activeInternal)?.label;
  return <div className={`real-module generic-real generic-${id} with-internal-nav`}>
    <aside className="internal-nav" data-guide-target="sub-navigation"><div className="internal-nav-heading"><strong>{id === "administracion" ? "ADMINISTRACIÓN" : "CATÁLOGO"}</strong><span>{id === "administracion" ? "Configuración general" : "Oferta comercial"}</span></div><div className="internal-nav-sections"><small>SECCIONES</small>{nav.map((item) => <button type="button" key={item.id} className={activeInternal === item.id ? "active" : ""} data-submenu-id={item.id} aria-controls="internal-view-host" aria-current={activeInternal === item.id ? "page" : undefined} aria-pressed={activeInternal === item.id} onClick={() => id === "administracion" ? onAdministrationViewChange(item.id as AdministrationViewId) : onCatalogViewChange(item.id as CatalogViewId)}>{item.label}</button>)}</div><p>{id === "administracion" ? "Los cambios de seguridad se auditan" : "Precios expresados en NIO"}</p></aside>
    <div className="internal-view-host" id="internal-view-host" role="region" aria-label={`Vista de ${activeLabel}`}>{id === "administracion" ? <InternalViewContent key={administrationView} section="administracion" activeView={administrationView} /> : <InternalViewContent key={catalogView} section="catalogo" activeView={catalogView} />}</div>
  </div>;
}

function ModuleContent({ active, administrationView, catalogView, onAdministrationViewChange, onCatalogViewChange }: { active: ModuleId; administrationView: AdministrationViewId; catalogView: CatalogViewId; onAdministrationViewChange: (view: AdministrationViewId) => void; onCatalogViewChange: (view: CatalogViewId) => void }) {
  if (active === "panel") return <PanelModule />;
  if (active === "metricas") return <MetricsModule />;
  if (active === "ventas") return <SalesExample />;
  if (active === "caja") return <CashExample />;
  if (active === "produccion") return <ProductionExample />;
  if (active === "clientes") return <CustomersExample />;
  if (active === "finanzas") return <FinanceExample />;
  if (active === "compras") return <PurchasesModule />;
  if (active === "inventario") return <InventoryExample />;
  if (active === "cotizaciones") return <QuotesExample />;
  if (active === "entregas") return <DeliveriesExample />;
  if (active === "articulos") return <CustomerItemsExample />;
  if (active === "calidad") return <QualityExample />;
  if (active === "calculadora") return <CostCalculatorExample />;
  if (active === "disponibilidad") return <AvailabilityExample />;
  return <InternalModule id={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={onAdministrationViewChange} onCatalogViewChange={onCatalogViewChange} />;
}

export default function DemoWorkspace() {
  const { state, dispatch } = useDemoSession();
  const [followingScenario, setFollowingScenario] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
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
    if (id === "disponibilidad") {
      setAvailabilityOpen(true);
      return;
    }
    setActive(id);
    setMoreOpen(secondary);
  };

  const navigate = (id: ModuleId) => showModule(id, secondaryModules.some((module) => module.id === id));

  useEffect(() => {
    if (state.mode === "simple" && !followingScenario && (active === "produccion" || active === "entregas")) setActive("ventas");
  }, [state.mode, followingScenario, active]);

  useEffect(() => {
    const handleAvailability = (event: KeyboardEvent) => {
      if (event.key === "F3") { event.preventDefault(); setAvailabilityOpen(true); }
    };
    window.addEventListener("keydown", handleAvailability);
    return () => window.removeEventListener("keydown", handleAvailability);
  }, []);

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
        <div><p className="eyebrow">INKGESTIÓN · REFERENCIA 1.10.3</p><h2 id="demo-title">Conoce las pantallas. Recorre un pedido.</h2></div>
        <div className="read-only-pill"><span aria-hidden="true">●</span> Demo interactiva · Datos ficticios</div>
      </div>

      <div className="demo-experience-toolbar">
        <div role="group" aria-label="Experiencia de demostración"><button type="button" aria-pressed={!followingScenario} onClick={() => setFollowingScenario(false)}>Explorar pantallas</button><button type="button" aria-pressed={followingScenario} onClick={() => { setFollowingScenario(true); setActive("panel"); }}>Seguir un pedido</button></div>
        <DemoControls compact />
        {followingScenario && <button type="button" onClick={() => { dispatch({ type: "reset" }); setActive("panel"); setGuideOpen(false); }}>Reiniciar ejemplo</button>}
      </div>
      <p className="demo-profile-note">Perfil de demostración con todos los módulos disponibles; Calculadora, Artículos del cliente y Calidad se muestran como accesos opcionales. En el producto, menú y permisos son configurables.</p>
      <div ref={workspaceRef} className="workspace real-workspace" tabIndex={-1} aria-label="Demostración visual de InkGestión">
        <header className="app-titlebar real-titlebar">
          <span aria-hidden="true" />
          <strong>Atelier Demo</strong>
          <div className="titlebar-tools"><span>Caja: Mostrador DEMO</span><WindowButton disabled={false} onClick={() => setAlertsOpen(true)}>Alertas · 3</WindowButton><WindowButton buttonRef={guideButtonRef} controls="context-guide" disabled={false} onClick={() => setGuideOpen((open) => !open)} pressed={guideOpen}>Guía</WindowButton><WindowButton>Actualizar</WindowButton></div>
          <div className="window-actions"><WindowButton>—</WindowButton><WindowButton>□</WindowButton><WindowButton danger>×</WindowButton></div>
        </header>

        <aside className="app-sidebar real-sidebar">
          <div className="company-identity"><div className="business-logo"><img src="./sistema-ink-icon.png" alt="InkGestión" /></div><strong>Atelier Demo</strong><small>Operación local</small></div>
          <div className="sidebar-scroll">
            <p className="nav-label">OPERACIÓN</p>
            <nav aria-label="Menú visual de InkGestión" data-guide-target="shell-navigation">
              {primaryModules.filter((module) => state.mode !== "simple" || (module.id !== "produccion" && module.id !== "entregas")).map((module) => renderNavButton(module))}
              <div className="more-navigation">
                <button className="more-toggle" type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} data-guide-target="more-options"><span aria-hidden="true">{moreOpen ? "▾" : "▸"}</span>MÁS OPCIONES</button>
                {moreOpen ? <div className="secondary-navigation">{secondaryModules.map((module) => renderNavButton(module, true))}</div> : null}
              </div>
            </nav>
          </div>
          <div className="sidebar-user"><div><strong>Marina Soto</strong><small>Administración demo</small></div><button type="button" disabled>Salir</button></div>
        </aside>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Módulo visible: {moduleCopy[active].title}.</p>
        <section ref={contentRef} className={`app-content real-app-content${active === "administracion" || active === "catalogo" ? " internal-module-content" : ""}`} data-guide-target="module-surface" data-active-submenu={active === "administracion" ? administrationView : active === "catalogo" ? catalogView : undefined}>{followingScenario && scenarioModules.has(active) ? <ScenarioModule key={active} active={active} onNavigate={navigate} /> : <ModuleContent active={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={showAdministrationView} onCatalogViewChange={showCatalogView} />}</section>

        <footer className="app-statusbar real-statusbar" data-guide-target="status-bar"><span><i /> {followingScenario ? "Pedido de ejemplo · Estado temporal" : "Modo demostración · datos ficticios"}</span><strong>InkGestión · Recorrido visual aislado</strong></footer>
        <InteractiveGuide active={active} open={guideOpen} onClose={closeGuide} workspaceRef={workspaceRef} />
      </div>
      {availabilityOpen && <DemoDialog wide title="Disponibilidad rápida · F3" onClose={() => setAvailabilityOpen(false)}><AvailabilityExample stock={followingScenario ? scenarioSummary(state) : undefined} /></DemoDialog>}
      {alertsOpen && <DemoDialog title="Centro de notificaciones" onClose={() => setAlertsOpen(false)}><div className="demo-alerts">{[
        { title: "Pedido listo sin entregar", detail: "PED-DEMO-0199 · Estudio Prisma", target: "entregas" as ModuleId },
        { title: "Transferencia por verificar", detail: "PED-DEMO-0190 · C$ 1,200.00", target: "caja" as ModuleId },
        { title: "Revisar segunda copia de respaldo", detail: "Copia externa · Estado ficticio pendiente", target: "administracion" as ModuleId },
      ].map((alert) => <article key={alert.title}><h3>{alert.title}</h3><p>{alert.detail}</p><button type="button" className="real-primary-button" onClick={() => { setAlertsOpen(false); setFollowingScenario(false); if (alert.target === "administracion") setAdministrationView("respaldos"); navigate(alert.target === "entregas" && state.mode === "simple" ? "ventas" : alert.target); }}>Abrir</button></article>)}</div><Facts items={[["Estado", "3 prioridades ficticias"], ["En el producto", "Alertas según permisos · Posponer · Marcar revisada · Restaurar"]]} /></DemoDialog>}
      <p className="demo-hint"><span aria-hidden="true">↖</span> Explora registros y vistas previas con los controles habilitados. Seguir un pedido permite simular el flujo; recargar reinicia todos los datos.</p>
    </section>
  );
}
