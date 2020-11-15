import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Typography from '../Typography';
import Icon from '../Icon';
import { SIZE } from '../Theme';

export default function Tab({ children, icon, style, ...rest }) {
  return (
    <TouchableOpacity {...rest}>
      <View style={[s.container, style]}>
        {icon && <Icon name={icon} size={SIZE.icon * 1.3} style={s.icon} />}
        <Typography
          variant="h5"
          transform="capitalize"
          style={{ marginTop: 3 }}>
          {children}
        </Typography>
        <Icon name="arrow-forward" size={SIZE.icon * 1.5} style={s.arrow} />
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  arrow: {
    marginLeft: 'auto',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: SIZE.margin / 1.5,
  },
  icon: {
    marginRight: SIZE.margin,
  },
});

Tab.defaultProps = {
  children: null,
  icon: null,
  style: {},
};
