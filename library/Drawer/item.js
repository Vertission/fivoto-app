import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Typography from '../Typography';
import Icon from '../Icon';
import { SIZE, COLOR } from '../Theme';

export default function Item({
  children,
  icon,
  iconColor = COLOR.ICON,
  selected,
  iconProps,
  ...rest
}) {
  return (
    <TouchableOpacity style={[s.root, selected && s.rootSelected]} {...rest}>
      <Icon
        name={icon}
        size={SIZE.icon}
        style={s.icon}
        color={selected ? COLOR.WHITE : iconColor}
        {...iconProps}
      />
      <Typography
        variant="h6"
        family="bold"
        color={selected ? COLOR.WHITE : COLOR.TYPOGRAPHY}>
        {children}
      </Typography>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  icon: {
    marginRight: SIZE.margin * 2,
  },
  root: {
    borderRadius: SIZE.radius,
    flexDirection: 'row',
    margin: SIZE.margin / 2,
    padding: SIZE.padding / 2,
  },
  rootSelected: {
    backgroundColor: COLOR.PRIMARY,
  },
});
