const HASURA_GRAPHQL_ENGINE_HOSTNAME = 'griffonapp.westeurope.azurecontainer.io/v1/graphql';

const scheme = (proto) => (window.location.protocol === 'https:' ? `${proto}s` : proto);

export const GRAPHQL_URL = `${scheme(
  'http',
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const REALTIME_GRAPHQL_URL = `${scheme(
  'ws',
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const authClientId = 'nAXDIZAr1oqb8Vkj2PKC8EMfG9ojAYkF';
export const authDomain = 'ppfcns.eu.auth0.com';
export const callbackUrl = `${scheme(
  'http',
)}://localhost:5000/callback`;
