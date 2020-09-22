/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography, Grid, CircularProgress } from '@material-ui/core';
import { FixedSizeList, FixedSizeGrid } from 'react-window';
import moment from 'moment';

import { gql, useSubscription } from '@apollo/client';


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    // backgroundColor: theme.palette.background.paper,
  },
  item: {
    '&:hover': {
      background: '#efefef',
    },
    cursor: 'pointer',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    position: 'relative',
    display: 'block',
    width: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  timestamp: {
    color: 'grey',
    fontSize: 12,
  },
  creator: {
    color: 'grey',
    fontSize: 12,
    fontWeight: 'bold',
  },
  channel: {
    fontWeight: 'bold',
  },
  galleryItem: {
    width: 120,
  },
  title: {
    padding: 10,
    backgroundColor: "#eee"
  },
  loading: {
    height: (window.innerHeight - 64 - 100)/2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const ATTACHMENT_SUB = gql`
  subscription {
    attachments(order_by: { created_at: desc }) {
      id
      event
      uri
      created_at
    }
  }
`;

function chunk(arr, size) {
  let chunked = [];
  for (let ele of arr) {
    let last = chunked[chunked.length - 1];
    if (!last || last.length === size) {
      chunked.push([ele]);
    } else {
      last.push(ele);
    }
  }
  return chunked;
}

function renderRow(props) {
  const classes = useStyles();
  const { index, data, style } = props;
  return (
    <Grid className={classes.item} container style={style} onClick={() => data.showEvent(data.events[index])}>
      <Grid item>
        <Typography className={classes.description}>
          {data.events[index].description}
        </Typography>
        {data.events[index].user ? (
          <Typography className={classes.creator}>
            {' '}
            by
            {' '}
            {data.events[index].user.resource.name}
          </Typography>
        ) : null}

        <Typography className={classes.timestamp}>
          {moment(data.events[index].created_at).fromNow()}
          {' '}
          in
          {' '}
          <span className={classes.channel}>{data.events[index].channel.name}</span>
        </Typography>

      </Grid>
    </Grid>
  );
}

const ImageCell = ({ columnIndex, rowIndex, style, data}) => {
  const singleColumnIndex = columnIndex + rowIndex * 2
  const classes = useStyles();
  return (
    <img style={style} className={classes.galleryItem} src={data.attachments[singleColumnIndex].uri} />
  )
};

function Gallery() {
  const classes = useStyles();
  const { loading, error, data } = useSubscription(ATTACHMENT_SUB);
  if (error) {
    return JSON.stringify(error);
  }
  if (loading) {
    return <div className={classes.loading}>
      <CircularProgress color="secondary" size={20} />
      <Typography>Loading gallery</Typography>
    </div>;
  }
  if (data) {
    return data.attachments.length > 0 ? (
      <FixedSizeGrid
        height={window.innerHeight - 326-64-105}
        width={240}
        itemData={{ attachments: data.attachments }}
        columnCount={2}
        columnWidth={120}
        rowCount={data.attachments.length/2}
        rowHeight={92}
      >
        {ImageCell}
      </FixedSizeGrid>
    ) : null;
  }
}

function EventList({ showEvent, data, loading }) {
  const classes = useStyles();
  if (loading ) {
    return <div className={classes.loading}>
      <CircularProgress color="secondary" size={20} />
      <Typography>Loading events</Typography>
    </div>
  };

  if (data) {
    return data.events.length > 0 ? (
      <FixedSizeList
        height={326}
        width={240}
        itemSize={80}
        itemCount={data.events.length}
        itemData={{ events: data.events, showEvent }}
      >
        {renderRow}
      </FixedSizeList> 
    ) : null;
  }
}

export default function Feed(props) {
  const {loading, events} = props;
  const classes = useStyles();
  return (
    <>
      <div className={classes.title}>
        <Typography variant="h6">Events</Typography>
      </div>
      <Divider />
      <EventList loading={loading} data={events} />
      <div className={classes.title}>
        <Typography variant="h6">Gallery</Typography>
      </div>
      <Divider />
      <Gallery />
    </>
  )
}