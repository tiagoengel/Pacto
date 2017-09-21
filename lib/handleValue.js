const asThenable = require('./asThenable')
const functionGroup = require('./functionGroup')

module.exports = function handleValue(promise, resolve, reject, value) {
  try {
    const thenable = asThenable(value)

    if (promise === value) {
      reject(new TypeError('a promise callback is returning the same promise object'))
    } else if (thenable) {
      const [doResolve, doReject] = functionGroup(
        (v) => handleValue(thenable, resolve, reject, v),
        (e) => reject(e)
      )
      try {
        thenable.call(value, doResolve, doReject)
      } catch (e) {
        doReject(e)
      }
    } else {
      resolve(value)
    }
  } catch (e) {
    reject(e)
  }
}