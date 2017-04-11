var _ = require('lodash');
var parseDwayneHTML = require('parse-dwayne-html');
var babelTemplate = require('babel-template');

var template = babelTemplate('var FUNC;\n\n');

module.exports = function (opts) {
  var t = opts.types;

  return {
    visitor: {
      TaggedTemplateExpression: function (path, state) {
        var node = path.node;
        var quasi = node.quasi;
        var taggedFuncName = state.opts.taggedFuncName || 'html';

        if (
          quasi.quasis.length !== 1
          || quasi.expressions.length
          || node.tag.name !== taggedFuncName
        ) {
          return;
        }

        var value = quasi.quasis[0].value.cooked;
        var unique = path.scope.generateUid('func');
        var parserOpts = _.assign({}, state.opts, {
          funcName: unique
        });

        path.replaceWithSourceString(
          parseDwayneHTML(value, parserOpts)
        );
        path.insertBefore(
          template({
            FUNC: t.identifier(unique)
          })
        );
      }
    }
  };
};
