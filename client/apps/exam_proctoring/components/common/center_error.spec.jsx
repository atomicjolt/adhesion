import React from 'react';
import { shallow } from 'enzyme';
import CenterError from './center_error';

describe('Center Error', () => {
  it('matches the snapshot', () => {
    expect(shallow(<CenterError />)).toMatchSnapshot();
  });

  it('renders a "Error Message" message', () => {
    const result = shallow(<CenterError />);
    const element = result.find('h1');
    expect(element.props().children).toContain('Error Saving Testing Center Id');
  });
});
