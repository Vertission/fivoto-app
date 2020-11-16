import React, { useContext } from 'react';
import { View } from 'react-native';
import _ from 'lodash';

import { Context } from '../../context';

import { Negotiable, Picker } from '../common';
import { Beds, Bathrooms, Furnishing, Floors, LandSize } from './common';

export default function () {
  const { category } = useContext(Context);

  const categoryItem = category.item.split(' ').join('');

  function RenderVehicles(category) {
    switch (category) {
      case 'houses&apartments':
        return <HousesApartments />;
      case 'commercialproperties':
        return <CommercialProperties />;
      case 'lands':
        return <Lands />;
      case 'newdevelopments':
        return <NewDevelopments />;
      case 'otherproperty':
        return <Other />;
    }
  }

  return (
    <View>
      {/* NEGOTIABLE  */}
      <Negotiable />
      {RenderVehicles(categoryItem)}
    </View>
  );
}

const HousesApartments = () => {
  return (
    <View>
      {/* TYPE  */}
      <Picker
        label="Property Type"
        pickers={['apartment', 'house', 'bungalow', 'villa', 'other']}
      />
      {/* BEDS  */}
      <Beds />
      {/* BATHROOMS  */}
      <Bathrooms />
      {/* FURNISHING  */}
      <Furnishing />
      {/* LAND SIZE  */}
      <LandSize />
      {/* FLOORS  */}
      <Floors />
    </View>
  );
};

const CommercialProperties = () => {
  return (
    <View>
      {/* TYPE  */}
      <Picker
        label="Property Type"
        pickers={[
          'shop',
          'office',
          'building',
          'factory',
          'warehouse',
          'other',
        ]}
      />
      {/* LAND SIZE  */}
      <LandSize />
      {/* FLOORS  */}
      <Floors />
    </View>
  );
};

const Lands = () => {
  return (
    <View>
      {/* LAND SIZE  */}
      <LandSize />
    </View>
  );
};

const NewDevelopments = () => {
  return (
    <View>
      {/* BEDS  */}
      <Beds />
      {/* BATHROOMS  */}
      <Bathrooms />
      {/* FURNISHING  */}
      <Furnishing />
      {/* LAND SIZE  */}
      <LandSize />
      {/* FLOORS  */}
      <Floors />
    </View>
  );
};

const Other = () => {
  return (
    <View>
      {/* LAND SIZE  */}
      <LandSize />
    </View>
  );
};
