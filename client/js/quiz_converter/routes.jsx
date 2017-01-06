import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Home                           from './components/home';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Home}>
      <IndexRoute component={Home} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
