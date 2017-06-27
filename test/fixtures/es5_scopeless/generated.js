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
      __source: {
        file: "source.js",
        line: 6,
        column: 25
      }
    }
  }], find('.root'));
}

startApp.call(routes);