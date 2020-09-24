import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  Input
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useParams, Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import moment from "moment";
import Loading from "../../components/Loading";


export default function Gallery(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Messanger
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Back
          </Button>
        </Toolbar>
      </AppBar>
      <div>
          <Grid container direciton="row" spacing={2}>
              <Grid item>
                  <div className={classes.search}>

                  </div>
              </Grid>
              <Grid item>Chat room</Grid>
          </Grid>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
