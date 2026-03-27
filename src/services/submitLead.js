import { LEAD_CAPTURE_CONFIG } from '../config/leadCapture'

export function buildLeadPayload(values) {
  return {
    name: values.name.trim(),
    company: values.company.trim(),
    whatsapp: values.whatsapp.trim(),
    segment: values.segment.trim(),
    difficulty: values.difficulty.trim(),
    createdAt: new Date().toISOString(),
    source: LEAD_CAPTURE_CONFIG.source,
  }
}

async function readResponseBody(response) {
  const responseText = await response.text()

  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return null
  }
}

function getEndpoint() {
  return String(LEAD_CAPTURE_CONFIG.endpoint || '').trim()
}

function getRequestOptions(payload, extraOptions = {}) {
  return {
    method: 'POST',
    headers: {
      ...LEAD_CAPTURE_CONFIG.requestHeaders,
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
    redirect: 'follow',
    ...extraOptions,
  }
}

async function sendLead(endpoint, payload, extraOptions = {}) {
  return fetch(endpoint, getRequestOptions(payload, extraOptions))
}

export async function submitLead(payload) {
  const endpoint = getEndpoint()

  if (!endpoint) {
    return {
      ok: false,
      message: 'A captação ainda não está conectada. Verifique a configuração da API de leads.',
    }
  }

  let response

  try {
    console.info('[lead-submit] sending lead', {
      endpoint,
      source: payload.source,
      contentType: LEAD_CAPTURE_CONFIG.requestHeaders['Content-Type'],
    })

    response = await sendLead(endpoint, payload)
  } catch (error) {
    console.error('[lead-submit] request failed', error)

    return {
      ok: false,
      message: 'Não foi possível enviar agora. Tente novamente em instantes.',
    }
  }

  console.info('[lead-submit] response received', {
    ok: response.ok,
    status: response.status,
    type: response.type,
  })

  const responseData = await readResponseBody(response)

  if (!response.ok) {
    return {
      ok: false,
      message:
        responseData?.message || 'O envio não foi concluído. Revise a integração e tente novamente.',
      status: response.status,
    }
  }

  if (responseData?.success === false) {
    return {
      ok: false,
      message:
        responseData.message || 'Não foi possível gravar o lead. Tente novamente em instantes.',
    }
  }

  return {
    ok: true,
    mode: 'remote',
    message: responseData?.message,
  }
}
