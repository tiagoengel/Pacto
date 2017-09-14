const promiseAPlusSuite = require('promises-aplus-tests')
const Pacto = require('../lib')

describe('Promise/A+ compat', () => {
  promiseAPlusSuite.mocha(Pacto)
})