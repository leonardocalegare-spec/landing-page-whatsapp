const SHEET_NAME = 'Leads';
const DASHBOARD_SHEET_NAME = 'Dashboard';

const STATUS_OPTIONS = [
  'Novo',
  'Em contato',
  'Qualificado',
  'Proposta enviada',
  'Fechado',
  'Perdido'
];

const HEADERS = [
  'createdAt',
  'name',
  'company',
  'whatsapp',
  'segment',
  'difficulty',
  'contactsSource',
  'afterLeadArrival',
  'mainBottleneck',
  'currentTools',
  'scenario',
  'source',
  'status',
  'owner',
  'lastContactAt',
  'nextFollowUp',
  'notes'
];

const REQUIRED_FIELDS = [
  'createdAt',
  'name',
  'company',
  'whatsapp',
  'segment',
  'difficulty',
  'source'
];

const LEGACY_HEADER_ALIASES = {
  contactArrival: 'contactsSource',
  afterContact: 'afterLeadArrival',
  difficultyFocus: 'mainBottleneck',
  scenarioDetails: 'scenario'
};

const LEADS_HEADER_GROUPS = {
  identification: ['createdAt', 'name', 'company', 'whatsapp', 'segment'],
  diagnostic: [
    'difficulty',
    'contactsSource',
    'afterLeadArrival',
    'mainBottleneck',
    'currentTools',
    'scenario'
  ],
  operation: ['source', 'status', 'owner', 'lastContactAt', 'nextFollowUp', 'notes']
};

const LEADS_THEME = {
  header: {
    identification: '#183040',
    diagnostic: '#213748',
    operation: '#2a3442'
  },
  body: {
    base: '#f3f6fb',
    identification: '#eef3f8',
    diagnostic: '#e9f0f5',
    operation: '#eef2f7'
  },
  borders: '#d7dee8',
  text: '#0f172a',
  textSoft: '#475569'
};

const DASHBOARD_THEME = {
  canvas: '#0f1724',
  canvasAlt: '#111c2c',
  panel: '#162132',
  panelAlt: '#1b2940',
  panelSoft: '#22314b',
  border: '#2b3b52',
  text: '#edf4ff',
  textSoft: '#9db0c9',
  accentBlue: '#223f66',
  accentTeal: '#1d4b4b',
  accentAmber: '#5b4820',
  accentPurple: '#41325f',
  accentGreen: '#244d39',
  accentRed: '#5a2e35'
};

const SPREADSHEET_ID = '1ivPyOHKNP0-NDHTZcIa7VLR7zecDEtAUEpxsRhu8pwQ';

