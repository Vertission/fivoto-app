import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => (shortDimension / guidelineBaseWidth) * size;

const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size;

const moderateScale = (size, factor) => size + (scale(size) - size) * factor;

const moderateVerticalScale = (size, factor) =>
  size + (verticalScale(size) - size) * factor;

export default {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
};

// code copied from https://github.com/nirsky/react-native-size-matters/blob/master/lib/extend/scaling-utils.extend.js