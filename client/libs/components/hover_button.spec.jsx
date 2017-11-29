import React from 'react';
import { shallow } from 'enzyme';
import HoverButton from './hover_button';

describe('hover button', () => {
  let result;
  let clicked;

  beforeEach(() => {
    clicked = false;
    const props = {
      onClick: () => { clicked = true; },
      style: {
        color: 'white',
      },
      hoveredStyle: {
        color: 'black',
      },
    };
    result = shallow(<HoverButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('handles the onClick function', () => {
    expect(clicked).toBeFalsy();
    result.find('button').simulate('click');
    expect(clicked).toBeTruthy();
  });
});
