import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Loading          from './loading';
import Stub             from '../../../../specs_support/stub';

describe('loading', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      loadingQuiz: true,
    };
    result = TestUtils.renderIntoDocument(<Stub><Loading {...props} /></Stub>);
  });

  it('Says its loading', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Loading Quiz');
  });

  it('loading questions', () => {
    props.loadingQuiz = false;
    result = TestUtils.renderIntoDocument(<Stub><Loading {...props} /></Stub>);
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('Loading Questions');
  });
});
