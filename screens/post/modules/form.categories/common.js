import React, { useContext } from 'react';
import _ from 'lodash';

import { Picker as ElementPicker, CheckBox } from '../../../../../library';
import { SIZE } from '../../../../../library/Theme';

import { Context, dispatch } from '../context';

export function Negotiable() {
  const { fields } = useContext(Context);

  return (
    <CheckBox
      disabled={false}
      value={fields.negotiable}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'negotiable', value })
      }
      label="Negotiable"
    />
  );
}

export function Condition() {
  const { fields } = useContext(Context);
  if (_.isEmpty(fields.condition))
    dispatch('SET_FIELDS', { field: 'condition', value: 'new' });

  return (
    <ElementPicker
      label="Condition"
      pickers={['new', 'used']}
      selectedValue={fields.condition}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: 'condition', value })
      }
      containerStyle={{ marginTop: SIZE.margin }}
    />
  );
}

export function Picker({ label, pickers, rest }) {
  const { fields } = useContext(Context);
  const lowerCaseLabel = label.toLowerCase();

  if (_.isEmpty(fields[lowerCaseLabel]))
    dispatch('SET_FIELDS', { field: lowerCaseLabel, value: pickers[0] });

  return (
    <ElementPicker
      label={label}
      pickers={pickers}
      selectedValue={fields[lowerCaseLabel]}
      onValueChange={(value) =>
        dispatch('SET_FIELDS', { field: lowerCaseLabel, value })
      }
      {...rest}
    />
  );
}
