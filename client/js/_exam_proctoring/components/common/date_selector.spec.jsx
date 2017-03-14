import React        from 'react';
import moment       from 'moment';
import TestUtils    from 'react-addons-test-utils';
import DateSelector from './date_selector';

describe('Date Selector', () => {
  let props;
  const date = moment('2010-10-20').toDate();

  beforeEach(() => {
    props = {
      date,
      onChange: () => {},
    };
  });

  it('opens the datepicker when you click the button', () => {
    const result = TestUtils.renderIntoDocument(<DateSelector {...props} />);
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.mouseDown(button);
    expect(
      TestUtils.findRenderedDOMComponentWithClass(
        result,
        'react-datepicker__input-container'
      ).getAttribute('class')
    ).toContain('react-datepicker__tether-enabled');
  });
});
