import React from 'react';
import analytics from '@react-native-firebase/analytics';
import Share from 'react-native-share';

import { Icon, Header } from '../../../../../library';
import { SIZE } from '../../../../../library/Theme';

export default function AdHeader({ id }) {
  const _onPressShare = () => {
    Share.open({ message: id }).then(async ({ app }) => {
      await analytics().logShare({
        content_type: 'ad',
        item_id: id,
        method: app,
      });
    });
  };

  const HeaderEndContent = (
    <Icon name="share" size={SIZE.icon * 1.3} touch onPress={_onPressShare} />
  );

  return <Header endContent={HeaderEndContent} />;
}
