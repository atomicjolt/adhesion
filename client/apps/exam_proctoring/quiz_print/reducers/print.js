import _ from 'lodash';

const defaultState = {
  loadingQuiz: true,
  quizzes: {},
  questions: {},
};

export default function print(state = defaultState, action) {
  switch (action.type) {

    case 'GET_SINGLE_QUIZ_DONE': {
      const newState = _.cloneDeep(state);
      newState.loadingQuiz = false;
      newState.quizzes[_.toString(action.payload.id)] = action.payload;
      return newState;
    }

    case 'LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION_DONE': {
      const newState = _.cloneDeep(state);
      _.forEach(action.payload, (question) => {
        const quizId = _.toString(question.quiz_id);
        const questionId = _.toString(question.id);
        if (!newState.questions[quizId]) {
          newState.questions[quizId] = {};
        }
        newState.questions[quizId][questionId] = question;
      });
      return newState;
    }

    default:
      return state;
  }
}
