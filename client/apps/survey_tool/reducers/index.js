import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';

const rootReducer = combineReducers({
  settings,
});

export default rootReducer;
