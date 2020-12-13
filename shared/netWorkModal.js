import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import { Typography, Icon } from '../library';
import { COLOR, SIZE } from '../library/Theme';

export default function NetworkModal({ isConnected }) {
  return (
    <Modal
      animationType="slide"
      // eslint-disable-next-line no-eval
      visible={!isConnected}
      transparent={true}>
      <View style={styles.root}>
        <View style={styles.container}>
          <Icon name="warning" size={SIZE.icon * 5} color={COLOR.WHITE} />
          <View style={styles.textContainer}>
            <Typography variant="h5" family="bold" color={COLOR.WHITE}>
              No Internet Connection
            </Typography>
            <Typography variant="caption" color={COLOR.WHITE} align="center">
              please check your internet connection and try again.
            </Typography>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLOR.ERROR,
    padding: SIZE.padding,
    shadowColor: COLOR.BLACK,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SIZE.padding / 2,
    paddingVertical: SIZE.padding,
  },
});
