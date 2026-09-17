import { useEffect, useRef, useState } from "react";
import DemoWorkspace from "./DemoWorkspace";
import AuxiliaryViews from "./AuxiliaryViews";
import DemoDialog from "./DemoDialog";
import { DemoSession } from "./DemoSession";

export default function App() {
  const [information, setInformation] = useState<"about" | "views" | null>(null);
  const [expanded, setExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeExpanded = (event: KeyboardEvent) => {
      // A dialog or guide handles its own Escape before the workspace does.
      if (event.key !== "Escape" || document.querySelector("dialog[open], #context-guide")) return;
      setExpanded(false);
      expandButtonRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", closeExpanded);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeExpanded);
    };
  }, [expanded]);

  return (
    <div className={`demo-site${expanded ? " expanded" : ""}`}>
      <a className="demo-skip-link" href="#demo-main">Ir al sistema</a>
      <header className="demo-site-header">
        <div className="demo-site-identity">
          <img src="./sistema-ink-icon.png" alt="" width="38" height="38" />
          <div>
            <div className="demo-site-brand"><h1>InkGestión</h1><span>Demo</span></div>
            <p className="demo-site-notice">Demo del sistema de escritorio · Datos ficticios</p>
          </div>
        </div>
        <nav className="demo-site-actions" aria-label="Información de la demo">
          <button type="button" aria-haspopup="dialog" onClick={() => setInformation("about")}>Acerca de esta demo</button>
          <a href="mailto:eliezerponcexd@gmail.com">Contacto <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="demo-main" tabIndex={-1}>
        <DemoSession><DemoWorkspace expanded={expanded} expandButtonRef={expandButtonRef} onToggleExpanded={() => setExpanded((value) => !value)} onShowViews={() => setInformation("views")} /></DemoSession>
      </main>

      <footer className="demo-site-footer">
        <a href="https://inkmultiservicios.com/sistemas/">← Volver a Sistemas</a>
        <a href="https://eliezer47.github.io/portfolio/#/project">Eliezer Ponce <span aria-hidden="true">↗</span></a>
      </footer>

      {information && <DemoDialog
        wide={information === "views"}
        title={information === "views" ? "Más vistas del sistema" : "Acerca de esta demo"}
        closeLabel={information === "views" ? "Cerrar más vistas" : "Cerrar información"}
        footer="InkGestión · Demo visual aislada"
        onClose={() => setInformation(null)}
      >
        {information === "views" ? <AuxiliaryViews /> : <div className="demo-about">
          <p className="demo-about-version">Referencia visual del sistema · 1.10.6</p>
          <p>Recreación web de la aplicación de escritorio. Los registros son ficticios y las acciones habilitadas solo cambian el ejemplo.</p>
          <dl>
            <div><dt>Explorar pantallas</dt><dd>Consulta los módulos y sus registros de muestra. La vista completa reúne funciones cuyo acceso depende de la edición contratada, la configuración y los permisos. Las ediciones del producto son Comercial, Operaciones e Integral.</dd></div>
            <div><dt>Seguir un pedido</dt><dd>Recorre una cotización, su cobro y entrega con pasos abreviados. El ejemplo conserva sus cambios entre módulos; puedes reiniciarlo o recargar la página. Las pantallas de captura completas se revisan en el producto instalado.</dd></div>
            <div><dt>Más vistas</dt><dd>Conoce el acceso, servidor, PIN, impresión, baucher y estado de conexión. Se muestran como vistas ilustrativas.</dd></div>
            <div><dt>Ampliar vista</dt><dd>Usa más espacio sin perder el pedido. Sal con el botón de la barra o con Escape. En pantallas pequeñas, el selector y las flechas permiten recorrer la vista de escritorio.</dd></div>
          </dl>
          <p>Calculadora, Artículos del cliente y Calidad son accesos opcionales del perfil mostrado. Los botones deshabilitados corresponden a funciones que no se ejecutan en esta demo. La propuesta comercial debe indicar los módulos incluidos.</p>
          <p className="demo-about-boundary">Sin conexión al producto comercial. Impresión física, permisos, respaldos y trabajo multiusuario se validan en una demostración del sistema instalado.</p>
          <a href="https://github.com/Eliezer47/sistema-ink-showcase">Repositorio de la demo <span aria-hidden="true">↗</span></a>
        </div>}
      </DemoDialog>}
    </div>
  );
}
