import React from 'react';
import { StyleSheet, Image as NativeImage } from 'react-native';

function Image({
  style = {},
  source = null,
  url = null,
  width = null,
  height = null,
  full = false,
  fit = false,
  ...rest
}) {
  const stylesArray = [
    full && styles.full,
    width && { width: width },
    height && { height: height },
    fit && styles.fit,
    style,
  ];

  return (
    <NativeImage
      style={stylesArray}
      source={source ? source : { uri: url }}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  fit: {
    resizeMode: 'contain',
  },
  full: {
    height: '100%',
    width: '100%',
  },
});

export default Image;

// NEXT: broken image and loading image
