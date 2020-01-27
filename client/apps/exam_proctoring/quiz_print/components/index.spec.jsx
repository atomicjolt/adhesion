import React            from 'react';
import ReactTestUtils        from 'react-dom/test-utils';
import { Index }        from './index';


describe('index', () => {
  let result;

  beforeEach(() => {
    const props = {
      location: { query: { courseId: '1', quizId: '7' } },
      canvasRequest: () => {},
      quiz: {},
      loadingQuiz: true,
      questions: {},
    };
    result = ReactTestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders', () => {
    expect(result).toBeDefined();
  });
});
