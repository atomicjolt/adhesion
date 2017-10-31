import React from 'react';
import { shallow } from 'enzyme';
import Buttons from './action_buttons';
import { hashHistory } from 'react-router';

describe('Action Buttons', () => {
  let result;

  beforeEach(() => {
    result = shallow(<Buttons />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('handles the history push button', () => {
    hashHistory.push = jest.fn();
    result.find('button').first().simulate('click');
    expect(hashHistory.push).toBeCalled();
  });
});
