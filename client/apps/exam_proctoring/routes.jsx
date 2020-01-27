import React from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute } from 'react-router3';
import appHistory from './history';
import Index from './components/index';
import ExamAssignmentList from './components/exam_request_list/_exam_request_list';
import NotFound from '../../libs/components/not_found';
import PrintTest from './quiz_print/components/index';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={ExamAssignmentList} />
      <Route path="/print" component={PrintTest} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
