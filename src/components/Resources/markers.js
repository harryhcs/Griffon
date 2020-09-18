/* eslint-disable react/jsx-filename-extension */
import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import { Marker, Popup } from "react-leaflet";

import { Link } from "react-router-dom";

import BatteryCharging20Icon from "@material-ui/icons/BatteryCharging20";
import BatteryCharging30Icon from "@material-ui/icons/BatteryCharging30";
import BatteryCharging50Icon from "@material-ui/icons/BatteryCharging50";
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60";
import BatteryCharging80Icon from "@material-ui/icons/BatteryCharging80";
import BatteryCharging90Icon from "@material-ui/icons/BatteryCharging90";
import BatteryChargingFullIcon from "@material-ui/icons/BatteryChargingFull";
import Battery20Icon from "@material-ui/icons/Battery20";
import Battery30Icon from "@material-ui/icons/Battery30";
import Battery50Icon from "@material-ui/icons/Battery50";
import Battery60Icon from "@material-ui/icons/Battery60";
import Battery80Icon from "@material-ui/icons/Battery80";
import Battery90Icon from "@material-ui/icons/Battery90";
import BatteryFullIcon from "@material-ui/icons/BatteryFull";
import L from "leaflet";

import { gql, useLazyQuery } from "@apollo/client";

import ChecvronIcon from "../../assets/markers/chevron.svg";
import CameraIcon from "../../assets/markers/camera.svg";
import CarIcon from "../../assets/markers/car.svg";

const GET_HISTORY = gql`
  query getHistory($resourceId: Int!, $from: timestamptz!, $to: timestamptz!) {
    resources_by_pk(id: $resourceId) {
      geolocations(where: { created_at: { _gte: $from, _lte: $to } }) {
        id
        latitude
        longitude
        altitude
        speed
        accuracy
        created_at
      }
    }
  }
`;

