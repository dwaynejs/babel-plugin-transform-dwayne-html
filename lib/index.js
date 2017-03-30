var parseDwayneHTML = require('parse-dwayne-html');

module.exports = function () {
  return {
    visitor: {
      'StringLiteral|TemplateLiteral': function (path, state) {
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

            value = node.quasis[0].value.raw;
          }

          path.replaceWithSourceString(parseDwayneHTML(value, state.opts));
        }
      }
    }
  };
};
