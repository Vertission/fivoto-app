import React, { useEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SyncStorage from 'sync-storage';

import AuthScreen from '../../screens/auth';
import LoginScreen from '../../screens/auth/login';
import RegsiterScreen from '../../screens/auth/register';
import EmailConfirmationScreen from '../../screens/auth/emailConfirmation';
import ForgotPasswordScreen from '../../screens/auth/forgotPassword';
import ResetPasswordScreen from '../../screens/auth/resetPassword';

import UserScreen from '../../screens/user';
import EditProfileScreen from '../../screens/user/editProfile';
import PublishedAdsScreen from '../../screens/user/publishedAds';
import EmailChangeScreen from '../../screens/user/emailConfirmation';
import UserEmailConfirmationScreen from '../../screens/user/emailConfirmation'; // NEXT: seems duplicate @ '../../screens/auth/emailConfirmation';
import PasswordChangeScreen from '../../screens/user/changePassword';

const AuthStack = createStackNavigator();
const UserStack = createStackNavigator();

export default function Account({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Auth';

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: ['Auth', 'User'].includes(routeName),
    });
  }, [navigation, routeName]);

  if (SyncStorage.get('@sign')) return <User />;
  else return <Auth />;
}

function Auth() {
  return (
    <AuthStack.Navigator headerMode="none" initialRouteName="Auth">
      <AuthStack.Screen name="Auth" component={AuthScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegsiterScreen} />
      <AuthStack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function User() {
  return (
    <UserStack.Navigator headerMode="none" initialRouteName="User">
      <UserStack.Screen name="User" component={UserScreen} />
      <UserStack.Screen name="EditProfile" component={EditProfileScreen} />
      <UserStack.Screen name="PublishedAds" component={PublishedAdsScreen} />
      <UserStack.Screen name="EmailChange" component={EmailChangeScreen} />
      <UserStack.Screen
        name="EmailConfirmation"
        component={UserEmailConfirmationScreen}
      />
      <UserStack.Screen
        name="PasswordChange"
        component={PasswordChangeScreen}
      />
    </UserStack.Navigator>
  );
}
