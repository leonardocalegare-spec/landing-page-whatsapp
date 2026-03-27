export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}) {
  const className = `btn btn-${variant}`

  if (href) {
    const isExternal = href.startsWith('http')

    return (
      <a
        className={className}
        href={href}
        onClick={onClick}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={className} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  )
}
