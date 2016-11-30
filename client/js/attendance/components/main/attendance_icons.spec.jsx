import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import Stub from '../../../../specs_support/stub';
import { AbsentIcon, PresentIcon, LateIcon } from './attendance_icons';

describe('attendance icons', () => {
  it('should render the absent icon', () => {
    const result = TestUtils.renderIntoDocument(<Stub><AbsentIcon /></Stub>);
    const paths = TestUtils.scryRenderedDOMComponentsWithTag(result, 'path');
    expect(paths.length).toBe(2);
  });

  it('should render the late icon', () => {
    const result = TestUtils.renderIntoDocument(<Stub><LateIcon /></Stub>);
    const paths = TestUtils.scryRenderedDOMComponentsWithTag(result, 'path');
    expect(paths.length).toBe(3);
  });

  it('should render the present icon', () => {
    const result = TestUtils.renderIntoDocument(<Stub><PresentIcon /></Stub>);
    const paths = TestUtils.scryRenderedDOMComponentsWithTag(result, 'path');
    expect(paths.length).toBe(3);
  });
});
