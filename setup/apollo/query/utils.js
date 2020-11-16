import { useQuery, gql } from '@apollo/client';

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
  });

  return [data?.location, { loading, error, refetch }];
}

export function useQueryCategories() {
  const { data, loading, error, refetch } = useQuery(CATEGORY, {
    notifyOnNetworkStatusChange: true,
  });

  return [data?.category, { loading, error, refetch }];
}
