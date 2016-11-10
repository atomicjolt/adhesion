"use strict";

import { DONE }                       from "../../constants/wrapper";
import { list_users_in_course_users } from "../../libs/canvas/constants/courses";

export const ATTENDANCE_STATES = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE"
};

function convertUsers(payload){
  return payload.reduce((students, current) => {
    var student = {};
    student.avatar_url = current.avatar_url;
    student.lms_student_id = current.id;
    student.name = current.name;
    student.sortable_name = current.sortable_name;
    students[current.id] = student;
    return students;
  }, {});
}

export const initialState = () => ({
  all:{}
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
