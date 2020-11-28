import React from 'react';
import { Share } from 'react-native';

import { Icon, Header } from '../../../../library';
import { SIZE } from '../../../../library/Theme';

export default function AdHeader({ id, onPress }) {
  const _onPressShare = () => {
    Share.share({
      message: ['https://5cc6ba1e159e.ngrok.io', 'ad', id].join('/'),
    });
  };

  const HeaderEndContent = (
    <Icon name="share" size={SIZE.icon * 1.3} touch onPress={_onPressShare} />
  );

  return <Header endContent={HeaderEndContent} onPress={onPress} />;
}
