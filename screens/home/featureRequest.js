import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import _ from 'lodash';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'react-native-unimodules';
import { useForm, Controller } from 'react-hook-form';
import * as MailComposer from 'expo-mail-composer';
import firestore from '@react-native-firebase/firestore';
import SyncStorage from 'sync-storage';
import * as Sentry from '@sentry/react-native';

import {
  Button,
  Typography,
  Container,
  Modal,
  Input,
  Header,
  Snackbar,
  Icon,
} from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';

import uploadPhotos from '../../../setup/firebase/storage/uploadPhotos';

export default function FeatureRequest({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const { control, handleSubmit, errors, reset } = useForm({
    mode: 'onBlur',
    defaultValues: {
      description: null,
    },
  });

  const _submit = async ({ description }) => {
    try {
      setLoading(true);
      const uris = await uploadPhotos('featureRequest', photos)();

      await firestore()
        .collection('featureRequest')
        .add({
          description,
          photos: uris,
          user: SyncStorage.get('@user'),
        });

      Modal.show({
        title: 'Feature Requested Successfully',
        description: 'Thank you for requesting feature.',
        actions: [
          { title: 'take me home', onPress: () => navigation.navigate('Home') },
        ],
        closeTitle: 'request another feature :)',
      });

      setPhotos([]);
      reset();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Sentry.withScope(function (scope) {
        scope.setTag('screen', 'featureRequest');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { description });
        Sentry.captureException(error);
      });

      MailComposer.composeAsync({
        subject: 'Feature request',
        body: description,
        recipients: ['support@fivoto.com'],
        attachments: 'photos',
      }).catch((error) => {
        Modal.show({
          title: 'Feature Request Failed',
          description:
            'Oops! Feature requesting is temporarily closed, Please request feature through support@fivoto.com.',
          closeTitle: 'ok',
        });

        Sentry.withScope(function (scope) {
          scope.setTag('screen', 'featureRequest:mail');
          scope.setLevel(Sentry.Severity.Error);
          scope.setContext('data', { description });
          Sentry.captureException(error);
        });
      });
    }
  };

  const _pickScreenPhotos = async () => {
    const CAM_ROLL = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!CAM_ROLL.granted) Snackbar.show('Allow permission for library');

    await Permissions.getAsync(Permissions.CAMERA_ROLL);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
    });

    if (result.cancelled) return null;
    else setPhotos([...photos, result.uri]);
  };

  const RenderScreenshot = ({ uri }) => {
    const _removeScreenshot = () => {
      setPhotos(_.remove(photos, (e) => e !== uri));
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
          Feature Request
        </Typography>
        <Typography color={COLOR.MUTED}>
          Have a new idea? or need to improve any existing feature?
        </Typography>

        {/*  DESCRIPTION  */}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Input
              placeholder="DESCRIBE YOUR FEATURE..."
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
            required: 'please describe your feature',
          }}
          name="description"
          defaultValue=""
        />
        <Button
          small
          variant="transparent"
          disabled={photos.length > 2} // max up to 3 setPhotos
          onPress={_pickScreenPhotos}>
          photos
        </Button>
        {/* DISPLAY photos  */}
        <View
          style={[
            s.displayScreenShot,
            {
              justifyContent: _.isEmpty(photos) ? 'center' : 'flex-start',
            },
          ]}>
          {photos.map((shot) => (
            <RenderScreenshot key={shot} uri={shot} />
          ))}
          {_.isEmpty(photos) && (
            <Typography variant="caption" color={COLOR.MUTED}>
              Attach Photos
            </Typography>
          )}
        </View>

        <Button
          variant="contained"
          large
          style={s.submitButton}
          loading={loading}
          onPress={handleSubmit(_submit)}>
          request
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
  screenshot: {
    height: '100%',
    width: '100%',
  },
  screenshotContainer: {
    height: 150,
    margin: SIZE.margin / 2,
    width: 80,
  },
  submitButton: {
    marginTop: SIZE.margin,
  },
});
