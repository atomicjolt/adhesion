import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Index                          from './components/layout/index';
import Scorm                          from './components/scorm/scorm_index';
import CourseAnalytics                from './components/analytics/course_report';
import NotFound                       from '../common_components/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Scorm} />
      <Route path="analytics/:courseId" component={CourseAnalytics} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
