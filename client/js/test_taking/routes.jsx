import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';
import appHistory                     from '../history';
import Index                          from './components/index';
import NotFound                       from './components/common/not_found';
import DefaultComponent               from './default_component';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={DefaultComponent} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
