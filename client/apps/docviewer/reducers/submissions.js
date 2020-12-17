import _ from 'lodash';
import { Constants } from '../actions/submissions';

const defaultState = {
  error: null,
  submission: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case Constants.GET_SUBMISSION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.submission = action.payload;
      }
      return newState;
    }
    default:
      return state;
  }
}
