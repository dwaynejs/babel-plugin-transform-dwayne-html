# babel-plugin-transform-dwayne-html

Babel plugin for transforming html tagged expressions into
Dwayne-compatible js.

It's recommended to use [babel-preset-dwayne](https://github.com/dwaynejs/babel-preset-dwayne)
instead of the plugin itself.

### Examples

##### With scope

Input:

```js
const tmpl = html`
  <div Class:active={active}>
    {text}
    <OtherBlock/>
  </div>
`;
```

Output:

```js
let _tmpl, _mixin;

const tmpl = (_tmpl = [{
  type: "div",
  args: {
    "Class:active": (_mixin = _ => _.active, _mixin.mixin = Class, _mixin)
  },
  children: [{
    type: "#text",
    value: _ => _.text
  }, {
    type: OtherBlock,
    args: {
      __source: "source.js:4:5"
    }
  }]
}], _tmpl.vars = ["active", "text"], _tmpl);
```

##### Scopeless

Input:

```js
import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

initApp(
  htmlScopeless`<Router routes="{routes}"/>`,
  find('.root')
);
```

Output:

```js
import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

initApp([{
  type: Router,
  args: {
    routes: () => routes,
    __source: "source.js:6:17"
  }
}], find('.root'));
```

### Options

The plugin has two options:

* `options.taggedHtmlFuncName` (default: `'html'`): html tag function
name.
* `options.taggedHtmlScopelessFuncName` (default: `'htmlScopelss'`):
scopeless html tag function name.

### Transformer

It's similar to [transform-dwayne-js](https://github.com/dwaynejs/transform-dwayne-js),
but for babel and html expressions only.

All the options passed to the plugin are passed to the
[transformer](https://github.com/dwaynejs/transform-dwayne-html) itself.

By default the plugin sets `options.useES6` to true.
