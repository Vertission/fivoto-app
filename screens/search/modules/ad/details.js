import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Typography, Divider } from '../../../../library';
import styles from '../../../../library/Theme/styles';
import { COLOR } from '../../../../library/Theme';

export default function AdDetails({
  location,
  createdAt,
  title,
  price,
  negotiable,
}) {
  return (
    <View style={s.container}>
      <View style={s.locationDate}>
        {/* LOCATION  */}
        <Typography variant="caption" color={COLOR.MUTED}>
          {location.district}, {location.city}
        </Typography>
        {/* DATE  */}
        <Typography variant="caption" color={COLOR.MUTED}>
          {dateFormat(createdAt)}
        </Typography>
      </View>
      <Divider />
      {/* TITLE  */}
      <Typography variant="h4">{title}</Typography>
      {/* PRICE */}
      <View style={s.priceContainer}>
        <Typography style={s.number}>{price}</Typography>
        <Typography variant="caption" color={COLOR.MUTED}>
          {' '}
          {negotiable ? 'negotiable' : null}
        </Typography>
      </View>
    </View>
  );
}

function dateFormat(date) {
  const newDate = new Date(date);

  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][newDate.getUTCMonth()];

  return `${month} ${newDate.getUTCDate()}, ${newDate.getUTCFullYear()}`;
}

const s = StyleSheet.create({
  container: {
    ...styles.container,
  },
  locationDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  number: {
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  priceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
