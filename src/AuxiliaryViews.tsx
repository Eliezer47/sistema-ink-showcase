import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";

type AuxiliaryViewId = "login" | "server" | "pin" | "printing" | "receipt" | "connection";

type AuxiliaryViewDefinition = {
  id: AuxiliaryViewId;
  label: string;
  title: string;
  purpose: string;
  benefit: string;
};

const auxiliaryViews: readonly AuxiliaryViewDefinition[] = [
  {
    id: "login",
    label: "Acceso",
    title: "Cada usuario entra con su propia cuenta.",
    purpose: "La estación muestra el servidor disponible y permite ingresar con contraseña. El usuario puede recordarse sin guardar la clave.",
    benefit: "Inicio ágil y operaciones identificadas por usuario.",
  },
  {
    id: "server",
    label: "Servidor",
    title: "El servidor se encuentra desde la aplicación.",
    purpose: "Las estaciones disponibles aparecen en una lista clara y también puede indicarse un equipo manualmente durante la instalación.",
    benefit: "Facilita agregar o recuperar puestos de trabajo.",
  },
  {
    id: "pin",
    label: "PIN",
    title: "Un acceso más rápido en el equipo habitual.",
    purpose: "El usuario puede configurar un PIN de seis dígitos y conservar la contraseña como alternativa.",
    benefit: "Menos pasos diarios manteniendo una cuenta por persona.",
  },
  {
    id: "printing",
    label: "Impresión",
    title: "Cada documento sale en el formato adecuado.",
    purpose: "La estación puede usar una impresora para Carta o A4 y otra para recibos térmicos, con prueba directa y vista previa.",
    benefit: "Reportes y bauchers separados sin reconfigurar cada impresión.",
  },
  {
    id: "receipt",
    label: "Baucher",
    title: "Recibos térmicos adaptados al mostrador.",
    purpose: "El baucher admite papel de 58 y 80 mm, logo, identificación de caja, mensaje final y opciones para equipos compatibles.",
    benefit: "Una salida compacta y reconocible, lista para entregar al cliente.",
  },
  {
    id: "connection",
    label: "Continuidad",
    title: "Si la conexión falla, el sistema lo hace evidente.",
    purpose: "La zona de trabajo se pausa y conserva el contexto visible mientras se comprueba la comunicación con el servidor.",
    benefit: "Reduce el riesgo de continuar una operación que no puede confirmarse.",
  },
];

function LoginPreview() {
  return (
    <article className="aux-window aux-login-window" aria-label="Recreación visual del inicio de sesión">
      <div className="aux-window-titlebar">
        <span>Iniciar sesión</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-login-body">
        <header className="aux-login-brand">
          <div className="aux-login-logo"><img src="./sistema-ink-icon.png" alt="" /></div>
          <div><h4>Atelier Demo</h4><p>Acceso seguro · Entorno ficticio</p></div>
        </header>
        <div className="aux-login-modes" aria-label="Formas de acceso ilustrativas">
          <span className="aux-mode-active">Contraseña</span><span>PIN de 6 dígitos</span>
        </div>
        <div className="aux-form-field">
          <span>Usuario</span>
          <div className="aux-input-surface" role="textbox" aria-label="Usuario de demostración" aria-readonly="true">marina.demo</div>
        </div>
        <div className="aux-form-field">
          <span>Contraseña</span>
          <div className="aux-password-row">
            <div className="aux-input-surface aux-secret-value" role="textbox" aria-label="Contraseña oculta de demostración" aria-readonly="true">••••••••••</div>
            <button type="button" disabled aria-label="Mostrar contraseña no disponible">◉</button>
          </div>
        </div>
        <div className="aux-login-options">
          <span><i aria-hidden="true">✓</i> Recordar usuario</span>
          <span><i aria-hidden="true" /> Configurar PIN al ingresar</span>
        </div>
        <aside className="aux-security-note">Este equipo puede recordar el usuario, pero nunca almacena su contraseña.</aside>
        <div className="aux-server-status"><span><i aria-hidden="true" /> Servidor DEMO disponible</span><button type="button" disabled>Cambiar servidor</button></div>
        <button className="aux-primary-action" type="button" disabled>Iniciar sesión</button>
      </div>
    </article>
  );
}

