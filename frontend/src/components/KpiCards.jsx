import { CalendarCheck, CalendarX, Scale, Users } from 'lucide-react';

import { formatCurrency } from '../utils/formatters.js';

const cards = [
  {
    key: 'totalAtendimentos',
    label: 'Total de Atendimentos',
    icon: Users,
  },
  {
    key: 'totalConcluidos',
    label: 'Total Concluidos',
    icon: CalendarCheck,
  },
  {
    key: 'totalCancelados',
    label: 'Total Cancelados',
    icon: CalendarX,
  },
  {
    key: 'receitaTotal',
    label: 'Receita Total',
    icon: Scale,
    format: formatCurrency,
  },
];

export function KpiCards({ kpis }) {
  return (
    <section className="kpi-grid" aria-label="Metricas principais">
      {cards.map((card) => {
        const Icon = card.icon;
        const rawValue = kpis?.[card.key] ?? 0;
        const value = card.format ? card.format(rawValue) : rawValue;

        return (
          <article className="kpi-card" key={card.key}>
            <div className="kpi-icon">
              <Icon size={20} />
            </div>
            <span>{card.label}</span>
            <strong>{value}</strong>
          </article>
        );
      })}
    </section>
  );
}
