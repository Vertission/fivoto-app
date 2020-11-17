import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import _ from 'lodash';

import { Typography, Header, Indicator } from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { dispatch } from './modules/context';

import { useQueryLocations } from '../../setup/apollo/query/utils';

import ApolloScreenErrorHandler from '../../setup/apollo/errorHandler/screen';

export default function Location({ navigation, route }) {
  const [locationData, { loading, error, refetch }] = useQueryLocations();

  const [district, setDistrict] = useState(null);

  const _onSelect = (location) => {
    dispatch('SET_LOCATION', location);
    navigation.navigate('Form');
  };

  const _onPressHeader = () => {
    route.params?.toForm ? navigation.navigate('Form') : navigation.goBack();
  };

  const RenderDistrict = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setDistrict(item.district)}>
        <View style={s.location}>
          <Typography variant="h4">{item.district}</Typography>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderCity = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => _onSelect({ district, city: item })}>
        <View style={s.location}>
          <Typography variant="h4">{item}</Typography>
        </View>
      </TouchableOpacity>
    );
  };

  const districtCities = _.find(locationData, { district })?.cities;

  if (loading) return <Indicator.Loading />;
  else if (error)
    return <ApolloScreenErrorHandler refetch={refetch} error={error} />;
  return (
    <View style={{ flex: 1 }}>
      <Header
        icon={district ? 'close' : 'arrow-back'}
        title={district || 'select location'}
        titleStyle={{ textTransform: district ? 'capitalize' : null }}
        onPress={district ? () => setDistrict(null) : _onPressHeader}
      />
      <FlatList
        style={s.flatList}
        data={district ? districtCities : locationData}
        renderItem={district ? RenderCity : RenderDistrict}
        keyExtractor={(item) => (district ? item : item.district)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  flatList: {
    backgroundColor: COLOR.WHITE,
    borderBottomLeftRadius: SIZE.radius,
    borderBottomRightRadius: SIZE.radius,
    marginBottom: SIZE.margin,
    marginHorizontal: SIZE.margin * 1.5,
  },
  location: {
    marginHorizontal: SIZE.margin,
    marginVertical: SIZE.margin / 2,
  },
});
