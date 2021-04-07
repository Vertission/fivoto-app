import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';

import { Toast } from '../../../library';

import ApolloModalErrorHandler from '../errorHandler/modal';

import schema from '../../apollo/schema';

const UPDATE_USER = gql`
  mutation updateUser($data: updateUserInput!) {
    updateUser(data: $data)
  }
`;

export function useUpdateUser() {
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  const [mutate, { loading }] = useMutation(UPDATE_USER, {
    onCompleted() {
      Toast({ message: 'Profile updated' });
    },
    onError(error) {
      ApolloModalErrorHandler(error, data, 'updating your profile', navigation);

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useUpdateUser');
        scope.setContext('data', { data });
        Sentry.captureException(error);
      });
    },
  });

  const updateUser = (data) => {
    setData(data);
    mutate({
      variables: {
        data,
      },
      update(cache) {
        const { me } = cache.readQuery({
          query: schema.query.ME,
        });

        cache.writeQuery({
          query: schema.query.ME,
          data: {
            me: {
              ...me,
              ...data,
            },
          },
        });
      },
    });
  };

  return [updateUser, { loading }];
}
