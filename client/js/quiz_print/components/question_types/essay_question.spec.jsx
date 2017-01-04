import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Essay            from './essay_question';
import Stub             from '../../../../specs_support/stub';

describe('Essay', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_text: '<p>What is love?</p>',
      id: '7',
    };
    result = TestUtils.renderIntoDocument(<Stub><Essay {...props} /></Stub>);
  });

  it('renders the question text', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('What is love?');
    expect(element.textContent).not.toContain('<p>');
  });

  it('renders text area', () => {
    const input = TestUtils.findRenderedDOMComponentWithTag(result, 'textarea');
    expect(input).toBeDefined();
  });
});
