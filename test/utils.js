const Pacto = require('../lib')

module.exports = {
  resolved: (result, delay = 0) => new Pacto((resolve) => {
    setTimeout(() => resolve(result), delay)
  }),

  rejected: (error, delay = 0) => new Pacto((resolve, reject) => {
    setTimeout(() => reject(error), delay)
  })
}