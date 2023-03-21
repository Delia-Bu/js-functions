// debounce

function debounce(callback, delay, immediate = false) {
  let timerID;

  return function (...args) {
    clearTimeout(timerID);

    const shouldCallImmediately = timerID == null && immediate;
    if (shouldCallImmediately) {
      callback.apply(this, args);
    }

    timerID = setTimeout(() => {
      if (!immediate) {
        // bind the keyword of this in the callback function
        callback.apply(this, args);
      }
      timerID = null;
    }, delay);
  };
}

// Throttle

// throttle takes in a callback and returns a new function (throttled version of the callback )
// limits how often it can be called, once per delay period

function throttle(callback, delay) {
  let lastCalledTime = 0; //for the first case
  let timerID;

  const throttledFunction = function (...args) {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCalledTime;
    const delayRemaining = delay - timeSinceLastCall;
    // Two cases:
    // 1. when the delay has been completed, we are not currently waiting for delay => we call callback

    if (delayRemaining <= 0) {
      lastCalledTime = currentTime;
      callback.apply(this, args);
    } else {
      // 2. we have recently called the callback and need to wait delay ms until calling it again
      clearTimeout(timerID);
      timerID = setTimeout(() => {
        lastCalledTime = Date.now();
        callback.apply(this, args);
      }, delayRemaining);
    }
  };

  // functions are objects, so we can add methods to them
  throttledFunction.cancel = function () {
    clearTimeout(timerID);
    // prevent callback from firing
  };
  return throttledFunction;
}

// Curry
// takes in a callback function and it returns a curried version of that function
// the curried func will work the same, with the diff that the curried func can take in the arguments on at a time as a chain of function calls or multiple at any time
// if no args are passed, we need to call the callback

function curry(callback) {
  // we don't need this binding
  const curriedCallback = (...args) => {
    if (args.length === 0) {
      return callback();
    }
    return (...otherArgs) => {
      if (otherArgs.length === 0) {
        return callback(...args);
      }
      return curriedCallback(...args, ...otherArgs);
    };
  };

  return curriedCallback;
}

// memoize
// in the event we call the function with the same parameteres, instead of calling the callback twice, the second time we use the original return value
// resolve take in the arguments

function memoize(callback, resolver) {
  const cache = new Map(); //we use map instead of object so we can have any type as possible keys

  function getCacheKey(args) {
    return resolver != null ? resolver(...args) : JSON.stringify(args);
  }

  const memoized = function (...args) {
    // check if we have called the funtion before with the same args based on the resolver
    const cacheKey = getCacheKey(args);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    // if the cache doesn't have the key, we call the callback with tthe args and save the output
    const output = callback(...args);
    cache.set(cacheKey, output);
    return output;
  };

  //add few methods on our memoized function
  memoized.clear = function () {
    cache.clear();
  };
  memoized.delete = function (...args) {
    const cacheKey = getCacheKey(args);
    cache.delete(cacheKey);
  };
  memoized.has = function (...args) {
    const cacheKey = getCacheKey(args);
    return cache.has(cacheKey); //returns boolean
  };
  return memoized;
}
