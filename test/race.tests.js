const { assert } = require('chai')
const race = require('../lib/race')
const { resolved, rejected } = require('./utils')

describe('race', () => {
  it('resolves with the first resolved promise', () => {
    return race([
      resolved(1, 300),
      resolved(2, 200),
      resolved(3, 100)
    ]).then(result => {
      assert.deepEqual(result, 3)
    })
  })

  it('fails with the first error', () => {
    return race([
      resolved(1, 300),
      rejected(2, 200),
      resolved(3, 100),
      rejected(4, 100)
    ]).catch(err => {
      assert.deepEqual(err, 4)
    })
  })

  context('empty array is provided', () => {
    it('resolves an empty array', () => {
      return race([]).then(result => assert.deepEqual(result, []))
    })
  })

  context('no args are provided', () => {
    it('resolves an empty array', () => {
      return race().then(result => assert.deepEqual(result, []))
    })
  })
})