import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listAssignments } from 'atomic-canvas/libs/constants/assignments';

const defaultState = {
  loading: true,
  data: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case listAssignments.type + DONE: {
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
