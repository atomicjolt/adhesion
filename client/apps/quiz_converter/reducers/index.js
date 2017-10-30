import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import inProgress from './in_progress';
import error from './error';

const rootReducer = combineReducers({
  settings,
  jwt,
  inProgress,
  error,
});

export default rootReducer;
