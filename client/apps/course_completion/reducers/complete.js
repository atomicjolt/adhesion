import { listEnrollmentsUsers } from 'atomic-canvas/libs/constants/enrollments';
import { Constants as CourseCompletionConstants } from '../actions/course_completion';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {

    case `${listEnrollmentsUsers.type}_DONE`:
      return {
        ...state,
        enrollments: action.payload,
        completed: false,
      };

    case CourseCompletionConstants.MARK_COURSE_AS_COMPLETED:
      return {
        ...state,
        processing: true,
        completed: false,
      };

    case CourseCompletionConstants.MARK_COURSE_AS_COMPLETED_DONE:
      return {
        ...state,
        processing: false,
        completed: true,
        error: action.error,
        result: action.payload
      };

    default:
      return state;
  }
};