export default function ResourceMarker(props) {
  const classes = useStyles();
  const { position, heading, resource, setHistoryLines } = props;
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const battery = resource.attributes.find((e) => e.key === "battery");
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [
    getHistory,
    { dataHistory, loadingHistory, errorHistory },
  ] = useLazyQuery(GET_HISTORY, {
    onCompleted: (e) => {
      setHistoryLines({
        color: getRandomColor(),
        path: [
          e.resources_by_pk.geolocations.map((loc) => [
            loc.latitude,
            loc.longitude,
          ]),
        ],
      });
    },
  });

  var ms =
    new Date().getTime() -
    new Date(resource.geolocations[0].created_at).getTime();
  var seconds = Math.floor(ms / 1000);
  var minutes = Math.floor(seconds / 60);

  let opacity = 1;
  let display = "block";

  if (minutes >= 60) {
    display = "none";
  }
  if (minutes >= 30) {
    opacity = 0.3;
  }
  if (minutes >= 20) {
    opacity = 0.4;
  }
  if (minutes >= 10) {
    opacity = 0.5;
  }
  if (minutes >= 5) {
    opacity = 0.7;
  }
  if (minutes <= 2) {
    opacity = 1;
  }
  const getBattery = (battery) => {
    if (battery.charging) {
      if (battery.level === 100) {
        return <BatteryChargingFullIcon />;
      }
      if (battery.level < 100 && battery.level >= 90) {
        return <BatteryCharging90Icon />;
      }
      if (battery.level < 90 && battery.level >= 80) {
        return <BatteryCharging80Icon />;
      }
      if (battery.level < 80 && battery.level >= 60) {
        return <BatteryCharging60Icon />;
      }
      if (battery.level < 60 && battery.level >= 50) {
        return <BatteryCharging50Icon />;
      }
      if (battery.level < 50 && battery.level >= 30) {
        return <BatteryCharging30Icon />;
      }
      if (battery.level < 30) {
        return <BatteryCharging20Icon />;
      }
    }
    if (!battery.charging) {
      if (battery.level === 100) {
        return <BatteryFullIcon />;
      }
      if (battery.level < 100 && battery.level >= 90) {
        return <Battery90Icon />;
      }
      if (battery.level < 90 && battery.level >= 80) {
        return <Battery80Icon />;
      }
      if (battery.level < 80 && battery.level >= 60) {
        return <Battery60Icon />;
      }
      if (battery.level < 60 && battery.level >= 50) {
        return <Battery50Icon />;
      }
      if (battery.level < 50 && battery.level >= 30) {
        return <Battery30Icon />;
      }
      if (battery.level < 30) {
        return <Battery20Icon />;
      }
    }
  }
  const setHistoryDate = (date, t) => {
    if (t === "from") {
      setFromDate(date);
    }
    if (t === "to") {
      setToDate(date);
    }
  };

  const handleGetHistory = () => {
    getHistory({
      variables: {
        resourceId: resource.id,
        from: fromDate,
        to: toDate,
      },
    });
  }
  const showGallery = () => {
    
  }
  const defaultIcon = new L.divIcon({
    className: "",
    html: `<img src=${ChecvronIcon} width="12px" style="transform: rotate(${heading}deg); opacity: ${opacity}; display: ${display}"/>`,
  });
  const cameraIcon = new L.divIcon({
    className: "",
    html: `<img src=${CameraIcon} width="12px" style="transform: rotate(${heading}deg); opacity: ${opacity}; display: ${display}"/>`,
  });
  const carIcon = new L.divIcon({
    className: "",
    html: `<img src=${CarIcon} width="12px" style="transform: rotate(${heading}deg); opacity: ${opacity}; display: ${display}"/>`,
  });


  return (
    <Marker position={position} icon={resource.icon ? resource.icon === 'camera' ? cameraIcon : resource.icon === 'car' ? carIcon : defaultIcon:  defaultIcon}>
      <Popup className={classes.root}>
        <div className={classes.resource}>
          <Grid container spacing={2} className={classes.resourceInfoContainer}>
            {resource.assigned_user ? (
              <Grid item lg={2}>
                <Avatar
                  alt={
                    resource.assigned_user
                      ? resource.assigned_user.name
                      : resource.name
                  }
                  src={
                    resource.assigned_user
                      ? resource.assigned_user.profile_picture
                      : resource.id
                  }
                  className={classes.avatar}
                />
                <br />
                {battery ? getBattery(battery.value) : null}{" "}
                <Typography variant="caption">
                  ({battery.value.level.toFixed(0)}%)
                </Typography>
              </Grid>
            ) : null}
            <Grid item lg={9}>
              <Typography variant="subtitle2">{resource.name}</Typography>
              <Typography variant="subtitle1">
                {resource.organisation.name}
              </Typography>
              <br />
              <Typography variant="caption">
                Resource ID: {resource.id}
              </Typography>
              <br />
              {resource.assigned_user ? (
                <Typography variant="caption">
                  Assigned user: {resource.assigned_user.name}
                </Typography>
              ) : null}
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          {resource.attributes.length > 0 ? (
            <Grid container spacing={2} className={classes.row}>
              <Grid item lg={4}>
                Last activity:
              </Grid>
              <Grid item lg={6}>
                <Typography variant="caption">
                  {moment(resource.attributes[0].created_at).fromNow()}
                </Typography>
              </Grid>
            </Grid>
          ) : null}
          {resource.geolocations.length > 0 ? (
            <div>
              <Grid container spacing={2} className={classes.row}>
                <Grid item lg={4}>
                  Last location:
                </Grid>
                <Grid item lg={6}>
                  <Typography variant="caption">
                    {moment(resource.geolocations[0].created_at).fromNow()}
                  </Typography>
                  <Grid container>
                    <Grid item>
                      <Typography variant="caption">
                        ({resource.geolocations[0].latitude.toFixed(5)},
                        {resource.geolocations[0].longitude.toFixed(5)})
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {resource.geolocations[0].accuracy ? (
                <Grid container spacing={2} className={classes.row}>
                  <Grid item lg={4}>
                    Accuracy:
                  </Grid>
                  <Grid item lg={6}>
                    <Typography variant="caption">
                      {resource.geolocations[0].accuracy.toFixed(0)}m
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              {resource.geolocations[0].speed ? (
                <Grid container spacing={2} className={classes.row}>
                  <Grid item lg={4}>
                    Speed:
                  </Grid>
                  <Grid item lg={6}>
                    <Typography variant="caption">
                      {resource.geolocations[0].speed.toFixed(2)} km/h
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
              {resource.geolocations[0].altitude ? (
                <Grid container spacing={2} className={classes.row}>
                  <Grid item lg={4}>
                    Altitude:
                  </Grid>
                  <Grid item lg={6}>
                    <Typography variant="caption">
                      {resource.geolocations[0].altitude.toFixed(2)}m
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
            </div>
          ) : null}
          <br />
          <Divider />
          <br />
          <Grid container>
            <Grid item>
              <TextField
                onChange={(e) => setHistoryDate(e.target.value, "from")}
                id="datetime-local-from"
                label="Get history from"
                type="datetime-local"
                defaultValue={moment(new Date()).format("YYYY-MM-DDTHH:MM")}
                className={classes.PickerTextField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                onChange={(e) => setHistoryDate(e.target.value, "to")}
                id="datetime-local-to"
                label="to"
                type="datetime-local"
                defaultValue={moment(new Date()).format("YYYY-MM-DDTHH:MM")}
                className={classes.PickerTextField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGetHistory}
              >
                Show history
              </Button>
            </Grid>
          </Grid>
          {resource.attachments.length > 0 && (
            <>
              <br />
              <Divider />
              <br />
              <Grid container>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={showGallery}
                    component={Link}
                    to={`/gallery/${resource.id}`}
                  >
                    View Gallery
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {/* <Grid container>
            <Grid item>
              <Button onClick={handleClick}>Show history for today</Button>
              {showHistory && loadingGeolcation ? <CircularProgress /> : null}
              {showHistory && dataGeolcation
                ? handleAddHistory(dataGeolcation.resources_by_pk.geolocations)
                : null}
            </Grid>
          </Grid> */}
        </div>
      </Popup>
    </Marker>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    width: 300,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resource: {
    flex: 1,
    padding: 10,
    overflow: "scroll",
    overflowY: "auto",
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  resourceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  PickerTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    marginBottom: 10,
  },
}));

ResourceMarker.propTypes = {
  position: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  heading: PropTypes.number,
};

ResourceMarker.defaultProps = {
  heading: 0,
};
