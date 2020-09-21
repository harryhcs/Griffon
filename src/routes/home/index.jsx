import React, { useState, useEffect } from 'react';
import {
  LayerGroup,
  LayersControl,
  Map,
  Polyline,
  TileLayer,
  ZoomControl
} from 'react-leaflet';
import PropTypes from 'prop-types';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, Avatar, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Divider, Drawer, Hidden,Container, Grid, Card, CardHeader, CardMedia } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import 'leaflet/dist/leaflet.css';
import ResourceMarker from '../../components/Resources/markers';
import {gql, useSubscription} from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import Logo from '../../assets/images/logo.png';
import EventsFeed from '../../components/Events/Feed';

const { BaseLayer, Overlay } = LayersControl;
const drawerWidth = 240;

const GET_RESOURCES = gql`
  subscription {
    resources {
      id
      name
      icon
      attachments {
        id
        uri
        event
      }
      assigned_user {
        name
        profile_picture
      }
      organisation {
        name
      }
      attributes(limit: 1, order_by: {created_at: desc}) {
        key
        value
      }
      geolocations(limit: 1, order_by: {created_at: desc}) {
        latitude
        longitude
        heading
        altitude
        speed
        accuracy
        created_at
      }
    }
  }
`;

export default function Home(props) {
  const { win } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container =
    win !== undefined ? () => win().document.body : undefined;
  const dispatch = useDispatch();
  const { viewport } = useSelector((state) => state.mapReducer);
  const { data, loading, error } = useSubscription(GET_RESOURCES);
  const [historyLines, setHistoryLines] = useState({path:[], color: 'red'});

  const handleMoveend = (e) => {
    dispatch({
      type: 'UPDATE_VIEWSTATE',
      payload: {
        latitude: e.target._renderer._center.lat,
        longitude: e.target._renderer._center.lng,
        zoom: e.sourceTarget._zoom,
      }
    });
  }

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      dispatch({
        type: 'UPDATE_VIEWSTATE',
        payload: {
          width: window.innerWidth,
          height: window.innerHeight - 64,
        }
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0} className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <img src={Logo} height="50px" />
        </Toolbar>
      </AppBar>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <EventsFeed />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <EventsFeed />
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <Toolbar />
        <Map
          onMoveend={handleMoveend}
          center={[viewport.latitude, viewport.longitude]}
          zoom={viewport.zoom}
          style={{ width: viewport.width, height: viewport.height }}
          zoomControl={false}
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
            <Overlay checked name="Resources">
              <LayerGroup>
                {error && JSON.stringify(error)}
                {loading && "Loading"}
                {data && data.resources.map(resource => {
                  if (resource.geolocations.length) {
                    return <ResourceMarker setHistoryLines={setHistoryLines} key={resource.id} resource={resource} position={{ lat: resource.geolocations[0].latitude, lng: resource.geolocations[0].longitude }} heading={resource.geolocations[0].heading} />
                  }
                })}
              </LayerGroup>

            </Overlay>
            <Overlay checked name="Paths">
              <LayerGroup>
                {historyLines && <Polyline positions={historyLines.path} color={historyLines.color} smoothFactor={1} />}
              </LayerGroup>
            </Overlay>

          </LayersControl>
          <ZoomControl position="topright" />
        </Map>
      </main>
      
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'white',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    marginTop: 64,
    width: drawerWidth,
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
  },

}));