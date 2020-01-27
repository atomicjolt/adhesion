import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listAssignmentsAssignments } from 'atomic-canvas/libs/constants/assignments';

const defaultState = {
  loading: true,
  data: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case listAssignmentsAssignments.type + DONE: {
      const newAssignments = _.concat(state.data, action.payload);
      return {
        ...state,
        ...{
          data: newAssignments,
          loading: false,
        },
      };
    }

    default:
      return state;
  }
};
