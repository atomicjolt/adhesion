"use strict";
import { Constants as AttendanceConstants }   from "../actions/attendance";

const initialState =  new Map();

export default (state = initialState, action) => {
  switch(action.type){

    case AttendanceConstants.GET_STUDENT_ATTENDANCE_DONE:
      var date = action.original.date;
      const attendances = action.payload;
      var newMap = attendances.reduce((map, current) => {
        const newDay = {...map.get(date)} || {};
        newDay[current.lms_student_id] = current;
        map.set(date, newDay);
        return map;
      }, new Map(state));
      return newMap;

    case AttendanceConstants.UPDATE_STATUS:
      const students = action.body.students;
      const lms_course_id = action.body.lms_course_id;
      const status = action.body.status;
      var date = action.body.date;
      var newMap = students.reduce((map, student) => {
        var dailyAttendance = {...map.get(date)} || {};
        var id = student.lms_student_id;
        var studentData = {
          name: student.name,
          lms_student_id: id,
          lms_course_id,
          status,
          date
        };
        dailyAttendance[id] = studentData;
        map.set(date, dailyAttendance);
        return map;
      }, new Map(state));

      return newMap;

    case AttendanceConstants.UPDATE_STATUS_DONE:
      if(action.error) return state;

      var date = action.response.body[0].date;
      var studentsDone = action.response.body;
      var newMap = studentsDone.reduce((map, student) => {
        var dailyAttendance = {...map.get(date)} || {};
        var id = student.lms_student_id;
        var studentData = {
          name: student.name,
          lms_student_id: id,
          lms_course_id: student.lms_course_id,
          status: student.status,
          date
        };
        dailyAttendance[id] = studentData;
        map.set(date, dailyAttendance);
        return map;
      }, new Map(state));
      return newMap;

    default:
      return state;
  }
};
