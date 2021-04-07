import React, { useRef, useEffect, useState } from 'react';

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

import { useSignOut } from '../../service/amplify/auth';
import { useQueryMe } from '../../service/apollo/query/user';

import VerificationRequired from './modules/verificationRequired';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

export default function User({ navigation, route }) {
  const signOutRef = useRef(null);

  const [signOut] = useSignOut();
  const [profile, { loading, client, error, refetch }] = useQueryMe();

  const _onPressLogout = async () => {
    await signOut();
    client.resetStore();
  };

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
      {!profile.email_verified && (
        <VerificationRequired email={profile.email} />
      )}
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
            navigation.navigate('EmailChange', { email: profile.email })
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
