import React, { useEffect } from 'react';
import HomeScreen from '../screens/home.screen';

export default function Home({ navigation, route }) {
  useEffect(() => {
    if (route.state?.index) {
      navigation.setOptions({
        tabBarVisible: false,
      });
    } else {
      navigation.setOptions({
        tabBarVisible: true,
      });
    }

    return navigation.setOptions({});
    // disabled this line else "TypeError: undefined is not an object (evaluating 'route.state.index')"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.state?.index]);

  return <HomeScreen />;
}
