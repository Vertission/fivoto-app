import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-ionicons';

import { SIZE, COLOR } from '../Theme';

export default function Icon({
  name = null,
  size = SIZE.icon,
  color = COLOR.ICON,
  hide = false,
  touch = false,
  disabled = false,
  ...rest
}) {
  color = disabled ? COLOR.MUTED : color;

  const RenderIcon = <Ionicons name={name} size={size} color={color} />;

  const IconContainer = touch ? TouchableOpacity : View;

  if (hide) return null;
  return (
    <IconContainer disabled={disabled} {...rest}>
      {RenderIcon}
    </IconContainer>
  );
}
