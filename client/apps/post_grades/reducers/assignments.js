import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listAssignments } from 'atomic-canvas/libs/constants/assignments';

export default (state = [], action) => {
  switch (action.type) {

    case listAssignments.type + DONE: {
      return _.concat(state, action.payload);
    }

    default:
      return state;
  }
};
