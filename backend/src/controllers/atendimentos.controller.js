import {
  getAtendimentoById,
  getFilterOptions,
  listAtendimentos,
} from '../services/atendimentos.service.js';
import { AppError } from '../utils/AppError.js';
import { parsePagination } from '../utils/pagination.js';
import { parseFilters, parseSort } from '../utils/query.js';

export function index(request, response, next) {
  try {
    const pagination = parsePagination(request.query);
    const filters = parseFilters(request.query);
    const sort = parseSort(request.query);
    const result = listAtendimentos(filters, pagination, sort);

    response.json({
      success: true,
      data: result.data,
      meta: result.meta,
      filters: result.filters,
      sort: result.sort,
    });
  } catch (error) {
    next(error);
  }
}

export function show(request, response, next) {
  try {
    const atendimento = getAtendimentoById(request.params.id);

    if (!atendimento) {
      throw new AppError('Atendimento nao encontrado.', 404);
    }

    response.json({
      success: true,
      data: atendimento,
    });
  } catch (error) {
    next(error);
  }
}

export function options(_request, response, next) {
  try {
    response.json({
      success: true,
      data: getFilterOptions(),
    });
  } catch (error) {
    next(error);
  }
}
