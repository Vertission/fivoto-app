import React from 'react';
import { View, StyleSheet } from 'react-native';

import { SIZE } from '../Theme';

export default function Item({ children, style }) {
  return <View style={[s.root, style]}>{children}</View>;
}

const s = StyleSheet.create({
  root: {
    margin: SIZE.margin / 2,
    padding: SIZE.padding / 2,
  },
});
