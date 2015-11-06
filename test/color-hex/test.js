var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.red, '#d9534f');
};
