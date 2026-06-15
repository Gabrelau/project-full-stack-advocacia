export function formatDate(value) {
  if (!value) {
    return 'Nao informado';
  }

  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatMonth(value) {
  if (!value) {
    return 'Nao informado';
  }

  const [year, month] = value.split('-');
  return `${month}/${year}`;
}

export function compactEmpty(value) {
  return value || 'Nao informado';
}
