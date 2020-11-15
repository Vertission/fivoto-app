import { COLOR, SIZE } from './index';
import { HEADER } from './library';

export default {
  container: {
    backgroundColor: COLOR.WHITE,
    borderRadius: SIZE.radius,
    margin: SIZE.margin,
    padding: SIZE.padding / 2,
    maxHeight:
      SIZE.height - (HEADER.height + SIZE.statusBarHeight + SIZE.margin * 3),
  },
};
