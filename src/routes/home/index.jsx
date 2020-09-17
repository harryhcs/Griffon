import React, { useState} from 'react';
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ResourceMarker from '../../components/Resources/markers';
import {gql, useSubscription} from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

const { BaseLayer, Overlay } = LayersControl;

const GET_RESOURCES = gql`
  subscription {
    resources {
      id
      name
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

export default function Home() {
  const dispatch = useDispatch();
  const { viewport } = useSelector((state) => state.mapReducer);
  const { data, loading, error } = useSubscription(GET_RESOURCES);
  const handleMoveend = (e) => {
    dispatch({
      type: 'UPDATE_VIEWSTATE',
      payload: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: e.sourceTarget._lastCenter.lat,
        longitude: e.sourceTarget._lastCenter.lng,
        zoom: e.sourceTarget._zoom,
      }
    });
  }
  return (
    <Map
      onMoveend={handleMoveend}
      center={[viewport.latitude, viewport.longitude]}
      zoom={viewport.zoom}
      style={{ width: viewport.width, height: viewport.height }}
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
                return <ResourceMarker key={resource.id} resource={resource} position={{ lat: resource.geolocations[0].latitude, lng: resource.geolocations[0].longitude }} heading={resource.geolocations[0].heading} />
              }
            })}
          </LayerGroup>
        </Overlay>

      </LayersControl>
    </Map>
  );
}
