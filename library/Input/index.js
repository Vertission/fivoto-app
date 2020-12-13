import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from '../Icon';
import Text from '../Typography';

import { SIZE, COLOR } from '../Theme';
import { INPUT } from '../Theme/library';

const { FONT } = INPUT;

function Input({
  style,
  inputContainerStyle,
  inputStyle,
  type,
  placeholderTextColor = COLOR.MUTED,
  color,
  bgColor,
  icon,
  error,
  label,
  multiline,
  valid,
  iconSize,
  iconContent,
  disabled,
  iconProps,
  setRef,
  ...rest
}) {
  const inputViewStyles = [
    styles.inputStyle,
    styles.inputContainer,
    bgColor && { backgroundColor: COLOR.LIGHT },
    style,
  ];

  const inputStyles = [
    styles.inputView,
    icon && styles.inputIcon,
    styles.inputText,
    multiline ? { paddingVertical: SIZE.padding } : { height: INPUT.height },
    color && { color },
    inputStyle,
  ];

  const iconInstance = icon ? (
    <Icon
      name={icon}
      size={iconSize || SIZE.icon * 1.3}
      style={{ marginRight: SIZE.margin }}
      color={
        disabled
          ? COLOR.MUTED
          : valid
          ? COLOR.SUCCESS
          : error
          ? COLOR.ERROR
          : COLOR.ICON
      }
      {...iconProps}
    />
  ) : (
    iconContent
  );

  const errorText = error && <Text style={styles.error}>{error}</Text>;
  const labelText = label && <Text style={{ marginLeft: 1 }}>{label}</Text>;

  return (
    <View
      style={[
        {
          marginTop: label ? SIZE.margin * 0.5 : SIZE.margin * 1.5,
        },
        inputContainerStyle,
      ]}>
      {labelText}
      <View style={inputViewStyles}>
        <TextInput
          style={inputStyles}
          keyboardType={type}
          placeholderTextColor={placeholderTextColor}
          underlineColorAndroid="transparent"
          editable={!disabled}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          ref={setRef}
          {...rest}
        />
        {icon && iconInstance}
      </View>
      {errorText}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    bottom: -5,
    color: COLOR.ERROR,
    fontSize: FONT.caption,
    marginLeft: 1,
    position: 'absolute',
  },
  inputContainer: {
    alignItems: 'center',
    // elevation: SIZE.elevation / 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZE.margin * 1.5,
  },
  inputIcon: {
    marginHorizontal: SIZE.margin,
  },
  inputStyle: {
    backgroundColor: COLOR.LIGHT,
    borderRadius: SIZE.radius,
    paddingHorizontal: SIZE.padding / 3,
    width: '100%',
  },
  inputText: {
    color: COLOR.BLACK,
    textDecorationColor: COLOR.TRANSPARENT,
    textShadowColor: COLOR.TRANSPARENT,
  },
  inputView: {
    flex: 1,
  },
});

export default Input;
