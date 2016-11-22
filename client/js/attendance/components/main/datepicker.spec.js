import React        from 'react';
import TestUtils    from 'react/lib/ReactTestUtils';
import DatePicker   from './datepicker.jsx';

describe('date picker', () => {
  let result;

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(<DatePicker/>);
  });

  it('renders...', () => {
    expect(TestUtils.findRenderedDOMComponentWithClass(result, 'c-date-calendar')).toBeDefined();
  });
});