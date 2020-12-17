import React from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute } from 'react-router3';

import appHistory from './history';
import Index from './components/layout/index';
import NotFound from '../../libs/components/not_found';
import Docviewer from './components/main/docviewer';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Docviewer} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
