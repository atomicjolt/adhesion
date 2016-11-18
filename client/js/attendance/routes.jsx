'use strict';

import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Index                          from './components/layout/index';
import Student                        from './components/main/student_list';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path='/' component={Index}>
      <IndexRoute component={Student} />
    </Route>
    <Route path='*' component={NotFound} />
  </Router>
);
