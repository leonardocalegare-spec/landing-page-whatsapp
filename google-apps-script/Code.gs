const SHEET_NAME = 'Leads'
const DASHBOARD_SHEET_NAME = 'Dashboard'
const STATUS_OPTIONS = [
  'Novo',
  'Em contato',
  'Qualificado',
  'Proposta enviada',
  'Fechado',
  'Perdido',
]
const HEADERS = [
  'createdAt',
  'name',
  'company',
  'whatsapp',
  'segment',
  'difficulty',
  'source',
  'status',
  'owner',
  'lastContactAt',
  'nextFollowUp',
  'notes',
]
const REQUIRED_FIELDS = ['createdAt', 'name', 'company', 'whatsapp', 'segment', 'difficulty', 'source']
const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA'

function getSpreadsheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'COLE_AQUI_O_ID_DA_PLANILHA') {
    throw new Error('Configure o SPREADSHEET_ID antes de publicar o Web App.')
  }

  return SpreadsheetApp.openById(SPREADSHEET_ID)
}

function getOrCreateSheet() {
  const spreadsheet = getSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
  }

  ensureHeaders(sheet)
  ensureLeadSheetFormatting(sheet)
  ensureDashboardSheet(spreadsheet)

  return sheet
}

function ensureHeaders(sheet) {
  const currentHeaders = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getValues()[0]
    .map(String)
    .map((value) => value.trim())

  const hasExpectedHeaders = HEADERS.every((header, index) => currentHeaders[index] === header)

  if (!hasExpectedHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
  }
}

function ensureLeadSheetFormatting(sheet) {
  sheet.setFrozenRows(1)
  ensureFilter(sheet)
  ensureStatusValidation(sheet)
}

function ensureFilter(sheet) {
  if (sheet.getFilter()) {
    return
  }

  const rowCount = Math.max(sheet.getLastRow(), 1)
  sheet.getRange(1, 1, rowCount, HEADERS.length).createFilter()
}

function ensureStatusValidation(sheet) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build()

  sheet.getRange(2, 8, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule)
}

function ensureDashboardSheet(spreadsheet) {
  let dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME)

  if (!dashboardSheet) {
    dashboardSheet = spreadsheet.insertSheet(DASHBOARD_SHEET_NAME)
  }

  dashboardSheet.getRange(1, 1, 1, 2).setValues([['Status', 'Total']])
  dashboardSheet.getRange(2, 1, STATUS_OPTIONS.length, 1).setValues(
    STATUS_OPTIONS.map((status) => [status]),
  )
  dashboardSheet.getRange(2, 2, STATUS_OPTIONS.length, 1).setFormulas(
    STATUS_OPTIONS.map((_, index) => [`=COUNTIF(${SHEET_NAME}!H:H,A${index + 2})`]),
  )
  dashboardSheet.setFrozenRows(1)
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Corpo da requisição ausente.')
  }

  return JSON.parse(e.postData.contents)
}

function validatePayload(payload) {
  const missingFields = REQUIRED_FIELDS.filter((field) => !payload[field])

  if (missingFields.length > 0) {
    throw new Error('Campos obrigatórios ausentes: ' + missingFields.join(', '))
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
    source: payload.source,
    status: 'Novo',
    owner: '',
    lastContactAt: '',
    nextFollowUp: '',
    notes: '',
  }
}

function buildRow(payload) {
  const leadRecord = buildLeadRecord(payload)
  return HEADERS.map((header) => leadRecord[header] || '')
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function doPost(e) {
  try {
    const payload = parseRequestBody(e)
    validatePayload(payload)

    const sheet = getOrCreateSheet()
    sheet.appendRow(buildRow(payload))
    ensureDashboardSheet(getSpreadsheet())

    return jsonResponse({
      success: true,
      message: 'Lead recebido e salvo com sucesso.',
    })
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || 'Não foi possível processar o lead.',
    })
  }
}
