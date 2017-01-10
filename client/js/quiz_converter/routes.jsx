import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import appHistory                     from '../history';
import Index                          from './components/index';
import QuizConverter                  from './components/converter/quiz_converter';
import NotFound                       from './components/common/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={QuizConverter} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
