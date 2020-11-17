import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Typography, Button } from '../../../../library';
import styles from '../../../../library/Theme/styles';

export default function AdDescription({ user }) {
  return (
    <View style={s.container}>
      <Typography variant="h5">{user.name}</Typography>
      <Button
        variant="contained"
        // onPress={() => modalizeRef.current?.open()}
      >
        Call
      </Button>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...styles.container,
    maxHeight: null,
  },
});

//
//    <Modalize ref={modalizeRef} adjustToContentHeight modalStyle={s.modalize}>
//         {ad.phone.map((phone) => (
//           <TouchableOpacity
//             key={phone}
//             style={s.phone}
//             onPress={() => Linking.openURL(`tel://${phone}`)}>
//             <Typography variant="h1" style={s.number}>
//               {phone}
//             </Typography>
//             <Icon name="call" size={SIZE.icon * 1.5} />
//           </TouchableOpacity>
//         ))}
//       </Modalize>
//
