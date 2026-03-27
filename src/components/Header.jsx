import Button from './Button'

export default function Header({ brand, nav, whatsappLink }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          {brand}
        </a>

        <nav className="nav" aria-label="Navegação principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <Button href={whatsappLink} variant="secondary">
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </header>
  )
}
