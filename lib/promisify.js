const Pacto = require('./pacto')

function whenDone(resolve, reject) {
  return (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  }
}

module.exports = function promisify(fn) {
  return function promisified(...args) {
    return new Pacto((resolve, reject) => {
      try {
        fn.apply(this, [...args, whenDone(resolve, reject)])
      } catch (e) {
        reject(e)
      }
    })
  }
}

