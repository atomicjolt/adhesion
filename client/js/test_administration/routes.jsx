import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';
import appHistory                     from '../history';
import Index                          from './components/index';
import ExamAssignmentList             from './components/exam_assignment_list/_exam_assignment_list';
import NotFound                       from './components/common/not_found';
import PrintTest                      from '../quiz_print/index';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={ExamAssignmentList} />
      <Route path="/print" component={PrintTest} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
