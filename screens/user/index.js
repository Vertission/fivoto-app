import React, { useRef, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import * as Sentry from '@sentry/react-native';

import {
  Container,
  Typography,
  Tab,
  Indicator,
  Icon,
  Sheet,
  Header,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';

import { useSignOut } from '../../setup/amplify/auth';
import { useQueryMe } from '../../setup/apollo/query/user';

import VerificationRequired from './modules/verificationRequired';

import ApolloScreenErrorHandler from '../../setup/apollo/errorHandler/screen';

export default function User({ navigation, route }) {
  const signOutRef = useRef(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [currentEmail, setCurrentEmail] = useState(null);

  const [signOut] = useSignOut();
  const [profile, { loading, client, error, refetch }] = useQueryMe();

  const _onPressLogout = async () => {
    await signOut();
    client.resetStore();
  };

  useEffect(() => {
    const callCurrentUser = () =>
      Auth.currentUserInfo()
        .then((res) => {
          if (res?.attributes) {
            setCurrentEmail(res?.attributes.email);
            setIsEmailVerified(res?.attributes.email_verified);
          }
        })
        .catch((error) => {
          Sentry.withScope(function (scope) {
            scope.setTag('func', 'callCurrentUser');
            Sentry.captureException(error);
          });
        });

    callCurrentUser();

    return () => {
      setCurrentEmail(null);
      setIsEmailVerified(null);
    };
  }, [route.params]);

  const signOutSheetAction = [{ title: 'sign out', onPress: _onPressLogout }];

  const ComponentHeader = (
    <Header
      title={profile?.name}
      backSpace={false}
      endContent={
        <Icon
          name="log-out"
          size={SIZE.icon * 1.5}
          touch
          onPress={() => signOutRef.current?.open()}
        />
      }
    />
  );

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        {ComponentHeader}
        <ApolloScreenErrorHandler refetch={refetch} error={error} />
        <Sheet modalizeRef={signOutRef} actions={signOutSheetAction} />
      </React.Fragment>
    );
  return (
    <React.Fragment>
      {ComponentHeader}
      {!isEmailVerified && <VerificationRequired email={currentEmail} />}
      <Container>
        {/* AD  */}
        <Typography variant="caption" family="bold" color={COLOR.MUTED}>
          Ad
        </Typography>
        <Tab onPress={() => navigation.navigate('PublishedAds')}>
          published ads
        </Tab>
        {/* ACCOUNT  */}
        <Typography variant="caption" family="bold" color={COLOR.MUTED}>
          Account
        </Typography>
        <Tab onPress={() => navigation.navigate('EditProfile', { profile })}>
          edit profile
        </Tab>
        <Tab
          onPress={() =>
            navigation.navigate('EmailChange', { email: currentEmail })
          }>
          change email address
        </Tab>
        <Tab onPress={() => navigation.navigate('PasswordChange')}>
          change password
        </Tab>
      </Container>
      <Sheet modalizeRef={signOutRef} actions={signOutSheetAction} />
    </React.Fragment>
  );
}
