var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.lineheight, 1.428571429);
};
