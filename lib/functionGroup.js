/**
 * Create a function group that only allows one function to be executed.
 * The function that is executed is always the first one to be called, all
 * other calls to functions that are part of this group are ignored.
 *
 * @example
 *
 *   const [a, b, c] = functionGroup(
 *     () => console.log('a'),
 *     () => console.log('b'),
 *     () => console.log('c')
 *   )
 *
 *   b() // => 'b'
 *   a() // => undefined
 *   c() // => undefined
 *   b() // => undefined
 *
 * @param {...Function} fns list of function that are part of the group
 * @return {Array} an array with the function group
 */
module.exports = function functionGroup(...fns) {
  let callCount = 0;
  const withCallCountCheck = fn => val => {
    if (++callCount === 1) {
      fn(val)
    }
  }
  return fns.map(withCallCountCheck)
}