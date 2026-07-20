"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type CSSProperties, type RefObject } from "react";

export type GuideModuleId =
  | "panel"
  | "metricas"
  | "ventas"
  | "caja"
  | "produccion"
  | "clientes"
  | "cotizaciones"
  | "entregas"
  | "articulos"
  | "calidad"
  | "finanzas"
  | "compras"
  | "inventario"
  | "catalogo"
  | "administracion";

type GuideTarget =
  | "more-options"
  | "active-module"
  | "sub-navigation"
  | "module-header"
  | "module-metrics"
  | "flow-toolbar"
  | "workflow-columns"
  | "workspace-tabs"
  | "module-filter"
  | "record-list"
  | "selected-record"
  | "record-detail"
  | "module-surface"
  | "status-bar";

type GuideStep = {
  target: GuideTarget;
  title: string;
  message: string;
};

type TargetBox = { left: number; top: number; width: number; height: number; dock: "left" | "right" };

const moduleGuide: Record<GuideModuleId, { label: string; purpose: string; secondary?: boolean }> = {
  panel: { label: "Panel principal", purpose: "El flujo diario reúne prioridades, entregas, saldos y alertas." },
  metricas: { label: "Métricas", purpose: "El resumen ejecutivo conecta ventas, cobros, gastos y saldos sin revelar reglas internas." },
  ventas: { label: "Ventas", purpose: "La lista conserva juntos el pedido, su entrega, el estado y el total." },
  caja: { label: "Caja", purpose: "El panel de detalle explica el saldo antes de registrar un abono." },
  produccion: { label: "Producción", purpose: "La ficha lateral reúne proceso, cantidad, tiempo y materiales." },
  clientes: { label: "Clientes", purpose: "La ficha reúne el contacto y sus condiciones comerciales.", secondary: true },
  cotizaciones: { label: "Cotizaciones", purpose: "La vista organiza propuestas, vigencias, versiones y estados.", secondary: true },
  entregas: { label: "Control de entregas", purpose: "La vista distingue lo entregado, lo parcial y lo pendiente.", secondary: true },
  articulos: { label: "Artículos del cliente", purpose: "La sección sigue artículos recibidos, utilizados y devueltos.", secondary: true },
  calidad: { label: "Calidad", purpose: "La pantalla hace visibles incidencias, revisiones y correcciones.", secondary: true },
  finanzas: { label: "Finanzas", purpose: "La tabla muestra vencimientos y saldos ilustrativos.", secondary: true },
  compras: { label: "Compras", purpose: "La vista sigue el abastecimiento desde el documento hasta la recepción.", secondary: true },
  inventario: { label: "Inventario", purpose: "La lista muestra disponibilidad y nivel de reposición por concepto.", secondary: true },
  catalogo: { label: "Catálogo", purpose: "La ficha o editor explica el registro seleccionado.", secondary: true },
  administracion: { label: "Administración", purpose: "La ficha o editor presenta la configuración de la sección activa.", secondary: true },
};

