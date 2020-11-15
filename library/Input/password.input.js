import React, { useState } from 'react';
import Input from './index';

export default function (props) {
  const [hide, setHide] = useState(true);

  return (
    <Input
      secureTextEntry={hide}
      autoCapitalize="none"
      autoCompleteType="off"
      icon={hide ? 'eye-off' : 'eye'}
      iconProps={{ touch: true, onPress: () => setHide(!hide) }}
      {...props}
    />
  );
}
