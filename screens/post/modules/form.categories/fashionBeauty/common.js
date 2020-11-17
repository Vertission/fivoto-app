import React, { useContext } from 'react';
import _ from 'lodash';

import { Context, dispatch } from '../../context';

import { Radio } from '../../../../../library';

export function Gender({ radios = ['men', 'women', 'unisex'], label }) {
  const { fields } = useContext(Context);

  const data = radios.map((ele) => ({
    label: ele,
  }));

  const lowerCaseLabel = _.lowerCase(label);
  if (_.isEmpty(fields[lowerCaseLabel]))
    dispatch('SET_FIELDS', { field: lowerCaseLabel, value: radios[0] });

  return (
    <Radio
      data={data}
      label="Gender"
      initial={1}
      selectedItem={(item) =>
        dispatch('SET_FIELDS', { field: lowerCaseLabel, value: item.label })
      }
    />
  );
}
