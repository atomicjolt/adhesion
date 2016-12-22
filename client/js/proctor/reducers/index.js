import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import exams                from './exams';

const rootReducer = combineReducers({
  settings,
  jwt,
  exams,
});

export default rootReducer;
