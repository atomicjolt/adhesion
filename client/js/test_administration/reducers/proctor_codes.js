import _ from 'lodash';

const defaultState = {
  proctorCodeList: [],
  centerIdError: false,
  quizzes: {},
};

export default function proctorCodes(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_PROCTOR_CODES_DONE': {
      return { ...state, proctorCodeList: action.payload };
    }

    case 'TESTING_CENTERS_ACCOUNT_SETUP_DONE': {
      let error = false;
      // if (action.response.status !== 200) {
      //   error = true;
      // }
      return { ...state, centerIdError: error };
    }

    case 'GET_SINGLE_QUIZ_DONE': {
      const newState = _.cloneDeep(state);
      newState.loadingQuiz = false;
      newState.quizzes[_.toString(action.payload.id)] = action.payload;
      return newState;
    }

    default:
      return state;
  }
}
