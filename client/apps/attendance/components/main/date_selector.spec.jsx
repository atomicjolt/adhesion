import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';

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
    result = shallow(<DateSelector {...props} />);
  });

  it('moves one day towards the future', () => {
    const button = result.find('.c-btn--next');
    button.simulate('click', { stopPropagation: () => {} });
    expect(props.date).toContain('Tue Dec 06 2016');
  });

  it('moves us further towards the past', () => {
    const button = result.find('.c-btn--previous');
    button.simulate('click', { stopPropagation: () => {} });
    expect(props.date).toContain('Sun Dec 04 2016');
  });

  it('calls updateDate when next is clicked', () => {
    props = {
      date: 'Mon Dec 5th 2016',
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = shallow(<DateSelector {...props} />);
    const nextButton = result.find('.c-btn--next');
    nextButton.simulate('click', { stopPropagation: () => {} });
    const newDate = moment(props.date, 'ddd MMM Do YYYY').add(1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });

  it('calls updateDate when prev is clicked', () => {
    props = {
      date: 'Mon Dec 5th 2016',
      updateDate: () => {},
    };

    spyOn(props, 'updateDate');
    result = shallow(<DateSelector {...props} />);
    const prevButton = result.find('.c-btn--previous');
    prevButton.simulate('click', { stopPropagation: () => {} });
    const newDate = moment(props.date, 'ddd MMM Do YYYY').add(-1, 'd').toDate().toDateString();

    expect(props.updateDate).toHaveBeenCalledWith(newDate);
  });
});
