import { combineReducers } from 'redux';
import settings from '../../reducers/settings';
import jwt from '../../reducers/jwt';
import scorm from './scorm';
import analytics from './analytics';
import modal from '../../reducers/modal';

const rootReducer = combineReducers({
  settings,
  jwt,
  scorm,
  analytics,
  modal,
});

export default rootReducer;
