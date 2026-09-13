import { useState, type ReactNode } from "react";

export const demoMoney = (value: number) => new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO", minimumFractionDigits: 2 }).format(value);

export function DemoPage({ title, description, actions, children }: { title: string; description: string; actions?: ReactNode; children: ReactNode }) {
  return <div className="real-module faithful-page"><header className="real-view-header" data-guide-target="module-header"><div><h2>{title}</h2><p>{description}</p></div>{actions && <div className="faithful-actions">{actions}</div>}</header>{children}</div>;
}

export function PreviewButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button type="button" className="real-secondary-button" disabled={!onClick} onClick={onClick}>{children}</button>;
}

export function Facts({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return <dl className="faithful-facts">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function Metrics({ items }: { items: readonly (readonly [string, ReactNode])[] }) {
  return <div className="faithful-metrics" data-guide-target="module-metrics">{items.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>;
}

export type ExampleRecord = { id: string; cells: string[]; title: string; facts: [string, string][]; note?: string };

export function RecordExplorer({ headers, records, detailTitle, actions, children }: {
  headers: string[]; records: ExampleRecord[]; detailTitle: string; actions?: ReactNode; children?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(records[0]?.id);
  const visible = records.filter((record) => record.cells.join(" ").toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")));
  const selected = visible.find((record) => record.id === selectedId) ?? visible[0];
  return <div className="faithful-split"><section>
    <label className="faithful-search" data-guide-target="module-filter"><span>Buscar en esta lista</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Código, nombre o estado…" /></label>
    <div className="internal-table-wrap" data-guide-target="record-list"><table className="internal-table faithful-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
      <tbody>{visible.map((record) => <tr key={record.id} data-guide-target={selected?.id === record.id ? "selected-record" : undefined} className={selected?.id === record.id ? "selected" : ""}>{record.cells.map((cell, i) => <td key={i}>{i === 0 ? <button type="button" aria-label={`Ver ${record.cells[0]}`} aria-pressed={selected?.id === record.id} onClick={() => setSelectedId(record.id)}>{cell}</button> : cell}</td>)}</tr>)}</tbody></table>
      {!visible.length && <p className="faithful-empty" role="status">No hay coincidencias. Prueba con otro nombre o borra la búsqueda.</p>}
    </div><p className="faithful-list-note">{visible.length} registros ficticios · Selecciona una referencia para ver su ficha.</p>
  </section><aside className="detail-pane faithful-detail" data-guide-target="record-detail">
    <small>{detailTitle}</small>{selected ? <><h3>{selected.title}</h3><Facts items={selected.facts} />{selected.note && <p>{selected.note}</p>}{children}<div className="faithful-actions">{actions}</div></> : <p>Selecciona un registro cuando haya resultados.</p>}
  </aside></div>;
}

export function DemoTabs({ labels, active, onChange }: { labels: readonly string[]; active: string; onChange: (label: string) => void }) {
  return <div className="faithful-tabs" role="group" aria-label="Secciones de la pantalla" data-guide-target="workspace-tabs">{labels.map((label) => <button type="button" key={label} aria-pressed={active === label} className={active === label ? "active" : ""} onClick={() => onChange(label)}>{label}</button>)}</div>;
}
