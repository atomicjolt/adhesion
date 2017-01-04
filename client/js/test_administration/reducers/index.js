import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import modal                from '../../reducers/modal';
import proctorCodes         from './proctor_codes';

const rootReducer = combineReducers({
  settings,
  jwt,
  modal,
  proctorCodes,
});

export default rootReducer;
