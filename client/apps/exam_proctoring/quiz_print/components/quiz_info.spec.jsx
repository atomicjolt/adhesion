import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import QuizInfo         from './quiz_info';
import Stub             from '../../../../specs_support/stub';

describe('Quiz Info', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      title: 'Testacular',
    };
    result = TestUtils.renderIntoDocument(<Stub><QuizInfo {...props} /></Stub>);
  });

  it('renders the title', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Testacular');
  });
});
