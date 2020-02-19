/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Search from '../Search/index';
import UserProfile from './UserProfile/index';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavigationBar() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" style={{ background: 'transparent', boxShadow: 'none' }}>
      <Toolbar disableGutters className={classes.toolbar} style={{ marginLeft: 10 }}>
        <Search />
        <UserProfile />
      </Toolbar>
    </AppBar>
  );
}
