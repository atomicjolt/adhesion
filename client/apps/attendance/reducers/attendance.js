import _ from 'lodash';
import moment from 'moment';
import { Constants as AttendanceConstants } from '../actions/attendance';


const initialState = {
  isLargeDownload: false,
  attendances: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

    case AttendanceConstants.GET_STUDENT_ATTENDANCE_DONE: {
      const date = action.original.date;
      const attendanceData = action.payload;
      const attendances = {};
      attendances[date] = {};
      _.forEach(attendanceData, (attendance) => {
        const newDate = moment(attendance.date);
        if (moment(date, 'ddd MMM Do YYYY').startOf('day').isSame(moment(newDate).startOf('day'))) {
          attendances[date][attendance.lms_student_id] = attendance.status;
        }
      });
      return { ...state, ...{ attendances } };
    }

    case AttendanceConstants.UPDATE_STATUS: {
      const date = action.body.date;
      const newAttendances = _.cloneDeep(state.attendances);
      _.forEach(action.body.students, (student) => {
        newAttendances[date][student.lms_student_id] = action.body.status;
      });
      return { ...state, ...{ attendances: newAttendances } };
    }

    case AttendanceConstants.UPDATE_STATUS_DONE: {
      if (action.error) return state;
      const date = action.original.body.date;
      const newAttendances = _.cloneDeep(state.attendances);
      _.forEach(action.payload, (student) => {
        newAttendances[date][student.lms_student_id] = student.status;
      });
      return { ...state, ...{ attendances: newAttendances } };
    }

    case AttendanceConstants.DOWNLOAD_FILE_DONE: {

      if (action.error || action.payload === null) return state;
      const newState = _.cloneDeep(state);
      newState.isLargeDownload = action.payload.large_file;

      console.log(newState)

      return newState;
    }

    case AttendanceConstants.TOGGLE_ISLARGEDOWNLOAD: {
      if (action.error) return state;
      const newState = _.cloneDeep(state);
      newState.isLargeDownload = false;
      return newState;
    }

    default:
      return state;
  }
};
