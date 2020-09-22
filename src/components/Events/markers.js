/* eslint-disable react/jsx-filename-extension */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  InputBase,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Chip,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import MarkerIcon from "@material-ui/icons/Room";
import MenuIcon from "@material-ui/icons/Menu";
import SendIcon from "@material-ui/icons/Send";

import moment from "moment";
import { CircleMarker, Popup } from "react-leaflet";
import { gql, useMutation, useSubscription } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation AddComment($comment: String!, $event_id: Int!) {
    insert_event_comments(
      objects: [{ comment: $comment, event_id: $event_id }]
    ) {
      returning {
        id
      }
    }
  }
`;

const GET_COMMENTS = gql`
  subscription getComments($eventId: Int!) {
    event_comments(where: { event_id: { _eq: $eventId } }) {
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
`;

export default function EventMarker(props) {
  const classes = useStyles();
  const { center, event } = props;
  const el = useRef(null);
  const [AddComment, { loading, data }] = useMutation(ADD_COMMENT);
  const { loading: loadingComments, data: dataComments } = useSubscription(
    GET_COMMENTS,
    {
      variables: {
        eventId: event.id,
      },
    }
  );
  const [comment, setComment] = useState();

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = () => {
    AddComment({ variables: { comment, event_id: event.id } });
    if (!loading || data) {
      setComment("");
    }
  };

  return (
    <CircleMarker
      center={center}
      weight={1}
      fillColor={
        event.event_tags.length ? event.event_tags[0].tag.color : "#3388ff"
      }
      color="#FFFFFF"
      fillOpacity={1}
      radius={3}
    >
      <Popup className={classes.root}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar variant="dense">
            <Typography className={classes.title} color="inherit" variant="h6">
              {event.description}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid className={classes.eventInfoContainer} container>
                {event.user ? (
                  <Grid item lg={2}>
                    <Avatar
                      alt={event.user ? event.user.name : null}
                      src={event.user ? event.user.profile_picture : null}
                      className={classes.avatar}
                    />
                  </Grid>
                ) : null}
                <Grid item lg={5}>
                  {event.user ? (
                    <div className={classes.creator}>
                      {event.user.resource.name}
                    </div>
                  ) : null}
                  <div className={classes.timestamp}>
                    {moment(event.created_at).fromNow()} in{" "}
                    <span className={classes.channel}>
                      {event.channel.name}
                    </span>
                  </div>
                </Grid>
                <Grid item lg={5}>
                  <div className={classes.timestamp}>
                    <span className={classes.channel}>Coordinates:</span>{" "}
                    {event.latitude}
                    {", "}
                    {event.longitude}
                  </div>
                  <div className={classes.timestamp}>
                    <span className={classes.channel}>Timestamp:</span>{" "}
                    {moment(event.created_at).format("YYYY-DD-MM HH:MM:SS")}
                  </div>
                  <div className={classes.timestamp}>
                    <span className={classes.channel}>Event ID:</span>{" "}
                    {event.id}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Grid className={classes.eventInfoContainer} container>
                <Grid item lg={12}>
                  <div className={classes.timestamp}>{event.description}</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Grid container className={classes.commentsContainer}>
                <Grid item className={classes.comments} lg={12}>
                  <Typography className={classes.commentsTitle}>
                    Comments
                  </Typography>
                  {loadingComments && "loading..."}
                  {dataComments &&
                    dataComments.event_comments.map((c) => (
                      <div className={classes.comment} key={c.id}>
                        <Grid
                          container
                          className={classes.commentIdentityContainer}
                          spacing={1}
                        >
                          <Grid item>
                            <Avatar src={c.user.profile_picture} />
                          </Grid>
                          <Grid item>
                            <Typography className={classes.commentUserName}>
                              {c.user.name}
                            </Typography>
                            <Typography className={classes.commentResourceName}>
                              {c.user.resource.name}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container className={classes.commentContainer}>
                          <Grid item>
                            <Typography className={classes.commentTimestamp}>
                              {moment(c.created_at).fromNow()}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body2">{c.comment}</Typography>
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  <div id="el" ref={el} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
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
                    inputProps={{ "aria-label": "create comment" }}
                  />
                  <IconButton
                    disabled={!comment || loading}
                    className={classes.iconButton}
                    aria-label="search"
                    onClick={addComment}
                  >
                    {loading ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
      </Popup>
    </CircleMarker>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    width: 600,
    height: 400,
  },
  title: {
    position: "relative",
    display: "block",
    width: 550,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  content: {
    width: 560,
    marginTop: 60,
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  eventInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyItems: "space-between",
  },
  timestamp: {
    color: "grey",
    fontSize: 12,
  },
  creator: {
    color: "grey",
    fontSize: 12,
    fontWeight: "bold",
  },
  channel: {
    fontWeight: "bold",
  },
  commentsContainer: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingRight: 10,
    paddingLeft: 10,
  },
  commentContainer: {
    marginTop: 10,
    flexDirection: "column",
  },
  comment: {
    marginBottom: 20,
  },
  commentIdentityContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  commentsTitle: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  commentUserName: {},
  commentResourceName: {
    fontSize: 12,
    color: "grey",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "grey",
  },
  commentRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 0px 4px 1px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

EventMarker.propTypes = {
  center: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
};
