import { SENTRY_DSN, ENVIRONMENT } from '@env';
import * as Sentry from '@sentry/react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import _ from 'lodash';

const release = ENVIRONMENT === 'production' ? getVersion() : ENVIRONMENT;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  enableAutoSessionTracking: true,
  debug: ENVIRONMENT === 'development',
  release: ['app', release].join('@'),
  dist: getBuildNumber(),
});
