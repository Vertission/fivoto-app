import React, { useContext, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import _ from 'lodash';

import { Indicator, Header as LibraryHeader } from '../../../library';
import { COLOR } from '../../../library/Theme';

import { AD } from '../../../setup/apollo/schema/query';

import Header from './modules/ad/header';
import Carousel from './modules/ad/carousel';
import Details from './modules/ad/details';
import Fields from './modules/ad/fields';
import Description from './modules/ad/description';
import User from './modules/ad/user';

import ApolloError from '../../shared/apolloError';

import NotAvailable from './modules/ad/notAvailable';

export default function ({ route }) {
  ////////////////////////////////////
  const { setTabBarVisible } = useContext(
    require('../../navigation/tabs/search').TabBarVisibleContext,
  );
  useFocusEffect(
    useCallback(() => setTabBarVisible(false), [setTabBarVisible]),
  );
  ////////////////////////////////////

  const { data, loading, refetch, error } = useQuery(AD, {
    variables: { id: route.params.id },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        <LibraryHeader />
        <ApolloError refetch={refetch} error={error} />
      </React.Fragment>
    );
  else {
    const {
      id,
      type,
      photos,
      location,
      createdAt,
      title,
      price,
      fields,
      description,
      user,
    } = data.ad;

    if (!type) return <NotAvailable />;
    return (
      <React.Fragment>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              colors={[COLOR.PRIMARY]}
              onRefresh={refetch}
            />
          }>
          <Header id={id} />
          <Carousel photos={photos} />
          <Details
            location={location}
            createdAt={createdAt}
            title={title}
            price={price}
            negotiable={fields.negotiable}
          />
          <Fields fields={fields} />
          <Description description={description} />
          <User user={user} />
        </ScrollView>
      </React.Fragment>
    );
  }
}
