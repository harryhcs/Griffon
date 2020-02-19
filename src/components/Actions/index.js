/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import MessageIcon from '@material-ui/icons/Message';
import ChannelIcon from '@material-ui/icons/RecordVoiceOver';
import ResourceIcon from '@material-ui/icons/DevicesOther';

const useStyles = makeStyles((theme) => ({
  root: {
    transform: 'translateZ(0px)',
    flexGrow: 1,
    position: 'absolute',
    zIndex: 1000,
    bottom: 10,
    right: 10,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

export default function Actions(props) {
  // eslint-disable-next-line react/prop-types
  const { setShowCreateEvents, setCoords } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <div>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
        >
          <SpeedDialAction
            key="create-event"
            icon={<MessageIcon color="primary" />}
            tooltipTitle="Create event"
            onClick={() => { setShowCreateEvents(true); setCoords(null); }}
          />
          <SpeedDialAction
            key="create-event"
            icon={<ResourceIcon color="primary" />}
            tooltipTitle="Create resource"
            onClick={() => { setShowCreateEvents(true); setCoords(null); }}
          />
          <SpeedDialAction
            key="create-event"
            icon={<ChannelIcon color="primary" />}
            tooltipTitle="Create channel"
            onClick={() => { setShowCreateEvents(true); setCoords(null); }}
          />
        </SpeedDial>
      </div>
    </div>
  );
}
