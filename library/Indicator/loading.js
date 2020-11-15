import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { COLOR } from '../Theme';

export default function Loading() {
  return (
    <View style={s.root}>
      <ActivityIndicator color={COLOR.PRIMARY} size="large" />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
