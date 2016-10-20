import { combineReducers }  from 'redux';
import settings             from './settings';
import application          from './application';
import jwt                  from './jwt';
import scorm                from './scorm';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  scorm
});

export default rootReducer;