import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'k19/config/environment';

export default class Application extends JSONAPIAdapter {
  namespace = config.apiNamespace;
  host = config.apiHost;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    application: Application;
  }
}
