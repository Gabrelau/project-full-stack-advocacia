import { RotateCcw, Search } from 'lucide-react';

export function FiltersPanel({
  filters,
  options,
  onChange,
  onReset,
}) {
  const updateFilter = (key) => (event) => {
    onChange({
      ...filters,
      [key]: event.target.value,
    });
  };

  return (
    <section className="filters-panel" aria-label="Filtros de atendimentos">
      <label className="field field-wide">
        <span>Busca</span>
        <div className="input-with-icon">
          <Search size={17} />
          <input
            placeholder="Cliente, advogado ou area juridica"
            type="search"
            value={filters.search}
            onChange={updateFilter('search')}
          />
        </div>
      </label>

      <label className="field">
        <span>Status</span>
        <select aria-label="Status" value={filters.status} onChange={updateFilter('status')}>
          <option value="">Todos</option>
          {(options.status || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Tipo</span>
        <select aria-label="Tipo" value={filters.tipo} onChange={updateFilter('tipo')}>
          <option value="">Todos</option>
          {(options.tipos || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Realizado</span>
        <select aria-label="Realizado" value={filters.realizado} onChange={updateFilter('realizado')}>
          <option value="">Todos</option>
          {(options.realizados || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Organizacao</span>
        <select
          aria-label="Organizacao"
          value={filters.organizacao}
          onChange={updateFilter('organizacao')}
        >
          <option value="">Todas</option>
          {(options.organizacoes || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Responsavel</span>
        <select
          aria-label="Responsavel"
          value={filters.responsavel}
          onChange={updateFilter('responsavel')}
        >
          <option value="">Todos</option>
          {(options.responsaveis || []).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Data inicial</span>
        <input
          aria-label="Data inicial"
          type="date"
          value={filters.startDate}
          onChange={updateFilter('startDate')}
        />
      </label>

      <label className="field">
        <span>Data final</span>
        <input
          aria-label="Data final"
          type="date"
          value={filters.endDate}
          onChange={updateFilter('endDate')}
        />
      </label>

      <button className="button button-secondary" type="button" onClick={onReset}>
        <RotateCcw size={17} />
        Limpar
      </button>
    </section>
  );
}
