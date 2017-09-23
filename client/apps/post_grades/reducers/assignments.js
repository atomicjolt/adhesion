import _ from 'lodash';
import { DONE } from '../../../libs/constants/wrapper';
import { listAssignments } from '../../../libs/canvas/constants/assignments';
// import { listAssignmentSubmissionsSections } from '../../../libs/canvas/constants/submissions';

export default (state = [], action) => {
  switch (action.type) {

    case listAssignments.type + DONE: {
      return _.concat(state, action.payload);
    }

    // case listAssignmentSubmissionsSections.type + DONE: {
    //   debugger;
    //   return _.concat(state, action.payload);
    // }

    default:
      return state;
  }
};
