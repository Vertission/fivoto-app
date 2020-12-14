import React, { useContext } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Permissions } from 'react-native-unimodules';
import _ from 'lodash';

import {
  Typography,
  Container,
  Tab,
  Icon,
  Divider,
  Snackbar,
  Modal,
  Toast,
  Button,
  Header,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';

import { Context } from './modules/context';

import SortPhotos from './modules/photos.sort';
import FormCategory from './modules/form.categories';
import Phone from './modules/phone';
import MutationLoader from './modules/mutationLoader';

import { usePublishMutation, useUpdateMutation } from './modules/hooks';

export default function Form({ navigation }) {
  const [
    publish,
    { loading: publishLoading, status: publishStatus },
  ] = usePublishMutation(navigation);
  const [
    update,
    { loading: updateLoading, status: updateStatus },
  ] = useUpdateMutation(navigation);

  const adContext = useContext(Context);
  const {
    category,
    location,
    description,
    id,
    photos,
    title,
    price,
    phone,
  } = adContext;

  const _onPressPublishAd = async () => {
    if (_.isEmpty(photos)) return Toast({ message: 'please add photos' });
    if (_.isEmpty(title)) return Toast({ message: 'please enter a title' });
    if (_.isEmpty(price)) return Toast({ message: 'please enter a price' });
    if (_.isEmpty(description))
      return Toast({ message: 'please describe your ad' });
    if (_.isEmpty(phone))
      return Toast({ message: 'please add your phone number' });

    if (id) update(adContext);
    else publish(adContext);
  };

  /**
   * library and camera requesting logic
   */
  const _onPressPhotos = async () => {
    const CAM_ROLL = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    const CAM = await Permissions.askAsync(Permissions.CAMERA);

    if (!CAM_ROLL.granted) Snackbar.show('Please Allow permission for library');
    if (!CAM.granted) Snackbar.show('Please Allow permission for camera');

    const CAMERA_ROLL_PERMISSION = await Permissions.getAsync(
      Permissions.MEDIA_LIBRARY,
    );

    if (!CAMERA_ROLL_PERMISSION.canAskAgain) {
      Modal.show({
        title: 'Storage Permission Required',
        description:
          'Fivoto requires permission to access your storage in order to add photos to the ad, You could allow storage permission by opening the app settings.',
        actions: [
          { title: 'open settings', onPress: () => Linking.openSettings() },
        ],
      });
    }

    const CAMERA_PERMISSION = await Permissions.getAsync(Permissions.CAMERA);
    if (!CAMERA_PERMISSION.canAskAgain) {
      Modal.show({
        title: 'Camera Permission Required',
        description:
          'Fivoto requires permission to access your camera in order to add photos to the ad, You could allow camera permission by opening the app settings.',
        actions: [
          { title: 'open settings', onPress: () => Linking.openSettings() },
        ],
      });
    }

    if (CAMERA_ROLL_PERMISSION.granted && CAMERA_PERMISSION.granted) {
      navigation.navigate('Photos');
    }
  };

  if (publishLoading || updateLoading)
    return <MutationLoader status={publishStatus || updateStatus} />;
  else
    return (
      <React.Fragment>
        <Header onPress={() => navigation.navigate('Post')} />
        <Container
          scrollProps={{
            keyboardShouldPersistTaps: 'always',
            showsVerticalScrollIndicator: false,
          }}>
          {/* CATEGORY FIELD  */}
          <View style={styles.selection}>
            <Icon name="pricetag" style={{ width: SIZE.BASE * 2 }} />
            <Typography color={COLOR.MUTED}>Category</Typography>
          </View>
          <Tab
            onPress={() => navigation.navigate('Category', { toForm: true })}>
            {category.item}
          </Tab>
          {/* LOCATION FIELD  */}
          <View style={styles.selection}>
            <Icon name="pin" style={{ width: SIZE.BASE * 2 }} />
            <Typography color={COLOR.MUTED}>Location</Typography>
          </View>
          <Tab
            onPress={() => navigation.navigate('Location', { toForm: true })}>
            {location.city}
          </Tab>
          <Divider />
          {/* PHOTOS FIELD */}
          <View style={styles.selection}>
            <Icon name="photos" style={{ width: SIZE.BASE * 2 }} />
            <Typography color={COLOR.MUTED}>Photos</Typography>
          </View>
          <Tab onPress={_onPressPhotos}>select photos</Tab>
          <SortPhotos />
          <Divider />
          {/* CATEGORY FIELDS */}
          <FormCategory />
          <Divider />
          {/* DESCRIPTION FIELD  */}
          <View style={styles.selection}>
            <Icon name="document" style={{ width: SIZE.BASE * 2 }} />
            <Typography color={COLOR.MUTED}>Description</Typography>
          </View>
          <Tab onPress={() => navigation.navigate('Description')}>
            {description
              ? _.truncate(description.replace(/\n/g, ' '), 10)
              : 'description'}
          </Tab>
          {/* PHONE NUMBERS  */}
          <Phone />
          {/* PUBLISH BUTTON  */}
          <Button large variant="contained" onPress={_onPressPublishAd}>
            {id ? 'save' : 'publish'}
          </Button>
        </Container>
      </React.Fragment>
    );
}

const styles = StyleSheet.create({
  selection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
