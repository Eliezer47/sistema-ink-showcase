type Benefit = {
  title: string;
  description: string;
  result: string;
};

const benefits: readonly Benefit[] = [
  {
    title: "Todo el flujo conserva su contexto",
    description: "Ventas, caja, producción, compras e inventario comparten la misma estructura visual y mantienen visible la información necesaria para continuar el trabajo.",
    result: "Menos saltos entre registros y áreas.",
  },
  {
    title: "Impresión lista para cada estación",
    description: "Los documentos Carta/A4 y los bauchers térmicos pueden salir por impresoras distintas, con prueba directa, vista previa y formatos de 58 u 80 mm.",
    result: "Cada comprobante llega en el formato correcto.",
  },
  {
    title: "Control sin perder continuidad",
    description: "Usuarios, permisos, jornadas de caja, equipos conectados y respaldos ayudan a reconocer responsabilidades y el estado de la operación.",
    result: "Más claridad para supervisar el día a día.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="benefits-section" aria-labelledby="benefits-title" aria-describedby="benefits-description">
      <header className="benefits-header">
        <p className="benefits-eyebrow">POR QUÉ SISTEMA INK</p>
        <h2 className="benefits-title" id="benefits-title">Una herramienta pensada alrededor del trabajo real.</h2>
        <p className="benefits-description" id="benefits-description">La interfaz reúne operación, seguimiento e impresión sin exigir que cada área trabaje aislada.</p>
      </header>

      <div className="benefits-list" aria-label="Principales ventajas de Sistema Ink">
        {benefits.map((benefit) => (
          <article className="benefits-row" key={benefit.title}>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <strong>{benefit.result}</strong>
          </article>
        ))}
      </div>

      <p className="benefits-disclaimer">Alcance visual con datos ficticios; las funciones operativas no forman parte de este repositorio público.</p>
    </section>
  );
}
