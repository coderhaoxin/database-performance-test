'use strict';

var equal = require('assert').deepEqual,
  wrapper = require('..'),
  co = require('co');

describe('## thunkify-or-promisify', function() {
  describe('# thunkify', function() {
    it('function', function(done) {
      co(function * () {
        var d = wrapper(delay, 'thunk');
        var ms = yield d(10);

        equal(ms, 10);
      }).then(done, done);
    });

    it('object', function(done) {
      co(function * () {
        var ctx = newObject();

        wrapper(ctx, 'thunk');

        yield ctx.count(10);

        equal(ctx.total, 10);
      }).then(done, done);
    });

    it('object - ignore', function(done) {
      co(function * () {
        var ctx = newObject('ignore');

        wrapper(ctx, 'thunk', ['delay']);

        yield ctx.count(10);

        equal(ctx.total, 10);
      }).then(done, done);
    });
  });

  describe('# promisify', function() {
    it('function', function(done) {
      co(function * () {
        var d = wrapper(delay);
        var ms = yield d(10);

        equal(ms, 10);
      }).then(done, done);
    });

    it('object', function(done) {
      co(function * () {
        var ctx = newObject();

        wrapper(ctx);

        yield ctx.count(10);

        equal(ctx.total, 10);
      }).then(done, done);
    });

    it('object - ignore', function(done) {
      co(function * () {
        var ctx = newObject('ignore');

        wrapper(ctx, ['delay']);

        yield ctx.count(10);

        equal(ctx.total, 10);

        equal(typeof ctx.count(10).then, 'function');
        equal(typeof ctx.delay(noop), 'undefined');
      }).then(done, done);
    });

    it('object - type, ignore', function(done) {
      co(function * () {
        var ctx = newObject('ignore');

        wrapper(ctx, 'promise', ['delay']);

        yield ctx.count(10);

        equal(ctx.total, 10);

        equal(typeof ctx.count(10).then, 'function');
        equal(typeof ctx.delay(noop), 'undefined');
      }).then(done, done);
    });
  });
});

function noop() {}

function delay(ms, cb) {
  setTimeout(cb(null, ms), ms);
}

function newObject(type) {
  var obj = {
    total: 0,
    count: function(num, cb) {
      this.total += num;
      var self = this;

      setImmediate(function() {
        cb(null, self.total);
      });
    }
  };

  var ctx = {
    total: 0,
    delay: function(cb) {
      setTimeout(function() {
        cb();
      }, 5);
    },
    count: function(num, cb) {
      this.total += num;
      var self = this;

      this.delay(function() {
        cb(null, self.total);
      });
    }
  };

  return !!type ? ctx : obj;
}
