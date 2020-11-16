import React, { useContext } from 'react';
import { View } from 'react-native';

import { Context } from '../../context';

import { Negotiable } from '../common';
import { Gender } from './common';

export default function () {
  const { category } = useContext(Context);

  const categoryItem = category.item.split(' ').join('');

  function RenderVehicles(category) {
    switch (category) {
      case 'mensclothing':
        return null;
      case 'womansclothing':
        return null;
      case 'kids&babiesclothing':
        return <KidsBabiesClothing />;
      case 'clothing&fashionaccessories':
        return <ClothingFashionAccessories />;
      case 'footwears':
        return <Footwears />;
      case 'bags&Luggages':
        return <BagsLuggages />;
      case 'cosmetics&beautyproducts':
        return <CosmeticsBeautyProducts />;
      case 'otherfashion&garments':
        return <OtherFashionGarment />;
    }
  }

  return (
    <View>
      <Negotiable />
      {RenderVehicles(categoryItem)}
    </View>
  );
}

const KidsBabiesClothing = () => {
  return (
    <View>
      <Gender label="Gender" radios={['boy', 'girl', 'unisex']} />
    </View>
  );
};

const ClothingFashionAccessories = () => {
  return (
    <View>
      <Gender label="Gender" />
    </View>
  );
};

const Footwears = () => {
  return (
    <View>
      <Gender label="Gender" />
    </View>
  );
};

const BagsLuggages = () => {
  return (
    <View>
      <Gender label="Gender" />
    </View>
  );
};

const CosmeticsBeautyProducts = () => {
  return (
    <View>
      <Gender label="Gender" />
    </View>
  );
};

const OtherFashionGarment = () => {
  return (
    <View>
      <Gender label="Gender" />
    </View>
  );
};
