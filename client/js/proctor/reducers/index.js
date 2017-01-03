import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import exams                from './exams';
import students             from './students';
import testingCenters       from './testing_centers';

const rootReducer = combineReducers({
  settings,
  jwt,
  exams,
  students,
  testingCenters
});

export default rootReducer;
