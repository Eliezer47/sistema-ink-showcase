import DemoWorkspace from "./DemoWorkspace";
import AuxiliaryViews from "./AuxiliaryViews";
import BenefitsSection from "./BenefitsSection";

export default function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <a className="back-link" href="https://eliezer47.github.io/portfolio/#/project">
            <span aria-hidden="true">←</span> Portafolio de Eliezer Ponce
          </a>
          <p className="eyebrow">Caso de estudio · Aplicación de escritorio</p>
          <h1 id="page-title">
            La operación completa,
            <span> en una sola vista.</span>
          </h1>
          <p className="hero-lead">
            Un recorrido visual por Sistema Ink, una solución de gestión para talleres de
            personalización y producción ligera. Explora la interfaz con información
            totalmente ficticia y sin conectarte al producto real.
          </p>
        </div>

        <aside className="demo-notice" aria-label="Alcance de la demostración">
          <span className="notice-dot" aria-hidden="true" />
          <div>
            <strong>Demo visual aislada</strong>
            <p>Sin acceso al servidor comercial, base de datos, cuentas reales ni acciones operativas.</p>
          </div>
        </aside>
      </section>

      <DemoWorkspace />

      <AuxiliaryViews />

      <BenefitsSection />

      <section className="trust-section" aria-labelledby="trust-title">
        <div>
          <p className="eyebrow">Diseñada para mostrar, no para operar</p>
          <h2 id="trust-title">Una presentación pública con límites claros.</h2>
          <p className="trust-intro">La demo permite evaluar la experiencia visual sin publicar el producto que la hace funcionar.</p>
        </div>
        <div className="trust-list">
          <p><strong>Datos sintéticos.</strong> Nombres, pedidos, importes y estados fueron creados para esta presentación.</p>
          <p><strong>Solo lectura.</strong> Guardar, cobrar, exportar, imprimir y administrar permanecen deshabilitados.</p>
          <p><strong>Producto protegido.</strong> El repositorio no contiene API, base de datos ni reglas internas del sistema.</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Sistema Ink · Recorrido visual</strong>
          <p>Proyecto comercial de Eliezer Ponce.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/Eliezer47/sistema-ink-showcase">Repositorio</a>
          <a href="mailto:eliezerponcexd@gmail.com">Solicitar demostración privada</a>
        </div>
      </footer>
    </main>
  );
}
