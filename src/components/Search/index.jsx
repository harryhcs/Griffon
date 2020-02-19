/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  search: {
    paddingLeft: 10,
    position: 'relative',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
    borderRadius: 5,
  },
  menuButton: {
    color: 'black',
  },
  toolbar: {
    padding: '0 8 8 0',
    // minHeight: 0,
  },
}));

export default function Search() {
  const classes = useStyles();

  return (

    <Grid container>
      <Grid item lg={3} md={5} sm={8} xs={12}>
        <div className={classes.search}>
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
        </div>
      </Grid>
    </Grid>

  );
}
