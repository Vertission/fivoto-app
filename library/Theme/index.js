import { Dimensions, StatusBar } from 'react-native';
const { width, height } = Dimensions.get('window');
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const statusBarHeight = StatusBar.currentHeight;

import normalize from '../helpers/normalize';

const COLOR = {
  PRIMARY: '#5bd592', // 5bd592
  ERROR: '#eb2f06',
  SUCCESS: '#05c46b',
  WARNING: '#ffd32a',
  ICON: '#020F4B',
  TRANSPARENT: 'transparent',

  //
  MUTED: '#ADB5BD',
  DARK: '#010101',
  LIGHT: '#f1f1f1',
  FILL: 'rgba(0, 0, 0, 0.5)',
  //
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  TYPOGRAPHY: '#2b2a2a',
  // component vice
};

const SIZE = {
  // global SIZE
  FONT: 14,
  BASE: 16,
  //
  padding: normalize(12),
  margin: normalize(10),
  radius: 3,
  icon: normalize(20),
  elevation: 3,
  width,
  height,
  statusBarHeight: statusBarHeight,
  bottomTabHeight: height * 0.075,
  headerHeight: 80,
  borderWidth: 1.5,
};

const SCALE = {
  WP: widthPercentageToDP,
  HP: heightPercentageToDP,
};

export { SIZE, COLOR, SCALE };
