import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Typography, Indicator } from '../../../../library';
import { COLOR, SIZE } from '../../../../library/Theme';

export default function MutationLoader({ status }) {
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation],
  );

  return (
    <View style={s.root}>
      <Indicator.Activity size="large" color={COLOR.PRIMARY} />
      <Typography
        style={s.status}
        transform="uppercase"
        variant="caption"
        color={COLOR.MUTED}>
        {status}
      </Typography>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  status: {
    marginTop: SIZE.margin * 3,
  },
});
