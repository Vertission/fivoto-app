import { useQuery, gql } from '@apollo/client';
import * as Sentry from '@sentry/react-native';

const LOCATION = gql`
  query location {
    location
  }
`;

const CATEGORY = gql`
  query category {
    category
  }
`;

export function useQueryLocations() {
  const { data, loading, error, refetch } = useQuery(LOCATION, {
    notifyOnNetworkStatusChange: true,
    onError(error) {
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useQueryLocations:hook');
        scope.setLevel(Sentry.Severity.Fatal);
        Sentry.captureException(error);
      });
    },
  });

  return [data?.location, { loading, error, refetch }];
}

export function useQueryCategories() {
  const { data, loading, error, refetch } = useQuery(CATEGORY, {
    notifyOnNetworkStatusChange: true,
    onError(error) {
      Sentry.withScope(function (scope) {
        scope.setTag('func', 'useQueryCategories:hook');
        scope.setLevel(Sentry.Severity.Fatal);
        Sentry.captureException(error);
      });
    },
  });

  return [data?.category, { loading, error, refetch }];
}
