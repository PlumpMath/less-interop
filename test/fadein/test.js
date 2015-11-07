var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.c, 'rgba(0, 0, 0, 0.7)');
};
