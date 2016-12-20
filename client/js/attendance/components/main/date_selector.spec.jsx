import React from 'react';
import moment from 'moment';
import TestUtils from 'react-addons-test-utils';

import DateSelector from './date_selector';

describe('getDate', () => {
  let result;
  let props;
  const date = 'Mon Dec 5th 2016';

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
    expect(props.date).toContain('Tue Dec 06 2016');
  });

  it('moves us further towards the past', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(button);
    expect(props.date).toContain('Sun Dec 04 2016');
  });

  it('calls updateDate when next is clicked', () => {
    props = {
      date: 'Mon Dec 5th 2016',
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const nextButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--next');
    TestUtils.Simulate.click(nextButton);
    const newDate = moment(props.date, 'ddd MMM Do YYYY').add(1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('calls updateDate when prev is clicked', () => {
    props = {
      date: 'Mon Dec 5th 2016',
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const prevButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(prevButton);
    const newDate = moment(props.date, 'ddd MMM Do YYYY').add(-1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('should show the calendar when clicked', () => {
    expect(result.datePicker.state.open).toBeFalsy();
    const dateButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--date');
    TestUtils.Simulate.click(dateButton);
    expect(result.datePicker.state.open).toBeTruthy();
  });
});
