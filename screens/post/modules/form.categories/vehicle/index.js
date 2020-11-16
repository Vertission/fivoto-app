import React, { useContext } from 'react';
import { View } from 'react-native';
import _ from 'lodash';

import { Context, dispatch } from '../../context';

import { Negotiable, Picker } from '../common';
import {
  Model,
  Make,
  Condition,
  Registration,
  Year,
  Engine,
  Trim,
  Fuel,
  Mileage,
} from './common';

export default function () {
  const { category } = useContext(Context);

  const categoryItem = category.item.split(' ').join('');

  function RenderVehicles(category) {
    switch (category) {
      case 'cars&vans':
        return <CarsVans />;
      case 'bikes&scooters':
        return <BikesScooters />;
      case 'three-wheelers':
        return <ThreeWheelers />;
      case 'lorries&heavyvehicles':
        return <LorriesHeavyVehicles />;
      case 'boats&watertransports':
        return <BoatsWaterTransports />;
      case 'autoparts&Accessories':
        return <AutoPartsAccessories />;
      case 'othervehicle':
        return null;
    }
  }

  return (
    <View>
      {/* NEGOTIABLE  */}
      <Negotiable />
      <View>{RenderVehicles(categoryItem)}</View>
    </View>
  );
}

const CarsVans = () => {
  const { fields } = useContext(Context);
  const bodies = [
    'SUV',
    'Van',
    'Hatchback',
    'Sedan',
    'coupe',
    'Convertible',
    'Wagon',
    'Jeep',
    'Truck',
    'Custom',
  ];

  const transmission = ['Manual', 'Automatic', 'Tiptronic'];

  if (_.isEmpty(fields.body))
    dispatch('SET_FIELDS', { field: 'body', value: bodies[0] });
  if (_.isEmpty(fields.transmission))
    dispatch('SET_FIELDS', { field: 'transmission', value: transmission[0] });

  return (
    <View>
      {/* MAKE  */}
      <Make />
      {/* MODEL  */}
      <Model />
      {/* TRIM  */}
      <Trim />
      {/* CONDITION  */}
      <Condition />
      {/* REGISTRATION  */}
      <Registration />
      {/* YEAR  */}
      <Year />
      {/* BODY  */}
      <Picker label="Body" pickers={bodies} />
      {/* TRANSMISSION  */}
      <Picker label="Transmission" pickers={transmission} />
      {/* ENGINE  */}
      <Engine />
      {/* FUEL  */}
      <Fuel />
      {/* MILEAGE  */}
      <Mileage />
    </View>
  );
};

const BikesScooters = () => {
  return (
    <View>
      {/* MAKE  */}
      <Make />
      {/* MODEL  */}
      <Model />
      {/* CONDITION  */}
      <Condition />
      {/* REGISTER  */}
      <Registration />
      {/* YEAR  */}
      <Year />
      {/* MILEAGE  */}
      <Mileage />
    </View>
  );
};

const ThreeWheelers = () => {
  return (
    <View>
      {/* MAKE  */}
      <Make />
      {/* MODEL  */}
      <Model />
      {/* CONDITION  */}
      <Condition />
      {/* REGISTER  */}
      <Registration />
      {/* YEAR  */}
      <Year />
      {/* MILEAGE  */}
      <Mileage />
    </View>
  );
};

const LorriesHeavyVehicles = () => {
  return (
    <View>
      {/* MAKE  */}
      <Make />
      {/* MODEL  */}
      <Model />
      {/* CONDITION  */}
      <Condition />
      {/* REGISTER  */}
      <Registration />
      {/* YEAR  */}
      <Year />
      {/* MILEAGE  */}
      <Mileage />
    </View>
  );
};

const BoatsWaterTransports = () => {
  return (
    <View>
      {/* MAKE  */}
      <Make />
      {/* MODEL  */}
      <Model />
      {/* CONDITION  */}
      <Condition />
      {/* REGISTER  */}
      <Registration />
      {/* YEAR  */}
      <Year />
      {/* MILEAGE  */}
      <Mileage />
    </View>
  );
};

const AutoPartsAccessories = () => {
  return (
    <View>
      {/* CONDITION  */}
      <Condition />
    </View>
  );
};
