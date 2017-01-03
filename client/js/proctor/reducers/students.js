import _ from 'lodash';

const defaultState = {
  studentList: {},
};

export default function students(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_USERS_IN_COURSE_USERS_DONE': {
      const newState = _.cloneDeep(state);
      _.each(action.payload, (student) => {
        newState.studentList[student.id] = student;
      });
      return newState;
    }

    default:
      return state;
  }
}
