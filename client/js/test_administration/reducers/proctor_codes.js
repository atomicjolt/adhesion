const defaultState = {
  proctorCodeList: [],
  centerIdStatus: 200
};

export default function proctorCodes(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_PROCTOR_CODES_DONE': {
      return { ...state, proctorCodeList: action.payload };
    }

    case 'TESTING_CENTERS_ACCOUNT_SETUP_DONE': {
      return { ...state, centerIdStatus: action.response.status };
    }

    default:
      return state;
  }
}
