import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Typography } from '../../../../library';
import { COLOR } from '../../../../lbrary/Theme';
import styles from '../../../../library/Theme/styles';

export default function AdUser({ description }) {
  return (
    <View style={s.container}>
      <Typography variant="caption" family="bold" color={COLOR.MUTED}>
        Description
      </Typography>
      <Typography>{description}</Typography>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...styles.container,
    maxHeight: null,
  },
});
