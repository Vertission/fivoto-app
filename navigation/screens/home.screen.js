import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '../../screens/home/module/drawer';
import HomeScreen from '../../screens/home';
import BugReportScreen from '../../screens/home/bugReport';
import FeatureRequestScreen from '../../screens/home/featureRequest';
import ContactUsScreen from '../../screens/home/contactUs';
import FAQScreen from '../../screens/home/faq';
import ReportIssueScreen from '../../screens/home/reportIssue';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType="slide"
      openByDefault={false}
      drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="FAQ" component={FAQScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
      <Drawer.Screen name="FeatureRequest" component={FeatureRequestScreen} />
      <Drawer.Screen name="BugReport" component={BugReportScreen} />
      <Drawer.Screen name="ReportIssue" component={ReportIssueScreen} />
    </Drawer.Navigator>
  );
}
