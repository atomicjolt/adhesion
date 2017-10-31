import { DONE } from 'atomic-fuel/libs/constants/wrapper';
import { listUsersInCourseUsers } from 'atomic-canvas/libs/constants/courses';
import studentReducer from './student';


describe('GET_STUDENTS_DONE', () => {
  const students = [
    { name: 'Jack', id: 1 },
    { name: 'Jill', id: 2 },
    { name: 'Humpty', id: 3 },
    { name: 'Dumpty', id: 4 },
  ];

  it('updates all students', () => {
    const action = {
      type: listUsersInCourseUsers.type + DONE,
      payload: students,
    };
    const result = studentReducer({ all: {} }, action);

    expect(Object.keys(result.all).length).toEqual(4);
    expect(Object.keys(result.all)).toEqual(['1', '2', '3', '4']);
  });

  it('adds appends new students to existing students', () => {
    const action = {
      type: listUsersInCourseUsers.type + DONE,
      payload: students,
    };
    const oldStudents = {
      all: {
        5: { lms_student_id: 5, name: 'apple' },
        6: { lms_student_id: 6, name: 'banana' },
        7: { lms_student_id: 7, name: 'coconut' },
        8: { lms_student_id: 8, name: 'dragonfruit' },
      },
    };

    const result = studentReducer(oldStudents, action);

    expect(Object.keys(result.all).length).toEqual(8);
    expect(Object.keys(result.all)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });
});
