import { Constants as QuizConversionActions } from '../actions/quiz_converter';
import { Constants as ErrorActions }          from '../actions/errors';

export default function quiz(state = null, action) {
  switch (action.type) {
    case QuizConversionActions.CONVERT_QUIZ:
      return null;

    case ErrorActions.NEW_ERROR:
      return action.payload;

    default:
      return state;
  }
}
