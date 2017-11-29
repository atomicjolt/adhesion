import React from 'react';
import { shallow } from 'enzyme';
import Index from './index';

describe('index', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      children: <div className="testy">Im a test</div>,
    };
    const component = <Index {...props} />;
    result = shallow(component);
  });

  it('renders the index', () => {
    const child = result.find('.testy');
    expect(child).toBeDefined();
  });
});
