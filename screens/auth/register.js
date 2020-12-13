import React, { useRef } from 'react';
import { StyleSheet, View, Linking, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import {
  Container,
  Header,
  Typography,
  Input,
  Button,
  PasswordInput,
  Indicator,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import rules from '../../utils/rules';

import { useSignUp } from '../../service/amplify/auth/index';

export default function ({ navigation }) {
  const [signUp, { loading }] = useSignUp();

  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
  });

  const onRegister = async ({ email, password, name }) => {
    Keyboard.dismiss();
    signUp(email, password, name);
  };

  return (
    <React.Fragment>
      <Header />
      <Container
        scrollProps={{
          keyboardShouldPersistTaps: 'always',
          showsVerticalScrollIndicator: false,
        }}>
        {/* PROGRESS  */}
        <Indicator.Progress indeterminate={loading} />

        <Typography variant="h1" family="bold">
          Register
        </Typography>

        {/* INPUTS  */}
        <RegisterInput
          control={control}
          errors={errors}
          onRegister={handleSubmit(onRegister)}
        />

        {/* SUBMIT  */}
        <Button
          large
          variant="contained"
          loading={loading}
          onPress={handleSubmit(onRegister)}
          style={styles.registerButton}>
          Register
        </Button>

        {/* TERM & CONDITION  */}
        <Typography align="center" variant="caption" color={COLOR.MUTED}>
          By signing you agree to{' '}
          <Typography
            variant="caption"
            family="bold"
            color={COLOR.PRIMARY}
            onPress={() => Linking.openURL('https://www.fivoto.com/terms')}>
            Terms & Conditions
          </Typography>{' '}
          <Typography align="center" variant="caption" color={COLOR.MUTED}>
            &{' '}
          </Typography>
          <Typography
            variant="caption"
            family="bold"
            color={COLOR.PRIMARY}
            onPress={() => Linking.openURL('https://www.fivoto.com/privacy')}>
            Privacy Policy
          </Typography>
        </Typography>

        {/* DON'T HAVE AN ACCOUNT  */}
        <Typography
          align="center"
          variant="caption"
          color={COLOR.MUTED}
          style={styles.loginNow}
          onPress={() => navigation.navigate('Login')}>
          Already have an account?{' '}
          <Typography variant="caption" family="bold" color={COLOR.PRIMARY}>
            Login
          </Typography>
        </Typography>
      </Container>
    </React.Fragment>
  );
}

function RegisterInput({ control, errors, onRegister }) {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  return (
    <View contentContainerStyle={styles.inputContainer}>
      {/* EMAIL */}
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Input
            label="Name"
            icon="person"
            placeholder="ENTER YOUR NAME"
            returnKeyType="next"
            maxLength={18}
            blurOnSubmit={false}
            error={errors?.name?.message}
            onBlur={onBlur}
            onChangeText={(name) => onChange(name)}
            value={value}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
        name="name"
        rules={rules.name}
        defaultValue=""
      />
      {/* EMAIL */}
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Input
            label="Email"
            icon="mail"
            placeholder="ENTER YOUR EMAIL ADDRESS"
            returnKeyType="next"
            autoCorrect={false}
            maxLength={320}
            blurOnSubmit={false}
            setRef={emailRef}
            autoCapitalize="none"
            autoCompleteType="email"
            keyboardType="email-address"
            error={errors?.email?.message}
            onBlur={onBlur}
            onChangeText={(email) => onChange(email)}
            value={value}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
        name="email"
        rules={rules.email}
        defaultValue=""
      />
      {/* PASSWORD */}
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <PasswordInput
            label="Password"
            error={errors?.password?.message}
            placeholder="ENTER A PASSWORD"
            returnKeyLabel="register"
            returnKeyType="done"
            maxLength={256}
            setRef={passwordRef}
            onSubmitEditing={onRegister}
            onBlur={onBlur}
            onChangeText={(password) => onChange(password)}
            value={value}
          />
        )}
        name="password"
        rules={rules.newPassword}
        defaultValue=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: SIZE.margin,
  },
  loginNow: {
    marginBottom: SIZE.margin,
    marginTop: SIZE.margin * 2,
  },
  registerButton: {
    marginTop: SIZE.margin * 3,
  },
});
