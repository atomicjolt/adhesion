import printReducer from './print';


describe('print reducer', () => {
  const quiz = {
    id: 1,
    title: 'I am the quiz'
  };
  const answers = [
    {
      id: 7,
      quiz_id: 1,
      text: 'Show me what you got'
    },
    {
      id: 8,
      quiz_id: 1,
      text: 'What is love?'
    },
    {
      id: 9,
      quiz_id: 1,
      text: 'Where have all the good times gone?'
    },
  ];

  it('loads a quiz', () => {
    const action = {
      type: 'GET_SINGLE_QUIZ_DONE',
      payload: quiz,
    };
    const state = printReducer(undefined, action);

    expect(state.quizzes['1']).toBeDefined();
    expect(state.quizzes['1'].title).toBe('I am the quiz');
  });

  it('loads quiz answers', () => {
    const quizAction = {
      type: 'GET_SINGLE_QUIZ_DONE',
      payload: quiz,
    };

    const action = {
      type: 'LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION_DONE',
      payload: answers,
    };

    const initialState = printReducer(undefined, quizAction);
    const state = printReducer(initialState, action);

    expect(state.questions['1']).toBeDefined();
    expect(state.questions['1']['7']).toBeDefined();
    expect(state.questions['1']['7'].text).toBe('Show me what you got');
  });
});
