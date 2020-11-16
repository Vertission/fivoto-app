import React, { useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import { Container, Button, Toast } from '../../../library';

import { dispatch } from './modules/context';

export default function PostScreen({ navigation }) {
  ////////////////////////////////////
  const { setTabBarVisible } = useContext(
    require('../../navigation/tabs/post').TabBarVisibleContext,
  );
  useFocusEffect(
    React.useCallback(() => setTabBarVisible(true), [setTabBarVisible]),
  ); // blog this
  ////////////////////////////////////

  const onPressNavigateSellType = () => {
    if (!SyncStorage.get('@sign'))
      return Toast({ message: 'Please sign to publish your ads' });
    else {
      dispatch('RESET_CONTEXT');
      return navigation.navigate('Category');
    }
  };

  return (
    <Container>
      <Button variant="contained" large onPress={onPressNavigateSellType}>
        sell
      </Button>
    </Container>
  );
}
