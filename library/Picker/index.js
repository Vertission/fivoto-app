import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import _ from 'lodash';

import Typography from '../Typography';
import { SIZE, COLOR } from '../Theme';
import { INPUT } from '../Theme/library';

export default function ({ label, pickers, style, labelStyle, ...rest }) {
  return (
    <>
      {label && (
        <Typography style={[styles.label, labelStyle]}>{label}</Typography>
      )}
      <View style={[styles.inputStyle, style]}>
        <Picker style={{ width: '100%' }} {...rest}>
          {pickers.map((value) => (
            <Picker.Item
              key={value}
              label={_.capitalize(value)}
              value={value}
            />
          ))}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: COLOR.LIGHT,
    borderColor: COLOR.MUTED,
    borderRadius: SIZE.radius,
    height: INPUT.height,
    justifyContent: 'center',
    marginBottom: SIZE.margin,
    width: '100%',
  },
  label: {
    marginLeft: 1,
    marginTop: SIZE.margin * 0.5,
    marginBottom: 5,
  },
});
