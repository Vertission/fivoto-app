import React, { useRef, useState, useContext } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { format } from 'timeago.js';
import { Modalize } from 'react-native-modalize';
import _ from 'lodash';
import { Typography, Image, Carousel, Indicator } from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';

import { Context, dispatch } from './modules/context';

import Header from './modules/header.index';

import ApolloError from '../../shared/apolloError';

export default function Search() {
  const [search, setSearch] = useState(null);

  const { query, category, location, limit } = useContext(Context);
  const modalizeRef = useRef(null);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const { data, loading, refetch, error, fetchMore } = useQuery(SEARCH_QUERY, {
    variables: { offset: 0, limit, query, category, location },
    notifyOnNetworkStatusChange: true,
  });

  const _onEndReached = () => {
    setFetchMoreLoading(true);
    fetchMore({
      query: SEARCH_QUERY,
      variables: {
        offset: data.search.length,
        limit,
        query,
        category,
        location,
      },
    }).then(({ loading }) => {
      // NEXT: show ads finished message
      setFetchMoreLoading(loading);
    });
  };

  const _onRefresh = () => {
    refetch({
      variables: { offset: 0, limit, query, category, location },
    });
  };

  const _onErrorRefetch = () => {
    dispatch('SET_RESET');
    refetch();
  };

  if (error)
    return (
      <React.Fragment>
        <Header disabled={error} />
        <ApolloError refetch={_onErrorRefetch} error={error} />
      </React.Fragment>
    );
  else if (!loading && _.isEmpty(data?.search))
    return (
      // NEXT: IMPROVE NO ADS UI
      <View>
        <Header search={search} setSearch={setSearch} />
        <Typography
          align="center"
          color={COLOR.MUTED}
          style={{ marginTop: SIZE.margin * 2 }}>
          No ads found
        </Typography>
      </View>
    );
  return (
    <React.Fragment>
      <Header search={search} setSearch={setSearch} />
      <View>
        <Indicator.Progress
          indeterminate={fetchMoreLoading}
          width={SIZE.width}
        />
      </View>
      <FlatList
        data={data?.search}
        renderItem={({ item }) => (
          <Card {...item} modalizeRef={modalizeRef} setPhotos={setPhotos} />
        )}
        keyExtractor={(item) => item.id}
        onEndReached={_onEndReached}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            colors={[COLOR.PRIMARY]}
            onRefresh={_onRefresh}
          />
        }
        style={{ marginVertical: SIZE.margin / 2 }}
      />
      {/* PHOTOS PREVIEW  */}
      <Modalize
        modalStyle={s.modalizeModalStyle}
        ref={modalizeRef}
        adjustToContentHeight>
        <Carousel data={photos} />
      </Modalize>
    </React.Fragment>
  );
}

function Card({
  id,
  photos,
  title,
  price,
  createdAt,
  location,
  modalizeRef,
  setPhotos,
}) {
  const navigation = useNavigation();

  return (
    <View style={s.card}>
      <TouchableOpacity
        style={s.imageContainer}
        onPress={() => {
          setPhotos(photos);
          modalizeRef.current?.open();
        }}>
        <Image url={photos[0]} style={s.image} />
      </TouchableOpacity>
      <TouchableNativeFeedback
        onPress={() => navigation.navigate('Ad', { id })}>
        <View style={s.content}>
          <Typography variant="h6">{title}</Typography>
          <Typography style={s.price} variant="caption">
            {price}
          </Typography>
          <View style={s.bottom}>
            <Typography variant="caption" align="right" color={COLOR.MUTED}>
              {location.city}
            </Typography>
            <Typography variant="caption" align="right" color={COLOR.MUTED}>
              {format(createdAt)}
            </Typography>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const s = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  card: {
    backgroundColor: COLOR.WHITE,
    borderRadius: SIZE.radius,
    elevation: SIZE.elevation / 2,
    flexDirection: 'row',
    height: 100,
    marginHorizontal: SIZE.margin / 1.5,
    marginVertical: SIZE.margin / 3,
  },
  content: {
    padding: SIZE.padding / 2,
    width: '60%',
  },
  image: {
    borderBottomLeftRadius: SIZE.radius,
    borderTopLeftRadius: SIZE.radius,
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    height: '100%',
    width: '40%',
  },
  modalizeModalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  price: {
    color: COLOR.PRIMARY,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});

const SEARCH_QUERY = gql`
  query search(
    $offset: Int
    $limit: Int
    $query: String
    $category: categoryInput
    $location: locationInput
  ) {
    search(
      offset: $offset
      limit: $limit
      query: $query
      category: $category
      location: $location
    ) {
      id
      title
      price
      photos
      location {
        city
      }
      createdAt
    }
  }
`;
