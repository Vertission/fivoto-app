import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Icon, Header, Typography, Button } from '../../../../../library';
import { SIZE } from '../../../../../library/Theme';

import { dispatch } from '../context';

export default function NotAvailable() {
  const navigation = useNavigation();

  const _onPressLatestAds = () => {
    dispatch('SET_RESET');
    navigation.navigate('Search');
  };

  return (
    <React.Fragment>
      <Header />
      <View style={s.container}>
        <Icon name="sad" size={SIZE.icon * 5} />
        <Typography variant="h3">Oops! Ad not available</Typography>
        <Button variant="contained" onPress={_onPressLatestAds}>
          go to latest ads
        </Button>
      </View>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    margin: SIZE.margin * 3,
  },
});
