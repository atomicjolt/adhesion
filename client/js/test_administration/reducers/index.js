import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';

const rootReducer = combineReducers({
  settings,
  jwt,
});

export default rootReducer;
