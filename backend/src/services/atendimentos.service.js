import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { normalizeText } from '../utils/normalizeText.js';
import { paginate } from '../utils/pagination.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(__dirname, '../data/atendimentos.json');
// Como a prova pede base mock, carrego o JSON uma vez na inicializacao da API.
const atendimentos = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Campos que fazem sentido para uma busca livre no contexto dos atendimentos.
const searchableFields = [
  'nomeAssistido',
  'responsavelAgendamento',
  'organizacao',
  'servico',
  'local',
  'tipo',
  'status',
  'agendamentoRealizado',
];

function isSameText(value, expected) {
  if (!expected) {
    return true;
  }

  return normalizeText(value) === normalizeText(expected);
}

function isBetweenDates(value, startDate, endDate) {
  if (!value) {
    return false;
  }

  if (startDate && value < startDate) {
    return false;
  }

  if (endDate && value > endDate) {
    return false;
  }

  return true;
}

export function filterAtendimentos(filters = {}) {
  const search = normalizeText(filters.search);
  const hasDateFilter = Boolean(filters.startDate || filters.endDate);

  return atendimentos.filter((atendimento) => {
    // A busca ignora acentos e caixa para ficar mais tolerante ao texto digitado.
    const matchesSearch = !search || searchableFields.some((field) => (
      normalizeText(atendimento[field]).includes(search)
    ));

    return (
      matchesSearch
      && isSameText(atendimento.status, filters.status)
      && isSameText(atendimento.tipo, filters.tipo)
      && isSameText(atendimento.agendamentoRealizado, filters.realizado)
      && isSameText(atendimento.organizacao, filters.organizacao)
      && isSameText(atendimento.responsavelAgendamento, filters.responsavel)
      && (!hasDateFilter || isBetweenDates(
        atendimento.dataAgendamento,
        filters.startDate,
        filters.endDate,
      ))
    );
  });
}

function sortAtendimentos(items, sort) {
  // Clono o array para nao mudar a ordem original da base em memoria.
  return [...items].sort((a, b) => {
    const left = a[sort.sortBy] ?? '';
    const right = b[sort.sortBy] ?? '';
    const direction = sort.order === 'desc' ? -1 : 1;

    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * direction;
    }

    return String(left).localeCompare(String(right), 'pt-BR') * direction;
  });
}

export function listAtendimentos(filters, pagination, sort) {
  const filtered = filterAtendimentos(filters);
  const sorted = sortAtendimentos(filtered, sort);
  const result = paginate(sorted, pagination.page, pagination.limit);

  return {
    ...result,
    filters,
    sort,
  };
}

export function getAtendimentoById(id) {
  return atendimentos.find((atendimento) => atendimento.id === Number(id));
}

export function getFilterOptions() {
  // O front usa essas listas para montar os selects sem valores duplicados.
  const uniqueSorted = (field) => [...new Set(
    atendimentos
      .map((item) => item[field])
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b));

  return {
    status: uniqueSorted('status'),
    tipos: uniqueSorted('tipo'),
    realizados: uniqueSorted('agendamentoRealizado'),
    organizacoes: uniqueSorted('organizacao'),
    responsaveis: uniqueSorted('responsavelAgendamento'),
  };
}

export function getAllAtendimentos() {
  return atendimentos;
}
