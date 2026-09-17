// Independent display fixtures. These are not product records or commercial data.
export type SalesSample = {
  reference: string;
  customer: string;
  date: string;
  promised: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  paid: number;
  delivered: number;
  ready: boolean;
};

export const salesFilters = ["Pendientes", "Por cobrar", "Pagados", "Histórico"] as const;
export type SalesFilter = typeof salesFilters[number];
export const salesAmount = (value: number) => value.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const salesDate = (value: string) => value.split("-").reverse().join("/");

export function createSalesSamples(): SalesSample[] {
  return [
    { reference: "PED-DEMO-0204", customer: "Estudio Aurora", date: "2026-09-15", promised: "2026-09-16", description: "Vinil impreso", quantity: 1, unit: "M", price: 148, total: 148, paid: 0, delivered: 0, ready: false },
    { reference: "PED-DEMO-0203", customer: "Taller Horizonte", date: "2026-09-15", promised: "2026-09-15", description: "DTF IMPRESO", quantity: 0.9, unit: "M", price: 280, total: 252, paid: 0, delivered: 0, ready: false },
    { reference: "PED-DEMO-0201", customer: "Café Lumbre", date: "2026-09-11", promised: "2026-09-15", description: "Camiseta blanca · estampado frontal", quantity: 12, unit: "UND", price: 250, total: 3000, paid: 600, delivered: 0, ready: false },
    { reference: "PED-DEMO-0199", customer: "Estudio Prisma", date: "2026-09-11", promised: "2026-09-16", description: "Agenda personalizada", quantity: 20, unit: "UND", price: 230, total: 4600, paid: 4600, delivered: 12, ready: true },
    { reference: "PED-DEMO-0190", customer: "Casa Nativa", date: "2026-09-09", promised: "2026-09-14", description: "Delantal con bordado", quantity: 10, unit: "UND", price: 250, total: 2500, paid: 1300, delivered: 0, ready: false },
    { reference: "PED-DEMO-0186", customer: "Norte Creativo", date: "2026-09-08", promised: "2026-09-09", description: "Taza personalizada", quantity: 10, unit: "UND", price: 145, total: 1450, paid: 1450, delivered: 10, ready: true },
  ];
}

export function visibleSalesSamples(samples: SalesSample[], filter: SalesFilter, query: string, from = "", to = "") {
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  return samples.filter((sample) => {
    const matchesState = filter === "Histórico" || (filter === "Pagados" ? sample.paid === sample.total : filter === "Por cobrar" ? sample.paid < sample.total : sample.paid < sample.total || sample.delivered < sample.quantity);
    return matchesState && normalize(`${sample.reference} ${sample.customer}`).includes(normalize(query.trim())) && (!from || sample.date >= from) && (!to || sample.date <= to);
  });
}

export function salesOperation(sample: SalesSample) {
  if (sample.delivered === sample.quantity) return sample.paid < sample.total ? "Entregado · Saldo pendiente" : "Entregado";
  if (sample.paid < sample.total) return "Pendiente de cobro";
  return sample.ready ? "Lista para entregar" : "Pendiente de producción";
}
