import { api } from './api.js';

export const initialFilters = {
  search: '',
  status: '',
  tipo: '',
  realizado: '',
  organizacao: '',
  responsavel: '',
  startDate: '',
  endDate: '',
};

export const initialSort = {
  sortBy: 'dataAgendamento',
  order: 'asc',
};

export function buildParams(filters, pagination, sort) {
  const params = {
    page: pagination.page,
    limit: pagination.limit,
    sortBy: sort.sortBy,
    order: sort.order,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params[key] = value;
    }
  });

  return params;
}

export async function getDashboard(filters) {
  const params = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params[key] = value;
    }
  });

  const response = await api.get('/dashboard', { params });
  return response.data.data;
}

export async function getAtendimentos(filters, pagination, sort) {
  const response = await api.get('/atendimentos', {
    params: buildParams(filters, pagination, sort),
  });

  return response.data;
}

export async function getFilterOptions() {
  const response = await api.get('/atendimentos/options');
  return response.data.data;
}

export async function getAllFilteredAtendimentos(filters, sort) {
  const firstPage = await getAtendimentos(filters, { page: 1, limit: 100 }, sort);
  const allItems = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
    const response = await getAtendimentos(filters, { page, limit: 100 }, sort);
    allItems.push(...response.data);
  }

  return allItems;
}
