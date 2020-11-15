import { ToastAndroid } from 'react-native';

export default function ({
  message,
  position = ToastAndroid.BOTTOM,
  duration = ToastAndroid.SHORT,
}) {
  return ToastAndroid.showWithGravityAndOffset(
    message,
    duration,
    position,
    0,
    130,
  );
}
