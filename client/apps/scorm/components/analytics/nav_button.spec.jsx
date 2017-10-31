import React from 'react';
import { shallow } from 'enzyme';
import NavButton from './nav_button';

describe('Scorm Analytics NavButton', () => {

  let result;
  let active = false;
  const props = {
    label: 'test application',
    stat: '12',
    setActive: () => { active = true; },
  };

  beforeEach(() => {
    result = shallow(<NavButton {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });

  it('calls the callback on click', () => {
    expect(active).toBeFalsy();
    const button = result.find('.c-aa-graph-nav__item');
    button.simulate('click');
    expect(active).toBeTruthy();
  });
});
