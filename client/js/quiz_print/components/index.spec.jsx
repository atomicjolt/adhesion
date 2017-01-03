import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import { Index }        from './index';


describe('index', () => {
  let result;

  beforeEach(() => {
    const props = {
      location: { query: { courseId: 1, quizId: 7 } },
      canvasRequest: () => {},
      quiz: {},
      loadingQuiz: true,
      questions: {},
    };
    result = TestUtils.renderIntoDocument(<Index {...props} />);
  });

  it('renders', () => {
    expect(result).toBeDefined();
  });
});
