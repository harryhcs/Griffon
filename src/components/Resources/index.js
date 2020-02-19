/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, Grid, IconButton, Divider, Button,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import MarkerIcon from '@material-ui/icons/Room';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag';
import { Subscription, Query } from 'react-apollo';
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

// const GET_HISTORY = gql`
//   query getHistory($id: !Int, $timestamp: Timestamp!) {
//     resources_by_pk(id: $id) {
//       locations(where: {created_at: {_gte: $timestamp}}) {
//         id
//         latitude
//         longitude
//         created_at
//       }
//     }
//   }
// `;

export default function Resource(props) {
  const { setShowResource, handleAddHistory, resourceId } = props;
  const classes = useStyles();
  const [showHistory, setShowHistory] = useState(false);

  const handleClick = () => {
    setShowHistory(true);
  };


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
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).fromNow()}</Typography>
                      <br />
                      <Typography variant="caption">{moment(data.resources_by_pk.locations[0].created_at).format('ddd L HH:MM A')}</Typography>
                      <br />
                      <Grid container>
                        <Grid item>
                          <MarkerIcon color="secondary" fontSize="small" />
                        </Grid>
                        <Grid item>
                          <Typography variant="caption">
(
                            {data.resources_by_pk.locations[0].latitude.toFixed(5)}
,
                            {data.resources_by_pk.locations[0].longitude.toFixed(5)}
)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
                <Grid container>
                  <Grid item>
                    <Button onClick={handleClick}>Show history for today</Button>
                    {showHistory ? (
                      <Query query={gql`query {
                          resources_by_pk(id: ${data.resources_by_pk.id}) {
                            locations(where: {created_at: {_gte: "${moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ')}"}}) {
                              id
                              latitude
                              longitude
                              created_at
                            }
                          }
                        }`}
                      >
                        {(result) => {
                          if (result.error) {
                            return JSON.stringify(result.error);
                          }
                          if (result.loading) {
                            return <CircularProgress />;
                          }
                          if (result.data) {
                            handleAddHistory(result.data.resources_by_pk.locations);
                          }
                          return null;
                        }}
                      </Query>
                    ) : null}
                  </Grid>
                </Grid>
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
