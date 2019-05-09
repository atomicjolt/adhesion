import { apiRequest } from 'atomic-fuel/libs/middleware/api';
import _ from 'lodash';
import { getSessionStatus, Constants } from '../actions/application';

const SessionStatus = store => next => async (action) => {
  if (action.type === Constants.GET_SESSION_STATUS_DONE) {
    const {
      error:errorMessage,
      retry_after:retryAfter,
    } = action.payload;

    const {
      url:statusUrl,
    } = action.original;

    if (errorMessage === 'document_not_ready') {
      _.delay(() => {
        apiRequest(store, getSessionStatus(statusUrl));
      }, retryAfter * 1000);
    }
  }

  // call the next middleWare
  next(action);
};

export default SessionStatus;
