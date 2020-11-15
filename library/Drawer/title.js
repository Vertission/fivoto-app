import React from 'react';
import { StyleSheet } from 'react-native';

import Typography from '../Typography';
import { SIZE, COLOR } from '../Theme';

export default function Title({ children }) {
  return (
    <Typography
      color={COLOR.MUTED}
      style={s.root}
      transform="uppercase"
      family="bold">
      {children}
    </Typography>
  );
}

const s = StyleSheet.create({
  root: {
    marginLeft: SIZE.margin,
    marginTop: SIZE.margin * 1.5,
  },
});
