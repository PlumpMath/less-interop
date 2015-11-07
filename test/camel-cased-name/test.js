var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.fontSizeLarge, 1);
};
