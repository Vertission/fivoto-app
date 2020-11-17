import React from 'react';
import { StyleSheet, View, Share } from 'react-native';

import { Icon, Typography, Button } from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';

export default function Mutated({ id, action, navigation, modalizeRef }) {
  return (
    <View style={s.root}>
      <Icon
        name="checkmark-circle-outline"
        size={SIZE.icon * 3}
        color={COLOR.SUCCESS}
        style={s.icon}
      />
      <Typography variant="h5">Your ad {action} successfully.</Typography>
      <View style={s.buttonContainer}>
        <Button
          small
          variant="contained"
          style={s.button}
          onPress={() => {
            navigation.navigate('Search', { screen: 'Ad', params: { id } });
            modalizeRef.current?.close();
          }}>
          view
        </Button>
        <Button
          small
          variant="contained"
          style={s.button}
          onPress={() => {
            Share.share({ message: `https://lk.fivoto.com/ad/${id}` });
            modalizeRef.current?.close();
          }}>
          share
        </Button>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  button: {
    width: '45%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZE.margin,
    width: '100%',
  },
  icon: {
    marginBottom: SIZE.margin,
  },
  root: {
    alignItems: 'center',
    marginHorizontal: SIZE.margin,
    marginVertical: SIZE.margin * 3,
  },
});
