/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { Avatar } from '@material-ui/core';
import { useAuth0 } from '../../Auth';

import UserMenu from './UserMenu/index';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: 20,
    zIndex: 1001,
  },
}));

export default function Search() {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const { user } = useAuth0();

  const handleToggle = () => {
    setShow(!show);
  };


  return (
    <div className={classes.root}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
      >
        <Avatar alt={user.email} src={user.picture} className={classes.avatar} />
      </IconButton>
      {show ? <UserMenu /> : null}
    </div>
  );
}
