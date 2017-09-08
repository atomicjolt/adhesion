import _ from 'lodash';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { StudentList } from './student_list';

function makeStudent(id) {
  return {
    name: 'Fake Student',
    lms_student_id: id,
    avatar_url: 'http://',
    enrollments: [{ course_section_id: id + 1 }],
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
        lms_course_id: '1',
      },
      applicationDate: new Date('2016-1-1').toDateString(),
      attendance: {},
      sections: [{ id: 5, name: 'IMASECTION' }, { id: 999, name: 'ANOTHER' }],
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
      props.settings.lms_course_id,
      props.applicationDate,
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
      props.settings.lms_course_id,
      props.applicationDate,
      '',
    );
  });

  it('students should return an array of student components', () => {
    const component = TestUtils.renderIntoDocument(<StudentList {...props} />);
    result = component.students();
    expect(result.length).toEqual(Object.keys(props.students).length);
    result.forEach(e => expect(TestUtils.isElement(e)).toEqual(true));
  });

  it('should filter students by section', () => {
    result.setState({ currentSection: 5 });
    let students = result.students();
    expect(students.length).toBe(1);
    result.setState({ currentSection: 999 });
    students = result.students();
    expect(students.length).toBe(0);
  });
});
