/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from './Auth';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  // eslint-disable-next-line react/jsx-filename-extension
  const render = (props) => (isAuthenticated === true ? <Component {...props} /> : null);

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
