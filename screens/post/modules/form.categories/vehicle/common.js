import React, { useContext } from 'react';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

import { Context, dispatch } from '../../context';

import { Input, Picker } from '../../../../../library';

import { styles } from '../style';

export function Condition() {
  const { fields } = useContext(Context);
  const pickers = ['brand new', 'reconditioned', 'used'];

  if (_.isEmpty(fields.condition))
    dispatch('SET_FIELDS', { field: 'condition', value: pickers[0] });

  return (
    <Picker
      label="Condition"
      pickers={pickers}
      selectedValue={fields.condition}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'condition', value })
      }
      style={styles.inputSpacing}
    />
  );
}

export function Registration() {
  const { fields } = useContext(Context);
  const pickers = ['registered', 'unregistered', 'other'];

  if (_.isEmpty(fields.register))
    dispatch('SET_FIELDS', { field: 'register', value: pickers[0] });

  return (
    <Picker
      label="Registration"
      pickers={pickers}
      selectedValue={fields.register}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'registration', value })
      }
      style={styles.inputSpacing}
    />
  );
}

export function Make() {
  const { fields } = useContext(Context);

  return (
    <Input
      label="Make"
      value={fields.make}
      onChangeText={(value) => dispatch('SET_FIELDS', { field: 'make', value })}
    />
  );
}

export function Model() {
  const { fields } = useContext(Context);

  return (
    <Input
      label="Model"
      value={fields.model}
      onChangeText={(value) =>
        dispatch('SET_FIELDS', { field: 'model', value })
      }
    />
  );
}

export function Trim() {
  const { fields } = useContext(Context);

  return (
    <Input
      label="Trim"
      value={fields.trim}
      onChangeText={(value) => dispatch('SET_FIELDS', { field: 'trim', value })}
    />
  );
}

export function Year() {
  const { fields } = useContext(Context);

  return (
    <Input
      underlineColorAndroid="transparent"
      keyboardType="numeric"
      label="Year"
      maxLength={4}
      value={fields.year}
      onChangeText={(value) => dispatch('SET_FIELDS', { field: 'year', value })}
    />
  );
}

export function Engine() {
  const { fields } = useContext(Context);

  return (
    <NumberFormat
      value={fields.engine}
      displayType={'text'}
      thousandSeparator={true}
      renderText={(value) => {
        return (
          <Input
            underlineColorAndroid="transparent"
            value={value}
            keyboardType="numeric"
            label="Engine"
            maxLength={20}
            onChangeText={(value) =>
              dispatch('SET_FIELDS', { field: 'engine', value })
            }
          />
        );
      }}
    />
  );
}

export function Fuel() {
  const { fields } = useContext(Context);
  const pickers = ['diesel', 'petrol', 'hybrid', 'electric', 'other'];

  if (_.isEmpty(fields.fuel))
    dispatch('SET_FIELDS', { field: 'fuel', value: pickers[0] });

  return (
    <Picker
      label="Fuel"
      pickers={pickers}
      selectedValue={fields.fuel}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'fuel', value })
      }
    />
  );
}

export function Mileage() {
  const { fields } = useContext(Context);

  return (
    <NumberFormat
      displayType={'text'}
      thousandSeparator={true}
      value={fields.mileage}
      renderText={(value) => {
        return (
          <Input
            underlineColorAndroid="transparent"
            value={value}
            keyboardType="numeric"
            label="Mileage"
            onChangeText={(value) =>
              dispatch('SET_FIELDS', { field: 'mileage', value })
            }
          />
        );
      }}
    />
  );
}
