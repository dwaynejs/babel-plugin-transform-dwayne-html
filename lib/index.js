var _ = require('lodash');
var parseDwayneHTML = require('parse-dwayne-html');
var babelTemplate = require('babel-template');

var template = babelTemplate('var VAR;\n\n');
var templateThis = babelTemplate('var VAR = this;\n\n');

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
        var uniqueThisUid = path.scope.generateUid('this');
        var parserOpts = _.assign({
          exportFunction: false,
          injectFirstScript: false,
          keepOriginal: true
        }, opts, {
          funcName: path.scope.generateUid(_.get(opts, 'funcName', 'func')),
          __tmplVar__: path.scope.generateUid('tmpl'),
          __keepScope__: node.tag.name === taggedHtmlScopelessFuncName,
          __thisUid__: uniqueThisUid
        });
        var parsed = parseDwayneHTML(value, parserOpts);

        path.replaceWithSourceString(parsed.html);
        path.insertBefore(
          template({
            VAR: t.identifier(parsed.tmplVar)
          })
        );

        if (parserOpts.keepOriginal) {
          path.insertBefore(
            template({
              VAR: t.identifier(parsed.funcName)
            })
          );
        }

        if (parserOpts.__keepScope__) {
          path.insertBefore(
            templateThis({
              VAR: t.identifier(uniqueThisUid)
            })
          );
        }
      }
    }
  };
};
