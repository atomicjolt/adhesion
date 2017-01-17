import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';
import appHistory                     from '../history';
import Index                          from './components/index';
import ExamAssignmentList             from './components/exam_assignment_list/_exam_assignment_list';
import NotFound                       from '../common_components/not_found';
import PrintTest                      from '../quiz_print/components/index';
import EnterAnswers                   from './components/exam_assignment_list/enter_answers';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={ExamAssignmentList} />
      <Route path="/print" component={PrintTest} />
      <Route path="/enter_answers/user/:userId/course/:courseId/quiz/:quizId" component={EnterAnswers} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
