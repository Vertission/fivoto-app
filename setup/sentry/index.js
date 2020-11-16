import { SENTRY_DSN } from '@env';
console.log('SENTRY_DSN', SENTRY_DSN);
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true,
  release: 'develop',
});
