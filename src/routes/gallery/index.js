import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardHeader, CardMedia } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useParams, Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import moment from 'moment';
import Loading from '../../components/Loading';

const GET_RESOURCE_GALLERY = gql`
  subscription getGallery($id: Int!) {
    resources_by_pk(id: $id) {
      id
      name
      attachments {
        id
        created_at
        uri
        event
      }
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

export default function Gallery(props) {
  const classes = useStyles();
  let { id } = useParams();
  const { data, loading, error } = useSubscription(GET_RESOURCE_GALLERY, {
    variables: {
      id,
    },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (data) {
    const d = data.resources_by_pk;
    const file_list = d.attachments.length > 0 ? chunk(d.attachments, 4) : [];
    return (
      <div className={classes.root}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {d.name} Gallery
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Back
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          {file_list.map((row, index) => (
            <Grid container spacing={2} key={index}>
              {row.map((photo) => (
                <Grid item xs={12} md={6} lg={3} key={photo.id}>
                  <Card className={classes.card}>
                    <CardHeader subheader={moment(photo.created_at).format("YYYY-MM-DD HH:MM")} />
                    <CardMedia
                      className={classes.media}
                      image={photo.uri}
                      title={photo.id}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
        </div>
      </div>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
