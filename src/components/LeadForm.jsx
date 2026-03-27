import { useState } from 'react'
import Button from './Button'
import { buildLeadPayload, submitLead } from '../services/submitLead'

const initialState = {
  name: '',
  company: '',
  whatsapp: '',
  segment: '',
  difficulty: '',
}

export default function LeadForm({ content }) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  function validate(values) {
    const nextErrors = {}

    if (!values.name.trim()) nextErrors.name = 'Informe seu nome.'
    if (!values.company.trim()) nextErrors.company = 'Informe o nome da empresa.'
    if (!values.whatsapp.trim()) {
      nextErrors.whatsapp = 'Informe seu WhatsApp.'
    } else if (values.whatsapp.replace(/\D/g, '').length < 10) {
      nextErrors.whatsapp = 'Informe um WhatsApp válido.'
    }
    if (!values.segment.trim()) nextErrors.segment = 'Informe o segmento.'
    if (!values.difficulty.trim()) nextErrors.difficulty = 'Descreva a principal dificuldade.'

    return nextErrors
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedback({ type: '', message: '' })

    const validation = validate(formData)
    setErrors(validation)

    if (Object.keys(validation).length > 0) return

    try {
      setLoading(true)

      const payload = buildLeadPayload(formData)
      const result = await submitLead(payload)

      if (!result.ok) {
        setFeedback({ type: 'error', message: result.message })
        return
      }

      setFormData(initialState)
      setFeedback({
        type: result.mode === 'local' ? 'warning' : 'success',
        message: result.mode === 'local' ? result.message : content.success,
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Não foi possível enviar agora. Tente novamente em instantes.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{content.fields.name}</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="company">{content.fields.company}</label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nome da empresa"
          />
          {errors.company && <span className="field-error">{errors.company}</span>}
        </div>

        <div className="field">
          <label htmlFor="whatsapp">{content.fields.whatsapp}</label>
          <input
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
          />
          {errors.whatsapp && <span className="field-error">{errors.whatsapp}</span>}
        </div>

        <div className="field">
          <label htmlFor="segment">{content.fields.segment}</label>
          <input
            id="segment"
            name="segment"
            value={formData.segment}
            onChange={handleChange}
            placeholder="Ex.: clínica estética"
          />
          {errors.segment && <span className="field-error">{errors.segment}</span>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="difficulty">{content.fields.difficulty}</label>
        <textarea
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          rows="5"
          placeholder="Ex.: demoramos para responder, perdemos contatos e não temos um fluxo claro"
        />
        {errors.difficulty && <span className="field-error">{errors.difficulty}</span>}
      </div>

      <div className="form-actions">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : content.button}
        </Button>
      </div>

      {feedback.message && (
        <p className={`form-feedback${feedback.type ? ` form-feedback--${feedback.type}` : ''}`}>
          {feedback.message}
        </p>
      )}
    </form>
  )
}
