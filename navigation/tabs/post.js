import React, { useEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PostScreen from '../../screens/post';
import CategoryScreen from '../../screens/post/category';
import LocationScreen from '../../screens/post/location';
import FormScreen from '../../screens/post/form';
import PhotosScreen from '../../screens/post/photos';
import DescriptionScreen from '../../screens/post/description';

import { Provider } from '../../screens/post/modules/context';

const Stack = createStackNavigator();

export default function Post({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Post';

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: ['Post'].includes(routeName),
    });
  }, [navigation, routeName]);

  return <PostStack />;
}

function PostStack() {
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
