# less-interop

[![Build
status](https://travis-ci.org/chcokr/less-interop.svg)](https://travis-ci.org/chcokr/less-interop)
[![Coverage
Status](https://coveralls.io/repos/chcokr/less-interop/badge.svg?branch=master&service=github)](https://coveralls.io/github/chcokr/less-interop?branch=master)

Have you ever wanted to use variables from a LESS file directly in your JS code?
If you're like me (believe in CSS-in-JS, and use Bootstrap v3 a lot which is
written in LESS), there's a chance you've wanted to.
In my opinion, any non-trivial web design benefits from reusing/overriding all
the nicely thought-out variables defined by, say, Bootstrap, and often it makes
sense to have this take place within JS code.

**This library exposes a function that walks through a LESS abstract syntax tree
and extracts all observed variables into a format that can be easily consumed in
JS.**

Currently, all variables in Bootstrap v3.3.5's `variables.less`
file are successfully extracted.

I've tested this library with LESS v2.5.x.
As I'm not confident it will work well outside v2.5.x, for now I'm pinning down
the `peerDependencies` requirement to 2.5.x.
If you notice it works well with versions outside this range, please submit a
pull request.

## How to use

```JS
var less = require('less');

// `require('less-interop')` returns a function.
var importLessVars = require('less-interop');

// An actual LESS source code in string form.
var source = '@random-color: #123456';

// Special options to configure LESS's parser.
// For now, I'm just going to use the default configuration.
var parseOptions = {};

// `less.parse` asynchronously parses a LESS source code into an abstract syntax
// tree, which you can acquire inside the callback.
less.parse(source, parseOptions, function (err, tree) {
  
  // Finally this library comes into play.
  // The function returned by `require('less-interop')` takes in one argument.
  // This argument should be `tree.rules`.
  var importedVars = importLessVars(tree.rules);
  
  // The names of the LESS variables defined in the source code above will be
  // camel-cased and won't have the `@`, following JS convention.
  // eg) @random-color -> randomColor
  console.log(importedVars.randomColor); // will print '#123456'
});
```
