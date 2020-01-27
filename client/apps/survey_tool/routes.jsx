import React from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute } from 'react-router3';

import appHistory from './history';
import Index from './components/index';
import SurveyTool from './components/survey/_survey';
import NotFound from '../../libs/components/not_found';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={SurveyTool} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
);
