import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import exams                from './exams';
import students             from './students';

const rootReducer = combineReducers({
  settings,
  jwt,
  exams,
  students,
});

export default rootReducer;
