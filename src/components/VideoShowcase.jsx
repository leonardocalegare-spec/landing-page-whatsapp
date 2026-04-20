import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Constantes ──────────────────────────────────────────────────────────────
const VIDEO_SRC = '/videos/demo.mp4'

// ─── Variantes de animação ────────────────────────────────────────────────────
const WRAPPER_VARIANTS = {
  hidden: { opacity: 0, y: 56, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
}

const MOCKUP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VideoShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      className="vsc-root"
      variants={WRAPPER_VARIANTS}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {/* ── Glow ambiental ── */}
      <div className="vsc-glow" aria-hidden="true" />
      <div className="vsc-glow vsc-glow--secondary" aria-hidden="true" />


      <motion.div className="vsc-browser" variants={MOCKUP_VARIANTS}>
        {/* Barra do navegador */}
        <div className="vsc-bar" role="presentation">
          {/* Traffic lights */}
          <div className="vsc-dots" aria-hidden="true">
            <span className="vsc-dot vsc-dot--red" />
            <span className="vsc-dot vsc-dot--yellow" />
            <span className="vsc-dot vsc-dot--green" />
          </div>

          {/* Barra de endereço */}
          <div className="vsc-address" aria-label="URL de demonstração">
            <svg
              className="vsc-address-lock"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" opacity=".4" />
              <path
                d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity=".7"
              />
            </svg>
            <span className="vsc-address-text">operacaowpp.com.br</span>
          </div>

          {/* Ícones de ação direita */}
          <div className="vsc-bar-actions" aria-hidden="true">
            <span className="vsc-action-pill" />
            <span className="vsc-action-pill vsc-action-pill--sm" />
          </div>
        </div>

        {/* Viewport do vídeo */}
        <div className="vsc-viewport">
          <video
            className="vsc-video"
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Demonstração do sistema de atendimento via WhatsApp em funcionamento"
          />

          {/* Reflexo sutil no topo do vídeo */}
          <div className="vsc-viewport-sheen" aria-hidden="true" />
        </div>
      </motion.div>

      {/* ── Legenda abaixo do mockup ── */}
      <motion.p
        className="vsc-caption"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.65, duration: 0.5 } },
        }}
      >
        Sistema rodando em produção — configurado em menos de 48h
      </motion.p>
    </motion.div>
  )
}
