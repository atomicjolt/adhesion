import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import quiz                 from './quiz';

const rootReducer = combineReducers({
  settings,
  jwt,
  quiz,
});

export default rootReducer;
