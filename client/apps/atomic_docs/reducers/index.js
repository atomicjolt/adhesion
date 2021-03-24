import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import errors from 'atomic-fuel/libs/reducers/errors';
import annotations from './annotations';
import comments from './comments';
import submissions from './submissions';

import application from './application';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  errors,
  annotations,
  comments,
  submissions,
});

export default rootReducer;
