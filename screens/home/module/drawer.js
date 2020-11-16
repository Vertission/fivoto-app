import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';

import { DrawerContentScrollView } from '@react-navigation/drawer';

import { Icon, Drawer } from '../../../../library';
import { SIZE } from '../../../../library/Theme';

export default function DrawerComponent(props) {
  return (
    <View style={s.root}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        {/* HOME SCREEN  */}

        <Drawer.Item
          icon="home"
          selected={props.state.index === 0}
          onPress={() => props.navigation.navigate('Home')}>
          Home
        </Drawer.Item>
        <Drawer.Item
          icon="information-circle"
          onPress={() => props.navigation.navigate('AboutUs')}>
          About Us
        </Drawer.Item>
        <Drawer.Item
          icon="document"
          onPress={() => props.navigation.navigate('AboutUs')}>
          Terms & Conditions
        </Drawer.Item>
        <Drawer.Item
          icon="lock"
          onPress={() => props.navigation.navigate('AboutUs')}>
          Stay Safe
        </Drawer.Item>

        {/* HELP AND SUPPORT  */}
        <Drawer.Title>help & support</Drawer.Title>
        <Drawer.Item
          icon="chatboxes"
          selected={props.state.index === 1}
          onPress={() => props.navigation.navigate('FAQ')}>
          FAQ
        </Drawer.Item>
        <Drawer.Item
          icon="contacts"
          selected={props.state.index === 2}
          onPress={() => props.navigation.navigate('ContactUs')}>
          Contact Us
        </Drawer.Item>

        {/* FEEDBACK SECTION  */}
        <Drawer.Title>feedback</Drawer.Title>
        <Drawer.Item
          icon="bulb"
          selected={props.state.index === 3}
          onPress={() => props.navigation.navigate('FeatureRequest')}>
          Feature Request
        </Drawer.Item>
        <Drawer.Item
          icon="bug"
          selected={props.state.index === 4}
          onPress={() => props.navigation.navigate('BugReport')}>
          Bug Report
        </Drawer.Item>
        <Drawer.Item
          icon="logo-android"
          selected={props.state.index === 5}
          onPress={() => props.navigation.navigate('BugReport')}>
          Rate Us On Play Store
        </Drawer.Item>

        {/* SOCIAL MEDIA  */}
        <Drawer.Title>social medias</Drawer.Title>
        <Drawer.Content style={s.socialMedia}>
          <Icon
            name="logo-instagram"
            touch
            size={SIZE.icon * 1.5}
            onPress={() => Linking.openURL('http://instagram.com/_u/fivoto')}
          />
          <Icon
            name="logo-facebook"
            touch
            size={SIZE.icon * 1.5}
            onPress={() => Linking.openURL('https://www.facebook.com/fivoto')}
          />
          <Icon
            name="logo-twitter"
            touch
            size={SIZE.icon * 1.5}
            onPress={() => Linking.openURL('https://twitter.com/fivoto')}
          />
        </Drawer.Content>
      </DrawerContentScrollView>
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
