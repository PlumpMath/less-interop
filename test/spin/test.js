var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.x, '#e3f0d8');
};
