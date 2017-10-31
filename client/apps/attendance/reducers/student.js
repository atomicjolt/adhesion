import _ from 'lodash';
import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listUsersInCourseUsers } from 'atomic-canvas/libs/constants/courses';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';

export const ATTENDANCE_STATES = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  PROCESSING: 'PROCESSING',
};

export const initialState = () => ({
  all: {},
});

function convertUsers(payload) {
  const newStudents = {};
  _.forEach(payload, (currentStudent) => {
    newStudents[currentStudent.id] = { ...currentStudent, lms_student_id: currentStudent.id };
  });
  return newStudents;
}

export default (state = initialState(), action) => {
  switch (action.type) {

    case listUsersInCourseUsers.type + DONE: {
      const newState = { all: { ...state.all, ...convertUsers(action.payload) } };
      return { ...state, ...newState };
    }

    case listCourseSections.type + DONE: {
      const newState = _.cloneDeep(state);
      newState.sections = action.payload;
      return { ...newState };
    }

    default:
      return state;
  }
};
