const PENDING = 'pending'
const DONE = 'done'
const FAILED = 'failed'

let async = (cb) => setTimeout(cb, 0)

function isFn(maybeFn) {
  return maybeFn && typeof maybeFn === 'function'
}

function isObj(maybeObj) {
  return maybeObj && typeof maybeObj === 'object'
}

function asThenable(value) {
  const then = value != null ? value.then : null
  if (isObj(value) && isFn(then)) {
    return then
  }
  return null
}

function functionGroup(...fns) {
  let callCount = 0;
  const withCallCountCheck = fn => val => {
    if (++callCount === 1) {
      fn(val)
    }
  }
  return fns.map(withCallCountCheck)
}

function handleValue(promise, resolve, reject, value) {
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

const realize = (promise, state) => value => {
  if (promise.state === PENDING) {
    promise.state = state
    promise.result = value
    promise._maybeFireCallbacks()
  }
}

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
      async(() => {
        let nextCb;
        while ((nextCb = this.listeners.shift()) != null) {
          nextCb(this.result)
        }
      })
    }
  }
}

Pacto.async = function(asyncImplementation) {
  async = asyncImplementation
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

module.exports = Pacto

