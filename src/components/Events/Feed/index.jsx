/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import FeedList from './list';

const useStyles = makeStyles((theme) => ({
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  menuButton: {
    color: 'black',
  },
}));

export default function EventsFeed(props) {
  const { showEvent } = props;
  const classes = useStyles();
  const [isHidden, setShow] = useState(false);

  const handleToggleshowFeed = () => {
    setShow(!isHidden);
  };
  return (
    <Grid container>
      <Grid item lg={12}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleToggleshowFeed}>
            {isHidden ? <DownIcon /> : <UpIcon />}
          </IconButton>
          <Typography>
            {isHidden ? 'Show' : 'Hide'}
            {' '}
            latest events
          </Typography>
        </Toolbar>
        {/* <div className={classes.feedContainer} style={{ display: isHidden ? 'none' : null }}>
          <Divider />
          <FeedList />
        </div> */}
      </Grid>
      <Grid item style={{ display: isHidden ? 'none' : null }} lg={12}>
        <Divider />
        <FeedList showEvent={showEvent} />
      </Grid>
    </Grid>
  );
}
