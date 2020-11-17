import { SENTRY_DSN, ENVIRONMENT, STAGE } from '@env';
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import { version } from '../../package.json';

const release =
  ENVIRONMENT === 'production'
    ? [_.dropRight(version.split('.')).join('.'), STAGE].join('-')
    : ENVIRONMENT;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  enableAutoSessionTracking: true,
  debug: ENVIRONMENT === 'development',
  release: ['app', release].join('@'),
});
