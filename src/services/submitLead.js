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

function saveLeadLocally(payload) {
  const existing = JSON.parse(window.localStorage.getItem('landing_leads') || '[]')
  existing.push(payload)
  window.localStorage.setItem('landing_leads', JSON.stringify(existing))
}

export async function submitLead(payload) {
  const { endpoint, enableLocalFallback, requestHeaders } = LEAD_CAPTURE_CONFIG

  if (!endpoint) {
    if (enableLocalFallback) {
      saveLeadLocally(payload)
      return {
        ok: true,
        mode: 'local',
        message: 'Lead salvo localmente para teste. Configure o endpoint real para ativar a captação online.',
      }
    }

    return {
      ok: false,
      message:
        'A captação ainda não está conectada. Configure o endpoint do webhook para ativar o envio real.',
    }
  }

  let response

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    })
  } catch (error) {
    return {
      ok: false,
      message: 'Não foi possível enviar agora. Verifique o endpoint e tente novamente em instantes.',
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      message: 'O envio não foi concluído. Revise o webhook configurado e tente novamente.',
      status: response.status,
    }
  }

  return {
    ok: true,
    mode: 'remote',
  }
}
