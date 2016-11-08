"use strict";

import { DONE }                       from "../../constants/wrapper";
import { Constants as ErrorConstants }   from "../actions/error";
import { Constants as AttendanceConstants }   from "../actions/attendance";

export const initialState = () => ({
  showError: false
});

export default (state = initialState(), action) => {
  switch(action.type){

    case AttendanceConstants.UPDATE_STATUS_DONE:
    case AttendanceConstants.GET_STUDENT_ATTENDANCE_DONE:
    case AttendanceConstants.DOWNLOAD_FILE_DONE:
    case ErrorConstants.ERROR:
      debugger;
      const status = action.response ? action.response.status : "";
      const newState = {...state, ...{showError: action.error, statusCode: status}};
      return newState;

    default:
      return state;
  }
};
