const defaultState = {
  proctorCodeList: []
};

export default function proctorCodes(state = defaultState, action) {
  switch (action.type) {

    case 'LOAD_PROCTOR_CODES_DONE': {
      return { ...state, proctorCodeList: action.payload };
    }

    default:
      return state;
  }
}