const contentSteps: Record<GuideModuleId, GuideStep[]> = {
  panel: [
    { target: "module-metrics", title: "Indicadores de la jornada", message: "Estas tarjetas resumen el trabajo pendiente, las entregas y los saldos del día." },
    { target: "flow-toolbar", title: "Filtro del flujo", message: "El área permite enfocar la operación por proceso sin abandonar el panel." },
    { target: "workflow-columns", title: "Flujo operativo", message: "Los trabajos avanzan visualmente de Por hacer a Por entregar y Hecho hoy." },
  ],
  metricas: [
    { target: "module-metrics", title: "Indicadores ejecutivos", message: "Cinco tarjetas sintetizan ventas, cobros, gastos, utilidad estimada y cartera." },
    { target: "record-list", title: "Evolución semanal", message: "Las columnas comparan el avance del mes con valores completamente ficticios." },
    { target: "record-detail", title: "Líderes comerciales", message: moduleGuide.metricas.purpose },
  ],
  ventas: [
    { target: "workspace-tabs", title: "Dos vistas comerciales", message: "Aquí se alterna entre Ventas y pedidos y Documentos emitidos." },
    { target: "module-filter", title: "Búsqueda y estado", message: "Los filtros acotan la lista sin modificar información real." },
    { target: "record-list", title: "Pedidos visibles", message: moduleGuide.ventas.purpose },
  ],
  caja: [
    { target: "module-metrics", title: "Resumen de caja", message: "Los importes separan cobros del día, saldos y movimientos por verificar." },
    { target: "workspace-tabs", title: "Pendientes y movimientos", message: "Las dos vistas internas distinguen lo que falta cobrar de lo ocurrido hoy." },
    { target: "record-detail", title: "Composición del saldo", message: moduleGuide.caja.purpose },
  ],
  produccion: [
    { target: "record-list", title: "Cola de producción", message: "Cada trabajo muestra el proceso y la fecha comprometida." },
    { target: "selected-record", title: "Trabajo seleccionado", message: "La fila marcada determina qué información se explica en el panel lateral." },
    { target: "record-detail", title: "Detalle del proceso", message: moduleGuide.produccion.purpose },
  ],
  clientes: [
    { target: "module-filter", title: "Directorio comercial", message: "La búsqueda localiza clientes por código, nombre o contacto." },
    { target: "record-list", title: "Listado de clientes", message: "La tabla muestra datos ficticios y el estado de cada cuenta." },
    { target: "record-detail", title: "Ficha del cliente", message: moduleGuide.clientes.purpose },
  ],
  cotizaciones: genericSteps("Propuestas comerciales", moduleGuide.cotizaciones.purpose),
  entregas: genericSteps("Seguimiento de entregas", moduleGuide.entregas.purpose),
  articulos: genericSteps("Artículos en custodia", moduleGuide.articulos.purpose),
  calidad: genericSteps("Control de incidencias", moduleGuide.calidad.purpose),
  finanzas: [
    { target: "workspace-tabs", title: "Áreas financieras", message: "Cobranza, pagos y planificación se mantienen en una misma superficie." },
    { target: "module-metrics", title: "Panorama financiero", message: "Los indicadores separan saldo, vencido, documentos y recuperación." },
    { target: "record-list", title: "Vencimientos", message: moduleGuide.finanzas.purpose },
  ],
  compras: [
    { target: "module-header", title: "Acciones de compra", message: "Reporte, plantilla, importación y nueva compra permanecen visibles como en el producto real." },
    { target: "module-metrics", title: "Estado del abastecimiento", message: "Las tarjetas distinguen compras abiertas, atrasadas y valor pendiente de recepción." },
    { target: "record-list", title: "Compras y progreso", message: "La lista muestra proveedor, fecha esperada, avance y moneda." },
    { target: "record-detail", title: "Recepción contextual", message: moduleGuide.compras.purpose },
  ],
  inventario: [
    { target: "module-metrics", title: "Resumen de existencias", message: "Valor, alertas, movimientos y almacenes dan contexto a la operación." },
    { target: "record-list", title: "Disponibilidad", message: moduleGuide.inventario.purpose },
  ],
  catalogo: internalSteps("Catálogo", moduleGuide.catalogo.purpose),
  administracion: internalSteps("Administración", moduleGuide.administracion.purpose),
};

function genericSteps(title: string, purpose: string): GuideStep[] {
  return [
    { target: "module-header", title, message: "El encabezado identifica la función y conserva visibles sus acciones principales." },
    { target: "record-list", title: "Registros ilustrativos", message: purpose },
    { target: "record-detail", title: "Detalle contextual", message: "El panel derecho explica el registro sin conectarse a la lógica interna." },
  ];
}

function internalSteps(label: string, purpose: string): GuideStep[] {
  return [
    { target: "sub-navigation", title: `Secciones de ${label}`, message: "Este segundo menú cambia de pantalla dentro del módulo y sigue disponible durante la guía." },
    { target: "module-header", title: "Pantalla interna activa", message: "El encabezado confirma la subsección que se está consultando." },
    { target: "record-list", title: "Información de referencia", message: "Listas, tarjetas y tablas usan únicamente datos sintéticos." },
    { target: "record-detail", title: "Configuración o detalle", message: purpose },
  ];
}

function buildSteps(active: GuideModuleId): GuideStep[] {
  const current = moduleGuide[active];
  return [
    { target: "active-module", title: current.label, message: "La selección confirma el módulo actual. Puedes cambiar de sección aunque la guía esté abierta." },
    ...contentSteps[active],
    { target: "status-bar", title: "Entorno de demostración", message: "La barra inferior confirma que esta versión pública trabaja solo con información ficticia." },
  ];
}

const targetFallback: Partial<Record<GuideTarget, GuideTarget>> = {
  "active-module": "more-options",
  "selected-record": "record-list",
  "record-detail": "module-surface",
  "record-list": "module-surface",
  "module-header": "module-surface",
  "sub-navigation": "module-surface",
};

