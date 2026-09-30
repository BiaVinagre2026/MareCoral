import assert from 'node:assert/strict'
import test from 'node:test'
import { assertMareCoralTenant, MARE_CORAL_TENANT_SLUG } from '../src/services/tenantIsolation.ts'

test('a loja aceita exclusivamente o tenant da Maré Coral', () => {
  assert.equal(MARE_CORAL_TENANT_SLUG, 'mare-coral')
  assert.doesNotThrow(() => assertMareCoralTenant('mare-coral'))
})

test('a loja rejeita qualquer outro tenant e valor vazio', () => {
  for (const slug of ['', 'demo', 'outro-cliente']) {
    assert.throws(() => assertMareCoralTenant(slug), /exclusivamente o tenant mare-coral/)
  }
})
