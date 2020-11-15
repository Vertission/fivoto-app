import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import Typography from '../Typography';

import { COLOR } from '../Theme';

export default function ({ label, disabled, ...rest }) {
  return (
    <View style={styles.container}>
      <View style={styles.checkbox}>
        <CheckBox
          tintColors={{ true: COLOR.PRIMARY, false: COLOR.MUTED }}
          disabled={disabled}
          {...rest}
        />
      </View>
      <Typography color={disabled ? COLOR.MUTED : COLOR.TYPOGRAPHY}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    position: 'relative',
    right: 6,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
