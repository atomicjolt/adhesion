import { Constants } from '../actions/analytics';

const initialState = {
  data: {},
  view: 'activity',
  viewId: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.LOAD_COURSE_DATA_DONE: {
      const courseData = {
        meanScore: action.payload.mean_score,
        title: action.payload.title,
        regCount: action.payload.registration_count,
        medScore: action.payload.med_score,
        lowScore: action.payload.low_score,
        highScore: action.payload.high_score,
        passFail: action.payload.pass_fail,
        completed: action.payload.completed,
        regDetails: action.payload.reg_details,
      };
      return { ...state,
        data: courseData,
      };
    }
    case Constants.SWITCH_VIEW: {
      return { ...state, view: action.view, viewId: action.viewId };
    }
    case Constants.LOAD_USER_DATA_DONE: {
      const courseData = {
        meanScore: action.payload.mean_score,
        title: action.payload.title,
        passFail: action.payload.pass_fail,
        regDetails: action.payload.reg_details,
      };
      return { ...state,
        data: courseData,
      };
    }
    default:
      return state;
  }
};
