import { combineReducers } from 'redux';
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';
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
