export default function FloatingActions({ whatsappNumber }) {
  return (
    <div className="floating-actions" aria-label="Ações rápidas">
      <a
        className="floating-btn floating-btn--whatsapp"
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="floating-icon">
          <path
            fill="currentColor"
            d="M16 2.67C8.64 2.67 2.67 8.62 2.67 16c0 2.5.66 4.94 1.91 7.1L2 30l7.14-2.52A13.26 13.26 0 0 0 16 29.33C23.36 29.33 29.33 23.38 29.33 16S23.36 2.67 16 2.67Zm0 23.48c-2.23 0-4.42-.6-6.33-1.74l-.45-.27-4.24 1.5 1.47-4.1-.29-.43A10.5 10.5 0 0 1 5.5 16c0-5.79 4.71-10.5 10.5-10.5S26.5 10.21 26.5 16 21.79 26.15 16 26.15Zm5.78-7.69c-.32-.16-1.91-.94-2.2-1.05-.3-.12-.52-.16-.73.16-.22.32-.84 1.05-1.02 1.27-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.83-1.57-1.85-1.76-2.17-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.55-.19 0-.4-.03-.61-.03-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.64 0 1.56 1.13 3.07 1.29 3.28.16.21 2.24 3.42 5.42 4.8.76.33 1.36.53 1.82.68.76.24 1.46.21 2 .13.61-.1 1.91-.78 2.18-1.53.27-.74.27-1.37.19-1.5-.08-.13-.29-.21-.61-.37Z"
          />
        </svg>
      </a>
      <a
        className="floating-btn floating-btn--linkedin"
        href="https://www.linkedin.com/in/leocalegare/"
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir LinkedIn de Leonardo Calegare"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="floating-icon">
          <path
            fill="currentColor"
            d="M26.67 2.67H5.33A2.67 2.67 0 0 0 2.67 5.3v21.4a2.67 2.67 0 0 0 2.66 2.63h21.34a2.67 2.67 0 0 0 2.66-2.63V5.3a2.67 2.67 0 0 0-2.66-2.63ZM11.2 24.8H7.73V12.93h3.47Zm-1.73-13.6a2 2 0 1 1 0-3.94 2 2 0 0 1 0 3.94Zm15.06 13.6h-3.46V18.2c0-1.57-.56-2.63-1.98-2.63-1.08 0-1.72.73-2 1.43-.1.24-.12.58-.12.92v6.88H13.5s.05-11.17 0-12.32h3.46v1.74a3.45 3.45 0 0 1 3.11-1.71c2.27 0 4 1.5 4 4.71Z"
          />
        </svg>
      </a>
    </div>
  )
}
