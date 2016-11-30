import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import DateSelector from './date_selector';

describe('getDate', () => {
  let result;
  let props;
  const date = new Date('2016-01-01');

  beforeEach(() => {
    props = {
      date,
      updateDate: (newDate) => { props.date = newDate; },
    };
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
  });

  it('Returns correct visual date', () => {
    const visualDate = DateSelector.visualDate(date);
    expect(visualDate).toEqual('Thu Dec 31 2015');
  });

  it('moves one day towards the future', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--next');
    TestUtils.Simulate.click(button);
    expect(props.date.toDateString()).toContain('Jan 01 2016');
  });

  it('moves us further towards the past', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(button);
    expect(props.date.toDateString()).toContain('Dec 30 2015');
  });
});

describe('Event Listeners', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      date: new Date('2016-01-01'),
      updateDate: () => {},
    };
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
  });

  it('removes event listeners on unmount', () => {
    spyOn(window, 'removeEventListener');
    result.componentWillUnmount();
    expect(window.removeEventListener).toHaveBeenCalled();
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
    const newDate = new Date(props.date.getTime());
    newDate.setHours(0, 0, 0, 0);
    newDate.setDate(newDate.getDate() + 1);

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
    const newDate = new Date(props.date.getTime());
    newDate.setHours(0, 0, 0, 0);
    newDate.setDate(newDate.getDate() - 1);

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });
});
