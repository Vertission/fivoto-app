import React, { useRef } from 'react';
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { Modalize } from 'react-native-modalize';
import _ from 'lodash';

import {
  Indicator,
  Header as LibraryHeader,
  Typography,
  Icon,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';

import { AD } from '../../service/apollo/schema/query';

import Header from './modules/ad/header';
import Carousel from './modules/ad/carousel';
import Details from './modules/ad/details';
import Fields from './modules/ad/fields';
import Description from './modules/ad/description';
import User from './modules/ad/user';

import NotAvailable from './modules/ad/notAvailable';

import ApolloScreenErrorHandler from '../../service/apollo/errorHandler/screen';

export default function ({ navigation, route }) {
  const modalizeRef = useRef(null);

  const { data, loading, refetch, error } = useQuery(AD, {
    variables: { id: route.params.id },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        <LibraryHeader onPress={() => navigation.navigate('Search')} />
        <ApolloScreenErrorHandler refetch={refetch} error={error} />
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
      phone,
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
          <Header id={id} onPress={() => navigation.navigate('Search')} />
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
          <User user={user} modalizeRef={modalizeRef} />
        </ScrollView>
        {/* NEXT: MOVE THIS TO SEPARATE FILE */}
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          modalStyle={s.modalize}>
          {phone.map((phone) => (
            <TouchableOpacity
              key={phone}
              style={s.phone}
              onPress={() => Linking.openURL(`tel://${phone}`)}>
              <Typography variant="h1" style={s.number}>
                {phone}
              </Typography>
              <Icon name="call" size={SIZE.icon * 1.5} />
            </TouchableOpacity>
          ))}
        </Modalize>
      </React.Fragment>
    );
  }
}

const s = StyleSheet.create({
  modalize: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  phone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZE.margin * 1.5,
    marginVertical: SIZE.margin,
  },
});
