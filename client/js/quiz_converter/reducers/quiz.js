import _ from 'lodash';

export default function quiz(state = null, action) {
  switch (action.type) {
    case 'CONVERT_QUIZ_DONE':
      return action.payload;

    default:
      return state;
  }
}
