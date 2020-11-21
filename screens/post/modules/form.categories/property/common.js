import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';

import { Context, dispatch } from '../../context';

import { Input, Typography, Picker } from '../../../../../library';

export function Furnishing() {
  const { fields } = useContext(Context);
  const furnishing = ['fully-furnished', 'semi-furnished', 'unfurnished'];

  if (_.isEmpty(fields.furnishing))
    dispatch('SET_FIELDS', { field: 'furnishing', value: furnishing[0] });

  return (
    <Picker
      label="Furnishing"
      pickers={furnishing}
      selectedValue={fields.furnishing}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'furnishing', value })
      }
    />
  );
}

export function LandSize() {
  const { fields } = useContext(Context);

  if (_.isEmpty(fields['land size'])) {
    dispatch('SET_FIELDS', {
      field: 'land size',
      value: { unit: 'perches', area: null },
    });
  }

  return (
    <>
      <Typography style={styles.label}>Area</Typography>
      <View style={styles.landSize}>
        <Input
          underlineColorAndroid="transparent"
          onChangeText={(area) =>
            dispatch('SET_FIELDS', {
              field: 'land size',
              value: { area, unit: fields['land size'].unit },
            })
          }
          value={fields['land size']?.area}
          keyboardType="numeric"
          inputContainerStyle={styles.landSizeInput}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        <Picker
          pickers={['perches', 'arches', 'square feet']}
          style={styles.landSizePicker}
          selectedValue={fields['land size']?.unit}
          onValueChange={(value) =>
            dispatch('SET_FIELDS', {
              field: 'land size',
              value: { area: fields['land size'].area, unit: value },
            })
          }
        />
      </View>
    </>
  );
}

export function Floors() {
  const { fields } = useContext(Context);

  return (
    <Input
      keyboardType="numeric"
      label="Floors"
      maxLength={3}
      value={fields.floors}
      onChangeText={(value) =>
        dispatch('SET_FIELDS', { field: 'floors', value })
      }
    />
  );
}

export function Beds() {
  const { fields } = useContext(Context);

  return (
    <Input
      keyboardType="numeric"
      label="Beds"
      maxLength={2}
      value={fields.beds}
      onChangeText={(value) => dispatch('SET_FIELDS', { field: 'beds', value })}
    />
  );
}

export function Bathrooms() {
  const { fields } = useContext(Context);

  return (
    <Input
      keyboardType="numeric"
      label="Bathrooms"
      maxLength={2}
      value={fields.bathrooms}
      onChangeText={(value) =>
        dispatch('SET_FIELDS', { field: 'bathrooms', value })
      }
    />
  );
}

// NEXT: facility(electricity, water)

const styles = StyleSheet.create({
  landSize: {
    flexDirection: 'row',
    width: '100%',
  },
  landSizeInput: {
    marginBottom: 0,
    marginTop: 0,
    width: '50%',
  },
  landSizePicker: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: '50%',
  },
});
