import React from 'react';
import { shallow } from 'enzyme';
import Index from './index';

describe('index', () => {
  let result;

  beforeEach(() => {
    const props = {
      children: 'america'
    };
    result = shallow(<Index {...props} />);
  });

  it('matches the snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
