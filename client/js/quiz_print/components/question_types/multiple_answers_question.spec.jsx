import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import _                from 'lodash';
import MultipleChoice   from './multiple_answers_question';
import Stub             from '../../../../specs_support/stub';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      answers: [
        {
          id: 1,
          text: 'grass'
        },
        {
          id: 2,
          text: 'potatoes'
        },
        {
          id: 3,
          text: 'trees'
        },
        {
          id: 4,
          text: 'bats'
        },
        {
          id: 5,
          text: 'fear'
        },
      ],
      question_text: '<p>What things are green</p>',
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><MultipleChoice {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('What things are green');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders radio buttons for the options', () => {
    const boxes = TestUtils.scryRenderedDOMComponentsWithTag(result, 'input');
    expect(boxes.length).toBe(5);
    _.forEach(boxes, (box) => {
      expect(box.type).toBe('checkbox');
    });
  });

  it('renders the answer Text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('grass');
    expect(element.textContent).toContain('potatoes');
    expect(element.textContent).toContain('trees');
    expect(element.textContent).toContain('bats');
    expect(element.textContent).toContain('fear');
  });
});
