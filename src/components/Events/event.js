/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MarkerIcon from '@material-ui/icons/Room';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Subscription } from 'react-apollo';
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
    paddingBottom: 0,
  },
  eventContentContainer: {
    height: 500,
    overflow: 'scroll',
    overflowY: 'auto',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  creator: {
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
    paddingTop: 10,
    paddingBottom: 0,
    paddingRight: 10,
    paddingLeft: 10,
  },
  commentContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  comment: {
    marginBottom: 20,
  },
  commentIdentityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  commentRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 0px 4px 1px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const ADD_COMMENT = gql`
  mutation AddComment($comment: String!, $event_id: Int!) {
    insert_event_comments(objects:[{comment: $comment, event_id: $event_id}]) {
      returning {
        id
      }
    }
  }
`;

export default function Event(props) {
  const classes = useStyles();
  const { event, setShowEvents } = props;
  const [AddComment, { loading, data }] = useMutation(ADD_COMMENT);
  const [comment, setComment] = useState();
  const el = useRef(null);


  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = () => {
    AddComment({ variables: { comment, event_id: event.id } });
    if (!loading || data) {
      setComment('');
    }
  };

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
        </Grid>
      </Grid>
      <div className={classes.eventContentContainer}>
        <Grid container>
          <Grid item className={classes.content}>
            <Typography variant="subtitle2">
              {event.description}
            </Typography>
          </Grid>
          <Grid container className={classes.creatorInformation}>
            <Grid item>
              <Avatar
                alt={event.user.name}
                src={event.user.profile_picture}
                className={classes.avatar}
              />
            </Grid>
            <Grid item>
              <Typography className={classes.creator}>
                {event.user.resource.name}
                {' '}
                (
                {event.user.name}
                )
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {moment(event.created_at).format('LLLL')}
              </Typography>
            </Grid>
            {event.latitude && event.longitude ? (
              <Grid item>
                <Grid container>
                  <Grid item>
                    <MarkerIcon fontSize="small" color="secondary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">
                      (
                      {event.latitude}
                      ,
                      {' '}
                      {event.longitude}
                      )
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            <Grid item>
              <Chip label={event.channel.name} variant="outlined" color="secondary" />
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
            <Subscription
              subscription={gql`
              subscription {
                event_comments(where: {event_id: {_eq: ${event.id}}}) {
                  id
                  user {
                    id
                    name
                    profile_picture
                    resource {
                      id
                      name
                    }
                  }
                  comment
                  created_at
                }
              }
          `}>
              {({ loading, error, data }) => {
                if (error) {
                  console.log(error)
                  return JSON.stringify(error);
                }
                if (loading) {
                  return 'loading...';
                }
                if (data && data.event_comments.length > 0) {
                  return data.event_comments.map((comment) => (
                    <div className={classes.comment} key={comment.id}>
                      <Grid container className={classes.commentIdentityContainer} spacing={1}>
                        <Grid item>
                          <Avatar src={comment.user.profile_picture} />
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
                  ));
                }
                return null;
              }}
            </Subscription>
            <div id="el" ref={el} />
          </Grid>
        </Grid>
      </div>
      <div className={classes.commentInputContainer}>
        <Paper component="form" className={classes.commentRoot}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <InputBase
            value={comment}
            onInputCapture={handleComment}
            className={classes.input}
            placeholder="Create comment"
            inputProps={{ 'aria-label': 'create comment' }}
          />
          <IconButton disabled={!comment || loading} className={classes.iconButton} aria-label="search" onClick={addComment}>
            {loading ? <CircularProgress color="secondary" /> : <SendIcon />}
          </IconButton>
        </Paper>
      </div>
    </div>
  );
}
