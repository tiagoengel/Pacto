const { assert } = require('chai')
const reduce = require('../lib/reduce')
const { resolved, rejected } = require('./utils')
const Pacto = require('../lib')

describe('reduce', () => {
  it('resolves all promises and return the reduced value', () => {
    return reduce(
      [
        resolved(1, 300),
        resolved(2),
        resolved(3, 200)
      ],
      (prev, curr) => curr + prev,
      0
    ).then(result => {
      assert.deepEqual(result, 6)
    })
  })

  it('fails with the first error', () => {
    return reduce(
      [
        resolved(1, 300),
        resolved(2),
        rejected(1, 100),
        rejected(2)
      ],
      (prev, curr) => curr + prev,
      0
    ).catch(err => {
      assert.equal(err, 2)
    })
  })

  it('should work with non promise values', () => {
    return reduce(
      [
        resolved(1, 300),
        2,
        3
      ],
      (prev, curr) => curr + prev,
      2
    ).then(result => {
      assert.deepEqual(result, 8)
    })
  })

  context('empty array is provided', () => {
    it('resolves an empty array', () => {
      return reduce([], (p, c) => p + c, 0).then(result => assert.deepEqual(result, []))
    })
  })

  context('no args are provided', () => {
    it('resolves an empty array', () => {
      return reduce().then(result => assert.deepEqual(result, []))
    })
  })
})