import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import contentItemSelection from './content_item_selection';
import complete from './complete';

const rootReducer = combineReducers({
  settings,
  jwt,
  contentItemSelection,
  complete,
});

export default rootReducer;
