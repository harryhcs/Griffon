/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Typography, Grid } from "@material-ui/core";
import LocationIcon from "@material-ui/icons/Place";

import { FixedSizeList } from "react-window";
import moment from "moment";

import { gql, useSubscription } from "@apollo/client";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
    // backgroundColor: theme.palette.background.paper,
  },
  item: {
    "&:hover": {
      background: "#efefef",
    },
    cursor: "pointer",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    position: "relative",
    display: "block",
    width: 220,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  timestamp: {
    color: "grey",
    fontSize: 12,
  },
  creator: {
    color: "grey",
    fontSize: 12,
    fontWeight: "bold",
  },
  channel: {
    fontWeight: "bold",
  },
}));

const EVENTS_SUB = gql`
  subscription {
    events(order_by: { created_at: desc }) {
      id
      created_at
      attachments {
        id
        uri
      }
    }
  }
`;

function renderRow(props) {
  const classes = useStyles();
  const { index, data } = props;
  return (
    <Grid
      onClick={() => data.showEvent(data.events[index])}
    >
    </Grid>
  );
}
export default function EventList({ showEvent }) {
  const classes = useStyles();
  const { loading, error, data } = useSubscription(EVENTS_SUB);

  if (error) {
    return JSON.stringify(error);
  }
  if (loading) {
    return "loading...";
  }
  if (data) {
    return data.events.length > 0 ? (
      <>
        <FixedSizeList
          height={370}
          width={240}
          itemSize={46}
          itemCount={data.events.length}
          itemData={{ events: data.events, showEvent }}
        >
          {renderRow}
        </FixedSizeList>
        <Divider />
      </>
    ) : null;
  }
}
