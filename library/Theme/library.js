import { COLOR, SIZE, SCALE } from './index';
import normalize from '../helpers/normalize';

const TYPOGRAPHY = {
  color: COLOR.TYPOGRAPHY,
  variant: {
    default: normalize(SIZE.FONT),
    h1: normalize(SIZE.FONT * 2),
    h2: normalize(SIZE.FONT * 1.8),
    h3: normalize(SIZE.FONT * 1.6),
    h4: normalize(SIZE.FONT * 1.4),
    h5: normalize(SIZE.FONT * 1.2),
    h5: normalize(SIZE.FONT * 1.1),
    caption: normalize(SIZE.FONT * 0.8),
  },
  letterSpacing: 0.9,
};

const BUTTON = {
  height: 40,
};

const INPUT = {
  FONT: {
    caption: normalize(SIZE.FONT * 0.8),
  },
  height: 40,
};

const HEADER = {
  height: SIZE.height * 0.06,
};

export { TYPOGRAPHY, BUTTON, INPUT, HEADER };
