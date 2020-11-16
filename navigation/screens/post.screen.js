import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostScreen from '../../components/post';
import CategoryScreen from '../../components/post/category';
import LocationScreen from '../../components/post/location';
import FormScreen from '../../components/post/form';
import PhotosScreen from '../../components/post/photos';
import DescriptionScreen from '../../components/post/description';

import { Provider } from '../../../app/components/post/modules/context';

const Stack = createStackNavigator();

export default function Post() {
  return (
    <Provider>
      <Stack.Navigator headerMode="none" initialRouteName="Post">
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="Description" component={DescriptionScreen} />
      </Stack.Navigator>
    </Provider>
  );
}

/**
 * NEXT:
 * drafting ads on post screen
 */
