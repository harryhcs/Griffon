/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, TextField, Grid, IconButton, Divider, Button, Select,
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import MouseIcon from '@material-ui/icons/Mouse';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Query } from 'react-apollo';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createEventContainer: {
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
  creator: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordinates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaData: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CREATE_EVENT = gql`
  mutation AddEvent($channel_id: Int!, $description: String!, $latitude: Float!, $longitude: Float!){
    insert_events(objects:[{channel_id: $channel_id, description: $description, latitude: $latitude, longitude: $longitude}]) {
      returning {
        id
      }
    }
  }
`;

export default function CreateEvent(props) {
  const { setShowCreateEvents } = props;
  const classes = useStyles();
  const [addEvent, { loading, data }] = useMutation(CREATE_EVENT);
  const [description, setDescription] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [channel, setChannel] = useState({ id: null, name: null });

  const hideEvent = () => {
    setShowCreateEvents(false);
  };
  const handleInput = (e) => {
    if (e.target.id === 'description') {
      setDescription(e.target.value);
    }
    if (e.target.id === 'latitude') {
      setLatitude(e.target.value);
    }
    if (e.target.id === 'longitude') {
      setLongitude(e.target.value);
    }
  };

  const handleCreateEvent = () => {
    addEvent({
      variables: {
        // eslint-disable-next-line radix
        description, channel_id: channel.id, latitude, longitude,
      },
    });
    if (!loading || data) {
      setDescription('');
      setLatitude('');
      setLongitude('');
      hideEvent();
    }
  };

  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.title}>
        <Grid item>
          <Typography style={{ marginLeft: 10 }} variant="h6">Create new Event</Typography>
        </Grid>
        <Grid item>
          <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={hideEvent}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.createEventContainer}>
        <Grid container lg={12}>
          <Grid item lg={12}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              multiline
              value={description}
              onInputCapture={handleInput}
              variant="outlined"
              rows={3}
            />
          </Grid>
          <Grid container className={classes.coordinates}>
            <Grid item>
              <TextField onInputCapture={handleInput} type="number" id="latitude" value={latitude} className={classes.coordinates} required id="latitude" label="Latitude" />
            </Grid>
            <Grid item>
              <TextField onInputCapture={handleInput} type="number" value={longitude} className={classes.coordinates} required id="longitude" label="Longitude" />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <MouseIcon color="secondary" fontSize="small" />
            </Grid>
            <Grid item>
              <Typography variant="caption">
                Click on map to fill in coordinates.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <Query
              query={gql`
                    query {
                      channels {
                        name
                        id
                      }
                    }`}
            >

              {(results) => {
                if (results.loading) {
                  return 'loading...';
                }
                if (results.data) {
                  return (
                    <FormControl className={classes.formControl}>
                      <InputLabel id="channel">Channel</InputLabel>
                      <Select
                        required
                        labelId="channel"
                        id="channel"
                        value={channel.name}
                        onChange={handleChannelChange}
                      >
                        {results.data.channels.map((c) => <MenuItem key={c.id} value={c}>{c.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  );
                }
                return 'Reload page';
              }}

            </Query>
          </Grid>
        </Grid>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Divider />
        <Button onClick={handleCreateEvent} style={{ margin: 10 }} variant="outlined" color="secondary">Create event</Button>
      </div>
    </div>
  );
}
