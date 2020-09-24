import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './components/Auth';
import config from './auth_config.json';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333333',
    },
    secondary: {
      main: '#eb6646',
    },
  },
});

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience={config.audience}
  >
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    
  </Auth0Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
