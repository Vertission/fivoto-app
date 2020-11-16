import { StyleSheet } from 'react-native';
import { SIZE, COLOR } from '../../../../../library/Theme';

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: COLOR.LIGHT,
    borderColor: COLOR.MUTED,
    borderRadius: SIZE.radius,
    height: SIZE.inputHeight,
    justifyContent: 'center',
    marginBottom: SIZE.margin,
    paddingHorizontal: SIZE.padding / 3,
    width: '100%',
  },
  label: {
    marginLeft: 1,
    marginTop: SIZE.margin * 0.5,
  },
});

export { styles, SIZE, COLOR };
