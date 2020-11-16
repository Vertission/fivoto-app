import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from '../../components/search';
import CategoryScreen from '../../components/search/category';
import LocationScreen from '../../components/search/location';
import AdScreen from '../../components/search/ad';

import { Provider } from '../../components/search/modules/context';

const Stack = createStackNavigator();

export default function Auth() {
  return (
    <Provider>
      <Stack.Navigator headerMode="none" initialRouteName="Search">
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Ad" component={AdScreen} />
      </Stack.Navigator>
    </Provider>
  );
}
