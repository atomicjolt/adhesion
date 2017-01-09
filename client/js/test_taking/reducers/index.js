import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import modal                from '../../reducers/modal';

const rootReducer = combineReducers({
  settings,
  jwt,
  modal,
});

export default rootReducer;
