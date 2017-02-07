import _ from 'lodash';

const defaultState = {
  examRequestList: [],
  centerIdError: false,
  quizzes: {},
  signedUrl: null,
};

export default function examRequests(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_EXAM_REQUESTS_DONE': {
      return { ...state, examRequestList: action.payload };
    }

    case 'SCHEDULE_EXAM_DONE': {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(
        newState.examRequestList,
        examRequest => examRequest.id === action.payload.id
      );
      newState.examRequestList[index] = action.payload;
      return newState;
    }

    case 'TESTING_CENTERS_ACCOUNT_SETUP_DONE': {
      // this needs to be reimplemented
      // let error = false;
      // if (action.response.status !== 200) {
      //   error = true;
      // }
      // return { ...state, centerIdError: error };
      return state;
    }

    case 'GET_SINGLE_QUIZ_DONE': {
      const newState = _.cloneDeep(state);
      newState.loadingQuiz = false;
      newState.quizzes[_.toString(action.payload.id)] = action.payload;
      return newState;
    }

    case 'GET_SIGNED_URL_DONE': {
      return { ...state, signedUrl: action.payload.signed_url };
    }

    default:
      return state;
  }
}
