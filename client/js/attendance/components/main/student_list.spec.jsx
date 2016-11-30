import _ from 'lodash';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import { StudentList } from './student_list';

function makeStudent(id) {
  return {
    name: 'Fake Student',
    lms_student_id: id,
    avatar_url: 'http://',
  };
}

function fakeStudents(n) {
  const studentList = _.range(n).map(i => makeStudent(i));
  return _.orderBy(studentList, 'name');
}

describe('Student List', () => {
  let result;
  let props;
  const error = { showError: false, statusCode: 502 };

  beforeEach(() => {
    props = {
      getStudents: () => {},
      markStudents: () => {},
      getStudentAttendance: () => {},
      changeDate: () => {},
      canvasRequest: () => {},
      downloadFile: () => {},
      showError: () => {},
      students: fakeStudents(10),
      error,
      settings: {
        lms_course_id: 1,
      },
      application: { date: new Date('2016-1-1') },
      attendance: {},
    };

    result = TestUtils.renderIntoDocument(<StudentList {...props} />);
  });

  it('calls getStudents when onMount', () => {
    spyOn(props, 'canvasRequest');
    result = TestUtils.renderIntoDocument(<StudentList {...props} />);
    expect(props.canvasRequest).toHaveBeenCalled();
  });

  it('Mark all should apply a status to all students', () => {
    spyOn(props, 'markStudents');
    result = TestUtils.renderIntoDocument(<StudentList {...props} />);
    result.markAll('PRESENT');
    expect(props.markStudents).toHaveBeenCalledWith(
      props.students,
      props.settings.lmsCourseId,
      props.application.date,
      'PRESENT',
    );
  });

  it('Unmark all should apply a status to all students', () => {
    spyOn(props, 'markStudents');
    result = TestUtils.renderIntoDocument(<StudentList {...props} />);
    const button = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--unmark-all');
    TestUtils.Simulate.click(button[0]);
    expect(props.markStudents).toHaveBeenCalledWith(
      props.students,
      props.settings.lmsCourseId,
      props.application.date,
      '',
    );
  });

  it('students should return an array of student components', () => {
    const component = TestUtils.renderIntoDocument(<StudentList {...props} />);
    result = component.students();
    expect(result.length).toEqual(Object.keys(props.students).length);
    result.forEach(e => expect(TestUtils.isElement(e)).toEqual(true));
  });
});

