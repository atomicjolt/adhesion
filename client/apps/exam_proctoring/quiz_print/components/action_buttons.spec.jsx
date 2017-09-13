import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Buttons          from './action_buttons';
import Stub             from '../../../../specs_support/stub';


describe('Action Buttons', () => {
  let result;

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(<Stub><Buttons /></Stub>);
  });

  it('renders', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    expect(buttons.length).toBe(2);
  });
});
