import _ from 'lodash';
import moment from 'moment';
import { Constants as AttendanceConstants } from '../actions/attendance';
import { ATTENDANCE_STATES as AttendanceStates } from './student';


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
      let status = action.body.status;
      if (status !== '') {
        status = AttendanceStates.PROCESSING;
      }
      _.forEach(action.body.students, (student) => {
        newAttendances[date][student.lms_student_id] = status;
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
      return { ...state, isLargeDownload: action.payload.large_file };
    }

    case AttendanceConstants.RESET_ISLARGEDOWNLOAD: {
      if (action.error) return state;
      return { ...state, isLargeDownload: false };
    }

    default:
      return state;
  }
};
