import React, { useEffect } from 'react';
import { Text } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { RootSiblingParent } from 'react-native-root-siblings';

function App() {
  useEffect(() => {
    const init = async () => {
      console.log('AB');
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
      console.log('AB');
    });
  }, []);

  return <Text style={{ fontFamily: 'bold' }}>My awesome app</Text>;
}

export default function () {
  return (
    <RootSiblingParent>
      <App />
    </RootSiblingParent>
  );
}
