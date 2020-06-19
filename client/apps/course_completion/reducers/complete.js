import _ from 'lodash';
import { listEnrollmentsCourses } from 'atomic-canvas/libs/constants/enrollments';
import { Constants as CourseCompletionConstants } from '../actions/course_completion';

const initialState = {};
let enrollments = [];
let enrollmentsLoading = false;

export default (state = initialState, action) => {
  switch (action.type) {

    case `${listEnrollmentsCourses.type}_DONE`:
      enrollments = _.flatten([state.enrollments, action.payload]);
      enrollments = _.compact(enrollments);
      enrollments = _.uniqBy(enrollments, 'id');

      enrollmentsLoading = !!action.response.links.next;

      return {
        ...state,
        enrollments,
        enrollmentsLoading,
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
