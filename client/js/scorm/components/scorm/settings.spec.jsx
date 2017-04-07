/* global describe beforeEach it expect */

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Settings         from './settings';
import HoverButton      from '../common/hover_button';
import Stub             from '../../../../specs_support/stub';
import AssignmentButton from './assignment_button';

describe('settings', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      handlePreview: () => {},
      handleUpdate: () => {},
      handleRemove: () => {},
      hideModal: () => {},
      showModal: () => {},
    };
  });

  it('renders the package buttons', () => {
    result = TestUtils.renderIntoDocument(<Stub><Settings {...props} /></Stub>);
    const buttons = TestUtils.scryRenderedComponentsWithType(result, HoverButton);
    expect(buttons.length).toBe(3);
  });

  it('renders the assignment button when passed in props', () => {
    const assignmentButtonProps = {
      canvasUrl: 'canvasorother',
      courseId: '12345',
      lms_assignment_id: 54321,
    };
    props.assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
    result = TestUtils.renderIntoDocument(<Stub><Settings {...props} /></Stub>);
    const buttons = TestUtils.scryRenderedComponentsWithType(result, HoverButton);
    expect(buttons.length).toBe(4);
  });
});
