import test from 'node:test'
import assert from 'node:assert/strict'
import { verdictText } from './verdict.js'

test('verdict labels are unambiguous', () => {
  assert.equal(verdictText(true), 'Correct')
  assert.equal(verdictText(false), 'Incorrect')
  assert.equal(verdictText(false, { got: 1, of: 2 }), 'Incorrect · 1 of 2 right')
  assert.equal(verdictText(true, null, '$3 billion'), 'Correct · $3 billion')
  assert.equal(verdictText(true, { got: 2, of: 2 }), 'Correct')
  for (const text of [verdictText(true), verdictText(false), verdictText(false, { got: 0, of: 3 })]) {
    assert.ok(!/Worth another look|Not quite/i.test(text))
  }
})
