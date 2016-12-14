/* global describe beforeEach it expect */

import React      from 'react';
import TestUtils  from 'react/lib/ReactTestUtils';
import { Course } from './course';

describe('course', () => {
  let props, result, remove, target;

  beforeEach(() => {
    props = {
      course: {
        title: 'IMASPEC',
        fetching: false,
        is_graded: 'GRADED',
        lms_assignment_id: 1,
      },
      removePackage: () => { remove = true; },
      importPackage: () => { remove = true; },
      previewPackage: () => { remove = true; },
      updateImportType: () => { remove = true; },
      onClick: () => {},
      canvasUrl: 'www.canvas.com',
      courseId: '7',
    }
    remove = false;
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

  it('preview handleClick calls handlePreview', () => {
    expect(remove).toBeFalsy();
    let btn = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(btn[1]);
    expect(remove).toBeTruthy();
  });

  it('delete handleClick calls handleRemove', () => {
    expect(remove).toBeFalsy();
    let btn = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    TestUtils.Simulate.click(btn[2]);
    expect(remove).toBeTruthy();
  });

  it('verifies that ImportTypeSelector handleGoClick calls handleGoClick function', () => {
    props.course.lms_assignment_id = undefined;
    result = TestUtils.renderIntoDocument(<Course {...props} />);
    expect(remove).toBeFalsy();
    let btn = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-btn--go');
    TestUtils.Simulate.click(btn[0]);
    expect(remove).toBeTruthy();
  });

  it('verifies that ImportTypeSelector handleImportType function is called by handleImportType with proper select value', () => {
    props.course.lms_assignment_id = undefined;
    result = TestUtils.renderIntoDocument(<Course {...props} />);
    let selector = TestUtils.findRenderedDOMComponentWithTag(result, 'select');
    TestUtils.Simulate.change(selector, {target: {value: 'Graded Assignment'}});
    expect(remove).toBeTruthy();
    TestUtils.Simulate.change(selector, {target: {value: 'Ungraded Assignment'}});
    expect(remove).toBeTruthy();
  });

});
