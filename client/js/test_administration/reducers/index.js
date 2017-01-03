import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import proctorCodes         from './proctor_codes';

const rootReducer = combineReducers({
  settings,
  jwt,
  proctorCodes,
});

export default rootReducer;
