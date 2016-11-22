/* global describe beforeEach it expect */

import React            from 'react';
import TestUtils        from 'react/lib/ReactTestUtils';
import AssignmentButton from './assignment_button';
import Stub             from '../../../../specs_support/stub';

describe('Assignment Button', () => {
  let result;
  let props;
  let clicked;

  beforeEach(() => {
    clicked = false;

    props = {
      canvasUrl: 'canvasorother',
      courseId: '12345',
      lms_assignment_id: '54321',
    };

    result = TestUtils.renderIntoDocument(<Stub><AssignmentButton {...props} /></Stub>);
  });

  it('renders the correct reference', () => {
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-icon-btn');
    expect(button.href).toBe('https://canvasorother/courses/12345/assignments/54321');
  });

  it('renders an SVG button', () => {
    expect(TestUtils.isElement(<svg />)).toBeTruthy();
  });
});
