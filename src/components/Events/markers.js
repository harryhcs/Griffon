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
import { Functions } from "@material-ui/icons";

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

const EVENT_SUB = gql`
  subscription getComments($eventId: Int!) {
    events_by_pk(id: $eventId) {
      event_comments {
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
      attachments {
        id
        created_at
        uri
        resourceByResource {
          id
          name
          assigned_user {
            id
            name
          }
        }
      }
    }
  }
`;

const Comments = ({eventId}) => {
  const classes = useStyles();
  const el = useRef(null);
  
  const { loading: loadingEvent, data: dataEvent } = useSubscription(
    EVENT_SUB,
    {
      variables: {
        eventId,
      },
    }
  );
  
  if (loadingEvent) {
    return (
      <Grid container className={classes.commentsContainer}>
        "Loading..."
      </Grid>
    );
  }
  if (dataEvent) {
    let comments = dataEvent.events_by_pk.event_comments
      .concat(dataEvent.events_by_pk.attachments);
    comments.sort((a, b) => a.created_at - b.created_at)
    return (
      <Grid container className={classes.commentsContainer}>
        {comments.map((c) => {
              return (
                <Grid
                  className={classes.commentLine}
                  key={c.id}
                  container
                  direction="row"
                  justify="flex-end"
                  spacing={1}
                >
                  <Grid item lg={2}>
                    <Avatar src={c.user ? c.user.profile_picture : null} />
                  </Grid>
                  <Grid item lg={10}>
                    <div className={classes.commentResourceName}>
                      {c.user ? c.user.name : null} (
                      {c.user
                        ? c.user.resource.name
                        : c.resourceByResource
                        ? c.resourceByResource.name
                        : null}
                      )
                    </div>
                    <div className={classes.comment}>
                      {c.comment ? (
                        c.comment
                      ) : c.uri ? (
                        <img src={c.uri} width="250" />
                      ) : null}
                    </div>
                    <div className={classes.commentTimestamp}>
                      {moment(c.created_at).fromNow()}
                    </div>
                  </Grid>
                </Grid>
              );
            })}
        <div id="el" ref={el} />
      </Grid>
    );
  }
}

export default function EventMarker(props) {
  const classes = useStyles();
  const { center, event } = props;
  const [AddComment, { loading, data }] = useMutation(ADD_COMMENT);
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
              <Grid container>
                <Grid item className={classes.comments}>
                  <Typography className={classes.commentsTitle}>
                    Comments
                  </Typography>
                  <Comments eventId={event.id} />
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
    width: 500,
    // height: 400,
  },
  title: {
    position: "relative",
    display: "block",
    width: 450,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  content: {
    width: 460,
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
    paddingRight: 10,
    paddingLeft: 10,
    height: 250,
    overflow: "scroll",
  },
  commentContainer: {
    flexDirection: "column",
  },
  commentLine: {
    marginBottom: 10,
  },
  comment: {
    fontSize: 12,
    color: "black",
  },
  commentIdentityContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  commentsTitle: {
    fontWeight: "bold",
  },
  commentUserName: {},
  commentResourceName: {
    fontSize: 12,
    color: "grey",
  },
  commentTimestamp: {
    fontSize: 10,
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
