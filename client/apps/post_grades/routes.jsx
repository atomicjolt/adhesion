import React from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute } from 'react-router3';

import appHistory from './history';
import Index from './components/index';
import PostGradesTool from './components/post_grades/_post_grades';
import NotFound from '../../libs/components/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={PostGradesTool} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
