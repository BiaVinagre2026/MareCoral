import assert from 'node:assert/strict'
import test from 'node:test'
import { brazilStates, requiredText, validEmail, validPhone, validPostalCode, validState } from '../src/services/checkoutValidation.ts'

test('campos obrigatórios não aceitam apenas espaços', () => {
  assert.equal(requiredText('  '), false)
  assert.equal(requiredText('  S/N '), true)
})
test('e-mail precisa de estrutura válida', () => {
  for (const value of ['', 'teste', 'teste@', 'teste@dominio', 'teste @example.com']) assert.equal(validEmail(value), false)
  assert.equal(validEmail(' teste+mare@example.com '), true)
})
test('telefone aceita DDD e código do Brasil, não texto ou número incompleto', () => {
  for (const value of ['', '2199999', 'abc21999999999', '219999999999999']) assert.equal(validPhone(value), false)
  for (const value of ['(21) 99999-9999', '21 3333-3333', '+55 (21) 99999-9999']) assert.equal(validPhone(value), true)
})
test('CEP aceita oito dígitos, com ou sem hífen', () => {
  assert.equal(validPostalCode('24340-140'), true)
  assert.equal(validPostalCode('24340140'), true)
  for (const value of ['', '24340', '243401400', 'abc24340140']) assert.equal(validPostalCode(value), false)
})
test('estado precisa ser uma das 27 UFs brasileiras', () => {
  assert.equal(brazilStates.length, 27)
  assert.equal(validState('RJ'), true)
  assert.equal(validState(' sp '), true)
  assert.equal(validState('XX'), false)
  assert.equal(validState(''), false)
})
