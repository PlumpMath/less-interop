var assert = require('assert');
var fs = require('fs');
var importVars = require('../index');
var less = require('less');
var path = require('path');

module.exports = function () {

  it('sub-root', function (done) {

    var randomLessFile1 = path.join(__dirname, 'ceil-number', 'index.less');
    var randomLessFile2 = path.join(__dirname, 'color-hex', 'index.less');

    var source1 = fs.readFileSync(randomLessFile1, {encoding: 'utf8'});
    var source2 = fs.readFileSync(randomLessFile2, {encoding: 'utf8'});

    less.parse(source1, {}, function (err, tree1) {
      if (err) {
        done(err);
      }

      less.parse(source2, {}, function (err, tree2) {
        if (err) {
          done(err);
        }

        tree1.rules.push(tree2);

        var importResult = importVars(tree1.rules);

        assert.deepEqual(importResult.fontsize, 19);
        assert.deepEqual(importResult.red, '#d9534f');

        done();
      });
    });

  });

};
