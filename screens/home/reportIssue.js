import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import SyncStorage from 'sync-storage';
import * as MailComposer from 'expo-mail-composer';
import * as Sentry from '@sentry/react-native';

import {
  Container,
  Typography,
  Button,
  Input,
  Modal,
  Header,
  Icon,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';

export default function ReportIssue({ navigation, route }) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, errors, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      description: null,
    },
  });

  const _submit = async ({ description }) => {
    try {
      setLoading(true);

      await firestore()
        .collection('issueReport')
        .add({
          error: route.params.error,
          data: route.params.data,
          action: route.params.action,
          description,
          date: new Date(),
          user: SyncStorage.get('@user'),
        });

      reset();
      setLoading(false);

      navigation.navigate('Home');

      Modal.show({
        title: 'Issue Reported Successfully',
        description:
          'Thank you for taking time to report this issue, Fivoto team will fix this soon as possible.',
        closeTitle: 'close',
      });
    } catch (error) {
      setLoading(false);
      Sentry.withScope(function (scope) {
        scope.setTag('screen', 'reportIssue');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { description });
        Sentry.captureException(error);
      });

      MailComposer.composeAsync({
        subject: 'reporting issue',
        body: `${description} \n \n \n \n ${route.params.error}`,
        recipients: ['support@fivoto.com'],
      }).catch((error) => {
        Modal.show({
          title: 'Issue Reporting Failed',
          description:
            'Oops! Issue Reporting is temporarily closed, Please report through support@fivoto.com.',
          closeTitle: 'ok',
        });

        Sentry.withScope(function (scope) {
          scope.setTag('screen', 'reportIssue:mail');
          scope.setLevel(Sentry.Severity.Error);
          scope.setContext('data', { description });
          Sentry.captureException(error);
        });
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
          Report Issue
        </Typography>
        <Typography color={COLOR.MUTED}>
          Please be as detailed as possible. What did you try to do and what
          happened instead.
        </Typography>

        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              placeholder="DESCRIBE ISSUE..."
              multiline
              numberOfLines={8}
              blurOnSubmit={false}
              error={errors?.description?.message}
              onBlur={onBlur}
              onChangeText={(description) => onChange(description)}
              value={value}
            />
          )}
          rules={{
            required: 'please describe issue',
          }}
          name="description"
          defaultValue=""
        />

        <Button
          variant="contained"
          large
          style={s.submitButton}
          loading={loading}
          onPress={handleSubmit(_submit)}>
          report
        </Button>
      </Container>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  submitButton: {
    marginTop: SIZE.margin * 2,
  },
});
