const SHEET_NAME = 'Leads'
const HEADERS = ['name', 'company', 'whatsapp', 'segment', 'difficulty', 'createdAt', 'source']
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
    sheet.setFrozenRows(1)
  }
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Corpo da requisição ausente.')
  }

  return JSON.parse(e.postData.contents)
}

function validatePayload(payload) {
  const requiredFields = ['name', 'company', 'whatsapp', 'segment', 'difficulty', 'createdAt', 'source']
  const missingFields = requiredFields.filter((field) => !payload[field])

  if (missingFields.length > 0) {
    throw new Error('Campos obrigatórios ausentes: ' + missingFields.join(', '))
  }
}

function buildRow(payload) {
  return HEADERS.map((header) => payload[header] || '')
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
