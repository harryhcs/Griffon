import React, { useState, useEffect } from 'react';
import {
  LayerGroup,
  LayersControl,
  Map,
  Polyline,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { AppBar, MenuItem, Menu, Avatar, InputBase, Badge, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Divider, Drawer, Hidden, Container, Grid, Card, CardHeader, CardMedia } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import 'leaflet/dist/leaflet.css';
import ResourceMarker from '../../components/Resources/markers';
import EventMarker from '../../components/Events/markers';
import { gql, useSubscription } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import Logo from '../../assets/images/logo.png';
import EventsFeed from '../../components/Events/Feed';
import Chat from '../../components/Chat';
import Conversation from '../../components/Chat/conversation';

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

const EVENTS_SUB = gql`
  subscription {
    events(order_by: { created_at: desc }) {
      id
      created_at
      description
      event_comments(order_by: { created_at: asc }) {
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
`;

export default function Home(props) {
  const { win } = props;
  const classes = useStyles();
  const theme = useTheme();
  const container =
    win !== undefined ? () => win().document.body : undefined;
  const dispatch = useDispatch();
  const { viewport } = useSelector((state) => state.mapReducer);
  const { showConversations, showConversation, conversationId } = useSelector((state) => state.chatReducer);
  const { data, loading, error } = useSubscription(GET_RESOURCES);
  const { data: dataEvents, loading: loadingEvent } = useSubscription(EVENTS_SUB);
  const [historyLines, setHistoryLines] = useState({ path: [], color: 'red' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleToggleChat = () => {
    dispatch({
      type: "TOGGLE_CONVERSATIONS",
    })
  }

  const menuId = 'primary-search-account-menu';
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

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleToggleChat}>
          <Badge badgeContent={2} color="secondary">
            <ChatIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" elevation={1} className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon color="primary" />
          </IconButton>
          <img src={Logo} className={classes.logo} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon color="primary" />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit" onClick={handleToggleChat}>
              <Badge badgeContent={2} color="secondary">
                <ChatIcon color="primary" />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon color="primary" />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle color="primary" />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon color="primary" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {showConversations && <Chat handleToggleChat={handleToggleChat}/>}
      {showConversation && <Conversation id={conversationId} />}
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
          <EventsFeed events={dataEvents ? dataEvents : []} loading={loadingEvent} />
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
          <EventsFeed events={dataEvents ? dataEvents : []} loading={loadingEvent} />
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
            <Overlay checked name="Events">
              <LayerGroup>
                {dataEvents && dataEvents.events.map(event => {
                  return <EventMarker key={event.id} event={event} center={{ lat: event.latitude, lng: event.longitude }} />
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
  logo: {
    height: 25,
    [theme.breakpoints.up('sm')]: {
      height: 50,
    },
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
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.main, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: theme.palette.primary.main,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

}));