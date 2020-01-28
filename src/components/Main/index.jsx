/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Grid } from '@material-ui/core';
import 'mapbox-gl/dist/mapbox-gl.css';


// import { makeStyles } from '@material-ui/core/styles';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import Toolbar from '../Toolbar/index';
import EventsFeed from '../Events/Feed/index';
import Event from '../Events/event';
import Search from '../Search';
import Pins from './pins';

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    position: 'fixed',
    borderRadius: 5,
    margin: 10,
    zIndex: 1000,
  },
  search: {
    position: 'relative',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
    borderRadius: 5,
  },
  events: {
    position: 'relative',
    top: 10,
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
    borderRadius: 5,
  },
  event: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'white',
  },
}));

export default function Map() {
  const classes = useStyles();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -33.2577,
    longitude: 18.9376,
    zoom: 10,
  });
  const [event, setEvent] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const showEvent = (clickedEvent) => {
    setShowEvents(true);
    setEvent(clickedEvent);
  };

  return (
    <div>
      {/* <Toolbar /> */}
      <Grid container lg={3} md={3} sm={12} className={classes.leftContainer}>
        <Grid className={classes.search} container>
          <Grid item>
            <Search />
          </Grid>
        </Grid>
        <Grid className={classes.events} container>
          <Grid item>
            <EventsFeed />
          </Grid>
          {
            showEvents ? (
              <Grid item className={classes.event}>
                <Event event={event} setShowEvents={setShowEvents}/>
              </Grid>
            ) : null
          }
        </Grid>
      </Grid>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicHBmY25zIiwiYSI6ImNrNW53MG0yeDBmcmkzbW5zZGkybWdtcjAifQ.lK9sv5uVdJieNLCV6krYwg"
      >

        <Subscription
          subscription={gql`
            subscription {
              events {
                id
                created_at
                description
                event_comments(order_by: {created_at: asc}) {
                  user {
                    id
                    name
                    profile_picture
                    resource {
                      name
                    }
                  }
                  comment
                  created_at
                }
                resource {
                  id
                  name
                  assigned_user {
                    id
                    name
                    profile_picture
                  }
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
        >
          {({ loading, error, data }) => {
            if (error) {
              return JSON.stringify(error);
            }
            if (loading) {
              return 'loading...';
            }
            if (data && data.events.length > 0) {
              return data.events.map((event) => (
                event.locations.length > 0 ? (
                  <Marker key={`marker-${event.id}`} longitude={event.locations[0].longitude} latitude={event.locations[0].latitude}>
                    <svg height="12" width="12" onClick={() => showEvent(event)}>
                      <circle cx="6" cy="6" r="5" fill="red" />
                    </svg>
                  </Marker>
                ) : null
              ));
            }
            return null;
          }}
        </Subscription>
      </ReactMapGL>
    </div>
  );
}
