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
          <p className="eyebrow">Laboratorio visual · Aplicación de escritorio</p>
          <h1 id="page-title">
            La operación completa,
            <span> en una sola vista.</span>
          </h1>
          <p className="hero-lead">
            Recorre InkGestión y completa una operación simulada desde la cotización
            hasta el despacho, cobro y revisión del comprobante. Todo sucede con
            información ficticia, en memoria y sin conectarte al producto real.
          </p>
          <div className="hero-actions"><a className="hero-lab-link" href="#demo-title">Iniciar ciclo LAB</a><span>Escenario reiniciable · sin registro</span></div>
        </div>

        <aside className="demo-notice" aria-label="Alcance de la demostración">
          <span className="notice-dot" aria-hidden="true" />
          <div>
            <strong>Demo visual aislada + LAB</strong>
            <p>Las acciones del laboratorio son simuladas. No acceden al servidor comercial, base de datos ni cuentas reales.</p>
          </div>
        </aside>
      </section>

      <DemoWorkspace />

      <AuxiliaryViews />

      <BenefitsSection />

      <section className="trust-section" aria-labelledby="trust-title">
        <div>
          <p className="eyebrow">Diseñada para probar sin exponer</p>
          <h2 id="trust-title">Una simulación pública con límites claros.</h2>
          <p className="trust-intro">El LAB permite recorrer decisiones y estados del ciclo sin publicar ni conectar el producto comercial.</p>
        </div>
        <div className="trust-list">
          <p><strong>Datos sintéticos.</strong> Nombres, pedidos, importes y estados fueron creados para esta presentación.</p>
          <p><strong>Operación acotada.</strong> Cotizar, producir, preparar el despacho, entregar y cobrar solo modifican el escenario temporal.</p>
          <p><strong>Producto protegido.</strong> El repositorio no contiene API, base de datos ni reglas internas del sistema.</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>InkGestión · Laboratorio visual</strong>
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
