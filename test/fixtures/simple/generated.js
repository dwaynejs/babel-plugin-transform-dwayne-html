import { Block } from 'dwayne';

class MyBlock extends Block {
  static html = [{
    type: "div",
    children: [{
      type: "#text",
      value: "123"
    }]
  }];
}

export default MyBlock;