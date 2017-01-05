import _ from 'lodash';

const defaultState = {
  examList: [],
  assignedExams: {},
  ready: false,
};

export default function exams(state = defaultState, action) {
  switch (action.type) {
    case 'CREATE_QUIZ_SUBMISSION_START_QUIZ_TAKING_SESSION_DONE':
      debugger;
      // return { ...state, examList: _.filter(action.payload, exam => exam.published) };
      return state;

    default:
      return state;
  }
}
