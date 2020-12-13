import React from 'react';
import { View } from 'react-native';

import { Condition, Negotiable } from '../common';

export default function () {
  return (
    <View>
      {/* NEGOTIABLE  */}
      <Negotiable />
      {/* CONDITION  */}
      <Condition />
    </View>
  );
}
