import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

function startApp() {
  var _this = this;

  initApp([{
    type: Router,
    args: {
      routes: function () {
        return _this;
      },
      __source: "source.js:6:25"
    }
  }], find('.root'));
}

startApp.call(routes);