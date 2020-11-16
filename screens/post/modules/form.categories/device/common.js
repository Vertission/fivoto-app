import React, { useContext } from 'react';

import { Context, dispatch } from '../../context';

import { Input } from '../../../../../../library';

export function Brand() {
  const { fields } = useContext(Context);

  return (
    <Input
      label="Brand"
      maxLength={124}
      value={fields.brand}
      onChangeText={(value) =>
        dispatch('SET_FIELDS', { field: 'brand', value })
      }
    />
  );
}

export function Model() {
  const { fields } = useContext(Context);

  return (
    <Input
      label="Model"
      maxLength={124}
      value={fields.model}
      onChangeText={(value) =>
        dispatch('SET_FIELDS', { field: 'model', value })
      }
    />
  );
}
