import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  meta,
  limit,
  onPageChange,
  onLimitChange,
}) {
  if (!meta) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Pagina {meta.page} de {meta.totalPages} · {meta.total} registros
      </div>

      <label className="limit-select">
        <span>Por pagina</span>
        <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
          {[10, 20, 50, 100].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>

      <div className="pagination-actions">
        <button
          className="icon-button"
          type="button"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="icon-button"
          type="button"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          aria-label="Proxima pagina"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
