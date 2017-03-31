var _ = require('lodash');
var parseDwayneHTML = require('parse-dwayne-html');
var babelTemplate = require('babel-template');

var template = babelTemplate('var FUNC;\n\n');

module.exports = function (opts) {
  var t = opts.types;

  return {
    visitor: {
      Class: function (Path, state) {
        if (Path.node.__wasHandledByDwaynePlugin__) {
          return;
        }

        var toInsert;

        Path.traverse({
          'StringLiteral|TemplateLiteral': function (path) {
            var node = path.node;
            var parentPath = path.parentPath;
            var parentNode = parentPath
              ? parentPath.node
              : {};

            if (
              parentPath.isClassProperty()
              && parentNode.static
              && parentNode.key.name === 'template'
              && parentNode.value === node
            ) {
              var value = node.value;

              if (path.isTemplateLiteral()) {
                if (
                  node.quasis.length !== 1
                  || node.expressions.length
                ) {
                  return;
                }

                value = node.quasis[0].value.cooked;
              }

              var unique = Path.scope.generateUid('func');

              toInsert = unique;

              path.replaceWithSourceString(parseDwayneHTML(value, _.assign({}, state.opts, {
                funcName: unique
              })));
            }
          }
        });

        if (!toInsert) {
          return;
        }

        Path.insertBefore(template({
          FUNC: t.identifier(toInsert)
        }));

        Path.node.__wasHandledByDwaynePlugin__ = true;
      }
    }
  };
};
