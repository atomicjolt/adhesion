import { combineReducers } from 'redux';
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';
import assignments from './assignments';

const rootReducer = combineReducers({
  settings,
  jwt,
  assignments,
});

export default rootReducer;
