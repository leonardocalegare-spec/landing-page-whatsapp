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

  return (
    <div id="top">
      <Header brand={content.brand} nav={content.nav} whatsappLink={whatsappLink} />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1>{content.hero.title}</h1>
              <p>{content.hero.subtitle}</p>

              <div className="hero-actions">
                <Button href="#contato">{content.hero.primaryCta}</Button>
                <Button href={whatsappLink} variant="secondary">
                  {content.hero.secondaryCta}
                </Button>
              </div>

              <div className="hero-highlights">
                {content.hero.highlights.map((item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-card">
              <span className="card-badge">Setup comercial inicial</span>
              <h3>{content.hero.cardTitle}</h3>
              <ul>
                {content.hero.cardItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="hero-card-footer">
                <span>Mais clareza</span>
                <span>Mais contexto</span>
                <span>Mais consistência</span>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="dores"
          eyebrow="Problema"
          title={content.painPoints.title}
          description={content.painPoints.description}
        >
          <div className="card-grid">
            {content.painPoints.items.map((item) => (
              <article key={item} className="info-card">
                <h3>{item}</h3>
                <p>Esse ponto reduz velocidade, previsibilidade e aproveitamento dos contatos.</p>
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
          <div className="feature-list">
            {content.solution.items.map((item) => (
              <div key={item} className="feature-item">
                <span className="feature-dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="como-funciona" eyebrow="Processo" title={content.howItWorks.title}>
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
          eyebrow="Resultado"
          title={content.benefits.title}
          className="section-alt"
        >
          <div className="benefits-grid">
            {content.benefits.items.map((item) => (
              <article key={item} className="benefit-card">
                <span className="benefit-check">✓</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="credibilidade" eyebrow="Aplicação prática" title={content.credibility.title}>
          <div className="credibility-box">
            <p>{content.credibility.text}</p>
            <div className="credibility-points">
              {content.credibility.highlights.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="contato"
          eyebrow="Captação"
          title={content.form.title}
          description={content.form.description}
          className="section-alt"
        >
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
              <div className="contact-actions">
                <Button href={whatsappLink} variant="secondary">
                  Falar no WhatsApp
                </Button>
              </div>
            </div>

            <LeadForm content={content.form} />
          </div>
        </Section>

        <section className="final-cta">
          <div className="container final-cta-box">
            <div>
              <span className="eyebrow">Próximo passo</span>
              <h2>{content.finalCta.title}</h2>
              <p>{content.finalCta.text}</p>
            </div>
            <div className="final-cta-actions">
              <Button href={whatsappLink}>{content.finalCta.button}</Button>
              <div className="signature-card">
                <span className="signature-eyebrow">{content.signature.eyebrow}</span>
                <strong>{content.signature.name}</strong>
                <p>{content.signature.role}</p>
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
