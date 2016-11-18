"use strict";

import {Constants as ApplicationConstants}  from '../actions/application';
import {Constants as AttendanceConstants}   from '../actions/attendance';

const initialState = () => {
  const date = new Date();
  date.setHours(0,0,0,0); // Zero out time field
  return {date};
};

export default (state = initialState(), action) => {
  switch(action.type){

    case AttendanceConstants.GET_STUDENT_ATTENDANCE:
    case ApplicationConstants.CHANGE_DATE: {
      return {...state, ...{date: action.date}};
    }

    default:
      return state;
  }
};
