import { ENVIRONMENT } from '@env';
import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { Auth } from 'aws-amplify';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { offsetLimitPagination } from '@apollo/client/utilities';
import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';

import { Toast } from '../../library';

import signOut from '../../utils/signOut';

const HOST =
  ENVIRONMENT === 'development'
    ? 'http://192.168.8.103:4000'
    : 'http://65.0.81.244';

console.log(HOST);
const httpLink = createHttpLink({
  uri: HOST,
});

const errorLink = new onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path, code }) => {
      if (message === 'NotAuthorizedException') {
        signOut();
      } else {
        Sentry.captureException(graphQLErrors);

        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${path}, code: ${code}`,
        );
      }
    });
  }

  if (networkError) {
    console.error(JSON.stringify(networkError, null, 2));

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        Sentry.captureException(networkError);
      } else return Toast({ message: 'no internet connection' });
    });
  }
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const {
      accessToken: { jwtToken },
    } = await Auth.currentSession();
    // console.log('jwtToken', jwtToken);

    return {
      headers: {
        ...headers,
        authorization: jwtToken,
      },
    };
  } catch (error) {
    if (error === 'No current user') return null;
    console.error('authLink -> error', error);
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          search: offsetLimitPagination(['query', 'category', 'location']),
        },
      },
    },
  }),
  connectToDevTools: true,
});

export default function AP({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
