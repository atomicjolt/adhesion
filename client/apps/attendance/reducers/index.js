import { combineReducers } from 'redux';
<<<<<<< HEAD:client/apps/attendance/reducers/index.js
import settings from '../../../libs/reducers/settings';
import jwt from '../../../libs/reducers/jwt';
import application from './application';
import student from './student';
import attendance from './attendance';
import error from './error';
=======
import settings            from 'atomic-fuel/libs/reducers/settings';
import jwt                 from 'atomic-fuel/libs/reducers/jwt';
import application         from './application';
import contentItemSelection from './content_item_selection';
>>>>>>> upstream/master:client/apps/hello_world/reducers/index.js

const rootReducer = combineReducers({
  settings,
  jwt,
  application,
  student,
  attendance,
  error,
});

export default rootReducer;
