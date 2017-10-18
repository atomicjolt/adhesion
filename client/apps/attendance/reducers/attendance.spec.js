import { Constants as StudentConstants } from '../actions/attendance';
import { ATTENDANCE_STATES as AttendanceStates } from './student';
import attendanceReducer from './attendance';

describe('attendance reducer', () => {
  let state;
  let action;
  let date;
  let attendance;

  beforeEach(() => {
    state = undefined;
    action = { original: { body: {} }, body: {} };
    action.original.date = new Date('2016-01-01');
    date = action.original.date;
    attendance = [
      { lms_student_id: '1', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '2', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '3', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '4', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '5', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '6', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '7', status: AttendanceStates.ABSENT, date },
      { lms_student_id: '8', status: AttendanceStates.ABSENT, date },
    ];
  });

  it('should return the initial state', () => {
    state = attendanceReducer(state, action);
    expect(state.attendances).toBeDefined();
  });

  it('should handle GET_STUDENT_ATTENDANCE_DONE', () => {
    action.type = StudentConstants.GET_STUDENT_ATTENDANCE_DONE;
    action.payload = attendance;
    state = attendanceReducer(state, action);
    expect(Object.keys(state.attendances[date]).length).toEqual(8);
    expect(state.attendances[date]['1']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['2']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['3']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['4']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['5']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['6']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['7']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['8']).toEqual(AttendanceStates.ABSENT);
  });

  it('should handle UPDATE_STATUS to mark present', () => {
    action.type = StudentConstants.GET_STUDENT_ATTENDANCE_DONE;
    action.payload = attendance;
    state = attendanceReducer(state, action);
    action.body = {
      date: new Date('2016-01-01'),
      students: [{ lms_student_id: '1' }],
      status: AttendanceStates.PRESENT,
    };
    action.type = StudentConstants.UPDATE_STATUS;
    state = attendanceReducer(state, action);
    expect(state.attendances[date]['1']).toEqual(AttendanceStates.PROCESSING);
    expect(state.attendances[date]['2']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['3']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['4']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['5']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['6']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['7']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['8']).toEqual(AttendanceStates.ABSENT);
  });

  it('should handle UPDATE_STATUS to remove attendance', () => {
    action.type = StudentConstants.GET_STUDENT_ATTENDANCE_DONE;
    action.payload = attendance;
    state = attendanceReducer(state, action);
    action.body = {
      date: new Date('2016-01-01'),
      students: [{ lms_student_id: '1' }],
      status: '',
    };
    action.type = StudentConstants.UPDATE_STATUS;
    state = attendanceReducer(state, action);
    expect(state.attendances[date]['1']).toEqual('');
    expect(state.attendances[date]['2']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['3']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['4']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['5']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['6']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['7']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['8']).toEqual(AttendanceStates.ABSENT);
  });

  it('should handle UPDATE_STATUS_DONE with error', () => {
    action.error = 'IMANERROR';
    action.type = StudentConstants.UPDATE_STATUS_DONE;
    state = attendanceReducer(state, action);
    expect(state.attendances).toBeDefined();
    expect(action.error).toEqual('IMANERROR');
  });

  it('should handle UPDATE_STATUS_DONE without error', () => {
    action.type = StudentConstants.GET_STUDENT_ATTENDANCE_DONE;
    action.payload = attendance;
    state = attendanceReducer(state, action);
    action.original = {
      body: {
        date: new Date('2016-01-01'),
      },
    };
    action.payload = [{ lms_student_id: '1', status: 'PRESENT' }];
    action.type = StudentConstants.UPDATE_STATUS_DONE;
    state = attendanceReducer(state, action);
    expect(state.attendances[date]['1']).toEqual('PRESENT');
    expect(state.attendances[date]['2']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['3']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['4']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['5']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['6']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['7']).toEqual(AttendanceStates.ABSENT);
    expect(state.attendances[date]['8']).toEqual(AttendanceStates.ABSENT);
  });
});
