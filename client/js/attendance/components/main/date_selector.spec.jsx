import React from 'react';
import moment from 'moment';
import TestUtils from 'react/lib/ReactTestUtils';

import DateSelector from './date_selector';

describe('getDate', () => {
  let result;
  let props;
  const date = 'Dec 31 2015';

  beforeEach(() => {
    props = {
      date,
      updateDate: (newDate) => { props.date = newDate; },
    };
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
  });

  it('moves one day towards the future', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--next');
    TestUtils.Simulate.click(button);
    expect(props.date).toContain('Jan 01 2016');
  });

  it('moves us further towards the past', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(button);
    expect(props.date).toContain('Dec 30 2015');
  });

  it('calls updateDate when next is clicked', () => {
    props = {
      date: new Date('2016-01-01'),
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const nextButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--next');
    TestUtils.Simulate.click(nextButton);
    const newDate = moment(props.date).add(1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('calls updateDate when prev is clicked', () => {
    props = {
      date: new Date('2016-01-01'),
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const prevButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(prevButton);
    const newDate = moment(props.date).add(-1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('should show the calendar when clicked', () => {
    expect(result.datePicker.state.open).toBeFalsy();
    const dateButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--date');
    TestUtils.Simulate.click(dateButton);
    expect(result.datePicker.state.open).toBeTruthy();
  });
});
