var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.shadow1, '0 1px 0 #fff');
};
