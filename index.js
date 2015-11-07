var assign = require('lodash.assign');
var less = require('less');
var isString = require('lodash.isstring');

function convertLeafNode(v, variablesSoFar, nodesSoFar) {
  if (v.name && !v.args) {
    return variablesSoFar[v.name];
  }

  if (v.__proto__.type === 'Color') {
    return v.toCSS();
  }

  if (v.__proto__.type === 'Operation') {
    var evalResult = v.eval({
      isMathOn: function () {
        return true;
      }
    });
    return convertLessValueToJs(evalResult);
  }

  if (v.name && v.args) {
    var evaldArgs = v.args.map(function (arg) {
      var frameWithFunctionRegistry = {
        functionRegistry: less.functions.functionRegistry,
        variable: function (name) {
          return nodesSoFar[name];
        }
      };
      var evalCtx = {
        frames: [frameWithFunctionRegistry]
      };
      return arg.eval(evalCtx);
    });
    var functionCallResult =
      less.functions.functionRegistry.get(v.name).apply(this, evaldArgs);
    return convertLessValueToJs(functionCallResult, nodesSoFar);
  }

  if (!v.value) {
    return v;
  }

  if (isString(v.value) && v.value.charAt(0) === '#') {
    return v.value;
  }

  var unit = v.unit;
  if (unit &&
      unit.denominator &&
      unit.denominator.length === 0 &&
      unit.numerator[0] === 'px') {
    return v.value;
  }
  if (unit &&
      unit.denominator &&
      unit.denominator.length === 0 &&
      unit.numerator[0] === '%') {
    return v.value + '%';
  }
  if (unit &&
      unit.denominator && unit.denominator.length === 0 &&
      unit.numerator && unit.numerator.length === 0) {
    return v.value;
  }

  if (isString(v.value) && v.value.indexOf(' ') !== -1 && v.quote) {
    return v.quote + v.value + v.quote;
  }

  return v.value;
}

function convertLessValueToJs(v, variablesSoFar, nodesSoFar) {
  if (!v.value && Array.isArray(v) && v.length === 1) {
    return convertLeafNode(v[0], variablesSoFar, nodesSoFar);
  }

  if (v.value !== undefined && Array.isArray(v.value)) {
    var arr =
      handleValArrayWithMoreThanOneElem(v.value, variablesSoFar, nodesSoFar);

    if (!Array.isArray(arr)) {
      return arr;
    }

    if (arr.length === 1) {
      return arr[0];
    }

    var joinSeparator = ' ';
    if (arr.every(function (e) { return isString(e) })) {
      joinSeparator = ', ';
    }
    return arr.map(function (e) {
      if (Number.isFinite(e) && e !== 0) {
        return e + 'px';
      }
      return e;
    }).join(joinSeparator);
  }

  return convertLeafNode(v, variablesSoFar, nodesSoFar);
}

function handleValArrayWithMoreThanOneElem(val, variablesSoFar, nodesSoFar) {
  var arr = val.map(function (item) {
    var itemVal;

    if (item.value !== undefined) {
      itemVal = convertLessValueToJs(item.value, variablesSoFar, nodesSoFar);
    } else {
      itemVal = convertLessValueToJs(item, variablesSoFar, nodesSoFar);
    }

    if (Array.isArray(itemVal)) {
      return handleValArrayWithMoreThanOneElem(
        itemVal, variablesSoFar, nodesSoFar);
    }

    return itemVal;
  });

  if (arr.length === 1) {
    return arr[0];
  }

  return arr;
}

function extractFromRules(rules, variablesSoFar, nodesSoFar) {
  rules.forEach(function (rule) {
    if (rule.importedFilename) {
      var importedVars =
        extractFromRules(rule.root.rules, variablesSoFar, nodesSoFar);
      variablesSoFar = assign(variablesSoFar, importedVars);
    }

    if (rule.variable && rule.name && rule.value) {
      variablesSoFar[rule.name] =
        convertLessValueToJs(rule.value, variablesSoFar, nodesSoFar);
      nodesSoFar[rule.name] = rule;
    }
  });

  return variablesSoFar;
}

function lessVarNameToJsName(name) {
  var replaced = name.replace(/\-./g, function (match) {
    return match.charAt(1).toUpperCase();
  });
  return replaced.slice(1); // getting rid of the @
}

module.exports = function importLessVars(rules) {
  var lessVars = extractFromRules(rules, {}, {});

  var varsWithKeysRenamedToJsStyle = {};
  Object.keys(lessVars).forEach(function (key) {
    varsWithKeysRenamedToJsStyle[lessVarNameToJsName(key)] = lessVars[key];
  });

  return varsWithKeysRenamedToJsStyle
};
