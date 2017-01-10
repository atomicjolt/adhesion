import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import quiz                 from './quiz';
import inProgress           from './in_progress';

const rootReducer = combineReducers({
  settings,
  jwt,
  quiz,
  inProgress,
});

export default rootReducer;
