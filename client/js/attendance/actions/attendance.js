"use strict";

import wrapper    from "../../constants/wrapper";
import Network    from "../../constants/network";

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  "GET_STUDENT_ATTENDANCE",
  "DOWNLOAD_FILE",
  "UPDATE_STATUS"
];

export const Constants = wrapper(actions, requests);

export const getStudentAttendance = (date, lms_course_id) => ({
  type: Constants.GET_STUDENT_ATTENDANCE,
  method: Network.GET,
  url: `api/courses/${lms_course_id}/attendance/search?date=${date}`,
  date
});

export const markStudents = (students, lms_course_id, date, status) => {
  return {
    type:   Constants.UPDATE_STATUS,
    method: Network.POST,
    url:    `api/courses/${lms_course_id}/attendance`,
    body: {
      students,
      lms_course_id,
      date,
      status
    }
  };
};


export const downloadFile = (lms_course_id, startDate, endDate) => {
  const baseUrl = `api/courses/${lms_course_id}/exports/attendance.csv`;
  if(startDate && endDate){
    var rangeUrl = `${baseUrl}?search[date_range][start]=${startDate}&search[date_range][end]=${endDate}`;
  }
  return {
    type: Constants.DOWNLOAD_FILE,
    method: Network.GET,
    url: rangeUrl || baseUrl
  };
};
