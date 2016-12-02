import _ from 'lodash';
import { DONE } from '../../constants/wrapper';
import { list_users_in_course_users } from '../../libs/canvas/constants/courses';

export const ATTENDANCE_STATES = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
};

export const initialState = () => ({
  all: [],
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

    case list_users_in_course_users.type + DONE: {
      const newState = { all: { ...state.all, ...convertUsers(action.payload) } };
      return { ...state, ...newState };
    }

    default:
      return state;
  }
};

