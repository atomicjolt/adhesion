import _ from 'lodash';
import React from 'react';
import { shallow } from 'enzyme';
import { StudentList } from './student_list';

function makeStudent(id) {
  return {
    name: 'Fake Student',
    sortable_name: 'Fake Student',
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

    result = shallow(<StudentList {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('calls getStudents when onMount', () => {
    spyOn(props, 'canvasRequest');
    result = shallow(<StudentList {...props} />);
    expect(props.canvasRequest).toHaveBeenCalled();
  });

  it('Mark all should apply a status to all students', () => {
    spyOn(props, 'markStudents');
    result = shallow(<StudentList {...props} />);
    result.instance().markAll('PRESENT');
    const studentsData = _.map(
      props.students,
      student => (
        {
          name: student.name,
          lms_student_id: student.lms_student_id,
          sortable_name: student.sortable_name,
        }
      )
    );
    expect(props.markStudents).toHaveBeenCalledWith(
      studentsData,
      props.settings.lms_course_id,
      props.applicationDate,
      'PRESENT',
    );
  });

  it('Unmark all should apply a status to all students', () => {
    spyOn(props, 'markStudents');
    result = shallow(<StudentList {...props} />);
    const button = result.find('.c-btn--unmark-all').first();
    button.simulate('click');
    const studentsData = _.map(
      props.students,
      student => (
        {
          name: student.name,
          lms_student_id: student.lms_student_id,
          sortable_name: student.sortable_name,
        }
      )
    );
    expect(props.markStudents).toHaveBeenCalledWith(
      studentsData,
      props.settings.lms_course_id,
      props.applicationDate,
      '',
    );
  });

  it('students should return an array of student components', () => {
    const component = shallow(<StudentList {...props} />);
    result = component.instance().students();
    expect(result.length).toEqual(Object.keys(props.students).length);
  });

  it('should filter students by section', () => {
    result.instance().setState({ currentSection: 5 });
    let students = result.instance().students();
    expect(students.length).toBe(1);
    result.instance().setState({ currentSection: 999 });
    students = result.instance().students();
    expect(students.length).toBe(0);
  });
});
