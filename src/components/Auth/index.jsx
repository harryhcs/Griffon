/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

// eslint-disable-next-line max-len
const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname);
export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [idToken, setIdToken] = useState();
  const [headers, setHeaders] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticatedAwait = await auth0FromHook.isAuthenticated();


      setIsAuthenticated(isAuthenticatedAwait);
      if (isAuthenticatedAwait) {
        const userAwait = await auth0FromHook.getUser();
        const idTokenAwait = await auth0FromHook.getIdTokenClaims();
        setUser(userAwait);
        setIdToken(idTokenAwait);
        console.log(idTokenAwait);
        // eslint-disable-next-line no-underscore-dangle
        setHeaders(`Bearer ${idTokenAwait.__raw}`);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const userAwait = await auth0Client.getUser();
    const idTokenAwait = await auth0Client.getTokenSilently();
    setUser(userAwait);
    setIdToken(idTokenAwait);
    // eslint-disable-next-line no-underscore-dangle
    setHeaders(`Bearer ${idTokenAwait.__raw}`);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const userAwait = await auth0Client.getUser();
    const idTokenAwait = await auth0Client.getTokenSilently();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(userAwait);
    setIdToken(idTokenAwait);
    // eslint-disable-next-line no-underscore-dangle
    setHeaders(`Bearer ${idTokenAwait.__raw}`);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        headers,
        idToken,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
