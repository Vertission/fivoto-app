import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import { Input, Icon, Typography } from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';

import { dispatch, Context } from './context';

export default function Phone() {
  const { phone } = useContext(Context);
  const [number, setNumber] = useState(null);

  const maxPhones = phone.length === 3;

  const _onPressAddNumber = () => {
    if (_.size(number) !== 10) return null;
    if (phone.includes(number)) return setNumber(null);
    const numbers = [...phone, number];
    dispatch('SET_PHONE', numbers);
    setNumber(null);
  };

  const _onPressRemoveNumber = (number) => {
    const existPhones = _.remove(phone, (n) => n !== number);
    dispatch('SET_PHONE', existPhones);
  };

  return (
    <View>
      <Input
        disabled={maxPhones}
        label={maxPhones ? 'max up to 3 phone numbers' : 'Phone'}
        icon="add"
        placeholder="ENTER YOUR PHONE NUMBERS"
        maxLength={10}
        type="phone-pad"
        autoCompleteType="email"
        value={number}
        onChangeText={setNumber}
        iconProps={{
          touch: true,
          onPress: _onPressAddNumber,
          disabled: _.size(number) !== 10,
        }}
        onSubmitEditing={_onPressAddNumber}
      />
      <View>
        {phone.map((number) => (
          <View style={s.numberContainer} key={number}>
            <Typography variant="h2" style={s.number}>
              {number}
            </Typography>
            <Icon
              name="trash"
              touch
              size={SIZE.icon * 1.3}
              color={COLOR.ERROR}
              onPress={() => _onPressRemoveNumber(number)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  number: {
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  numberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: SIZE.margin / 2,
  },
});
