import { combineReducers } from 'redux';
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';
import assignments from './assignments';
import sections from './sections';
import sectionsInfo from './sections_info';

const rootReducer = combineReducers({
  settings,
  jwt,
  assignments,
  sections,
  sectionsInfo,
});

export default rootReducer;
