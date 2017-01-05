import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Question         from './_question';
import Stub             from '../../../../specs_support/stub';

describe('question', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_type: 'multiple_choice_question',
      position: 1,
      points_possible: 3,
    };
    result = TestUtils.renderIntoDocument(<Stub><Question {...props} /></Stub>);
  });

  it('renders the question position', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Question 1');
  });

  it('renders the points possible', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('3 pts');
  });

  // TODO: test that it renders the correct types maybe?
});
