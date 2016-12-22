
const defaultState = {
  studentList: [],
};

export default function students(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_USERS_IN_COURSE_USERS_DONE':
    debugger
      return { ...state, studentList: action.payload }
    default:
      return state;
  }
  return state;
}
