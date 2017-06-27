const _ = require('lodash');
const transformDwayneHtml = require('transform-dwayne-html');
const { default: LinesAndColumns } = require('lines-and-columns');

module.exports = ({ types: t }) => ({
  visitor: {
    Program(path, state) {
      state.file.__dwayneLines__ = new LinesAndColumns(state.file.code);
    },
    TaggedTemplateExpression(path, state) {
      const {
        opts: options,
        file: {
          __dwayneLines__,
          code,
          log: { filename }
        }
      } = state;

      options.unscopables = _.get(options, 'unscopables', ['require']);
      options.useES6 = !!_.get(options, 'useES6', true);

      const taggedHtmlFuncName = _.get(options, 'taggedHtmlFuncName', 'html');
      const taggedHtmlScopelessFuncName = _.get(options, 'taggedHtmlScopelessFuncName', 'htmlScopeless');
      const {
        quasi: {
          start,
          quasis,
          expressions
        },
        tag: { name }
      } = path.node;

      if (
        quasis.length !== 1
        || expressions.length
        || (name !== taggedHtmlFuncName && name !== taggedHtmlScopelessFuncName)
      ) {
        return;
      }

      const isScopeless = name === taggedHtmlScopelessFuncName;
      const tmplVarName = generateScopeVar('_tmpl', path, options);
      const mixinVarName = generateScopeVar('_mixin', path, options);
      const thisVarName = isScopeless && generateScopeVar('_this', path, options);
      const lines = __dwayneLines__ || /* istanbul ignore next */ new LinesAndColumns(code);
      const loc = lines.locationForIndex(start + 1);
      const transformerOpts = _.assign({}, options, {
        filename,
        sourceType: 'embed',
        inputSourceMap: null,
        startLine: loc.line + 1,
        startColumn: loc.column,
        startPosition: start + 1,
        tmplVarName,
        mixinVarName,
        thisVarName,
        keepScope: isScopeless
      });
      const transformed = transformDwayneHtml(quasis[0].value.cooked, transformerOpts);

      path.replaceWithSourceString(transformed.code);

      if (transformed.generatedTmplVar) {
        path.scope.push({
          id: t.identifier(tmplVarName),
          kind: options.useES6
            ? 'let'
            : 'var'
        });
      }

      if (transformed.generatedMixinVar) {
        path.scope.push({
          id: t.identifier(mixinVarName),
          kind: options.useES6
            ? 'let'
            : 'var'
        });
      }

      if (transformed.generatedThisVar) {
        path.scope.push({
          id: t.identifier(thisVarName),
          init: t.thisExpression(),
          kind: 'var'
        });
      }
    }
  }
});

function generateScopeVar(name, path, options) {
  let varName;

  do {
    varName = path.scope.generateUid(name);
  } while (options.unscopables.indexOf(varName) !== -1);

  return varName;
}
