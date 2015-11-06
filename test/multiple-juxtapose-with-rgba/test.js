var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.shadow1, '0 1px 2px rgba(0, 0, 0, 0.6)');
};
