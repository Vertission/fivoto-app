import { useQuery, gql } from '@apollo/client';

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
  });

  return [data?.me, { loading, refetch, client, error, data }];
}
