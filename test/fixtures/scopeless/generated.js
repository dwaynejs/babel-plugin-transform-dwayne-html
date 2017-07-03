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