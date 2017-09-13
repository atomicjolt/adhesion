import { combineReducers } from 'redux';
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';
import scorm from './scorm';
import analytics from './analytics';
import modal from '../../../libs/reducers/modal';

const rootReducer = combineReducers({
  settings,
  jwt,
  scorm,
  analytics,
  modal,
});

export default rootReducer;
