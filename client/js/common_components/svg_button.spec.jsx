/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SvgButton from './svg_button';
import Stub from '../../specs_support/stub';

describe('common components svg button', () => {
  let props;
  let result;
  let clicked = false;
  let blur = false;

  beforeEach(() => {
    props = {
      className: 'IMASPEC',
      type: 'drop',
      onClick: () => { clicked = true; },
      onBlur: () => { blur = true; },
    };
    result = TestUtils.renderIntoDocument(<Stub><SvgButton {...props} /></Stub>);
  });

  it('renders the svg with the correct class', () => {
    const elements = TestUtils.scryRenderedDOMComponentsWithClass(result, 'IMASPEC');
    expect(elements.length).toBe(1);
  });

  it('renders the button', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    expect(buttons.length).toBe(1);
  });

  it('renders the correct icon given the type property', () => {
    const path = TestUtils.findRenderedDOMComponentWithClass(result, 'c-path');
    expect(path.getAttribute('d')).toBe('M14 20l10 10 10-10z');
  });

  it('renders the correct svg with the right class', () => {
    const svgs = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-icon');
    expect(svgs.length).toBe(1);
  });

  it('renders the button and click it', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, props.className);
    TestUtils.Simulate.click(button);
    expect(clicked).toBeTruthy();
  });

  it('renders the button and blur it', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, props.className);
    TestUtils.Simulate.blur(button);
    expect(blur).toBeTruthy();
  });
});
