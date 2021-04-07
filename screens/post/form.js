import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import {
  Typography,
  Container,
  Tab,
  Icon,
  Divider,
  Toast,
  Button,
  Header,
} from '../../library';
import { COLOR, SIZE } from '../../library/Theme';

import { Context } from './modules/context';

import Fields from './modules/fields';

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

          <Fields />

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
