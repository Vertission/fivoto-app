import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { enableScreens } from 'react-native-screens';
import * as Sentry from '@sentry/react-native';

import Home from './tabs/home';
import Search from './tabs/search';
import Post from './tabs/post';
import Account from './tabs/account';

// enableScreens(); // CRASHED:https://github.com/software-mansion/react-native-screens/issues/114

import { Icon } from '../library';
import { SIZE, COLOR } from '../library/Theme';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          Sentry.addBreadcrumb({
            category: 'navigation',
            screen: currentRouteName,
            level: Sentry.Severity.Info,
          });
        }

        routeNameRef.current = currentRouteName;
      }}>
      <TabNavigation />
    </NavigationContainer>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: COLOR.PRIMARY,
        showLabel: false,
        style: {
          backgroundColor: COLOR.WHITE,
          height: SIZE.bottomTabHeight,
          elevation: 0,
        },
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
