import { Constants } from '../actions/analytics';

const initialState = {
  data: {},
  view: 'course',
  viewId: '0',
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.LOAD_COURSE_DATA_DONE: {
      const courseData = {
        title: action.payload.title,
        scores: action.payload.scores,
        correlationData: action.payload.correlation_data,
        completed: action.payload.completed,
        passFail: action.payload.pass_fail,
        analyticsTable: action.payload.analytics_table,
        navButtons: action.payload.nav_buttons,
        courseTimeSpent: action.payload.course_time_spent,
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
        studentName: action.payload.student_name,
        title: action.payload.title,
        scores: action.payload.scores,
        completed: action.payload.completed,
        passFail: action.payload.pass_fail,
        analyticsTable: action.payload.analytics_table,
        navButtons: action.payload.nav_buttons,
      };
      return { ...state,
        data: courseData,
      };
    }
    case Constants.LOAD_ACTIVITY_DATA_DONE: {
      const courseData = {
        title: action.payload.title,
        analyticsTable: action.payload.analytics_table,
      };
      return { ...state,
        data: courseData,
      };
    }
    default:
      return state;
  }
};
