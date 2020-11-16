import React, { useContext, useRef } from 'react';
import { View } from 'react-native';
import NumberFormat from 'react-number-format';

import { Input } from '../../../../../library';

import { SIZE } from './style';
import { Context, dispatch } from '../context';

import Device from './device';
import Vehicle from './vehicle';
import Property from './property';
import AppliancesFurniture from './appliancesFurniture';
import FashionBeauty from './fashionBeauty';
import SportHobby from './sportHobby';
import PetsAnimal from './petsAnimal';
import BusinessIndustrial from './businessIndustrial';
import FoodAgriculture from './foodAgriculture';

export default function FormCategory() {
  const priceRef = useRef(null);

  const { category, title, price } = useContext(Context);

  const RenderCategory = (categoryField) => {
    switch (categoryField) {
      case 'device':
        return <Device />;
      case 'vehicle':
        return <Vehicle />;
      case 'property':
        return <Property />;
      case 'appliances & furniture':
        return <AppliancesFurniture />;
      case 'fashion & Beauty':
        return <FashionBeauty />;
      case 'sports & hobby':
        return <SportHobby />;
      case 'pet & animal':
        return <PetsAnimal />;
      case 'business & industrial':
        return <BusinessIndustrial />;
      case 'food & agriculture':
        return <FoodAgriculture />;
      case 'other':
        return <View style={{ marginBottom: SIZE.margin }} />;
    }
  };

  return (
    <View>
      {/* TITLE FILED  */}
      <Input
        label="Title"
        returnKeyType="next"
        blurOnSubmit={false}
        maxLength={50}
        value={title}
        onSubmitEditing={() => priceRef.current.focus()}
        onChangeText={(value) => dispatch('SET_TITLE', value)}
        helper="required*"
        placeholder="YOUR AD TITLE"
      />

      {/* PRICE FILED */}
      <NumberFormat
        value={price}
        displayType={'text'}
        inputMode="numeric"
        thousandSeparator={true}
        renderText={(value) => {
          return (
            <Input
              setRef={priceRef}
              underlineColorAndroid="transparent"
              onChangeText={(value) => dispatch('SET_PRICE', value)}
              value={value}
              keyboardType="numeric"
              maxLength={21}
              label="Price"
              helper="required*"
              placeholder="YOUR AD PRICE"
              inputContainerStyle={{
                marginTop: SIZE.margin,
              }}
            />
          );
        }}
      />

      {RenderCategory(category.field)}
    </View>
  );
}
