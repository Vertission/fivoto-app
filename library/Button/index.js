import React from 'react';
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Icon from '../Icon';
import Typography from '../Typography';

import { SIZE, COLOR } from '../Theme';
import { BUTTON } from '../Theme/library';

function Button({
  children = null,
  style = {},
  height = BUTTON.height,
  small = false,
  large = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  loading = false,
  error = false,
  variant = 'outlined',
  indicatorProps = {},
  textProps = {},
  iconProps = {},
  color = COLOR.PRIMARY,
  ...rest
}) {
  let indicatorSize = 'small',
    borderWidth = 1.3,
    borderColor = color,
    background = color,
    ripple = color,
    fontColor = COLOR.WHITE,
    iconColor = COLOR.WHITE,
    indicatorColor = color,
    borderRadius = SIZE.radius;

  if (error) {
    background = COLOR.ERROR;
    borderColor = COLOR.ERROR;
    ripple = COLOR.ERROR;
  }

  if (variant === 'contained') {
    borderWidth = 0;
    ripple = COLOR.LIGHT;
  }

  if (variant === 'outlined') {
    iconColor = background;
    fontColor = background;
    background = 'transparent';
  }

  if (variant === 'transparent') {
    iconColor = background;
    fontColor = background;
    background = 'transparent';
    borderColor = 'transparent';
  }

  // sizing
  const BTN_SM = height * 0.8;
  const BTN_LG = height * 1.2;

  // height
  if (small) {
    height = BTN_SM;
  }
  if (large) {
    height = BTN_LG;
    indicatorSize = 'large';
  }

  // disable
  if (disabled) {
    borderColor = COLOR.MUTED;
    fontColor = COLOR.MUTED;
    iconColor = COLOR.MUTED;
    if (variant === 'contained') {
      background = COLOR.LIGHT;
    }
    if (variant === 'transparent') {
      borderColor = 'transparent';
    }
  }

  // loading
  if (loading) {
    borderWidth = 0;
    background = 'transparent';
  }

  // font size
  let fontSize = height * 0.39;
  if (small) {
    fontSize = BTN_SM * 0.43;
  }
  if (large) {
    fontSize = BTN_LG * 0.33;
  }

  const buttonContainerStyles = [
    styles.buttonContainer,
    { borderWidth: borderWidth },
    { backgroundColor: background },
    { borderRadius: borderRadius },
    { borderColor: borderColor },
    { height: height },
    style,
  ];

  const RenderIcon = (name, iconStyles, iconProps) => {
    let iconSize = (height / 3) * 2;
    if (small) {
      iconSize = (BTN_SM / 3) * 2;
    }
    if (large) {
      iconSize = (BTN_LG / 3) * 2;
    }

    return (
      <Icon
        name={name}
        color={iconColor}
        size={iconSize}
        style={iconStyles}
        {...iconProps}
      />
    );
  };

  const LoadingIndicator = (
    <ActivityIndicator
      size={indicatorSize}
      color={indicatorColor}
      {...indicatorProps}
    />
  );

  const textStyles = [
    { fontSize: fontSize },
    { color: fontColor },
    textProps.style,
  ];

  const ButtonContent = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
      {icon &&
        iconPosition === 'left' &&
        RenderIcon(icon, styles.iconStart, iconProps)}
      <Typography
        family="bold"
        transform="uppercase"
        style={textStyles}
        {...textProps}>
        {children}
      </Typography>
      {icon &&
        iconPosition === 'right' &&
        RenderIcon(icon, styles.iconEnd, iconProps)}
    </View>
  );

  const Touchable =
    variant === 'transparent' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Touchable
      disabled={disabled || loading}
      background={TouchableNativeFeedback.Ripple(ripple, false)}
      {...rest}>
      <View style={buttonContainerStyles}>
        {loading ? LoadingIndicator : ButtonContent}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZE.margin / 2,
    paddingHorizontal: SIZE.padding,
    width: '100%',
  },
  iconEnd: {
    position: 'absolute',
    right: 0,
  },
  iconStart: {
    left: 0,
    position: 'absolute',
  },
});

export default Button;
