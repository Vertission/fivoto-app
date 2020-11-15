import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLOR, SIZE } from '../Theme';

function Divider({ style, width }) {
  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth },
        { backgroundColor: COLOR.MUTED },
        { marginVertical: SIZE.margin },
        { marginHorizontal: SIZE.margin * 1.5 },
        width && { width: `${width}%` },
        style,
      ]}
    />
  );
}

export default Divider;