function getSpreadsheet() {
  if (!SPREADSHEET_ID) {
    throw new Error('Configure o SPREADSHEET_ID antes de publicar o Web App.');
  }

  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet() {
  var spreadsheet = getSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaders(sheet);
  ensureLeadSheetFormatting(sheet);
  ensureDashboardSheet(spreadsheet);

  return sheet;
}

function getCurrentHeaders(sheet) {
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .map(function(value) {
      return String(value || '').trim();
    });

  while (headers.length > 0 && !headers[headers.length - 1]) {
    headers.pop();
  }

  return headers;
}

function getHeaderMap(sheet) {
  return getCurrentHeaders(sheet).reduce(function(map, header, index) {
    if (header) {
      map[header] = index + 1;
    }

    return map;
  }, {});
}

function insertColumnAt(sheet, columnIndex) {
  var maxColumns = sheet.getMaxColumns();

  if (columnIndex > maxColumns) {
    sheet.insertColumnsAfter(maxColumns, columnIndex - maxColumns);
    return;
  }

  sheet.insertColumnBefore(columnIndex);
}

function moveColumn(sheet, fromIndex, toIndex) {
  if (fromIndex === toIndex) {
    return;
  }

  sheet.moveColumns(sheet.getRange(1, fromIndex, sheet.getMaxRows(), 1), toIndex);
}

function applyHeaderAliases(sheet, currentHeaders) {
  Object.keys(LEGACY_HEADER_ALIASES).forEach(function(legacyHeader) {
    var canonicalHeader = LEGACY_HEADER_ALIASES[legacyHeader];
    var legacyIndex = currentHeaders.indexOf(legacyHeader);
    var canonicalIndex = currentHeaders.indexOf(canonicalHeader);

    if (legacyIndex === -1 || canonicalIndex !== -1) {
      return;
    }

    sheet.getRange(1, legacyIndex + 1).setValue(canonicalHeader);
    currentHeaders[legacyIndex] = canonicalHeader;
  });

  return currentHeaders;
}

function ensureHeaders(sheet) {
  var filter = sheet.getFilter();

  if (filter) {
    filter.remove();
  }

  var currentHeaders = applyHeaderAliases(sheet, getCurrentHeaders(sheet));

  if (currentHeaders.length === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  HEADERS.forEach(function(header) {
    if (currentHeaders.indexOf(header) !== -1) {
      return;
    }

    var nextColumn = currentHeaders.length + 1;
    insertColumnAt(sheet, nextColumn);
    sheet.getRange(1, nextColumn).setValue(header);
    currentHeaders.push(header);
  });
}

function getHeaderIndex(headerName, sheet) {
  if (sheet) {
    var headerMap = getHeaderMap(sheet);
    var realHeaderIndex = headerMap[headerName];

    if (realHeaderIndex) {
      return realHeaderIndex;
    }
  }

  var headerIndex = HEADERS.indexOf(headerName);

  if (headerIndex === -1) {
    throw new Error('Header não encontrado: ' + headerName);
  }

  return headerIndex + 1;
}

function getColumnLetter(columnIndex) {
  var dividend = columnIndex;
  var columnName = '';

  while (dividend > 0) {
    var modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}

function getColumnLetterByHeader(headerName, sheet) {
  return getColumnLetter(getHeaderIndex(headerName, sheet));
}

function ensureLeadSheetFormatting(sheet) {
  var statusColumn = getHeaderIndex('status', sheet);
  var maxRows = Math.max(sheet.getMaxRows(), 2);
  var bodyRowCount = Math.max(maxRows - 1, 1);
  var lastColumn = Math.max(sheet.getLastColumn(), 1);

  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.setRowHeight(1, 34);

  sheet
    .getRange(1, 1, 1, lastColumn)
    .setFontWeight('bold')
    .setFontColor('#ffffff')
    .setFontFamily('Arial')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left')
    .setWrap(true)
    .setBackground(LEADS_THEME.header.identification)
    .setBorder(false, false, true, false, false, false, LEADS_THEME.borders, SpreadsheetApp.BorderStyle.SOLID);

  sheet
    .getRange(2, 1, bodyRowCount, lastColumn)
    .setFontColor(LEADS_THEME.text)
    .setFontFamily('Arial')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left')
    .setBackground(LEADS_THEME.body.base);

  sheet
    .getRange(2, 1, bodyRowCount, lastColumn)
    .setBorder(false, false, false, false, false, false);

  sheet
    .getRange(2, statusColumn, bodyRowCount, 1)
    .setHorizontalAlignment('center')
    .setFontWeight('bold');

  setLeadColumnWidths(sheet);
  setLeadWrapStrategy(sheet, bodyRowCount);
  styleLeadHeaderGroups(sheet);
  styleLeadBodyGroups(sheet, bodyRowCount);
  ensureFilter(sheet, lastColumn);
  ensureStatusValidation(sheet);
  ensureStatusConditionalFormatting(sheet);
}

function setLeadColumnWidths(sheet) {
  var widths = {
    createdAt: 170,
    name: 180,
    company: 190,
    whatsapp: 150,
    segment: 170,
    difficulty: 240,
    contactsSource: 210,
    afterLeadArrival: 250,
    mainBottleneck: 220,
    currentTools: 190,
    scenario: 320,
    source: 150,
    status: 130,
    owner: 130,
    lastContactAt: 150,
    nextFollowUp: 150,
    notes: 240
  };

  HEADERS.forEach(function(header) {
    var columnIndex = getHeaderIndex(header, sheet);
    sheet.setColumnWidth(columnIndex, widths[header] || 160);
  });
}

function setLeadWrapStrategy(sheet, bodyRowCount) {
  var wrapHeaders = ['difficulty', 'afterLeadArrival', 'mainBottleneck', 'scenario', 'notes'];
  var lastColumn = Math.max(sheet.getLastColumn(), 1);

  sheet
    .getRange(2, 1, bodyRowCount, lastColumn)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  wrapHeaders.forEach(function(header) {
    sheet
      .getRange(2, getHeaderIndex(header, sheet), bodyRowCount, 1)
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  });
}

function styleLeadHeaderGroups(sheet) {
  Object.keys(LEADS_HEADER_GROUPS).forEach(function(groupName) {
    var style = {
      background: LEADS_THEME.header[groupName],
      fontColor: '#ffffff'
    };

    LEADS_HEADER_GROUPS[groupName].forEach(function(header) {
      var columnIndex = getHeaderIndex(header, sheet);

      sheet
        .getRange(1, columnIndex)
        .setBackground(style.background)
        .setFontColor(style.fontColor)
        .setBorder(false, false, true, false, false, false, LEADS_THEME.borders, SpreadsheetApp.BorderStyle.SOLID);
    });
  });
}

function styleLeadBodyGroups(sheet, bodyRowCount) {
  var identificationHeaders = LEADS_HEADER_GROUPS.identification;
  var diagnosticHeaders = LEADS_HEADER_GROUPS.diagnostic;
  var operationHeaders = LEADS_HEADER_GROUPS.operation;

  identificationHeaders.forEach(function(header) {
    sheet
      .getRange(2, getHeaderIndex(header, sheet), bodyRowCount, 1)
      .setBackground(LEADS_THEME.body.identification);
  });

  diagnosticHeaders.forEach(function(header) {
    sheet
      .getRange(2, getHeaderIndex(header, sheet), bodyRowCount, 1)
      .setBackground(LEADS_THEME.body.diagnostic);
  });

  operationHeaders.forEach(function(header) {
    sheet
      .getRange(2, getHeaderIndex(header, sheet), bodyRowCount, 1)
      .setBackground(LEADS_THEME.body.operation);
  });

  ['difficulty', 'afterLeadArrival', 'mainBottleneck', 'scenario', 'notes'].forEach(function(header) {
    sheet
      .getRange(2, getHeaderIndex(header, sheet), bodyRowCount, 1)
      .setVerticalAlignment('top');
  });
}

function ensureFilter(sheet, lastColumn) {
  var filter = sheet.getFilter();

  if (filter) {
    filter.remove();
  }

  var rowCount = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(1, 1, rowCount, lastColumn).createFilter();
}

function ensureStatusConditionalFormatting(sheet) {
  var statusColumn = getHeaderIndex('status', sheet);
  var statusRange = sheet.getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1);
  var existingRules = sheet.getConditionalFormatRules().filter(function(rule) {
    return !rule.getRanges().some(function(range) {
      return range.getColumn() === statusColumn;
    });
  });

  var statusColors = {
    Novo: { background: '#dbe7f5', font: '#21426f' },
    'Em contato': { background: '#f3e4bf', font: '#7a5713' },
    Qualificado: { background: '#cfeae4', font: '#135b53' },
    'Proposta enviada': { background: '#ddd4ef', font: '#5b4682' },
    Fechado: { background: '#d4e7dc', font: '#21563a' },
    Perdido: { background: '#ecd3d7', font: '#7a3040' }
  };

  var statusRules = STATUS_OPTIONS.map(function(status) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(status)
      .setBackground((statusColors[status] || {}).background || '#ffffff')
      .setFontColor((statusColors[status] || {}).font || LEADS_THEME.text)
      .setBold(true)
      .setRanges([statusRange])
      .build();
  });

  sheet.setConditionalFormatRules(existingRules.concat(statusRules));
}

function ensureStatusValidation(sheet) {
  var statusColumn = getHeaderIndex('status', sheet);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, statusColumn, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);
}

