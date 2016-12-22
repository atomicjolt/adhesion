
const defaultState = {
  exams: [],
};

export default function exams(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case 'LIST_QUIZZES_IN_COURSE_DONE':
      debugger
      break;
    default:
      return state;
  }
  return state;
}
