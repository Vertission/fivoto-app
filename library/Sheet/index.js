import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';

import Button from '../Button';

import { COLOR, SIZE } from '../Theme';
import { TYPOGRAPHY } from '../Theme/library';

export default function Sheet({ modalizeRef, actions }) {
  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={100}
      adjustToContentHeight
      modalStyle={{ backgroundColor: COLOR.TRANSPARENT, elevation: 0 }}
      handleStyle={{ display: 'none' }}
      closeOnOverlayTap={false}
      closeAnimationConfig={{ timing: { duration: 500 } }}
      openAnimationConfig={{ timing: { duration: 350 } }}>
      <Action modalizeRef={modalizeRef} actions={actions} />
    </Modalize>
  );
}

function Action({ modalizeRef, actions }) {
  const _getRadius = (i) => {
    if (i === 0 && actions.length === 1)
      return {
        borderRadius: SIZE.radius,
      };
    else if (i === 0)
      return {
        borderTopRightRadius: SIZE.radius,
        borderTopLeftRadius: SIZE.radius,
      };
    else if (i === actions.length - 1)
      return {
        borderBottomRightRadius: SIZE.radius,
        borderBottomLeftRadius: SIZE.radius,
      };
  };

  return (
    <View style={s.container}>
      {actions.map(({ title, onPress, ...res }, i) => (
        <Button
          large
          key={title}
          activeOpacity={0.95}
          variant="contained"
          style={[s.button, _getRadius(i)]}
          textProps={{ style: s.buttonText }}
          onPress={onPress}
          {...res}>
          {title}
        </Button>
      ))}

      <Button
        activeOpacity={0.95}
        variant="contained"
        style={[
          s.button,
          { marginVertical: SIZE.margin, borderRadius: SIZE.radius },
        ]}
        textProps={{ style: s.buttonText }}
        onPress={() => modalizeRef.current?.close()}>
        close
      </Button>
    </View>
  );
}

const s = StyleSheet.create({
  button: {
    backgroundColor: COLOR.WHITE,
    borderRadius: 0,
    marginVertical: 0,
  },
  buttonText: {
    color: COLOR.PRIMARY,
    fontSize: TYPOGRAPHY.variant.default,
  },
  container: {
    marginHorizontal: SIZE.margin,
  },
});

//  NEXT: use react native modal for sheet
