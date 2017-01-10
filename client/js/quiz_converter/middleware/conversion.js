import { Constants as QuizConverterConstants } from '../actions/quiz_converter';
import appHistory                                 from '../../history';

const Conversion = store => next => (action) => { // eslint-disable-line no-unused-vars
  switch (action.type) {
    case QuizConverterConstants.CONVERT_QUIZ_DONE:
      appHistory.push('/finish');
      break;

    default:
      break;
  }

  // call the next middleWare
  next(action);
};

export { Conversion as default };
