const { assert } = require('chai')
const all = require('../lib/all')
const { resolved, rejected } = require('./utils')
const Pacto = require('../lib')

describe('all', () => {
  it('resolves all promises and return an array with the results', () => {
    return all([
      resolved(1, 300),
      resolved(2),
      resolved(3, 200)
    ]).then(result => {
      assert.deepEqual(result, [1, 2, 3])
    })
  })

  it('fails with the first error', () => {
    return all([
      resolved(1, 300),
      resolved(2),
      rejected(1, 100),
      rejected(2)
    ]).catch(err => {
      assert.equal(err, 2)
    })
  })

  it('should work with non promise values', () => {
    return all([
      resolved(1, 300),
      2,
      3
    ]).then(result => {
      assert.deepEqual(result, [1, 2, 3])
    })
  })

  context('empty array is provided', () => {
    it('resolves an empty array', () => {
      return all([]).then(result => assert.deepEqual(result, []))
    })
  })

  context('no args are provided', () => {
    it('resolves an empty array', () => {
      return all().then(result => assert.deepEqual(result, []))
    })
  })
})