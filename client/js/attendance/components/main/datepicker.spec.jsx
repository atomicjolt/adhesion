import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import DatePicker from './datepicker';
import Stub from '../../../../specs_support/stub';

describe('date picker', () => {
  let result;

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(<Stub><DatePicker /></Stub>);
  });

  it('renders...', () => {
    expect(TestUtils.findRenderedDOMComponentWithClass(result, 'c-date-calendar')).toBeDefined();
  });
});
