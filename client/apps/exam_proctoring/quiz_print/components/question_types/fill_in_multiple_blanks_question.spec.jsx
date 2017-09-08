import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import FillInTheBlanks  from './fill_in_multiple_blanks_question';
import Stub             from '../../../../specs_support/stub';

describe('Multiple Choice', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>Holy [blank1] youve been down too long in the [blank2] sea.</p>',
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><FillInTheBlanks {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Holy');
    expect(element.textContent).toContain('youve been down too long in the');
    expect(element.textContent).toContain('sea.');
    expect(element.textContent).not.toContain('blank1');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders text input', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    const input = element.getElementsByClassName('textbox');
    expect(input.length).toBe(2);
    expect(input[0].type).toBe('text');
    expect(input[1].type).toBe('text');
  });
});
