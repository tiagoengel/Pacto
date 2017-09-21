const { assert } = require('chai')
const promisify = require('../lib/promisify')

function oldStyle(err, success, cb) {
  setTimeout(() => cb(err, success))
}

describe('promisify', () => {
  it('returns new function', () => {
    assert.isFunction(promisify(oldStyle))
  })

  it('resolves when successful', () => {
    const promisified = promisify(oldStyle)
    return promisified(null, 1).then(result => {
      assert.equal(result, 1)
    })
  })

  it('rejects when failed', () => {
    const promisified = promisify(oldStyle)
    return promisified(2, 1).catch(err => {
      assert.equal(err, 2)
    })
  })

  it('rejects when failed with sync error', () => {
    function fn(cb) {
      throw 1
    }
    const promisified = promisify(fn)
    return promisified().catch(err => {
      assert.equal(err, 1)
    })
  })

  it('binds the right context', () => {
    const ctx = {}
    function fn(cb) {
      this.called = true
      setTimeout(cb, 0)
    }
    const promisified = promisify(fn).bind(ctx)
    return promisified().then(() => {
      assert.isTrue(ctx.called)
    })
  })
})