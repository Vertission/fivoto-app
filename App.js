import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useNetInfo } from '@react-native-community/netinfo';
import { RootSiblingParent } from 'react-native-root-siblings';
import Amplify from 'aws-amplify';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import SyncStorage from 'sync-storage';

import NetworkModal from './shared/netWorkModal';

import ApolloProvider from './setup/apollo';
import Navigation from './navigation';
import amplifyConfig from './setup/amplify';
import './setup/sentry';

export default function App() {
  const [initialize, setInitialize] = useState(false);
  const { isConnected } = useNetInfo();

  let init = async () => {
    Amplify.configure(amplifyConfig);
    await SyncStorage.init();
    setInitialize(true);
    await analytics().logAppOpen(); // ANALYTIC
    crashlytics().log('App mounted.'); // CRASHLYTIC
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
