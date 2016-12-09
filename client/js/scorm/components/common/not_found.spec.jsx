import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import NotFound from './not_found';

describe('not found', () => {
  it('renders a "not found" message', () => {
    const result = TestUtils.renderIntoDocument(<div><NotFound /></div>);
    expect(result.textContent).toContain('Page Not Found');
  });
});
