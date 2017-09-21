const Pacto = require('./pacto')

module.exports = function all(promises) {
  if (!promises || promises.length === 0) {
    return Pacto.resolve([])
  }

  return new Pacto((resolve, reject) => {
    const tryResolve = (() => {
      let resolved = 0
      const result = new Array(promises.length)

      return (data, idx) => {
        resolved += 1
        result[idx] = data
        if (resolved === promises.length) {
          resolve(result)
        }
      }
    })()

    promises.forEach((p, idx) => {
      Pacto.resolve(p)
        .then(data => tryResolve(data, idx))
        .catch(reject)
    })
  })
  // const [first, ...rest] = promises
  // return rest.reduce((chain, promise) => {
  //   return chain.then((last) => {
  //     return promise.then((next) => {
  //       return [...last, next]
  //     })
  //   })
  // }, first.then(result => [result]))
}