import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '../../components/home/module/drawer';
import HomeScreen from '../../components/home';
import BugReportScreen from '../../components/home/bugReport';
import FeatureRequestScreen from '../../components/home/featureRequest';
import ContactUsScreen from '../../components/home/contactUs';
import FAQScreen from '../../components/home/faq';
import ReportIssueScreen from '../../components/home/reportIssue';

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
