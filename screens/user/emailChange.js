import React from 'react';
import { Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import {
  Container,
  Typography,
  Input,
  Button,
  Header,
  Indicator,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import rules from '../../utils/rules';

import { useChangeEmail } from '../../service/amplify/auth';

export default function EmailChange({ route }) {
  const [changeEmail, { loading }] = useChangeEmail();

  const { control, handleSubmit, errors, getValues } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: route.params.email,
    },
  });

  const isValid = {
    email: _.isEmpty(errors?.email) && !_.isEmpty(getValues('email')),
  };

  const onSubmit = async ({ email }) => {
    Keyboard.dismiss();
    if (email === route.params.email) return null;
    else changeEmail(email);
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

        <Typography align="center" variant="h1">
          Change Email
        </Typography>
        {/* EMAIL */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              valid={isValid.email}
              placeholder="ENTER YOUR NEW EMAIL ADDRESS"
              autoCorrect={false}
              maxLength={320}
              blurOnSubmit={false}
              returnKeyType="done"
              icon="mail"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCompleteType="email"
              error={errors?.email?.message}
              onBlur={onBlur}
              onChangeText={(email) => onChange(email)}
              value={value}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="email"
          rules={rules.email}
          defaultValue=""
        />
        <Typography
          align="center"
          color={COLOR.MUTED}
          variant="caption"
          style={{ marginTop: SIZE.margin }}>
          Please enter your new email address and submit to receive email
          confirmation code.
        </Typography>
        <Button
          large
          variant="contained"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: SIZE.margin * 2 }}>
          submit
        </Button>
      </Container>
    </React.Fragment>
  );
}
