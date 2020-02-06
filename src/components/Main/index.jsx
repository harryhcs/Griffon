/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactMapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { Grid } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import 'mapbox-gl/dist/mapbox-gl.css';


// import { makeStyles } from '@material-ui/core/styles';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

import EventsFeed from '../Events/Feed/index';
import Event from '../Events/event';
import CreateEvent from '../Events/createEvent';
import Search from '../Search';
import Actions from '../Actions';

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
  contextMenu: {
    zIndex: 1000,
  },
  createEvent: {
    // position: 'absolute',
    // bottom: 0,
    zIndex: 1000,
    // flex: 1,
  },
}));

const DEFAULT_MARKER = 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';
const DEFAULT_MARKER_COLOR = 'black';

export default function Map() {
  const classes = useStyles();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -33.2577,
    longitude: 18.9376,
    zoom: 10,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [event, setEvent] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [showCreateEvent, setShowCreateEvents] = useState(false);
  const [coords, setCoords] = useState();

  const handleClick = (evt) => {
    if (showCreateEvent) {
      setCoords(evt.lngLat);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showEvent = (clickedEvent) => {
    setShowEvents(true);
    setEvent(clickedEvent);
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: clickedEvent.latitude,
      longitude: clickedEvent.longitude,
      transitionDuration: 'auto',
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
      zoom: 16,
    });
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
            <EventsFeed showEvent={showEvent} />
          </Grid>
          {
            showEvents ? (
              <Grid item className={classes.event}>
                <Event event={event} setShowEvents={setShowEvents} />
              </Grid>
            ) : null
          }
          {
            showCreateEvent ? (
              <Grid item className={classes.event}>
                <CreateEvent setCoords={setCoords} coords={coords} setShowCreateEvents={setShowCreateEvents} />
              </Grid>
            ) : null
          }
        </Grid>
      </Grid>
      <Actions setShowCreateEvents={setShowCreateEvents} setCoords={setCoords} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.contextMenu}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
      {/* <Grid container className={classes.createEvent} justify="center">
        <Grid item lg={4} md={6} sm={12}>
          <CreateEvent />
        </Grid>
      </Grid> */}
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicHBmY25zIiwiYSI6ImNrNW53MG0yeDBmcmkzbW5zZGkybWdtcjAifQ.lK9sv5uVdJieNLCV6krYwg"
        // onContextMenu={handleClick}
        onClick={handleClick}
      >
        {/* <Query
          query={gql`
          query {
            get_resources(args: {hasura_session: ""}) {
              id
            }
          }`}
        >
          {({ loading, error, data }) => {
            if (error) {
              return JSON.stringify(error);
            }
            if (loading) {
              return 'loading...';
            }
            if (data) {
              return JSON.stringify(data.get_session);
            }
            return "null";
          }}
        </Query> */}
        <Subscription
          subscription={gql`
            subscription {
              events {
                id
                created_at
                description
                resource {
                  id
                  name
                  assigned_user {
                    id
                    name
                    profile_picture
                  }
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
                    svg_data
                    color
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
            if (data && data.events.length > 0) {
              return data.events.map((e) => (
                e.latitude && e.longitude ? (
                  <Marker key={`marker-${e.id}`} longitude={e.longitude} latitude={e.latitude}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 48 48" onClick={() => showEvent(e)}>
                      <path
                        d={e.event_tags.length === 0 ? DEFAULT_MARKER : e.event_tags[0].tag.svg_data}
                        fill={e.event_tags.length === 0 ? DEFAULT_MARKER_COLOR : e.event_tags[0].tag.color}
                      />
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
