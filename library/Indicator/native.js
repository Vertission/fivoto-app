import React from 'react';
import { ActivityIndicator } from 'react-native';
import { COLOR } from '../Theme';

export default function ({ color = COLOR.ICON, ...rest }) {
  return <ActivityIndicator color={color} {...rest} />;
}
