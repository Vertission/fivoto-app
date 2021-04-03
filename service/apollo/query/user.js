import { useQuery, gql } from '@apollo/client';
import * as Sentry from '@sentry/react-native';

export const ME = gql`
  query me {
    me {
      id
      name
      email
      email_verified
      profile
      createdAt
      updatedAt
    }
  }
`;

export function useQueryMe(schema = ME) {
  const { data, loading, refetch, client, error } = useQuery(schema, {
    notifyOnNetworkStatusChange: true,
    onError(error) {
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useQueryMe:hook');
        scope.setLevel(Sentry.Severity.Fatal);
        Sentry.captureException(error);
      });
    },
  });

  return [data?.me, { loading, refetch, client, error, data }];
}
