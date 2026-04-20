import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { buildLeadPayload, submitLeadInBackground } from '../services/submitLead'

// Esquema de validação com Yup
const schema = yup.object().shape({
  name: yup.string().required('Informe seu nome'),
  company: yup.string().required('Informe o nome da empresa'),
  whatsapp: yup
    .string()
    .required('Informe seu WhatsApp')
    .test('len', 'WhatsApp inválido', (val) => val.replace(/\D/g, '').length >= 10),
  segment: yup.string().required('Informe o segmento'),
  difficulty: yup.string().required('Descreva sua principal dificuldade'),
})

// Função utilitária de máscara manual (React 19 friendly)
const formatWhatsApp = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/\D/g, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 3) return `(${phoneNumber}`
  if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`
  if (phoneNumberLength < 11) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`
}

export default function LeadForm({ content, whatsappLink }) {
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      company: '',
      whatsapp: '',
      segment: '',
      difficulty: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const payload = buildLeadPayload(data)
      const backgroundPromise = submitLeadInBackground(payload)

      // Feedback imediato de sucesso (UX Premium)
      setIsSuccess(true)
      
      // Monitorar se falha silenciosamente no background (mantendo a UI limpa)
      backgroundPromise.then((result) => {
        if (!result.ok) {
          console.warn('Erro silencioso no envio:', result.message)
        }
      })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-10 text-center bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[24px] min-h-[400px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        </motion.div>
        <h3 className="text-2xl font-black tracking-tight text-white mb-4">Conexão Estabelecida</h3>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          {content.success}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsSuccess(false)
            reset()
          }}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-colors flex items-center gap-2"
        >
          Voltar ao Início
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[24px] p-1 overflow-hidden"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-slate-300 ml-1">
              {content.fields.name}
            </label>
            <div className="relative group">
              <input
                id="name"
                disabled={isSubmitting}
                {...register('name')}
                placeholder={content.placeholders.name}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 -bottom-6 text-xs font-medium text-red-500 ml-1"
                  >
                    {errors.name.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Empresa */}
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-bold text-slate-300 ml-1">
              {content.fields.company}
            </label>
            <div className="relative group">
              <input
                id="company"
                disabled={isSubmitting}
                {...register('company')}
                placeholder={content.placeholders.company}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <AnimatePresence>
                {errors.company && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 -bottom-6 text-xs font-medium text-red-500 ml-1"
                  >
                    {errors.company.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="whatsapp" className="text-sm font-bold text-slate-300 ml-1">
              {content.fields.whatsapp}
            </label>
            <div className="relative group">
              <Controller
                name="whatsapp"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    id="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    disabled={isSubmitting}
                    value={value}
                    onChange={(e) => onChange(formatWhatsApp(e.target.value))}
                    placeholder={content.placeholders.whatsapp}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                )}
              />
              <AnimatePresence>
                {errors.whatsapp && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 -bottom-6 text-xs font-medium text-red-500 ml-1"
                  >
                    {errors.whatsapp.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Segmento */}
          <div className="space-y-2">
            <label htmlFor="segment" className="text-sm font-bold text-slate-300 ml-1">
              {content.fields.segment}
            </label>
            <div className="relative group">
              <input
                id="segment"
                disabled={isSubmitting}
                {...register('segment')}
                placeholder={content.placeholders.segment}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <AnimatePresence>
                {errors.segment && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 -bottom-6 text-xs font-medium text-red-500 ml-1"
                  >
                    {errors.segment.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dificuldade */}
        <div className="space-y-2 pt-2">
          <label htmlFor="difficulty" className="text-sm font-bold text-slate-300 ml-1">
            {content.fields.difficulty}
          </label>
          <div className="relative group">
            <textarea
              id="difficulty"
              rows={3}
              disabled={isSubmitting}
              {...register('difficulty')}
              placeholder={content.placeholders.difficulty}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <AnimatePresence>
              {errors.difficulty && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 -bottom-6 text-xs font-medium text-red-500 ml-1"
                >
                  {errors.difficulty.message}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-6">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-full min-h-[60px] bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-black text-lg rounded-xl transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>{content.button}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
          
          <div className="mt-4 text-center">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
              🔒 Seus dados não serão compartilhados com terceiros
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
