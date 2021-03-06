import url from 'url';
import http from 'http';
import https from 'https';
import querystring from 'querystring';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/*
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

var DEFAULT_ENDPOINT = 'https://api.mapbox.com';

var constants = {
	DEFAULT_ENDPOINT: DEFAULT_ENDPOINT
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var es6Promise = createCommonjsModule(function (module, exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.6+9869a4bc
 */

(function (global, factory) {
  (_typeof(exports)) === 'object' && 'object' !== 'undefined' ? module.exports = factory() : global.ES6Promise = factory();
})(commonjsGlobal, function () {

  function objectOrFunction(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return x !== null && (type === 'object' || type === 'function');
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = void 0;
  if (Array.isArray) {
    _isArray = Array.isArray;
  } else {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = void 0;
  var customSchedulerFn = void 0;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var vertx = Function('return this')().require('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = void 0;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      var callback = arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve$1(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(2);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var TRY_CATCH_ERROR = { error: null };

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      TRY_CATCH_ERROR.error = error;
      return TRY_CATCH_ERROR;
    }
  }

  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
    try {
      then$$1.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then$$1) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then$$1, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$1) {
    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$1 === TRY_CATCH_ERROR) {
        reject(promise, TRY_CATCH_ERROR.error);
        TRY_CATCH_ERROR.error = null;
      } else if (then$$1 === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$1)) {
        handleForeignThenable(promise, maybeThenable, then$$1);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = void 0,
        callback = void 0,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = void 0,
        error = void 0,
        succeeded = void 0,
        failed = void 0;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  var Enumerator = function () {
    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate(input);
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        reject(this.promise, validationError());
      }
    }

    Enumerator.prototype._enumerate = function _enumerate(input) {
      for (var i = 0; this._state === PENDING && i < input.length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
      var c = this._instanceConstructor;
      var resolve$$1 = c.resolve;

      if (resolve$$1 === resolve$1) {
        var _then = getThen(entry);

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise$1) {
          var promise = new c(noop);
          handleMaybeThenable(promise, entry, _then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$1) {
            return resolve$$1(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$1(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
      var promise = this.promise;

      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    return Enumerator;
  }();

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject$1(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {Function} resolver
    Useful for tooling.
    @constructor
  */

  var Promise$1 = function () {
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
     ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
     Chaining
    --------
     The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
     ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
     findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
     ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
     Assimilation
    ------------
     Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
     If the assimliated promise rejects, then the downstream promise will also reject.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
     Simple Example
    --------------
     Synchronous Example
     ```javascript
    let result;
     try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
     Advanced Example
    --------------
     Synchronous Example
     ```javascript
    let author, books;
     try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
     function foundBooks(books) {
     }
     function failure(reason) {
     }
     findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
     @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
    */

    /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
    ```js
    function findAuthor(){
    throw new Error('couldn't find that author');
    }
    // synchronous
    try {
    findAuthor();
    } catch(reason) {
    // something went wrong
    }
    // async with promises
    findAuthor().catch(function(reason){
    // something went wrong
    });
    ```
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
    */

    Promise.prototype.catch = function _catch(onRejection) {
      return this.then(null, onRejection);
    };

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves
    
      Synchronous example:
    
      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }
    
      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```
    
      Asynchronous example:
    
      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```
    
      @method finally
      @param {Function} callback
      @return {Promise}
    */

    Promise.prototype.finally = function _finally(callback) {
      var promise = this;
      var constructor = promise.constructor;

      if (isFunction(callback)) {
        return promise.then(function (value) {
          return constructor.resolve(callback()).then(function () {
            return value;
          });
        }, function (reason) {
          return constructor.resolve(callback()).then(function () {
            throw reason;
          });
        });
      }

      return promise.then(callback, callback);
    };

    return Promise;
  }();

  Promise$1.prototype.then = then;
  Promise$1.all = all;
  Promise$1.race = race;
  Promise$1.resolve = resolve$1;
  Promise$1.reject = reject$1;
  Promise$1._setScheduler = setScheduler;
  Promise$1._setAsap = setAsap;
  Promise$1._asap = asap;

  /*global self*/
  function polyfill() {
    var local = void 0;

    if (typeof commonjsGlobal !== 'undefined') {
      local = commonjsGlobal;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise$1;
  }

  // Strange compat..
  Promise$1.polyfill = polyfill;
  Promise$1.Promise = Promise$1;

  return Promise$1;
});


});

var promise = createCommonjsModule(function (module) {

// Installs ES6 Promise polyfill if a native Promise is not available

if (typeof Promise === 'undefined') {
  es6Promise.polyfill();
}

module.export = Promise;
});

/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

/**
 * Add common helper methods to a client impl
 *
 * @param {function} impl the client implementation
 * @param {Client} [target] target of this client, used when wrapping other clients
 * @returns {Client} the client impl with additional methods
 */

var client = function client(impl, target) {

	if (target) {

		/**
   * @returns {Client} the target client
   */
		impl.skip = function skip() {
			return target;
		};
	}

	/**
  * Allow a client to easily be wrapped by an interceptor
  *
  * @param {Interceptor} interceptor the interceptor to wrap this client with
  * @param [config] configuration for the interceptor
  * @returns {Client} the newly wrapped client
  */
	impl.wrap = function wrap(interceptor, config) {
		return interceptor(impl, config);
	};

	/**
  * @deprecated
  */
	impl.chain = function chain() {
		if (typeof console !== 'undefined') {
			console.log('rest.js: client.chain() is deprecated, use client.wrap() instead');
		}

		return impl.wrap.apply(this, arguments);
	};

	return impl;
};

/**
 * Plain JS Object containing properties that represent an HTTP request.
 *
 * Depending on the capabilities of the underlying client, a request
 * may be cancelable. If a request may be canceled, the client will add
 * a canceled flag and cancel function to the request object. Canceling
 * the request will put the response into an error state.
 *
 * @field {string} [method='GET'] HTTP method, commonly GET, POST, PUT, DELETE or HEAD
 * @field {string|UrlBuilder} [path=''] path template with optional path variables
 * @field {Object} [params] parameters for the path template and query string
 * @field {Object} [headers] custom HTTP headers to send, in addition to the clients default headers
 * @field [entity] the HTTP entity, common for POST or PUT requests
 * @field {boolean} [canceled] true if the request has been canceled, set by the client
 * @field {Function} [cancel] cancels the request if invoked, provided by the client
 * @field {Client} [originator] the client that first handled this request, provided by the interceptor
 *
 * @class Request
 */

/**
 * Plain JS Object containing properties that represent an HTTP response
 *
 * @field {Object} [request] the request object as received by the root client
 * @field {Object} [raw] the underlying request object, like XmlHttpRequest in a browser
 * @field {number} [status.code] status code of the response (i.e. 200, 404)
 * @field {string} [status.text] status phrase of the response
 * @field {Object] [headers] response headers hash of normalized name, value pairs
 * @field [entity] the response body
 *
 * @class Response
 */

/**
 * HTTP client particularly suited for RESTful operations.
 *
 * @field {function} wrap wraps this client with a new interceptor returning the wrapped client
 *
 * @param {Request} the HTTP request
 * @returns {ResponsePromise<Response>} a promise the resolves to the HTTP response
 *
 * @class Client
 */

/**
 * Extended when.js Promises/A+ promise with HTTP specific helpers
 *q
 * @method entity promise for the HTTP entity
 * @method status promise for the HTTP status code
 * @method headers promise for the HTTP response headers
 * @method header promise for a specific HTTP response header
 *
 * @class ResponsePromise
 * @extends Promise
 */

var client$1, target, platformDefault;

client$1 = client;

if (typeof Promise !== 'function' && console && console.log) {
  console.log('An ES6 Promise implementation is required to use rest.js. See https://github.com/cujojs/when/blob/master/docs/es6-promise-shim.md for using when.js as a Promise polyfill.');
}

/**
 * Make a request with the default client
 * @param {Request} the HTTP request
 * @returns {Promise<Response>} a promise the resolves to the HTTP response
 */
function defaultClient() {
  return target.apply(void 0, arguments);
}

/**
 * Change the default client
 * @param {Client} client the new default client
 */
defaultClient.setDefaultClient = function setDefaultClient(client$$1) {
  target = client$$1;
};

/**
 * Obtain a direct reference to the current default client
 * @returns {Client} the default client
 */
defaultClient.getDefaultClient = function getDefaultClient() {
  return target;
};

/**
 * Reset the default client to the platform default
 */
defaultClient.resetDefaultClient = function resetDefaultClient() {
  target = platformDefault;
};

/**
 * @private
 */
defaultClient.setPlatformDefaultClient = function setPlatformDefaultClient(client$$1) {
  if (platformDefault) {
    throw new Error('Unable to redefine platformDefaultClient');
  }
  target = platformDefault = client$$1;
};

var _default = client$1(defaultClient);

/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var empty = {};

/**
 * Mix the properties from the source object into the destination object.
 * When the same property occurs in more then one object, the right most
 * value wins.
 *
 * @param {Object} dest the object to copy properties to
 * @param {Object} sources the objects to copy properties from.  May be 1 to N arguments, but not an Array.
 * @return {Object} the destination object
 */
function mixin(dest /*, sources... */) {
  var i, l, source, name;

  if (!dest) {
    dest = {};
  }
  for (i = 1, l = arguments.length; i < l; i += 1) {
    source = arguments[i];
    for (name in source) {
      if (!(name in dest) || dest[name] !== source[name] && (!(name in empty) || empty[name] !== source[name])) {
        dest[name] = source[name];
      }
    }
  }

  return dest; // Object
}

var mixin_1 = mixin;

/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

/**
 * Normalize HTTP header names using the pseudo camel case.
 *
 * For example:
 *   content-type         -> Content-Type
 *   accepts              -> Accepts
 *   x-custom-header-name -> X-Custom-Header-Name
 *
 * @param {string} name the raw header name
 * @return {string} the normalized header name
 */

function normalizeHeaderName(name) {
  return name.toLowerCase().split('-').map(function (chunk) {
    return chunk.charAt(0).toUpperCase() + chunk.slice(1);
  }).join('-');
}

var normalizeHeaderName_1 = normalizeHeaderName;

/*jshint latedef: nofunc */



function property(promise, name) {
  return promise.then(function (value) {
    return value && value[name];
  }, function (value) {
    return Promise.reject(value && value[name]);
  });
}

/**
 * Obtain the response entity
 *
 * @returns {Promise} for the response entity
 */
function entity() {
  /*jshint validthis:true */
  return property(this, 'entity');
}

/**
 * Obtain the response status
 *
 * @returns {Promise} for the response status
 */
function status() {
  /*jshint validthis:true */
  return property(property(this, 'status'), 'code');
}

/**
 * Obtain the response headers map
 *
 * @returns {Promise} for the response headers map
 */
function headers() {
  /*jshint validthis:true */
  return property(this, 'headers');
}

/**
 * Obtain a specific response header
 *
 * @param {String} headerName the header to retrieve
 * @returns {Promise} for the response header's value
 */
function header(headerName) {
  /*jshint validthis:true */
  headerName = normalizeHeaderName_1(headerName);
  return property(this.headers(), headerName);
}

/**
 * Follow a related resource
 *
 * The relationship to follow may be define as a plain string, an object
 * with the rel and params, or an array containing one or more entries
 * with the previous forms.
 *
 * Examples:
 *   response.follow('next')
 *
 *   response.follow({ rel: 'next', params: { pageSize: 100 } })
 *
 *   response.follow([
 *       { rel: 'items', params: { projection: 'noImages' } },
 *       'search',
 *       { rel: 'findByGalleryIsNull', params: { projection: 'noImages' } },
 *       'items'
 *   ])
 *
 * @param {String|Object|Array} rels one, or more, relationships to follow
 * @returns ResponsePromise<Response> related resource
 */
function follow(rels) {
  /*jshint validthis:true */
  rels = [].concat(rels);

  return make(rels.reduce(function (response, rel) {
    return response.then(function (response) {
      if (typeof rel === 'string') {
        rel = { rel: rel };
      }
      if (typeof response.entity.clientFor !== 'function') {
        throw new Error('Hypermedia response expected');
      }
      var client = response.entity.clientFor(rel.rel);
      return client({ params: rel.params });
    });
  }, this));
}

/**
 * Wrap a Promise as an ResponsePromise
 *
 * @param {Promise<Response>} promise the promise for an HTTP Response
 * @returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
 */
function make(promise) {
  promise.status = status;
  promise.headers = headers;
  promise.header = header;
  promise.entity = entity;
  promise.follow = follow;
  return promise;
}

function responsePromise(obj, callback, errback) {
  return make(Promise.resolve(obj).then(callback, errback));
}

responsePromise.make = make;
responsePromise.reject = function (val) {
  return make(Promise.reject(val));
};
responsePromise.promise = function (func) {
  return make(new Promise(func));
};

var responsePromise_1 = responsePromise;

var parser, http$1, https$1, mixin$1, normalizeHeaderName$1, responsePromise$1, client$2, httpsExp;

parser = url;
http$1 = http;
https$1 = https;
mixin$1 = mixin_1;
normalizeHeaderName$1 = normalizeHeaderName_1;
responsePromise$1 = responsePromise_1;
client$2 = client;

httpsExp = /^https/i;

// TODO remove once Node 0.6 is no longer supported
Buffer.concat = Buffer.concat || function (list, length) {
	/*jshint plusplus:false, shadow:true */
	// from https://github.com/joyent/node/blob/v0.8.21/lib/buffer.js
	if (!Array.isArray(list)) {
		throw new Error('Usage: Buffer.concat(list, [length])');
	}

	if (list.length === 0) {
		return new Buffer(0);
	} else if (list.length === 1) {
		return list[0];
	}

	if (typeof length !== 'number') {
		length = 0;
		for (var i = 0; i < list.length; i++) {
			var buf = list[i];
			length += buf.length;
		}
	}

	var buffer = new Buffer(length);
	var pos = 0;
	for (var i = 0; i < list.length; i++) {
		var buf = list[i];
		buf.copy(buffer, pos);
		pos += buf.length;
	}
	return buffer;
};

var node = client$2(function node(request) {
	/*jshint maxcomplexity:20 */
	return responsePromise$1.promise(function (resolve, reject) {

		var options, clientRequest, client$$1, url$$1, headers, entity, response;

		request = typeof request === 'string' ? { path: request } : request || {};
		response = { request: request };

		if (request.canceled) {
			response.error = 'precanceled';
			reject(response);
			return;
		}

		url$$1 = response.url = request.path || '';
		client$$1 = url$$1.match(httpsExp) ? https$1 : http$1;

		options = mixin$1({}, request.mixin, parser.parse(url$$1));

		entity = request.entity;
		request.method = request.method || (entity ? 'POST' : 'GET');
		options.method = request.method;
		headers = options.headers = {};
		Object.keys(request.headers || {}).forEach(function (name) {
			headers[normalizeHeaderName$1(name)] = request.headers[name];
		});
		if (!headers['Content-Length']) {
			headers['Content-Length'] = entity ? Buffer.byteLength(entity, 'utf8') : 0;
		}

		request.canceled = false;
		request.cancel = function cancel() {
			request.canceled = true;
			clientRequest.abort();
		};

		clientRequest = client$$1.request(options, function (clientResponse) {
			// Array of Buffers to collect response chunks
			var buffers = [];

			response.raw = {
				request: clientRequest,
				response: clientResponse
			};
			response.status = {
				code: clientResponse.statusCode
				// node doesn't provide access to the status text
			};
			response.headers = {};
			Object.keys(clientResponse.headers).forEach(function (name) {
				response.headers[normalizeHeaderName$1(name)] = clientResponse.headers[name];
			});

			clientResponse.on('data', function (data) {
				// Collect the next Buffer chunk
				buffers.push(data);
			});

			clientResponse.on('end', function () {
				// Create the final response entity
				response.entity = buffers.length > 0 ? Buffer.concat(buffers).toString() : '';
				buffers = null;

				resolve(response);
			});
		});

		clientRequest.on('error', function (e) {
			response.error = e;
			reject(response);
		});

		if (entity) {
			clientRequest.write(entity);
		}
		clientRequest.end();
	});
});

_default.setPlatformDefaultClient(node);

var node_1 = _default;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var defaultClient$1, mixin$2, responsePromise$2, client$3;

defaultClient$1 = _default;
mixin$2 = mixin_1;
responsePromise$2 = responsePromise_1;
client$3 = client;

/**
 * Interceptors have the ability to intercept the request and/org response
 * objects.  They may augment, prune, transform or replace the
 * request/response as needed.  Clients may be composed by wrapping
 * together multiple interceptors.
 *
 * Configured interceptors are functional in nature.  Wrapping a client in
 * an interceptor will not affect the client, merely the data that flows in
 * and out of that client.  A common configuration can be created once and
 * shared; specialization can be created by further wrapping that client
 * with custom interceptors.
 *
 * @param {Client} [target] client to wrap
 * @param {Object} [config] configuration for the interceptor, properties will be specific to the interceptor implementation
 * @returns {Client} A client wrapped with the interceptor
 *
 * @class Interceptor
 */

function defaultInitHandler(config) {
	return config;
}

function defaultRequestHandler(request /*, config, meta */) {
	return request;
}

function defaultResponseHandler(response /*, config, meta */) {
	return response;
}

/**
 * Alternate return type for the request handler that allows for more complex interactions.
 *
 * @param properties.request the traditional request return object
 * @param {Promise} [properties.abort] promise that resolves if/when the request is aborted
 * @param {Client} [properties.client] override the defined client with an alternate client
 * @param [properties.response] response for the request, short circuit the request
 */
function ComplexRequest(properties) {
	if (!(this instanceof ComplexRequest)) {
		// in case users forget the 'new' don't mix into the interceptor
		return new ComplexRequest(properties);
	}
	mixin$2(this, properties);
}

/**
 * Create a new interceptor for the provided handlers.
 *
 * @param {Function} [handlers.init] one time intialization, must return the config object
 * @param {Function} [handlers.request] request handler
 * @param {Function} [handlers.response] response handler regardless of error state
 * @param {Function} [handlers.success] response handler when the request is not in error
 * @param {Function} [handlers.error] response handler when the request is in error, may be used to 'unreject' an error state
 * @param {Function} [handlers.client] the client to use if otherwise not specified, defaults to platform default client
 *
 * @returns {Interceptor}
 */
function interceptor(handlers) {

	var initHandler, requestHandler, successResponseHandler, errorResponseHandler;

	handlers = handlers || {};

	initHandler = handlers.init || defaultInitHandler;
	requestHandler = handlers.request || defaultRequestHandler;
	successResponseHandler = handlers.success || handlers.response || defaultResponseHandler;
	errorResponseHandler = handlers.error || function () {
		// Propagate the rejection, with the result of the handler
		return Promise.resolve((handlers.response || defaultResponseHandler).apply(this, arguments)).then(Promise.reject.bind(Promise));
	};

	return function (target, config) {

		if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
			config = target;
		}
		if (typeof target !== 'function') {
			target = handlers.client || defaultClient$1;
		}

		config = initHandler(config || {});

		function interceptedClient(request) {
			var context, meta;
			context = {};
			meta = { 'arguments': Array.prototype.slice.call(arguments), client: interceptedClient };
			request = typeof request === 'string' ? { path: request } : request || {};
			request.originator = request.originator || interceptedClient;
			return responsePromise$2(requestHandler.call(context, request, config, meta), function (request) {
				var response, abort, next;
				next = target;
				if (request instanceof ComplexRequest) {
					// unpack request
					abort = request.abort;
					next = request.client || next;
					response = request.response;
					// normalize request, must be last
					request = request.request;
				}
				response = response || Promise.resolve(request).then(function (request) {
					return Promise.resolve(next(request)).then(function (response) {
						return successResponseHandler.call(context, response, config, meta);
					}, function (response) {
						return errorResponseHandler.call(context, response, config, meta);
					});
				});
				return abort ? Promise.race([response, abort]) : response;
			}, function (error) {
				return Promise.reject({ request: request, error: error });
			});
		}

		return client$3(interceptedClient, target);
	};
}

interceptor.ComplexRequest = ComplexRequest;

var interceptor_1 = interceptor;

var interceptor$1;

interceptor$1 = interceptor_1;

/**
 * Rejects the response promise based on the status code.
 *
 * Codes greater than or equal to the provided value are rejected.  Default
 * value 400.
 *
 * @param {Client} [client] client to wrap
 * @param {number} [config.code=400] code to indicate a rejection
 *
 * @returns {Client}
 */
var errorCode = interceptor$1({
  init: function init(config) {
    config.code = config.code || 400;
    return config;
  },
  response: function response(_response, config) {
    if (_response.status && _response.status.code >= config.code) {
      return Promise.reject(_response);
    }
    return _response;
  }
});

/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var encodedSpaceRE, urlEncodedSpaceRE;

encodedSpaceRE = /%20/g;
urlEncodedSpaceRE = /\+/g;

function urlEncode(str) {
	str = encodeURIComponent(str);
	// spec says space should be encoded as '+'
	return str.replace(encodedSpaceRE, '+');
}

function urlDecode(str) {
	// spec says space should be encoded as '+'
	str = str.replace(urlEncodedSpaceRE, ' ');
	return decodeURIComponent(str);
}

function append(str, name, value) {
	if (Array.isArray(value)) {
		value.forEach(function (value) {
			str = append(str, name, value);
		});
	} else {
		if (str.length > 0) {
			str += '&';
		}
		str += urlEncode(name);
		if (value !== undefined && value !== null) {
			str += '=' + urlEncode(value);
		}
	}
	return str;
}

var xWwwFormUrlencoded = {

	read: function read(str) {
		var obj = {};
		str.split('&').forEach(function (entry) {
			var pair, name, value;
			pair = entry.split('=');
			name = urlDecode(pair[0]);
			if (pair.length === 2) {
				value = urlDecode(pair[1]);
			} else {
				value = null;
			}
			if (name in obj) {
				if (!Array.isArray(obj[name])) {
					// convert to an array, perserving currnent value
					obj[name] = [obj[name]];
				}
				obj[name].push(value);
			} else {
				obj[name] = value;
			}
		});
		return obj;
	},

	write: function write(obj) {
		var str = '';
		Object.keys(obj).forEach(function (name) {
			str = append(str, name, obj[name]);
		});
		return str;
	}

};

var mixin$3, xWWWFormURLEncoder, origin, urlRE, absoluteUrlRE, fullyQualifiedUrlRE;

mixin$3 = mixin_1;
xWWWFormURLEncoder = xWwwFormUrlencoded;

urlRE = /([a-z][a-z0-9\+\-\.]*:)\/\/([^@]+@)?(([^:\/]+)(:([0-9]+))?)?(\/[^?#]*)?(\?[^#]*)?(#\S*)?/i;
absoluteUrlRE = /^([a-z][a-z0-9\-\+\.]*:\/\/|\/)/i;
fullyQualifiedUrlRE = /([a-z][a-z0-9\+\-\.]*:)\/\/([^@]+@)?(([^:\/]+)(:([0-9]+))?)?\//i;

/**
 * Apply params to the template to create a URL.
 *
 * Parameters that are not applied directly to the template, are appended
 * to the URL as query string parameters.
 *
 * @param {string} template the URI template
 * @param {Object} params parameters to apply to the template
 * @return {string} the resulting URL
 */
function buildUrl(template, params) {
	// internal builder to convert template with params.
	var url$$1, name, queryStringParams, queryString, re;

	url$$1 = template;
	queryStringParams = {};

	if (params) {
		for (name in params) {
			/*jshint forin:false */
			re = new RegExp('\\{' + name + '\\}');
			if (re.test(url$$1)) {
				url$$1 = url$$1.replace(re, encodeURIComponent(params[name]), 'g');
			} else {
				queryStringParams[name] = params[name];
			}
		}

		queryString = xWWWFormURLEncoder.write(queryStringParams);
		if (queryString) {
			url$$1 += url$$1.indexOf('?') === -1 ? '?' : '&';
			url$$1 += queryString;
		}
	}
	return url$$1;
}

function startsWith(str, test) {
	return str.indexOf(test) === 0;
}

/**
 * Create a new URL Builder
 *
 * @param {string|UrlBuilder} template the base template to build from, may be another UrlBuilder
 * @param {Object} [params] base parameters
 * @constructor
 */
function UrlBuilder(template, params) {
	if (!(this instanceof UrlBuilder)) {
		// invoke as a constructor
		return new UrlBuilder(template, params);
	}

	if (template instanceof UrlBuilder) {
		this._template = template.template;
		this._params = mixin$3({}, this._params, params);
	} else {
		this._template = (template || '').toString();
		this._params = params || {};
	}
}

UrlBuilder.prototype = {

	/**
  * Create a new UrlBuilder instance that extends the current builder.
  * The current builder is unmodified.
  *
  * @param {string} [template] URL template to append to the current template
  * @param {Object} [params] params to combine with current params.  New params override existing params
  * @return {UrlBuilder} the new builder
  */
	append: function append(template, params) {
		// TODO consider query strings and fragments
		return new UrlBuilder(this._template + template, mixin$3({}, this._params, params));
	},

	/**
  * Create a new UrlBuilder with a fully qualified URL based on the
  * window's location or base href and the current templates relative URL.
  *
  * Path variables are preserved.
  *
  * *Browser only*
  *
  * @return {UrlBuilder} the fully qualified URL template
  */
	fullyQualify: function fullyQualify() {
		if (typeof location === 'undefined') {
			return this;
		}
		if (this.isFullyQualified()) {
			return this;
		}

		var template = this._template;

		if (startsWith(template, '//')) {
			template = origin.protocol + template;
		} else if (startsWith(template, '/')) {
			template = origin.origin + template;
		} else if (!this.isAbsolute()) {
			template = origin.origin + origin.pathname.substring(0, origin.pathname.lastIndexOf('/') + 1);
		}

		if (template.indexOf('/', 8) === -1) {
			// default the pathname to '/'
			template = template + '/';
		}

		return new UrlBuilder(template, this._params);
	},

	/**
  * True if the URL is absolute
  *
  * @return {boolean}
  */
	isAbsolute: function isAbsolute() {
		return absoluteUrlRE.test(this.build());
	},

	/**
  * True if the URL is fully qualified
  *
  * @return {boolean}
  */
	isFullyQualified: function isFullyQualified() {
		return fullyQualifiedUrlRE.test(this.build());
	},

	/**
  * True if the URL is cross origin. The protocol, host and port must not be
  * the same in order to be cross origin,
  *
  * @return {boolean}
  */
	isCrossOrigin: function isCrossOrigin() {
		if (!origin) {
			return true;
		}
		var url$$1 = this.parts();
		return url$$1.protocol !== origin.protocol || url$$1.hostname !== origin.hostname || url$$1.port !== origin.port;
	},

	/**
  * Split a URL into its consituent parts following the naming convention of
  * 'window.location'. One difference is that the port will contain the
  * protocol default if not specified.
  *
  * @see https://developer.mozilla.org/en-US/docs/DOM/window.location
  *
  * @returns {Object} a 'window.location'-like object
  */
	parts: function parts() {
		/*jshint maxcomplexity:20 */
		var url$$1, parts;
		url$$1 = this.fullyQualify().build().match(urlRE);
		parts = {
			href: url$$1[0],
			protocol: url$$1[1],
			host: url$$1[3] || '',
			hostname: url$$1[4] || '',
			port: url$$1[6],
			pathname: url$$1[7] || '',
			search: url$$1[8] || '',
			hash: url$$1[9] || ''
		};
		parts.origin = parts.protocol + '//' + parts.host;
		parts.port = parts.port || (parts.protocol === 'https:' ? '443' : parts.protocol === 'http:' ? '80' : '');
		return parts;
	},

	/**
  * Expand the template replacing path variables with parameters
  *
  * @param {Object} [params] params to combine with current params.  New params override existing params
  * @return {string} the expanded URL
  */
	build: function build(params) {
		return buildUrl(this._template, mixin$3({}, this._params, params));
	},

	/**
  * @see build
  */
	toString: function toString() {
		return this.build();
	}

};

origin = typeof location !== 'undefined' ? new UrlBuilder(location.href).parts() : void 0;

var UrlBuilder_1 = UrlBuilder;

var interceptor$2, UrlBuilder$1;

interceptor$2 = interceptor_1;
UrlBuilder$1 = UrlBuilder_1;

function startsWith$1(str, prefix) {
	return str.indexOf(prefix) === 0;
}

function endsWith(str, suffix) {
	return str.lastIndexOf(suffix) + suffix.length === str.length;
}

/**
 * Prefixes the request path with a common value.
 *
 * @param {Client} [client] client to wrap
 * @param {number} [config.prefix] path prefix
 *
 * @returns {Client}
 */
var pathPrefix = interceptor$2({
	request: function request(_request, config) {
		var path;

		if (config.prefix && !new UrlBuilder$1(_request.path).isFullyQualified()) {
			path = config.prefix;
			if (_request.path) {
				if (!endsWith(path, '/') && !startsWith$1(_request.path, '/')) {
					// add missing '/' between path sections
					path += '/';
				}
				path += _request.path;
			}
			_request.path = path;
		}

		return _request;
	}
});

/*
* Copyright 2014-2016 the original author or authors
* @license MIT, see LICENSE.txt for details
*
* @author Scott Andrews
*/

/**
 * Parse a MIME type into it's constituent parts
 *
 * @param {string} mime MIME type to parse
 * @return {{
 *   {string} raw the original MIME type
 *   {string} type the type and subtype
 *   {string} [suffix] mime suffix, including the plus, if any
 *   {Object} params key/value pair of attributes
 * }}
 */

function parse(mime) {
	var params, type;

	params = mime.split(';');
	type = params[0].trim().split('+');

	return {
		raw: mime,
		type: type[0],
		suffix: type[1] ? '+' + type[1] : '',
		params: params.slice(1).reduce(function (params, pair) {
			pair = pair.split('=');
			params[pair[0].trim()] = pair[1] ? pair[1].trim() : void 0;
			return params;
		}, {})
	};
}

var mime = {
	parse: parse
};

/*
 * Copyright 2015-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var charMap;

charMap = function () {
	var strings = {
		alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		digit: '0123456789'
	};

	strings.genDelims = ':/?#[]@';
	strings.subDelims = '!$&\'()*+,;=';
	strings.reserved = strings.genDelims + strings.subDelims;
	strings.unreserved = strings.alpha + strings.digit + '-._~';
	strings.url = strings.reserved + strings.unreserved;
	strings.scheme = strings.alpha + strings.digit + '+-.';
	strings.userinfo = strings.unreserved + strings.subDelims + ':';
	strings.host = strings.unreserved + strings.subDelims;
	strings.port = strings.digit;
	strings.pchar = strings.unreserved + strings.subDelims + ':@';
	strings.segment = strings.pchar;
	strings.path = strings.segment + '/';
	strings.query = strings.pchar + '/?';
	strings.fragment = strings.pchar + '/?';

	return Object.keys(strings).reduce(function (charMap, set) {
		charMap[set] = strings[set].split('').reduce(function (chars, myChar) {
			chars[myChar] = true;
			return chars;
		}, {});
		return charMap;
	}, {});
}();

function encode(str, allowed) {
	if (typeof str !== 'string') {
		throw new Error('String required for URL encoding');
	}
	return str.split('').map(function (myChar) {
		if (allowed.hasOwnProperty(myChar)) {
			return myChar;
		}
		var code = myChar.charCodeAt(0);
		if (code <= 127) {
			var encoded = code.toString(16).toUpperCase();
			return '%' + (encoded.length % 2 === 1 ? '0' : '') + encoded;
		} else {
			return encodeURIComponent(myChar).toUpperCase();
		}
	}).join('');
}

function makeEncoder(allowed) {
	allowed = allowed || charMap.unreserved;
	return function (str) {
		return encode(str, allowed);
	};
}

function decode(str) {
	return decodeURIComponent(str);
}

var uriEncoder = {

	/*
  * Decode URL encoded strings
  *
  * @param {string} URL encoded string
  * @returns {string} URL decoded string
  */
	decode: decode,

	/*
  * URL encode a string
  *
  * All but alpha-numerics and a very limited set of punctuation - . _ ~ are
  * encoded.
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encode: makeEncoder(),

	/*
 * URL encode a URL
 *
 * All character permitted anywhere in a URL are left unencoded even
 * if that character is not permitted in that portion of a URL.
 *
 * Note: This method is typically not what you want.
 *
 * @param {string} string to encode
 * @returns {string} URL encoded string
 */
	encodeURL: makeEncoder(charMap.url),

	/*
  * URL encode the scheme portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodeScheme: makeEncoder(charMap.scheme),

	/*
  * URL encode the user info portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodeUserInfo: makeEncoder(charMap.userinfo),

	/*
  * URL encode the host portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodeHost: makeEncoder(charMap.host),

	/*
  * URL encode the port portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodePort: makeEncoder(charMap.port),

	/*
  * URL encode a path segment portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodePathSegment: makeEncoder(charMap.segment),

	/*
  * URL encode the path portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodePath: makeEncoder(charMap.path),

	/*
  * URL encode the query portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodeQuery: makeEncoder(charMap.query),

	/*
  * URL encode the fragment portion of a URL
  *
  * @param {string} string to encode
  * @returns {string} URL encoded string
  */
	encodeFragment: makeEncoder(charMap.fragment)

};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var uriEncoder$1, operations, prefixRE;

uriEncoder$1 = uriEncoder;

prefixRE = /^([^:]*):([0-9]+)$/;
operations = {
	'': { first: '', separator: ',', named: false, empty: '', encoder: uriEncoder$1.encode },
	'+': { first: '', separator: ',', named: false, empty: '', encoder: uriEncoder$1.encodeURL },
	'#': { first: '#', separator: ',', named: false, empty: '', encoder: uriEncoder$1.encodeURL },
	'.': { first: '.', separator: '.', named: false, empty: '', encoder: uriEncoder$1.encode },
	'/': { first: '/', separator: '/', named: false, empty: '', encoder: uriEncoder$1.encode },
	';': { first: ';', separator: ';', named: true, empty: '', encoder: uriEncoder$1.encode },
	'?': { first: '?', separator: '&', named: true, empty: '=', encoder: uriEncoder$1.encode },
	'&': { first: '&', separator: '&', named: true, empty: '=', encoder: uriEncoder$1.encode },
	'=': { reserved: true },
	',': { reserved: true },
	'!': { reserved: true },
	'@': { reserved: true },
	'|': { reserved: true }
};

function apply(operation, expression, params) {
	/*jshint maxcomplexity:11 */
	return expression.split(',').reduce(function (result, variable) {
		var opts, value;

		opts = {};
		if (variable.slice(-1) === '*') {
			variable = variable.slice(0, -1);
			opts.explode = true;
		}
		if (prefixRE.test(variable)) {
			var prefix = prefixRE.exec(variable);
			variable = prefix[1];
			opts.maxLength = parseInt(prefix[2]);
		}

		variable = uriEncoder$1.decode(variable);
		value = params[variable];

		if (value === void 0 || value === null) {
			return result;
		}
		if (Array.isArray(value)) {
			result = value.reduce(function (result, value) {
				if (result.length) {
					result += opts.explode ? operation.separator : ',';
					if (operation.named && opts.explode) {
						result += operation.encoder(variable);
						result += value.length ? '=' : operation.empty;
					}
				} else {
					result += operation.first;
					if (operation.named) {
						result += operation.encoder(variable);
						result += value.length ? '=' : operation.empty;
					}
				}
				result += operation.encoder(value);
				return result;
			}, result);
		} else if ((typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) === 'object') {
			result = Object.keys(value).reduce(function (result, name) {
				if (result.length) {
					result += opts.explode ? operation.separator : ',';
				} else {
					result += operation.first;
					if (operation.named && !opts.explode) {
						result += operation.encoder(variable);
						result += value[name].length ? '=' : operation.empty;
					}
				}
				result += operation.encoder(name);
				result += opts.explode ? '=' : ',';
				result += operation.encoder(value[name]);
				return result;
			}, result);
		} else {
			value = String(value);
			if (opts.maxLength) {
				value = value.slice(0, opts.maxLength);
			}
			result += result.length ? operation.separator : operation.first;
			if (operation.named) {
				result += operation.encoder(variable);
				result += value.length ? '=' : operation.empty;
			}
			result += operation.encoder(value);
		}

		return result;
	}, '');
}

function expandExpression(expression, params) {
	var operation;

	operation = operations[expression.slice(0, 1)];
	if (operation) {
		expression = expression.slice(1);
	} else {
		operation = operations[''];
	}

	if (operation.reserved) {
		throw new Error('Reserved expression operations are not supported');
	}

	return apply(operation, expression, params);
}

function expandTemplate(template, params) {
	var start, end, uri;

	uri = '';
	end = 0;
	while (true) {
		start = template.indexOf('{', end);
		if (start === -1) {
			// no more expressions
			uri += template.slice(end);
			break;
		}
		uri += template.slice(end, start);
		end = template.indexOf('}', start) + 1;
		uri += expandExpression(template.slice(start + 1, end - 1), params);
	}

	return uri;
}

var uriTemplate = {

	/**
  * Expand a URI Template with parameters to form a URI.
  *
  * Full implementation (level 4) of rfc6570.
  * @see https://tools.ietf.org/html/rfc6570
  *
  * @param {string} template URI template
  * @param {Object} [params] params to apply to the template durring expantion
  * @returns {string} expanded URI
  */
	expand: expandTemplate

};

var interceptor$3, uriTemplate$1, mixin$4;

interceptor$3 = interceptor_1;
uriTemplate$1 = uriTemplate;
mixin$4 = mixin_1;

/**
 * Applies request params to the path as a URI Template
 *
 * Params are removed from the request object, as they have been consumed.
 *
 * @see https://tools.ietf.org/html/rfc6570
 *
 * @param {Client} [client] client to wrap
 * @param {Object} [config.params] default param values
 * @param {string} [config.template] default template
 *
 * @returns {Client}
 */
var template = interceptor$3({
  init: function init(config) {
    config.params = config.params || {};
    config.template = config.template || '';
    return config;
  },
  request: function request(_request, config) {
    var template, params;

    template = _request.path || config.template;
    params = mixin$4({}, _request.params, config.params);

    _request.path = uriTemplate$1.expand(template, params);
    delete _request.params;

    return _request;
  }
});

/*
 * Copyright 2013-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var find = {

	/**
  * Find objects within a graph the contain a property of a certain name.
  *
  * NOTE: this method will not discover object graph cycles.
  *
  * @param {*} obj object to search on
  * @param {string} prop name of the property to search for
  * @param {Function} callback function to receive the found properties and their parent
  */
	findProperties: function findProperties(obj, prop, callback) {
		if ((typeof obj === 'undefined' ? 'undefined' : _typeof$2(obj)) !== 'object' || obj === null) {
			return;
		}
		if (prop in obj) {
			callback(obj[prop], obj, prop);
		}
		Object.keys(obj).forEach(function (key) {
			findProperties(obj[key], prop, callback);
		});
	}

};

/*
 * Copyright 2015-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

/**
 * Attempt to invoke a function capturing the resulting value as a Promise
 *
 * If the method throws, the caught value used to reject the Promise.
 *
 * @param {function} work function to invoke
 * @returns {Promise} Promise for the output of the work function
 */

function attempt(work) {
  try {
    return Promise.resolve(work());
  } catch (e) {
    return Promise.reject(e);
  }
}

var attempt_1 = attempt;

/**
 * Create a promise whose work is started only when a handler is registered.
 *
 * The work function will be invoked at most once. Thrown values will result
 * in promise rejection.
 *
 * @param {Function} work function whose ouput is used to resolve the
 *   returned promise.
 * @returns {Promise} a lazy promise
 */
function lazyPromise(work) {
	var started, resolver, promise, then;

	started = false;

	promise = new Promise(function (resolve, reject) {
		resolver = {
			resolve: resolve,
			reject: reject
		};
	});
	then = promise.then;

	promise.then = function () {
		if (!started) {
			started = true;
			attempt_1(work).then(resolver.resolve, resolver.reject);
		}
		return then.apply(promise, arguments);
	};

	return promise;
}

var lazyPromise_1 = lazyPromise;

var pathPrefix$1, template$1, find$1, lazyPromise$1, responsePromise$3;

pathPrefix$1 = pathPrefix;
template$1 = template;
find$1 = find;
lazyPromise$1 = lazyPromise_1;
responsePromise$3 = responsePromise_1;

function defineProperty(obj, name, value) {
	Object.defineProperty(obj, name, {
		value: value,
		configurable: true,
		enumerable: false,
		writeable: true
	});
}

/**
 * Hypertext Application Language serializer
 *
 * Implemented to https://tools.ietf.org/html/draft-kelly-json-hal-06
 *
 * As the spec is still a draft, this implementation will be updated as the
 * spec evolves
 *
 * Objects are read as HAL indexing links and embedded objects on to the
 * resource. Objects are written as plain JSON.
 *
 * Embedded relationships are indexed onto the resource by the relationship
 * as a promise for the related resource.
 *
 * Links are indexed onto the resource as a lazy promise that will GET the
 * resource when a handler is first registered on the promise.
 *
 * A `requestFor` method is added to the entity to make a request for the
 * relationship.
 *
 * A `clientFor` method is added to the entity to get a full Client for a
 * relationship.
 *
 * The `_links` and `_embedded` properties on the resource are made
 * non-enumerable.
 */
var hal = {

	read: function read(str, opts) {
		var client, console;

		opts = opts || {};
		client = opts.client;
		console = opts.console || console;

		function deprecationWarning(relationship, deprecation) {
			if (deprecation && console && console.warn || console.log) {
				(console.warn || console.log).call(console, 'Relationship \'' + relationship + '\' is deprecated, see ' + deprecation);
			}
		}

		return opts.registry.lookup(opts.mime.suffix).then(function (converter) {
			return converter.read(str, opts);
		}).then(function (root) {
			find$1.findProperties(root, '_embedded', function (embedded, resource, name) {
				Object.keys(embedded).forEach(function (relationship) {
					if (relationship in resource) {
						return;
					}
					var related = responsePromise$3({
						entity: embedded[relationship]
					});
					defineProperty(resource, relationship, related);
				});
				defineProperty(resource, name, embedded);
			});
			find$1.findProperties(root, '_links', function (links, resource, name) {
				Object.keys(links).forEach(function (relationship) {
					var link = links[relationship];
					if (relationship in resource) {
						return;
					}
					defineProperty(resource, relationship, responsePromise$3.make(lazyPromise$1(function () {
						if (link.deprecation) {
							deprecationWarning(relationship, link.deprecation);
						}
						if (link.templated === true) {
							return template$1(client)({ path: link.href });
						}
						return client({ path: link.href });
					})));
				});
				defineProperty(resource, name, links);
				defineProperty(resource, 'clientFor', function (relationship, clientOverride) {
					var link = links[relationship];
					if (!link) {
						throw new Error('Unknown relationship: ' + relationship);
					}
					if (link.deprecation) {
						deprecationWarning(relationship, link.deprecation);
					}
					if (link.templated === true) {
						return template$1(clientOverride || client, { template: link.href });
					}
					return pathPrefix$1(clientOverride || client, { prefix: link.href });
				});
				defineProperty(resource, 'requestFor', function (relationship, request, clientOverride) {
					var client = this.clientFor(relationship, clientOverride);
					return client(request);
				});
			});

			return root;
		});
	},

	write: function write(obj, opts) {
		return opts.registry.lookup(opts.mime.suffix).then(function (converter) {
			return converter.write(obj, opts);
		});
	}

};

/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

/**
 * Create a new JSON converter with custom reviver/replacer.
 *
 * The extended converter must be published to a MIME registry in order
 * to be used. The existing converter will not be modified.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 *
 * @param {function} [reviver=undefined] custom JSON.parse reviver
 * @param {function|Array} [replacer=undefined] custom JSON.stringify replacer
 */

function createConverter(reviver, replacer) {
  return {

    read: function read(str) {
      return JSON.parse(str, reviver);
    },

    write: function write(obj) {
      return JSON.stringify(obj, replacer);
    },

    extend: createConverter

  };
}

var json = createConverter();

/*
 * Copyright 2014-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Michael Jackson
 */

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isFormElement(object) {
	return object && object.nodeType === 1 && // Node.ELEMENT_NODE
	object.tagName === 'FORM';
}

function createFormDataFromObject(object) {
	var formData = new FormData();

	var value;
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			value = object[property];

			if (value instanceof File) {
				formData.append(property, value, value.name);
			} else if (value instanceof Blob) {
				formData.append(property, value);
			} else {
				formData.append(property, String(value));
			}
		}
	}

	return formData;
}

