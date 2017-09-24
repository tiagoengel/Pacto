const Pacto = require('./pacto')
const all = require('./all')
const groupResolver = require('./groupResolver')

module.exports = function reduce(promises, reducer, initialValue) {
  if (!promises || promises.length === 0) {
    return Pacto.resolve([])
  }

  // TODO: try not to iterate the array twice
  return all(promises).then(v => v.reduce(reducer, initialValue))
}