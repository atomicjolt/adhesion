import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import NotFound  from './not_found';
import Stub      from '../../../../specs_support/stub';

describe('not found', () => {
  it('renders a "not found" message', () => {
    const result = TestUtils.renderIntoDocument(<Stub><NotFound /></Stub>);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(element.textContent).toContain('Page Not Found');
  });
});
