import Route from '@ember/routing/route';
import NotFoundError from 'k19/utils/errors/not-found';

export default Route.extend({
  beforeModel() {
    throw new NotFoundError();
  },
});
