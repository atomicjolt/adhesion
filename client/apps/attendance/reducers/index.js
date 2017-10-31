import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import application from './application';
import student from './student';
import attendance from './attendance';
import error from './error';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  student,
  attendance,
  error,
});

export default rootReducer;
