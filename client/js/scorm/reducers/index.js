import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import scorm                from './scorm';

const rootReducer = combineReducers({
  settings,
  jwt,
  scorm
});

export default rootReducer;
