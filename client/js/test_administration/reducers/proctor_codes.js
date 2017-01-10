const defaultState = {
  proctorCodeList: [],
  centerIdError: false
};

export default function proctorCodes(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_PROCTOR_CODES_DONE': {
      return { ...state, proctorCodeList: action.payload };
    }

    case 'TESTING_CENTERS_ACCOUNT_SETUP_DONE': {
      let error = false;
      if (action.response.status !== 200) {
        error = true;
      }
      return { ...state, centerIdError: error };
    }

    default:
      return state;
  }
}
