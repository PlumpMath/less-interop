var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.color1, 'rgba(100, 100, 100, 0.15)');
};
