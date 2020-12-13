import React from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import * as MailComposer from 'expo-mail-composer';
import * as Sentry from '@sentry/react-native';

import {
  Button,
  Typography,
  Container,
  Input,
  Header,
  Modal,
  Icon,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

export default function ContactUs({ navigation }) {
  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: null,
      message: null,
    },
  });

  const _submit = async ({ message }) => {
    try {
      MailComposer.composeAsync({
        subject: 'contact me',
        body: message,
        recipients: ['support@fivoto.com'],
      });
    } catch (error) {
      Modal.show({
        title: 'Message Not Send',
        description:
          'Oops! Something went wrong while sending your message, Please contact us through support@fivoto.com.',
        closeTitle: 'close',
      });

      Sentry.withScope(function (scope) {
        scope.setTag('screen', 'contactUs');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { message });
        Sentry.captureException(error);
      });
    }
  };

  return (
    <React.Fragment>
      <Header
        backSpace={false}
        startContent={
          <Icon
            name="menu"
            size={SIZE.icon * 1.5}
            touch
            onPress={navigation.toggleDrawer}
          />
        }
      />
      <Container
        scrollProps={{
          keyboardShouldPersistTaps: 'always',
          showsVerticalScrollIndicator: false,
        }}>
        <Typography variant="h1" family="bold">
          Contact Us
        </Typography>
        <Typography color={COLOR.MUTED}>
          Leave us a message, We will get contact with you as soon as possible.
        </Typography>
        {/*  MESSAGE  */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              placeholder="ENTER YOU MESSAGE"
              multiline
              numberOfLines={5}
              label="Message"
              blurOnSubmit={false}
              error={errors?.message?.message}
              onBlur={onBlur}
              onChangeText={(message) => onChange(message)}
              value={value}
            />
          )}
          rules={{
            required: 'please enter your message',
          }}
          name="message"
          defaultValue=""
        />

        <Button
          variant="contained"
          large
          style={s.submitButton}
          onPress={handleSubmit(_submit)}>
          send
        </Button>
      </Container>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  submitButton: {
    marginTop: SIZE.margin,
  },
});
