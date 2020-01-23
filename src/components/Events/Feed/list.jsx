/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Grid } from '@material-ui/core';
import LocationIcon from '@material-ui/icons/Place';

import { FixedSizeList } from 'react-window';
import { Subscription } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    backgroundColor: theme.palette.background.paper,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {

  },
  timestamp: {
    color: 'grey',
    fontSize: 12,
  },
  creator: {
    color: 'grey',
    fontSize: 12,
    fontWeight: 'bold',
  },
  channel: {
    fontWeight: 'bold',
  },
}));

function renderRow(props) {
  const classes = useStyles();
  const { index, data } = props;
  return (
    <Grid container className={classes.item}>
      <Grid item>
        <Typography className={classes.description}>
          {data[index].description}
        </Typography>
        <span className={classes.creator}>
          {' '}
          by
          {' '}
          {data[index].resource.name}
        </span>
        <br />
        <span className={classes.timestamp}>
          {moment(data[index].created_at).fromNow()}
          {' '}
          in
          {' '}
          <span className={classes.channel}>{data[index].channel.name}</span>
        </span>

      </Grid>
      <Grid item>
        {data[index].locations.length > 0 ? (
          <IconButton>
            <LocationIcon color="secondary" />
          </IconButton>
        ) : (null)}
      </Grid>
    </Grid>
  );
}

export default function EventList() {
  const classes = useStyles();

  return (
    <Subscription
      subscription={gql`
      subscription { 
        events(order_by: {created_at: desc}) {
                id
                created_at
                description
                resource {
                  id
                  name
                }
                locations {
                  latitude
                  longitude
                  created_at
                }
                channel {
                  id
                  name
                }
              }
            }
        `}
    // onSubscriptionData={
    //   ({ subscriptionData, client }) => {
    //     if (subscriptionData.data.events.length > 0) {
    //       // const audio = new Audio(notificationSound)
    //       // audio.play();
    //     }
    //   }
    // }
    >
      {({ loading, error, data }) => {
        if (error) {
          return JSON.stringify(error);
        }
        if (loading) {
          return 'loading...';
        }
        if (data) {
          return data.events.length > 0 ? (
            <div className={classes.root}>
              <FixedSizeList
                height={400}
                itemSize={46}
                itemCount={data.events.length}
                itemData={data.events}
              >
                {renderRow}
              </FixedSizeList>
            </div>
          ) : null;
        }
        return null;
      }}
    </Subscription>
  );
}
