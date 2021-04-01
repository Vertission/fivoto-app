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
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import { Typography, Image, Carousel, Indicator, Button } from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { Context, dispatch } from './modules/context';

import Header from './modules/header.index';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

import schema from '../../service/apollo/schema';

export default function Search() {
  const [search, setSearch] = useState(null);

  const { query, category, location, first } = useContext(Context);
  const modalizeRef = useRef(null);
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const { data, loading, refetch, error, fetchMore } = useQuery(
    schema.query.ADS,
    {
      variables: {
        first,
        filter: {
          query,
          location: {
            district: location.district,
            city: location.city,
          },
          category: {
            field: category.field,
            item: category.item,
          },
        },
      },
      notifyOnNetworkStatusChange: true,
      onError(error) {
        Sentry.withScope(function (scope) {
          scope.setTag('func', 'search:SEARCH_QUERY');
          scope.setLevel(Sentry.Severity.Fatal);
          Sentry.captureException(error);
        });
      },
    },
  );

  const _onRefresh = () => {
    refetch({
      variables: {
        first,
        filter: {
          query,
          location: {
            district: location.district,
            city: location.city,
          },
          category: {
            field: category.field,
            item: category.item,
          },
        },
      },
    });
  };

  const _onErrorRefetch = () => {
    dispatch('SET_RESET');
    refetch();
    setSearch(null);
  };

  if (error)
    return (
      <React.Fragment>
        <Header disabled={error} />
        <ApolloScreenErrorHandler refetch={_onErrorRefetch} error={error} />
      </React.Fragment>
    );
  else if (!loading && !data?.ads?.edges.length)
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
        <Button small variant="transparent" onPress={_onErrorRefetch}>
          show latest ads
        </Button>
      </View>
    );
  else {
    const nodes = data?.ads?.edges.map((edge) => edge.node);
    const pageInfo = data?.ads?.pageInfo;

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
          data={nodes}
          renderItem={({ item }) => (
            <Card {...item} modalizeRef={modalizeRef} setPhotos={setPhotos} />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={async () => {
            if (pageInfo.hasNextPage) {
              setFetchMoreLoading(true);
              await fetchMore({ variables: { cursor: pageInfo.endCursor } });
              setFetchMoreLoading(false);
            }
          }}
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
    flexWrap: 'wrap',
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
