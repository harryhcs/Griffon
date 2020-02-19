/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, TextField, Grid, IconButton, Divider, Button, Select, Input,
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
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
    marginTop: 10,
    marginBottom: 10,
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
  mutation AddEvent($channel_id: Int!, $description: String!, $latitude: Float!, $longitude: Float!, $parameters: jsonb!, $tag_id: Int!){
    insert_events(objects:[{channel_id: $channel_id, description: $description, latitude: $latitude, longitude: $longitude, event_tags: {data: {parameters: $parameters, tag_id: $tag_id}}}]) {
      returning {
        id
      }
    }
  }
`;

export default function CreateEvent(props) {
  const { setShowCreateEvents, setCoords, coords } = props;
  const classes = useStyles();
  const [addEvent, { loading, data }] = useMutation(CREATE_EVENT);
  const [description, setDescription] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [channel, setChannel] = useState();
  const [tag, setTag] = useState();
  const [parameters, setParamaters] = useState({});

  useEffect(() => {
    if (coords) {
      setLatitude(coords[1].toFixed(5));
      setLongitude(coords[0].toFixed(5));
    }
  }, [coords]);

  const hideEvent = () => {
    setShowCreateEvents(false);
    setCoords(null);
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
        description, channel_id: channel.id, latitude, longitude, tag_id: tag.id, parameters,
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

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const handleDelete = () => {
    setTag();
  };
  const handleParameterChange = (e) => {
    setParamaters(parameters, parameters[e.target.id] = e.target.value);
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
        <Grid container>
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
              <Input
                onInputCapture={handleInput}
                id="latitude"
                value={latitude}
                className={classes.coordinates}
                required
                placeholder="Latitude"
              />
            </Grid>
            <Grid item>
              <Input
                onInputCapture={handleInput}
                value={longitude}
                className={classes.coordinates}
                required
                id="longitude"
                placeholder="Longitude"
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <MouseIcon color="secondary" fontSize="small" />
            </Grid>
            <Grid item>
              <Typography variant="caption">
                Click on map to fill in coordinates.
              </Typography>
            </Grid>
          </Grid>
          <Grid item lg={12}><Divider /></Grid>
        </Grid>
        <Grid container spacing={2} flexDirection="row" justifyItems="flex-end">
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
                        value={channel || ''}
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
          <Grid item>
            <Query
              query={gql`
              query {
                tags {
                  id
                  name
                  color
                  svg_data
                  tag_parameters {
                    id
                    field_name
                    field_type
                  }
                }
              }`}
            >

              {(results) => {
                if (results.loading) {
                  return 'loading...';
                }
                if (results.data) {
                  return (
                    tag ? null : (
                      <FormControl className={classes.formControl}>
                        <InputLabel id="tag">Tag</InputLabel>
                        <Select
                          labelId="tag"
                          id="tag"
                          defaultValue=""
                          value={tag || ''}
                          onChange={handleTagChange}
                        >
                          {results.data.tags.map((t) => <MenuItem key={t.id} value={t}>{t.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )
                  );
                }
                return 'Reload page';
              }}

            </Query>
            <div style={{ marginTop: 32 }}>
              {tag ? (
                <Chip
                  size="small"
                  // icon={t.tag.svg_data}
                  label={tag.name}
                  onDelete={handleDelete}
                  color="secondary"
                />
              ) : null}
            </div>
            {tag ? tag.tag_parameters.map((parameter) => (
              <div>
                <TextField onInputCapture={handleParameterChange} id={parameter.field_name} label={parameter.field_name} size="small" style={{ marginTop: 10 }} />
                <br />
              </div>
            )) : null}
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