function ServerPreview() {
  return (
    <article className="aux-window aux-server-window" aria-label="Recreación visual de la selección de servidor">
      <div className="aux-window-titlebar">
        <span>Conectar con el servidor</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-server-body">
        <header className="aux-server-heading">
          <div><h4>Servidor del sistema</h4><p>Selecciona un servidor ficticio de esta red.</p></div>
          <button type="button" disabled>Buscar en la red</button>
        </header>
        <div className="aux-server-layout">
          <section className="aux-server-results" aria-label="Servidores de demostración encontrados">
            <h5>Servidores encontrados</h5>
            <div className="aux-server-table">
              <div className="aux-server-row aux-server-row-head"><span>Equipo</span><span>Red</span><span>Estado</span></div>
              <div className="aux-server-row aux-server-row-selected"><strong>SERVIDOR DEMO</strong><span>Red local DEMO</span><span>Disponible</span></div>
              <div className="aux-server-row"><strong>RESPALDO DEMO</strong><span>Red local DEMO</span><span>En espera</span></div>
            </div>
            <p className="aux-discovery-note"><i aria-hidden="true" /> Búsqueda ilustrativa completada · Sin tráfico de red</p>
          </section>
          <aside className="aux-manual-server">
            <h5>Conexión manual</h5>
            <p>Esta recreación oculta la configuración técnica del producto.</p>
            <div className="aux-form-field"><span>Nombre del equipo</span><div className="aux-input-surface" role="textbox" aria-label="Equipo ficticio" aria-readonly="true">SERVIDOR-DEMO</div></div>
            <div className="aux-form-field"><span>Configuración segura</span><div className="aux-input-surface aux-muted-value" role="textbox" aria-label="Configuración segura no expuesta" aria-readonly="true">Administrada por el instalador</div></div>
            <button type="button" disabled>Comprobar y conectar</button>
            <small>No se muestran puertos, certificados, servicios ni direcciones reales.</small>
          </aside>
        </div>
        <footer className="aux-server-actions"><span>Datos ficticios · Servidor DEMO seleccionado</span><button type="button" disabled>Cancelar</button><button className="aux-primary-action" type="button" disabled>Usar seleccionado</button></footer>
      </div>
    </article>
  );
}

function PinPreview() {
  return (
    <article className="aux-window aux-pin-window" aria-label="Recreación visual de la configuración de PIN">
      <div className="aux-window-titlebar">
        <span>Configurar PIN</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-pin-body">
        <header><h4>Acceso rápido en este equipo</h4><p>Elige seis dígitos. Podrás seguir ingresando con tu contraseña.</p></header>
        <div className="aux-form-field"><span>Nuevo PIN</span><div className="aux-pin-input" role="textbox" aria-label="Nuevo PIN oculto de demostración" aria-readonly="true"><i /><i /><i /><i /><i /><i /></div></div>
        <div className="aux-form-field"><span>Confirmar PIN</span><div className="aux-pin-input" role="textbox" aria-label="Confirmación de PIN oculta de demostración" aria-readonly="true"><i /><i /><i /><i /><i /><i /></div></div>
        <aside className="aux-security-note"><strong>Solo en este equipo</strong><span>La demostración no registra, valida ni conserva ningún PIN.</span></aside>
        <footer className="aux-pin-actions"><button type="button" disabled>Cancelar</button><button className="aux-primary-action" type="button" disabled>Guardar PIN</button></footer>
      </div>
    </article>
  );
}

function PrintingPreview() {
  return (
    <article className="aux-window aux-printing-window" aria-label="Recreación visual de la configuración de impresoras">
      <div className="aux-window-titlebar">
        <span>Administración · Estación e impresión</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-printing-body">
        <header className="aux-printing-heading">
          <div><h4>Impresoras predeterminadas</h4><p>Una salida distinta para cada tipo de documento.</p></div>
          <button type="button" disabled>Detectar impresoras</button>
        </header>
        <div className="aux-printing-grid">
          <section>
            <small>FORMATO NORMAL · CARTA / A4</small>
            <h5>Documentos administrativos</h5>
            <p>Reportes, facturas y documentos para archivo.</p>
            <div className="aux-form-field"><span>Impresora seleccionada</span><div className="aux-input-surface">Impresora Oficina DEMO</div></div>
            <div className="aux-print-actions"><button type="button" disabled>Imprimir prueba</button><button type="button" disabled>Vista previa</button></div>
          </section>
          <section className="aux-printing-thermal">
            <small>FORMATO BAUCHER · RECIBO TÉRMICO</small>
            <h5>Comprobantes de caja</h5>
            <p>Salida compacta para el mostrador.</p>
            <div className="aux-form-field"><span>Impresora seleccionada</span><div className="aux-input-surface">Térmica Caja DEMO</div></div>
            <div className="aux-print-choice"><span>Método</span><strong>Combinada · logo y texto</strong></div>
            <div className="aux-paper-options" aria-label="Formatos térmicos ilustrativos"><span className="is-selected">80 mm</span><span>58 mm</span></div>
            <div className="aux-print-actions"><button type="button" disabled>Imprimir prueba</button><button type="button" disabled>Vista previa</button></div>
          </section>
        </div>
        <aside className="aux-printing-note">La prueba se envía a la impresora elegida. La vista previa permite revisar el tamaño, guardar PDF o seleccionar otra impresora.</aside>
      </div>
    </article>
  );
}

