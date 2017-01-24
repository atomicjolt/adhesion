import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';
import appHistory                     from '../history';
import ExamList                       from './components/exam_list/_exam_list';
import ScheduleExam                   from './components/schedule_exam/_schedule_exam';
import Index                          from './components/index';
import NotFound                       from '../common_components/not_found';
import ExamDistribution               from './components/exam_distribution/_exam_distribution';

// export default (
//   <Router history={appHistory}>
//     <Route path="/" component={Index}>
//       <IndexRoute component={ExamList} />
//       <Route path="exams/:id" component={ExamDistribution} />
//     </Route>
//     <Route path="*" component={NotFound} />
//   </Router>
// );

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={ExamList} />
      <Route path="exams/:id" component={ScheduleExam} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
