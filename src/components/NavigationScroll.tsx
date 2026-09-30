import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function NavigationScroll() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    let section = ''
    try { section = decodeURIComponent(hash.slice(1)) } catch { /* Fragmento inválido: abrir no topo. */ }
    const target = section ? document.getElementById(section) : null
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
