import React from 'react';
import { Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

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

import {
  useConfirmSign,
  useSendConfirmationCode,
} from '../../service/amplify/auth';

export default function EmailConfirmation({ route }) {
  const [confirmSign, { loading: confirmSignLoading }] = useConfirmSign();

  const [
    sendConfirmationCode,
    { loading: sendConfirmationCodeLoading },
  ] = useSendConfirmationCode();

  const { control, handleSubmit, errors, reset } = useForm({
    mode: 'onBlur',
  });

  const onResendConfirmationCode = () => {
    Keyboard.dismiss();
    reset();
    sendConfirmationCode(route.params.email);
  };

  const onConfirmCode = ({ code }) => {
    Keyboard.dismiss();
    confirmSign(route.params.email, code);
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
          indeterminate={confirmSignLoading || sendConfirmationCodeLoading}
        />

        <Typography align="center" variant="h1">
          Email Confirmation
        </Typography>

        {/* VERIFICATION CODE */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              placeholder="ENTER CONFIRMATION CODE"
              type="number-pad"
              maxLength={6}
              error={errors?.code?.message}
              onBlur={onBlur}
              onChangeText={(code) => onChange(code)}
              value={value}
              onSubmitEditing={handleSubmit(onConfirmCode)}
            />
          )}
          name="code"
          rules={rules.confirmationCode}
          defaultValue=""
        />

        <Typography
          align="center"
          color={COLOR.MUTED}
          variant="caption"
          style={{ marginTop: SIZE.margin }}>
          Please enter the confirmation code we send to your email address{' '}
          {route.params.email}.
        </Typography>
        <Button
          large
          variant="contained"
          loading={confirmSignLoading}
          onPress={handleSubmit(onConfirmCode)}
          style={{ marginTop: SIZE.margin * 2 }}>
          confirm
        </Button>
        <Button
          small
          variant="transparent"
          loading={sendConfirmationCodeLoading}
          onPress={onResendConfirmationCode}
          style={{ marginTop: SIZE.margin }}>
          resend code
        </Button>
      </Container>
    </React.Fragment>
  );
}
