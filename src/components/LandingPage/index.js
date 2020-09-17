import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


import { useAuth0 } from '../Auth';
import './index.css';
import Logo from '../../assets/images/logo.png';

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
                <img src={Logo} width={250} alt="Griffon Logo" />
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img src={Logo} width={250} alt="Griffon Logo" />
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
