import _            from 'lodash';
import React        from 'react';
import TestUtils    from 'react/lib/ReactTestUtils';
import { StudentList } from './student_list';

fdescribe('Student List', () => {
  let result, props;
  const error = {showError: false, statusCode: 502};

  beforeEach(() => {
    props = {
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
      application: {date: new Date("2016-1-1")},
      attendance:{}
    };

    result = TestUtils.renderIntoDocument(<StudentList {...props}/>);
  });

  it('calls getStudents when onMount', () => {
    spyOn(props, 'canvasRequest');
    result = TestUtils.renderIntoDocument(<StudentList {...props}/>);
    expect(props.canvasRequest).toHaveBeenCalled();
  });

  it('Mark all should apply a status to all students', () => {
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

  //TODO: this
  it('Unmark all should apply a status to all students', () => {
    const students = result.markAll("PRESENT");
  });

  it('students should return an array of student components', () => {
    const component = TestUtils.renderIntoDocument(<StudentList {...props}/>);
    const result = component.students();
    expect(result.length).toEqual(Object.keys(props.students).length);
    result.forEach((e) => expect(TestUtils.isElement(e)).toEqual(true));
  });
});

function makeStudent (id){
  return {
    name: "Fake Student",
    lms_student_id: id,
    avatar_url: "http://"
  }
}

function fakeStudents(n){
  const studentList = _.range(n).map((i) => makeStudent(i));
  return studentList.reduce((students, student) => {
    students[student.lms_student_id] = student;
    return students;}, {});
}