function ReceiptPreview() {
  return (
    <article className="aux-window aux-receipt-window" aria-label="Recreación visual de un baucher térmico">
      <div className="aux-window-titlebar">
        <span>Vista previa · Recibo de caja</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-receipt-toolbar">
        <div><strong>Baucher térmico</strong><span>Vista ilustrativa · sin impresión</span></div>
        <div><button type="button" disabled>Guardar PDF</button><button className="aux-primary-action" type="button" disabled>Imprimir</button></div>
      </div>
      <div className="aux-receipt-stage">
        <aside className="aux-receipt-settings">
          <small>FORMATO DEL PAPEL</small>
          <div className="aux-paper-options"><span className="is-selected">80 mm</span><span>58 mm</span></div>
          <dl>
            <div><dt>Diseño</dt><dd>Logo y texto</dd></div>
            <div><dt>Identificación</dt><dd>CAJA DEMO</dd></div>
            <div><dt>Salida</dt><dd>Corte automático</dd></div>
            <div><dt>Efectivo</dt><dd>Apertura de cajón</dd></div>
          </dl>
          <p>Opciones sujetas a compatibilidad de la impresora.</p>
        </aside>
        <div className="aux-receipt-paper-wrap">
          <div className="aux-receipt-paper">
            <img src="./sistema-ink-icon.png" alt="" />
            <h5>ATELIER DEMO</h5>
            <p>RECIBO DE CAJA</p>
            <hr />
            <div><span>Recibo</span><strong>REC-DEMO-0148</strong></div>
            <div><span>Fecha</span><strong>20/07/2026 16:42</strong></div>
            <div><span>Caja</span><strong>CAJA DEMO</strong></div>
            <div><span>Cliente</span><strong>Casa Nativa</strong></div>
            <div><span>Pedido</span><strong>PED-DEMO-1048</strong></div>
            <hr />
            <div><span>Abono recibido</span><strong>C$ 2,500.00</strong></div>
            <div className="aux-receipt-total"><span>TOTAL RECIBIDO</span><strong>C$ 2,500.00</strong></div>
            <hr />
            <p>Gracias por su compra</p>
            <small>No válido como comprobante fiscal</small>
            <small>Sistema Ink · Datos ficticios</small>
          </div>
        </div>
      </div>
    </article>
  );
}

function ConnectionPreview() {
  return (
    <article className="aux-window aux-connection-window" aria-label="Recreación visual del estado sin comunicación con el servidor">
      <div className="aux-window-titlebar">
        <span>Atelier Demo</span>
        <div className="aux-window-controls" aria-hidden="true"><i>—</i><i>□</i><i>×</i></div>
      </div>
      <div className="aux-connection-stage">
        <div className="aux-connection-dimmed" aria-hidden="true">
          <aside className="aux-connection-sidebar">
            <div className="aux-connection-brand"><img src="./sistema-ink-icon.png" alt="" /><strong>Atelier Demo</strong><small>Operación local</small></div>
            <span className="aux-connection-nav-active">Panel principal</span><span>Ventas</span><span>Caja</span><span>Producción</span>
          </aside>
          <section className="aux-connection-content">
            <header><div><h4>Panel principal</h4><p>Pedidos pendientes y prioridades de la operación</p></div><button type="button" disabled>Actualizar</button></header>
            <div className="aux-connection-metrics"><span /><span /><span /><span /></div>
            <div className="aux-connection-placeholder"><span /><span /><span /></div>
          </section>
        </div>
        <section className="aux-connection-overlay" aria-labelledby="aux-connection-title">
          <span className="aux-connection-alert" aria-hidden="true">!</span>
          <h4 id="aux-connection-title">Sin comunicación con el servidor</h4>
          <p>La zona de trabajo se pausó para evitar capturas o guardados que no puedan procesarse. Tus datos visibles permanecen en pantalla.</p>
          <button type="button" disabled>Comprobar conexión</button>
          <small>Servidor DEMO sin respuesta · Comprobación deshabilitada</small>
        </section>
      </div>
      <footer className="aux-connection-status">
        <span><i aria-hidden="true" /> Conexión pausada</span><strong>Sistema Ink · Entorno de demostración</strong>
      </footer>
    </article>
  );
}

