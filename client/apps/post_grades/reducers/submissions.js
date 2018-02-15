import { Constants as SubmissionsConstants } from '../actions/submissions';

const defaultState = {
  studentInfoSubmitted: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {

    case SubmissionsConstants.CREATE_STUDENT_INFO_DONE: {
      const status = action.response ? action.response.status : '';
      let studentInfoSubmitted = false;
      if (status === 200) {
        studentInfoSubmitted = true;
      }
      return {
        ...state,
        ...{
          showError: action.error,
          statusCode: status,
          studentInfoSubmitted,
        },
      };
    }

    default:
      return state;
  }
};
