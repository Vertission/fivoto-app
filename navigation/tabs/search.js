import React, { useEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from '../../screens/search';
import CategoryScreen from '../../screens/search/category';
import LocationScreen from '../../screens/search/location';
import AdScreen from '../../screens/search/ad';

import { Provider } from '../../screens/search/modules/context';

const Stack = createStackNavigator();

export default function Search({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Search';

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: ['Search'].includes(routeName),
    });
  }, [navigation, routeName]);

  return <SearchStack />;
}

function SearchStack() {
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
