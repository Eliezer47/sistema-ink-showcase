"use client";

import { useState, type ReactNode } from "react";

type ModuleId = "panel" | "ventas" | "produccion" | "clientes" | "inventario" | "finanzas";

const modules: Array<{ id: ModuleId; label: string; glyph: string; caption: string }> = [
  { id: "panel", label: "Panel principal", glyph: "▦", caption: "Resumen operativo" },
  { id: "ventas", label: "Ventas", glyph: "◆", caption: "Pedidos y seguimiento" },
  { id: "produccion", label: "Producción", glyph: "◫", caption: "Cola de trabajo" },
  { id: "clientes", label: "Clientes", glyph: "◎", caption: "Relaciones comerciales" },
  { id: "inventario", label: "Inventario", glyph: "▤", caption: "Existencias y alertas" },
  { id: "finanzas", label: "Finanzas", glyph: "₵", caption: "Flujo y compromisos" },
];

const money = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
  maximumFractionDigits: 0,
});

function Status({ tone, children }: { tone: "teal" | "amber" | "blue" | "red"; children: ReactNode }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

function Kpi({ label, value, detail, tone = "teal" }: { label: string; value: string; detail: string; tone?: string }) {
  return (
    <article className={`kpi kpi-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function PanelModule() {
  const priorities = [
    ["DEMO-1048", "Café Lumbre", "Entrega hoy", "amber"],
    ["DEMO-1053", "Norte Creativo", "En producción", "blue"],
    ["DEMO-1041", "Casa Nativa", "Cobro pendiente", "red"],
    ["DEMO-1056", "Estudio Prisma", "Lista para entregar", "teal"],
  ] as const;

  return (
    <div className="module-layout">
      <div className="kpi-grid">
        <Kpi label="Pedidos activos" value="18" detail="4 requieren atención" tone="teal" />
        <Kpi label="Por cobrar" value={money.format(84650)} detail="6 documentos abiertos" tone="blue" />
        <Kpi label="Entregas de hoy" value="7" detail="3 ya confirmadas" tone="amber" />
        <Kpi label="Disponibilidad" value="96%" detail="12 alertas de stock" tone="violet" />
      </div>

      <div className="content-grid dashboard-grid">
        <section className="surface table-surface">
          <div className="surface-heading">
            <div><span className="section-kicker">Prioridad operativa</span><h3>Qué requiere atención</h3></div>
            <span className="muted-label">Hoy · Demo</span>
          </div>
          <div className="priority-list">
            {priorities.map(([order, customer, state, tone]) => (
              <div className="priority-row" key={order}>
                <span className="order-mark">{order.slice(-2)}</span>
                <div><strong>{customer}</strong><small>{order}</small></div>
                <Status tone={tone}>{state}</Status>
              </div>
            ))}
          </div>
        </section>

        <section className="surface">
          <div className="surface-heading">
            <div><span className="section-kicker">Flujo del día</span><h3>Avance por etapa</h3></div>
          </div>
          <div className="progress-list">
            {[["Captura", 14, 82], ["Producción", 9, 58], ["Calidad", 5, 36], ["Entrega", 7, 47]].map(([label, count, width]) => (
              <div className="progress-item" key={label as string}>
                <div><span>{label}</span><strong>{count}</strong></div>
                <div className="progress-track"><span style={{ width: `${width}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="capacity-note"><span>Capacidad estimada</span><strong>74%</strong><small>Jornada dentro de rango</small></div>
        </section>
      </div>
    </div>
  );
}

function SalesModule() {
  const rows = [
    ["DEMO-1056", "Estudio Prisma", "19 jul", "C$ 12,480", "Lista", "teal"],
    ["DEMO-1053", "Norte Creativo", "20 jul", "C$ 8,950", "Producción", "blue"],
    ["DEMO-1048", "Café Lumbre", "19 jul", "C$ 5,720", "Prioritaria", "amber"],
    ["DEMO-1041", "Casa Nativa", "18 jul", "C$ 16,300", "Por cobrar", "red"],
    ["DEMO-1039", "Línea Verde", "22 jul", "C$ 6,850", "Confirmada", "teal"],
  ] as const;

  return (
    <div className="module-layout">
      <div className="toolbar">
        <div className="search-field"><span aria-hidden="true">⌕</span><span>Buscar pedido o cliente…</span></div>
        <button className="ghost-button" type="button" disabled>Exportar</button>
        <button className="primary-button" type="button" disabled>+ Nueva venta</button>
      </div>
      <div className="kpi-grid compact-kpis">
        <Kpi label="Venta del día" value="C$ 31,620" detail="8 documentos" />
        <Kpi label="Ticket promedio" value="C$ 3,953" detail="+6% frente a ayer" tone="blue" />
        <Kpi label="Anticipos" value="C$ 12,400" detail="5 movimientos" tone="amber" />
      </div>
      <section className="surface table-surface wide-surface">
        <div className="surface-heading"><div><span className="section-kicker">Actividad reciente</span><h3>Ventas y pedidos</h3></div><span className="muted-label">Datos ficticios</span></div>
        <div className="data-table" role="table" aria-label="Ventas ficticias">
          <div className="table-row table-head" role="row"><span>Documento</span><span>Cliente</span><span>Entrega</span><span>Total</span><span>Estado</span></div>
          {rows.map(([document, customer, date, total, state, tone]) => (
            <div className="table-row" role="row" key={document}>
              <strong>{document}</strong><span>{customer}</span><span>{date}</span><span>{total}</span><span><Status tone={tone}>{state}</Status></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductionModule() {
  const lanes = [
    { title: "Por iniciar", count: 4, tone: "slate", cards: [["DEMO-1059", "12 camisetas", "09:40"], ["DEMO-1061", "2 rótulos PVC", "11:15"]] },
    { title: "En proceso", count: 6, tone: "blue", cards: [["DEMO-1053", "24 termos", "Estampado"], ["DEMO-1054", "60 etiquetas", "Corte"]] },
    { title: "Control de calidad", count: 3, tone: "amber", cards: [["DEMO-1048", "8 delantales", "Revisión"], ["DEMO-1055", "10 gorras", "Muestra"]] },
    { title: "Terminado", count: 5, tone: "teal", cards: [["DEMO-1056", "18 agendas", "Completo"], ["DEMO-1051", "6 tazas", "Empacado"]] },
  ];

  return (
    <div className="module-layout">
      <div className="production-summary"><div><strong>18</strong><span>trabajos activos</span></div><div><strong>5</strong><span>terminados hoy</span></div><div><strong>1.8 d</strong><span>tiempo promedio</span></div></div>
      <div className="kanban" aria-label="Flujo ficticio de producción">
        {lanes.map((lane) => (
          <section className={`lane lane-${lane.tone}`} key={lane.title}>
            <div className="lane-title"><div><span className="lane-dot" /><strong>{lane.title}</strong></div><span>{lane.count}</span></div>
            {lane.cards.map(([order, product, step]) => (
              <article className="work-card" key={order}>
                <small>{order}</small><strong>{product}</strong><span>{step}</span>
                <div className="avatar-line"><i>{order.slice(-1)}</i><em>Equipo demo</em></div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function CustomersModule() {
  const customers = [
    ["CLI-DEMO-021", "Café Lumbre", "Público", "Activo"],
    ["CLI-DEMO-018", "Norte Creativo", "Mayoreo", "Activo"],
    ["CLI-DEMO-014", "Casa Nativa", "Preferente", "Revisión"],
    ["CLI-DEMO-009", "Estudio Prisma", "Mayoreo", "Activo"],
  ];

  return (
    <div className="module-layout customer-layout">
      <section className="surface customer-list">
        <div className="surface-heading"><div><span className="section-kicker">Directorio</span><h3>Clientes</h3></div><span className="record-count">24 registros</span></div>
        <div className="search-field full-search"><span>⌕</span><span>Buscar por código, nombre o contacto…</span></div>
        <div className="simple-list">
          {customers.map(([code, name, price, state], index) => (
            <div className={`customer-row ${index === 0 ? "selected" : ""}`} key={code}>
              <span className="customer-avatar">{name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>
              <div><strong>{name}</strong><small>{code} · Lista {price}</small></div>
              <Status tone={state === "Activo" ? "teal" : "amber"}>{state}</Status>
            </div>
          ))}
        </div>
      </section>
      <section className="surface customer-detail">
        <div className="profile-heading"><span className="profile-avatar">CL</span><div><span className="section-kicker">Ficha comercial</span><h3>Café Lumbre</h3><p>Cliente ficticio para demostración</p></div></div>
        <div className="detail-grid">
          <div><span>Código</span><strong>CLI-DEMO-021</strong></div><div><span>Lista de precios</span><strong>Público</strong></div>
          <div><span>Contacto</span><strong>Andrea Demo</strong></div><div><span>Correo</span><strong>hola@cafelumbre.example</strong></div>
          <div><span>Crédito</span><strong>No habilitado</strong></div><div><span>Última compra</span><strong>17 jul 2026</strong></div>
        </div>
        <div className="mini-history"><div><span>Compras recientes</span><strong>C$ 24,580</strong></div><div><span>Pedidos activos</span><strong>2</strong></div><div><span>Saldo</span><strong>C$ 5,720</strong></div></div>
        <button className="primary-button detail-action" type="button" disabled>Editar cliente</button>
      </section>
    </div>
  );
}

function InventoryModule() {
  const rows = [
    ["INS-DEMO-014", "Tinta textil negra", "Producción", "18.5 kg", "Óptimo", "teal"],
    ["INS-DEMO-027", "Vinil blanco mate", "Producción", "42 m", "Óptimo", "teal"],
    ["PRO-DEMO-032", "Taza blanca 11 oz", "Producto", "16 u", "Bajo", "amber"],
    ["INS-DEMO-008", "Papel transfer A3", "Producción", "8 paq", "Reponer", "red"],
    ["PRO-DEMO-019", "Gorra algodón negra", "Producto", "34 u", "Óptimo", "teal"],
  ] as const;
  return (
    <div className="module-layout">
      <div className="kpi-grid compact-kpis inventory-kpis"><Kpi label="Valor estimado" value="C$ 186,420" detail="Existencias ficticias" /><Kpi label="Alertas" value="12" detail="3 requieren reposición" tone="amber" /><Kpi label="Movimientos hoy" value="27" detail="19 entradas · 8 salidas" tone="blue" /></div>
      <section className="surface table-surface wide-surface">
        <div className="surface-heading"><div><span className="section-kicker">Existencias</span><h3>Disponibilidad por concepto</h3></div><span className="muted-label">Almacén principal</span></div>
        <div className="data-table inventory-table" role="table" aria-label="Inventario ficticio">
          <div className="table-row table-head" role="row"><span>Código</span><span>Concepto</span><span>Tipo</span><span>Disponible</span><span>Nivel</span></div>
          {rows.map(([code, item, type, amount, state, tone]) => <div className="table-row" role="row" key={code}><strong>{code}</strong><span>{item}</span><span>{type}</span><span>{amount}</span><span><Status tone={tone}>{state}</Status></span></div>)}
        </div>
      </section>
    </div>
  );
}

function FinanceModule() {
  const bars = [62, 78, 55, 88, 73, 94, 81];
  return (
    <div className="module-layout">
      <div className="kpi-grid compact-kpis finance-kpis"><Kpi label="Disponible" value="C$ 128,740" detail="Caja y cuentas demo" /><Kpi label="Por cobrar" value="C$ 84,650" detail="Próximos 30 días" tone="blue" /><Kpi label="Por pagar" value="C$ 46,280" detail="7 compromisos" tone="amber" /></div>
      <div className="content-grid finance-grid">
        <section className="surface chart-surface">
          <div className="surface-heading"><div><span className="section-kicker">Últimos 7 días</span><h3>Movimiento de caja</h3></div><span className="positive-change">+12.4%</span></div>
          <div className="bar-chart" aria-label="Gráfico ilustrativo de movimiento de caja">
            {bars.map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{["L", "M", "M", "J", "V", "S", "D"][index]}</small></div>)}
          </div>
        </section>
        <section className="surface obligations">
          <div className="surface-heading"><div><span className="section-kicker">Próximos movimientos</span><h3>Compromisos</h3></div></div>
          {[["Tintas del Pacífico", "Compra demo", "C$ 14,800", "22 jul"], ["Servicios Creativos", "Orden demo", "C$ 9,600", "24 jul"], ["Empaques Centro", "Insumos demo", "C$ 6,450", "26 jul"]].map(([name, concept, amount, date]) => <div className="obligation-row" key={name}><span className="order-mark">{date.split(" ")[0]}</span><div><strong>{name}</strong><small>{concept} · vence {date}</small></div><strong>{amount}</strong></div>)}
        </section>
      </div>
    </div>
  );
}

function ModuleContent({ active }: { active: ModuleId }) {
  if (active === "ventas") return <SalesModule />;
  if (active === "produccion") return <ProductionModule />;
  if (active === "clientes") return <CustomersModule />;
  if (active === "inventario") return <InventoryModule />;
  if (active === "finanzas") return <FinanceModule />;
  return <PanelModule />;
}

export default function DemoWorkspace() {
  const [active, setActive] = useState<ModuleId>("panel");
  const current = modules.find((module) => module.id === active) ?? modules[0];

  return (
    <section className="demo-section" aria-labelledby="demo-title">
      <div className="demo-section-heading">
        <div><p className="eyebrow">Recorrido guiado</p><h2 id="demo-title">Explora seis áreas del producto.</h2></div>
        <div className="read-only-pill"><span aria-hidden="true">●</span> Solo lectura · Datos ficticios</div>
      </div>

      <div className="workspace">
        <header className="app-titlebar">
          <div className="window-brand"><span className="mini-logo">SI</span><strong>Atelier Demo</strong></div>
          <span className="titlebar-center">Sistema de gestión empresarial</span>
          <div className="window-actions" aria-hidden="true"><span>—</span><span>□</span><span>×</span></div>
        </header>

        <aside className="app-sidebar">
          <div className="business-card"><span className="business-logo">AD</span><div><strong>Atelier Demo</strong><small>Operación ficticia</small></div></div>
          <p className="nav-label">MÓDULOS</p>
          <nav aria-label="Módulos de la demostración">
            {modules.map((module) => (
              <button key={module.id} className={active === module.id ? "active" : ""} type="button" onClick={() => setActive(module.id)} aria-pressed={active === module.id}>
                <span className="nav-glyph" aria-hidden="true">{module.glyph}</span><span><strong>{module.label}</strong><small>{module.caption}</small></span>
              </button>
            ))}
          </nav>
          <div className="demo-user"><span>MS</span><div><strong>Marina Soto</strong><small>Usuario demostración</small></div></div>
        </aside>

        <section className="app-content" aria-live="polite">
          <div className="module-heading"><div><p>ATELIER DEMO / {current.label.toUpperCase()}</p><h2>{current.label}</h2><span>{current.caption} con información de muestra.</span></div><button className="ghost-button" type="button" disabled>Acciones no disponibles</button></div>
          <ModuleContent active={active} />
        </section>

        <footer className="app-statusbar"><span><i /> Entorno visual aislado</span><strong>DEMO · 19 JUL 2026</strong></footer>
      </div>
      <p className="demo-hint"><span aria-hidden="true">↖</span> Usa el menú de módulos para cambiar de pantalla. Ningún control modifica o envía información.</p>
    </section>
  );
}
