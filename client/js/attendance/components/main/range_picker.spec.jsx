import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import RangePicker from './range_picker';

describe('Range Picker', () => {
  let result;
  let props;

  beforeEach(() => {
    const initialDate = new Date('2016-01-01');
    props = {
      onStartChange: () => {},
      onEndChange: () => {},
      startDate: initialDate,
      endDate: initialDate,
    };
    result = TestUtils.renderIntoDocument(<RangePicker {...props} />);
  });
  it('should render the date picker', () => {
    const container = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-popup__label')[0];
    expect(container.textContent).toContain('Start Date');
  });
});
