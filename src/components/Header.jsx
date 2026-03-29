import Button from './Button'

export default function Header({ brand, nav, ctaHref, ctaLabel }) {
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
          <Button href={ctaHref}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}
