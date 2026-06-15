import { filterAtendimentos, getAllAtendimentos } from './atendimentos.service.js';

function groupBy(items, key) {
  return items.reduce((accumulator, item) => {
    const group = item[key] || 'Nao informado';
    accumulator[group] = (accumulator[group] || 0) + 1;
    return accumulator;
  }, {});
}

function getMonthlyEvolution(items) {
  const months = items.reduce((accumulator, item) => {
    const month = item.dataAgendamento?.slice(0, 7) || 'Nao informado';
    accumulator[month] = (accumulator[month] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}

export function getDashboardMetrics(filters = {}) {
  const filtered = Object.keys(filters).length
    ? filterAtendimentos(filters)
    : getAllAtendimentos();

  const totalAtendimentos = filtered.length;
  const totalConcluidos = filtered.filter((item) => item.agendamentoRealizado === 'Sim').length;
  const totalCancelados = filtered.filter((item) => item.agendamentoRealizado === 'Não').length;

  return {
    kpis: {
      totalAtendimentos,
      totalConcluidos,
      totalCancelados,
      receitaTotal: 0,
    },
    charts: {
      atendimentosPorStatus: groupBy(filtered, 'status'),
      atendimentosPorTipo: groupBy(filtered, 'tipo'),
      evolucaoMensal: getMonthlyEvolution(filtered),
    },
  };
}
