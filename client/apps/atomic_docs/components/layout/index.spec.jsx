import React from 'react';
import { shallow } from 'enzyme';
import { Index } from './index';

describe('layout index', () => {
  let result;

  let props;

  const text = 'hello';
  const children = <h1>{text}</h1>;
  console.log("children", children);

  beforeEach(() => {
    props = {
      getSessionStatus: () => {},
      statusUrl: '/api/atomic_docs/sessions/ec3a3',
      children,
      location: {
        pathname: '/'
      },
    };
    result = shallow(<Index {...props} />);
  });

  it('renders the index', () => {
    expect(result).toBeDefined();
  });
});
