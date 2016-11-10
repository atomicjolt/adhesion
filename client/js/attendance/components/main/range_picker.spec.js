import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react/lib/ReactTestUtils';
import RangePicker  from './range_picker';

describe('Range Picker', () => {
  var result, props;
  beforeEach(() => {
    const initialDate = new Date("2016-01-01");
    props = {
      onStartChange: () => {},
      onEndChange: () => {},
      startDate: initialDate,
      endDate: initialDate
    };
    result = TestUtils.renderIntoDocument(<RangePicker {...props} />);
  });

  it('should open calender 1 when icon is clicked', () => {
    var cal1Icon = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--date')[0];
    TestUtils.Simulate.click(cal1Icon);
    expect(result.state.shouldShowCalendar[0], true);
    expect(result.state.shouldShowCalendar[1], false);
  });

  it('should open calender 2 when icon is clicked', () => {
    var cal2Icon = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--date')[1];
    TestUtils.Simulate.click(cal2Icon);
    expect(result.state.shouldShowCalendar[0], false);
    expect(result.state.shouldShowCalendar[1], true);
  });

  it('should close both calendars when user clicks outside calendar', () => {
    result.setState({shouldShowCalendar:[true, false]});
    document.body.click();
    expect(result.state.shouldShowCalendar).toEqual([false, false]);
  });

  it('removes close calendar listeners', () => {
    spyOn(window, 'removeEventListener');
    result.componentWillUnmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('click', result.closeCalendars);
  });
});
