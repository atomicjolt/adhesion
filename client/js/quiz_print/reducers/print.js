import _ from 'lodash';

const defaultState = {
  loadingQuiz: true,
  loadingQuestions: true,
  quiz: {},
  questions: [],
};

export default function print(state = defaultState, action) {
  switch (action.type) {

    case 'GET_SINGLE_QUIZ_DONE':
      return { ...state, ...{ quiz: action.payload, loadingQuiz: false } };

    case 'LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION_DONE':
      return { ...state, ...{ questions: action.payload, loadingQuestions: false } };

    default:
      return state;
  }
}
