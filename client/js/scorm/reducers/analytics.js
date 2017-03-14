import { Constants } from '../actions/analytics';

const initialState = {
  data: {},
  view: 'student',
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
        passed: action.payload.passed,
        regDetails: action.payload.reg_details,
      };
      return { ...state,
        data: courseData,
      };
    }
    case Constants.SWITCH_VIEW: {
      if(action.view){
        return { ...state, view: action.view };
      }
      return state;
    }
    default:
      return state;
  }
};
