import { SENTRY_DSN, ENVIRONMENT } from '@env';
import * as Sentry from '@sentry/react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';

const release = ENVIRONMENT === 'production' ? getVersion() : ENVIRONMENT;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  enableAutoSessionTracking: true,
  debug: ENVIRONMENT === 'development',
  release: ['app', release].join('@'),
  dist: getBuildNumber(),
  beforeSend(e) {
    if (e.environment === 'development') {
      // console.error(JSON.stringify(e, null, 2));
      return null;
    } else return e;
  },
});
