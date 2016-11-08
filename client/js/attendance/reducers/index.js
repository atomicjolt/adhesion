import { combineReducers }  from 'redux';
import settings             from './settings';
import application          from './application';
import jwt                  from './jwt';
import student              from './student';
import attendance           from './attendance';
import error                from './error';

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  student,
  attendance,
  error
});

export default rootReducer;
