import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import errors from 'atomic-fuel/libs/reducers/errors';
import successMessages from './success_messages';
import application from './application';

const rootReducer = combineReducers({
  settings,
  jwt,
  errors,
  successMessages,
  application,
});

export default rootReducer;
