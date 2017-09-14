import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';
import DateFilter from './date_filter';

describe('Date Selector', () => {
  let props;
  let result;
  const date = moment('2010-10-20').toDate();
  beforeEach(() => {
    props = {
      date,
      onChange: () => {},
    };
    result = shallow(<DateFilter {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
