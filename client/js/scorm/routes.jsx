'use strict';

import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Index                          from './components/layout/index';
import ScormIndex                     from './components/scorm/scorm_index';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path='/' component={Index}>
      <IndexRoute component={ScormIndex} />
    </Route>
    <Route path='*' component={NotFound} />
  </Router>
);
