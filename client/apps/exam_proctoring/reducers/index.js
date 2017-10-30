import { combineReducers } from 'redux';
import settings from 'atomic-fuel/libs/reducers/settings';
import jwt from 'atomic-fuel/libs/reducers/jwt';
import modal from 'atomic-fuel/libs/reducers/modal';
import examRequests from './exam_requests';
import print from '../quiz_print/reducers/print';

const rootReducer = combineReducers({
  settings,
  jwt,
  modal,
  examRequests,
  print,
});

export default rootReducer;
