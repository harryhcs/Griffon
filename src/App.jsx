/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import { hot } from 'react-hot-loader';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useAuth0 } from './auth/service';

import Main from './components/Main';

import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/LandingPage';

import './App.css';

const App = () => {
  const {
    loading, idToken, isAuthenticated,
  } = useAuth0();
  if (isAuthenticated) {
    const httpLink = new HttpLink({
      uri: 'http://griffondev.westeurope.azurecontainer.io/v1/graphql',
      headers: {
        Authorization: `Bearer ${loading ? null : idToken ? idToken.__raw : null}`,
      },
    });
    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
      uri: 'ws://griffondev.westeurope.azurecontainer.io/v1/graphql',
      options: {
        lazy: true,
        reconnect: true,
        connectionParams: async () => ({
          headers: {
            Authorization: `Bearer ${loading ? null : idToken ? idToken.__raw : null}`,
          },
        }),
      },
    });

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
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
    });
    return (
      <ApolloProvider client={client}>
        <CssBaseline />
        <BrowserRouter>
          <div>
            <Container maxWidth="xl">
              <Switch>
                <PrivateRoute path="/" component={Main} />
              </Switch>
            </Container>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
  return <LandingPage />;
};


export default hot(module)(App);
