import EmberRouter from '@ember/routing/router';
import config from 'k19/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// eslint-disable-next-line array-callback-return
Router.map(function () {
  this.route('not-found', {
    path: '/*wildcard',
  });
});