const previews: Record<AuxiliaryViewId, ComponentType> = {
  login: LoginPreview,
  server: ServerPreview,
  pin: PinPreview,
  printing: PrintingPreview,
  receipt: ReceiptPreview,
  connection: ConnectionPreview,
};

const AUTO_ADVANCE_MS = 8000;

export default function AuxiliaryViews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [interactionPause, setInteractionPause] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const pagerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeView = auxiliaryViews[activeIndex];
  const ActivePreview = previews[activeView.id];
  const autoplayActive = !manualPause
    && !interactionPause
    && !prefersReducedMotion
    && isDocumentVisible
    && isInViewport;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplayActive) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % auxiliaryViews.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [autoplayActive, activeIndex]);

  const selectView = (index: number, moveFocus = false) => {
    const nextIndex = (index + auxiliaryViews.length) % auxiliaryViews.length;
    setActiveIndex(nextIndex);
    setAnnouncement("Vista " + (nextIndex + 1) + " de " + auxiliaryViews.length + ": " + auxiliaryViews[nextIndex].label);
    if (moveFocus) pagerRefs.current[nextIndex]?.focus();
  };

  const handlePagerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % auxiliaryViews.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + auxiliaryViews.length) % auxiliaryViews.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = auxiliaryViews.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectView(nextIndex, true);
  };

  return (
    <section
      aria-labelledby="feature-carousel-title"
      aria-roledescription="carrusel"
      className="feature-carousel"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPause(false);
      }}
      onFocusCapture={() => setInteractionPause(true)}
      onPointerEnter={() => setInteractionPause(true)}
      onPointerLeave={() => setInteractionPause(false)}
      ref={sectionRef}
      role="region"
    >
      <header className="feature-carousel__header">
        <div>
          <p className="aux-eyebrow">Funciones que completan la experiencia</p>
          <h2 id="feature-carousel-title">Detalles que hacen más simple el trabajo diario.</h2>
          <p>Acceso, conexión e impresión, presentados tal como se reconocen dentro del sistema.</p>
        </div>
        <p className="feature-carousel__boundary">Vista ilustrativa · Datos ficticios · Sin conexiones ni impresiones</p>
      </header>

      <article
        aria-label={(activeIndex + 1) + " de " + auxiliaryViews.length}
        aria-roledescription="diapositiva"
        className="feature-carousel__slide"
        id="feature-active-slide"
        key={activeView.id}
        role="group"
      >
        <div className="feature-carousel__copy">
          <span className="feature-carousel__label">{activeView.label}</span>
          <h3>{activeView.title}</h3>
          <p>{activeView.purpose}</p>
          <p className="feature-carousel__benefit"><strong>En la operación</strong>{activeView.benefit}</p>
        </div>
        <div className="feature-carousel__stage">
          <ActivePreview />
        </div>
      </article>

      <div className="feature-carousel__controls">
        <button aria-controls="feature-active-slide" className="feature-carousel__arrow" onClick={() => selectView(activeIndex - 1)} type="button">←<span>Anterior</span></button>
        <div aria-label="Elegir vista" className="feature-carousel__pager" role="group">
          {auxiliaryViews.map((view, index) => (
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={"Mostrar " + view.label}
              key={view.id}
              onClick={() => selectView(index)}
              onKeyDown={(event) => handlePagerKeyDown(event, index)}
              ref={(element) => { pagerRefs.current[index] = element; }}
              tabIndex={index === activeIndex ? 0 : -1}
              type="button"
            >
              <span />
            </button>
          ))}
        </div>
        <span className="feature-carousel__count">{String(activeIndex + 1).padStart(2, "0")} / {String(auxiliaryViews.length).padStart(2, "0")}</span>
        <button
          aria-label={manualPause ? "Reanudar recorrido automático" : "Pausar recorrido automático"}
          className="feature-carousel__pause"
          disabled={prefersReducedMotion}
          onClick={() => setManualPause((current) => !current)}
          type="button"
        >
          {prefersReducedMotion ? "Movimiento reducido" : manualPause ? "Reanudar" : "Pausar"}
        </button>
        <button aria-controls="feature-active-slide" className="feature-carousel__arrow" onClick={() => selectView(activeIndex + 1)} type="button"><span>Siguiente</span>→</button>
      </div>
      <span aria-live={autoplayActive ? "off" : "polite"} className="sr-only" role="status">{announcement}</span>
    </section>
  );
}
