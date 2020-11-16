import React, { createContext, useEffect, useState } from 'react';
import SearchScreen from '../screens/search.screen';

export const TabBarVisibleContext = createContext(null);

export default function Post({ navigation }) {
  const [tabBarVisible, setTabBarVisible] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: tabBarVisible,
    });
  }, [navigation, tabBarVisible]);

  return (
    <TabBarVisibleContext.Provider value={{ setTabBarVisible }}>
      <SearchScreen />
    </TabBarVisibleContext.Provider>
  );
}
