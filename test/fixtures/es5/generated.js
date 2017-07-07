var _tmpl, _mixin;

import { Block, Class, Each } from 'dwayne';

class MyBlock extends Block {
  static html = (_tmpl = [{
    type: "div",
    args: {
      "Class:active": (_mixin = function (_) {
        return _.active;
      }, _mixin.mixin = Class, _mixin.__source = "source.js:5:10", _mixin)
    },
    children: [{
      type: "#text",
      value: function (_) {
        return _.text;
      }
    }, {
      type: Each,
      args: {
        set: function (_) {
          return _.set;
        },
        item: "item",
        uid: function () {
          return item => item.id;
        },
        __source: "source.js:7:8"
      },
      children: [{
        type: "#text",
        value: function (_) {
          return _.item.value;
        }
      }]
    }]
  }], _tmpl.vars = ["active", "text", "set"], _tmpl);
}

export default MyBlock;