function ensureDashboardSheet(spreadsheet) {
  var leadsSheet = spreadsheet.getSheetByName(SHEET_NAME);
  var dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME);

  if (!dashboardSheet) {
    dashboardSheet = spreadsheet.insertSheet(DASHBOARD_SHEET_NAME);
  }

  buildDashboard(dashboardSheet, leadsSheet);
}

function buildDashboard(dashboardSheet, leadsSheet) {
  var records = getLeadRecords(leadsSheet);

  dashboardSheet.clear();
  dashboardSheet.clearFormats();
  dashboardSheet.getRange(1, 1, 60, 14).breakApart();
  dashboardSheet.getRange(1, 1, 60, 14).setBackground(DASHBOARD_THEME.canvas);

  dashboardSheet.setFrozenRows(3);
  dashboardSheet.setHiddenGridlines(true);
  dashboardSheet.setColumnWidths(1, 14, 108);
  dashboardSheet.setRowHeights(1, 60, 28);
  dashboardSheet.setRowHeight(1, 34);
  dashboardSheet.setRowHeight(2, 30);
  dashboardSheet.setRowHeight(3, 18);
  dashboardSheet.setRowHeight(4, 24);
  dashboardSheet.setRowHeights(5, 2, 38);
  dashboardSheet.setRowHeight(8, 24);
  dashboardSheet.setRowHeight(23, 24);

  dashboardSheet.getRange('A1:N1').merge();
  dashboardSheet.getRange('A2:N2').merge();
  dashboardSheet.getRange('A3:N3').merge();
  dashboardSheet.getRange('A1').setValue('Dashboard Operação WhatsApp');
  dashboardSheet.getRange('A2').setValue(
    'Leitura rápida da entrada comercial, status dos leads e principais padrões do que está chegando.'
  );
  dashboardSheet.getRange('A3').setValue('Atualizado automaticamente a cada novo lead recebido.');

  dashboardSheet
    .getRange('A1')
    .setFontSize(19)
    .setFontWeight('bold')
    .setFontColor(DASHBOARD_THEME.text)
    .setVerticalAlignment('bottom');
  dashboardSheet
    .getRange('A2')
    .setFontSize(10)
    .setFontColor(DASHBOARD_THEME.textSoft)
    .setVerticalAlignment('top');
  dashboardSheet
    .getRange('A3')
    .setFontSize(9)
    .setFontColor('#7f92ab')
    .setVerticalAlignment('middle');

  setDashboardSectionLabel(dashboardSheet, 'A8:N8', 'Distribuição e leitura rápida da entrada');
  setDashboardSectionLabel(dashboardSheet, 'A23:N23', 'Acompanhamento operacional');

  setDashboardKpiCard(
    dashboardSheet,
    'A4:B4',
    'A5:B6',
    'Total de leads',
    countLeadRecords(records),
    DASHBOARD_THEME.accentBlue
  );
  setDashboardKpiCard(
    dashboardSheet,
    'C4:D4',
    'C5:D6',
    'Novos',
    buildStatusCountFormula(records, 'Novo'),
    DASHBOARD_THEME.accentTeal
  );
  setDashboardKpiCard(
    dashboardSheet,
    'E4:F4',
    'E5:F6',
    'Em contato',
    buildStatusCountFormula(records, 'Em contato'),
    DASHBOARD_THEME.accentAmber
  );
  setDashboardKpiCard(
    dashboardSheet,
    'G4:H4',
    'G5:H6',
    'Qualificados',
    buildStatusCountFormula(records, 'Qualificado'),
    '#224f55'
  );
  setDashboardKpiCard(
    dashboardSheet,
    'I4:J4',
    'I5:J6',
    'Fechados',
    buildStatusCountFormula(records, 'Fechado'),
    DASHBOARD_THEME.accentGreen
  );
  setDashboardKpiCard(
    dashboardSheet,
    'K4:L4',
    'K5:L6',
    'Perdidos',
    buildStatusCountFormula(records, 'Perdido'),
    DASHBOARD_THEME.accentRed
  );

  setDashboardTable(
    dashboardSheet,
    9,
    1,
    'Leads por status',
    buildDistributionFormula(records, 'status', 'Status')
  );
  setDashboardTable(
    dashboardSheet,
    9,
    4,
    'Leads por segmento',
    buildDistributionFormula(records, 'segment', 'Segmento')
  );
  setDashboardTable(
    dashboardSheet,
    9,
    7,
    'Leads por canal de entrada',
    buildDistributionFormula(records, 'contactsSource', 'Canal')
  );
  setDashboardTable(
    dashboardSheet,
    9,
    10,
    'Leads por principal dificuldade',
    buildDistributionFormula(records, 'mainBottleneck', 'Dificuldade')
  );
  setDashboardTable(
    dashboardSheet,
    9,
    13,
    'Leads por ferramenta atual',
    buildDistributionFormula(records, 'currentTools', 'Ferramenta')
  );

  setDashboardKpiCard(
    dashboardSheet,
    'A24:C24',
    'A25:C26',
    'Leads sem owner',
    buildBlankFieldCountFormula(records, 'owner'),
    DASHBOARD_THEME.accentPurple
  );
  setDashboardKpiCard(
    dashboardSheet,
    'D24:F24',
    'D25:F26',
    'Leads sem próximo follow-up',
    buildActiveBlankFieldCountFormula(records, 'nextFollowUp', 'status'),
    DASHBOARD_THEME.accentAmber
  );

  setDashboardWideTable(
    dashboardSheet,
    24,
    8,
    7,
    'Últimos leads recebidos',
    buildLatestLeadsFormula(records)
  );
}

