import React from 'react';
import { View } from 'react-native';

import { Negotiable, Condition } from '../common';

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
