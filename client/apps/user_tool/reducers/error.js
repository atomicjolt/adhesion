import { Constants as ErrorConstants } from '../actions/error';

export const initialState = () => ({
  showError: false,
});

export default (state = initialState(), action) => {
  switch (action.type) {

    case ErrorConstants.ERROR: {
      const status = action.response ? action.response.status : '';
      return { ...state, ...{ showError: action.error, statusCode: status } };
    }

    default:
      return state;
  }
};
