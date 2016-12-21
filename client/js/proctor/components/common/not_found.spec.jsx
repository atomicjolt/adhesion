import React     from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import NotFound  from './not_found';

describe('not found', () => {
  it('renders a "not found" message', () => {
    const result = TestUtils.renderIntoDocument(<div><NotFound /></div>);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(element.textContent).toContain('Page Not Found');
  });
});
