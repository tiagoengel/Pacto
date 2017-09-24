const Pacto = require('./pacto')
const groupResolver = require('./groupResolver')

module.exports = function map(promises, mapper) {
  if (!promises || promises.length === 0) {
    return Pacto.resolve([])
  }

  return new Pacto((doResolve, reject) => {
    const resolve = groupResolver(promises, doResolve)

    promises.forEach((p, idx) => {
      Pacto.resolve(p)
        .then(data => resolve(mapper(data), idx))
        .catch(reject)
    })
  })
}