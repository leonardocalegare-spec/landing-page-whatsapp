import Header from './components/Header'
import Section from './components/Section'
import Button from './components/Button'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'
import VideoShowcase from './components/VideoShowcase'
import FloatingActions from './components/FloatingActions'
import { motion } from 'framer-motion'
import { UserX, MessagesSquare, GitMerge, CheckCircle2 } from 'lucide-react'
import { content } from './data/content'

// ─── Mapa de ícones por nome (evita dynamic import) ──────────────────────────
const PAIN_ICONS = { UserX, MessagesSquare, GitMerge }

// Variante de card para herdar o stagger do Section pai
const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── PainCard ─────────────────────────────────────────────────────────────────
function PainCard({ item }) {
  const Icon = PAIN_ICONS[item.icon]
  return (
    <motion.article className="info-card" variants={cardVariant}>
      {Icon && (
        <span className="pain-icon-wrap" aria-hidden="true">
          <Icon size={22} strokeWidth={1.75} />
        </span>
      )}
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </motion.article>
  )
}

// ─── StepCard ─────────────────────────────────────────────────────────────────
function StepCard({ step, isLast }) {
  return (
    <motion.article
      className={`step-flow-card${isLast ? ' step-flow-card--last' : ''}`}
      variants={cardVariant}
    >
      <div className="step-flow-left">
        <span className="step-flow-number">{step.number}</span>
        {!isLast && <span className="step-flow-line" aria-hidden="true" />}
      </div>
      <div className="step-flow-body">
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </div>
    </motion.article>
  )
}



function App() {
  const whatsappMessage = encodeURIComponent(
    'Olá, Leonardo. Vi sua página e quero entender melhor como funciona a estruturação do atendimento via WhatsApp.',
  )
  const whatsappLink = `https://wa.me/${content.whatsappNumber}?text=${whatsappMessage}`
  const whatsappDisplay = content.whatsappDisplay
  const primaryCtaHref = '#lead-form'

  return (
    <div id="top">
      <Header
        brand={content.brand}
        brandTagline={content.brandTagline}
        nav={content.nav}
        ctaHref={primaryCtaHref}
        ctaLabel={content.headerCta || content.primaryCta}
      />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1>{content.hero.title}</h1>
              <p>{content.hero.subtitle}</p>

              <ul className="hero-bullets">
                {content.hero.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="hero-actions">
                <Button href={primaryCtaHref}>{content.primaryCta}</Button>
              </div>
            </div>

            <div className="hero-card hero-card--flow">
              <span className="card-badge">{content.hero.cardBadge}</span>
              <h2>{content.hero.cardTitle}</h2>
              <ul>
                {content.hero.cardItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Video Showcase: prova visual imediata após o Hero ── */}
        <section id="showcase" className="showcase-section">
          <div className="container">
            <VideoShowcase />
          </div>
        </section>

        <Section
          id="dor"
          eyebrow="Dor"
          title={content.problem.title}
          description={content.problem.description}
        >
          <div className="card-grid">
            {content.problem.items.map((item) => (
              <PainCard key={item.title} item={item} />
            ))}
          </div>
        </Section>

        <Section
          id="solucao"
          eyebrow="Solução"
          title={content.solution.title}
          description={content.solution.description}
          className="section-alt"
        >
          <div className="solution-grid">
            {content.solution.items.map((item) => (
              <article key={item.title} className="solution-card">
                <span className="feature-dot" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="como-funciona"
          eyebrow="Como funciona"
          title={content.howItWorks.title}
          description={content.howItWorks.description}
        >
          <div className="steps-flow">
            {content.howItWorks.steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                isLast={index === content.howItWorks.steps.length - 1}
              />
            ))}
          </div>
        </Section>

        <Section
          id="o-que-fica-pronto"
          eyebrow="O que fica pronto"
          title={content.included.title}
          description={content.included.description}
        >
          <div className="included-panel">
            <ul className="included-list">
              {content.included.items.map((item) => (
                <li key={item} className="included-list-item">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.5}
                    className="included-check"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="para-quem"
          eyebrow="Para quem é"
          title={content.audience.title}
          description={content.audience.description}
        >
          <article className="audience-card audience-card--single">
            <ul className="audience-list audience-list--compact">
              {content.audience.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Section>

        <section id="contato" className="final-cta">
          <div className="container final-cta-shell">
            <div className="final-cta-panel">
              <div className="final-cta-grid">
                <div className="final-cta-copy">
                  <div className="final-cta-copy-head">
                    <span className="eyebrow">{content.finalCta.eyebrow}</span>
                    <h2>{content.finalCta.title}</h2>
                    <p>{content.finalCta.text}</p>
                  </div>

                  <div className="final-cta-actions">
                    <Button href={primaryCtaHref}>{content.finalCta.button}</Button>
                  </div>

                  <div className="contact-note">
                    <span>{content.form.directWhatsappText}</span>{' '}
                    <a href={whatsappLink} target="_blank" rel="noreferrer">
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>

                <div id="lead-form" className="lead-form-shell">
                  <div className="lead-form-intro">
                    <h3>{content.form.title}</h3>
                    <p>{content.form.description}</p>
                  </div>
                  <LeadForm content={content.form} whatsappLink={whatsappLink} />
                  <p className="lead-form-microcopy">{content.form.microcopy}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        brand={content.brand}
        text={content.footer.text}
        contactLabel={content.footer.contactLabel}
        whatsappDisplay={whatsappDisplay}
        whatsappLink={whatsappLink}
        signature={content.authority.signature}
      />

      <FloatingActions whatsappNumber={content.whatsappNumber} />
    </div>
  )
}

export default App
