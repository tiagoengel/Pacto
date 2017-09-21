const config = require('./config')
const functionGroup = require('./functionGroup')
const isObj = require('./isObj')
const isFn = require('./isFn')
const asThenable = require('./asThenable')
const handleValue = require('./handleValue')

const PENDING = 'pending'
const DONE = 'done'
const FAILED = 'failed'

const realize = (promise, state) => value => {
  if (promise.state === PENDING) {
    promise.state = state
    promise.result = value
    promise._maybeFireCallbacks()
  }
}

/**
 * Full featured Promise/A+ implementation designed to help testing.
 *
 * Although Pacto is fully compatible with the promise/A+ spec and
 * can be used as the primary promise lib that is not its main goal.
 *
 * Pacto was designed with one thing in main (or one pain in mind if you will) - TESTING.
 * Testing code that depends on promises can be a real pain, let's say you want
 * to test the following interaction.
 *
 *   - user clicks on login
 *   - waits for submit response // here is problem
 *   - checks an error was added to the page saying login or password is wrong
 *
 * How can you effectively wait for the request to finish before asserting everything
 * is working?
 *
 * Well, one solution is to mock the submit request and make you test aware of that
 * // TODO
 * @example
 *    const
 *    sinon.stub(MyApi, 'login', Promise.reject({ code: 401 }))
 *
 *
 * That works for simple cases, the main problem with this approach is that more often
 * that not your code depends on a lot more that just that, take this code as an example
 *
 * @example
 *
 *    fetch first time - then load with Promise.resolve..
 *
 * In the case above you'd want a way to somehow wait for all promises and only after
 * that execute the assertions. Pacto is your friend :)
 *
 * Pacto provides two main functions that can be used during tests
 * - `waitAllPromises()` which returns a new promise that resolves only after all
 *    promises are done
 * - `runAllPromises()` which will block the code execution and only move to the next
 *    line after all promise are done. Yes, it means you can test promises synchronously if you want!
 *
 *
 */
class Pacto {
  constructor(promiseCallback) {
    this.state = PENDING
    this.result = null
    this.listeners = []

    const doResolve = realize(this, DONE)
    const doReject = realize(this, FAILED)

    const [resolve, reject] = functionGroup(
      (value) => handleValue(this, doResolve, doReject, value),
      (value) => doReject(value)
    )

    promiseCallback(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    return this._chainNewPromise(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this._chainNewPromise(null, onRejected)
  }

  _chainNewPromise(onFulfilled, onRejected) {
    const promise = new Pacto((resolve, reject) => {
      const perState = {
        [DONE]: [onFulfilled, resolve],
        [FAILED]: [onRejected, reject]
      }

      this._onFinished((result) => {
        const [next, finish] = perState[this.state]
        if (!isFn(next)) {
          return finish(this.result)
        }
        try {
          resolve(next(result))
        } catch (e) {
          reject(e)
        }
      })
      this._maybeFireCallbacks()
    });

    return promise
  }

  _onFinished(callback) {
    this.listeners.push(callback)
  }

  // Hide it from outside access
  _maybeFireCallbacks() {
    if (this.state !== PENDING) {
      config.async(() => {
        let nextCb;
        while ((nextCb = this.listeners.shift()) != null) {
          nextCb(this.result)
        }
      })
    }
  }
}

Pacto.resolve = function resolve(val) {
  return new Pacto((resolve) => resolve(val))
}

Pacto.reject = function reject(val) {
  return new Pacto((resolve, reject) => reject(val))
}

Pacto.deferred = function deferred() {
  let resolve;
  let reject;
  const promise = new Pacto((doResolve, doReject) => {
    resolve = doResolve
    reject = doReject
  })

  return { promise, resolve, reject }
}

/**
 * Define a new value in pacto's configuration.
 *
 * Supported configurations are:
 *  - async: The async function used to resolve promises.
 *           Default: process.nextTick on node or setTimeout otherwise
 *
 * @example
 *   Pacto.configure('async', (cb) => cb()) // you should probably not do that
 *
 * @param {String} key the configuration key
 * @param {String} value the configuration value
 */
Pacto.configure = function configure(key, value) {
  config[prop] = value
}

module.exports = Pacto


// Pacto.on('created', (p) => {
//   queue.push(q);
// })

// beforeEach(() => installPacto())
// afterEach(() => releasePacto())

// import { waitAllPromises, runAllPromises } from 'pacto/test-helpers'

// waitAllPromises().then(() => {

// })

// runAllPromises()
// code here is guaranteed to run only after all promises are finished




