import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import storage from '@react-native-firebase/storage';

export default function UploadPhotos(folder, screenshots) {
  return new Promise(async (resolve, reject) => {
    try {
      let uris = [];

      for (let index = 0; index < screenshots.length; index++) {
        const uri = screenshots[index];
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        const reference = storage().ref(`${folder}/` + filename);
        const { metadata } = await reference.putFile(uploadUri);
        uris.push(metadata.name);
      }

      resolve(uris);
    } catch (error) {
      reject(error);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'uploadPhotos');
        scope.setContext('data', { folder, screenshots });
        Sentry.captureException(error);
      });
    }
  });
}
