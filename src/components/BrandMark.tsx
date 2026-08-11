type BrandMarkProps = {
  compact?: boolean
  inverted?: boolean
}

function BrandMark({ compact = false, inverted = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${inverted ? 'brand-mark--inverted' : ''}`}>
      <svg
        aria-hidden="true"
        className="brand-mark__icon"
        viewBox="0 0 64 64"
      >
        <defs>
          <linearGradient id="brand-coral" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FD5D2A" />
            <stop offset="1" stopColor="#FD3774" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="23" fill="none" stroke="url(#brand-coral)" strokeWidth="6" />
        <path d="M11 34c8-8 16-8 24 0 7 7 13 7 19 2" fill="none" stroke="#18B7A6" strokeLinecap="round" strokeWidth="5" />
        <path d="M15 25c10 7 22 7 32 0 4-3 7-4 10-4" fill="none" stroke="url(#brand-coral)" strokeLinecap="round" strokeWidth="5" />
      </svg>
      {!compact && (
        <span className="brand-mark__text">
          <strong>Maré Coral</strong>
          <small>fitwear</small>
        </span>
      )}
    </span>
  )
}

export default BrandMark
