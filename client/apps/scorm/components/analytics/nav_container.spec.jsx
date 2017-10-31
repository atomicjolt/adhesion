import React from 'react';
import { shallow } from 'enzyme';
import NavContainer from './nav_container';

describe('Scorm Analytics NavContainer', () => {

  let result;
  let switched = false;
  const props = {
    navButtons: [
      {
        name: 'test application',
        stat: '12',
      },
    ],
    switchChart: () => { switched = true; },
  };

  beforeEach(() => {
    result = shallow(<NavContainer {...props} />);
  });

  it('match the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
