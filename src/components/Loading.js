import React, { useState } from "react";
import {Grid} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../assets/images/logoLoading.gif";

export default function Gallery(props) {
  const classes = useStyles();
  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <img src={Logo} width={250} alt="Griffon Logo" />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
