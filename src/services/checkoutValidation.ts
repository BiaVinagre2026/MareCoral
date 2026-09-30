export const brazilStates = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const

export function requiredText(value: string) {
  return Boolean(value?.trim())
}

export function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validPhone(value: string) {
  if (!/^[\d\s()+-]+$/.test(value)) return false
  const digits = value.replace(/\D/g, '')
  return /^\d{10,11}$/.test(digits) || /^55\d{10,11}$/.test(digits)
}

export function validPostalCode(value: string) {
  return /^\d{5}-?\d{3}$/.test(value.trim())
}

export function validState(value: string) {
  return (brazilStates as readonly string[]).includes(value.trim().toUpperCase())
}
