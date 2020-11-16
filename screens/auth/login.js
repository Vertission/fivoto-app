import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { SIZE, COLOR } from '../../library/Theme';
import {
  Container,
  Header,
  Typography,
  Input,
  Button,
  PasswordInput,
  Indicator,
} from '../../library';

import rules from '../../utils/rules';

import { useSignIn } from '../../setup/amplify/auth';

export default function ({ navigation, route }) {
  const [signIn, { loading }] = useSignIn();

  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: route.params?.email, // from register, reset password
    },
  });

  const onLogin = ({ email, password }) => {
    Keyboard.dismiss();
    signIn(email, password);
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
          Login
        </Typography>

        <LoginInputs
          control={control}
          errors={errors}
          onRegister={handleSubmit(onLogin)}
        />

        {/* LOGIN  */}
        <Button
          large
          variant="contained"
          loading={loading}
          onPress={handleSubmit(onLogin)}
          style={styles.loginButton}>
          Login
        </Button>

        {/* FORGET PASSWORD  */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Typography align="center" family="bold" color={COLOR.PRIMARY}>
            Forgot Password?
          </Typography>
        </TouchableOpacity>

        {/* DON'T HAVE AN ACCOUNT  */}
        <Typography
          align="center"
          variant="caption"
          color={COLOR.MUTED}
          style={styles.registerNow}
          onPress={() => navigation.navigate('Register')}>
          Don't have an account?{' '}
          <Typography variant="caption" family="bold" color={COLOR.PRIMARY}>
            Register
          </Typography>
        </Typography>
      </Container>
    </React.Fragment>
  );
}

function LoginInputs({ control, errors, onRegister }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <View contentContainerStyle={styles.inputContainer}>
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
            setRef={emailRef}
            maxLength={320}
            blurOnSubmit={false}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCompleteType="email"
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
            placeholder="ENTER YOUR PASSWORD"
            returnKeyLabel="login"
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
        rules={rules.oldPassword}
        defaultValue=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: SIZE.margin,
  },
  loginButton: {
    marginTop: SIZE.margin * 3,
  },
  registerNow: {
    marginBottom: SIZE.margin,
    marginTop: SIZE.margin * 2,
  },
});
