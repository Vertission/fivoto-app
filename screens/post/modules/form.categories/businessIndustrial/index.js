import React, { useContext } from 'react';
import { View } from 'react-native';

import { Context } from '../../context';

import { Negotiable, Condition } from '../common';

export default function () {
  const { category } = useContext(Context);

  const categoryItem = category.item.split(' ').join('');

  function RenderVehicles(category) {
    switch (category) {
      case 'machinery&supplies':
        return <MachineriesSupplies />;
      case 'tools&equipments':
        return <ToolsEquipments />;
      case 'rawmaterials&wholesales':
        return null;
      case 'buildingmaterials':
        return null;
      case 'otherbusiness&industrial':
        return null;
    }
  }

  return (
    <View>
      <Negotiable />
      {RenderVehicles(categoryItem)}
    </View>
  );
}

const MachineriesSupplies = () => {
  return <Condition />;
};

const ToolsEquipments = () => {
  return <Condition />;
};
