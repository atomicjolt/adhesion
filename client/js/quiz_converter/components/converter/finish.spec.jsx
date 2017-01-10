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

  it('renders the upload again button', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(button.textContent).toContain('Upload Another Quiz');
  });

  it('routes back to the root when the button is clicked', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(appHistory.push).toHaveBeenCalledWith('/')
  });
});
