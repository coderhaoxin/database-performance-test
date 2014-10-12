'use strict';

var promisify = require('native-promisify'),
  thunkify = require('thunkify');

module.exports = function(origin, type) {
  if (type === 'thunk') {
    if (typeof origin === 'function') {
      return thunkify(origin);
    }

    if (typeof origin === 'object') {
      return thunkifyObject(origin);
    }
  } else {
    // default: promisify
    if (typeof origin === 'function') {
      return promisify(origin);
    }

    if (typeof origin === 'object') {
      return promisifyObject(origin);
    }
  }
};

function thunkifyObject(obj) {
  for (var i in obj) {
    if (typeof obj[i] === 'function') {
      obj[i] = thunkify(obj[i]);
    }
  }

  return obj;
}

function promisifyObject(obj) {
  for (var i in obj) {
    if (typeof obj[i] === 'function') {
      obj[i] = promisify(obj[i]);
    }
  }

  return obj;
}
