import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import ShortAnswer      from './short_answer_question';
import Stub             from '../../../../../specs_support/stub';

describe('Short Answer', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>Riddle me this Batman!</p>',
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><ShortAnswer {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Riddle me this Batman!');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders text input', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    expect(input).toBeDefined();
    expect(input.type).toBe('text');
  });
});
