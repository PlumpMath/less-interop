var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.str, 'hello, world');
};
