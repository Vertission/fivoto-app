import React, { useEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '../../screens/home/module/drawer';
import HomeScreen from '../../screens/home';
import BugReportScreen from '../../screens/home/bugReport';
import FeatureRequestScreen from '../../screens/home/featureRequest';
import ContactUsScreen from '../../screens/home/contactUs';
import FAQScreen from '../../screens/home/faq';
import ReportIssueScreen from '../../screens/home/reportIssue';

export default function Home({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: ['Home'].includes(routeName),
    });
  }, [navigation, routeName]);

  return <HomeDrawer route={route} />;
}

const Drawer = createDrawerNavigator();

function HomeDrawer({ route }) {
  return (
    <Drawer.Navigator
      headerMode="none"
      initialRouteName="Home"
      drawerType="slide"
      drawerContent={(props) => <CustomDrawer {...props} route={route} />}>
      <Drawer.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Drawer.Screen
        name="FAQ"
        options={{ headerShown: false }}
        component={FAQScreen}
      />
      <Drawer.Screen
        name="ContactUs"
        options={{ headerShown: false }}
        component={ContactUsScreen}
      />
      <Drawer.Screen
        name="FeatureRequest"
        options={{ headerShown: false }}
        component={FeatureRequestScreen}
      />
      <Drawer.Screen
        name="BugReport"
        options={{ headerShown: false }}
        component={BugReportScreen}
      />
      <Drawer.Screen
        name="ReportIssue"
        options={{ headerShown: false }}
        component={ReportIssueScreen}
      />
    </Drawer.Navigator>
  );
}
