type BrandMarkProps = {
  compact?: boolean
  inverted?: boolean
}

function BrandMark({ compact = false, inverted = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${inverted ? 'brand-mark--inverted' : ''}`}>
      <img
        className={compact ? 'brand-mark__symbol' : 'brand-mark__logo'}
        src={compact
          ? inverted ? '/brand/logo-escolhida/simbolo-claro.svg' : '/brand/logo-escolhida/simbolo-degrade.svg'
          : '/brand/logo-escolhida/logo-horizontal.svg'}
        alt={compact ? '' : 'Maré Coral Fitwear'}
        aria-hidden={compact}
      />
    </span>
  )
}

export default BrandMark
