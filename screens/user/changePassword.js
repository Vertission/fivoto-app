import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import {
  Container,
  Typography,
  Input,
  Button,
  Header,
  Indicator,
  Modal,
  PasswordInput,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import { useChangePassword, useSignOut } from '../../service/amplify/auth';

import { client as apolloClient } from '../../service/apollo';
import rules from '../../utils/rules';

export default function ResetPassword() {
  const newPasswordRef = useRef(null);

  const [changePassword, { loading }] = useChangePassword();
  const [signOut] = useSignOut();

  const { control, handleSubmit, errors, getValues } = useForm({
    mode: 'onBlur',
  });

  const isValid = {
    password:
      _.isEmpty(errors?.newPassword) && !_.isEmpty(getValues('newPassword')),
  };

  const onSubmit = ({ oldPassword, newPassword }) => {
    changePassword(oldPassword, newPassword);
  };

  const _onPressLogout = async () => {
    await signOut();
    apolloClient.resetStore();
  };

  const _onPressForgotPassword = () => {
    Modal.show({
      title: 'Forgot Password?',
      description:
        'If you have forgot your current password you can reset your password after signing out.',
      actions: [{ title: 'sign out', onPress: _onPressLogout }],
    });
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
        {/* OLD PASSWORD */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              label="Current Password"
              placeholder="ENTER YOUR CURRENT PASSWORD"
              returnKeyType="next"
              secureTextEntry={true}
              autoCapitalize="none"
              error={errors?.oldPassword?.message}
              onSubmitEditing={() => newPasswordRef.current?.focus()}
              onBlur={onBlur}
              onChangeText={(password) => onChange(password)}
              value={value}
            />
          )}
          name="oldPassword"
          rules={rules.oldPassword}
          defaultValue=""
        />
        {/* NEW PASSWORD */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <PasswordInput
              valid={isValid.password}
              label="New Password"
              error={errors?.newPassword?.message}
              placeholder="ENTER A NEW PASSWORD"
              returnKeyType="done"
              setRef={newPasswordRef}
              maxLength={256}
              onSubmitEditing={handleSubmit(onSubmit)}
              onBlur={onBlur}
              onChangeText={(password) => onChange(password)}
              value={value}
            />
          )}
          name="newPassword"
          rules={rules.newPassword}
          defaultValue=""
        />
        <Button
          large
          variant="contained"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: SIZE.margin * 2 }}>
          change password
        </Button>
        {/* FORGET PASSWORD  */}
        <TouchableOpacity onPress={_onPressForgotPassword}>
          <Typography align="center" family="bold" color={COLOR.PRIMARY}>
            Forgot Password?
          </Typography>
        </TouchableOpacity>
      </Container>
    </React.Fragment>
  );
}
