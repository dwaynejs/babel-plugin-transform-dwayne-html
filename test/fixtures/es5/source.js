import { Block, Class, Each } from 'dwayne';

class MyBlock extends Block {
  static html = html`
    <div Class:active="{active}">
      {text}
      <Each set="{set}" item="item" uid="{(item) => item.id}">
        {item.value}
      </Each>
    </div>
  `;
}

export default MyBlock;