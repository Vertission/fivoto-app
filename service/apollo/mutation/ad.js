import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';

import { Snackbar } from '../../../library';

import ApolloModalErrorHandler from '../errorHandler/modal';

const DELETE_AD = gql`
  mutation deleteAd($id: ID!) {
    deleteAd(id: $id) {
      id
    }
  }
`;

export function useDeleteAd(REFETCH_QUERY) {
  const [deleteId, setDeleteId] = useState(null);
  const navigation = useNavigation();

  const [mutate, { loading, client }] = useMutation(DELETE_AD, {
    onError(error) {
      ApolloModalErrorHandler(
        error,
        { id: deleteId },
        'deleting your ad',
        navigation,
      );

      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useDeleteAd');
        scope.setLevel(Sentry.Severity.Fatal);
        scope.setContext('data', { id: deleteId });
        Sentry.captureException(error);
      });
    },
    async onCompleted() {
      Snackbar.show('Ad deleted successfully');
      await analytics().logEvent('delete_ad', {
        id: deleteId,
      }); // ANALYTIC
    },
  });

  const deleteAd = async (id) => {
    setDeleteId(id);
    return mutate({
      variables: {
        id,
      },
      refetchQueries: [{ query: REFETCH_QUERY }],
      awaitRefetchQueries: true,
    });
  };

  return [deleteAd, { loading, client }];
}
