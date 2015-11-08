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
  // ***This argument should be `tree.rules`.***
  var importedVars = importLessVars(tree.rules);
  
  // The names of the LESS variables defined in the source code above will be
  // camel-cased and won't have the `@`, following JS convention.
  // eg) @random-color -> randomColor
  console.log(importedVars.randomColor); // will print '#123456'
  
});
```

## Conversion rules/examples

Check out the following examples to see how LESS values will get converted in
JS.
Keep in mind that the primary goal here is to be able to use LESS variables
directly in CSS-in-JS scenarios as smoothly as possible.

### Colors will result in strings

LESS | JS
---- | ----
#000 | '#000'
#123456 | '#123456'
rgb(100, 100, 100) | '#646464'
rgba(100, 100, 100, 0.15) | 'rgba(100, 100, 100, 0.15)'
rgba(100, 100, 100, .15) | 'rgba(100, 100, 100, 0.15)'

### Numbers will result in numbers (duh)

LESS | JS
---- | ----
1.5 | 1.5

### Strings will result in strings (duh)

LESS | JS
---- | ----
"hello" | 'hello'
'hello' | 'hello'

### Quoted strings containing a whitespace will be quoted

LESS | JS
---- | ----
"hello world" | '"hello world"'

*Note:* strings that contain a whitespace but are not quoted will result in the
words being joined with a comma.
See the section "Multiple values being juxtaposed" below for an explanation.

LESS | JS
---- | ----
hello world | 'hello, world'

### Pixels will result in plain numbers

This is in accordance with React.js convention.

LESS | JS
---- | ----
18px | 18

### Percents will result in strings

LESS | JS
---- | ----
15% | '15%'

### Function calls will be statically evaluated.

LESS | JS
---- | ----
ceil(18.5) | 19
ceil(floor(18.5)) | 18
darken(#428bca, 6.5%) | '#337ab7'
darken(rgb(66, 139, 202), 6.5%) | '#337ab7'

### Math will be statically evaluated

LESS | JS
---- | ----
3 + 4 | 7
19px + 1 | 20
ceil(3.5px + 1) | 5

Remember that pixels will result in plain JS numbers.

### Variable references will be resolved

Variables that have been defined will be resolved to its value.

Throughout the following table, assume that `@x: 18.5` has already been defined.

LESS | JS
---- | ----
@x | 18.5
@x + 1 | 19.5
ceil(@x) | 19
ceil(@x + 1) | 20

### Everything not mentioned so far will be converted into strings

Probably/hopefully.
If you run into a buggy situation please submit an issue or a pull request!

LESS | JS
---- | ----
bold | 'bold'
block | 'block'
inherit | 'inherit'
underline | 'underline'

### Multiple values being juxtaposed

So this one is a bit complicated.

If all values in the list are strings, they will be joined with a comma.

LESS | JS
---- | ----
"Helvetica Neue", Helvetica, Arial, sans-serif | '"Helvetica Neue", Helvetica, Arial, sans-serif'

Otherwise, they will be joined with a whitespace.

LESS | JS
---- | ----
0 10px 20px 15px | '0 10px 20px 15px'
10px 20px | '10px 20px'
0 1px 0 #fff | '0 1px 0 #fff'
0 1px 2px rgba(0, 0, 0, .6) | '0 1px 2px rgba(0, 0, 0, 0.6)'

## A note about `@import`

This library tries to not care about imported LESS files.
The approach it chooses instead is this: if a file is imported, it is expected
that all of that file's rules are included in your abstract syntax tree as a
sub-root.
For example:

```
var importLessVars = require('less-interop');

importLessVars([
  {blah blah blah rule number one},
  {
    root: true,
    rules: [
      {blah blah blah rule from imported file}
    ]
  }
]);
```

In this case, all the variables in the sub-root will successfully get extracted.

How can you achieve this sub-root-style AST generation?
Check out [less-loader's
WebpackFileManager](https://github.com/webpack/less-loader/blob/v2.2.1/index.js#L86).