function countLeadRecords(records) {
  return records.length;
}

function buildStatusCountFormula(records, statusLabel) {
  return records.filter(function(record) {
    return record.status === statusLabel;
  }).length;
}

function buildDistributionFormula(records, fieldName, label) {
  var counts = records.reduce(function(map, record) {
    var value = String(record[fieldName] || '').trim();

    if (!value) {
      return map;
    }

    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});

  var rows = Object.keys(counts)
    .sort(function(left, right) {
      if (counts[right] !== counts[left]) {
        return counts[right] - counts[left];
      }

      return left.localeCompare(right, 'pt-BR');
    })
    .map(function(key) {
      return [key, counts[key]];
    });

  if (rows.length === 0) {
    return [[label, 'Leads'], ['Sem dados', 0]];
  }

  return [[label, 'Leads']].concat(rows);
}

function buildBlankFieldCountFormula(records, fieldName) {
  return records.filter(function(record) {
    return !String(record[fieldName] || '').trim();
  }).length;
}

function buildActiveBlankFieldCountFormula(records, fieldName, statusFieldName) {
  return records.filter(function(record) {
    var status = String(record[statusFieldName] || '').trim();
    return !String(record[fieldName] || '').trim() && status !== 'Fechado' && status !== 'Perdido';
  }).length;
}

