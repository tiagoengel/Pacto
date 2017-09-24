const { assert } = require('chai')
const async = require('../lib/async')
const { resolved, rejected } = require('./utils')
const Pacto = require('../lib')

describe('async', () => {
  it('returns a new promise that resolves correctly', () => {
    return async(function* () {
      const first = yield resolved(1, 300)
      const second = yield resolved(2, 1)
      return first + second
    }).then(sum => assert.equal(sum, 3))
  })
})