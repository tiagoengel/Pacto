module.exports = function isFn(maybeFn) {
  return maybeFn && typeof maybeFn === 'function'
}
