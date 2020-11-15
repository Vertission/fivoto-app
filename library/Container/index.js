import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { SIZE, COLOR } from '../Theme';
import { HEADER } from '../Theme/library';

const FULL_HEIGHT =
  SIZE.height - (HEADER.height + SIZE.statusBarHeight + SIZE.margin * 3);

export default function ({ children, style, center, grow, scrollProps }) {
  return (
    <ScrollView
      style={[
        styles.root,
        grow && { maxHeight: FULL_HEIGHT + SIZE.bottomTabHeight },
      ]}
      showsVerticalScrollIndicator={true}
      {...scrollProps}>
      <View
        style={[
          styles.container,
          center && { alignItems: 'center' },
          grow && { height: FULL_HEIGHT + SIZE.bottomTabHeight },
          style,
        ]}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    borderRadius: SIZE.radius,
    padding: SIZE.padding,
  },
  root: {
    margin: SIZE.margin,
    maxHeight: FULL_HEIGHT,
  },
});
