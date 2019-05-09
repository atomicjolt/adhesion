// if you use jsx, you have to import React
import React from 'react';
import { Router, Route } from 'react-router';

import appHistory from './history';
import Index from './components/layout/index';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index} />
  </Router>
);
