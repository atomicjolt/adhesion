import _ from 'lodash'
const defaultState = {
  examList: [],
};

export default function exams(state = defaultState, action) {
  switch (action.type) {
    case 'LIST_QUIZZES_IN_COURSE_DONE':

      return { ...state, examList: _.filter(action.payload, exam => exam.published)}
    default:
      return state;
  }
  return state;
}
