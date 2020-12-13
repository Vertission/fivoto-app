import React from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import { Typography } from '../../../../library';
import { SIZE, COLOR } from '../../../../library/Theme';
import styles from '../../../../library/Theme/styles';

export default function AdFields({ fields }) {
  const Fields = (fields) => {
    return Object.keys(fields)
      .filter((k) => typeof fields[k] !== 'boolean')
      .map((field) => {
        if (typeof fields[field] === 'object')
          return (
            <View style={s.spec} key={field}>
              <Typography transform="capitalize" family="bold">
                {field}:
              </Typography>
              {Object.values(fields[field]).map((e, i) => (
                <Typography
                  key={e}
                  style={s.value}
                  color={i === 1 ? COLOR.MUTED : COLOR.TYPOGRAPHY}>
                  {e}
                </Typography>
              ))}
            </View>
          );
        else
          return (
            <View style={s.spec} key={field}>
              <Typography transform="capitalize" family="bold">
                {field}:
              </Typography>
              <Typography style={s.value}>{fields[field]}</Typography>
            </View>
          );
      });
  };

  if (_.isEmpty(Fields(fields))) return null;
  else return <View style={s.container}>{Fields(fields)}</View>;
}

const s = StyleSheet.create({
  container: {
    ...styles.container,
  },
  spec: {
    flexDirection: 'row',
  },
  value: {
    marginLeft: SIZE.margin,
  },
});

// NEXT: add separate field holders by category (nov/13/2020)
