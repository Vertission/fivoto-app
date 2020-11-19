import { useQuery, gql } from '@apollo/client';
import * as Sentry from '@sentry/react-native';

const QUERY_ME = gql`
  query me {
    me {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export function useQueryMe(schema = QUERY_ME) {
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