var formData = {

	write: function write(object) {
		if (typeof FormData === 'undefined') {
			throw new Error('The multipart/form-data mime serializer requires FormData support');
		}

		// Support FormData directly.
		if (object instanceof FormData) {
			return object;
		}

		// Support <form> elements.
		if (isFormElement(object)) {
			return new FormData(object);
		}

		// Support plain objects, may contain File/Blob as value.
		if ((typeof object === 'undefined' ? 'undefined' : _typeof$3(object)) === 'object' && object !== null) {
			return createFormDataFromObject(object);
		}

		throw new Error('Unable to create FormData from object ' + object);
	}

};

/*
 * Copyright 2012-2016 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

var plain = {

	read: function read(str) {
		return str;
	},

	write: function write(obj) {
		return obj.toString();
	}

};

var mime$1, registry;

mime$1 = mime;

function Registry(mimes) {

	/**
  * Lookup the converter for a MIME type
  *
  * @param {string} type the MIME type
  * @return a promise for the converter
  */
	this.lookup = function lookup(type) {
		var parsed;

		parsed = typeof type === 'string' ? mime$1.parse(type) : type;

		if (mimes[parsed.raw]) {
			return mimes[parsed.raw];
		}
		if (mimes[parsed.type + parsed.suffix]) {
			return mimes[parsed.type + parsed.suffix];
		}
		if (mimes[parsed.type]) {
			return mimes[parsed.type];
		}
		if (mimes[parsed.suffix]) {
			return mimes[parsed.suffix];
		}

		return Promise.reject(new Error('Unable to locate converter for mime "' + parsed.raw + '"'));
	};

	/**
  * Create a late dispatched proxy to the target converter.
  *
  * Common when a converter is registered under multiple names and
  * should be kept in sync if updated.
  *
  * @param {string} type mime converter to dispatch to
  * @returns converter whose read/write methods target the desired mime converter
  */
	this.delegate = function delegate(type) {
		return {
			read: function () {
				var args = arguments;
				return this.lookup(type).then(function (converter) {
					return converter.read.apply(this, args);
				}.bind(this));
			}.bind(this),
			write: function () {
				var args = arguments;
				return this.lookup(type).then(function (converter) {
					return converter.write.apply(this, args);
				}.bind(this));
			}.bind(this)
		};
	};

	/**
  * Register a custom converter for a MIME type
  *
  * @param {string} type the MIME type
  * @param converter the converter for the MIME type
  * @return a promise for the converter
  */
	this.register = function register(type, converter) {
		mimes[type] = Promise.resolve(converter);
		return mimes[type];
	};

	/**
  * Create a child registry whoes registered converters remain local, while
  * able to lookup converters from its parent.
  *
  * @returns child MIME registry
  */
	this.child = function child() {
		return new Registry(Object.create(mimes));
	};
}

