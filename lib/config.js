const package = require('../package.json')

const CONFIG = {
  async: process && process.nextTick ? process.nextTick : setTimeout
}

Object.defineProperty(CONFIG, 'version', {
  get() {
    return package.version
  }
})

module.exports = CONFIG