import { Constants } from '../actions/analytics';

const initialState = {
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.LOAD_COURSE_DATA_DONE: {
      return { ...state,
        meanScore: action.payload.mean_score,
        title: action.payload.title,
      };
    }
    default:
      return state;
  }
};
