import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

import { AtendimentosTable } from '../components/AtendimentosTable.jsx';
import { ChartsSection } from '../components/ChartsSection.jsx';
import { FiltersPanel } from '../components/FiltersPanel.jsx';
import { KpiCards } from '../components/KpiCards.jsx';
import { Pagination } from '../components/Pagination.jsx';
import {
  getAllFilteredAtendimentos,
  getAtendimentos,
  getDashboard,
  getFilterOptions,
  initialFilters,
  initialSort,
} from '../services/atendimentosService.js';
import { exportToCsv, exportToPdf } from '../utils/exporters.js';

export function DashboardPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState({});
  const [sort, setSort] = useState(initialSort);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [dashboard, setDashboard] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOptions() {
      try {
        const options = await getFilterOptions();
        if (!ignore) {
          setFilterOptions(options);
        }
      } catch (currentError) {
        if (!ignore) {
          setError('Nao foi possivel carregar as opcoes de filtro.');
          console.error(currentError);
        }
      }
    }

    loadOptions();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    // Pequeno debounce para a busca em tempo real nao chamar a API a cada tecla.
    const timeout = window.setTimeout(() => {
      setAppliedFilters(filters);
      setPagination((current) => ({ ...current, page: 1 }));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        // Dashboard e tabela dependem dos mesmos filtros, entao carrego em paralelo.
        const [dashboardData, atendimentosData] = await Promise.all([
          getDashboard(appliedFilters),
          getAtendimentos(appliedFilters, pagination, sort),
        ]);

        if (!ignore) {
          setDashboard(dashboardData);
          setAtendimentos(atendimentosData.data);
          setMeta(atendimentosData.meta);
        }
      } catch (currentError) {
        if (!ignore) {
          setError('Nao foi possivel carregar os dados da API.');
          console.error(currentError);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [appliedFilters, pagination, sort]);

  const activeFilterCount = useMemo(() => (
    Object.values(appliedFilters).filter(Boolean).length
  ), [appliedFilters]);

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function handleLimitChange(limit) {
    setPagination({ page: 1, limit });
  }

  async function handleExport(type) {
    try {
      setExporting(true);
      setError('');
      // A exportacao precisa refletir todos os filtros ativos, nao so a pagina atual.
      const items = await getAllFilteredAtendimentos(appliedFilters, sort);

      if (type === 'csv') {
        exportToCsv(items);
      } else {
        await exportToPdf(items);
      }
    } catch (currentError) {
      setError('Nao foi possivel exportar a listagem filtrada.');
      console.error(currentError);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Painel interno</p>
          <h1>Atendimentos juridicos</h1>
        </div>
        <div className="header-summary">
          <strong>{meta?.total ?? 0}</strong>
          <span>registros encontrados</span>
        </div>
      </section>

      <FiltersPanel
        filters={filters}
        options={filterOptions}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {error && <div className="alert">{error}</div>}

      {loading && !dashboard ? (
        <div className="loading-state">
          <Loader2 className="spin" size={22} />
          Carregando dados
        </div>
      ) : (
        <>
          <KpiCards kpis={dashboard?.kpis} />
          <ChartsSection charts={dashboard?.charts} />

          <section className="table-section">
            <div className="panel-header table-header">
              <div>
                <h2>Agendamentos</h2>
                <p>
                  {activeFilterCount > 0
                    ? `${activeFilterCount} filtro(s) ativo(s)`
                    : 'Listagem completa'}
                </p>
              </div>

              <div className="export-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={exporting || loading}
                  onClick={() => handleExport('csv')}
                >
                  <Download size={17} />
                  CSV
                </button>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={exporting || loading}
                  onClick={() => handleExport('pdf')}
                >
                  <FileText size={17} />
                  PDF
                </button>
              </div>
            </div>

            {loading ? (
              <div className="inline-loading">
                <Loader2 className="spin" size={18} />
                Atualizando listagem
              </div>
            ) : (
              <AtendimentosTable
                atendimentos={atendimentos}
                sort={sort}
                onSortChange={(nextSort) => {
                  setSort(nextSort);
                  setPagination((current) => ({ ...current, page: 1 }));
                }}
              />
            )}

            <Pagination
              meta={meta}
              limit={pagination.limit}
              onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
              onLimitChange={handleLimitChange}
            />
          </section>
        </>
      )}
    </main>
  );
}
