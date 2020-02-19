/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Typography,
  IconButton,
} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import ChannelIcon from '@material-ui/icons/RecordVoiceOver';
import ResourceIcon from '@material-ui/icons/DevicesOther';
import MenuIcon from '@material-ui/icons/Menu';
import UsersIcon from '@material-ui/icons/AssignmentInd';
import OverlaysIcon from '@material-ui/icons/Map';
import AnomalyIcon from '@material-ui/icons/ReportProblem';
import InsightsIcon from '@material-ui/icons/Equalizer';
import AIIcon from '@material-ui/icons/Memory';

const useStyles = makeStyles((theme) => ({
  inputInput: {
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  search: {
    paddingLeft: 10,
    position: 'relative',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02)',
    borderRadius: 5,
  },
  menuButton: {
    color: 'black',
  },
  toolbar: {
    padding: '0 8 8 0',
    // minHeight: 0,
  },
  title: {
    padding: 10,
    paddingLeft: 20,
  },
  fullList: {
    width: 300,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
}));

export default function Search() {
  const classes = useStyles();
  const [open, setDrawer] = useState(false);

  const toggleDrawer = () => {
    setDrawer(!open);
  };
  return (
    <>
      <Drawer open={open} onClose={toggleDrawer}>
        <div
          className={classes.fullList}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <div className={classes.title}>
            <Grid container className={classes.titleContainer} spacing={1}>
              <Grid item>
                <img src="https://media.istockphoto.com/vectors/bird-vulture-icon-vector-black-outline-icon-illustration-vector-id483045290" width={40} alt="Griffon" />
              </Grid>
              <Grid item>
                <Typography variant="h5">Griffon</Typography>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <List dense subheader={<ListSubheader>Administration</ListSubheader>}>
            <ListItem button>
              <ListItemIcon><ResourceIcon /></ListItemIcon>
              <ListItemText primary="Resources" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><ChannelIcon /></ListItemIcon>
              <ListItemText primary="Channels" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><UsersIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><OverlaysIcon /></ListItemIcon>
              <ListItemText primary="Overlays" />
            </ListItem>
          </List>
          <Divider />
          <List dense subheader={<ListSubheader>Insights</ListSubheader>}>
            <ListItem button>
              <ListItemIcon><InsightsIcon /></ListItemIcon>
              <ListItemText primary="Resource insights" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><AnomalyIcon /></ListItemIcon>
              <ListItemText primary="Anomaly detection" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><AIIcon /></ListItemIcon>
              <ListItemText primary="AI models" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <Grid container>
        <Grid item lg={3} md={5} sm={8} xs={12}>
          <div className={classes.search}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
