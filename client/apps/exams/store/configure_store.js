import configureStore from '../../../libs/store/configure_store';
import CanvasApi from '../../../libs/canvas/middleware';
import rootReducer from '../reducers/index';
import API from '../middleware/api';
import Download from '../../../libs/middleware/download';

const middleware = [API, CanvasApi, Download];

// This file just exports the default configure store. If modifications are needed
// make the modifications in this file by extending the configureStore
// or copy pasting the code into this file.
export default function(initialState) {
  return configureStore(initialState, rootReducer, middleware);
}
