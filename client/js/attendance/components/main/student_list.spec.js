import _            from 'lodash';
import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react/lib/ReactTestUtils';

import { StudentList } from './student_list';
import Student from './student';

const makeStudent = (id) => ({
  name: "Fake Student",
  lms_student_id: id,
  avatar_url: "http://"
});

const fakeStudents = (n) => {
  const studentList = _.range(n).map((i) => makeStudent(i));
  return studentList.reduce((students, student) => {
    students[student.lms_student_id] = student;
    return students;}, {});
};
const error = {showError: false, statusCode: 502}

const props = {
  getStudents: () => {},
  markStudents: () => {},
  getStudentAttendance: () => {},
  changeDate: () => {},
  canvasRequest: () => {},
  students: fakeStudents(10),
  error: error,
  settings: {
    lms_course_id: 1
  },
  application: {date:new Date("2016-1-1")},
  attendance:{}
};

describe('Student List', () => {
  it('renders', () => {
    const result = TestUtils.renderIntoDocument(<StudentList {...props}/>);
    expect(result).toBeDefined();
  });

  it('calls getStudents when onMount', () => {
    spyOn(props, 'canvasRequest');
    const result = TestUtils.renderIntoDocument(<StudentList {...props}/>);
    expect(props.canvasRequest).toHaveBeenCalled();
  });

  describe('Mark all', () => {
    it('should apply a status to all students', () => {
      spyOn(props, 'markStudents');
      const result = TestUtils.renderIntoDocument(<StudentList {...props}/>);
      const students = result.markAll("PRESENT");
      expect(props.markStudents).toHaveBeenCalledWith(
        props.students,
        props.settings.lmsCourseId,
        props.application.date,
        "PRESENT"
      );
    });
  });

  describe('students', () => {
    it('should return an array of student components', () => {
      const component = TestUtils.renderIntoDocument(<StudentList {...props}/>);
      const result = component.students();
      expect(result.length).toEqual(Object.keys(props.students).length);
      result.forEach((e) => expect(TestUtils.isElement(e)).toEqual(true));
    });
  });
});
