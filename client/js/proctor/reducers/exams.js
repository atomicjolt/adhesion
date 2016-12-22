
const defaultState = {
  examList: [],
};

export default function exams(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_QUIZZES_IN_COURSE_DONE':
      return { ...state, examList: action.payload }
    default:
      return state;
  }
  return state;
}
