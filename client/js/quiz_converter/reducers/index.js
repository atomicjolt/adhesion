import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import inProgress           from './in_progress';
import error                from './error';

const rootReducer = combineReducers({
  settings,
  jwt,
  inProgress,
  error,
});

export default rootReducer;
