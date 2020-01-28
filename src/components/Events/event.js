/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MarkerIcon from '@material-ui/icons/Room';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { FixedSizeList } from 'react-window';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  close: {
    textAlign: 'right',
  },
  content: {
    padding: 10,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  creator: {
    // color: 'grey',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creatorInformation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
  metaData: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  commentsContainer: {
    padding: 10,
  },
  commentContainer: {
    marginTop: 10,
  },
  comment: {
    marginBottom: 20,
  },
  commentIdentityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  commentsTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  commentUserName: {},
  commentResourceName: {
    fontSize: 12,
    color: 'grey',
  },
  commentTimestamp: {
    fontSize: 12,
    color: 'grey',
  },
}));

export default function Event(props) {
  const classes = useStyles();
  const { event, setShowEvents } = props;

  const hideEvent = () => {
    setShowEvents(false);
  };
  return (
    <div className={classes.root}>
      <Grid container className={classes.container} lg={12}>
        <Grid container>
          <Grid item className={classes.close} lg={12}>
            <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={hideEvent}>
              <CloseIcon />
            </IconButton>
            <Divider />
          </Grid>
          <Grid item className={classes.content}>
            <Typography variant="subtitle2">
              {event.description}
            </Typography>
          </Grid>
          <Grid container className={classes.creatorInformation}>
            <Grid item>
              <Avatar
                alt={event.resource.assigned_user.name}
                src={event.resource.assigned_user.profile_picture}
                className={classes.avatar}
              />
            </Grid>
            <Grid item>
              <Typography className={classes.creator}>
                {event.resource.name}
                {' '}
                (
              {event.resource.assigned_user.name}
                )
            </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {moment(event.created_at).format('LLLL')}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item>
                  <MarkerIcon fontSize="small" color="secondary" />
                </Grid>
                <Grid item>
                  <Typography variant="caption" >
                    (
                    {event.locations[0].latitude}
                    ,
                    {' '}
                    {event.locations[0].longitude}
                    )
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Chip label={event.channel.name} variant="outlined" color="secondary" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Divider />
      <Grid container className={classes.commentsContainer}>
        <Grid item className={classes.comments} lg={12}>
          <Typography className={classes.commentsTitle}>
            Comments
          </Typography>
          {event.event_comments ? event.event_comments.map(comment => (
            <div className={classes.comment}>
              <Grid container className={classes.commentIdentityContainer} spacing={1}>
                <Grid item>
                  <Avatar src={comment.user.profile_picture}/>
                </Grid>
                <Grid item>
                  <Typography className={classes.commentUserName}>
                    {comment.user.name}
                  </Typography>
                  <Typography className={classes.commentResourceName}>
                    {comment.user.resource.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container className={classes.commentContainer}>
                <Grid item>
                  <Typography className={classes.commentTimestamp}>
                    {moment(comment.created_at).fromNow()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    {comment.comment}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          )) : null}
        </Grid>
      </Grid>
    </div>
  );
}
