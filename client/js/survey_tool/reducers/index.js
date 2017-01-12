import { combineReducers }  from 'redux';
import settings             from '../../reducers/settings';

const rootReducer = combineReducers({
  settings,
});

export default rootReducer;
