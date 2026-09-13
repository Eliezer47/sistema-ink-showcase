import DemoWorkspace from "./DemoWorkspace";
import AuxiliaryViews from "./AuxiliaryViews";
import BenefitsSection from "./BenefitsSection";
import { DemoSession } from "./DemoSession";

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
            Conoce InkGestión, la solución para coordinar ventas, caja, producción
            y entregas de Ink Multiservicios. Explora sus pantallas y sigue un pedido
            de ejemplo desde la cotización hasta la entrega.
          </p>
        </div>

        <aside className="demo-notice" aria-label="Alcance de la demostración">
          <span className="notice-dot" aria-hidden="true" />
          <div>
            <strong>Demo visual aislada</strong>
            <p>Recreación web del sistema de escritorio, con datos ficticios y operaciones simuladas. Referencia: versión 1.10.3.</p>
          </div>
        </aside>
      </section>

      <DemoSession><DemoWorkspace /></DemoSession>

      <AuxiliaryViews />

      <BenefitsSection />

      <section className="trust-section" aria-labelledby="trust-title">
        <div>
          <p className="eyebrow">Conoce el alcance antes de decidir</p>
          <h2 id="trust-title">Explora el sistema con un ejemplo seguro.</h2>
          <p className="trust-intro">La demo representa pantallas y recorridos de la versión 1.10.3. La instalación real agrega los usuarios, permisos, documentos, impresoras y datos de tu negocio.</p>
        </div>
        <div className="trust-list">
          <p><strong>Datos sintéticos.</strong> Nombres, pedidos, importes y estados fueron creados para esta presentación.</p>
          <p><strong>Un ejemplo reiniciable.</strong> Los cobros y entregas del recorrido solo cambian datos ficticios. Recargar restaura el inicio.</p>
          <p><strong>Validación en tu negocio.</strong> La demo no acredita instalación, rendimiento, impresión física o seguridad. Esas capacidades se revisan en una demostración privada del producto.</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>InkGestión · Recorrido visual</strong>
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
