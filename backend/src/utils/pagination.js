import { AppError } from './AppError.js';

export function parsePagination(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError('O parametro page deve ser um numero inteiro maior que zero.', 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError('O parametro limit deve ser um numero inteiro entre 1 e 100.', 400);
  }

  return { page, limit };
}

export function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
