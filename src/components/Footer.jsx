export default function Footer({ brand, text, contactLabel, whatsappDisplay, whatsappLink }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>{brand}</strong>
          <p>{text}</p>
        </div>

        <div>
          <strong>{contactLabel}</strong>
          <p>
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              {whatsappDisplay}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
