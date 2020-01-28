/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Marker } from 'react-map-gl';


const SIZE = 20;

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {
    const { data, onClick } = this.props;
    return data.map((event) => (
      event.locations.length > 0 ? (
        <Marker key={`marker-${event.id}`} longitude={event.locations[0].longitude} latitude={event.locations[0].latitude}>
          <svg height="12" width="12">
            <circle cx="6" cy="6" r="5" fill="red" />
          </svg>
        </Marker>
      ) : null
    ));
  }
}
