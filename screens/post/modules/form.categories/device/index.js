import React, { useContext } from 'react';
import { View } from 'react-native';

import { Context } from '../../context';

import { Negotiable, Condition } from '../common';
import { Brand, Model } from './common';

export default function Device() {
  const { category } = useContext(Context);
  const categoryItem = category.item.split(' ').join('');

  function RenderDevices(category) {
    switch (category) {
      case 'mobilephones':
        return <MobilePhonesTablets />;
      case 'mobilephoneaccessories':
        return <MobilePhoneAccessories />;
      case 'computers&tablets':
        return <ComputersLaptops />;
      case 'computeraccessories':
        return <ComputerLaptopAccessories />;
      case 'videogames&consoles':
        return null;
      case 'otherdevice':
        return null;
    }
  }

  return (
    <View>
      <Negotiable />
      <Condition />
      {RenderDevices(categoryItem)}
    </View>
  );
}

const MobilePhonesTablets = () => {
  return (
    <View>
      <Brand />
      <Model />
    </View>
  );
};

const MobilePhoneAccessories = () => {
  return (
    <View>
      <Brand />
    </View>
  );
};

const ComputersLaptops = () => {
  return (
    <View>
      <Brand />
      <Model />
    </View>
  );
};

const ComputerLaptopAccessories = () => {
  return (
    <View>
      <Brand />
    </View>
  );
};
