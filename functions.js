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
