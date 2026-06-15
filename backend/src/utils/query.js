import { AppError } from './AppError.js';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Lista fechada para evitar que o usuario tente ordenar por um campo inexistente.
const sortableFields = new Set([
  'id',
  'dataAgendamento',
  'horaInicio',
  'nomeAssistido',
  'responsavelAgendamento',
  'organizacao',
  'tipo',
  'status',
  'agendamentoRealizado',
]);

function cleanValue(value) {
  // Trato string vazia como filtro ausente para simplificar os services.
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return String(value).trim();
}

function validateDate(value, fieldName) {
  if (!value) {
    return undefined;
  }

  if (!dateRegex.test(value)) {
    throw new AppError(`O parametro ${fieldName} deve estar no formato YYYY-MM-DD.`, 400);
  }

  return value;
}

export function parseFilters(query) {
  const startDate = validateDate(cleanValue(query.startDate), 'startDate');
  const endDate = validateDate(cleanValue(query.endDate), 'endDate');

  // Evita uma consulta sem sentido e devolve erro claro para o front.
  if (startDate && endDate && startDate > endDate) {
    throw new AppError('O parametro startDate nao pode ser maior que endDate.', 400);
  }

  return {
    search: cleanValue(query.search),
    status: cleanValue(query.status),
    tipo: cleanValue(query.tipo),
    realizado: cleanValue(query.realizado),
    organizacao: cleanValue(query.organizacao),
    responsavel: cleanValue(query.responsavel),
    startDate,
    endDate,
  };
}

export function parseSort(query) {
  const sortBy = cleanValue(query.sortBy) || 'dataAgendamento';
  const order = cleanValue(query.order) || 'asc';

  if (!sortableFields.has(sortBy)) {
    throw new AppError(`O parametro sortBy deve ser um dos valores: ${[...sortableFields].join(', ')}.`, 400);
  }

  if (!['asc', 'desc'].includes(order)) {
    throw new AppError('O parametro order deve ser asc ou desc.', 400);
  }

  return { sortBy, order };
}
