// @flow

import React from "react";
import L from "leaflet";

import ChecvronIcon from '../../assets/markers/chevron.svg';
import "../../assets/markers/icons.css";

export const defaultIcon = new L.divIcon({
  className: '',
  html: `<img src=${ChecvronIcon} width="15px" style="transform: rotate(-90deg)"/>`,
});
