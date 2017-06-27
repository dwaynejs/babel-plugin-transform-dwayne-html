import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

function startApp() {
  initApp(htmlScopeless`<Router routes="{this}"/>`, find('.root'));
}

startApp.call(routes);