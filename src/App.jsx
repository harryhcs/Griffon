/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import { hot } from 'react-hot-loader';
import React from 'react';
import 'typeface-roboto';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
  HttpLink,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { useAuth0 } from './components/Auth';
import { store, persistor } from './redux/store';

import Router from './routes';
import LandingPage from './components/LandingPage';

const App = () => {
  const {
    loading, headers, isAuthenticated,
  } = useAuth0();
  if (isAuthenticated) {
    if (!loading) {
      const httpLink = new HttpLink({
        uri: 'https://griffonapi.herokuapp.com/v1/graphql',
        headers: {
          Authorization: headers,
        },
      });
      const wsLink = new WebSocketLink({
        uri: 'wss://griffonapi.herokuapp.com/v1/graphql',
        options: {
          lazy: true,
          reconnect: true,
          connectionParams: async () => ({
            headers: {
              Authorization: headers,
            },
          }),
        },
      });
      const link = split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink,
      );

      // Instantiate client
      const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
      })

      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
              <Router />
            </ApolloProvider>
          </PersistGate>
        </Provider>
      );
    }
  }
  return <LandingPage />;
};


export default hot(module)(App);
