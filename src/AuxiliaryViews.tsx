"use client";

import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";

type AuxiliaryViewId = "login" | "server" | "pin" | "connection";

type AuxiliaryViewDefinition = {
  id: AuxiliaryViewId;
  label: string;
  title: string;
  purpose: string;
  visibleDetails: string;
};

const auxiliaryViews: readonly AuxiliaryViewDefinition[] = [
  {
    id: "login",
    label: "Inicio de sesión",
    title: "Acceso por contraseña o PIN",
    purpose: "La pantalla concentra la identificación del usuario y permite reconocer las dos formas de acceso disponibles en el equipo.",
    visibleDetails: "Usuario recordado, selector de modo, aviso de seguridad y estado del servidor de demostración.",
  },
  {
    id: "server",
    label: "Buscar servidor",
    title: "Selección del servidor del sistema",
    purpose: "Antes de iniciar sesión, el cliente puede presentar los equipos disponibles y una alternativa manual cuando la detección de red no está disponible.",
    visibleDetails: "Resultados sintéticos, dirección documental y controles deliberadamente deshabilitados.",
  },
  {
    id: "pin",
    label: "Configurar PIN",
    title: "Acceso rápido para este equipo",
    purpose: "El PIN ofrece una entrada breve asociada al usuario y al equipo, sin sustituir el acceso normal mediante contraseña.",
    visibleDetails: "Dos campos de seis dígitos, confirmación visual y acciones sin conexión.",
  },
  {
    id: "connection",
    label: "Sin conexión",
    title: "Sin comunicación con el servidor",
    purpose: "Cuando el servidor deja de responder, la zona de trabajo se pausa visualmente para evitar operaciones que no puedan procesarse.",
    visibleDetails: "Shell atenuado, aviso central, estado de conexión y comprobación visual sin tráfico de red.",
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
              <div className="aux-server-row aux-server-row-head"><span>Equipo</span><span>Dirección</span><span>Versión</span></div>
              <div className="aux-server-row aux-server-row-selected"><strong>SERVIDOR DEMO</strong><span>192.0.2.10</span><span>DEMO</span></div>
              <div className="aux-server-row"><strong>RESPALDO DEMO</strong><span>192.0.2.20</span><span>DEMO</span></div>
            </div>
            <p className="aux-discovery-note"><i aria-hidden="true" /> Búsqueda ilustrativa completada · Sin tráfico de red</p>
          </section>
          <aside className="aux-manual-server">
            <h5>Conexión manual</h5>
            <p>Esta recreación oculta la configuración técnica del producto.</p>
            <div className="aux-form-field"><span>Nombre del equipo o IP</span><div className="aux-input-surface" role="textbox" aria-label="Equipo o dirección ficticia" aria-readonly="true">192.0.2.30</div></div>
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
  connection: ConnectionPreview,
};

export default function AuxiliaryViews() {
  const [activeId, setActiveId] = useState<AuxiliaryViewId>(auxiliaryViews[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = auxiliaryViews.findIndex((view) => view.id === activeId);
  const activeView = auxiliaryViews[activeIndex];
  const ActivePreview = previews[activeId];

  const selectView = (index: number, moveFocus = false) => {
    const nextIndex = Math.max(0, Math.min(auxiliaryViews.length - 1, index));
    setActiveId(auxiliaryViews[nextIndex].id);
    if (moveFocus) tabRefs.current[nextIndex]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
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
    <section className="aux-section" aria-labelledby="aux-section-title">
      <div className="aux-section-heading">
        <div><p className="aux-eyebrow">Pantallas complementarias</p><h2 id="aux-section-title">Conoce lo que ocurre antes y después del espacio de trabajo.</h2><p>Estas recreaciones muestran momentos que no permanecen visibles en el menú principal. Todo funciona únicamente como navegación visual local.</p></div>
        <aside className="aux-safety"><span aria-hidden="true">●</span><div><strong>Solo presentación</strong><small>Sin autenticación, red, impresión ni archivos</small></div></aside>
      </div>

      <div className="aux-tablist" role="tablist" aria-label="Vistas complementarias de Sistema Ink">
        {auxiliaryViews.map((view, index) => (
          <button
            aria-controls="aux-active-panel"
            aria-selected={view.id === activeId}
            className={view.id === activeId ? "aux-tab aux-tab-active" : "aux-tab"}
            id={`aux-tab-${view.id}`}
            key={view.id}
            onClick={() => selectView(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => { tabRefs.current[index] = element; }}
            role="tab"
            tabIndex={view.id === activeId ? 0 : -1}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{view.label}
          </button>
        ))}
      </div>

      <div className="aux-gallery">
        <div className="aux-view-copy" aria-live="polite" aria-atomic="true">
          <span className="aux-view-index">VISTA {String(activeIndex + 1).padStart(2, "0")} / {String(auxiliaryViews.length).padStart(2, "0")}</span>
          <h3>{activeView.title}</h3>
          <p>{activeView.purpose}</p>
          <div className="aux-visible-details"><small>QUÉ SE MUESTRA</small><p>{activeView.visibleDetails}</p></div>
          <span className="aux-fictitious-badge">Datos ficticios · Controles sin conexión</span>
        </div>

        <div
          aria-labelledby={`aux-tab-${activeView.id}`}
          className="aux-panel"
          id="aux-active-panel"
          role="tabpanel"
          tabIndex={0}
        >
          <ActivePreview />
        </div>
      </div>

      <div className="aux-controls">
        <button type="button" onClick={() => selectView(activeIndex - 1)} disabled={activeIndex === 0}>← Vista anterior</button>
        <span aria-live="polite">{activeView.label}</span>
        <button type="button" onClick={() => selectView(activeIndex + 1)} disabled={activeIndex === auxiliaryViews.length - 1}>Vista siguiente →</button>
      </div>
      <p className="aux-keyboard-note">Usa las flechas del teclado cuando el selector de vistas tenga el foco.</p>
    </section>
  );
}