function buildLatestLeadsFormula(records) {
  var rows = records
    .slice()
    .sort(function(left, right) {
      return getSortableTimestamp(right.createdAt) - getSortableTimestamp(left.createdAt);
    })
    .slice(0, 8)
    .map(function(record) {
      return [
        formatLeadTimestamp(record.createdAt),
        record.name || '',
        record.company || '',
        record.status || 'Novo'
      ];
    });

  if (rows.length === 0) {
    return [['Recebido', 'Nome', 'Empresa', 'Status'], ['Sem dados', '', '', '']];
  }

  return [['Recebido', 'Nome', 'Empresa', 'Status']].concat(rows);
}

function getLeadRecords(sheet) {
  var headers = getCurrentHeaders(sheet);
  var lastRow = sheet.getLastRow();

  if (lastRow < 2 || headers.length === 0) {
    return [];
  }

  return sheet
    .getRange(2, 1, lastRow - 1, headers.length)
    .getValues()
    .reduce(function(records, row) {
      var record = headers.reduce(function(result, header, index) {
        result[header] = normalizeCellValue(row[index]);
        return result;
      }, {});

      if (hasRecordContent(record)) {
        records.push(record);
      }

      return records;
    }, []);
}

function normalizeCellValue(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss");
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
}

function hasRecordContent(record) {
  return Boolean(
    record.createdAt ||
    record.name ||
    record.company ||
    record.whatsapp ||
    record.segment ||
    record.difficulty
  );
}

