import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';
import jwt                  from '../../reducers/jwt';
import modal                from '../../../libs/reducers/modal';
import examRequests         from './exam_requests';
import print                from '../../quiz_print/reducers/print';

const rootReducer = combineReducers({
  settings,
  jwt,
  modal,
  examRequests,
  print,
});

export default rootReducer;
