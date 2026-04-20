import { useEffect, useRef, useState } from 'react'
import Button from './Button'

export default function Header({ brand, brandTagline, nav, ctaHref, ctaLabel }) {
  const [brandLead, ...brandRest] = brand.split(' ')
  const brandAccent = brandRest.join(' ')
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const handleResize = () => {
      if (window.innerWidth > 980 && menuOpen) setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Scroll-aware header: ativa backdrop e borda ao rolar
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const onScroll = () => {
      el.dataset.scrolled = window.scrollY > 10 ? 'true' : 'false'
    }
    onScroll() // estado inicial
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-route" />
          </span>
          <span className="brand-copy">
            <span className="brand-name">
              <span className="brand-name-lead">{brandLead}</span>
              {brandAccent ? <span className="brand-name-accent">{brandAccent}</span> : null}
            </span>
            <span className="brand-tagline">{brandTagline}</span>
          </span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="menu-label">Menu</span>
        </button>

        <nav className="nav" aria-label="Navegação principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      </div>

      <div id="mobile-menu" className={`nav-drawer${menuOpen ? ' nav-drawer--open' : ''}`}>
        <div className="nav-drawer-inner">
          <div className="nav-drawer-head">
            <span className="nav-drawer-title">{brand}</span>
            <button type="button" className="menu-close" onClick={() => setMenuOpen(false)}>
              Fechar
            </button>
          </div>

          <nav className="nav-mobile" aria-label="Navegação principal (mobile)">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-mobile-cta">
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