export default function InteractiveGuide({ active, open, onClose, workspaceRef }: { active: GuideModuleId; open: boolean; onClose: () => void; workspaceRef: RefObject<HTMLDivElement | null> }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<TargetBox | null>(null);
  const [cardTop, setCardTop] = useState(54);
  const steps = useMemo(() => buildSteps(active), [active]);
  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const step = steps[safeStepIndex];

  useLayoutEffect(() => {
    setStepIndex(0);
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  useLayoutEffect(() => {
    if (!open) return;

    const workspace = workspaceRef.current;
    if (!workspace) return;
    let describedTarget: HTMLElement | null = null;
    let previousDescription: string | null = null;

    const restoreDescription = () => {
      if (!describedTarget) return;
      if (previousDescription) describedTarget.setAttribute("aria-describedby", previousDescription);
      else describedTarget.removeAttribute("aria-describedby");
      describedTarget = null;
      previousDescription = null;
    };

    const describeTarget = (target: HTMLElement) => {
      if (target === describedTarget) return;
      restoreDescription();
      describedTarget = target;
      previousDescription = target.getAttribute("aria-describedby");
      const descriptionIds = new Set(previousDescription?.split(/\s+/).filter(Boolean) ?? []);
      descriptionIds.add("context-guide-message");
      target.setAttribute("aria-describedby", [...descriptionIds].join(" "));
    };

    const updateTarget = () => {
      const workspaceRect = workspace.getBoundingClientRect();
      const card = workspace.querySelector<HTMLElement>(".context-guide-card");
      const cardHeight = card?.offsetHeight ?? 280;
      const maximumTop = Math.max(54, workspaceRect.height - cardHeight - 36);
      setCardTop(Math.min(maximumTop, Math.max(54, 12 - workspaceRect.top)));

      const fallback = targetFallback[step.target];
      const target = workspace.querySelector<HTMLElement>(`[data-guide-target="${step.target}"]`)
        ?? (fallback ? workspace.querySelector<HTMLElement>(`[data-guide-target="${fallback}"]`) : null);
      if (!target) {
        restoreDescription();
        setTargetBox(null);
        return;
      }

      describeTarget(target);
      resizeObserver.observe(target);

      const targetRect = target.getBoundingClientRect();
      const visibleLeft = Math.max(workspaceRect.left + 2, targetRect.left);
      const visibleTop = Math.max(workspaceRect.top + 2, targetRect.top);
      const visibleRight = Math.min(workspaceRect.right - 2, targetRect.right);
      const visibleBottom = Math.min(workspaceRect.bottom - 2, targetRect.bottom);
      const width = visibleRight - visibleLeft;
      const height = visibleBottom - visibleTop;

      setTargetBox(width > 0 && height > 0 ? {
        left: visibleLeft - workspaceRect.left,
        top: visibleTop - workspaceRect.top,
        width,
        height,
        dock: visibleLeft - workspaceRect.left + width / 2 > workspaceRect.width * 0.58 ? "left" : "right",
      } : null);
    };

    const resizeObserver = new ResizeObserver(updateTarget);
    const mutationObserver = new MutationObserver(updateTarget);
    updateTarget();
    resizeObserver.observe(workspace);
    mutationObserver.observe(workspace, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-guide-target", "aria-pressed"] });
    workspace.addEventListener("scroll", updateTarget, true);
    window.addEventListener("scroll", updateTarget, true);
    window.addEventListener("resize", updateTarget);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      restoreDescription();
      workspace.removeEventListener("scroll", updateTarget, true);
      window.removeEventListener("scroll", updateTarget, true);
      window.removeEventListener("resize", updateTarget);
    };
  }, [open, step, workspaceRef]);

  if (!open) return null;

  const spotlightStyle = targetBox ? ({
    "--guide-left": `${targetBox.left}px`,
    "--guide-top": `${targetBox.top}px`,
    "--guide-width": `${targetBox.width}px`,
    "--guide-height": `${targetBox.height}px`,
  } as CSSProperties) : undefined;

  const goNext = () => {
    if (safeStepIndex === steps.length - 1) onClose();
    else setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  };

  return (
    <div className="context-guide-layer">
      {targetBox ? <div className={`context-guide-spotlight dock-${targetBox.dock}`} style={spotlightStyle} aria-hidden="true"><span /></div> : null}
      <aside id="context-guide" className={`context-guide-card dock-${targetBox?.dock ?? "right"}`} style={{ "--guide-card-top": `${cardTop}px` } as CSSProperties} role="region" aria-label={`Guía de ${moduleGuide[active].label}`}>
        <header>
          <div><small>GUÍA CONTEXTUAL</small><strong>{moduleGuide[active].label}</strong></div>
          <button type="button" onClick={onClose} aria-label="Cerrar guía">×</button>
        </header>
        <div id="context-guide-message" className="context-guide-message" role="status" aria-live="polite" aria-atomic="true">
          <span>Paso {safeStepIndex + 1} de {steps.length}</span>
          <h3>{step.title}</h3>
          <p>{step.message}</p>
        </div>
        <div className="context-guide-progress" aria-hidden="true">{steps.map((item, index) => <span className={index === safeStepIndex ? "active" : ""} key={`${item.target}-${index}`} />)}</div>
        <footer>
          <button type="button" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={safeStepIndex === 0}>Anterior</button>
          <small>La navegación sigue disponible</small>
          <button className="guide-next" type="button" onClick={goNext}>{safeStepIndex === steps.length - 1 ? "Terminar" : "Siguiente"}</button>
        </footer>
      </aside>
    </div>
  );
}
