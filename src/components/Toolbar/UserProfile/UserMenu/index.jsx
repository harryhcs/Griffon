/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {
  Avatar, Typography, Divider, Button,
} from '@material-ui/core';
import { useAuth0 } from '../../../Auth';

const useStyles = makeStyles((theme) => ({

  paper: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 8,
  },
  containerGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  name: {
    fontWeight: 600,
  },
  email: {
    color: 'grey',
    fontSize: 14,
  },
}));

export default function UserMenu() {
  const classes = useStyles();
  const { user, logout } = useAuth0();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Grid className={classes.containerGrid} container>
          <Grid item>
            <Avatar alt={user.email} src={user.picture} className={classes.avatar} />
            <br />
          </Grid>
          <Grid item>
            <Typography className={classes.name}>{user.name}</Typography>
            <Typography className={classes.email}>{user.email}</Typography>
            <br />
            <Divider />
            <br />
            <Button variant="outlined" onClick={() => logout()}>Logout</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
