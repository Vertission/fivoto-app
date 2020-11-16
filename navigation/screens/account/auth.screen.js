import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from '../../../components/auth';
import RegisterScreen from '../../../components/auth/register';
import LoginScreen from '../../../components/auth/login';
import EmailConfirmationScreen from '../../../components/auth/emailConfirmation';
import ForgotPasswordScreen from '../../../components/auth/forgotPassword';
import ResetPasswordScreen from '../../../components/auth/resetPassword';

const Stack = createStackNavigator();

export default function Auth() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
