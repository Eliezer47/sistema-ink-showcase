"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import InteractiveGuide, { type GuideModuleId } from "./InteractiveGuide";
import InternalViewContent, { type AdministrationViewId, type CatalogViewId } from "./InternalViews";
import { useDemoSession } from "./DemoSession";
import DemoControls from "./DemoControls";
import { AvailabilityExample, CashExample, CostCalculatorExample, CustomerItemsExample, CustomersExample, DeliveriesExample, FinanceExample, InventoryExample, ProductionExample, QualityExample, QuotesExample } from "./OperationalModules";
import { PurchasesExample } from "./PurchasesExample";
import { ReferenceActions, ReferenceField, ReferenceTable } from "./DesktopPrimitives";
import { SalesExample } from "./SalesExample";
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
  const [area, setArea] = useState("Todas las áreas");
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
        <div><h3>Flujo operativo</h3><select aria-label="Área del flujo" value={area} onChange={event => setArea(event.target.value)}>{["Todas las áreas", "Pedidos", "Producción", "Entregas", "Cobros", "Inventario"].map(label => <option key={label}>{label}</option>)}</select></div>
        <button className="real-primary-button" type="button" disabled>Abrir seleccionado</button>
      </div>
      <div className="workflow-columns" data-guide-target="workflow-columns">
        {columns.map((column) => (
          <section className={`workflow-column workflow-${column.tone}`} key={column.title}>
            <header><strong>{column.title}</strong><span>{column.rows.filter(row => area === "Todas las áreas" || row[2].startsWith(area === "Entregas" ? "Entrega" : area === "Cobros" ? "Cobro" : area)).length}</span></header>
            <div className="workflow-body">
              {column.rows.filter(row => area === "Todas las áreas" || row[2].startsWith(area === "Entregas" ? "Entrega" : area === "Cobros" ? "Cobro" : area)).map(([reference, customer, detail, time]) => (
                <article className="workflow-row" key={reference}>
                  <div><strong>{reference}</strong><span> · Operación demo</span></div>
                  <h4>{customer}</h4><p>{detail}</p><small>{time}</small>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="view-footnote"><span>Datos ficticios para demostración</span><span>Datos de ejemplo · Septiembre 2026</span></div>
    </div>
  );
}

function MetricsModule() {
  const weeklySales = [
    { label: "01/09", amount: "C$ 46,800", height: 46 },
    { label: "02/09", amount: "C$ 63,420", height: 67 },
    { label: "03/09", amount: "C$ 82,150", height: 88 },
    { label: "04/09", amount: "C$ 58,900", height: 61 },
  ];
  const leaders = [
    ["Camiseta promocional", "C$ 58,300", "23.2 %"],
    ["Taza personalizada", "C$ 41,950", "16.7 %"],
    ["Diseño e impresión", "C$ 33,680", "13.4 %"],
  ];
  const expenses = [
    ["Insumos de producción", "C$ 37,400", "44 %"],
    ["Servicios operativos", "C$ 21,850", "25.7 %"],
    ["Logística", "C$ 12,600", "14.8 %"],
  ];

  return (
    <div className="real-module executive-metrics-real">
      <ViewHeader title="Métricas" subtitle="Indicadores comerciales y financieros para la toma de decisiones." action="Actualizar" />
      <div className="desktop-period"><strong>Período</strong><ReferenceField label="Desde" value="01/09/2026" /><ReferenceField label="Hasta" value="30/09/2026" /><ReferenceField label="Vista" value="Devengado" /><ReferenceActions labels={["Hoy", "Mes actual", "Aplicar período"]} /></div>
      <div className="executive-kpis" data-guide-target="module-metrics">
        <article><span>VENTAS DEL PERÍODO</span><strong>C$ 251,270</strong><small>34 documentos activos</small></article>
        <article className="positive"><span>COBROS NETOS</span><strong>C$ 186,420</strong><small>74 % de lo emitido</small></article>
        <article className="negative"><span>GASTOS DEVENGADOS</span><strong>C$ 84,910</strong><small>Información ilustrativa</small></article>
        <article className="positive"><span>RESULTADO OPERATIVO</span><strong>C$ 166,360</strong><small>Resultado del período de ejemplo</small></article>
        <article className="warning"><span>POR COBRAR</span><strong>C$ 64,850</strong><small>6 documentos abiertos</small></article>
      </div>
      <div className="executive-panels">
        <section className="executive-card weekly-card" data-guide-target="record-list">
          <h3>Ventas por día</h3>
          <div className="weekly-chart">
            {weeklySales.map((item) => <div className="weekly-column" key={item.label}><small>{item.amount}</small><div><span style={{ height: `${item.height}%` }} /></div><b>{item.label}</b></div>)}
          </div>
        </section>
        <section className="executive-card ranking-card" data-guide-target="record-detail">
          <h3>Productos y servicios líderes</h3>
          {leaders.map(([label, amount, percent]) => <div className="ranking-row" key={label}><div><strong>{label}</strong><span>{amount}</span></div><div className="ranking-track"><span style={{ width: percent.replace(" ", "") }} /></div><small>{percent} de ventas</small></div>)}
        </section>
        <section className="executive-card ranking-card expense-card">
          <h3>Gastos por categoría</h3>
          {expenses.map(([label, amount, percent]) => <div className="ranking-row" key={label}><div><strong>{label}</strong><span>{amount}</span></div><div className="ranking-track"><span style={{ width: percent.replace(" ", "") }} /></div><small>{percent} del gasto</small></div>)}
        </section>
      </div>
      <section className="executive-card desktop-profit"><h3>Rentabilidad comercial y productiva</h3><ReferenceTable headers={["Cliente", "Ingreso por conceptos", "Costo reconocido", "Ganancia bruta", "Margen"]} rows={[["Café Lumbre", "C$ 3,000.00", "C$ 1,680.00", "C$ 1,320.00", "44 %"], ["Norte Creativo", "C$ 4,350.00", "C$ 2,895.00", "C$ 1,455.00", "33.4 %"]]} /></section>
      <div className="view-footnote"><span>Valores sintéticos · sin cálculos del producto real</span><span>Período de ejemplo · Septiembre 2026</span></div>
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

function ModuleContent({ active, administrationView, catalogView, onAdministrationViewChange, onCatalogViewChange, onNewSalesExample }: { onNewSalesExample: () => void; active: ModuleId; administrationView: AdministrationViewId; catalogView: CatalogViewId; onAdministrationViewChange: (view: AdministrationViewId) => void; onCatalogViewChange: (view: CatalogViewId) => void }) {
  if (active === "panel") return <PanelModule />;
  if (active === "metricas") return <MetricsModule />;
  if (active === "ventas") return <SalesExample onNewExample={onNewSalesExample} />;
  if (active === "caja") return <CashExample />;
  if (active === "produccion") return <ProductionExample />;
  if (active === "clientes") return <CustomersExample />;
  if (active === "finanzas") return <FinanceExample />;
  if (active === "compras") return <PurchasesExample />;
  if (active === "inventario") return <InventoryExample />;
  if (active === "cotizaciones") return <QuotesExample />;
  if (active === "entregas") return <DeliveriesExample />;
  if (active === "articulos") return <CustomerItemsExample />;
  if (active === "calidad") return <QualityExample />;
  if (active === "calculadora") return <CostCalculatorExample />;
  if (active === "disponibilidad") return <AvailabilityExample />;
  return <InternalModule id={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={onAdministrationViewChange} onCatalogViewChange={onCatalogViewChange} />;
}

export default function DemoWorkspace({ expanded, expandButtonRef, onToggleExpanded, onShowViews }: {
  expanded: boolean;
  expandButtonRef: RefObject<HTMLButtonElement | null>;
  onToggleExpanded: () => void;
  onShowViews: () => void;
}) {
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ overflow: false, left: false, right: false });
  const simpleNavigation: ModuleId[] = ["panel", "metricas", "clientes", "ventas", "caja", "disponibilidad"];
  const visiblePrimary = state.mode === "simple"
    ? primaryModules.filter((module) => simpleNavigation.includes(module.id)).sort((a, b) => simpleNavigation.indexOf(a.id) - simpleNavigation.indexOf(b.id))
    : primaryModules;
  const selectableModules = [...visiblePrimary, ...secondaryModules];

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const workspace = workspaceRef.current;
    if (!viewport || !workspace) return;
    const updatePan = () => {
      const remaining = viewport.scrollWidth - viewport.clientWidth;
      const next = { overflow: remaining > 1, left: viewport.scrollLeft > 1, right: viewport.scrollLeft < remaining - 1 };
      setPan((previous) => previous.overflow === next.overflow && previous.left === next.left && previous.right === next.right ? previous : next);
    };
    const observer = new ResizeObserver(updatePan);
    observer.observe(viewport);
    observer.observe(workspace);
    viewport.addEventListener("scroll", updatePan);
    updatePan();
    return () => { observer.disconnect(); viewport.removeEventListener("scroll", updatePan); };
  }, []);

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
    if (state.mode === "simple") setActive((current) => current === "produccion" || current === "entregas" ? "ventas" : current);
  }, [state.mode, followingScenario]);

  useEffect(() => {
    const handleAvailability = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        event.preventDefault();
        if (!document.querySelector("dialog[open]")) setAvailabilityOpen(true);
      }
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
    requestAnimationFrame(() => guideButtonRef.current?.focus({ preventScroll: true }));
  };

  const renderNavButton = (module: ModuleDefinition, secondary = false) => (
    <button key={module.id} className={`sidebar-nav-button${active === module.id ? " active" : ""}`} type="button" onClick={() => showModule(module.id, secondary)} aria-pressed={active === module.id} data-guide-target={active === module.id ? "active-module" : undefined}>
      {module.label}
    </button>
  );

  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <h2 id="demo-title" className="sr-only">Explorar InkGestión</h2>

      <div className="demo-experience-toolbar">
        {expanded && <p className="demo-expanded-notice"><strong>InkGestión</strong> Demo del sistema de escritorio · Datos ficticios</p>}
        <div role="group" aria-label="Experiencia de demostración"><button type="button" aria-pressed={!followingScenario} onClick={() => setFollowingScenario(false)}>Explorar pantallas</button><button type="button" aria-pressed={followingScenario} onClick={() => { setFollowingScenario(true); if (!scenarioModules.has(active)) navigate("panel"); }}>Seguir un pedido</button></div>
        <DemoControls compact />
        <div className="demo-workspace-actions">
          <button ref={guideButtonRef} type="button" aria-controls="context-guide" aria-pressed={guideOpen} onClick={() => setGuideOpen((open) => !open)}>Guía</button>
          <button type="button" aria-haspopup="dialog" onClick={onShowViews}>Más vistas</button>
          <button ref={expandButtonRef} type="button" aria-pressed={expanded} onClick={onToggleExpanded}>{expanded ? "Salir de vista ampliada" : "Ampliar vista"}</button>
          {followingScenario && <button type="button" aria-label="Reiniciar ejemplo" onClick={() => { dispatch({ type: "reset" }); navigate("panel"); setGuideOpen(false); }}>Reiniciar</button>}
        </div>
        <p className="demo-experience-notice">{followingScenario ? (scenarioModules.has(active) ? "Recorrido guiado · Pasos abreviados de un pedido" : "Pantalla de referencia · Sus registros no cambian con el pedido") : "Pantallas de referencia · Registros de muestra"}<span>Funciones según edición y permisos</span></p>
      </div>
      <div className="demo-viewport-navigation" hidden={!pan.overflow}>
        <label>Pantalla<select aria-label="Ir a pantalla" value={active} onChange={(event) => {
          const id = event.target.value as ModuleId;
          navigate(id);
          if (id !== "disponibilidad") viewportRef.current?.scrollTo({ left: 190 });
        }}>
          {!selectableModules.some((module) => module.id === active) && <option value={active}>{moduleCopy[active].title} · Paso del pedido</option>}
          {selectableModules.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
        </select></label>
        <div className="demo-pan-actions">
          <button type="button" disabled={!pan.left} aria-label="Desplazar vista a la izquierda" onClick={() => viewportRef.current?.scrollBy({ left: -viewportRef.current.clientWidth * 0.8 })}>←</button>
          <button type="button" disabled={!pan.right} aria-label="Desplazar vista a la derecha" onClick={() => viewportRef.current?.scrollBy({ left: viewportRef.current.clientWidth * 0.8 })}>→</button>
        </div>
        <p id="demo-pan-hint">Vista de escritorio · Desliza o usa las flechas para recorrerla.</p>
      </div>
      <div ref={viewportRef} className="demo-workspace-scroll" role="region" aria-label="Ventana del sistema" aria-describedby={pan.overflow ? "demo-pan-hint" : undefined} tabIndex={0}>
      <div ref={workspaceRef} className="workspace real-workspace" tabIndex={-1} aria-label="Demostración visual de InkGestión">
        <header className="app-titlebar real-titlebar">
          <span aria-hidden="true" />
          <strong>Atelier Demo</strong>
          <div className="titlebar-tools"><span>Caja: Mostrador DEMO</span><WindowButton disabled={false} onClick={() => setAlertsOpen(true)}>Alertas · 3</WindowButton><WindowButton>Actualizar</WindowButton></div>
          <div className="window-actions"><WindowButton>—</WindowButton><WindowButton>□</WindowButton><WindowButton danger>×</WindowButton></div>
        </header>

        <aside className="app-sidebar real-sidebar">
          <div className="company-identity"><div className="business-logo"><img src="./sistema-ink-icon.png" alt="InkGestión" /></div><strong>Atelier Demo</strong><small>Operación local</small></div>
          <div className="sidebar-scroll">
            <p className="nav-label">OPERACIÓN</p>
            <nav aria-label="Menú visual de InkGestión" data-guide-target="shell-navigation">
              {visiblePrimary.map((module) => renderNavButton(module))}
              <div className="more-navigation">
                <button className="more-toggle" type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} data-guide-target="more-options"><span aria-hidden="true">{moreOpen ? "▾" : "▸"}</span>MÁS OPCIONES</button>
                {moreOpen ? <div className="secondary-navigation">{secondaryModules.map((module) => renderNavButton(module, true))}</div> : null}
              </div>
            </nav>
          </div>
          <div className="sidebar-user"><div><strong>Marina Soto</strong><small>Administración demo</small></div><button type="button" disabled>Salir</button></div>
        </aside>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Módulo visible: {moduleCopy[active].title}.</p>
        <section ref={contentRef} className={`app-content real-app-content${active === "administracion" || active === "catalogo" ? " internal-module-content" : ""}`} data-guide-target="module-surface" data-active-submenu={active === "administracion" ? administrationView : active === "catalogo" ? catalogView : undefined}>{followingScenario && scenarioModules.has(active) ? <ScenarioModule key={active} active={active} onNavigate={navigate} /> : <ModuleContent onNewSalesExample={() => { dispatch({ type: "reset" }); dispatch({ type: "approve" }); setFollowingScenario(true); navigate("ventas"); }} active={active} administrationView={administrationView} catalogView={catalogView} onAdministrationViewChange={showAdministrationView} onCatalogViewChange={showCatalogView} />}</section>

        <footer className="app-statusbar real-statusbar" data-guide-target="status-bar"><span><i /> {followingScenario ? "Pedido de ejemplo" : "Explorar pantallas"}</span><strong>InkGestión</strong></footer>
        <InteractiveGuide active={active} open={guideOpen} onClose={closeGuide} workspaceRef={workspaceRef} />
      </div>
      </div>
      {availabilityOpen && <DemoDialog wide title="Disponibilidad rápida · F3" onClose={() => setAvailabilityOpen(false)}><AvailabilityExample stock={followingScenario ? scenarioSummary(state) : undefined} /></DemoDialog>}
      {alertsOpen && <DemoDialog title="Centro de notificaciones" onClose={() => setAlertsOpen(false)}><div className="demo-alerts">{[
        { title: "Pedido listo sin entregar", detail: "PED-DEMO-0199 · Estudio Prisma", target: "entregas" as ModuleId },
        { title: "Transferencia por verificar", detail: "PED-DEMO-0190 · C$ 1,200.00", target: "caja" as ModuleId },
        { title: "Revisar segunda copia de respaldo", detail: "Copia externa · Estado ficticio pendiente", target: "administracion" as ModuleId },
      ].map((alert) => <article key={alert.title}><h3>{alert.title}</h3><p>{alert.detail}</p><button type="button" className="real-primary-button" onClick={() => { setAlertsOpen(false); setFollowingScenario(false); if (alert.target === "administracion") setAdministrationView("respaldos"); navigate(alert.target === "entregas" && state.mode === "simple" ? "ventas" : alert.target); }}>Abrir</button></article>)}</div><Facts items={[["Estado", "3 prioridades ficticias"], ["En el producto", "Alertas según permisos · Posponer · Marcar revisada · Restaurar"]]} /></DemoDialog>}
    </section>
  );
}
