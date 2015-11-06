var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.margin1, '10px 20px');
};
