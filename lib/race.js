const Pacto = require('./pacto')

module.exports = function race(promises) {
  if (!promises || promises.length === 0) {
    return Pacto.resolve([])
  }

  return new Pacto((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve).catch(reject)
    })
  })
}