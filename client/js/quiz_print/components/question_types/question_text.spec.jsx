import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import TextOnly         from './question_text';
import Stub             from '../../../../specs_support/stub';

describe('text Only', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>I am a text</p>',
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><TextOnly {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('I am a text');
    expect(element.textContent).not.toContain('<p>');
  });
});
