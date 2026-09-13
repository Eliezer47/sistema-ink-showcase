import { useEffect, useRef, type ReactNode } from "react";

export default function DemoDialog({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className={`demo-dialog${wide ? " wide" : ""}`} aria-label={title} onCancel={onClose}>
    <header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Cerrar vista previa">×</button></header>
    <div className="demo-dialog-body">{children}</div>
    <footer>Vista de ejemplo · Datos ficticios · Sin impresión ni envío</footer>
  </dialog>;
}

export function DocumentExample({ kind = "receipt", paid = 600, total = 3000, labelKind = "shipping" }: { kind?: "receipt" | "label" | "quote" | "card"; paid?: number; total?: number; labelKind?: "shipping" | "pickup" }) {
  const money = (value: number) => `C$ ${value.toFixed(2)}`;
  return <article className={`demo-document document-${kind}`}>
    <img src="./sistema-ink-icon.png" alt="" /><h3>Atelier Demo</h3>
    <p>{kind === "label" ? labelKind === "shipping" ? "ETIQUETA DE ENVÍO" : "ETIQUETA DE RETIRO LOCAL" : kind === "quote" ? "COTIZACIÓN" : kind === "card" ? "RESUMEN DEL PEDIDO" : "RECIBO DE ABONO"}</p>
    <strong>{kind === "quote" ? "COT-DEMO-0201" : kind === "receipt" ? "REC-DEMO-0201" : "PED-DEMO-0201"}</strong>
    <p>Café Lumbre · 11/09/2026</p>
    {kind === "label" ? <><hr /><h4>{labelKind === "shipping" ? "DESTINATARIO" : "RETIRA"}</h4><strong>Café Lumbre</strong>{labelKind === "shipping" && <p>Distrito Creativo · Dirección ficticia</p>}<p>{labelKind === "shipping" ? "Entrega local" : "Retiro en mostrador"} · 1 bulto · 12 camisetas</p><div className="demo-barcode" aria-label="Código ilustrativo no escaneable" /><small>Referencia visual · No escaneable</small></> : <>
      <hr /><p>12 × Camiseta blanca con estampado frontal</p><dl><div><dt>Total</dt><dd>{money(total)}</dd></div>{kind !== "quote" && <><div><dt>Pagado</dt><dd>{money(paid)}</dd></div><div><dt>Saldo</dt><dd>{money(total - paid)}</dd></div></>}</dl>
      <hr /><p>{kind === "quote" ? "Válida hasta 18/09/2026 · Entrega acordada 15/09/2026" : "Gracias por tu preferencia"}</p>
    </>}
    <small>{kind === "card" ? "Resumen comercial; no sustituye el comprobante formal." : "No válido como comprobante fiscal"}<br />DATOS FICTICIOS · DEMO</small>
  </article>;
}
