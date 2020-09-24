import React, { useState } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  InputBase,
  TextField,
  IconButton,
  CircularProgress,
  Input,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { useParams, Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import { useSelector } from "react-redux";
import moment from "moment";
import Loading from "../../components/Loading";

import { useAuth0 } from "../../components/Auth";

moment.locale("en", {
  relativeTime: {
    past: "%s",
    s: "s",
    ss: "%ss",
    m: "m",
    mm: "%dm",
    h: "h",
    hh: "%dh",
    d: "d",
    dd: "%dd",
    M: "m",
    MM: "%dM",
    y: "y",
    yy: "%dY",
  },
});

const CONVERSATION_SUB = gql`
  subscription getConversation($id: Int!) {
    conversations_by_pk(id: $id) {
      id
      name
      isGroup
      user {
        id
        fullname
        profile_picture
        auth0_id
      }
      conversationMembers {
        userByUser {
          id
          fullname
          profile_picture
          auth0_id
        }
      }
      chats {
        id
        message
        userByUser {
          fullname
          profile_picture
          auth0_id
        }
      }
    }
  }
`;

export default function Conversation({ id }) {
  const classes = useStyles();
  const { user } = useAuth0();
  const { data, loading } = useSubscription(CONVERSATION_SUB, {
    variables: {
      id,
    },
  });
  if (loading) {
    return "Loading...";
  }
  if (data) {
    const conversation = data.conversations_by_pk;
    return (
      <div className={classes.root}>
        <Grid container justify="space-between" spacing={2} alignItems="center">
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              spacing={2}
              alignItems="center"
            >
              <Grid item>
                <Avatar
                  src={
                    conversation.isGroup
                      ? null
                      : conversation.conversationMembers[0].userByUser
                          .profile_picture
                  }
                >
                  {conversation.isGroup ? "G" : null}
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h6" className={classes.white}>
                  {conversation.isGroup
                    ? conversation.name
                    : user.sub === conversation.user.auth0_id
                    ? conversation.conversationMembers[0].userByUser.fullname
                    : conversation.user.fullname}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton aria-label="Close" color="inherit">
              <CloseIcon color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.chats}>
          {conversation.chats.map((chat) => (
            <div key={chat.id}>
              <Grid
                container
                direction="row"
                alignItems="flex-end"
                justify={
                  user.sub !== chat.userByUser.auth0_id
                    ? "flex-start"
                    : "flex-end"
                }
                className={classes.chatLine}
              >
                {user.sub !== chat.userByUser.auth0_id ? (
                  <Grid item lg={2}>
                    <Avatar
                      className={classes.avatarSmall}
                      src={chat.userByUser.profile_picture}
                    />
                  </Grid>
                ) : null}

                <Grid item sm={8}>
                  <Grid
                    container
                    justify={
                      user.sub !== chat.userByUser.auth0_id
                        ? "flex-start"
                        : "flex-end"
                    }
                  >
                    <Grid item>
                      <div
                        className={classes.bubble}
                        style={{
                          backgroundColor:
                            user.sub !== chat.userByUser.auth0_id
                              ? "#888"
                              : "#0496ff",
                        }}
                      >
                        {chat.message}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
        <div className={classes.chat}></div>
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    BorderRadiusTopleft: 20,
    BorderRadiusTopright: 20,
    backgroundColor: theme.palette.primary.main,
    padding: 10,
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    position: "fixed",
    bottom: 0,
    right: 10,
    height: 400,
    width: 300,
  },
  white: {
    color: theme.palette.common.white,
  },
  chats: {
    height: 300,
    overflow: "scroll",
    padding: 5,
  },
  chat: {
    height: 30,
  },
  chatLine: {
    marginBottom: 10,
  },
  bubble: {
    display: "inline-block",
    borderRadius: 20,
    color: "white",
    backgroundColor: "#5d9b9d",
    padding: 10,
  },
  avatarSmall: {
    width: 35,
    height: 35,
  },
}));
