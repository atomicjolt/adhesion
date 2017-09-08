import { combineReducers } from 'redux';
import settings from '../../reducers/settings';
import jwt from '../../reducers/jwt';
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
