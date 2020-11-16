import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserScreen from '../../../components/user';
import EditProfileScreen from '../../../components/user/editProfile';
import PublishedAdsScreen from '../../../components/user/publishedAds';
import EmailChangeScreen from '../../../components/user/emailChange';
import EmailConfirmationScreen from '../../../components/user/emailConfirmation';
import PasswordChangeScreen from '../../../components/user/changePassword';

const Stack = createStackNavigator();

export default function Auth() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="User">
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PublishedAds" component={PublishedAdsScreen} />
      <Stack.Screen name="EmailChange" component={EmailChangeScreen} />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
      />
      <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} />
    </Stack.Navigator>
  );
}
