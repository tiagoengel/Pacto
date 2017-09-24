const Pacto = require('./Pacto')
const asThenable = require('./asThenable')

/**
 * Allow for sync like code using generators, very similar to async/await
 *
 * @example
 *
 *   async(function* () {
 *     const bar = yield Pacto.resolve(1)
 *     const foo = yield Pacto.resolve(bar + 1)
 *
 *     return { ...obj, foo: foo, bar: bar }
*    }).then(e => console.log('done', e))
 */
module.exports = function async(generator) {
  // TODO: handle rejection
  return new Pacto((resolve, reject) => {
    const gen = generator()
    const nextOrDone = (last, next) => {
      if (last.done) {
        resolve(next)
        return
      } else {
        return gen.next(next)
      }
    }
    const handler = (maybeP) => {
      const then = asThenable(maybeP.value)
      if (then) {
        then.call(maybeP.value, ((v) => handler(nextOrDone(maybeP, v))))
      } else {
        handler(nextOrDone(maybeP, maybeP.value))
      }
    }
    handler(gen.next())
  })
}