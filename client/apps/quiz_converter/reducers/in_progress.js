export default function inProgress(state = false, action) {
  switch (action.type) {
    case 'CONVERT_QUIZ':
      return true;
    case 'CONVERT_QUIZ_DONE':
      return false;

    default:
      return state;
  }
}
