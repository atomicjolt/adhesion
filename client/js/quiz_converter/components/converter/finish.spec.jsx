import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Finish           from './finish';
import appHistory          from '../../../history';
import Stub             from '../../../../specs_support/stub';

describe('Finish page', () => {
  let result;

  beforeEach(() => {
    const props = {
    };
    spyOn(appHistory, 'push');
    result = TestUtils.renderIntoDocument(<Stub><Finish {...props} /></Stub>);

  });

  it('renders redirect text', () => {
    const h1 = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(h1.textContent).toContain("Redirecting to Quiz...");
  });
});
