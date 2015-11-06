var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.weight1, 'bold');
  assert.deepEqual(importResult.weight2, 'normal');
};
