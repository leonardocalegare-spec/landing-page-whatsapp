const REQUIRED_FIELDS = ['name', 'company', 'whatsapp', 'segment', 'difficulty', 'createdAt', 'source']

function readBody(req) {
  if (!req.body) {
    return null
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
  }

  return req.body
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'Corpo da requisição inválido.'
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = payload[field]
    return typeof value !== 'string' || !value.trim()
  })

  if (missingFields.length > 0) {
    return `Campos obrigatórios ausentes: ${missingFields.join(', ')}.`
  }

  return null
}

async function readAppsScriptResponse(response) {
  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return {
      success: false,
      message: 'O Apps Script retornou uma resposta não JSON.',
      raw: responseText,
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      success: false,
      message: 'Método não permitido.',
    })
  }

  const endpoint = String(process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL || '').trim()

  if (!endpoint) {
    console.error('[api/lead] missing GOOGLE_APPS_SCRIPT_WEBHOOK_URL')

    return res.status(500).json({
      success: false,
      message: 'Webhook do Google Apps Script não configurado no servidor.',
    })
  }

  let payload

  try {
    payload = readBody(req)
  } catch (error) {
    console.error('[api/lead] invalid JSON body', error)

    return res.status(400).json({
      success: false,
      message: 'JSON inválido no corpo da requisição.',
    })
  }

  const validationError = validatePayload(payload)

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    })
  }

  console.info('[api/lead] forwarding lead', {
    endpoint,
    source: payload.source,
  })

  let appsScriptResponse

  try {
    appsScriptResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })
  } catch (error) {
    console.error('[api/lead] upstream request failed', error)

    return res.status(502).json({
      success: false,
      message: 'Não foi possível conectar ao Google Apps Script.',
    })
  }

  const responseData = await readAppsScriptResponse(appsScriptResponse)

  console.info('[api/lead] upstream response', {
    ok: appsScriptResponse.ok,
    status: appsScriptResponse.status,
    success: responseData?.success,
  })

  if (!appsScriptResponse.ok) {
    return res.status(502).json({
      success: false,
      message:
        responseData?.message ||
        'O Google Apps Script respondeu com erro ao processar o lead.',
    })
  }

  if (responseData?.success === false) {
    return res.status(502).json({
      success: false,
      message:
        responseData.message || 'O Google Apps Script não conseguiu gravar o lead na planilha.',
    })
  }

  return res.status(200).json({
    success: true,
    message: responseData?.message || 'Lead recebido e encaminhado com sucesso.',
  })
}
