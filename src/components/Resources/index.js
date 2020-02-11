/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, TextField, Grid, IconButton, Divider, Button,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import MarkerIcon from '@material-ui/icons/Room';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resource: {
    flex: 1,
    padding: 10,
    height: 500,
    overflow: 'scroll',
    overflowY: 'auto',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  resourceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default function Resource(props) {
  const { setShowResource, resourceId } = props;
  const classes = useStyles();

  const hideEvent = () => {
    setShowResource(false);
  };
  return (
    <div className={classes.root}>
      <Grid container className={classes.title}>
        <Grid item>
          {/* <Typography style={{ marginLeft: 10 }} variant="h6"></Typography> */}
        </Grid>
        <Grid item>
          <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={hideEvent}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <Subscription
        subscription={gql`
            subscription {
              resources_by_pk(id: ${resourceId}) {
                id
                name
                organisation {
                id
                name
                }
                assigned_user {
                id
                name
                profile_picture
                }
                locations(limit: 1, order_by: {created_at: desc}) {
                latitude
                longitude
                created_at
                }
            }
            }
       `}
      >
        {({ loading, error, data }) => {
          if (error) {
            return JSON.stringify(error);
          }
          if (loading) {
            return <CircularProgress />;
          }
          if (data) {
            return (
              <div className={classes.resource}>
                <Grid container spacing={2} className={classes.resourceInfoContainer}>
                  <Grid item lg={2}>
                    <Avatar
                      alt={data.resources_by_pk.assigned_user ? data.resources_by_pk.assigned_user.name : data.resources_by_pk.name}
                      src={data.resources_by_pk.assigned_user ? data.resources_by_pk.assigned_user.profile_picture : data.resources_by_pk.id}
                      className={classes.avatar}
                    />
                  </Grid>
                  <Grid item lg={9}>
                    <Typography variant="subtitle2">
                      {data.resources_by_pk.name}
                    </Typography>
                    <Typography variant="subtitle">
                      {data.resources_by_pk.organisation.name}
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      Resource ID:
                      {' '}
                      {data.resources_by_pk.id}
                    </Typography>
                    <br />
                    {data.resources_by_pk.assigned_user ? (
                      <Typography variant="caption">
                      Assigned user:
                        {' '}
                        {data.resources_by_pk.assigned_user.name}
                      </Typography>
                    ) : null}
                  </Grid>
                </Grid>
                <br />
                <Divider />
                <br />
                {/* {data.resources_by_pk.locations.length > 0 ? (
                  <Grid container spacing={2} className={classes.row}>
                    <Grid item lg={4}>
                      Last activity:
                    </Grid>
                    <Grid item lg={6}>
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).fromNow()}</Typography><br />
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).format('ddd L HH:MM A')}</Typography>
                    </Grid>
                  </Grid>
                ) : null} */}
                {data.resources_by_pk.locations.length > 0 ? (
                  <Grid container spacing={2} className={classes.row}>
                    <Grid item lg={4}>
                      Last location:
                    </Grid>
                    <Grid item lg={6}>
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).fromNow()}</Typography><br />
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).format('ddd L HH:MM A')}</Typography><br />
                      <Grid container>
                        <Grid item>
                        <MarkerIcon color="secondary" fontSize="small" />
                        </Grid>
                        <Grid item>
                        <Typography variant="caption">({data.resources_by_pk.locations[0].latitude}, {data.resources_by_pk.locations[0].longitude})</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
              </div>
            );
          }
          return null;
        }}
      </Subscription>
      <div className={classes.resourceContainer}>
        <Grid container>
          <Grid item />
          <Grid item lg={12}><Divider /></Grid>
        </Grid>
      </div>
    </div>
  );
}
