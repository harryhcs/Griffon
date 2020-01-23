/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
  },
  container: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
  },
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 250,
    },
  },
  menuButton: {
    color: 'black',
  },
}));

export default function Search() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item lg={3} className={classes.container}>
        <Toolbar style={{ padding: '0 8 8 0', 'min-height': 0 }}>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Toolbar>
      </Grid>
    </Grid>
  );
}
