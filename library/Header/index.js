import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from '../Icon';
import Typography from '../Typography';

import { SIZE } from '../Theme';
import { HEADER } from '../Theme/library';

export default function ({
  title,
  endContent,
  startContent,
  onPress,
  titleStyle,
  backSpace = true,
  icon = 'arrow-back',
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {backSpace && (
        <Icon
          name={icon}
          size={SIZE.icon * 1.7}
          touch
          onPress={onPress ? onPress : () => navigation.goBack()}
        />
      )}
      {startContent && startContent}
      <Typography variant="h4" style={[styles.title, titleStyle]}>
        {title}
      </Typography>
      {endContent && endContent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: HEADER.height,
    justifyContent: 'space-between',
    marginHorizontal: SIZE.margin,
    marginTop: SIZE.margin,
  },
  title: {
    marginBottom: -2,
  },
});
