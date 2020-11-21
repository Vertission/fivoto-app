import { APOLLO_HOST, ENVIRONMENT } from '@env';
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

const httpLink = createHttpLink({
  uri: 'http://192.168.8.101:4000',
});

const errorLink = new onError(({ graphQLErrors, networkError }) => {
  if (ENVIRONMENT === 'development') {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, code }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${path}, code: ${code}`,
        );

        if (message === 'NotAuthorizedException') {
          console.error('User not authorized');
        }
      });
    }

    if (networkError) {
      console.error(networkError);
    }
  }

  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      if (message === 'NotAuthorizedException') {
        signOut();
      }
    });
  }

  if (networkError) {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected)
        return Toast({ message: 'no internet connection' });
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
    Sentry.captureException(error);
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }),
  connectToDevTools: true,
});

export default function AP({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
