
const EnterAnswers = () => next => (action) => {
  if (action.type === 'GET_SIGNED_URL_DONE') {
    const newWindow = action.original.newWindow;
    newWindow.location.href = action.payload.signed_url;
  }
  next(action);
};

export default EnterAnswers;
