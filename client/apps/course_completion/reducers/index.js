import { combineReducers } from 'redux';
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';

const rootReducer = combineReducers({
  settings,
  jwt,
});

export default rootReducer;
