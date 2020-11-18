import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { gql } from '@apollo/client';
import { format } from 'timeago.js';
import _ from 'lodash';
import SwipeableFlatList from 'react-native-swipeable-list';
import * as Sentry from '@sentry/react-native';

import {
  Header,
  Typography,
  Indicator,
  Sheet,
  Button,
  Container,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';
import styles from '../../library/Theme/styles';

import { useQueryMe } from '../../service/apollo/query/user';
import { useDeleteAd } from '../../service/apollo/mutation/ad';

import { dispatch } from '../post/modules/context';
import { client as apolloClient } from '../../service/apollo';
import { AD as QUERY_AD_SCHEMA } from '../../service/apollo/schema/query';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

const QUERY_ME = gql`
  query me {
    me {
      id
      publishedAds {
        id
        title
        photos
        price
        createdAt
      }
    }
  }
`;

export default function PublishedAds({ navigation }) {
  const deleteAdRef = useRef(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [
    profile,
    { loading: queryMeLoading, error: queryMeError, refetch: queryMeRefetch },
  ] = useQueryMe(QUERY_ME);
  const [deleteAd, { loading: deleteAdLoading }] = useDeleteAd(QUERY_ME);

  const deleteAdSheetActions = [
    {
      title: 'delete ad',
      onPress: () =>
        deleteAd(deleteAdId).then(async () => {
          deleteAdRef.current?.close();
        }),
      loading: deleteAdLoading,
      indicatorProps: { size: 'small' },
    },
  ];

  const QuickActions = (_, { id }) => {
    const _onPressDelete = () => {
      setDeleteAdId(id);
      deleteAdRef.current?.open();
    };

    const _onPressEdit = () => {
      setEditLoading(true);
      apolloClient
        .query({ query: QUERY_AD_SCHEMA, variables: { id } })
        .then(({ data }) => {
          dispatch('RESET_CONTEXT');
          const photos = data.ad.photos.map((photo) => {
            return { [photo]: { source: 'CLOUD' } };
          });
          dispatch('SET_CONTEXT', { ...data.ad, photos });
          setEditLoading(false);
          navigation.navigate('Post', { screen: 'Form' });
        })
        .catch((error) => {
          setEditLoading(false);
          Sentry.withScope(function (scope) {
            scope.setTag('func', 'quickActions:apolloClient');
            Sentry.captureException(error);
          });
        });
    };

    return (
      <View style={s.qaContainer}>
        <TouchableOpacity onPress={_onPressEdit} style={s.swipeableButton}>
          {editLoading ? (
            <Indicator.Activity color={COLOR.PRIMARY} />
          ) : (
            <Typography family="bold" color={COLOR.PRIMARY}>
              Edit
            </Typography>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={_onPressDelete} style={s.swipeableButton}>
          <Typography family="bold" color={COLOR.ERROR}>
            Delete
          </Typography>
        </TouchableOpacity>
      </View>
    );
  };

  if (queryMeLoading) return <Indicator.Loading />;
  else if (queryMeError)
    return (
      <React.Fragment>
        <Header />
        <ApolloScreenErrorHandler
          refetch={queryMeRefetch}
          error={queryMeError}
        />
      </React.Fragment>
    );
  else if (_.isEmpty(profile.publishedAds))
    return (
      <React.Fragment>
        <Header />
        <Container grow>
          <View style={s.emptyAdvertContainer}>
            <Typography variant="caption" color={COLOR.MUTED}>
              No ads published
            </Typography>
            <Button
              variant="contained"
              onPress={() => navigation.navigate('Post')}>
              post my ad
            </Button>
          </View>
        </Container>
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        <Header />
        <View style={s.contentContainerStyle}>
          <SwipeableFlatList
            keyExtractor={({ id }) => id}
            data={profile.publishedAds}
            renderItem={({ item }) => (
              <Card {...item} navigation={navigation} />
            )}
            maxSwipeDistance={160}
            renderQuickActions={({ index, item }) => QuickActions(index, item)}
            // contentContainerStyle={s.contentContainerStyle}
            shouldBounceOnMount={true}
          />
        </View>
        <Sheet modalizeRef={deleteAdRef} actions={deleteAdSheetActions} />
      </React.Fragment>
    );
}

function Card({ id, photos, title, createdAt, navigation }) {
  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.navigate('Search', { screen: 'Ad', params: { id } })
      }>
      <View style={s.cardContainer}>
        <Image
          source={{
            uri: photos[0],
          }}
          style={s.image}
        />
        <View style={s.content}>
          <View>
            <Typography>{title}</Typography>
          </View>
          <Typography
            variant="caption"
            align="right"
            color={COLOR.MUTED}
            style={s.date}>
            {format(createdAt)}
          </Typography>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

const s = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: SIZE.radius,
    flexDirection: 'row',
    height: 100,
    marginVertical: SIZE.margin / 2,
    width: '100%',
  },
  content: {
    justifyContent: 'space-between',
    padding: SIZE.padding / 3,
    width: '60%',
  },
  contentContainerStyle: {
    ...styles.container,
  },
  date: {
    marginTop: 'auto',
  },
  emptyAdvertContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  image: {
    borderBottomLeftRadius: SIZE.radius,
    borderTopLeftRadius: SIZE.radius,
    height: '100%',
    width: '40%',
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  swipeableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
});
