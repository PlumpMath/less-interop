var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.dark, '#337ab7');
};
