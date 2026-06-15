import { compactEmpty, formatDate } from './formatters.js';

const columns = [
  { header: 'Cliente', key: 'nomeAssistido' },
  { header: 'Data', key: 'dataAgendamento' },
  { header: 'Hora', key: 'horaInicio' },
  { header: 'Advogado/Responsavel', key: 'responsavelAgendamento' },
  { header: 'Area/Organizacao', key: 'organizacao' },
  { header: 'Status', key: 'status' },
  { header: 'Realizado', key: 'agendamentoRealizado' },
];

function mapRow(item) {
  return {
    nomeAssistido: compactEmpty(item.nomeAssistido),
    dataAgendamento: formatDate(item.dataAgendamento),
    horaInicio: compactEmpty(item.horaInicio),
    responsavelAgendamento: compactEmpty(item.responsavelAgendamento),
    organizacao: compactEmpty(item.organizacao),
    status: compactEmpty(item.status),
    agendamentoRealizado: compactEmpty(item.agendamentoRealizado),
  };
}

function buildFileName(extension) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return `atendimentos-${timestamp}.${extension}`;
}

export function exportToCsv(items) {
  const rows = items.map(mapRow);
  const header = columns.map((column) => column.header);
  const body = rows.map((row) => columns.map((column) => row[column.key]));
  const csv = [header, ...body]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  // O BOM ajuda o Excel a abrir o CSV com acentos e separador corretos no Windows.
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = buildFileName('csv');
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToPdf(items) {
  // PDF e autotable sao carregados sob demanda para nao pesar a abertura do dashboard.
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ orientation: 'landscape' });
  const rows = items.map(mapRow);

  doc.setFontSize(14);
  doc.text('Listagem de atendimentos juridicos', 14, 16);
  doc.setFontSize(9);
  doc.text(`Total exportado: ${items.length}`, 14, 23);

  autoTable(doc, {
    startY: 30,
    head: [columns.map((column) => column.header)],
    body: rows.map((row) => columns.map((column) => row[column.key])),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save(buildFileName('pdf'));
}
