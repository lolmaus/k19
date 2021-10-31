import Route from '@ember/routing/route';
import NotFoundError from 'k19/utils/errors/not-found';

export default class NotFoundRoute extends Route {
  beforeModel(): never {
    throw new NotFoundError();
  }
}
