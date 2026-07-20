type Benefit = {
  title: string;
  description: string;
  evidence: string;
};

const benefits: Benefit[] = [
  {
    title: "Operación integrada",
    description:
      "Ventas, caja, producción, clientes y entregas comparten un mismo espacio visual para seguir el trabajo de principio a fin.",
    evidence: "Ventas · Caja · Producción · Entregas",
  },
  {
    title: "Métricas para decidir",
    description:
      "Los paneles reúnen ventas, cobros, saldos, pendientes y comparativos para ofrecer una lectura clara de la operación.",
    evidence: "Panel principal · Métricas comerciales",
  },
  {
    title: "Compras e inventario trazables",
    description:
      "Las vistas conectan proveedores, documentos de compra, recepción, existencias y movimientos para conservar el contexto de cada registro.",
    evidence: "Compras · Proveedores · Inventario",
  },
  {
    title: "Acceso y continuidad visibles",
    description:
      "El inicio de sesión, la búsqueda del servidor y el estado de los equipos ayudan a reconocer dónde conectarse y qué estaciones están disponibles.",
    evidence: "Acceso · Servidor · Equipos conectados",
  },
  {
    title: "Adaptado a cada puesto",
    description:
      "La empresa puede representar su moneda de trabajo y cada estación conserva opciones visuales para documentos, recibos e impresoras.",
    evidence: "Empresa · Moneda · Estación e impresión",
  },
  {
    title: "Control por roles y respaldos",
    description:
      "Usuarios, permisos e historial de respaldos hacen visibles las responsabilidades de acceso y las acciones de continuidad operativa.",
    evidence: "Usuarios · Roles y permisos · Respaldos",
  },
];

export default function BenefitsSection() {
  return (
    <section
      className="benefits-section"
      aria-labelledby="benefits-title"
      aria-describedby="benefits-description"
    >
      <header className="benefits-header">
        <p className="benefits-eyebrow">VENTAJAS DEL SISTEMA</p>
        <h2 className="benefits-title" id="benefits-title">
          Una operación más clara, conectada y fácil de seguir
        </h2>
        <p className="benefits-description" id="benefits-description">
          Sistema Ink reúne las áreas esenciales del negocio en una experiencia
          visual coherente, desde el acceso inicial hasta el seguimiento y la
          protección de la información.
        </p>
      </header>

      <ul className="benefits-grid" aria-label="Principales ventajas de Sistema Ink">
        {benefits.map((benefit, index) => (
          <li className="benefits-card" key={benefit.title}>
            <span className="benefits-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="benefits-card-content">
              <h3 className="benefits-card-title">{benefit.title}</h3>
              <p className="benefits-card-description">{benefit.description}</p>
              <p className="benefits-card-evidence">
                <span className="benefits-card-evidence-label">Visible en:</span>{" "}
                {benefit.evidence}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="benefits-disclaimer">
        La demostración utiliza datos ficticios y presenta únicamente el alcance
        visual del producto.
      </p>
    </section>
  );
}
