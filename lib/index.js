var _ = require('lodash');
var parseDwayneHTML = require('parse-dwayne-html');
var babelTemplate = require('babel-template');

var template = babelTemplate('var VAR;\n\n');

module.exports = function (opts) {
  var t = opts.types;

  return {
    visitor: {
      TaggedTemplateExpression: function (path, state) {
        var node = path.node;
        var quasi = node.quasi;
        var opts = state.opts;
        var taggedHtmlFuncName = opts.taggedHtmlFuncName || 'html';
        var taggedHtmlScopelessFuncName = opts.taggedHtmlScopelessFuncName || 'htmlScopeless';

        if (
          quasi.quasis.length !== 1
          || quasi.expressions.length
          || (node.tag.name !== taggedHtmlFuncName && node.tag.name !== taggedHtmlScopelessFuncName)
        ) {
          return;
        }

        var value = quasi.quasis[0].value.cooked;
        var unique = path.scope.generateUid(_.get(opts, 'funcName', 'func'));
        var uniqueThisUid = path.scope.generateUid('this');
        var parserOpts = _.assign({}, opts, {
          funcName: unique,
          __keepScope__: node.tag.name === taggedHtmlScopelessFuncName,
          __thisUid__: uniqueThisUid
        });

        path.replaceWithSourceString(
          parseDwayneHTML(value, parserOpts)
        );
        path.insertBefore(
          template({
            VAR: t.identifier(unique)
          })
        );
        path.insertBefore(
          template({
            VAR: t.identifier(uniqueThisUid)
          })
        );
      }
    }
  };
};
