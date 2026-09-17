import type { ReactNode } from "react";
import { PreviewButton } from "./DemoPrimitives";

// Presentation components for synthetic examples; no commercial behavior is reproduced here.
export function ReferenceActions({ labels, primary }: { labels: string[]; primary?: string }) {
  return <div className="desktop-actions">{labels.map(label => <span key={label} className={primary === label ? "desktop-primary-action" : undefined}><PreviewButton>{label}</PreviewButton></span>)}</div>;
}

export function ReferenceField({ label, value }: { label: string; value: string }) {
  return <label className="desktop-field"><span>{label}</span><input value={value} readOnly /></label>;
}

export function ReferenceTable({ title, headers, rows }: { title?: string; headers: string[]; rows: ReactNode[][] }) {
  return <section className="desktop-table-section">{title && <h4>{title}</h4>}<div className="desktop-table-scroll"><table>
    <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
    <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody>
  </table>{!rows.length && <p className="desktop-empty">Sin registros en este ejemplo.</p>}</div></section>;
}

export function ReferenceNote() {
  return <p className="desktop-reference-note">Vista de referencia · Datos ficticios · Operaciones de muestra en «Seguir un pedido».</p>;
}

export function ReferenceHeading({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return <div className="desktop-detail-heading"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{children}</div>;
}
