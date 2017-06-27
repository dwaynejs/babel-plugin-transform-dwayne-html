import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

initApp([{
  type: Router,
  args: {
    routes: () => routes,
    __source: {
      file: "source.js",
      line: 6,
      column: 17
    }
  }
}], find('.root'));