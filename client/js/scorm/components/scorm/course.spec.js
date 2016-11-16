/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import { Course } from './course';

describe('course', () => {
  let props, result, remove;

  beforeEach(() => {
    props = {
      course: {
        title: 'IMASPEC',
        fetching: false,
        is_graded: 'GRADED',
        lms_assignment_id: 1
      },
      removePackage: () => {},
      importPackage: () => {},
      previewPackage: () => {}
    }
    result = TestUtils.renderIntoDocument(<Course {...props}/>);
  });

  it('should check the course title', () => {
    let title = TestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__title');
    expect(title.textContent).toContain('IMASPEC');
  });

  it('should verify that Loader is rendered when course.fetching is true', () => {
    let loader = TestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(0);
    props.course.fetching = true;
    result = TestUtils.renderIntoDocument(<Course {...props} />);
    loader = TestUtils.scryRenderedDOMComponentsWithClass(result, 'loader');
    expect(loader.length).toBe(1);
  });

  it('renders Graded Assigment when assignment exists and is a graded assignment', () => {
    let itemType = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-list-item__type');
    expect(itemType.length).toBe(1);
    let itemTypeText = TestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__type');
    let dropDown = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(0);
    expect(itemTypeText.textContent).toContain('Graded Assignment');
  });

  it('renders Ungraded Assignment when assignment exists and is an ungraded assignment', () => {
    props.course.is_graded = 'UNGRADED';
    result = TestUtils.renderIntoDocument(<Course {...props} />);
    let itemTypeText = TestUtils.findRenderedDOMComponentWithClass(result, 'c-list-item__type');
    let dropDown = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(0);
    expect(itemTypeText.textContent).toContain('Ungraded Assignment');
  });

  it('renders ImportTypeSelector component when isAssignment is not true', () => {
    props.course.lms_assignment_id = undefined;
    result = TestUtils.renderIntoDocument(<Course {...props} />);
    let dropDown = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-dropdown');
    expect(dropDown.length).toBe(1);
  });

});
