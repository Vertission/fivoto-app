import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import _ from 'lodash';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'react-native-unimodules';
import * as MailComposer from 'expo-mail-composer';
import { useForm, Controller } from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import SyncStorage from 'sync-storage';
import * as Sentry from '@sentry/react-native';

import {
  Button,
  Typography,
  Container,
  Input,
  Header,
  Snackbar,
  Modal,
  Icon,
} from '../../library';
import { SIZE, COLOR } from '../../library/Theme';

import uploadPhotos from '../../setup/firebase/storage/uploadPhotos';

export default function BugReport({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [screenshots, setScreenshots] = useState([]);

  const { control, handleSubmit, errors, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      description: null,
    },
  });

  const _submit = async ({ description }) => {
    try {
      setLoading(true);
      const uris = await uploadPhotos('bugReport', screenshots);

      await firestore()
        .collection('bugReport')
        .add({
          description,
          screenshot: uris,
          user: SyncStorage.get('@user'),
        });

      Modal.show({
        title: 'Bug Reported Successfully',
        description:
          'Thank you for taking time to report this bug, Fivoto team will fix this soon as possible.',
        actions: [
          { title: 'take me home', onPress: () => navigation.navigate('Home') },
        ],
        closeTitle: 'report another bug :)',
      });

      setScreenshots([]);
      reset();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Sentry.withScope(function (scope) {
        scope.setTag('screen', 'bugReport');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { description });
        Sentry.captureException(error);
      });

      MailComposer.composeAsync({
        subject: 'Bug report',
        body: description,
        recipients: ['support@fivoto.com'],
        attachments: screenshots,
      }).catch((error) => {
        Modal.show({
          title: 'Bug Reporting Failed',
          description:
            'Oops! Bug Reporting is temporarily closed, Please report through support@fivoto.com.',
          closeTitle: 'ok',
        });

        Sentry.withScope(function (scope) {
          scope.setTag('screen', 'bugReport:mail');
          scope.setLevel(Sentry.Severity.Error);
          scope.setContext('data', { description });
          Sentry.captureException(error);
        });
      });
    }
  };

  const _pickScreenShots = async () => {
    const CAM_ROLL = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!CAM_ROLL.granted) Snackbar.show('Allow permission for library');

    await Permissions.getAsync(Permissions.CAMERA_ROLL);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
    });

    if (result.cancelled) return null;
    else setScreenshots([...screenshots, result.uri]);
  };

  const RenderScreenshot = ({ uri }) => {
    const _removeScreenshot = () => {
      setScreenshots(_.remove(screenshots, (e) => e !== uri));
    };

    return (
      <View style={s.screenshotContainer}>
        <Icon
          name="remove"
          touch
          size={SIZE.icon * 2}
          color={COLOR.ERROR}
          style={s.removeIcon}
          onPress={_removeScreenshot}
        />
        <Image
          source={{
            uri,
          }}
          style={s.screenshot}
          resizeMode="contain"
        />
      </View>
    );
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
          Bug Report
        </Typography>
        <Typography color={COLOR.MUTED}>
          Please be as detailed as possible. What did you expect and what
          happened instead.
        </Typography>

        {/*  DESCRIPTION  */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              placeholder="DESCRIBE THE BUG..."
              multiline
              numberOfLines={5}
              label="Description"
              blurOnSubmit={false}
              error={errors?.description?.message}
              onBlur={onBlur}
              onChangeText={(description) => onChange(description)}
              value={value}
            />
          )}
          rules={{
            required: 'please describe the bug',
          }}
          name="description"
          defaultValue=""
        />
        <Button
          small
          variant="transparent"
          disabled={screenshots.length > 2} // max up to 3 screenshots
          onPress={_pickScreenShots}>
          screenshots
        </Button>
        {/* DISPLAY SCREENSHOTS  */}
        <View
          style={[
            s.displayScreenShot,
            {
              justifyContent: _.isEmpty(screenshots) ? 'center' : 'flex-start',
            },
          ]}>
          {screenshots.map((shot) => (
            <RenderScreenshot key={shot} uri={shot} />
          ))}
          {_.isEmpty(screenshots) && (
            <Typography variant="caption" color={COLOR.MUTED}>
              Attach Screenshots
            </Typography>
          )}
        </View>

        <Button
          variant="contained"
          large
          loading={loading}
          style={s.reportBugButton}
          onPress={handleSubmit(_submit)}>
          report
        </Button>
      </Container>
    </React.Fragment>
  );
}

const s = StyleSheet.create({
  displayScreenShot: {
    alignItems: 'center',
    borderColor: COLOR.MUTED,
    borderRadius: SIZE.radius,
    borderStyle: 'dashed',
    borderWidth: SIZE.borderWidth,
    flexDirection: 'row',
    height: 150,
    marginBottom: SIZE.margin,
  },
  removeIcon: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  reportBugButton: {
    marginTop: SIZE.margin,
  },
  screenshot: {
    height: '100%',
    width: '100%',
  },
  screenshotContainer: {
    height: 150,
    margin: SIZE.margin / 2,
    width: 80,
  },
});