registry = new Registry({});

// include provided serializers
registry.register('application/hal', hal);
registry.register('application/json', json);
registry.register('application/x-www-form-urlencoded', xWwwFormUrlencoded);
registry.register('multipart/form-data', formData);
registry.register('text/plain', plain);

registry.register('+json', registry.delegate('application/json'));

var registry_1 = registry;

var interceptor$4, mime$2, registry$1, noopConverter, missingConverter, attempt$1;

interceptor$4 = interceptor_1;
mime$2 = mime;
registry$1 = registry_1;
attempt$1 = attempt_1;

noopConverter = {
	read: function read(obj) {
		return obj;
	},
	write: function write(obj) {
		return obj;
	}
};

missingConverter = {
	read: function read() {
		throw 'No read method found on converter';
	},
	write: function write() {
		throw 'No write method found on converter';
	}
};

/**
 * MIME type support for request and response entities.  Entities are
 * (de)serialized using the converter for the MIME type.
 *
 * Request entities are converted using the desired converter and the
 * 'Accept' request header prefers this MIME.
 *
 * Response entities are converted based on the Content-Type response header.
 *
 * @param {Client} [client] client to wrap
 * @param {string} [config.mime='text/plain'] MIME type to encode the request
 *   entity
 * @param {string} [config.accept] Accept header for the request
 * @param {Client} [config.client=<request.originator>] client passed to the
 *   converter, defaults to the client originating the request
 * @param {Registry} [config.registry] MIME registry, defaults to the root
 *   registry
 * @param {boolean} [config.permissive] Allow an unkown request MIME type
 *
 * @returns {Client}
 */
var mime_1$1 = interceptor$4({
	init: function init(config) {
		config.registry = config.registry || registry$1;
		return config;
	},
	request: function request(_request, config) {
		var type, headers;

		headers = _request.headers || (_request.headers = {});
		type = mime$2.parse(headers['Content-Type'] || config.mime || 'text/plain');
		headers.Accept = headers.Accept || config.accept || type.raw + ', application/json;q=0.8, text/plain;q=0.5, */*;q=0.2';

		if (!('entity' in _request)) {
			return _request;
		}

		headers['Content-Type'] = type.raw;

		return config.registry.lookup(type)['catch'](function () {
			// failed to resolve converter
			if (config.permissive) {
				return noopConverter;
			}
			throw 'mime-unknown';
		}).then(function (converter) {
			var client = config.client || _request.originator,
			    write = converter.write || missingConverter.write;

			return attempt$1(write.bind(void 0, _request.entity, { client: client, request: _request, mime: type, registry: config.registry }))['catch'](function () {
				throw 'mime-serialization';
			}).then(function (entity) {
				_request.entity = entity;
				return _request;
			});
		});
	},
	response: function response(_response, config) {
		if (!(_response.headers && _response.headers['Content-Type'] && _response.entity)) {
			return _response;
		}

		var type = mime$2.parse(_response.headers['Content-Type']);

		return config.registry.lookup(type)['catch'](function () {
			return noopConverter;
		}).then(function (converter) {
			var client = config.client || _response.request && _response.request.originator,
			    read = converter.read || missingConverter.read;

			return attempt$1(read.bind(void 0, _response.entity, { client: client, response: _response, mime: type, registry: config.registry }))['catch'](function (e) {
				_response.error = 'mime-deserialization';
				_response.cause = e;
				throw _response;
			}).then(function (entity) {
				_response.entity = entity;
				return _response;
			});
		});
	}
});

var interceptor$5, mixinUtil, defaulter;

interceptor$5 = interceptor_1;
mixinUtil = mixin_1;

defaulter = function () {

	function mixin(prop, target, defaults) {
		if (prop in target || prop in defaults) {
			target[prop] = mixinUtil({}, defaults[prop], target[prop]);
		}
	}

	function copy(prop, target, defaults) {
		if (prop in defaults && !(prop in target)) {
			target[prop] = defaults[prop];
		}
	}

	var mappings = {
		method: copy,
		path: copy,
		params: mixin,
		headers: mixin,
		entity: copy,
		mixin: mixin
	};

	return function (target, defaults) {
		for (var prop in mappings) {
			/*jshint forin: false */
			mappings[prop](prop, target, defaults);
		}
		return target;
	};
}();

/**
 * Provide default values for a request. These values will be applied to the
 * request if the request object does not already contain an explicit value.
 *
 * For 'params', 'headers', and 'mixin', individual values are mixed in with the
 * request's values. The result is a new object representiing the combined
 * request and config values. Neither input object is mutated.
 *
 * @param {Client} [client] client to wrap
 * @param {string} [config.method] the default method
 * @param {string} [config.path] the default path
 * @param {Object} [config.params] the default params, mixed with the request's existing params
 * @param {Object} [config.headers] the default headers, mixed with the request's existing headers
 * @param {Object} [config.mixin] the default "mixins" (http/https options), mixed with the request's existing "mixins"
 *
 * @returns {Client}
 */
var defaultRequest = interceptor$5({
	request: function handleRequest(request, config) {
		return defaulter(request, config);
	}
});

