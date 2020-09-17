/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import EventsFeed from '../Events/Feed/index';
import Event from '../Events/event';
import CreateEvent from '../Events/createEvent';
import Toolbar from '../Toolbar';
import Actions from '../Actions';
import Resource from '../Resources';

import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';


const { BaseLayer, Overlay } = LayersControl
const center = [51.505, -0.09]
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
]


const useStyles = makeStyles(() => ({
  leftContainer: {
    position: 'fixed',
    borderRadius: 5,
    margin: 10,
    zIndex: 1000,
    top: 45,
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


export default function Griffon() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [event, setEvent] = useState(null);
  const [resource] = useState(null);
  const [showResource, setShowResource] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showCreateEvent, setShowCreateEvents] = useState(false);
  const [coords, setCoords] = useState();

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -32.9643724,
    longitude: 18.6221071,
    zoom: 10,
  });


  const handleClose = () => {
    setAnchorEl(null);
  };

  const showEvent = (clickedEvent) => {
    setShowEvents(true);
    setEvent(clickedEvent);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <Toolbar />
      </Grid>
      <Grid item>
        <Grid
          container
          item
          className={classes.leftContainer}
          lg={3}
          md={5}
          sm={8}
          xs={12}
        >
          <Grid className={classes.events} container>
            <Grid item>
              <EventsFeed showEvent={showEvent} />
            </Grid>
            {showEvents ? (
              <Grid item className={classes.event}>
                <Event event={event} setShowEvents={setShowEvents} />
              </Grid>
            ) : null}
            {showCreateEvent ? (
              <Grid item className={classes.event}>
                <CreateEvent
                  setCoords={setCoords}
                  coords={coords}
                  setShowCreateEvents={setShowCreateEvents}
                />
              </Grid>
            ) : null}
            {showResource ? (
              <Grid item className={classes.event}>
                <Resource
                  // handleAddHistory={handleAddHistory}
                  resourceId={resource.id}
                  setShowResource={setShowResource}
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Actions
          setShowCreateEvents={setShowCreateEvents}
          setCoords={setCoords}
        />
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
        <Map
          center={[viewport.latitude, viewport.longitude]}
          zoom={viewport.zoom}
          style={{ width: viewport.width, height: viewport.height }}
        >
          <LayersControl position="bottomright">
            <BaseLayer checked name="Street">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer name="Black And White">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
            </BaseLayer>
            <BaseLayer name="Topographical">
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              />
            </BaseLayer>
            <BaseLayer name="Satelite">
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </BaseLayer>

          </LayersControl>
        </Map>
      </Grid>
    </Grid >
  );
}
