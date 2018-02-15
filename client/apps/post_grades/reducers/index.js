import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import assignments from './assignments';
import sections from './sections';
import sectionsInfo from './sections_info';
import submissions from './submissions';

const rootReducer = combineReducers({
  settings,
  jwt,
  assignments,
  sections,
  sectionsInfo,
  submissions,
});

export default rootReducer;
