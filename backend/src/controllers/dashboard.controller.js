import { getDashboardMetrics } from '../services/dashboard.service.js';
import { parseFilters } from '../utils/query.js';

export function index(request, response, next) {
  try {
    response.json({
      success: true,
      data: getDashboardMetrics(parseFilters(request.query)),
    });
  } catch (error) {
    next(error);
  }
}
