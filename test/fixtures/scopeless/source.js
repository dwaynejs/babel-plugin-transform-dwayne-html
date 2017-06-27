import { initApp, find } from 'dwayne';
import { Router } from 'dwayne-router';
import routes from '../routes';

initApp(
  htmlScopeless`<Router routes="{routes}"/>`,
  find('.root')
);