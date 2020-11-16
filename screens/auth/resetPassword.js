import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import {
  Container,
  Typography,
  Input,
  Button,
  Header,
  Indicator,
  PasswordInput,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { useResetPassword } from '../../setup/amplify/auth';

import rules from '../../utils/rules';

export default function ResetPassword({ navigation, route }) {
  const emailRef = useRef(null);

  const [resetPassword, { loading }] = useResetPassword();

  const { control, handleSubmit, errors, getValues } = useForm({
    mode: 'onBlur',
  });

  const isValid = {
    password: _.isEmpty(errors?.password) && !_.isEmpty(getValues('password')),
    code: _.isEmpty(errors?.code) && !_.isEmpty(getValues('code')),
  };

  const onSubmit = ({ code, password }) => {
    resetPassword(route.params.email, code, password);
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
        <Indicator.Progress
        // indeterminate={loading}
        />
        <Typography align="center" variant="h1">
          Reset Password
        </Typography>
        {/* VERIFICATION CODE */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              valid={isValid.code}
              error={errors?.code?.message}
              placeholder="ENTER VERIFICATION CODE"
              type="number-pad"
              maxLength={6}
              label="Verification Code"
              onBlur={onBlur}
              onChangeText={(code) => onChange(code)}
              onSubmitEditing={() => emailRef.current?.focus()}
              value={value}
            />
          )}
          name="code"
          rules={rules.verificationCode}
          defaultValue=""
        />
        {/* PASSWORD */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <PasswordInput
              valid={isValid.password}
              label="New Password"
              error={errors?.password?.message}
              placeholder="ENTER NEW PASSWORD"
              returnKeyLabel="reset"
              returnKeyType="done"
              setRef={emailRef}
              maxLength={256}
              onSubmitEditing={handleSubmit(onSubmit)}
              onBlur={onBlur}
              onChangeText={(password) => onChange(password)}
              value={value}
            />
          )}
          name="password"
          rules={rules.newPassword}
          defaultValue=""
        />
        <Typography
          align="center"
          color={COLOR.MUTED}
          variant="caption"
          style={{ marginTop: SIZE.margin }}>
          Password reset verification code send to {route.params.email}, Please
          enter the verification code and a new password to reset your password.
        </Typography>
        <Button
          large
          variant="contained"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: SIZE.margin * 2 }}>
          reset password
        </Button>
        <Button
          small
          variant="transparent"
          onPress={() =>
            navigation.navigate('ForgotPassword', { email: route.params.email })
          }
          style={{ marginTop: SIZE.margin }}>
          resend code
        </Button>
      </Container>
    </React.Fragment>
  );
}
