import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import { ATTENDANCE_STATES } from '../../reducers/student';
import Student from './student';

const student = {
  lms_student_id: '123',
  name: 'Test Student',
};

describe('Student', () => {
  it('renders student', () => {
    const props = {
      student,
      updateStudentAttendance: () => {},
    };
    const result = TestUtils.renderIntoDocument(<Student {...props} />);
    expect(result).toBeDefined();
  });

  it('calls update student attendance', () => {
    const props = {
      student,
      updateStudentAttendance: () => {},
    };

    spyOn(props, 'updateStudentAttendance');
    const result = TestUtils.renderIntoDocument(<Student {...props} />);
    const subjects = TestUtils.scryRenderedDOMComponentsWithTag(result, 'input');
    TestUtils.Simulate.change(subjects[0]);
    TestUtils.Simulate.change(subjects[1]);
    TestUtils.Simulate.change(subjects[2]);

    expect(props.updateStudentAttendance).toHaveBeenCalledTimes(3);
  });

  it('renders checked correctly', () => {
    const props = {
      student,
      updateStudentAttendance: () => {},
      status: ATTENDANCE_STATES.PRESENT,
    };

    const result = TestUtils.renderIntoDocument(<Student {...props} />);
    const subjects = TestUtils.scryRenderedDOMComponentsWithTag(result, 'input');

    expect(subjects[0].checked).toEqual(true);
    expect(subjects[1].checked).toEqual(false);
    expect(subjects[2].checked).toEqual(false);
  });

  it('renders unmarks / toggles', () => {
    expect(Student.getNewStatus('PRESENT', 'PRESENT')).toEqual('');
    expect(Student.getNewStatus('', 'PRESENT')).toEqual('PRESENT');
    expect(Student.getNewStatus('PRESENT', 'LATE')).toEqual('LATE');
  });
});
