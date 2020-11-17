// import { SENTRY_DSN, ENVIRONMENT, STAGE } from '@env';
import * as Sentry from '@sentry/react-native';
// import SyncStorage from 'sync-storage';
import _ from 'lodash';

import { version } from '../../package.json';

// const release =
//   ENVIRONMENT === 'production'
//     ? [_.dropRight(version.split('.')).join('.'), STAGE].join('-')
//     : ENVIRONMENT;

// Sentry.init({
//   dsn: SENTRY_DSN,
//   maxBreadcrumbs: 150,
//   environment: ENVIRONMENT,
//   debug: false,
//   release: ['app', release].join('@'),
// });

// Sentry.setUser({
//   id: SyncStorage.get('@user_id'),
//   email: SyncStorage.get('@user_email'),
// });

Sentry.init({
  dsn:
    'https://24d2cbe4b8e74cefba064f62aa3a947d@o468316.ingest.sentry.io/5519270',
  environment: process.env.NODE_ENV,
  enableAutoSessionTracking: true,
  release: version,
  dist: 5,
  debug: true,
});
