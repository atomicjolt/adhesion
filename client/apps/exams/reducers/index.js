import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import exams from './exams';
import students from './students';
import testingCenters from './testing_centers';

const rootReducer = combineReducers({
  settings,
  jwt,
  exams,
  students,
  testingCenters
});

export default rootReducer;
