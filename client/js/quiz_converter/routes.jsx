import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Index                          from './components/index';
import QuizConverter                  from './components/converter/quiz_converter';
import Finish                         from './components/converter/finish';
import NotFound                       from '../common_components/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={QuizConverter} />
      <Route path="finish" component={Finish} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
