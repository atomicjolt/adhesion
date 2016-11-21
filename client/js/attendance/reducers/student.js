"use strict";

import { DONE }                       from '../../constants/wrapper';
import { list_users_in_course_users } from '../../libs/canvas/constants/courses';
import _                              from 'lodash';

export const ATTENDANCE_STATES = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE"
};

export const initialState = () => ({
  all: []
});

export default (state = initialState(), action) => {
  switch(action.type){

    case list_users_in_course_users.type + DONE:
      const newState = {all: {...state.all, ...convertUsers(action.payload)}};
      state = {...state, ...newState};
      return state;

    default:
      return state;
  }
};

function convertUsers(payload){
  return _.reduce(payload, (students, current) => {
    students[current.id] = {...current, lms_student_id: current.id};
    return students;
  }, {});
}