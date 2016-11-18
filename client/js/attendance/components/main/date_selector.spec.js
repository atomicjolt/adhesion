
import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react/lib/ReactTestUtils';

import DateSelector from './date_selector';

xdescribe('getDate', () => {
  var result;
  var props;
  const date = "2016-01-01";

  beforeEach(() => {
    props = {
      date,
      updateDate: () => {}
    };
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
  });

  it('Returns correct visual date', () => {
    const visualDate = result.getDate(date, 0, true);
    expect(visualDate).toEqual("Fri Jan 01 2016");
  });

  it('Handles date arithmetic', () => {
    const newDate = result.getDate(date, -1, true);
    expect(newDate).toEqual("Thu Dec 31 2015");
  });

  it('Returns date object', () => {
    const dateObj = result.getDate(date, 0, true, true);
    expect(dateObj._isAMomentObject).toEqual(true);
  });

  it('Returns iso date string', () => {
    const isoDate = result.getDate(date, 0);
    expect(isoDate).toEqual(date);
  });
});

xdescribe('Event Listeners', () => {
  var result;
  var props;

  beforeEach(() => {
    props = {
      date: new Date("2016-01-01"),
      updateDate: () => {}
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
      date: new Date("2016-01-01"),
      updateDate: () => {}
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const nextButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--next');
    TestUtils.Simulate.click(nextButton);
    const newDate = new Date(props.date.getTime());
    newDate.setHours(0,0,0,0);
    newDate.setDate(newDate.getDate() + 1);

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('calls updateDate when prev is clicked', () => {
    props = {
      date: new Date("2016-01-01"),
      updateDate: () => {}
    };

    spyOn(props, 'updateDate');
    result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const prevButton = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--previous');
    TestUtils.Simulate.click(prevButton);
    const newDate = new Date(props.date.getTime());
    newDate.setHours(0,0,0,0);
    newDate.setDate(newDate.getDate() - 1);

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });
});
