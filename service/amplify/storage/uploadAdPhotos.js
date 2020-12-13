import { Storage } from 'aws-amplify';
import * as Sentry from '@sentry/react-native';
import * as ImageManipulator from 'expo-image-manipulator';

export default async function uploadPhotos(photos, adId, setStatus) {
  const compressSizer = (size) => {
    const MB = size / Math.pow(1024, 2);
    if (Math.round(MB) === 0) return 1;
    if (Math.round(MB) === 1) return 0.9;
    if (Math.round(MB) === 2) return 0.8;
    if (Math.round(MB) === 3) return 0.7;
    if (Math.round(MB) === 4) return 0.6;
    if (Math.round(MB) >= 5) return 0.5;
    if (Math.round(MB) >= 10) return 0.4;
    if (Math.round(MB) >= 15) return 0.3;
    if (Math.round(MB) >= 20) return 0.2;
    if (Math.round(MB) >= 25) return 0.1;
  };

  const imageManipulator = async (image, { width, height }) => {
    const response = await fetch(image);
    const blob = await response.blob();

    const compress = compressSizer(blob.size);

    let resize;
    if (height === width) resize = { height: 480, width: 480 };
    else if (height > width) resize = { height: 480 };
    else resize = { width: 720 };

    const compressedPhoto = await ImageManipulator.manipulateAsync(
      image,
      [{ resize }],
      {
        compress,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );
    return compressedPhoto.uri;
  };

  const upload = async (photo) => {
    const photoId = (time) => parseInt(time, 10).toString(16);

    const response = await fetch(photo);
    const blob = await response.blob();

    const res = await Storage.put(
      `ads/${adId}/${photoId(new Date().getTime())}.jpeg`,
      blob,
      {
        contentType: 'image/jpeg',
      },
    );

    if (res.key) return res.key;
  };

  let keys = [];
  for (let index = 0; index < photos.length; index++) {
    try {
      const photoUri = Object.keys(photos[index])[0];
      const photoHeightWidth = Object.values(photos[index])[0];

      setStatus(`uploading ad photo ${index + 1} / ${photos.length}`);

      if (photoHeightWidth.source === 'CLOUD') {
        keys.push(photoUri);
      } else {
        const compressedPhoto = await imageManipulator(
          photoUri,
          photoHeightWidth,
        );
        if (compressedPhoto) {
          const key = await upload(compressedPhoto);
          if (typeof key === 'string') keys.push(key);
        }
      }
    } catch (error) {
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'uploadPhotos');
        scope.setLevel(Sentry.Severity.Error);
        scope.setContext('data', { photos, adId });
        Sentry.captureException(error);
      });
    }
  }

  return keys;
}
