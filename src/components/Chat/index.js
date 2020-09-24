import React, { useState } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Button,
  Grid,
  InputBase,
  TextField,
  CircularProgress,
  Input,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useParams, Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import moment from "moment";
import Loading from "../../components/Loading";

import Conversation from './conversation';

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

const CONVERASATIONS_SUB = gql`
  subscription {
    conversations {
      id
      name
      isGroup
      user {
        id
        fullname
        profile_picture
      }
      conversationMembers {
        userByUser {
          id
          fullname
          profile_picture
        }
      }
      chats(limit: 1, order_by: { created_at: desc }) {
        id
        created_at
        message
        userByUser {
          id
          fullname
          profile_picture
        }
      }
    }
  }
`;
const USERS_SUB = gql`
  subscription {
    users(where: {organisation: {_eq: 1}}) {
      id
      fullname
      profile_picture
      resource {
        id
        name
      }
    }
  }
`;

export default function Chat(props) {
  const classes = useStyles();
//   const {data, loading, error} = useSubscription(CONVERASATIONS_SUB);
  return (
    <>
      <Conversation id={5} />
      {/* <div className={classes.root}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h6" className={classes.white}>
              Messanger
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon color="inherit" />
              </div>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={[]}
                renderInput={(params) => (
                  <InputBase
                    ref={params.InputProps.ref}
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                )}
                //   id="free-solo-demo"
                //   getOptionSelected={(option, value) => option.name === value.name}
                //   getOptionLabel={(option) => option.name}
                //   options={[data ? data.users : []]}
                //   loading={loading}
                //   renderInput={(params) => (

                //   )}
              />
            </div>
          </Grid>
          <Grid item>
            {error && JSON.stringify(error)}
            {loading ? (
              <CircularProgress />
            ) : data ? (
              data.conversations.map((conversation) => (
                <Grid
                  key={conversation.id}
                  container
                  direction="column"
                  spacing={2}
                  className={classes.user}
                >
                  <Grid item>
                    <Grid
                      container
                      direction="row"
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
                        <Typography
                          variant="subtitle1"
                          className={classes.white}
                        >
                          {conversation.isGroup
                            ? conversation.name
                            : conversation.conversationMembers[0].userByUser
                                .fullname}
                        </Typography>
                        <Typography variant="caption" className={classes.white}>
                          {conversation.chats.length
                            ? `${conversation.chats[0].message} - ${moment(
                                conversation.chats[0].created_at
                              ).fromNow()}`
                            : null}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))
            ) : null}
          </Grid>
        </Grid>
      </div> */}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    position: "fixed",
    top: 64,
    right: 0,
    minHeight: "100%",
    width: 300,
  },
  white: {
    color: theme.palette.common.white,
  },
  user: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  search: {
    position: "relative",
    borderRadius: 20,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: "100%",
    color: fade(theme.palette.common.white, 0.15),
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: theme.palette.common.white,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
