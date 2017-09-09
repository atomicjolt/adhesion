/* global describe beforeEach it expect */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SVGButton from '../../../../libs/components/svg_button';
import Stub from '../../../../specs_support/stub';

describe('Common SVG Button', () => {
  let result;
  let props;
  let clicked;

  beforeEach(() => {
    clicked = false;

    props = {
      type: 'gradedAssignment',
      onClick: () => { clicked = true; },
    };

    result = TestUtils.renderIntoDocument(<Stub><SVGButton {...props} /></Stub>);
  });

  it('calls the callback on click', () => {
    const button = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    TestUtils.Simulate.click(button);
    expect(clicked).toBeTruthy();
  });
});
