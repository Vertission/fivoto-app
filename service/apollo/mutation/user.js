import { useMutation, gql } from '@apollo/client';

import { Toast } from '../../../library';

const UPDATE_USER = gql`
  mutation updateUser($data: updateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const REFETCH_ME = gql`
  query me {
    me {
      id
      name
      email
      updatedAt
    }
  }
`;

export function useUpdateUser() {
  const [mutate, { loading }] = useMutation(UPDATE_USER, {
    onCompleted() {
      Toast({ message: 'Profile updated' });
    }, // CHECK:
  });

  const updateUser = (data) => {
    mutate({
      variables: {
        data,
      },
      refetchQueries: () => [{ query: REFETCH_ME }],
    });
  };

  return [updateUser, { loading }];
}
