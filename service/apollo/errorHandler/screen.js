import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import { Typography, Icon, Button } from '../../../library';
import { COLOR, SIZE } from '../../../library/Theme';

export default function Error({ refetch, error }) {
  const navigation = useNavigation();
  const { message } = error;

  const _onPressReport = () => {
    navigation.navigate('Home', { screen: 'ReportIssue', params: { error } });
  };

  return (
    <View style={s.root}>
      <Icon name="alert" size={SIZE.icon * 4.5} color={COLOR.ERROR} />
      <Typography variant="h6" family="bold">
        SOMETHING WENT WRONG
      </Typography>
      <Typography variant="caption" color={COLOR.MUTED}>
        {message}
      </Typography>
      <View style={s.buttonContainer}>
        <Button variant="contained" style={s.button} onPress={() => refetch()}>
          try again
        </Button>
        <Button
          variant="transparent"
          small
          style={s.button}
          onPress={_onPressReport}>
          report
        </Button>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  button: {
    width: 160,
  },
  buttonContainer: {
    marginTop: SIZE.margin * 2,
  },
  root: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    margin: SIZE.margin,
  },
});
