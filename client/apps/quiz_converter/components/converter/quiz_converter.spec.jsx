import React             from 'react';
import TestUtils         from 'react-addons-test-utils';
import { QuizConverter } from './quiz_converter';

jest.mock('../../libs/assets');

describe('Quiz Converter', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      lmsCourseId: '1',
      importQuiz: () => {},
      conversionInProgress: false,
    };
    result = TestUtils.renderIntoDocument(<QuizConverter {...props} />);
  });

  it('renders the title', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(element.textContent).toContain('Quiz Upload');
  });

  it('disables the submit button', () => {
    let element = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(element.className).not.toContain('is-active');
    props.conversionInProgress = true;
    result = TestUtils.renderIntoDocument(<QuizConverter {...props} />);
    result.setState({ quizFile: {}, answerFile: {} });
    element = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(element.className).not.toContain('is-active');
  });

  it('enables the submit button', () => {
    result.setState({ quizFile: {}, answerFile: {} });
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(element.className).toContain('is-active');
  });
});
