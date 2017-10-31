import React from 'react';
import { shallow } from 'enzyme';
import Finish from './finish';

describe('Finish page', () => {
  let result;

  beforeEach(() => {
    const props = {};
    result = shallow(<Finish {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