function getSortableTimestamp(value) {
  var date = new Date(value);
  var time = date.getTime();

  if (isNaN(time)) {
    return 0;
  }

  return time;
}

function formatLeadTimestamp(value) {
  var date = new Date(value);

  if (isNaN(date.getTime())) {
    return value || '';
  }

  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

function setDashboardKpiCard(sheet, labelRangeA1, valueRangeA1, label, value, background) {
  var labelRange = sheet.getRange(labelRangeA1);
  var valueRange = sheet.getRange(valueRangeA1);

  labelRange.merge();
  valueRange.merge();

  labelRange
    .setValue(label)
    .setBackground(background)
    .setFontColor(DASHBOARD_THEME.textSoft)
    .setFontSize(9)
    .setFontWeight('bold')
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setBorder(true, true, false, true, false, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  valueRange
    .setValue(value)
    .setBackground(DASHBOARD_THEME.panel)
    .setFontColor(DASHBOARD_THEME.text)
    .setFontSize(20)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBorder(false, true, true, true, false, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

function setDashboardTable(sheet, row, column, title, rows) {
  var titleRange = sheet.getRange(row, column, 1, 2);
  var dataRange = sheet.getRange(row + 1, column, rows.length, 2);
  var tableHeaderRange = sheet.getRange(row + 1, column, 1, 2);
  var tableBodyRange = sheet.getRange(row + 2, column, Math.max(rows.length - 1, 1), 2);

  titleRange
    .merge()
    .setValue(title)
    .setBackground(DASHBOARD_THEME.panelAlt)
    .setFontColor(DASHBOARD_THEME.text)
    .setFontSize(10)
    .setFontWeight('bold')
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setBorder(true, true, false, true, false, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  dataRange
    .setValues(rows)
    .setFontColor(DASHBOARD_THEME.text)
    .setBackground(DASHBOARD_THEME.panel)
    .setBorder(false, true, true, true, true, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID)
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle');

  tableHeaderRange
    .setBackground(DASHBOARD_THEME.panelSoft)
    .setFontColor(DASHBOARD_THEME.textSoft)
    .setFontWeight('bold');

  if (rows.length > 1) {
    tableBodyRange
      .setBackground(DASHBOARD_THEME.panel)
      .setFontColor(DASHBOARD_THEME.text)
      .setFontSize(10);
  }

  sheet.setColumnWidth(column, 196);
  sheet.setColumnWidth(column + 1, 88);
}

function setDashboardWideTable(sheet, row, column, width, title, rows) {
  var titleRange = sheet.getRange(row, column, 1, width);
  var cardRange = sheet.getRange(row + 1, column, rows.length, width);
  var dataRange = sheet.getRange(row + 1, column, rows.length, 4);
  var tableHeaderRange = sheet.getRange(row + 1, column, 1, 4);
  var tableBodyRange = sheet.getRange(row + 2, column, Math.max(rows.length - 1, 1), 4);

  titleRange
    .merge()
    .setValue(title)
    .setBackground(DASHBOARD_THEME.panelAlt)
    .setFontColor(DASHBOARD_THEME.text)
    .setFontSize(10)
    .setFontWeight('bold')
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setBorder(true, true, false, true, false, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  cardRange
    .setBackground(DASHBOARD_THEME.panel)
    .setBorder(false, true, true, true, true, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);

  dataRange
    .setValues(rows)
    .setFontColor(DASHBOARD_THEME.text)
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle');

  tableHeaderRange
    .setBackground(DASHBOARD_THEME.panelSoft)
    .setFontColor(DASHBOARD_THEME.textSoft)
    .setFontWeight('bold');

  if (rows.length > 1) {
    tableBodyRange
      .setBackground(DASHBOARD_THEME.panel)
      .setFontColor(DASHBOARD_THEME.text)
      .setFontSize(10);
  }

  sheet.setColumnWidth(column, 132);
  sheet.setColumnWidth(column + 1, 172);
  sheet.setColumnWidth(column + 2, 182);
  sheet.setColumnWidth(column + 3, 116);
}

function setDashboardSectionLabel(sheet, rangeA1, label) {
  sheet
    .getRange(rangeA1)
    .merge()
    .setValue(label)
    .setBackground(DASHBOARD_THEME.canvasAlt)
    .setFontColor(DASHBOARD_THEME.textSoft)
    .setFontSize(9)
    .setFontWeight('bold')
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setBorder(false, false, true, false, false, false, DASHBOARD_THEME.border, SpreadsheetApp.BorderStyle.SOLID);
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Corpo da requisição ausente.');
  }

  return JSON.parse(e.postData.contents);
}

function getNormalizedValue(payload, keys) {
  for (var i = 0; i < keys.length; i += 1) {
    var value = payload[keys[i]];

    if (value === undefined || value === null) {
      continue;
    }

    var normalizedValue = String(value).trim();

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return '';
}

function normalizePayload(payload) {
  return {
    createdAt: getNormalizedValue(payload, ['createdAt']),
    name: getNormalizedValue(payload, ['name']),
    company: getNormalizedValue(payload, ['company']),
    whatsapp: getNormalizedValue(payload, ['whatsapp']),
    segment: getNormalizedValue(payload, ['segment']),
    difficulty: getNormalizedValue(payload, ['difficulty']),
    contactsSource: getNormalizedValue(payload, ['contactsSource', 'contactArrival']),
    afterLeadArrival: getNormalizedValue(payload, ['afterLeadArrival', 'afterContact']),
    mainBottleneck: getNormalizedValue(payload, ['mainBottleneck', 'difficultyFocus']),
    currentTools: getNormalizedValue(payload, ['currentTools']),
    scenario: getNormalizedValue(payload, ['scenario', 'scenarioDetails']),
    source: getNormalizedValue(payload, ['source'])
  };
}

function validatePayload(payload) {
  var missingFields = REQUIRED_FIELDS.filter(function(field) {
    return !payload[field];
  });

  if (missingFields.length > 0) {
    throw new Error('Campos obrigatórios ausentes: ' + missingFields.join(', '));
  }
}

function buildLeadRecord(payload) {
  return {
    createdAt: payload.createdAt,
    name: payload.name,
    company: payload.company,
    whatsapp: payload.whatsapp,
    segment: payload.segment,
    difficulty: payload.difficulty,
    contactsSource: payload.contactsSource || '',
    afterLeadArrival: payload.afterLeadArrival || '',
    mainBottleneck: payload.mainBottleneck || '',
    currentTools: payload.currentTools || '',
    scenario: payload.scenario || '',
    source: payload.source,
    status: 'Novo',
    owner: '',
    lastContactAt: '',
    nextFollowUp: '',
    notes: ''
  };
}

function buildRow(payload, sheet) {
  var leadRecord = buildLeadRecord(payload);
  var headers = sheet ? getCurrentHeaders(sheet) : HEADERS;

  return headers.map(function(header) {
    return leadRecord[header] || '';
  });
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawPayload = parseRequestBody(e);
    var payload = normalizePayload(rawPayload);

    validatePayload(payload);

    var sheet = getOrCreateSheet();
    sheet.appendRow(buildRow(payload, sheet));
    ensureDashboardSheet(getSpreadsheet());

    return jsonResponse({
      success: true,
      message: 'Lead recebido e salvo com sucesso.'
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || 'Não foi possível processar o lead.'
    });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: 'Webhook ativo. Use POST para enviar leads.'
  });
}
