import React from 'react';
import { shallow } from 'enzyme';
import CommonSvg from './common_svg';

describe('common svg', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      className: 'IMASPEC',
      type: 'drop',
    };
    result = shallow(<CommonSvg {...props} />);
  });

  it('renders the svg with the correct class', () => {
    const elements = result.find('.IMASPEC');
    expect(elements.length).toBe(1);
  });

  it('renders the correct icon given the type property', () => {
    const path = result.find('.c-path');
    expect(path.props().d).toBe('M14 20l10 10 10-10z');
  });
});
