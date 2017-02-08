import React        from 'react';
import moment       from 'moment';
import TestUtils    from 'react-addons-test-utils';
import DateFilter   from './date_filter';

describe('Date Selector', () => {
  let props;
  const date = moment('2010-10-20').toDate();
  let newDate = moment('2010-10-20').toDate();
  beforeEach(() => {
    props = {
      date,
      onChange: (d) => { newDate = d; },
    };
  });

  it('changes the date when you click the arrow', () => {
    const result = TestUtils.renderIntoDocument(<DateFilter {...props} />);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(buttons[0]);
    expect(moment('2010-10-19').isSame(newDate)).toBe(true);
    TestUtils.Simulate.click(buttons[2]);
    expect(moment('2010-10-21').isSame(newDate)).toBe(true);
  });
});
