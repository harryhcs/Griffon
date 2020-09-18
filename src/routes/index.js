import React from 'react';
import {
  BrowserRouter, Switch,
} from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Home from './home';
import Resources from './resources';
import Gallery from './gallery'

export default function BasicExample() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <PrivateRoute path="/gallery/:id" component={Gallery} />
          <PrivateRoute path="/resources/" component={Resources} />
          <PrivateRoute path="/" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
