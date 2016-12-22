import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';
import appHistory                     from '../history';
import ExamList                       from './components/exam_list/_exam_list';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={ExamList}>
      <IndexRoute component={ExamList} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
