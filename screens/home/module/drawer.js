import React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, StyleSheet, Linking } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { version } from '../../../package.json';

import { DrawerContentScrollView } from '@react-navigation/drawer';

import { Icon, Drawer, Typography } from '../../../library';
import { SIZE, COLOR } from '../../../library/Theme';

export default function DrawerComponent(props) {
  const routeName = getFocusedRouteNameFromRoute(props.route) ?? 'Home';

  return (
    <View style={s.root}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        {/* HOME SCREEN  */}

        <Drawer.Item
          icon="home"
          selected={routeName === 'Home'}
          onPress={() => props.navigation.navigate('Home')}>
          Home
        </Drawer.Item>
        {/* <Drawer.Item
          icon="information-circle"
          onPress={() => props.navigation.navigate('AboutUs')}>
          About Us
        </Drawer.Item> */}
        {/* <Drawer.Item
          icon="document"
          onPress={() => props.navigation.navigate('AboutUs')}>
          Terms & Conditions
        </Drawer.Item> */}
        {/* <Drawer.Item
          icon="lock"
          onPress={() => props.navigation.navigate('AboutUs')}>
          Stay Safe
        </Drawer.Item> */}
        {/* HELP AND SUPPORT  */}
        <Drawer.Title>help & support</Drawer.Title>
        {/* <Drawer.Item
          icon="chatboxes"
          selected={routeName === 'FAQ'}
          onPress={() => props.navigation.navigate('FAQ')}>
          FAQ
        </Drawer.Item> */}
        <Drawer.Item
          icon="contacts"
          selected={routeName === 'ContactUs'}
          onPress={() => props.navigation.navigate('ContactUs')}>
          Contact Us
        </Drawer.Item>

        {/* FEEDBACK SECTION  */}
        <Drawer.Title>feedback</Drawer.Title>
        <Drawer.Item
          icon="chatbubbles"
          selected={routeName === 'Feedback'}
          onPress={() => props.navigation.navigate('Feedback')}>
          Feedback
        </Drawer.Item>
        <Drawer.Item
          icon="bug"
          selected={routeName === 'BugReport'}
          onPress={() => props.navigation.navigate('BugReport')}>
          Bug Report
        </Drawer.Item>
        {/* <Drawer.Item
          icon="logo-android"
          onPress={() =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.vertission.fivoto',
            )
          }>
          Rate Us On Play Store
        </Drawer.Item> */}

        {/* SOCIAL MEDIA  */}
        <Drawer.Title>social medias</Drawer.Title>
        <Drawer.Content style={s.socialMedia}>
          <Icon
            name="logo-instagram"
            touch
            size={SIZE.icon * 1.6}
            color="#fe4164"
            onPress={() => Linking.openURL('http://instagram.com/_u/fivoto')}
          />
          <Icon
            name="logo-facebook"
            touch
            size={SIZE.icon * 1.6}
            color="#3b5998"
            onPress={() => Linking.openURL('https://www.facebook.com/fivoto')}
          />
          <Icon
            name="logo-twitter"
            touch
            size={SIZE.icon * 1.6}
            color="#00acee"
            onPress={() => Linking.openURL('https://twitter.com/fivoto')}
          />
        </Drawer.Content>
      </DrawerContentScrollView>
      <Typography variant="caption" family="bold" color={COLOR.MUTED}>
        {getVersion()}{' '}
        {getVersion() !== version && (
          <Typography
            color={COLOR.PRIMARY}
            family="boldX"
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.vertission.fivoto',
              )
            }>
            Update Available
          </Typography>
        )}
      </Typography>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    margin: SIZE.margin,
  },
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
