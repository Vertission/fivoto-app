import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLOR, SIZE } from '../../library/Theme';
import { Container, Button, Typography } from '../../library';

export default function Auth({ navigation }) {
  return (
    <Container
      style={s.container}
      scrollProps={{
        showsVerticalScrollIndicator: false,
      }}>
      <Typography
        align="center"
        variant="h1"
        family="xbold"
        style={s.fivoto}
        color={COLOR.WHITE}>
        FIVOTO
      </Typography>
      <View style={s.buttonContainer}>
        <Button
          large
          onPress={() => navigation.navigate('Login')}
          style={{ backgroundColor: COLOR.WHITE }}
          textProps={{
            style: {
              color: COLOR.PRIMARY,
            },
          }}>
          login
        </Button>
        <Button
          large
          variant="contained"
          onPress={() => navigation.navigate('Register')}
          style={{ borderColor: COLOR.WHITE, borderWidth: SIZE.borderWidth }}
          textProps={{
            style: {
              color: COLOR.WHITE,
            },
          }}>
          register
        </Button>
      </View>
    </Container>
  );
}

const s = StyleSheet.create({
  buttonContainer: {
    bottom: SIZE.margin,
    left: SIZE.padding, //center button
    padding: SIZE.padding / 2,
    position: 'absolute',
    width: '100%',
  },
  container: {
    backgroundColor: COLOR.PRIMARY,
    height:
      SIZE.height -
      (SIZE.bottomTabHeight + SIZE.statusBarHeight + SIZE.margin * 2),
    justifyContent: 'center',
  },
  fivoto: {
    marginTop: -SIZE.margin * 10,
  },
});
