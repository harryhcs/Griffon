import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import { useAuth0 } from '../Auth';
import './index.css';

const LandingPage = () => {
  const { loading, loginWithRedirect } = useAuth0();

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <CssBaseline />
      <div>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >

          <Grid item>
            {loading ? (
              <>
                <img src="https://media.istockphoto.com/vectors/bird-vulture-icon-vector-black-outline-icon-illustration-vector-id483045290" width={40} alt="Zacto Icon" />
                <br />
                <CircularProgress color="primary" />
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img src="https://media.istockphoto.com/vectors/bird-vulture-icon-vector-black-outline-icon-illustration-vector-id483045290" width={40} alt="Zacto Icon" />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => loginWithRedirect({})}
                >
                            Access Griffon
                </Button>

              </div>
            )}

          </Grid>

        </Grid>
      </div>
    </div>
  );
};

export default LandingPage;