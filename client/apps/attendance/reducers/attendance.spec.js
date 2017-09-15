import { Constants as StudentConstants } from '../actions/attendance';
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
      { lms_student_id: '1', status: 'ABSENT', date },
      { lms_student_id: '2', status: 'ABSENT', date },
      { lms_student_id: '3', status: 'ABSENT', date },
      { lms_student_id: '4', status: 'ABSENT', date },
      { lms_student_id: '5', status: 'ABSENT', date },
      { lms_student_id: '6', status: 'ABSENT', date },
      { lms_student_id: '7', status: 'ABSENT', date },
      { lms_student_id: '8', status: 'ABSENT', date },
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
    expect(state.attendances[date]['1']).toEqual('ABSENT');
    expect(state.attendances[date]['2']).toEqual('ABSENT');
    expect(state.attendances[date]['3']).toEqual('ABSENT');
    expect(state.attendances[date]['4']).toEqual('ABSENT');
    expect(state.attendances[date]['5']).toEqual('ABSENT');
    expect(state.attendances[date]['6']).toEqual('ABSENT');
    expect(state.attendances[date]['7']).toEqual('ABSENT');
    expect(state.attendances[date]['8']).toEqual('ABSENT');
  });

  it('should handle UPDATE_STATUS', () => {
    action.type = StudentConstants.GET_STUDENT_ATTENDANCE_DONE;
    action.payload = attendance;
    state = attendanceReducer(state, action);
    action.body = {
      date: new Date('2016-01-01'),
      students: [{ lms_student_id: '1' }],
      status: 'PRESENT',
    };
    action.type = StudentConstants.UPDATE_STATUS;
    state = attendanceReducer(state, action);
    expect(state.attendances[date]['1']).toEqual('PRESENT');
    expect(state.attendances[date]['2']).toEqual('ABSENT');
    expect(state.attendances[date]['3']).toEqual('ABSENT');
    expect(state.attendances[date]['4']).toEqual('ABSENT');
    expect(state.attendances[date]['5']).toEqual('ABSENT');
    expect(state.attendances[date]['6']).toEqual('ABSENT');
    expect(state.attendances[date]['7']).toEqual('ABSENT');
    expect(state.attendances[date]['8']).toEqual('ABSENT');
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
    expect(state.attendances[date]['2']).toEqual('ABSENT');
    expect(state.attendances[date]['3']).toEqual('ABSENT');
    expect(state.attendances[date]['4']).toEqual('ABSENT');
    expect(state.attendances[date]['5']).toEqual('ABSENT');
    expect(state.attendances[date]['6']).toEqual('ABSENT');
    expect(state.attendances[date]['7']).toEqual('ABSENT');
    expect(state.attendances[date]['8']).toEqual('ABSENT');
  });
});
