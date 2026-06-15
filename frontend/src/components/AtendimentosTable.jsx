import { ArrowDown, ArrowUp } from 'lucide-react';

import { compactEmpty, formatDate } from '../utils/formatters.js';

const columns = [
  { label: 'Cliente', key: 'nomeAssistido' },
  { label: 'Data', key: 'dataAgendamento' },
  { label: 'Hora', key: 'horaInicio' },
  { label: 'Advogado', key: 'responsavelAgendamento' },
  { label: 'Area juridica', key: 'organizacao' },
  { label: 'Status', key: 'status' },
  { label: 'Realizado', key: 'agendamentoRealizado' },
];

export function AtendimentosTable({
  atendimentos,
  sort,
  onSortChange,
}) {
  function handleSort(key) {
    if (sort.sortBy === key) {
      onSortChange({
        sortBy: key,
        order: sort.order === 'asc' ? 'desc' : 'asc',
      });
      return;
    }

    onSortChange({ sortBy: key, order: 'asc' });
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <button
                  className="table-sort"
                  type="button"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sort.sortBy === column.key && (
                    sort.order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atendimentos.map((atendimento) => (
            <tr key={atendimento.id}>
              <td>{compactEmpty(atendimento.nomeAssistido)}</td>
              <td>{formatDate(atendimento.dataAgendamento)}</td>
              <td>{compactEmpty(atendimento.horaInicio)}</td>
              <td>{compactEmpty(atendimento.responsavelAgendamento)}</td>
              <td>{compactEmpty(atendimento.organizacao)}</td>
              <td>
                <span className="status-badge">{compactEmpty(atendimento.status)}</span>
              </td>
              <td>{compactEmpty(atendimento.agendamentoRealizado)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {atendimentos.length === 0 && (
        <div className="empty-state">Nenhum atendimento encontrado.</div>
      )}
    </div>
  );
}
