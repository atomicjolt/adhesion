import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import application          from './application';
import scorm                from './scorm';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  scorm
});

export default rootReducer;
