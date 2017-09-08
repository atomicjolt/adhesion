/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import CommonSvg from './common_svg';
import Stub from '../../specs_support/stub';

describe('common svg', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      className: 'IMASPEC',
      type: 'drop',
    };
    result = TestUtils.renderIntoDocument(<Stub><CommonSvg {...props} /></Stub>);
  });

  it('renders the svg with the correct class', () => {
    const elements = TestUtils.scryRenderedDOMComponentsWithClass(result, 'IMASPEC');
    expect(elements.length).toBe(1);
  });

  it('renders the correct icon given the type property', () => {
    const path = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-path')[0];
    expect(path.getAttribute('d')).toBe('M14 20l10 10 10-10z');
  });
});
