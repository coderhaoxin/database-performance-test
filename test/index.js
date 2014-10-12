'use strict';

var equal = require('assert').equal,
  wrapper = require('..'),
  co = require('co');

describe('## thunkify-or-promisify', function() {
  describe('# thunkify', function() {
    it('function', function(done) {
      co(function * () {
        var delay = function(ms, cb) {
          setTimeout(cb(null, ms), ms);
        };

        delay = wrapper(delay, 'thunk');

        var ms = yield delay(10);

        equal(ms, 10);
      })(done);
    });

    it('object', function(done) {
      co(function * () {
        var ctx = {
          total: 0,
          count: function(num, cb) {
            this.total += num;
            var self = this;

            setImmediate(function() {
              cb(null, self.total);
            });
          }
        };

        wrapper(ctx, 'thunk');

        yield ctx.count(10);

        equal(ctx.total, 10);
      })(done);
    });
  });

  describe('# promisify', function() {
    it('function', function(done) {
      co(function * () {
        var delay = function(ms, cb) {
          setTimeout(cb(null, ms), ms);
        };

        delay = wrapper(delay);

        var ms = yield delay(10);

        equal(ms, 10);
      })(done);
    });

    it('object', function(done) {
      co(function * () {
        var ctx = {
          total: 0,
          count: function(num, cb) {
            this.total += num;
            var self = this;

            setImmediate(function() {
              cb(null, self.total);
            });
          }
        };

        wrapper(ctx);

        yield ctx.count(10);

        equal(ctx.total, 10);
      })(done);
    });
  });
});
