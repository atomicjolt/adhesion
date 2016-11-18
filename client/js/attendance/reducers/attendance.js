"use strict";
import { Constants as AttendanceConstants }   from '../actions/attendance';
import _                                      from 'lodash';
import moment                                 from 'moment';


const initialState = {
  attendances: {}
};

export default (state = initialState, action) => {
  switch(action.type){

    case AttendanceConstants.GET_STUDENT_ATTENDANCE_DONE: {
      let date = action.original.date.toDateString();
      const attendanceData = action.payload;
      let attendances = {};
      attendances[date] = {};
      _.forEach(attendanceData, (attendance) => {
        if(moment(date).startOf('day').isSame(moment(attendance.date).startOf('day'))) {
          attendances[date][attendance.lms_student_id] = attendance.status;
        }
      });
      return {...state, ...{attendances: attendances}};
    }

    case AttendanceConstants.UPDATE_STATUS: {
      const date = action.body.date.toDateString();
      let newAttendances = _.cloneDeep(state.attendances);
      _.forEach(action.body.students, (student) => {
        newAttendances[date][student.lms_student_id] = action.body.status;
      });
      return {...state, ...{attendances: newAttendances}}
    }

    case AttendanceConstants.UPDATE_STATUS_DONE: {
      if(action.error) return state;
      const date = action.original.body.date.toDateString();
      let newAttendances = _.cloneDeep(state.attendances);
      _.forEach(action.payload, (student) => {
        newAttendances[date][student.lms_student_id] = student.status;
      });
      return {...state, ...{attendances: newAttendances}}
    }

    default:
      return state;
  }
};
