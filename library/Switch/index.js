import React from 'react';
import PropTypes from 'prop-types';
import { Switch as NativeSwitch } from 'react-native';

import { COLOR } from '../Theme';

export default function Switch({ value, onValueChange }) {
  return (
    <NativeSwitch
      thumbColor={value ? COLOR.PRIMARY : COLOR.MUTED}
      trackColor={{ false: COLOR.LIGHT }}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

Switch.propTypes = {
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};
