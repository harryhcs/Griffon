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


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    // backgroundColor: theme.palette.background.paper,
  },
  item: {
    '&:hover': {
      background: '#efefef',
    },
    cursor: 'pointer',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    position: 'relative',
    display: 'block',
    width: 280,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
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
    <Grid container className={classes.item} onClick={() => data.showEvent(data.events[index])}>
      <Grid item>
        <Typography className={classes.description}>
          {data.events[index].description}
        </Typography>
        {data.events[index].user.resource ? (
          <Typography className={classes.creator}>
            {' '}
          by
            {' '}
            {data.events[index].user.resource.name}
          </Typography>
        ) : null}

        <Typography className={classes.timestamp}>
          {moment(data.events[index].created_at).fromNow()}
          {' '}
          in
          {' '}
          <span className={classes.channel}>{data.events[index].channel.name}</span>
        </Typography>

      </Grid>
      <Grid item>
        {data.events[index].latitude && data.events[index].longitude ? (
          <IconButton>
            <LocationIcon color="secondary" />
          </IconButton>
        ) : (null)}
      </Grid>
    </Grid>
  );
}

export default function EventList({ showEvent }) {
  const classes = useStyles();

  return (
    <Subscription
      subscription={gql`
      subscription { 
        events(order_by: {created_at: desc}) {
                id
                created_at
                description
                event_comments(order_by: {created_at: asc}) {
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
                user {
                  id
                  name
                  profile_picture
                  resource {
                    id
                    name
                  }
                }
                latitude
                longitude
                channel {
                  id
                  name
                }
                event_tags {
                  tag {
                    id
                    name
                    tag_parameters {
                      id
                      field_name
                      field_type
                    }
                  }
                  parameters 
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
          return 'loading...';
        }
        if (data) {
          return data.events.length > 0 ? (
            <div className={classes.root}>
              <FixedSizeList
                height={500}
                itemSize={46}
                itemCount={data.events.length}
                itemData={{ events: data.events, showEvent }}
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
