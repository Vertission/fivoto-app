import React, { useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';

import { Indicator, Tab, Header } from '../../../library';
import styles from '../../../library/Theme/styles';

import { useQueryLocations } from '../../../api/utils/read';

import { dispatch } from './modules/context';

import ApolloError from '../../shared/apolloError';

export default function Category({ navigation }) {
  ////////////////////////////////////
  const { setTabBarVisible } = useContext(
    require('../../navigation/tabs/search').TabBarVisibleContext,
  );
  useFocusEffect(
    React.useCallback(() => setTabBarVisible(true), [setTabBarVisible]),
  );
  ////////////////////////////////////

  const [locations, { loading, refetch, error }] = useQueryLocations();
  const [district, setDistrict] = useState(null);

  const RenderLocation = ({ item }) => {
    const _onPress = () => {
      if (item.district.includes('all')) {
        dispatch('SET_LOCATION', { district: null, city: null });
        navigation.navigate('Search');
      } else setDistrict(item.district);
    };

    return <Tab onPress={_onPress}>{item.district}</Tab>;
  };

  const locationCities = _.find(locations, { district })?.cities;

  const RenderLocationCities = ({ item }) => {
    const _onPress = async () => {
      if (item.includes('all')) {
        dispatch('SET_LOCATION', { district, city: null });

        await analytics().logSelectContent({
          content_type: 'location',
          item_id: district,
        }); // ANALYTIC
      } else {
        dispatch('SET_LOCATION', { district, city: item });

        await analytics().logSelectContent({
          content_type: 'location',
          item_id: item,
        }); // ANALYTIC
      }
      navigation.navigate('Search');
    };

    return <Tab onPress={_onPress}>{item}</Tab>;
  };

  if (loading) return <Indicator.Loading />;
  else if (error)
    return (
      <React.Fragment>
        <Header />
        <ApolloError refetch={refetch} error={error} />
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <Header
        title="select district"
        onPress={() => (district ? setDistrict(null) : navigation.goBack())}
      />
      <FlatList
        style={styles.container}
        data={
          district
            ? [`all ${district}`, ...locationCities]
            : [{ district: 'all locations' }, ...locations]
        }
        renderItem={district ? RenderLocationCities : RenderLocation}
        keyExtractor={(item) => (district ? item : item.district)}
      />
    </React.Fragment>
  );
}