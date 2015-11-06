var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.color1, '#646464');
};
