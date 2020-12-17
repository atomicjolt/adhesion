import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import annotations from './annotations';
import comments from './comments';
import submissions from './submissions';

const rootReducer = combineReducers({
  settings,
  jwt,
  annotations,
  comments,
  submissions,
});

export default rootReducer;
