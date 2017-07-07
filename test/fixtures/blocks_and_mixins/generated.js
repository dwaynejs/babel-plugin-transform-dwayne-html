let _tmpl, _mixin;

import { Block, Class, Each } from 'dwayne';

class MyBlock extends Block {
  static html = (_tmpl = [{
    type: "div",
    args: {
      "Class:active": (_mixin = _ => _.active, _mixin.mixin = Class, _mixin.__source = "source.js:5:10", _mixin)
    },
    children: [{
      type: "#text",
      value: _ => _.text
    }, {
      type: Each,
      args: {
        set: _ => _.set,
        item: "item",
        uid: () => item => item.id,
        __source: "source.js:7:8"
      },
      children: [{
        type: "#text",
        value: _ => _.item.value
      }]
    }]
  }], _tmpl.vars = ["active", "text", "set"], _tmpl);
}

export default MyBlock;