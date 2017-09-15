import React from 'react';
import { shallow } from 'enzyme';
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
    result = shallow(<RangePicker {...props} />);
  });
  it('should render the date picker', () => {
    const container = result.find('.c-popup__label').first();
    expect(container.text()).toContain('Start Date');
  });
});
