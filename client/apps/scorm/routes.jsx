import React from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute } from 'react-router3';

import appHistory from './history';
import Index from './components/layout/index';
import CourseAnalytics from './components/analytics/_course_report';
import Scorm from './components/scorm/_scorm_index';
import NotFound from '../../libs/components/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Scorm} />
      <Route path="analytics/:courseId" component={CourseAnalytics} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
