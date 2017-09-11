import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import _                from 'lodash';
import MultipleChoice   from './multiple_choice_question';
import Stub             from '../../../../../specs_support/stub';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          id: 1,
          text: 'yes'
        },
        {
          id: 2,
          text: 'no'
        },
        {
          id: 3,
          text: 'maybe'
        },
      ],
      question_text: '<p>I am the title</p>',
      id: 7,
    };
    result = TestUtils.renderIntoDocument(<Stub><MultipleChoice {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('I am the title');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders radio buttons for the options', () => {
    const radios = TestUtils.scryRenderedDOMComponentsWithTag(result, 'input');
    expect(radios.length).toBe(3);
    _.forEach(radios, (radio) => {
      expect(radio.type).toBe('radio');
    });
  });

  it('renders the answer Text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('yes');
    expect(element.textContent).toContain('no');
    expect(element.textContent).toContain('maybe');
  });
});
