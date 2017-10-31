import React from 'react';
import { shallow } from 'enzyme';
import CenterError from './center_error';

describe('Center Error', () => {
  it('renders a "Error Message" message', () => {
    const result = shallow(<CenterError />);
    expect(result).toMatchSnapshot();
  });
});
