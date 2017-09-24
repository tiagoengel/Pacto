const { assert } = require('chai')
const map = require('../lib/map')
const { resolved, rejected } = require('./utils')
const Pacto = require('../lib')

describe('map', () => {
  it('resolves all promises and return an array with the mapped results', () => {
    return map(
      [
        resolved(1, 300),
        resolved(2),
        resolved(3, 200)
      ],
      v => v + 1
    ).then(result => {
      assert.deepEqual(result, [2, 3, 4])
    })
  })

  it('fails with the first error', () => {
    return map(
      [
        resolved(1, 300),
        resolved(2),
        rejected(1, 100),
        rejected(2)
      ],
      v => v + 1
    ).catch(err => {
      assert.equal(err, 2)
    })
  })

  it('should work with non promise values', () => {
    return map(
      [
        resolved(1, 300),
        2,
        3
      ],
      v => v + 2
    ).then(result => {
      assert.deepEqual(result, [3, 4, 5])
    })
  })

  context('empty array is provided', () => {
    it('resolves an empty array', () => {
      return map([], v => v + 1).then(result => assert.deepEqual(result, []))
    })
  })

  context('no args are provided', () => {
    it('resolves an empty array', () => {
      return map().then(result => assert.deepEqual(result, []))
    })
  })
})