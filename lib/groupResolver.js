/**
 * Resolve a group of promises only after all promises have been resolved.
 * The results array is guaranteed to keep the same order as the input promises
 * array
 *
 * @example
 *
 *   resolver = groupResolver(promises, resolve)
 *   promise.forEach(p => {
 *      p.then((data, idx) => resolver(data, idx))
 *   })
 *
 * @param {Array} group group of promises
 * @param {Function} doResolve the function called when all promises have resolved
 * @return {Function} function to be called each time a promise in the group resolves
 */
module.exports = function groupResolver(group, doResolve) {
  let resolved = 0
  const result = new Array(group.length)

  return (data, idx) => {
    resolved += 1
    result[idx] = data
    if (resolved === group.length) {
      doResolve(result)
    }
  }
}