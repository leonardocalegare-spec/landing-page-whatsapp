import Header from './components/Header'
import Section from './components/Section'
import Button from './components/Button'
import LeadForm from './components/LeadForm'
import Footer from './components/Footer'
import { content } from './data/content'

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
        nav={content.nav}
        ctaHref={primaryCtaHref}
        ctaLabel={content.primaryCta}
      />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1>{content.hero.title}</h1>
              <p>{content.hero.subtitle}</p>

              <div className="hero-actions">
                <Button href={primaryCtaHref}>{content.primaryCta}</Button>
              </div>

              <p className="hero-support">{content.hero.support}</p>

              <div className="hero-highlights">
                {content.hero.highlights.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-card">
              <span className="card-badge">{content.hero.cardBadge}</span>
              <h3>{content.hero.cardTitle}</h3>
              <ul>
                {content.hero.cardItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="hero-card-footer">
                <span>Captação</span>
                <span>WhatsApp</span>
                <span>Organização</span>
              </div>
            </div>
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
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
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
          <div className="steps-grid">
            {content.howItWorks.steps.map((step) => (
              <article key={step.number} className="step-card">
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="beneficios"
          eyebrow="Benefícios"
          title={content.benefits.title}
          description={content.benefits.description}
          className="section-alt"
        >
          <div className="benefits-grid">
            {content.benefits.items.map((item) => (
              <article key={item.title} className="benefit-card">
                <span className="benefit-check">✓</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="para-quem"
          eyebrow="Para quem é"
          title={content.audience.title}
          description={content.audience.description}
        >
          <div className="audience-grid">
            <article className="audience-card">
              <h3>{content.audience.profileTitle}</h3>
              <ul className="audience-list">
                {content.audience.profileItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="audience-card">
              <h3>{content.audience.nichesTitle}</h3>
              <div className="audience-pills">
                {content.audience.niches.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </Section>

        <Section
          id="autoridade"
          eyebrow="Autoridade"
          title={content.authority.title}
          className="section-alt"
        >
          <div className="authority-card">
            <p>{content.authority.text}</p>
            <div className="credibility-points">
              {content.authority.highlights.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <section id="contato" className="final-cta">
          <div className="container final-cta-shell">
            <div className="final-cta-box">
              <div>
                <span className="eyebrow">{content.finalCta.eyebrow}</span>
                <h2>{content.finalCta.title}</h2>
                <p>{content.finalCta.text}</p>
              </div>
              <div className="final-cta-actions">
                <Button href={primaryCtaHref}>{content.primaryCta}</Button>
                <p className="final-cta-note">{content.finalCta.note}</p>
              </div>
            </div>

            <div className="contact-grid">
              <div className="contact-copy">
                <h3>{content.form.sideTitle}</h3>
                <p>{content.form.sideText}</p>
                <div className="contact-points">
                  {content.form.sidePoints.map((item) => (
                    <span key={item} className="pill">
                      {item}
                    </span>
                  ))}
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
                <LeadForm content={content.form} />
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
      />
    </div>
  )
}

export default App
