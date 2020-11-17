import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Typography, Button } from '../../../library';
import { COLOR, SIZE } from '../../../library/Theme';

import styles from '../../../library/Theme/styles';

import { useResendEmailChangeConfirmationCode } from '../../../service/amplify/auth';

export default function VerificationRequired({ email }) {
  const navigation = useNavigation();
  const [
    resendEmailChangeConfirmationCode,
  ] = useResendEmailChangeConfirmationCode();

  const _verifyEmailAddress = () => {
    resendEmailChangeConfirmationCode();
    navigation.navigate('EmailConfirmation', { email });
  };

  return (
    <View style={s.container}>
      <Typography variant="h5" color={COLOR.ERROR}>
        Email Verification Required
      </Typography>
      <Typography
        color={COLOR.MUTED}
        variant="caption"
        style={{ marginVertical: SIZE.margin / 2 }}>
        Please verify your email address {email}
      </Typography>
      <View style={s.buttonContainer}>
        <Button
          style={s.button}
          small
          variant="contained"
          onPress={_verifyEmailAddress}>
          verify
        </Button>
        <Button
          style={s.button}
          small
          onPress={() => navigation.navigate('EmailChange', { email })}>
          change email
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
    justifyContent: 'space-evenly',
  },
  container: {
    ...styles.container,
  },
});
