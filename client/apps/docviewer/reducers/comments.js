import _ from 'lodash';
import { Constants } from '../actions/comments';

const defaultState = {
  comment: null,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case Constants.ADD_COMMENT_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.comment = action.payload;
      }
      return newState;
    }
    case Constants.DELETE_COMMENT_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.comment = true;
      }
      return newState;
    }
    default:
      return state;
  }
};
