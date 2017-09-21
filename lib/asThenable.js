const isObj = require('./isObj')
const isFn = require('./isFn')
/**
 *
 */
module.exports = function asThenable(value) {
  const then = value != null ? value.then : null
  if (isObj(value) && isFn(then)) {
    return then
  }
  return null
}