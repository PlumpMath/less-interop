var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.light, '#555555');
};
