import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';

const rootReducer = combineReducers({
  settings,
  jwt,
});

export default rootReducer;
