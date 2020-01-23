/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

// import { makeStyles } from '@material-ui/core/styles';
import { Subscription } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';

import Toolbar from '../Toolbar/index';
import EventsFeed from '../Events/Feed/index';
import Pins from './pins';

// const useStyles = makeStyles(theme => ({
//   root: {

//   },
// }));

export default function Map() {
  // const classes = useStyles();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: -32.7577,
    longitude: 18.4376,
    zoom: 10,
  });

  const [assets, setAssets] = useState([]);

  return (
    <div>
      <Toolbar />
      <EventsFeed />
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicHBmY25zIiwiYSI6ImNrNW53MG0yeDBmcmkzbW5zZGkybWdtcjAifQ.lK9sv5uVdJieNLCV6krYwg"
      >
        {/* <Subscription
          subscription={gql`
            subscription { 
              resources {
                id
                name
                locations(order_by: {created_at: desc}) {
                  created_at
                  latitude
                  longitude
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
              return data.resources.length > 0 ? (
                <Pins data={data.resources} />
              ) : null;
            }
            return null;
          }}
        </Subscription> */}
      </ReactMapGL>
    </div>
  );
}
