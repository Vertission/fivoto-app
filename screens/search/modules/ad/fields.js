import React from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import { Typography } from '../../../../library';
import { SIZE } from '../../../../library/Theme';
import styles from '../../../../library/Theme/styles';

export default function AdFields({ fields }) {
  const Fields = (fields) => {
    return Object.keys(fields)
      .filter((k) => typeof fields[k] !== 'boolean')
      .map((field) => (
        <View style={s.spec} key={field}>
          <Typography transform="capitalize" family="bold">
            {field}:
          </Typography>
          <Typography style={s.value}>{fields[field]}</Typography>
        </View>
      ));
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
