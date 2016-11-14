/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import Course from './course';

describe('course', () => {
  let props, result, remove;

  beforeEach(() => {
    props = {
      course: {title: 'IMASPEC', id: 1, lms_assignment_id: 1},
      importPackage: () => {},
      previewPackage: () => {remove = true},
      removePackage: () => {remove = true}
    }
    remove = false;
    result = TestUtils.renderIntoDocument(<Course {...props}/>);
  });

  it('should handle setting the state of isGoBtnActive', () => {
  	expect(result.state.isGoBtnActive).toBeFalsy();
    const selection = TestUtils.findRenderedDOMComponentWithTag(result, 'select');
    TestUtils.Simulate.change(selection, {target: {value: 1}})
    expect(result.state.isGoBtnActive).toBeTruthy();
  });

  it('should handle setting the state isGradeActive', () => {
    expect(result.state.isGradeActive).toBeFalsy();
    result.setState({ isGoBtnActive: true});
    const button = TestUtils.findRenderedDOMComponentWithClass(result, 'c-btn--go');
    TestUtils.Simulate.click(button);
    expect(result.state.isGradeActive).toBeTruthy();
  });

  it('renders dropdownSection as select Tag when isGradeActive is false', () => {
    let selection = TestUtils.scryRenderedDOMComponentsWithTag(result, 'select');
    expect(selection.length).toBe(1);
    result.setState({ isGradeActive: true });
    selection = TestUtils.scryRenderedDOMComponentsWithTag(result, 'select');
    let selectionDiv = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__type');
    const button = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    expect(selection.length).toBe(0);
    expect(selectionDiv.length).toBe(1);
    expect(button.length).toBe(3);
  });

  it('delete button calls its callback', () => {
    expect(remove).toBeFalsy();
    const button = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(button[button.length - 1]);
    expect(remove).toBeTruthy();
  });

  it('preview button calls its callback', () => {
    expect(remove).toBeFalsy();
    const button = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(button[button.length - 2]);
    expect(remove).toBeTruthy();
  });

});