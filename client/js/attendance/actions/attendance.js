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

export const getStudentAttendance = (date, lmsCourseId) => ({
  type: Constants.GET_STUDENT_ATTENDANCE,
  method: Network.GET,
  url: `api/courses/${lmsCourseId}/attendances/search?date=${date}`,
  date
});

export const markStudents = (students, lmsCourseId, date, status) => {
  return {
    type:   Constants.UPDATE_STATUS,
    method: Network.POST,
    url:    `api/courses/${lmsCourseId}/attendances`,
    body: {
      students,
      lms_course_id: lmsCourseId,
      date,
      status
    }
  };
};


export const downloadFile = (lms_course_id, startDate, endDate) => {
  const baseUrl = `api/courses/${lms_course_id}/exports/attendances.csv`;
  if(startDate && endDate){
    var rangeUrl = `${baseUrl}?search[date_range][start]=${startDate}&search[date_range][end]=${endDate}`;
  }
  return {
    type: Constants.DOWNLOAD_FILE,
    method: Network.GET,
    url: rangeUrl || baseUrl
  };
};
