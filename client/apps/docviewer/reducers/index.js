import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import annotations from './annotations';
import comments from './comments';

const rootReducer = combineReducers({
  settings,
  jwt,
  annotations,
  comments,
});

export default rootReducer;
