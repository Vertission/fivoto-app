import React, { useEffect } from 'react';
import { Text } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({ duration: 250 });
    });
  }, []);

  return <Text style={{ fontFamily: 'bold' }}>My awesome app</Text>;
}

export default App;
