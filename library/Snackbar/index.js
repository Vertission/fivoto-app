import React, { Component, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import Typography from '../Typography';
import Icon from '../Icon';

import { SIZE, COLOR } from '../Theme';

export default class Snackbar extends Component {
  static displayName = 'Snackbar';

  static show = (message) => {
    return new RootSiblings(<SnackbarContainer message={message} />);
  };

  static hide = (snackbar) => {
    if (snackbar instanceof RootSiblings) {
      snackbar.destroy();
    } else {
      console.warn(
        `snackbar.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof snackbar}\` instead.`,
      );
    }
  };

  _snackbar = null;

  UNSAFE_componentWillMount = () => {
    this._snackbar = new RootSiblings(<SnackbarContainer {...this.props} />);
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this._snackbar.update(<SnackbarContainer {...nextProps} />);
  };

  componentWillUnmount = () => {
    this._snackbar.destroy();
  };

  render() {
    return null;
  }
}

function SnackbarContainer({ message }) {
  const animate = new Animated.Value(0);

  const _end = () =>
    Animated.timing(animate, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();

  useEffect(() => {
    Animated.timing(animate, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(_end, 5000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: animate.interpolate({
              inputRange: [0, 1],
              outputRange: [600, 0],
            }),
          },
        ],
        ...s.snackbar,
      }}>
      <Typography color={COLOR.WHITE} style={s.typography}>
        {message}
      </Typography>
      <Icon
        name="close-circle"
        size={SIZE.icon * 1.3}
        color={COLOR.WHITE}
        onPress={_end}
        touch
      />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  snackbar: {
    alignItems: 'center',
    backgroundColor: COLOR.PRIMARY,
    borderRadius: SIZE.radius,
    bottom: SIZE.BASE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZE.padding,
    position: 'absolute',
    right: SIZE.margin * 1.5,
    width: SIZE.width - SIZE.margin * 3,
  },
  typography: {
    width: '90%',
  },
});
