import { Constants as QuizConverterConstants } from '../actions/quiz_converter';
import { newError } from '../actions/errors';
import appHistory from '../history';

const Conversion = store => next => (action) => { // eslint-disable-line no-unused-vars
  switch (action.type) {
    case QuizConverterConstants.CONVERT_QUIZ_DONE:
      if (!action.error && action.payload.html_url) {
        window.top.location.href = action.payload.html_url;
        appHistory.push('finish');
      } else if (action.error) {
        store.dispatch(newError(action.error.response.body.message));
      } else {
        store.dispatch(newError('An unknown error has occurred.'));
      }

      break;

    default:
      break;
  }

  // call the next middleWare
  next(action);
};

export { Conversion as default };
