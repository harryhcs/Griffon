import React from 'react';
import {
  BrowserRouter, Switch,
} from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Home from './home';
import Resources from './resources';

export default function BasicExample() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <PrivateRoute path="/" component={Home} />
          <PrivateRoute path="/resources/" component={Resources} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
