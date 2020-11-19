import { ENVIRONMENT } from '@env';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useNetInfo } from '@react-native-community/netinfo';
import { RootSiblingParent } from 'react-native-root-siblings';
import Amplify from 'aws-amplify';
import * as Sentry from '@sentry/react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import SyncStorage from 'sync-storage';

import NetworkModal from './shared/netWorkModal';

import ApolloProvider from './service/apollo';
import Navigation from './navigation';
import amplifyConfig from './service/amplify';
import './service/sentry';

export default function App() {
  const [initialize, setInitialize] = useState(false);
  const { isConnected } = useNetInfo();

  let init = async () => {
    Amplify.configure(amplifyConfig);
    await SyncStorage.init();

    await analytics().setAnalyticsCollectionEnabled(
      ENVIRONMENT === 'production',
    );
    await analytics().logAppOpen();

    if (SyncStorage.get('@user_id')) {
      analytics().setUserId(SyncStorage.get('@user_id'));
      Sentry.setUser({
        id: SyncStorage.get('@user_id'),
        email: SyncStorage.get('@user_email'),
      });
    } else await analytics().setUserId(null);

    crashlytics().log('App mounted.');
    setInitialize(true);
  };

  useEffect(() => {
    init().finally(() => {
      RNBootSplash.hide({ duration: 250 });
    });
  }, []);

  if (initialize)
    return (
      <React.Fragment>
        <RootSiblingParent>
          <ApolloProvider>
            <Navigation />
          </ApolloProvider>
        </RootSiblingParent>
        <NetworkModal isConnected={isConnected} />
      </React.Fragment>
    );
  else return null;
}
