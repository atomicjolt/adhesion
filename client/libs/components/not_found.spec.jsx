import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './not_found';

describe('not found', () => {
  it('matches the snapshot', () => {
    const result = shallow(<NotFound />);
    expect(result).toMatchSnapshot();
  });
});
