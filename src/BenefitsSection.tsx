type Benefit = {
  title: string;
  description: string;
  result: string;
};

const benefits: readonly Benefit[] = [
  {
    title: "Todo el flujo conserva su contexto",
    description: "Del presupuesto a la entrega, cada área conserva el pedido, sus importes y lo pendiente. El modo Simple concentra el trabajo de una persona; Por áreas separa las confirmaciones.",
    result: "Menos saltos entre registros y áreas.",
  },
  {
    title: "Impresión lista para cada estación",
    description: "Documentos Carta/A4, bauchers de 58 u 80 mm y etiquetas usan perfiles de la estación. Las vistas previas permiten revisar su presentación antes de imprimir.",
    result: "Cada comprobante llega en el formato correcto.",
  },
  {
    title: "Control sin perder continuidad",
    description: "Cajas físicas, permisos por área, auditoría y alertas permiten reconocer responsabilidades. Los respaldos incluyen verificación y segunda copia; la pérdida de conexión pausa el trabajo.",
    result: "Más claridad para supervisar el día a día.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section" aria-labelledby="benefits-title" aria-describedby="benefits-description">
      <header className="benefits-header">
        <p className="benefits-eyebrow">POR QUÉ INKGESTIÓN</p>
        <h2 className="benefits-title" id="benefits-title">Una herramienta pensada alrededor del trabajo real.</h2>
        <p className="benefits-description" id="benefits-description">La interfaz reúne operación, seguimiento e impresión sin exigir que cada área trabaje aislada.</p>
      </header>

      <div className="benefits-list" aria-label="Principales ventajas de InkGestión">
        {benefits.map((benefit) => (
          <article className="benefits-row" key={benefit.title}>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <strong>{benefit.result}</strong>
          </article>
        ))}
      </div>

      <p className="benefits-disclaimer">Las simulaciones usan datos ficticios. Los servicios operativos, la impresión física y las verificaciones de seguridad pertenecen al producto instalado.</p>
    </section>
  );
}
