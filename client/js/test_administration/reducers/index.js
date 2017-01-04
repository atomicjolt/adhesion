import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import modal                from '../../reducers/modal';
import proctorCodes         from './proctor_codes';
import print                from '../../quiz_print/reducers/print';

const rootReducer = combineReducers({
  settings,
  jwt,
  modal,
  proctorCodes,
  print,
});

export default rootReducer;
