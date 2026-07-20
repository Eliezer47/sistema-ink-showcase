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
        </div>
        <div className="trust-grid">
          <article>
            <span className="trust-number">01</span>
            <h3>Datos sintéticos</h3>
            <p>Nombres, pedidos, importes y estados fueron creados exclusivamente para esta demostración.</p>
          </article>
          <article>
            <span className="trust-number">02</span>
            <h3>Solo presentación</h3>
            <p>La navegación cambia de pantalla; guardar, cobrar, exportar y administrar permanecen deshabilitados.</p>
          </article>
          <article>
            <span className="trust-number">03</span>
            <h3>Producto protegido</h3>
            <p>Este repositorio no contiene API, reglas comerciales, contratos, persistencia ni código del cliente real.</p>
          </article>
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
