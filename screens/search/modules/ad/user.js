import React, { useRef } from 'react';
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native';

import { Typography, Button, Icon } from '../../../../library';
import { SIZE } from '../../../../library/Theme';
import styles from '../../../../library/Theme/styles';

export default function AdUser({ user, modalizeRef }) {
  return (
    <View style={s.container}>
      <Typography variant="h5">{user.name}</Typography>
      <Button variant="contained" onPress={() => modalizeRef.current?.open()}>
        Call
      </Button>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...styles.container,
    maxHeight: null,
  },
});
