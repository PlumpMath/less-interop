var assert = require('assert');

module.exports = function (importResult) {
  assert.deepEqual(importResult.family,
    '"Helvetica Neue", Helvetica, Arial, sans-serif');
};
