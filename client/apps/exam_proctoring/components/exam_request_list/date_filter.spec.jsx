import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';
import hover from '../common/hover_button';
import datePicker from '../common/date_selector';
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

  it('Renders two hover buttons', () => {
    expect(result.find(hover).length).toEqual(2);
  });

  it('Renders two datePicker buttons', () => {
    expect(result.find(datePicker).length).toEqual(1);
  });

  // it('matches the snapshot', () => {
  //   expect(result).toMatchSnapshot();
  // });
});
