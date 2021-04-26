import { COLOR, SIZE } from './index';

const TYPOGRAPHY = {
  color: COLOR.TYPOGRAPHY,
  variant: {
    default: SIZE.FONT,
    h1: SIZE.FONT * 2,
    h2: SIZE.FONT * 1.8,
    h3: SIZE.FONT * 1.6,
    h4: SIZE.FONT * 1.4,
    h5: SIZE.FONT * 1.2,
    h5: SIZE.FONT * 1.1,
    caption: SIZE.FONT * 0.8,
  },
  letterSpacing: 0.9,
};

const BUTTON = {
  height: 40,
};

const INPUT = {
  FONT: {
    caption: SIZE.FONT * 0.8,
  },
  height: 40,
};

const HEADER = {
  height: SIZE.height * 0.06,
};

export { TYPOGRAPHY, BUTTON, INPUT, HEADER };