var rfc5988 = function () {
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */

  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
    return '"' + s.replace(/\\/g, '\\\\') // backslash
    .replace(/"/g, '\\"') // closing quote character
    .replace(/\x08/g, '\\b') // backspace
    .replace(/\t/g, '\\t') // horizontal tab
    .replace(/\n/g, '\\n') // line feed
    .replace(/\f/g, '\\f') // form feed
    .replace(/\r/g, '\\r') // carriage return
    .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
  }

  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function parse(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "LinkValue": parse_LinkValue,
        "LinkParams": parse_LinkParams,
        "URIReference": parse_URIReference,
        "LinkParam": parse_LinkParam,
        "LinkParamName": parse_LinkParamName,
        "LinkParamValue": parse_LinkParamValue,
        "PToken": parse_PToken,
        "PTokenChar": parse_PTokenChar,
        "OptionalSP": parse_OptionalSP,
        "QuotedString": parse_QuotedString,
        "QuotedStringInternal": parse_QuotedStringInternal,
        "Char": parse_Char,
        "UpAlpha": parse_UpAlpha,
        "LoAlpha": parse_LoAlpha,
        "Alpha": parse_Alpha,
        "Digit": parse_Digit,
        "SP": parse_SP,
        "DQ": parse_DQ,
        "QDText": parse_QDText,
        "QuotedPair": parse_QuotedPair
      };

      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }

      var pos = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];

      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }

        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }

        rightmostFailuresExpected.push(failure);
      }

      function parse_start() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1, pos2, pos3;

        pos0 = pos;
        pos1 = pos;
        result0 = [];
        pos2 = pos;
        pos3 = pos;
        result1 = parse_LinkValue();
        if (result1 !== null) {
          result2 = parse_OptionalSP();
          if (result2 !== null) {
            if (input.charCodeAt(pos) === 44) {
              result3 = ",";
              pos++;
            } else {
              result3 = null;
              {
                matchFailed("\",\"");
              }
            }
            if (result3 !== null) {
              result4 = parse_OptionalSP();
              if (result4 !== null) {
                result1 = [result1, result2, result3, result4];
              } else {
                result1 = null;
                pos = pos3;
              }
            } else {
              result1 = null;
              pos = pos3;
            }
          } else {
            result1 = null;
            pos = pos3;
          }
        } else {
          result1 = null;
          pos = pos3;
        }
        if (result1 !== null) {
          result1 = function (offset, i) {
            return i;
          }(pos2, result1[0]);
        }
        if (result1 === null) {
          pos = pos2;
        }
        while (result1 !== null) {
          result0.push(result1);
          pos2 = pos;
          pos3 = pos;
          result1 = parse_LinkValue();
          if (result1 !== null) {
            result2 = parse_OptionalSP();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 44) {
                result3 = ",";
                pos++;
              } else {
                result3 = null;
                {
                  matchFailed("\",\"");
                }
              }
              if (result3 !== null) {
                result4 = parse_OptionalSP();
                if (result4 !== null) {
                  result1 = [result1, result2, result3, result4];
                } else {
                  result1 = null;
                  pos = pos3;
                }
              } else {
                result1 = null;
                pos = pos3;
              }
            } else {
              result1 = null;
              pos = pos3;
            }
          } else {
            result1 = null;
            pos = pos3;
          }
          if (result1 !== null) {
            result1 = function (offset, i) {
              return i;
            }(pos2, result1[0]);
          }
          if (result1 === null) {
            pos = pos2;
          }
        }
        if (result0 !== null) {
          result1 = parse_LinkValue();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, start, last) {
            return start.concat([last]);
          }(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_LinkValue() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 60) {
          result0 = "<";
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("\"<\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_URIReference();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 62) {
              result2 = ">";
              pos++;
            } else {
              result2 = null;
              {
                matchFailed("\">\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_OptionalSP();
              if (result3 !== null) {
                result4 = [];
                result5 = parse_LinkParams();
                while (result5 !== null) {
                  result4.push(result5);
                  result5 = parse_LinkParams();
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, href, params) {
            var link = {};
            params.forEach(function (param) {
              link[param[0]] = param[1];
            });
            link.href = href;
            return link;
          }(pos0, result0[1], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_LinkParams() {
        var result0, result1, result2, result3;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 59) {
          result0 = ";";
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("\";\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_OptionalSP();
          if (result1 !== null) {
            result2 = parse_LinkParam();
            if (result2 !== null) {
              result3 = parse_OptionalSP();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, param) {
            return param;
          }(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_URIReference() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        if (/^[^>]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          {
            matchFailed("[^>]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[^>]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              {
                matchFailed("[^>]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = function (offset, url$$1) {
            return url$$1.join('');
          }(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_LinkParam() {
        var result0, result1;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        result0 = parse_LinkParamName();
        if (result0 !== null) {
          result1 = parse_LinkParamValue();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, name, value) {
            return [name, value];
          }(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_LinkParamName() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        if (/^[a-z]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          {
            matchFailed("[a-z]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-z]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              {
                matchFailed("[a-z]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = function (offset, name) {
            return name.join('');
          }(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_LinkParamValue() {
        var result0, result1;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 61) {
          result0 = "=";
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("\"=\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_PToken();
          if (result1 === null) {
            result1 = parse_QuotedString();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, str) {
            return str;
          }(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_PToken() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        result1 = parse_PTokenChar();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_PTokenChar();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = function (offset, token) {
            return token.join('');
          }(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_PTokenChar() {
        var result0;

        if (input.charCodeAt(pos) === 33) {
          result0 = "!";
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("\"!\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 35) {
            result0 = "#";
            pos++;
          } else {
            result0 = null;
            {
              matchFailed("\"#\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 36) {
              result0 = "$";
              pos++;
            } else {
              result0 = null;
              {
                matchFailed("\"$\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 37) {
                result0 = "%";
                pos++;
              } else {
                result0 = null;
                {
                  matchFailed("\"%\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 38) {
                  result0 = "&";
                  pos++;
                } else {
                  result0 = null;
                  {
                    matchFailed("\"&\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 39) {
                    result0 = "'";
                    pos++;
                  } else {
                    result0 = null;
                    {
                      matchFailed("\"'\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 40) {
                      result0 = "(";
                      pos++;
                    } else {
                      result0 = null;
                      {
                        matchFailed("\"(\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 41) {
                        result0 = ")";
                        pos++;
                      } else {
                        result0 = null;
                        {
                          matchFailed("\")\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 42) {
                          result0 = "*";
                          pos++;
                        } else {
                          result0 = null;
                          {
                            matchFailed("\"*\"");
                          }
                        }
                        if (result0 === null) {
                          if (input.charCodeAt(pos) === 43) {
                            result0 = "+";
                            pos++;
                          } else {
                            result0 = null;
                            {
                              matchFailed("\"+\"");
                            }
                          }
                          if (result0 === null) {
                            if (input.charCodeAt(pos) === 45) {
                              result0 = "-";
                              pos++;
                            } else {
                              result0 = null;
                              {
                                matchFailed("\"-\"");
                              }
                            }
                            if (result0 === null) {
                              if (input.charCodeAt(pos) === 46) {
                                result0 = ".";
                                pos++;
                              } else {
                                result0 = null;
                                {
                                  matchFailed("\".\"");
                                }
                              }
                              if (result0 === null) {
                                if (input.charCodeAt(pos) === 124) {
                                  result0 = "|";
                                  pos++;
                                } else {
                                  result0 = null;
                                  {
                                    matchFailed("\"|\"");
                                  }
                                }
                                if (result0 === null) {
                                  result0 = parse_Digit();
                                  if (result0 === null) {
                                    if (input.charCodeAt(pos) === 58) {
                                      result0 = ":";
                                      pos++;
                                    } else {
                                      result0 = null;
                                      {
                                        matchFailed("\":\"");
                                      }
                                    }
                                    if (result0 === null) {
                                      if (input.charCodeAt(pos) === 60) {
                                        result0 = "<";
                                        pos++;
                                      } else {
                                        result0 = null;
                                        {
                                          matchFailed("\"<\"");
                                        }
                                      }
                                      if (result0 === null) {
                                        if (input.charCodeAt(pos) === 61) {
                                          result0 = "=";
                                          pos++;
                                        } else {
                                          result0 = null;
                                          {
                                            matchFailed("\"=\"");
                                          }
                                        }
                                        if (result0 === null) {
                                          if (input.charCodeAt(pos) === 62) {
                                            result0 = ">";
                                            pos++;
                                          } else {
                                            result0 = null;
                                            {
                                              matchFailed("\">\"");
                                            }
                                          }
                                          if (result0 === null) {
                                            if (input.charCodeAt(pos) === 63) {
                                              result0 = "?";
                                              pos++;
                                            } else {
                                              result0 = null;
                                              {
                                                matchFailed("\"?\"");
                                              }
                                            }
                                            if (result0 === null) {
                                              if (input.charCodeAt(pos) === 64) {
                                                result0 = "@";
                                                pos++;
                                              } else {
                                                result0 = null;
                                                {
                                                  matchFailed("\"@\"");
                                                }
                                              }
                                              if (result0 === null) {
                                                result0 = parse_Alpha();
                                                if (result0 === null) {
                                                  if (input.charCodeAt(pos) === 91) {
                                                    result0 = "[";
                                                    pos++;
                                                  } else {
                                                    result0 = null;
                                                    {
                                                      matchFailed("\"[\"");
                                                    }
                                                  }
                                                  if (result0 === null) {
                                                    if (input.charCodeAt(pos) === 93) {
                                                      result0 = "]";
                                                      pos++;
                                                    } else {
                                                      result0 = null;
                                                      {
                                                        matchFailed("\"]\"");
                                                      }
                                                    }
                                                    if (result0 === null) {
                                                      if (input.charCodeAt(pos) === 94) {
                                                        result0 = "^";
                                                        pos++;
                                                      } else {
                                                        result0 = null;
                                                        {
                                                          matchFailed("\"^\"");
                                                        }
                                                      }
                                                      if (result0 === null) {
                                                        if (input.charCodeAt(pos) === 95) {
                                                          result0 = "_";
                                                          pos++;
                                                        } else {
                                                          result0 = null;
                                                          {
                                                            matchFailed("\"_\"");
                                                          }
                                                        }
                                                        if (result0 === null) {
                                                          if (input.charCodeAt(pos) === 96) {
                                                            result0 = "`";
                                                            pos++;
                                                          } else {
                                                            result0 = null;
                                                            {
                                                              matchFailed("\"`\"");
                                                            }
                                                          }
                                                          if (result0 === null) {
                                                            if (input.charCodeAt(pos) === 123) {
                                                              result0 = "{";
                                                              pos++;
                                                            } else {
                                                              result0 = null;
                                                              {
                                                                matchFailed("\"{\"");
                                                              }
                                                            }
                                                            if (result0 === null) {
                                                              if (/^[\/\/]/.test(input.charAt(pos))) {
                                                                result0 = input.charAt(pos);
                                                                pos++;
                                                              } else {
                                                                result0 = null;
                                                                {
                                                                  matchFailed("[\\/\\/]");
                                                                }
                                                              }
                                                              if (result0 === null) {
                                                                if (input.charCodeAt(pos) === 125) {
                                                                  result0 = "}";
                                                                  pos++;
                                                                } else {
                                                                  result0 = null;
                                                                  {
                                                                    matchFailed("\"}\"");
                                                                  }
                                                                }
                                                                if (result0 === null) {
                                                                  if (input.charCodeAt(pos) === 126) {
                                                                    result0 = "~";
                                                                    pos++;
                                                                  } else {
                                                                    result0 = null;
                                                                    {
                                                                      matchFailed("\"~\"");
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }

      function parse_OptionalSP() {
        var result0, result1;

        result0 = [];
        result1 = parse_SP();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_SP();
        }
        return result0;
      }

      function parse_QuotedString() {
        var result0, result1, result2;
        var pos0, pos1;

        pos0 = pos;
        pos1 = pos;
        result0 = parse_DQ();
        if (result0 !== null) {
          result1 = parse_QuotedStringInternal();
          if (result1 !== null) {
            result2 = parse_DQ();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = function (offset, str) {
            return str;
          }(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_QuotedStringInternal() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        result0 = [];
        result1 = parse_QDText();
        if (result1 === null) {
          result1 = parse_QuotedPair();
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_QDText();
          if (result1 === null) {
            result1 = parse_QuotedPair();
          }
        }
        if (result0 !== null) {
          result0 = function (offset, str) {
            return str.join('');
          }(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }

      function parse_Char() {
        var result0;

        if (/^[\0-]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[\\0-]");
          }
        }
        return result0;
      }

      function parse_UpAlpha() {
        var result0;

        if (/^[A-Z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[A-Z]");
          }
        }
        return result0;
      }

      function parse_LoAlpha() {
        var result0;

        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[a-z]");
          }
        }
        return result0;
      }

      function parse_Alpha() {
        var result0;

        result0 = parse_UpAlpha();
        if (result0 === null) {
          result0 = parse_LoAlpha();
        }
        return result0;
      }

      function parse_Digit() {
        var result0;

        if (/^[0-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[0-9]");
          }
        }
        return result0;
      }

      function parse_SP() {
        var result0;

        if (/^[ ]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[ ]");
          }
        }
        return result0;
      }

      function parse_DQ() {
        var result0;

        if (/^["]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[\"]");
          }
        }
        return result0;
      }

      function parse_QDText() {
        var result0;

        if (/^[^"]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[^\"]");
          }
        }
        return result0;
      }

      function parse_QuotedPair() {
        var result0, result1;
        var pos0;

        pos0 = pos;
        if (/^[\\]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          {
            matchFailed("[\\\\]");
          }
        }
        if (result0 !== null) {
          result1 = parse_Char();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }

      function cleanupExpected(expected) {
        expected.sort();

        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }

      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */

        var line = 1;
        var column = 1;
        var seenCR = false;

        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) {
              line++;
            }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === '\u2028' || ch === '\u2029') {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }

        return { line: line, column: column };
      }

      var result = parseFunctions[startRule]();

      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();

        throw new this.SyntaxError(cleanupExpected(rightmostFailuresExpected), found, offset, errorPosition.line, errorPosition.column);
      }

      return result;
    },

    /* Returns the parser source code. */
    toSource: function toSource() {
      return this._source;
    }
  };

  /* Thrown when a parser encounters a syntax error. */

  result.SyntaxError = function (expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;

      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ") + " or " + expected[expected.length - 1];
      }

      foundHumanized = found ? quote(found) : "end of input";

      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }

    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };

  result.SyntaxError.prototype = Error.prototype;

  return result;
}();

// install ES6 Promise polyfill








var paginator = interceptor_1({
  success: function success(response, config) {
    var link = response && response.headers && response.headers.Link;
    var client = response && response.request && response.request.originator;

    if (link) {
      var nextLink = rfc5988.parse(link).filter(function (link) {
        return link.rel === 'next';
      })[0];

      if (nextLink) {
        response.nextPage = function (callback) {
          var linkParts = url.parse(nextLink.href);
          var linkQuery = querystring.parse(linkParts.query);
          linkQuery.access_token = linkQuery.access_token || config.access_token;
          linkParts.search = querystring.stringify(linkQuery);
          return client({
            path: url.format(linkParts),
            callback: callback
          });
        };
      }
    }

    return response;
  }
});

var paginator_1 = paginator;

var standardResponse = interceptor_1({
  response: transform
});

function transform(response) {
  return {
    url: response.url,
    status: response.status && response.status.code,
    headers: response.headers,
    entity: response.entity,
    error: response.error,
    callback: response.request && response.request.callback,
    nextPage: response.nextPage
  };
}

var standard_response = standardResponse;

// install ES6 Promise polyfill

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





var callbackify = interceptor_1({
  success: function success(response) {
    var callback = response && response.callback;

    if (typeof callback === 'function') {
      callback(null, response.entity, response);
    }

    return response;
  },
  error: function error(response) {
    var callback = response && response.callback;

    if (typeof callback === 'function') {
      var err = response.error || response.entity;
      if ((typeof err === 'undefined' ? 'undefined' : _typeof$4(err)) !== 'object') err = new Error(err);
      callback(err);
    }

    return response;
  }
});

var callbackify_1 = callbackify;

// install ES6 Promise polyfill





// rest.js client with MIME support
var client$4 = function (config) {
  return node_1.wrap(errorCode).wrap(pathPrefix, { prefix: config.endpoint }).wrap(mime_1$1, { mime: 'application/json' }).wrap(template).wrap(defaultRequest, {
    params: { access_token: config.accessToken }
  }).wrap(paginator_1, { access_token: config.accessToken }).wrap(standard_response).wrap(callbackify_1);
};

/*
 * Copyright (c) 2009 Nicholas C. Zakas. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint bitwise: false */

var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Base64-encodes a string of text.
 *
 * @param {string} text The text to encode.
 * @return {string} The base64-encoded string.
 */
function base64Encode(text) {

	if (/([^\u0000-\u00ff])/.test(text)) {
		throw new Error('Can\'t base64 encode non-ASCII characters.');
	}

	var i = 0,
	    cur,
	    prev,
	    byteNum,
	    result = [];

	while (i < text.length) {

		cur = text.charCodeAt(i);
		byteNum = i % 3;

		switch (byteNum) {
			case 0:
				//first byte
				result.push(digits.charAt(cur >> 2));
				break;

			case 1:
				//second byte
				result.push(digits.charAt((prev & 3) << 4 | cur >> 4));
				break;

			case 2:
				//third byte
				result.push(digits.charAt((prev & 0x0f) << 2 | cur >> 6));
				result.push(digits.charAt(cur & 0x3f));
				break;
		}

		prev = cur;
		i += 1;
	}

	if (byteNum === 0) {
		result.push(digits.charAt((prev & 3) << 4));
		result.push('==');
	} else if (byteNum === 1) {
		result.push(digits.charAt((prev & 0x0f) << 2));
		result.push('=');
	}

	return result.join('');
}

/**
 * Base64-decodes a string of text.
 *
 * @param {string} text The text to decode.
 * @return {string} The base64-decoded string.
 */
function base64Decode(text) {

	//ignore white space
	text = text.replace(/\s/g, '');

	//first check for any unexpected input
	if (!/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text) || text.length % 4 > 0) {
		throw new Error('Not a base64-encoded string.');
	}

	//local variables
	var cur,
	    prev,
	    digitNum,
	    i = 0,
	    result = [];

	//remove any equals signs
	text = text.replace(/\=/g, '');

	//loop over each character
	while (i < text.length) {

		cur = digits.indexOf(text.charAt(i));
		digitNum = i % 4;

		switch (digitNum) {

			//case 0: first digit - do nothing, not enough info to work with

			case 1:
				//second digit
				result.push(String.fromCharCode(prev << 2 | cur >> 4));
				break;

			case 2:
				//third digit
				result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
				break;

			case 3:
				//fourth digit
				result.push(String.fromCharCode((prev & 3) << 6 | cur));
				break;
		}

		prev = cur;
		i += 1;
	}

	//return a string
	return result.join('');
}

var base64 = {
	encode: base64Encode,
	decode: base64Decode
};

/**
 * Access tokens actually are data, and using them we can derive
 * a user's username. This method attempts to do just that,
 * decoding the part of the token after the first `.` into
 * a username.
 *
 * @private
 * @param {string} token an access token
 * @return {string} username
 */
function getUser(token) {
  var data = token.split('.')[1];
  if (!data) return null;
  data = data.replace(/-/g, '+').replace(/_/g, '/');

  var mod = data.length % 4;
  if (mod === 2) data += '==';
  if (mod === 3) data += '=';
  if (mod === 1 || mod > 3) return null;

  try {
    return JSON.parse(base64.decode(data)).u;
  } catch (err) {
    return null;
  }
}

var get_user = getUser;

var _typeof$5 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };






/**
 * Services all have the same constructor pattern: you initialize them
 * with an access token and options, and they validate those arguments
 * in a predictable way. This is a constructor-generator that makes
 * it possible to require each service's API individually.
 *
 * @private
 * @param {string} name the name of the Mapbox API this class will access:
 * this is set to the name of the function so it will show up in tracebacks
 * @returns {Function} constructor function
 */
function makeService(name) {

  function service(accessToken, options) {
    this.name = name;

    invariant_1(typeof accessToken === 'string', 'accessToken required to instantiate Mapbox client');

    var endpoint = constants.DEFAULT_ENDPOINT;

    if (options !== undefined) {
      invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$5(options)) === 'object', 'options must be an object');
      if (options.endpoint) {
        invariant_1(typeof options.endpoint === 'string', 'endpoint must be a string');
        endpoint = options.endpoint;
      }
      if (options.account) {
        invariant_1(typeof options.account === 'string', 'account must be a string');
        this.owner = options.account;
      }
    }

    this.client = client$4({
      endpoint: endpoint,
      accessToken: accessToken
    });

    this.accessToken = accessToken;
    this.endpoint = endpoint;
    this.owner = this.owner || get_user(accessToken);
    invariant_1(!!this.owner, 'could not determine account from provided accessToken');
  }

  return service;
}

var make_service = makeService;

/*
 * xtend by Jake Verbaten
 *
 * Licensed under MIT
 * https://github.com/Raynos/xtend
 */
var extendMutable_1 = extendMutable;
var extend_1 = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extendMutable(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

var xtend = {
	extendMutable: extendMutable_1,
	extend: extend_1
};

var _typeof$6 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




/**
 * @class MapboxGeocoding
 */
var MapboxGeocoding = make_service('MapboxGeocoding');

var API_GEOCODING_FORWARD = '/geocoding/v5/{dataset}/{query}.json{?access_token,proximity,country,types,bbox,limit,autocomplete,language}';
var API_GEOCODING_REVERSE = '/geocoding/v5/{dataset}/{longitude},{latitude}.json{?access_token,types,limit,language}';

var REVERSE_GEOCODING_PRECISION = 5;
var FORWARD_GEOCODING_PROXIMITY_PRECISION = 3;

function roundTo(value, places) {
  var mult = Math.pow(10, places);
  return Math.round(value * mult) / mult;
}

/**
 * Search for a location with a string, using the
 * [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).
 *
 * The `query` parmeter can be an array of strings only if batch geocoding
 * is used by specifying `mapbox.places-permanent` as the `dataset` option.
 *
 * @param {string|Array<string>} query desired location
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {Object} options.proximity a proximity argument: this is
 * a geographical point given as an object with latitude and longitude
 * properties. Search results closer to this point will be given
 * higher priority.
 * @param {Array} options.bbox a bounding box argument: this is
 * a bounding box given as an array in the format [minX, minY, maxX, maxY].
 * Search results will be limited to the bounding box.
 * @param {Array<string>|string} options.language Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, as an array or separated by commas.
 * @param {Array<string>|string} options.types an array or comma seperated list of types that filter
 * results to match those specified. See https://www.mapbox.com/developers/api/geocoding/#filter-type
 * for available types.
 * @param {number} [options.limit=5] is the maximum number of results to return, between 1 and 10 inclusive.
 * Some very specific queries may return fewer results than the limit.
 * @param {Array<string>|string} options.country an array or comma separated list of country codes to
 * limit results to specified country or countries.
 * @param {boolean} [options.autocomplete=true] whether to include results that include
 * the query only as a prefix. This is useful for UIs where users type
 * values, but if you have complete addresses as input, you'll want to turn it off
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeForward('Paris, France', function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the proximity option to weight results closer to texas
 * mapboxClient.geocodeForward('Paris, France', {
 *   proximity: { latitude: 33.6875431, longitude: -95.4431142 }
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the bbox option to limit results to a portion of Washington, D.C.
 * mapboxClient.geocodeForward('Starbucks', {
 *   bbox: [-77.083056,38.908611,-76.997778,38.959167]
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxGeocoding.prototype.geocodeForward = function (query, options, callback) {
  // permit the options argument to be omitted, or the options + callback args to be omitted if using promise syntax
  if (callback === undefined && (options === undefined || typeof options === 'function')) {
    callback = options;
    options = {};
  }

  // typecheck arguments
  if (Array.isArray(query)) {
    if (options.dataset !== 'mapbox.places-permanent') {
      throw new Error('Batch geocoding is only available with the mapbox.places-permanent endpoint. See https://mapbox.com/api-documentation/#batch-requests for details');
    } else {
      query = query.join(';');
    }
  }
  invariant_1(typeof query === 'string', 'query must be a string');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$6(options)) === 'object', 'options must be an object');

  var queryOptions = {
    query: query,
    dataset: 'mapbox.places'
  };

  var precision = FORWARD_GEOCODING_PROXIMITY_PRECISION;
  if (options.precision) {
    invariant_1(typeof options.precision === 'number', 'precision option must be number');
    precision = options.precision;
  }

  if (options.proximity) {
    invariant_1(typeof options.proximity.latitude === 'number' && typeof options.proximity.longitude === 'number', 'proximity must be an object with numeric latitude & longitude properties');
    queryOptions.proximity = roundTo(options.proximity.longitude, precision) + ',' + roundTo(options.proximity.latitude, precision);
  }

  if (options.bbox) {
    invariant_1(typeof options.bbox[0] === 'number' && typeof options.bbox[1] === 'number' && typeof options.bbox[2] === 'number' && typeof options.bbox[3] === 'number' && options.bbox.length === 4, 'bbox must be an array with numeric values in the form [minX, minY, maxX, maxY]');
    queryOptions.bbox = options.bbox[0] + ',' + options.bbox[1] + ',' + options.bbox[2] + ',' + options.bbox[3];
  }

  if (options.limit) {
    invariant_1(typeof options.limit === 'number', 'limit must be a number');
    queryOptions.limit = options.limit;
  }

  if (options.dataset) {
    invariant_1(typeof options.dataset === 'string', 'dataset option must be string');
    queryOptions.dataset = options.dataset;
  }

  if (options.country) {
    if (Array.isArray(options.country)) {
      queryOptions.country = options.country.join(',');
    } else {
      invariant_1(typeof options.country === 'string', 'country option must be an array or string');
      queryOptions.country = options.country;
    }
  }

  if (options.language) {
    if (Array.isArray(options.language)) {
      queryOptions.language = options.language.join(',');
    } else {
      invariant_1(typeof options.language === 'string', 'language option must be an array or string');
      queryOptions.language = options.language;
    }
  }

  if (options.types) {
    if (Array.isArray(options.types)) {
      queryOptions.types = options.types.join(',');
    } else {
      invariant_1(typeof options.types === 'string', 'types option must be an array or string');
      queryOptions.types = options.types;
    }
  }

  if (typeof options.autocomplete === 'boolean') {
    invariant_1(typeof options.autocomplete === 'boolean', 'autocomplete must be a boolean');
    queryOptions.autocomplete = options.autocomplete;
  }

  return this.client({
    path: API_GEOCODING_FORWARD,
    params: queryOptions,
    callback: callback
  });
};

/**
 * Given a location, determine what geographical features are located
 * there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/api-documentation/#geocoding).
 *
 * @param {Object} location the geographical point to search
 * @param {number} location.latitude decimal degrees latitude, in range -90 to 90
 * @param {number} location.longitude decimal degrees longitude, in range -180 to 180
 * @param {Object} [options={}] additional options meant to tune
 * the request.
 * @param {Array<string>|string} options.language Specify the language to use for response text and, for forward geocoding, query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas or as an array.
 * @param {Array<string>|string} options.types an array or comma seperated list of types that filter
 * results to match those specified. See
 * https://www.mapbox.com/api-documentation/#retrieve-places-near-a-location
 * for available types.
 * @param {number} [options.limit=1] is the maximum number of results to return, between 1 and 5
 * inclusive. Requires a single options.types to be specified (see example).
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142, options: { types: 'address', limit: 3 } },
 *   function(err, res) {
 *   // res is a GeoJSON document with up to 3 geocoding matches
 * });
 */
MapboxGeocoding.prototype.geocodeReverse = function (location, options, callback) {
  // permit the options argument to be omitted, or the options + callback args to be omitted if using promise syntax
  if (callback === undefined && (options === undefined || typeof options === 'function')) {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant_1((typeof location === 'undefined' ? 'undefined' : _typeof$6(location)) === 'object' && location !== null, 'location must be an object');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$6(options)) === 'object', 'options must be an object');

  invariant_1(typeof location.latitude === 'number' && typeof location.longitude === 'number', 'location must be an object with numeric latitude & longitude properties');

  var queryOptions = {
    dataset: 'mapbox.places'
  };

  if (options.dataset) {
    invariant_1(typeof options.dataset === 'string', 'dataset option must be string');
    queryOptions.dataset = options.dataset;
  }

  var precision = REVERSE_GEOCODING_PRECISION;
  if (options.precision) {
    invariant_1(typeof options.precision === 'number', 'precision option must be number');
    precision = options.precision;
  }

  if (options.language) {
    if (Array.isArray(options.language)) {
      queryOptions.language = options.language.join(',');
    } else {
      invariant_1(typeof options.language === 'string', 'language option must be an array or string');
      queryOptions.language = options.language;
    }
  }

  if (options.types) {
    if (Array.isArray(options.types)) {
      queryOptions.types = options.types.join(',');
    } else {
      invariant_1(typeof options.types === 'string', 'types option must be an array or string');
      queryOptions.types = options.types;
    }
  }

  if (options.limit) {
    invariant_1(typeof options.limit === 'number', 'limit option must be a number');
    invariant_1(options.types.split(',').length === 1, 'a single type must be specified to use the limit option');
    queryOptions.limit = options.limit;
  }

  queryOptions.longitude = roundTo(location.longitude, precision);
  queryOptions.latitude = roundTo(location.latitude, precision);

  return this.client({
    path: API_GEOCODING_REVERSE,
    params: queryOptions,
    callback: callback
  });
};

var geocoding = MapboxGeocoding;

/**
 * Given an object that should be a location, ensure that it has
 * valid numeric longitude & latitude properties
 *
 * @param {Object} location object with longitude and latitude values
 * @throws {AssertError} if the object is not a valid location
 * @returns {undefined} nothing
 * @private
 */
function invariantLocation(location) {
  invariant_1(typeof location.latitude === 'number' && typeof location.longitude === 'number', 'location must be an object with numeric latitude & longitude properties');
  if (location.zoom !== undefined) {
    invariant_1(typeof location.zoom === 'number', 'zoom must be numeric');
  }
}

var invariant_location = invariantLocation;

/**
 * Format waypionts in a way that's friendly to the directions and surface
 * API: comma-separated latitude, longitude pairs with semicolons between
 * them.
 * @private
 * @param {Array<Object>} waypoints array of objects with latitude and longitude
 * properties
 * @returns {string} formatted points
 * @throws {Error} if the input is invalid
 */
function formatPoints(waypoints) {
  return waypoints.map(function (location) {
    invariant_location(location);
    return location.longitude + ',' + location.latitude;
  }).join(';');
}

var format_points = formatPoints;

var _typeof$7 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * @class MapboxSurface
 */
var MapboxSurface = make_service('MapboxSurface');

var API_SURFACE = '/v4/surface/{mapid}.json{?access_token,layer,fields,points,geojson,interpolate,encoded_polyline}';

/**
 * Given a list of locations, retrieve vector tiles, find the nearest
 * spatial features, extract their data values, and then absolute values and
 * optionally interpolated values in-between, if the interpolate option is specified.
 *
 * Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
 * for more documentation.
 *
 * @param {string} mapid a Mapbox mapid containing vector tiles against
 * which we'll query
 * @param {string} layer layer within the given `mapid` for which to pull
 * data
 * @param {Array<string>} fields layer within the given `mapid` for which to pull
 * data
 * @param {Array<Object>|string} path either an encoded polyline,
 * provided as a string, or an array of objects with longitude and latitude
 * properties, similar to waypoints.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.geojson=false] whether to return data as a
 * GeoJSON point
 * @param {string} [options.zoom=maximum] zoom level at which features
 * are queried
 * @param {boolean} [options.interpolate=true] Whether to interpolate
 * between matches in the feature collection.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxSurface.prototype.surface = function (mapid, layer, fields, path, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant_1(typeof mapid === 'string', 'mapid must be a string');
  invariant_1(typeof layer === 'string', 'layer must be a string');
  invariant_1(Array.isArray(fields), 'fields must be an array of strings');
  invariant_1(Array.isArray(path) || typeof path === 'string', 'path must be an array of objects or a string');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$7(options)) === 'object', 'options must be an object');

  var interpolate = true,
      geojson = false;

  if (options.interpolate !== undefined) {
    invariant_1(typeof options.interpolate === 'boolean', 'interpolate must be a boolean');
    interpolate = options.interpolate;
  }

  if (options.geojson !== undefined) {
    invariant_1(typeof options.geojson === 'boolean', 'geojson option must be boolean');
    geojson = options.geojson;
  }

  var surfaceOptions = {
    geojson: geojson,
    layer: layer,
    mapid: mapid,
    fields: fields.join(','),
    interpolate: interpolate
  };

  if (Array.isArray(path)) {
    surfaceOptions.points = format_points(path);
  } else {
    surfaceOptions.encoded_polyline = path;
  }

  if (options.zoom !== undefined) {
    invariant_1(typeof options.zoom === 'number', 'zoom must be a number');
    surfaceOptions.z = options.zoom;
  }

  return this.client({
    path: API_SURFACE,
    params: surfaceOptions,
    callback: callback
  });
};

var surface = MapboxSurface;

var _typeof$8 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * @class MapboxDirections
 */
var MapboxDirections = make_service('MapboxDirections');

var API_DIRECTIONS = '/directions/v5/{account}/{profile}/{encodedWaypoints}.json{?access_token,alternatives,geometries,overview,radiuses,steps,continue_straight,bearings}';

/**
 * Find directions from A to B, or between any number of locations.
 * Consult the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
 * for more documentation.
 *
 * @param {Array<Object>} waypoints an array of objects with `latitude`
 * and `longitude` properties that represent waypoints in order. Up to
 * 25 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving-traffic'` for automotive routing which factors
 * in current and historic traffic conditions to avoid slowdowns,
 * `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.account=mapbox] Account for the profile.
 * @param {string} [options.alternatives=true] whether to generate
 * alternative routes along with the preferred route.
 * @param {string} [options.geometries=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns instructions.
 * @param {string} [options.overview=simplified] type of returned overview
 * geometry. Can be `full` (the most detailed geometry available), `simplified`
 * (a simplified version of the full geometry), or `false`.
 * @param {Array<number|string>} [options.radiuses] an array of integers in meters
 * indicating the maximum distance each coordinate is allowed to move when
 * snapped to a nearby road segment. There must be as many radiuses as there
 * are coordinates in the request. Values can be any number greater than `0` or
 * they can be the string `unlimited`. If no routable road is found within the
 * radius, a `NoSegment` error is returned.
 * @param {boolean} [options.steps=false] whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {boolean} [options.continue_straight] sets allowed direction of travel
 * when departing intermediate waypoints. If `true` the route will continue in
 * the same direction of travel. If `false` the route may continue in the
 * opposite direction of travel. Defaults to `true` for the `driving` profile
 * and `false` for the `walking` and `cycling` profiles.
 * @param {Array<Array>} [options.bearings] used to filter the road
 * segment the waypoint will be placed on by direction and dictates the angle
 * of approach. This option should always be used in conjunction with the
 * `radiuses` option. The parameter takes two values per waypoint: the first is
 * an angle clockwise from true north between `0` and `360`. The second is the
 * range of degrees the angle can deviate by. We recommend a value of `45` or
 * `90` for the range, as bearing measurements tend to be inaccurate. This is
 * useful for making sure we reroute vehicles on new routes that continue
 * traveling in their current direction. A request that does this would provide
 * bearing and radius values for the first waypoint and leave the remaining
 * values empty.If provided, the list of bearings must be the same length as
 * the list of waypoints, but you can skip a coordinate and show its position
 * by providing an empty array.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.getDirections(
 *   [
 *     { latitude: 33.6, longitude: -95.4431 },
 *     { latitude: 33.2, longitude: -95.4431 } ],
 *   function(err, res) {
 *   // res is a document with directions
 * });
 *
 * // With options
 * mapboxClient.getDirections([
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   { latitude: 33.6875431, longitude: -95.4831142 }
 * ], {
 *   profile: 'walking',
 *   alternatives: false,
 *   geometry: 'polyline'
 * }, function(err, results) {
 *   console.log(results);
 * });
 */
MapboxDirections.prototype.getDirections = function (waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  // typecheck arguments
  invariant_1(Array.isArray(waypoints), 'waypoints must be an array');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$8(options)) === 'object', 'options must be an object');

  var encodedWaypoints = format_points(waypoints);

  var params = {
    encodedWaypoints: encodedWaypoints,
    profile: 'driving',
    account: 'mapbox',
    alternatives: true,
    steps: true,
    geometries: 'geojson'
  };

  if (options.profile) {
    invariant_1(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  if (options.account) {
    invariant_1(typeof options.account === 'string', 'account option must be string');
    params.account = options.account;
  }

  if (typeof options.alternatives !== 'undefined') {
    invariant_1(typeof options.alternatives === 'boolean', 'alternatives option must be boolean');
    params.alternatives = options.alternatives;
  }

  if (options.radiuses) {
    invariant_1(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant_1(options.radiuses.length === waypoints.length, 'There must be as many radiuses as there are waypoints in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant_1(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant_1(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  var allowedOverviews = ['simplified', 'full'];
  if (options.overview) {
    invariant_1(allowedOverviews.indexOf(options.overview) !== -1, 'overview option must be ' + allowedOverviews);
    params.overview = options.overview;
  }

  if (typeof options.continue_straight !== 'undefined') {
    invariant_1(typeof options.continue_straight === 'boolean', 'continue_straight option must be boolean');
    params.continue_straight = options.continue_straight;
  }

  if (options.bearings) {
    invariant_1(Array.isArray(options.radiuses), 'bearings must be an array');
    invariant_1(options.bearings.length === waypoints.length, 'There must be as many bearings as there are waypoints in the request');
    params.bearings = options.bearings.join(';');
  }

  return this.client({
    path: API_DIRECTIONS,
    params: params,
    callback: callback
  });
};

var directions = MapboxDirections;

var uploads = createCommonjsModule(function (module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




/**
 * @class MapboxUploads
 */
var MapboxUploads = module.exports = make_service('MapboxUploads');

var API_UPLOADS = '/uploads/v1/{owner}{?access_token}';
var API_UPLOAD = '/uploads/v1/{owner}/{upload}{?access_token}';
var API_UPLOAD_CREDENTIALS = '/uploads/v1/{owner}/credentials{?access_token}';

/**
 * Retrieve a listing of uploads for a particular account.
 *
 * This request requires an access token with the uploads:list scope.
 *
 * @param {Function} callback called with (err, uploads)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.listUploads(function(err, uploads) {
 *   console.log(uploads);
 *   // [
 *   //   {
 *   //     "complete": true,
 *   //     "tileset": "example.mbtiles",
 *   //     "error": null,
 *   //     "id": "abc123",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 1
 *   //   },
 *   //   {
 *   //     "complete": false,
 *   //     "tileset": "example.foo",
 *   //     "error": null,
 *   //     "id": "xyz789",
 *   //     "modified": "2014-11-21T19:41:10.000Z",
 *   //     "created": "2014-11-21T19:41:10.000Z",
 *   //     "owner": "example",
 *   //     "progress": 0
 *   //   }
 *   // ]
 * });
 */
MapboxUploads.prototype.listUploads = function (callback) {
  return this.client({
    path: API_UPLOADS,
    params: { owner: this.owner },
    callback: callback
  });
};

/**
 * Retrieve credentials that allow a new file to be staged on Amazon S3
 * while an upload is processed. All uploads must be staged using these
 * credentials before being uploaded to Mapbox.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Function} callback called with (err, credentials)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.createUploadCredentials(function(err, credentials) {
 *   console.log(credentials);
 *   // {
 *   //   "accessKeyId": "{accessKeyId}",
 *   //   "bucket": "somebucket",
 *   //   "key": "hij456",
 *   //   "secretAccessKey": "{secretAccessKey}",
 *   //   "sessionToken": "{sessionToken}",
 *   //   "url": "{s3 url}"
 *   // }
 *
 *   // Use aws-sdk to stage the file on Amazon S3
 *   var AWS = require('aws-sdk');
 *   var s3 = new AWS.S3({
 *        accessKeyId: credentials.accessKeyId,
 *        secretAccessKey: credentials.secretAccessKey,
 *        sessionToken: credentials.sessionToken,
 *        region: 'us-east-1'
 *   });
 *   s3.putObject({
 *     Bucket: credentials.bucket,
 *     Key: credentials.key,
 *     Body: fs.createReadStream('/path/to/file.mbtiles')
 *   }, function(err, resp) {
 *   });
 * });
 */
MapboxUploads.prototype.createUploadCredentials = function (callback) {
  return this.client({
    path: API_UPLOAD_CREDENTIALS,
    params: { owner: this.owner },
    method: 'post',
    callback: callback
  });
};

/**
 * Create an new upload with a file previously staged on Amazon S3.
 *
 * This request requires an access token with the uploads:write scope.
 *
 * @param {Object} options an object that defines the upload's properties
 * @param {String} options.tileset id of the tileset to create or
 * replace. This must consist of an account id and a unique key
 * separated by a period. Reuse of a tileset value will overwrite
 * existing data. To avoid overwriting existing data, you must ensure
 * that you are using unique tileset ids.
 * @param {String} options.url https url of a file staged on Amazon S3.
 * @param {Function} callback called with (err, upload)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Response from a call to createUploadCredentials
 * var credentials = {
 *   "accessKeyId": "{accessKeyId}",
 *   "bucket": "somebucket",
 *   "key": "hij456",
 *   "secretAccessKey": "{secretAccessKey}",
 *   "sessionToken": "{sessionToken}",
 *   "url": "{s3 url}"
 * };
 * mapboxClient.createUpload({
 *    tileset: [accountid, 'mytileset'].join('.'),
 *    url: credentials.url
 * }, function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": false,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 0
 *   // }
 * });
 */
MapboxUploads.prototype.createUpload = function (options, callback) {
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  return this.client({
    path: API_UPLOADS,
    params: { owner: this.owner },
    entity: options,
    callback: callback
  });
};

/**
 * Retrieve state of an upload.
 *
 * This request requires an access token with the uploads:read scope.
 *
 * @param {String} upload id of the upload to read
 * @param {Function} callback called with (err, upload)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.readUpload('hij456', function(err, upload) {
 *   console.log(upload);
 *   // {
 *   //   "complete": true,
 *   //   "tileset": "example.markers",
 *   //   "error": null,
 *   //   "id": "hij456",
 *   //   "modified": "2014-11-21T19:41:10.000Z",
 *   //   "created": "2014-11-21T19:41:10.000Z",
 *   //   "owner": "example",
 *   //   "progress": 1
 *   // }
 * });
 */
MapboxUploads.prototype.readUpload = function (upload, callback) {
  invariant_1(typeof upload === 'string', 'upload must be a string');

  return this.client({
    path: API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  });
};

/**
 * Delete a completed upload. In-progress uploads cannot be deleted.
 *
 * This request requires an access token with the uploads:delete scope.
 *
 * @param {string} upload upload identifier
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.deleteUpload('hij456', function(err) {
 * });
 */
MapboxUploads.prototype.deleteUpload = function (upload, callback) {
  invariant_1(typeof upload === 'string', 'upload must be a string');

  return this.client({
    method: 'delete',
    path: API_UPLOAD,
    params: {
      owner: this.owner,
      upload: upload
    },
    callback: callback
  });
};
});

/**
 * @class MapboxMatching
 */
var MapboxMatching = make_service('MapboxMatching');

var API_MATCHING = '/matching/v5/{account}/{profile}/{coordinates}.json{?access_token,geometries,radiuses,steps,overview,timestamps,annotations}';

/**
 * Snap recorded location traces to roads and paths from OpenStreetMap.
 * Consult the [Map Matching API](https://www.mapbox.com/api-documentation/#map-matching)
 * for more documentation.
 *
 * @param {Array<Array<number>>} coordinates an array of coordinate pairs
 * in [longitude, latitude] order. Up to 100 coordinates can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.geometries=geojson] format of the returned geometry.
 * Allowed values are: `'geojson'` (as LineString), `'polyline'` with
 * precision 5, `'polyline6'`. `'polyline'` yields more compact responses which
 * can be decoded on the client side. [GeoJSON](http://geojson.org/), the
 * default, is compatible with libraries like
 * [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and
 * [Mapbox.js](https://www.mapbox.com/mapbox.js/).
 * @param {Array<number>} [options.radiuses] an array of integers in meters
 * indicating the assumed precision of the used tracking device. There must be
 * as many radiuses as there are coordinates in the request. Values can be a
 * number between 0 and 30. Use higher numbers (20-30) for noisy traces and
 * lower numbers (1-10) for clean traces. The default value is 5.
 * @param {boolean} [options.steps=false] Whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {string|boolean} [options.overview=simplified] type of returned
 * overview geometry. Can be `'full'` (the most detailed geometry available),
 * `'simplified'` (a simplified version of the full geometry), or `false`.
 * @param {Array<number>} [options.timestamps] an array of timestamps
 * corresponding to each coordinate provided in the request; must be numbers in
 * [Unix time](https://en.wikipedia.org/wiki/Unix_time)
 * (seconds since the Unix epoch). There must be as many timestamps as there
 * are coordinates in the request.
 * @param {Array<string>} [options.annotations] an array of fields that return
 * additional metadata for each coordinate along the match geometry. Can be any
 * of `'duration'`, `'distance'`, or `'nodes'`.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.matching([
 *   [-95.4431142, 33.6875431],
 *   [-95.0431142, 33.6875431],
 *   [-95.0431142, 33.0875431],
 *   [-95.0431142, 33.0175431],
 *   [-95.4831142, 33.6875431]
 * ], {
 *  overview: 'full'
 * }, function(err, res) {
 *   // res is a match response object
 * });
 */
MapboxMatching.prototype.matching = function (coordinates, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant_1(Array.isArray(coordinates), 'coordinates must be an array');

  var params = {
    profile: 'driving',
    account: 'mapbox',
    geometries: 'geojson',
    coordinates: coordinates.join(';')
  };

  if (options.profile) {
    invariant_1(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant_1(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  if (options.radiuses) {
    invariant_1(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant_1(options.radiuses.length === coordinates.length, 'There must be as many radiuses as there are coordinates in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant_1(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedOverview = ['full', 'simplified'];
  if (typeof options.overview !== 'undefined') {
    invariant_1(allowedOverview.indexOf(options.overview) !== -1 || options.overview === false, 'overview option must be ' + allowedOverview + ' or false');
    params.overview = options.overview;
  }

  if (options.timestamps) {
    invariant_1(Array.isArray(options.timestamps), 'timestamps must be an array');
    invariant_1(options.timestamps.length === coordinates.length, 'There must be as many timestamps as there are coordinates in the request');
    params.timestamps = options.timestamps.join(';');
  }

  if (options.annotations) {
    invariant_1(Array.isArray(options.annotations), 'annotations must be an array');
    params.annotations = options.annotations.join();
  }

  return this.client({
    path: API_MATCHING,
    params: params,
    method: 'get',
    callback: callback
  });
};

var matching = MapboxMatching;

var hat_1 = createCommonjsModule(function (module) {
/* eslint-disable */
/*
 * hat
 * written by James Halliday, licensed under MIT/X11
 * https://github.com/substack/node-hat
 */
var hat = module.exports = function (bits, base) {
    if (!base) base = 16;
    if (bits === undefined) bits = 128;
    if (bits <= 0) return '0';

    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }

    var rem = digits - Math.floor(digits);

    var res = '';

    for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }

    if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }

    var parsed = parseInt(res, base);
    if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base);
    } else return res;
};
});

var datasets = createCommonjsModule(function (module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * @class MapboxDatasets
 */
var MapboxDatasets = module.exports = make_service('MapboxDatasets');

var API_DATASET_DATASETS = '/datasets/v1/{owner}{?access_token,limit,fresh}';
var API_DATASET_DATASET = '/datasets/v1/{owner}/{dataset}{?access_token}';
var API_DATASET_FEATURES = '/datasets/v1/{owner}/{dataset}/features{?access_token,limit}';
var API_DATASET_FEATURE = '/datasets/v1/{owner}/{dataset}/features/{id}{?access_token}';

/**
 * To retrieve a listing of datasets for a particular account.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {Object} [opts={}] list options
 * @param {number} opts.limit limit, for paging
 * @param {boolean} opts.fresh whether to request fresh data
 * @param {Function} callback called with (err, datasets)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listDatasets(function(err, datasets) {
 *   console.log(datasets);
 *   // [
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   },
 *   //   {
 *   //     "owner": {account},
 *   //     "id": {dataset id},
 *   //     "name": {dataset name},
 *   //     "description": {dataset description},
 *   //     "created": {timestamp},
 *   //     "modified": {timestamp}
 *   //   }
 *   // ]
 * });
 */
MapboxDatasets.prototype.listDatasets = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return this.client({
    path: API_DATASET_DATASETS,
    params: {
      limit: opts.limit,
      fresh: opts.fresh,
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * To create a new dataset. Valid properties include title and description (not required).
 * This request requires an access token with the datasets:write scope.
 *
 * @param {object} [options] an object defining a dataset's properties
 * @param {string} [options.name] the dataset's name
 * @param {string} [options.description] the dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": {dataset id},
 *   //   "name": "foo",
 *   //   "description": "description",
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.createDataset = function (options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');

  return this.client({
    path: API_DATASET_DATASETS,
    params: {
      owner: this.owner
    },
    entity: options,
    callback: callback
  });
};

/**
 * To retrieve information about a particular dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readDataset('dataset-id', function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": {dataset name},
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.readDataset = function (dataset, callback) {
  invariant_1(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    callback: callback
  });
};

/**
 * To make updates to a particular dataset's properties.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object defining updates to the dataset's properties
 * @param {string} [options.name] the updated dataset's name
 * @param {string} [options.description] the updated dataset's description
 * @param {Function} callback called with (err, dataset)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var options = { name: 'foo' };
 * client.updateDataset('dataset-id', options, function(err, dataset) {
 *   console.log(dataset);
 *   // {
 *   //   "owner": {account},
 *   //   "id": "dataset-id",
 *   //   "name": "foo",
 *   //   "description": {dataset description},
 *   //   "created": {timestamp},
 *   //   "modified": {timestamp}
 *   // }
 * });
 */
MapboxDatasets.prototype.updateDataset = function (dataset, options, callback) {
  invariant_1(typeof dataset === 'string', 'dataset must be a string');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be an object');
  invariant_1(!!options.name || !!options.description, 'options must include a name or a description');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'patch',
    entity: options,
    callback: callback
  });
};

/**
 * To delete a particular dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteDataset('dataset-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxDatasets.prototype.deleteDataset = function (dataset, callback) {
  invariant_1(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_DATASET,
    params: {
      owner: this.owner,
      dataset: dataset
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} dataset the id for an existing dataset
 * @param {object} [options] an object for passing pagination arguments
 * @param {number} [options.limit] The maximum number of objects to return. This value must be between 1 and 100. The API will attempt to return the requested number of objects, but receiving fewer objects does not necessarily signal the end of the collection. Receiving an empty page of results is the only way to determine when you are at the end of a collection.
 * @param {Function} callback called with (err, collection)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listFeatures('dataset-id', options, function(err, collection) {
 *   console.log(collection);
 *   {
 *     "type": "FeatureCollection",
 *     "features": [
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       },
 *       {
 *         "id": {feature id},
 *         "type": "Feature",
 *         "properties": {feature properties}
 *         "geometry": {feature geometry}
 *       }
 *     ]
 *   }
 * });
 */
MapboxDatasets.prototype.listFeatures = function (dataset, options, callback) {
  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  invariant_1(typeof dataset === 'string', 'dataset must be a string');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'options must be a object');

  var params = {
    owner: this.owner,
    dataset: dataset
  };

  if (options.limit) {
    invariant_1(typeof options.limit === 'number', 'limit option must be a number');
    params.limit = options.limit;
  }

  return this.client({
    path: API_DATASET_FEATURES,
    params: params,
    callback: callback
  });
};

/**
 * Insert a feature into a dataset. This can be a new feature, or overwrite an existing one.
 * If overwriting an existing feature, make sure that the feature's `id` property correctly identifies
 * the feature you wish to overwrite.
 * For new features, specifying an `id` is optional. If you do not specify an `id`, one will be assigned
 * and returned as part of the response.
 * This request requires an access token with the datasets:write scope.
 * There are a number of limits to consider when making this request:
 *   - a single feature cannot be larger than 500 KB
 *   - the dataset must not exceed 2000 total features
 *   - the dataset must not exceed a total of 5 MB
 *
 * @param {object} feature the feature to insert. Must be a valid GeoJSON feature per http://geojson.org/geojson-spec.html#feature-objects
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {Promise} response
 * @example
 * // Insert a brand new feature without an id
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": {feature id},
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 * @example
 * // Insert a brand new feature with an id, or overwrite an existing feature at that id
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var feature = {
 *   "id": "feature-id",
 *   "type": "Feature",
 *   "properties": {
 *     "name": "Null Island"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [0, 0]
 *   }
 * };
 * client.insertFeature(feature, 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
MapboxDatasets.prototype.insertFeature = function (feature, dataset, callback) {
  invariant_1(typeof dataset === 'string', 'dataset must be a string');

  var id = feature.id || hat_1();
  invariant_1(typeof id === 'string', 'The GeoJSON feature\'s id must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'put',
    entity: feature,
    callback: callback
  });
};

/**
 * Read an existing feature from a dataset.
 * This request requires an access token with the datasets:read scope.
 *
 * @param {string} id the `id` of the feature to read
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err, feature)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFeature('feature-id', 'dataset-id', function(err, feature) {
 *   console.log(feature);
 *   // {
 *   //   "id": "feature-id",
 *   //   "type": "Feature",
 *   //   "properties": {
 *   //     "name": "Null Island"
 *   //   },
 *   //   "geometry": {
 *   //     "type": "Point",
 *   //     "coordinates": [0, 0]
 *   //   }
 *   // }
 * });
 */
MapboxDatasets.prototype.readFeature = function (id, dataset, callback) {
  invariant_1(typeof id === 'string', 'id must be a string');
  invariant_1(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    callback: callback
  });
};

/**
 * Delete an existing feature from a dataset.
 * This request requires an access token with the datasets:write scope.
 *
 * @param {string} id the `id` of the feature to delete
 * @param {string} dataset the id for an existing dataset
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxDatasets.prototype.deleteFeature = function (id, dataset, callback) {
  invariant_1(typeof id === 'string', 'id must be a string');
  invariant_1(typeof dataset === 'string', 'dataset must be a string');

  return this.client({
    path: API_DATASET_FEATURE,
    params: {
      owner: this.owner,
      dataset: dataset,
      id: id
    },
    method: 'delete',
    callback: callback
  });
};
});

var _typeof$9 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





/**
 * @class MapboxMatrix
 */
var MapboxMatrix = make_service('MapboxMatrix');

var API_MATRIX = '/directions-matrix/v1/mapbox/{profile}/{encodedWaypoints}.json{?access_token}';

/**
 * Compute a table of travel-time estimates between a set of waypoints.
 * Consult the [Mapbox Matrix API](https://www.mapbox.com/api-documentation/#matrix)
 * for more documentation and limits.
 *
 * @param {Array<Object>} waypoints an array of coordinate objects
 * in the form `{longitude: 0, latitude: 0}`.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle. The `'driving-traffic'` profile is not supported.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Without options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // With options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], { profile: 'walking' }, {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // Results is an object like:
 * { durations:
 *   [ [ 0, 1196, 3977, 3415, 5196 ],
 *     [ 1207, 0, 3775, 3213, 4993 ],
 *     [ 3976, 3774, 0, 2650, 2579 ],
 *     [ 3415, 3212, 2650, 0, 3869 ],
 *     [ 5208, 5006, 2579, 3882, 0 ] ] }
 *
 * // If the coordinates include an un-routable place, then
 * // the table may contain 'null' values to indicate this, like
 * { durations:
 *   [ [ 0, 11642, 57965, null, 72782 ],
 *     [ 11642, 0, 56394, null, 69918 ],
 *     [ 57965, 56394, 0, null, 19284 ],
 *     [ null, null, null, 0, null ],
 *     [ 72782, 69918, 19284, null, 0 ] ] }
 */

MapboxMatrix.prototype.getMatrix = function (waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  // typecheck arguments
  invariant_1(Array.isArray(waypoints), 'waypoints must be an array');
  invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$9(options)) === 'object', 'options must be an object');

  var encodedWaypoints = format_points(waypoints);

  var params = {
    encodedWaypoints: encodedWaypoints,
    profile: 'driving'
  };

  if (options.profile) {
    invariant_1(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  return this.client({
    path: API_MATRIX,
    params: params,
    callback: callback
  });
};

var matrix = MapboxMatrix;

var tilestats = createCommonjsModule(function (module) {




/**
 * @class MapboxTilestats
 */
var MapboxTilestats = module.exports = make_service('MapboxTilestats');

var API_TILESTATS_STATISTICS = '/tilestats/v1/{owner}/{tileset}{?access_token}';

/**
 * To retrieve statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "layerCount": {layer count},
 *   //   "layers": [
 *   //     {
 *   //       "layer": {layer name},
 *   //       "geometry": {dominant geometry},
 *   //       "count": {feature count},
 *   //       "attributeCount": {attribute count}
 *   //       "attributes": [
 *   //         {
 *   //           "attribute": {attribute name},
 *   //           "type": {attribute type},
 *   //           "count": {unique value count},
 *   //           "min": {minimum value if type is number},
 *   //           "max": {maximum value if type is number},
 *   //           "values": [{...unique values}]
 *   //         }
 *   //       ]
 *   //     }
 *   //   ]
 *   // }
 * });
 */
MapboxTilestats.prototype.getTilestats = function (tileset, callback) {
  invariant_1(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    callback: callback
  });
};

/**
 * To create or update statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {object} statistics - the statistics to upload
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, stats) {
 *   console.log(stats);
 *   // {
 *   //   "account": {account}
 *   //   ... see stats example above (for Tilestats#getTilestats)
 *   // }
 * });
 */
MapboxTilestats.prototype.putTilestats = function (tileset, statistics, callback) {
  invariant_1(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    entity: statistics,
    method: 'put',
    callback: callback
  });
};
});

var styles = createCommonjsModule(function (module) {





/**
 * @class MapboxStyles
 */
var MapboxStyles = module.exports = make_service('MapboxStyles');

var API_STYLES_LIST = '/styles/v1/{owner}{?access_token}';
var API_STYLES_CREATE = '/styles/v1/{owner}{?access_token}';
var API_STYLES_READ = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_UPDATE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_DELETE = '/styles/v1/{owner}/{styleid}{?access_token}';
var API_STYLES_EMBED = '/styles/v1/{owner}/{styleid}.html{?access_token,zoomwheel,title}';
var API_STYLES_SPRITE = '/styles/v1/{owner}/{styleid}/sprite{+retina}{.format}{?access_token}';
var API_STYLES_SPRITE_ICON = '/styles/v1/{owner}/{styleid}/sprite/{iconName}{?access_token}';
var API_STYLES_FONT_GLYPH_RANGES = '/fonts/v1/{owner}/{font}/{start}-{end}.pbf{?access_token}';

/**
 * To retrieve a listing of styles for a particular account.
 *
 * @param {Function} callback called with (err, styles)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listStyles(function(err, styles) {
 *   console.log(styles);
 *   // [{ version: 8,
 *   //  name: 'Light',
 *   //  center: [ -77.0469979435026, 38.898634927602814 ],
 *   //  zoom: 12.511766533145998,
 *   //  bearing: 0,
 *   //  pitch: 0,
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  id: 'STYLEID',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  owner: '{username}' },
 *   //  { version: 8,
 *   //  name: 'Dark',
 *   //  created: '2015-08-28T18:05:22.517Z',
 *   //  id: 'STYILEID',
 *   //  modified: '2015-08-28T18:05:22.517Z',
 *   //  owner: '{username}' }]
 * });
 */
MapboxStyles.prototype.listStyles = function (callback) {
  return this.client({
    path: API_STYLES_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.createStyle(style, function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.createStyle = function (style, callback) {
  return this.client({
    path: API_STYLES_CREATE,
    params: {
      owner: this.owner
    },
    entity: style,
    callback: callback
  });
};

/**
 * Update a style, given the style as a JSON object.
 *
 * @param {Object} style Mapbox GL Style Spec object
 * @param {string} styleid style id
 * @param {Function} callback called with (err, createdStyle)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var style = {
 *   'version': 8,
 *   'name': 'My Awesome Style',
 *   'metadata': {},
 *   'sources': {},
 *   'layers': [],
 *   'glyphs': 'mapbox://fonts/{owner}/{fontstack}/{range}.pbf'
 * };
 * client.updateStyle(style, 'style-id', function(err, createdStyle) {
 *   console.log(createdStyle);
 * });
 */
MapboxStyles.prototype.updateStyle = function (style, styleid, callback) {
  invariant_1(typeof styleid === 'string', 'style id must be a string');
  return this.client({
    path: API_STYLES_UPDATE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    entity: style,
    method: 'patch',
    callback: callback
  });
};

/**
 * Deletes a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err)
 * @returns {Promise} a promise with the response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteStyle('style-id', function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.deleteStyle = function (styleid, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_DELETE,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Reads a particular style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Function} callback called with (err, style)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readStyle('style-id', function(err, style) {
 *   if (!err) console.log(style);
 * });
 */
MapboxStyles.prototype.readStyle = function (styleid, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  return this.client({
    path: API_STYLES_READ,
    params: {
      owner: this.owner,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Read sprite
 *
 * @param {string} styleid the id for an existing style
 * @param {Object=} options optional options
 * @param {boolean} options.retina whether the sprite JSON should be for a
 * retina sprite.
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readSprite('style-id', {
 *   retina: true
 * }, function(err) {
 *   if (!err) console.log('deleted!');
 * });
 */
MapboxStyles.prototype.readSprite = function (styleid, options, callback) {
  invariant_1(typeof styleid === 'string', 'styleid must be a string');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var retina = '';
  if (options.retina) {
    invariant_1(typeof options.retina === 'boolean', 'retina option must be a boolean value');
    if (options.retina) {
      retina = '@2x';
    }
  }

  var format = 'json';
  if (options.format) {
    invariant_1(options.format === 'json' || options.format === 'png', 'format parameter must be either json or png');
    format = options.format;
  }

  return this.client({
    path: API_STYLES_SPRITE,
    params: {
      owner: this.owner,
      retina: retina,
      format: format,
      styleid: styleid
    },
    callback: callback
  });
};

/**
 * Get font glyph ranges
 *
 * @param {string} font or fonts
 * @param {number} start character code of starting glyph
 * @param {number} end character code of last glyph. typically the same
 * as start + 255
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.readFontGlyphRanges('Arial Unicode', 0, 255, function(err, ranges) {
 *   if (!err) console.log(ranges);
 * });
 */
MapboxStyles.prototype.readFontGlyphRanges = function (font, start, end, callback) {
  invariant_1(typeof font === 'string', 'font must be a string');
  invariant_1(typeof start === 'number', 'start must be a number');
  invariant_1(typeof end === 'number', 'end must be a number');

  return this.client({
    path: API_STYLES_FONT_GLYPH_RANGES,
    params: {
      owner: this.owner,
      font: font,
      start: start,
      end: end
    },
    callback: callback
  });
};

/**
 * Add an icon to a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Buffer} icon icon content as a buffer
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var fs = require('fs');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.addIcon('style-id', 'icon-name', fs.readFileSync('icon.png'), function(err) {
 *   if (!err) console.log('added icon!');
 * });
 */
MapboxStyles.prototype.addIcon = function (styleid, iconName, icon, callback) {
  invariant_1(typeof styleid === 'string', 'style must be a string');
  invariant_1(typeof iconName === 'string', 'icon name must be a string');
  invariant_1(Buffer.isBuffer(icon), 'icon must be a Buffer');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    headers: {
      'Content-Type': 'text/plain'
    },
    entity: icon,
    method: 'put',
    callback: callback
  });
};

/**
 * Delete an icon from a sprite.
 *
 * @param {string} styleid the id for an existing style
 * @param {string} iconName icon's name
 * @param {Function} callback called with (err)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteIcon('style-id', 'icon-name', function(err) {
 *   if (!err) console.log('deleted icon!');
 * });
 */
MapboxStyles.prototype.deleteIcon = function (styleid, iconName, callback) {
  invariant_1(typeof styleid === 'string', 'style must be a string');
  invariant_1(typeof iconName === 'string', 'icon name must be a string');

  return this.client({
    path: API_STYLES_SPRITE_ICON,
    params: {
      owner: this.owner,
      styleid: styleid,
      iconName: iconName
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Embed a style.
 *
 * @param {string} styleid the id for an existing style
 * @param {Object} options optional params
 * @param {boolean} [options.title=false] If true, shows a title box in upper right
 * corner with map title and owner
 * @param {boolean} [options.zoomwheel=true] Disables zooming with mouse scroll wheel
 * @returns {string} URL of style embed page
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * var url = client.embedStyle('style-id');
 */
MapboxStyles.prototype.embedStyle = function (styleid, options) {
  invariant_1(typeof styleid === 'string', 'style must be a string');

  var params = {
    styleid: styleid,
    access_token: this.accessToken,
    owner: this.owner,
    title: false,
    zoomwheel: true
  };

  if (options) {
    if (options.title !== undefined) {
      invariant_1(typeof options.title === 'boolean', 'title must be a boolean');
      params.title = options.title;
    }
    if (options.zoomwheel !== undefined) {
      invariant_1(typeof options.zoomwheel === 'boolean', 'zoomwheel must be a boolean');
      params.zoomwheel = options.zoomwheel;
    }
  }

  return this.endpoint + uriTemplate.expand(API_STYLES_EMBED, params);
};
});

/*
 * polyline
 *
 * https://github.com/mapbox/polyline
 *
 * by John Firebaugh, Tom MacWright, and contributors
 * licensed under BSD 3-clause
 */

/*
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 * @module polyline
 */

var polyline = {};

function encode$1(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | coordinate & 0x1f) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function (coordinates, precision) {
    if (!coordinates.length) {
        return '';
    }

    var factor = Math.pow(10, precision || 5),
        output = encode$1(coordinates[0][0], factor) + encode$1(coordinates[0][1], factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i],
            b = coordinates[i - 1];
        output += encode$1(a[0] - b[0], factor);
        output += encode$1(a[1] - b[1], factor);
    }

    return output;
};

function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        flipped.push(coords[i].slice().reverse());
    }
    return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function (geojson, precision) {
    if (geojson && geojson.type === 'Feature') {
        geojson = geojson.geometry;
    }
    if (!geojson || geojson.type !== 'LineString') {
        throw new Error('Input must be a GeoJSON LineString');
    }
    return polyline.encode(flipped(geojson.coordinates), precision);
};

var polyline_1 = polyline;

/**
 * Given a list of markers, encode them for display
 * @param {Array<Object>} markers a list of markers
 * @returns {string} encoded markers
 * @private
 */
function encodeMarkers(markers) {
  return markers.map(function (marker) {
    invariant_location(marker);
    var size = marker.size || 'l';
    var symbol = marker.symbol || 'circle';
    return 'pin-' + size + '-' + symbol + '(' + marker.longitude + ',' + marker.latitude + ')';
  }).join(',');
}

var encodeMarkers_1 = encodeMarkers;

/**
 * Given a path and style, encode it for display
 * @param {Object} path an object of a path and style
 * @param {Object} path.geojson a GeoJSON LineString
 * @param {Object} [path.style={}] style parameters
 * @returns {string} encoded path as polyline
 * @private
 */
function encodePath(path) {
  invariant_1(path.geojson.type === 'LineString', 'path line must be a LineString');
  var encoded = polyline_1.fromGeoJSON(path.geojson);

  var style = '';
  if (path.style) {
    if (path.style.strokewidth !== undefined) style += '-' + path.style.strokewidth;
    if (path.style.strokecolor !== undefined) style += '+' + path.style.strokecolor;
  }
  return 'path' + style + '(' + encoded + ')';
}

var encodePath_1 = encodePath;

/**
 * Given a GeoJSON object, encode it for a static map.
 * @param {Object} geojson a geojson object
 * @returns {string} encoded geojson as string
 * @private
 */
function encodeGeoJSON(geojson) {
  var encoded = JSON.stringify(geojson);
  invariant_1(encoded.length < 4096, 'encoded GeoJSON must be shorter than 4096 characters long');
  return 'geojson(' + encoded + ')';
}

var encodeGeoJSON_1 = encodeGeoJSON;

var encode_overlay = {
	encodeMarkers: encodeMarkers_1,
	encodePath: encodePath_1,
	encodeGeoJSON: encodeGeoJSON_1
};

var _typeof$a = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var xtend$1 = xtend.extend;





/**
 * @class MapboxStatic
 */
var MapboxStatic = make_service('MapboxStatic');

var API_STATIC = '/styles/v1/{username}/{styleid}/static{+overlay}/{+xyzbp}/{width}x{height}{+retina}{?access_token,attribution,logo,before_layer}';
var API_STATIC_CLASSIC = '/v4/{mapid}{+overlay}/{+xyz}/{width}x{height}{+retina}{.format}{?access_token}';

/**
 * Determine a URL for a static map image, using the [Mapbox Static Map API](https://www.mapbox.com/api-documentation/#static).
 *
 * @param {string} username Mapbox username
 * @param {string} styleid Mapbox Style ID
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom map zoom level
 * @param {number} position.bearing map bearing in degrees between 0 and 360
 * @param {number} position.pitch map pitch in degrees between 0 (straight down, no pitch) and 60 (maximum pitch)
 *
 * @param {Object} options all map options
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 * @param {boolean} options.attribution controlling whether there is attribution on the image; defaults to true
 * @param {boolean} options.logo controlling whether there is a Mapbox logo on the image; defaults to true
 * @param {string} options.before_layer value for controlling where the overlay is inserted in the style
 *
 * @returns {string} static map url
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * var url = mapboxClient.getStaticURL('mapbox', 'streets-v10', 600, 400, {
 *   longitude: 151.22,
 *   latitude: -33.87,
 *   zoom: 11
 * }, {
 *   markers: [{ longitude: 151.22, latitude: -33.87 }],
 *   before_layer: 'housenum-label'
 * });
 * // url = https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-l-circle(151.22,-33.87)/151.22,-33.87,11/600x400?access_token=ACCESS_TOKEN&before_layer=housenum-label
 */
MapboxStatic.prototype.getStaticURL = function (username, styleid, width, height, position, options) {
  invariant_1(typeof username === 'string', 'username option required and must be a string');
  invariant_1(typeof styleid === 'string', 'styleid option required and must be a string');
  invariant_1(typeof width === 'number', 'width option required and must be a number');
  invariant_1(typeof height === 'number', 'height option required and must be a number');

  var defaults = {
    retina: ''
  };

  var xyzbp;

  if (position === 'auto') {
    xyzbp = 'auto';
  } else {
    invariant_location(position);
    xyzbp = position.longitude + ',' + position.latitude + ',' + position.zoom;
    if ('pitch' in position) {
      xyzbp += ',' + (position.bearing || 0) + ',' + position.pitch;
    } else if ('bearing' in position) {
      xyzbp += ',' + position.bearing;
    }
  }

  var userOptions = {};

  if (options) {
    invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$a(options)) === 'object', 'options must be an object');
    if (options.format) {
      invariant_1(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant_1(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encode_overlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encode_overlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encode_overlay.encodePath(options.path);
    }
    if ('attribution' in options) {
      invariant_1(typeof options.attribution === 'boolean', 'attribution must be a boolean');
      userOptions.attribution = options.attribution;
    }
    if ('logo' in options) {
      invariant_1(typeof options.logo === 'boolean', 'logo must be a boolean');
      userOptions.logo = options.logo;
    }
    if (options.before_layer) {
      invariant_1(typeof options.before_layer === 'string', 'before_layer must be a string');
      userOptions.before_layer = options.before_layer;
    }
  }

  var params = xtend$1(defaults, userOptions, {
    username: username,
    styleid: styleid,
    width: width,
    xyzbp: xyzbp,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate.expand(API_STATIC, params);
};

/**
 * Determine a URL for a static classic map image, using the [Mapbox Static (Classic) Map API](https://www.mapbox.com/api-documentation/pages/static_classic.html).
 *
 * @param {string} mapid a Mapbox map id in username.id form
 * @param {number} width width of the image
 * @param {number} height height of the image
 *
 * @param {Object|string} position either an object with longitude and latitude members, or the string 'auto'
 * @param {number} position.longitude east, west bearing
 * @param {number} position.latitude north, south bearing
 * @param {number} position.zoom zoom level
 *
 * @param {Object} options all map options
 * @param {string} [options.format=png] image format. can be jpg70, jpg80, jpg90, png32, png64, png128, png256
 * @param {boolean} [options.retina=false] whether to double image pixel density
 *
 * @param {Array<Object>} [options.markers=[]] an array of simple marker objects as an overlay
 * @param {Object} [options.geojson={}] geojson data for the overlay
 * @param {Object} [options.path={}] a path and
 * @param {Array<Object>} options.path.geojson data for the path as an array of longitude, latitude objects
 * @param {Array<Object>} options.path.style optional style definitions for a path
 *
 * @returns {string} static classic map url
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxStatic.prototype.getStaticClassicURL = function (mapid, width, height, position, options) {
  invariant_1(typeof mapid === 'string', 'mapid option required and must be a string');
  invariant_1(typeof width === 'number', 'width option required and must be a number');
  invariant_1(typeof height === 'number', 'height option required and must be a number');

  var defaults = {
    format: 'png',
    retina: ''
  };

  var xyz;

  if (position === 'auto') {
    xyz = 'auto';
  } else {
    invariant_location(position);
    xyz = position.longitude + ',' + position.latitude + ',' + position.zoom;
  }

  var userOptions = {};

  if (options) {
    invariant_1((typeof options === 'undefined' ? 'undefined' : _typeof$a(options)) === 'object', 'options must be an object');
    if (options.format) {
      invariant_1(typeof options.format === 'string', 'format must be a string');
      userOptions.format = options.format;
    }
    if (options.retina) {
      invariant_1(typeof options.retina === 'boolean', 'retina must be a boolean');
      userOptions.retina = options.retina;
    }
    if (options.markers) {
      userOptions.overlay = '/' + encode_overlay.encodeMarkers(options.markers);
    } else if (options.geojson) {
      userOptions.overlay = '/' + encode_overlay.encodeGeoJSON(options.geojson);
    } else if (options.path) {
      userOptions.overlay = '/' + encode_overlay.encodePath(options.path);
    }
  }

  var params = xtend$1(defaults, userOptions, {
    mapid: mapid,
    width: width,
    xyz: xyz,
    height: height,
    access_token: this.accessToken
  });

  if (params.retina === true) {
    params.retina = '@2x';
  }

  return this.endpoint + uriTemplate.expand(API_STATIC_CLASSIC, params);
};

var _static = MapboxStatic;

var tilesets = createCommonjsModule(function (module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };




/**
 * @class MapboxTilesets
 */
var MapboxTilesets = module.exports = make_service('MapboxTilesets');

var API_TILESETS_TILEQUERY = '/v4/{mapid}/tilequery/{longitude},{latitude}.json{?access_token,radius,limit}';
var API_TILESETS_LIST = '/tilesets/v1/{owner}{?access_token,limit}';

/**
 * Retrieve data about specific vector features at a specified location within a vector tileset
 *
 * @param {String} mapid Map ID of the tileset to query (eg. mapbox.mapbox-streets-v7)
 * @param {Array} position An array in the form [longitude, latitude] of the position to query
 * @param {Object} [options] optional options
 * @param {Number} options.radius Approximate distance in meters to query for features
 * @param {Number} options.limit Number of features between 1-50 to return
 * @param {Function} [callback] called with (err, results, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.tilequery('mapbox.mapbox-streets-v7', [-77, 38], {}, function(err, response) {
 *   console.log(response);
 * });
 */
MapboxTilesets.prototype.tilequery = function (mapid, position, options, callback) {
  invariant_1(typeof mapid === 'string', 'mapid must be a string');
  invariant_1((typeof position === 'undefined' ? 'undefined' : _typeof(position)) === 'object', 'position must be an array');
  invariant_1(position.length == 2, 'position must be an array of length 2');
  invariant_1(typeof position[0] === 'number' && typeof position[1] === 'number', 'position must be an array of two numbers');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  return this.client({
    path: API_TILESETS_TILEQUERY,
    params: {
      mapid: mapid,
      longitude: position[0],
      latitude: position[1],
      radius: options.radius,
      limit: options.limit
    },
    callback: callback
  });
};

/**
 * Retrieve all tilesets
 *
 * @param {Object} [options] optional options
 * @param {Number} options.limit Maximum Number of tilesets to return
 * @param {Function} [callback] called with (err, tilesets, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTilesets(function(err, tilesets) {
 *   console.log(tilesets);
 * });
 */
MapboxTilesets.prototype.listTilesets = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};

  return this.client({
    path: API_TILESETS_LIST,
    params: {
      owner: this.owner,
      limit: options.limit
    },
    callback: callback
  });
};
});

var tokens = createCommonjsModule(function (module) {




/**
 * @class MapboxTokens
 */
var MapboxTokens = module.exports = make_service('MapboxTokens');

var API_TOKENS_LIST = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_CREATE = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_UPDATE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_DELETE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_RETRIEVE = '/tokens/v2{?access_token}';
var API_TOKENS_LIST_SCOPES = '/scopes/v1/{owner}{?access_token}';

/**
 * To retrieve a listing of tokens for a particular account.
 *
 * @param {Function} [callback] called with (err, tokens, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTokens(function(err, tokens) {
 *   console.log(tokens);
 *   // [{ client: 'api'
 *   //  note: 'Default Public Token',
 *   //  usage: 'pk',
 *   //  id: 'TOKENID',
 *   //  default: true,
 *   //  scopes: ['styles:tiles','styles:read','fonts:read','datasets:read'],
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  token: 'pk.TOKEN' }]
 * });
 */
MapboxTokens.prototype.listTokens = function (callback) {
  return this.client({
    path: API_TOKENS_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a token
 *
 * @param {string} note Note attached to the token
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createToken('My top secret project', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createToken = function (note, scopes, callback) {
  invariant_1(typeof note === 'string', 'note must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      note: note
    },
    callback: callback
  });
};

/**
 * Create a temporary token
 *
 * @param {string} expires Time token expires in RFC 3339
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createTemporaryToken('2016-09-15T19:27:53.000Z', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createTemporaryToken = function (expires, scopes, callback) {
  invariant_1(typeof expires === 'string', 'expires must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      expires: expires
    },
    callback: callback
  });
};

/**
 * Update a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.updateTokenAuthorization('auth id', ["styles:read", "fonts:read"], function(err, updatedToken) {
 *   console.log(updatedToken);
 * });
 */
MapboxTokens.prototype.updateTokenAuthorization = function (authorization_id, scopes, callback) {
  invariant_1(typeof authorization_id === 'string', 'authorization_id must be a string');
  invariant_1(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_UPDATE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    entity: {
      scopes: scopes
    },
    method: 'patch',
    callback: callback
  });
};

/**
 * Delete a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteTokenAuthorization('auth id', function(err) {
 * });
 */
MapboxTokens.prototype.deleteTokenAuthorization = function (authorization_id, callback) {
  invariant_1(typeof authorization_id === 'string', 'authorization_id must be a string');

  return this.client({
    path: API_TOKENS_DELETE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Retrieve a token
 *
 * @param {string} access_token access token to check
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.retrieveToken('ACCESSTOKEN', function(err, tokenResponse) {
 *   console.log(tokenResponse);
 * });
 */
MapboxTokens.prototype.retrieveToken = function (access_token, callback) {
  invariant_1(typeof access_token === 'string', 'access_token must be a string');

  return this.client({
    path: API_TOKENS_RETRIEVE,
    params: {
      access_token: access_token
    },
    callback: callback
  });
};

/**
 * List scopes
 *
 * @param {Function} [callback] called with (err, scopes, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listScopes(function(err, scopes) {
 *   console.log(scopes);
 * });
 */
MapboxTokens.prototype.listScopes = function (callback) {
  return this.client({
    path: API_TOKENS_LIST_SCOPES,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};
});

var xtend$2 = xtend.extendMutable;














/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @param {Object} options additional options provided for configuration
 * @param {string} [options.endpoint=https://api.mapbox.com] location
 * of the Mapbox API pointed-to. This can be customized to point to a
 * Mapbox Atlas Server instance, or a different service, a mock,
 * or a staging endpoint. Usually you don't need to customize this.
 * @param {string} [options.account] account id to use for api
 * requests. If not is specified, the account defaults to the owner
 * of the provided accessToken.
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
var MapboxClient = make_service('MapboxClient');

// Combine all client APIs into one API for when people require()
// the main mapbox-sdk-js library.
xtend$2(MapboxClient.prototype, geocoding.prototype, surface.prototype, directions.prototype, matrix.prototype, matching.prototype, datasets.prototype, uploads.prototype, tilestats.prototype, styles.prototype, _static.prototype, tilesets.prototype, tokens.prototype);

MapboxClient.getUser = get_user;

var mapbox = MapboxClient;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var _typeof3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _typeof2(obj) {
  if (typeof Symbol === "function" && _typeof3(Symbol.iterator) === "symbol") {
    _typeof2 = function _typeof2(obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof3(obj);
    };
  } else {
    _typeof2 = function _typeof2(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof3(obj);
    };
  }return _typeof2(obj);
}

function _typeof$b(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof$b = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof$b = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof$b(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var degree = Math.PI / 180;

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

function createMat4() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
function transformVector(matrix, vector) {
  var result = transformMat4([], vector, matrix);
  scale(result, result, 1 / result[3]);
  return result;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function multiply$1(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$2(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function add$2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */

function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp$2(out, a, b, t) {
  var ax = a[0],
      ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$1 = function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
}();

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */

function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$2 = function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'viewport-mercator-project: assertion failed.');
  }
}

var PI = Math.PI;
var PI_4 = PI / 4;
var DEGREES_TO_RADIANS = PI / 180;
var RADIANS_TO_DEGREES = 180 / PI;
var TILE_SIZE = 512;
var EARTH_CIRCUMFERENCE = 40.03e6;
var DEFAULT_ALTITUDE = 1.5;
function zoomToScale(zoom) {
  return Math.pow(2, zoom);
}
function lngLatToWorld(_ref, scale) {
  var _ref2 = _slicedToArray(_ref, 2),
      lng = _ref2[0],
      lat = _ref2[1];

  assert(Number.isFinite(lng) && Number.isFinite(scale));
  assert(Number.isFinite(lat) && lat >= -90 && lat <= 90, 'invalid latitude');
  scale *= TILE_SIZE;
  var lambda2 = lng * DEGREES_TO_RADIANS;
  var phi2 = lat * DEGREES_TO_RADIANS;
  var x = scale * (lambda2 + PI) / (2 * PI);
  var y = scale * (PI - Math.log(Math.tan(PI_4 + phi2 * 0.5))) / (2 * PI);
  return [x, y];
}
function worldToLngLat(_ref3, scale) {
  var _ref4 = _slicedToArray(_ref3, 2),
      x = _ref4[0],
      y = _ref4[1];

  scale *= TILE_SIZE;
  var lambda2 = x / scale * (2 * PI) - PI;
  var phi2 = 2 * (Math.atan(Math.exp(PI - y / scale * (2 * PI))) - PI_4);
  return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
}
function getDistanceScales(_ref6) {
  var latitude = _ref6.latitude,
      longitude = _ref6.longitude,
      zoom = _ref6.zoom,
      scale = _ref6.scale,
      _ref6$highPrecision = _ref6.highPrecision,
      highPrecision = _ref6$highPrecision === void 0 ? false : _ref6$highPrecision;
  scale = scale !== undefined ? scale : zoomToScale(zoom);
  assert(Number.isFinite(latitude) && Number.isFinite(longitude) && Number.isFinite(scale));
  var result = {};
  var worldSize = TILE_SIZE * scale;
  var latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);
  var pixelsPerDegreeX = worldSize / 360;
  var pixelsPerDegreeY = pixelsPerDegreeX / latCosine;
  var altPixelsPerMeter = worldSize / EARTH_CIRCUMFERENCE / latCosine;
  result.pixelsPerMeter = [altPixelsPerMeter, -altPixelsPerMeter, altPixelsPerMeter];
  result.metersPerPixel = [1 / altPixelsPerMeter, -1 / altPixelsPerMeter, 1 / altPixelsPerMeter];
  result.pixelsPerDegree = [pixelsPerDegreeX, -pixelsPerDegreeY, altPixelsPerMeter];
  result.degreesPerPixel = [1 / pixelsPerDegreeX, -1 / pixelsPerDegreeY, 1 / altPixelsPerMeter];

  if (highPrecision) {
    var latCosine2 = DEGREES_TO_RADIANS * Math.tan(latitude * DEGREES_TO_RADIANS) / latCosine;
    var pixelsPerDegreeY2 = pixelsPerDegreeX * latCosine2 / 2;
    var altPixelsPerDegree2 = worldSize / EARTH_CIRCUMFERENCE * latCosine2;
    var altPixelsPerMeter2 = altPixelsPerDegree2 / pixelsPerDegreeY * altPixelsPerMeter;
    result.pixelsPerDegree2 = [0, -pixelsPerDegreeY2, altPixelsPerDegree2];
    result.pixelsPerMeter2 = [altPixelsPerMeter2, 0, altPixelsPerMeter2];
  }

  return result;
}
function getViewMatrix(_ref7) {
  var height = _ref7.height,
      pitch = _ref7.pitch,
      bearing = _ref7.bearing,
      altitude = _ref7.altitude,
      _ref7$center = _ref7.center,
      center = _ref7$center === void 0 ? null : _ref7$center,
      _ref7$flipY = _ref7.flipY,
      flipY = _ref7$flipY === void 0 ? false : _ref7$flipY;
  var vm = createMat4();
  translate(vm, vm, [0, 0, -altitude]);
  scale$1(vm, vm, [1, 1, 1 / height]);
  rotateX(vm, vm, -pitch * DEGREES_TO_RADIANS);
  rotateZ(vm, vm, bearing * DEGREES_TO_RADIANS);

  if (flipY) {
    scale$1(vm, vm, [1, -1, 1]);
  }

  if (center) {
    translate(vm, vm, negate$2([], center));
  }

  return vm;
}
function getProjectionParameters(_ref8) {
  var width = _ref8.width,
      height = _ref8.height,
      _ref8$altitude = _ref8.altitude,
      altitude = _ref8$altitude === void 0 ? DEFAULT_ALTITUDE : _ref8$altitude,
      _ref8$pitch = _ref8.pitch,
      pitch = _ref8$pitch === void 0 ? 0 : _ref8$pitch,
      _ref8$nearZMultiplier = _ref8.nearZMultiplier,
      nearZMultiplier = _ref8$nearZMultiplier === void 0 ? 1 : _ref8$nearZMultiplier,
      _ref8$farZMultiplier = _ref8.farZMultiplier,
      farZMultiplier = _ref8$farZMultiplier === void 0 ? 1 : _ref8$farZMultiplier;
  var pitchRadians = pitch * DEGREES_TO_RADIANS;
  var halfFov = Math.atan(0.5 / altitude);
  var topHalfSurfaceDistance = Math.sin(halfFov) * altitude / Math.sin(Math.PI / 2 - pitchRadians - halfFov);
  var farZ = Math.cos(Math.PI / 2 - pitchRadians) * topHalfSurfaceDistance + altitude;
  return {
    fov: 2 * Math.atan(height / 2 / altitude),
    aspect: width / height,
    focalDistance: altitude,
    near: nearZMultiplier,
    far: farZ * farZMultiplier
  };
}
function getProjectionMatrix(_ref9) {
  var width = _ref9.width,
      height = _ref9.height,
      pitch = _ref9.pitch,
      altitude = _ref9.altitude,
      nearZMultiplier = _ref9.nearZMultiplier,
      farZMultiplier = _ref9.farZMultiplier;

  var _getProjectionParamet = getProjectionParameters({
    width: width,
    height: height,
    altitude: altitude,
    pitch: pitch,
    nearZMultiplier: nearZMultiplier,
    farZMultiplier: farZMultiplier
  }),
      fov = _getProjectionParamet.fov,
      aspect = _getProjectionParamet.aspect,
      near = _getProjectionParamet.near,
      far = _getProjectionParamet.far;

  var projectionMatrix = perspective([], fov, aspect, near, far);
  return projectionMatrix;
}
function worldToPixels(xyz, pixelProjectionMatrix) {
  var _xyz2 = _slicedToArray(xyz, 3),
      x = _xyz2[0],
      y = _xyz2[1],
      _xyz2$ = _xyz2[2],
      z = _xyz2$ === void 0 ? 0 : _xyz2$;

  assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z));
  return transformVector(pixelProjectionMatrix, [x, y, z, 1]);
}
function pixelsToWorld(xyz, pixelUnprojectionMatrix) {
  var targetZ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var _xyz3 = _slicedToArray(xyz, 3),
      x = _xyz3[0],
      y = _xyz3[1],
      z = _xyz3[2];

  assert(Number.isFinite(x) && Number.isFinite(y), 'invalid pixel coordinate');

  if (Number.isFinite(z)) {
    var coord = transformVector(pixelUnprojectionMatrix, [x, y, z, 1]);
    return coord;
  }

  var coord0 = transformVector(pixelUnprojectionMatrix, [x, y, 0, 1]);
  var coord1 = transformVector(pixelUnprojectionMatrix, [x, y, 1, 1]);
  var z0 = coord0[2];
  var z1 = coord1[2];
  var t = z0 === z1 ? 0 : ((targetZ || 0) - z0) / (z1 - z0);
  return lerp$2([], coord0, coord1, t);
}

var IDENTITY = createMat4();

var Viewport = function () {
  function Viewport() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$viewMatrix = _ref.viewMatrix,
        viewMatrix = _ref$viewMatrix === void 0 ? IDENTITY : _ref$viewMatrix,
        _ref$projectionMatrix = _ref.projectionMatrix,
        projectionMatrix = _ref$projectionMatrix === void 0 ? IDENTITY : _ref$projectionMatrix;

    _classCallCheck(this, Viewport);

    this.width = width || 1;
    this.height = height || 1;
    this.scale = 1;
    this.pixelsPerMeter = 1;
    this.viewMatrix = viewMatrix;
    this.projectionMatrix = projectionMatrix;
    var vpm = createMat4();
    multiply$1(vpm, vpm, this.projectionMatrix);
    multiply$1(vpm, vpm, this.viewMatrix);
    this.viewProjectionMatrix = vpm;
    var m = createMat4();
    scale$1(m, m, [this.width / 2, -this.height / 2, 1]);
    translate(m, m, [1, -1, 0]);
    multiply$1(m, m, this.viewProjectionMatrix);
    var mInverse = invert(createMat4(), m);

    if (!mInverse) {
      throw new Error('Pixel project matrix not invertible');
    }

    this.pixelProjectionMatrix = m;
    this.pixelUnprojectionMatrix = mInverse;
    this.equals = this.equals.bind(this);
    this.project = this.project.bind(this);
    this.unproject = this.unproject.bind(this);
    this.projectPosition = this.projectPosition.bind(this);
    this.unprojectPosition = this.unprojectPosition.bind(this);
    this.projectFlat = this.projectFlat.bind(this);
    this.unprojectFlat = this.unprojectFlat.bind(this);
  }

  _createClass(Viewport, [{
    key: "equals",
    value: function equals(viewport) {
      if (!(viewport instanceof Viewport)) {
        return false;
      }

      return viewport.width === this.width && viewport.height === this.height && equals$2(viewport.projectionMatrix, this.projectionMatrix) && equals$2(viewport.viewMatrix, this.viewMatrix);
    }
  }, {
    key: "project",
    value: function project(xyz) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$topLeft = _ref2.topLeft,
          topLeft = _ref2$topLeft === void 0 ? true : _ref2$topLeft;

      var worldPosition = this.projectPosition(xyz);
      var coord = worldToPixels(worldPosition, this.pixelProjectionMatrix);

      var _coord = _slicedToArray(coord, 2),
          x = _coord[0],
          y = _coord[1];

      var y2 = topLeft ? y : this.height - y;
      return xyz.length === 2 ? [x, y2] : [x, y2, coord[2]];
    }
  }, {
    key: "unproject",
    value: function unproject(xyz) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$topLeft = _ref3.topLeft,
          topLeft = _ref3$topLeft === void 0 ? true : _ref3$topLeft,
          targetZ = _ref3.targetZ;

      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

      var y2 = topLeft ? y : this.height - y;
      var targetZWorld = targetZ && targetZ * this.pixelsPerMeter;
      var coord = pixelsToWorld([x, y2, z], this.pixelUnprojectionMatrix, targetZWorld);

      var _this$unprojectPositi = this.unprojectPosition(coord),
          _this$unprojectPositi2 = _slicedToArray(_this$unprojectPositi, 3),
          X = _this$unprojectPositi2[0],
          Y = _this$unprojectPositi2[1],
          Z = _this$unprojectPositi2[2];

      if (Number.isFinite(z)) {
        return [X, Y, Z];
      }

      return Number.isFinite(targetZ) ? [X, Y, targetZ] : [X, Y];
    }
  }, {
    key: "projectPosition",
    value: function projectPosition(xyz) {
      var _this$projectFlat = this.projectFlat(xyz),
          _this$projectFlat2 = _slicedToArray(_this$projectFlat, 2),
          X = _this$projectFlat2[0],
          Y = _this$projectFlat2[1];

      var Z = (xyz[2] || 0) * this.pixelsPerMeter;
      return [X, Y, Z];
    }
  }, {
    key: "unprojectPosition",
    value: function unprojectPosition(xyz) {
      var _this$unprojectFlat = this.unprojectFlat(xyz),
          _this$unprojectFlat2 = _slicedToArray(_this$unprojectFlat, 2),
          X = _this$unprojectFlat2[0],
          Y = _this$unprojectFlat2[1];

      var Z = (xyz[2] || 0) / this.pixelsPerMeter;
      return [X, Y, Z];
    }
  }, {
    key: "projectFlat",
    value: function projectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return xyz;
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xyz) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return xyz;
    }
  }]);

  return Viewport;
}();

function fitBounds(_ref) {
  var width = _ref.width,
      height = _ref.height,
      bounds = _ref.bounds,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 0 : _ref$padding,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? [0, 0] : _ref$offset;

  var _bounds = _slicedToArray(bounds, 2),
      _bounds$ = _slicedToArray(_bounds[0], 2),
      west = _bounds$[0],
      south = _bounds$[1],
      _bounds$2 = _slicedToArray(_bounds[1], 2),
      east = _bounds$2[0],
      north = _bounds$2[1];

  if (Number.isFinite(padding)) {
    var p = padding;
    padding = {
      top: p,
      bottom: p,
      left: p,
      right: p
    };
  } else {
    assert(Number.isFinite(padding.top) && Number.isFinite(padding.bottom) && Number.isFinite(padding.left) && Number.isFinite(padding.right));
  }

  var viewport = new WebMercatorViewport({
    width: width,
    height: height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });
  var nw = viewport.project([west, north]);
  var se = viewport.project([east, south]);
  var size = [Math.abs(se[0] - nw[0]), Math.abs(se[1] - nw[1])];
  var targetSize = [width - padding.left - padding.right - Math.abs(offset[0]) * 2, height - padding.top - padding.bottom - Math.abs(offset[1]) * 2];
  assert(targetSize[0] > 0 && targetSize[1] > 0);
  var scaleX = targetSize[0] / size[0];
  var scaleY = targetSize[1] / size[1];
  var offsetX = (padding.right - padding.left) / 2 / scaleX;
  var offsetY = (padding.bottom - padding.top) / 2 / scaleY;
  var center = [(se[0] + nw[0]) / 2 + offsetX, (se[1] + nw[1]) / 2 + offsetY];
  var centerLngLat = viewport.unproject(center);
  var zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));
  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom: zoom
  };
}

var WebMercatorViewport = function (_Viewport) {
  _inherits(WebMercatorViewport, _Viewport);

  function WebMercatorViewport() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        width = _ref.width,
        height = _ref.height,
        _ref$latitude = _ref.latitude,
        latitude = _ref$latitude === void 0 ? 0 : _ref$latitude,
        _ref$longitude = _ref.longitude,
        longitude = _ref$longitude === void 0 ? 0 : _ref$longitude,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === void 0 ? 0 : _ref$zoom,
        _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === void 0 ? 0 : _ref$pitch,
        _ref$bearing = _ref.bearing,
        bearing = _ref$bearing === void 0 ? 0 : _ref$bearing,
        _ref$altitude = _ref.altitude,
        altitude = _ref$altitude === void 0 ? 1.5 : _ref$altitude,
        nearZMultiplier = _ref.nearZMultiplier,
        farZMultiplier = _ref.farZMultiplier;

    _classCallCheck(this, WebMercatorViewport);

    width = width || 1;
    height = height || 1;
    var scale = zoomToScale(zoom);
    altitude = Math.max(0.75, altitude);
    var center = lngLatToWorld([longitude, latitude], scale);
    center[2] = 0;
    var projectionMatrix = getProjectionMatrix({
      width: width,
      height: height,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      nearZMultiplier: nearZMultiplier || 1 / height,
      farZMultiplier: farZMultiplier || 1.01
    });
    var viewMatrix = getViewMatrix({
      height: height,
      center: center,
      pitch: pitch,
      bearing: bearing,
      altitude: altitude,
      flipY: true
    });
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebMercatorViewport).call(this, {
      width: width,
      height: height,
      viewMatrix: viewMatrix,
      projectionMatrix: projectionMatrix
    }));
    _this.latitude = latitude;
    _this.longitude = longitude;
    _this.zoom = zoom;
    _this.pitch = pitch;
    _this.bearing = bearing;
    _this.altitude = altitude;
    _this.scale = scale;
    _this.center = center;
    _this.pixelsPerMeter = getDistanceScales(_assertThisInitialized(_assertThisInitialized(_this))).pixelsPerMeter[2];
    Object.freeze(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(WebMercatorViewport, [{
    key: "projectFlat",
    value: function projectFlat(lngLat) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return lngLatToWorld(lngLat, scale);
    }
  }, {
    key: "unprojectFlat",
    value: function unprojectFlat(xy) {
      var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.scale;
      return worldToLngLat(xy, scale);
    }
  }, {
    key: "getMapCenterByLngLatPosition",
    value: function getMapCenterByLngLatPosition(_ref2) {
      var lngLat = _ref2.lngLat,
          pos = _ref2.pos;
      var fromLocation = pixelsToWorld(pos, this.pixelUnprojectionMatrix);
      var toLocation = lngLatToWorld(lngLat, this.scale);
      var translate = add$2([], toLocation, negate$1([], fromLocation));
      var newCenter = add$2([], this.center, translate);
      return worldToLngLat(newCenter, this.scale);
    }
  }, {
    key: "getLocationAtPoint",
    value: function getLocationAtPoint(_ref3) {
      var lngLat = _ref3.lngLat,
          pos = _ref3.pos;
      return this.getMapCenterByLngLatPosition({
        lngLat: lngLat,
        pos: pos
      });
    }
  }, {
    key: "fitBounds",
    value: function fitBounds$$1(bounds) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var width = this.width,
          height = this.height;

      var _fitBounds2 = fitBounds(Object.assign({
        width: width,
        height: height,
        bounds: bounds
      }, options)),
          longitude = _fitBounds2.longitude,
          latitude = _fitBounds2.latitude,
          zoom = _fitBounds2.zoom;

      return new WebMercatorViewport({
        width: width,
        height: height,
        longitude: longitude,
        latitude: latitude,
        zoom: zoom
      });
    }
  }]);

  return WebMercatorViewport;
}(Viewport);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Geocoder = function (_Component) {
    _inherits$1(Geocoder, _Component);

    function Geocoder(props) {
        _classCallCheck$1(this, Geocoder);

        var _this = _possibleConstructorReturn$1(this, (Geocoder.__proto__ || Object.getPrototypeOf(Geocoder)).call(this));

        _this.debounceTimeout = null;
        _this.state = {
            results: [],
            showResults: false
        };

        _this.onChange = function (event) {
            var _this$props = _this.props,
                timeout = _this$props.timeout,
                queryParams = _this$props.queryParams,
                localGeocoder = _this$props.localGeocoder,
                limit = _this$props.limit,
                localOnly = _this$props.localOnly;

            var queryString = event.target.value;

            clearTimeout(_this.debounceTimeout);
            _this.debounceTimeout = setTimeout(function () {
                var localResults = localGeocoder ? localGeocoder(queryString) : [];
                var params = _extends({}, queryParams, { limit: limit - localResults.length });

                if (params.limit > 0 && !localOnly) {
                    _this.client.geocodeForward(queryString, params).then(function (res) {
                        _this.setState({
                            results: [].concat(_toConsumableArray(localResults), _toConsumableArray(res.entity.features))
                        });
                    });
                } else {
                    _this.setState({
                        results: localResults
                    });
                }
            }, timeout);
        };

        _this.onSelected = function (item) {
            var _this$props2 = _this.props,
                viewport = _this$props2.viewport,
                onSelected = _this$props2.onSelected,
                transitionDuration = _this$props2.transitionDuration,
                hideOnSelect = _this$props2.hideOnSelect,
                pointZoom = _this$props2.pointZoom;

            var newViewport = new WebMercatorViewport(viewport);
            var bbox = item.bbox,
                center = item.center;


            if (bbox) {
                newViewport = newViewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
            } else {
                newViewport = {
                    longitude: center[0],
                    latitude: center[1],
                    zoom: pointZoom
                };
            }

            var _newViewport = newViewport,
                longitude = _newViewport.longitude,
                latitude = _newViewport.latitude,
                zoom = _newViewport.zoom;


            onSelected(_extends({}, viewport, { longitude: longitude, latitude: latitude, zoom: zoom, transitionDuration: transitionDuration }), item);

            if (hideOnSelect) {
                _this.setState({ results: [] });
            }
        };

        _this.showResults = function () {
            _this.setState({ showResults: true });
        };

        _this.hideResults = function () {
            setTimeout(function () {
                _this.setState({ showResults: false });
            }, 300);
        };

        _this.client = new mapbox(props.mapboxApiAccessToken);
        return _this;
    }

    _createClass$1(Geocoder, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                results = _state.results,
                showResults = _state.showResults;
            var _props = this.props,
                formatItem = _props.formatItem,
                className = _props.className,
                inputComponent = _props.inputComponent,
                itemComponent = _props.itemComponent;


            var Input = inputComponent || 'input';
            var Item = itemComponent || 'div';

            return React.createElement(
                'div',
                { className: 'react-geocoder ' + className },
                React.createElement(Input, { onChange: this.onChange, onBlur: this.hideResults, onFocus: this.showResults }),
                showResults && !!results.length && React.createElement(
                    'div',
                    { className: 'react-geocoder-results' },
                    results.map(function (item, index) {
                        return React.createElement(
                            Item,
                            {
                                key: index, className: 'react-geocoder-item', onClick: function onClick() {
                                    return _this2.onSelected(item);
                                },
                                item: item
                            },
                            formatItem(item)
                        );
                    })
                )
            );
        }
    }]);

    return Geocoder;
}(Component);

Geocoder.propTypes = {
    timeout: PropTypes.number,
    queryParams: PropTypes.object,
    viewport: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
    transitionDuration: PropTypes.number,
    hideOnSelect: PropTypes.bool,
    pointZoom: PropTypes.number,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    formatItem: PropTypes.func,
    className: PropTypes.string,
    inputComponent: PropTypes.func,
    itemComponent: PropTypes.func,
    limit: PropTypes.number,
    localGeocoder: PropTypes.func,
    localOnly: PropTypes.bool
};

Geocoder.defaultProps = {
    timeout: 300,
    transitionDuration: 0,
    hideOnSelect: false,
    pointZoom: 16,
    formatItem: function formatItem(item) {
        return item.place_name;
    },
    queryParams: {},
    className: '',
    limit: 5
};

export default Geocoder;
//# sourceMappingURL=index.es.js.map
