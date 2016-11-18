/* global describe beforeEach it expect */

import React     from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import SVGButton from '../../../common_components/svg_button.jsx';
import Stub      from '../../../../specs_support/stub.jsx'

describe('Common SVG Button', () => {
  let result, props, clicked;

  beforeEach(() => {
    clicked = false;

    props = {
      type: 'gradedAssignment',
      onClick: () => clicked = true
    };

    result = TestUtils.renderIntoDocument(<Stub><SVGButton {...props}/></Stub>)
  });

  it('calls the callback on click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(clicked).toBeTruthy();
  });
});
