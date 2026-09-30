export const MARE_CORAL_TENANT_SLUG = 'mare-coral'

export function assertMareCoralTenant(slug: string) {
  if (slug.trim() !== MARE_CORAL_TENANT_SLUG) {
    throw new Error('Este site aceita exclusivamente o tenant mare-coral.')
  }
}
